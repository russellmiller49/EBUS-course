from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import shutil
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw


SCRIPT_PATH = Path(__file__).resolve()
TOOL_ROOT = SCRIPT_PATH.parents[1]
COURSE_ROOT = SCRIPT_PATH.parents[3]
SOURCE_ROOT = TOOL_ROOT / "src"

if str(SOURCE_ROOT) not in sys.path:
    sys.path.insert(0, str(SOURCE_ROOT))

os.environ["REPO_ROOT"] = str(TOOL_ROOT)

from ebus_simulator.centerline import CenterlinePolyline
from ebus_simulator.io.mrkjson import load_first_defined_control_point
from ebus_simulator.rendering import _cephalic_display_axis_lps, _sample_plane, _window_ct, build_render_context, render_preset
from ebus_simulator.web_navigation import lps_to_web
from ebus_simulator.web_case_export import export_web_case
from ebus_simulator.web_navigation import preset_navigation_entries
from ebus_simulator.web_volume_intersections import (
    DEFAULT_DEPTH_SAMPLES,
    DEFAULT_LATERAL_SAMPLES,
    DEFAULT_SLAB_HALF_THICKNESS_MM,
    DEFAULT_SLAB_SAMPLES,
    build_volume_sector_response,
)


DEFAULT_MANIFEST = TOOL_ROOT / "configs" / "3d_slicer_files.yaml"
DEFAULT_OUTPUT_DIR = COURSE_ROOT / "apps" / "web" / "public" / "simulator" / "case-001"
DEFAULT_CLEAN_MODEL_DIR = COURSE_ROOT / "model"
DEFAULT_SCOPE_MODEL = TOOL_ROOT / "model" / "EBUS_tip.glb"
DEFAULT_CARINA_MARKUP = COURSE_ROOT / "model" / "markups" / "carina.mrk.json"
BMODE_SPECKLE_STRENGTH = 0.22
BMODE_REVERBERATION_STRENGTH = 0.28
BMODE_SHADOW_STRENGTH = 0.47
BMODE_PHYSICS_PROFILE = "review_realistic_v1"
CUT_PLANE_CT_BACK_MM = 50.0
CUT_PLANE_CT_FORWARD_MM = 90.0
CUT_PLANE_CT_HALF_HEIGHT_MM = 70.0
CUT_PLANE_CT_IMAGE_SIZE = 768


def snapshot_file_stem(preset_key: str) -> str:
    return re.sub(r"[^A-Za-z0-9_-]+", "__", preset_key).strip("_")


def snapshot_file_name(preset_key: str) -> str:
    return f"{snapshot_file_stem(preset_key)}.json"


def bmode_snapshot_image_file_name(preset_key: str) -> str:
    return f"{snapshot_file_stem(preset_key)}.png"


def bmode_snapshot_metadata_file_name(preset_key: str) -> str:
    return f"{snapshot_file_stem(preset_key)}.json"


def ct_snapshot_image_file_name(preset_key: str) -> str:
    return f"{snapshot_file_stem(preset_key)}.png"


def ct_snapshot_metadata_file_name(preset_key: str) -> str:
    return f"{snapshot_file_stem(preset_key)}.json"


def cut_plane_ct_snapshot_image_file_name(preset_key: str) -> str:
    return f"{snapshot_file_stem(preset_key)}.png"


def cut_plane_ct_snapshot_metadata_file_name(preset_key: str) -> str:
    return f"{snapshot_file_stem(preset_key)}.json"


def deterministic_bmode_seed(preset_key: str) -> int:
    digest = hashlib.sha256(preset_key.encode("utf-8")).digest()
    return int.from_bytes(digest[:4], byteorder="big", signed=False)


def lps_vector_to_web(vector_lps: np.ndarray) -> list[float]:
    return lps_to_web(np.asarray(vector_lps, dtype=np.float64))


def load_calibration_points_lps() -> dict[str, dict[str, object]]:
    if not DEFAULT_CARINA_MARKUP.exists():
        return {}

    carina = load_first_defined_control_point(DEFAULT_CARINA_MARKUP)
    return {
        "main_carina": {
            "key": "main_carina",
            "label": "Main carina",
            "world_lps": np.asarray(carina.position_lps, dtype=np.float64),
        }
    }


def plane_point_to_pixel(
    x_mm: float,
    y_mm: float,
    *,
    x_min_mm: float,
    x_max_mm: float,
    y_min_mm: float,
    y_max_mm: float,
    width: int,
    height: int,
) -> tuple[int, int]:
    column = int(round((x_mm - x_min_mm) / max(x_max_mm - x_min_mm, 1e-6) * (width - 1)))
    row = int(round((y_max_mm - y_mm) / max(y_max_mm - y_min_mm, 1e-6) * (height - 1)))
    return row, column


def draw_calibration_markers(image: Image.Image, calibration_points: list[dict[str, object]]) -> None:
    draw = ImageDraw.Draw(image)

    for point in calibration_points:
        if not point.get("visible"):
            continue

        pixel = point.get("pixel")
        if not isinstance(pixel, list) or len(pixel) != 2:
            continue

        column = int(pixel[0])
        row = int(pixel[1])
        marker_color = (255, 225, 74)
        shadow_color = (0, 0, 0)
        radius = 12

        draw.line((column - radius, row, column + radius, row), fill=shadow_color, width=5)
        draw.line((column, row - radius, column, row + radius), fill=shadow_color, width=5)
        draw.line((column - radius, row, column + radius, row), fill=marker_color, width=2)
        draw.line((column, row - radius, column, row + radius), fill=marker_color, width=2)
        draw.ellipse((column - 5, row - 5, column + 5, row + 5), outline=marker_color, width=2)


def load_json(path: Path) -> dict[str, object]:
    return json.loads(path.read_text())


def write_json(path: Path, payload: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n")


def public_metadata_path(path: Path) -> str:
    try:
        return path.resolve().relative_to(COURSE_ROOT).as_posix()
    except ValueError:
        return path.name


def sanitize_public_render_metadata(
    metadata_path: Path,
    *,
    manifest_path: Path,
    image_relative_path: str,
    metadata_relative_path: str,
    training_use: str,
) -> None:
    metadata = load_json(metadata_path)
    metadata["manifest_path"] = public_metadata_path(manifest_path)
    metadata["output_path"] = image_relative_path
    metadata["metadata_path"] = metadata_relative_path
    metadata["training_use"] = training_use
    write_json(metadata_path, metadata)


def centerlines_from_context(context: object) -> dict[int, CenterlinePolyline]:
    return {int(polyline.line_index): polyline for polyline in context.main_graph.polylines}


def generate_sector_snapshots(
    manifest_path: Path,
    output_dir: Path,
    *,
    preset_keys: set[str] | None = None,
) -> dict[str, str]:
    context = build_render_context(manifest_path)
    centerlines = centerlines_from_context(context)
    presets = preset_navigation_entries(context)
    web_manifest_path = output_dir / "case_manifest.web.json"
    web_manifest = load_json(web_manifest_path)

    defaults = web_manifest.get("render_defaults", {})
    default_depth = float(defaults.get("max_depth_mm", 40.0)) if isinstance(defaults, dict) else 40.0
    default_sector = float(defaults.get("sector_angle_deg", 60.0)) if isinstance(defaults, dict) else 60.0
    default_roll = float(defaults.get("roll_deg", 0.0)) if isinstance(defaults, dict) else 0.0

    assets = web_manifest.get("assets", {})
    station_keys = [
        str(asset.get("key"))
        for asset in (assets.get("stations", []) if isinstance(assets, dict) else [])
        if isinstance(asset, dict) and asset.get("key")
    ]
    vessel_keys = [
        str(asset.get("key"))
        for asset in (assets.get("vessels", []) if isinstance(assets, dict) else [])
        if isinstance(asset, dict) and asset.get("key")
    ]
    color_map = web_manifest.get("color_map", {})
    resolved_color_map = color_map if isinstance(color_map, dict) else {}

    snapshot_dir = output_dir / "sector_snapshots"
    snapshot_dir.mkdir(parents=True, exist_ok=True)
    snapshot_refs: dict[str, str] = {}
    for preset in presets:
        if preset_keys is not None and preset.preset_key not in preset_keys:
            continue

        response = build_volume_sector_response(
            context,
            centerlines_by_index=centerlines,
            preset=preset,
            line_index=int(preset.line_index),
            centerline_s_mm=float(preset.centerline_s_mm),
            roll_deg=default_roll,
            max_depth_mm=default_depth,
            sector_angle_deg=default_sector,
            station_keys=station_keys,
            vessel_keys=vessel_keys,
            color_map=resolved_color_map,
            depth_samples=DEFAULT_DEPTH_SAMPLES,
            lateral_samples=DEFAULT_LATERAL_SAMPLES,
            slab_half_thickness_mm=DEFAULT_SLAB_HALF_THICKNESS_MM,
            slab_samples=DEFAULT_SLAB_SAMPLES,
        )
        relative_path = f"sector_snapshots/{snapshot_file_name(preset.preset_key)}"
        write_json(
            output_dir / relative_path,
            {
                "schema_version": 1,
                "preset_key": preset.preset_key,
                "query": {
                    "line_index": int(preset.line_index),
                    "s_mm": float(preset.centerline_s_mm),
                    "roll_deg": default_roll,
                    "max_depth_mm": default_depth,
                    "sector_angle_deg": default_sector,
                },
                "response": response,
            },
        )
        snapshot_refs[preset.preset_key] = relative_path

    return snapshot_refs


def generate_sector_bmode_snapshots(
    manifest_path: Path,
    output_dir: Path,
    *,
    preset_keys: set[str] | None = None,
) -> dict[str, dict[str, object]]:
    context = build_render_context(manifest_path)
    presets = preset_navigation_entries(context)
    bmode_dir = output_dir / "sector_bmode"
    bmode_dir.mkdir(parents=True, exist_ok=True)

    snapshot_refs: dict[str, dict[str, object]] = {}
    for preset in presets:
        if preset_keys is not None and preset.preset_key not in preset_keys:
            continue

        image_relative_path = f"sector_bmode/{bmode_snapshot_image_file_name(preset.preset_key)}"
        metadata_relative_path = f"sector_bmode/{bmode_snapshot_metadata_file_name(preset.preset_key)}"
        rendered = render_preset(
            manifest_path,
            preset.preset_id,
            approach=preset.approach,
            output_path=output_dir / image_relative_path,
            metadata_path=output_dir / metadata_relative_path,
            engine="physics",
            seed=deterministic_bmode_seed(preset.preset_key),
            mode="clean",
            airway_overlay=False,
            airway_lumen_overlay=False,
            airway_wall_overlay=False,
            target_overlay=False,
            contact_overlay=False,
            station_overlay=False,
            vessel_overlay_names=[],
            virtual_ebus=False,
            simulated_ebus=True,
            show_legend=False,
            label_overlays=False,
            speckle_strength=BMODE_SPECKLE_STRENGTH,
            reverberation_strength=BMODE_REVERBERATION_STRENGTH,
            shadow_strength=BMODE_SHADOW_STRENGTH,
            physics_profile=BMODE_PHYSICS_PROFILE,
            context=context,
        )
        sanitize_public_render_metadata(
            output_dir / metadata_relative_path,
            manifest_path=manifest_path,
            image_relative_path=image_relative_path,
            metadata_relative_path=metadata_relative_path,
            training_use="CT-derived simulated CP-EBUS B-mode for orientation training; not clinically validated.",
        )
        snapshot_refs[preset.preset_key] = {
            "image": image_relative_path,
            "metadata": metadata_relative_path,
            "image_size": [int(value) for value in rendered.metadata.image_size],
            "engine": rendered.metadata.engine,
            "engine_version": rendered.metadata.engine_version,
        }

    return snapshot_refs


def generate_sector_ct_snapshots(
    manifest_path: Path,
    output_dir: Path,
    *,
    preset_keys: set[str] | None = None,
) -> dict[str, dict[str, object]]:
    context = build_render_context(manifest_path)
    presets = preset_navigation_entries(context)
    ct_dir = output_dir / "sector_ct"
    ct_dir.mkdir(parents=True, exist_ok=True)

    snapshot_refs: dict[str, dict[str, object]] = {}
    for preset in presets:
        if preset_keys is not None and preset.preset_key not in preset_keys:
            continue

        image_relative_path = f"sector_ct/{ct_snapshot_image_file_name(preset.preset_key)}"
        metadata_relative_path = f"sector_ct/{ct_snapshot_metadata_file_name(preset.preset_key)}"
        rendered = render_preset(
            manifest_path,
            preset.preset_id,
            approach=preset.approach,
            output_path=output_dir / image_relative_path,
            metadata_path=output_dir / metadata_relative_path,
            engine="localizer",
            mode="clean",
            airway_overlay=False,
            airway_lumen_overlay=False,
            airway_wall_overlay=False,
            target_overlay=False,
            contact_overlay=False,
            station_overlay=False,
            vessel_overlay_names=[],
            virtual_ebus=True,
            simulated_ebus=False,
            show_legend=False,
            label_overlays=False,
            context=context,
        )
        sanitize_public_render_metadata(
            output_dir / metadata_relative_path,
            manifest_path=manifest_path,
            image_relative_path=image_relative_path,
            metadata_relative_path=metadata_relative_path,
            training_use=(
                "CT sampled in the CP-EBUS fan plane for orientation training; "
                "not clinically validated diagnostic ultrasound."
            ),
        )
        snapshot_refs[preset.preset_key] = {
            "image": image_relative_path,
            "metadata": metadata_relative_path,
            "image_size": [int(value) for value in rendered.metadata.image_size],
            "engine": rendered.metadata.engine,
            "engine_version": rendered.metadata.engine_version,
            "view_kind": rendered.metadata.view_kind,
        }

    return snapshot_refs


def render_wide_cut_plane_ct_snapshot(
    context: object,
    render_metadata: object,
    *,
    output_path: Path,
    metadata_path: Path,
    manifest_path: Path,
    image_relative_path: str,
    metadata_relative_path: str,
    calibration_points_lps: dict[str, dict[str, object]] | None = None,
) -> dict[str, object]:
    contact_world = np.asarray(render_metadata.contact_world, dtype=np.float64)
    depth_axis = np.asarray(render_metadata.device_axes["nUS"], dtype=np.float64)
    shaft_axis = np.asarray(render_metadata.device_axes["nB"], dtype=np.float64)
    depth_axis = depth_axis / max(float(np.linalg.norm(depth_axis)), 1e-9)
    shaft_axis = shaft_axis / max(float(np.linalg.norm(shaft_axis)), 1e-9)
    display_axis = _cephalic_display_axis_lps(shaft_axis)
    plane_normal = np.cross(display_axis, depth_axis)
    plane_normal = plane_normal / max(float(np.linalg.norm(plane_normal)), 1e-9)
    x_range_mm = [-CUT_PLANE_CT_BACK_MM, CUT_PLANE_CT_FORWARD_MM]
    y_range_mm = [-CUT_PLANE_CT_HALF_HEIGHT_MM, CUT_PLANE_CT_HALF_HEIGHT_MM]

    ct_samples, _, _, _ = _sample_plane(
        context,
        x_axis=depth_axis,
        y_axis=display_axis,
        thickness_axis=plane_normal,
        center_world=contact_world,
        x_min_mm=x_range_mm[0],
        x_max_mm=x_range_mm[1],
        y_min_mm=y_range_mm[0],
        y_max_mm=y_range_mm[1],
        width=CUT_PLANE_CT_IMAGE_SIZE,
        height=CUT_PLANE_CT_IMAGE_SIZE,
        slice_thickness_mm=float(render_metadata.slice_thickness_mm),
        order=1,
        cval=-1000.0,
        data=np.asarray(context.ct_volume.data, dtype=np.float32),
        inverse_affine_lps=context.ct_volume.inverse_affine_lps,
    )
    ct_window = _window_ct(
        ct_samples.reshape(-1),
        gain=1.0,
        attenuation=0.0,
        depths_mm=np.zeros(CUT_PLANE_CT_IMAGE_SIZE * CUT_PLANE_CT_IMAGE_SIZE, dtype=np.float32),
        max_depth_mm=max(CUT_PLANE_CT_FORWARD_MM + CUT_PLANE_CT_BACK_MM, 1.0),
    ).reshape((CUT_PLANE_CT_IMAGE_SIZE, CUT_PLANE_CT_IMAGE_SIZE))
    image_rgb = np.repeat(ct_window[:, :, None], 3, axis=2)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    calibration_points: list[dict[str, object]] = []
    for calibration in (calibration_points_lps or {}).values():
        world_lps = np.asarray(calibration["world_lps"], dtype=np.float64)
        offset = world_lps - contact_world
        x_mm = float(np.dot(offset, depth_axis))
        y_mm = float(np.dot(offset, display_axis))
        out_of_plane_mm = float(np.dot(offset, plane_normal))
        row, column = plane_point_to_pixel(
            x_mm,
            y_mm,
            x_min_mm=x_range_mm[0],
            x_max_mm=x_range_mm[1],
            y_min_mm=y_range_mm[0],
            y_max_mm=y_range_mm[1],
            width=CUT_PLANE_CT_IMAGE_SIZE,
            height=CUT_PLANE_CT_IMAGE_SIZE,
        )
        visible = (
            x_range_mm[0] <= x_mm <= x_range_mm[1]
            and y_range_mm[0] <= y_mm <= y_range_mm[1]
            and 0 <= row < CUT_PLANE_CT_IMAGE_SIZE
            and 0 <= column < CUT_PLANE_CT_IMAGE_SIZE
        )
        calibration_points.append(
            {
                "key": str(calibration["key"]),
                "label": str(calibration["label"]),
                "world": lps_vector_to_web(world_lps),
                "world_lps": [float(value) for value in world_lps.tolist()],
                "plane_mm": [x_mm, y_mm],
                "out_of_plane_mm": out_of_plane_mm,
                "near_plane": abs(out_of_plane_mm) <= float(render_metadata.slice_thickness_mm),
                "visible": bool(visible),
                "pixel": [column, row],
            }
        )

    image = Image.fromarray((image_rgb * 255.0).clip(0, 255).astype(np.uint8), mode="RGB")
    draw_calibration_markers(image, calibration_points)
    image.save(output_path)

    metadata = {
        "schema_version": 1,
        "image": image_relative_path,
        "metadata": metadata_relative_path,
        "image_size": [CUT_PLANE_CT_IMAGE_SIZE, CUT_PLANE_CT_IMAGE_SIZE],
        "manifest_path": public_metadata_path(manifest_path),
        "engine": "localizer",
        "engine_version": render_metadata.engine_version,
        "view_kind": "wide_ct_cut_plane",
        "source_view_kind": render_metadata.view_kind,
        "coordinate_frame": "web_xyz_mm_from_lps",
        "source_coordinate_frame": "LPS_mm",
        "plane_center": lps_vector_to_web(contact_world),
        "x_axis": lps_vector_to_web(depth_axis),
        "y_axis": lps_vector_to_web(display_axis),
        "plane_normal": lps_vector_to_web(plane_normal),
        "plane_center_lps": [float(value) for value in contact_world.tolist()],
        "x_axis_lps": [float(value) for value in depth_axis.tolist()],
        "y_axis_lps": [float(value) for value in display_axis.tolist()],
        "raw_shaft_axis_lps": [float(value) for value in shaft_axis.tolist()],
        "display_lateral_axis_lps": [float(value) for value in display_axis.tolist()],
        "y_axis_anatomical_direction": "cephalic",
        "plane_normal_lps": [float(value) for value in plane_normal.tolist()],
        "x_range_mm": x_range_mm,
        "y_range_mm": y_range_mm,
        "calibration_points": calibration_points,
        "slice_thickness_mm": float(render_metadata.slice_thickness_mm),
        "training_use": (
            "Wide CT cut through the CP-EBUS fan plane for troubleshooting orientation; "
            "not clinically validated diagnostic ultrasound."
        ),
    }
    write_json(metadata_path, metadata)
    return metadata


def generate_cut_plane_ct_snapshots(
    manifest_path: Path,
    output_dir: Path,
    *,
    preset_keys: set[str] | None = None,
) -> dict[str, dict[str, object]]:
    context = build_render_context(manifest_path)
    presets = preset_navigation_entries(context)
    calibration_points_lps = load_calibration_points_lps()
    output_subdir = output_dir / "cut_plane_ct"
    output_subdir.mkdir(parents=True, exist_ok=True)

    snapshot_refs: dict[str, dict[str, object]] = {}
    for preset in presets:
        if preset_keys is not None and preset.preset_key not in preset_keys:
            continue

        image_relative_path = f"cut_plane_ct/{cut_plane_ct_snapshot_image_file_name(preset.preset_key)}"
        metadata_relative_path = f"cut_plane_ct/{cut_plane_ct_snapshot_metadata_file_name(preset.preset_key)}"
        probe_render = render_preset(
            manifest_path,
            preset.preset_id,
            approach=preset.approach,
            output_path=output_dir / "_cut_plane_probe" / f"{snapshot_file_stem(preset.preset_key)}.png",
            metadata_path=output_dir / "_cut_plane_probe" / f"{snapshot_file_stem(preset.preset_key)}.json",
            engine="localizer",
            mode="clean",
            airway_overlay=False,
            airway_lumen_overlay=False,
            airway_wall_overlay=False,
            target_overlay=False,
            contact_overlay=False,
            station_overlay=False,
            vessel_overlay_names=[],
            virtual_ebus=True,
            simulated_ebus=False,
            show_legend=False,
            label_overlays=False,
            context=context,
        )
        metadata = render_wide_cut_plane_ct_snapshot(
            context,
            probe_render.metadata,
            output_path=output_dir / image_relative_path,
            metadata_path=output_dir / metadata_relative_path,
            manifest_path=manifest_path,
            image_relative_path=image_relative_path,
            metadata_relative_path=metadata_relative_path,
            calibration_points_lps=calibration_points_lps,
        )
        snapshot_refs[preset.preset_key] = {
            "image": image_relative_path,
            "metadata": metadata_relative_path,
            "image_size": metadata["image_size"],
            "engine": metadata["engine"],
            "engine_version": metadata["engine_version"],
            "view_kind": metadata["view_kind"],
            "coordinate_frame": metadata["coordinate_frame"],
            "plane_center": metadata["plane_center"],
            "x_axis": metadata["x_axis"],
            "y_axis": metadata["y_axis"],
            "plane_normal": metadata["plane_normal"],
            "x_range_mm": metadata["x_range_mm"],
            "y_range_mm": metadata["y_range_mm"],
            "y_axis_anatomical_direction": metadata["y_axis_anatomical_direction"],
            "calibration_points": metadata["calibration_points"],
        }

    shutil.rmtree(output_dir / "_cut_plane_probe", ignore_errors=True)
    return snapshot_refs


def export_course_case(
    *,
    manifest_path: Path,
    output_dir: Path,
    clean_model_dir: Path,
    scope_model_path: Path,
    preset_keys: set[str] | None,
    skip_snapshots: bool,
    skip_bmode: bool = False,
    skip_ct_snapshots: bool = False,
    skip_cut_plane_ct: bool = False,
) -> None:
    if output_dir.exists():
        shutil.rmtree(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    result = export_web_case(
        manifest_path,
        output_dir=output_dir,
        clean_model_dir=clean_model_dir,
        scope_model_path=scope_model_path,
    )
    snapshot_refs = {} if skip_snapshots else generate_sector_snapshots(manifest_path, output_dir, preset_keys=preset_keys)
    bmode_snapshot_refs = (
        {}
        if skip_bmode
        else generate_sector_bmode_snapshots(manifest_path, output_dir, preset_keys=preset_keys)
    )
    ct_snapshot_refs = (
        {}
        if skip_ct_snapshots
        else generate_sector_ct_snapshots(manifest_path, output_dir, preset_keys=preset_keys)
    )
    cut_plane_ct_refs = (
        {}
        if skip_cut_plane_ct
        else generate_cut_plane_ct_snapshots(manifest_path, output_dir, preset_keys=preset_keys)
    )

    manifest_asset_path = Path(result.manifest_path)
    web_manifest = load_json(manifest_asset_path)
    web_manifest["sector_snapshots"] = snapshot_refs
    web_manifest["sector_bmode_snapshots"] = bmode_snapshot_refs
    web_manifest["sector_ct_snapshots"] = ct_snapshot_refs
    web_manifest["cut_plane_ct_snapshots"] = cut_plane_ct_refs
    notes = web_manifest.setdefault("notes", {})
    if isinstance(notes, dict):
        notes["course_export"] = (
            "Static SoCal EBUS Prep learner asset. Sector snapshots are precomputed for station snaps; "
            "free navigation uses the browser point-cloud fallback."
        )
        notes["sector_bmode_snapshots"] = (
            "CT-derived simulated CP-EBUS B-mode images for orientation training only; "
            "not clinically validated diagnostic ultrasound."
        )
        notes["sector_ct_snapshots"] = (
            "CT sampled in the CP-EBUS fan plane for orientation training only; "
            "shown as a temporary ultrasound correlate and not clinically validated diagnostic ultrasound."
        )
        notes["cut_plane_ct_snapshots"] = (
            "Wide CT cuts through the CP-EBUS fan plane for troubleshooting plane orientation only; "
            "not clinically validated diagnostic ultrasound."
        )
    write_json(manifest_asset_path, web_manifest)

    print(f"web_case: {result.output_dir}")
    print(f"manifest: {result.manifest_path}")
    print(f"presets: {result.preset_count}")
    print(f"sector_snapshots: {len(snapshot_refs)}")
    print(f"sector_bmode_snapshots: {len(bmode_snapshot_refs)}")
    print(f"sector_ct_snapshots: {len(ct_snapshot_refs)}")
    print(f"cut_plane_ct_snapshots: {len(cut_plane_ct_refs)}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Export the static simulator case consumed by the SoCal EBUS Prep app.")
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIR)
    parser.add_argument("--clean-model-dir", type=Path, default=DEFAULT_CLEAN_MODEL_DIR)
    parser.add_argument("--scope-model", type=Path, default=DEFAULT_SCOPE_MODEL)
    parser.add_argument("--preset-key", action="append", default=None, help="Limit snapshot generation to one preset key. Repeatable.")
    parser.add_argument("--skip-snapshots", action="store_true", help="Skip volume-mask JSON sector snapshot generation.")
    parser.add_argument("--skip-bmode", action="store_true", help="Skip CT-derived B-mode PNG generation.")
    parser.add_argument("--skip-ct-snapshots", action="store_true", help="Skip CT fan-plane PNG generation.")
    parser.add_argument("--skip-cut-plane-ct", action="store_true", help="Skip wide CT cut-plane PNG generation.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    preset_keys = None if args.preset_key is None else {str(value) for value in args.preset_key}
    export_course_case(
        manifest_path=args.manifest.expanduser().resolve(),
        output_dir=args.output_dir.expanduser().resolve(),
        clean_model_dir=args.clean_model_dir.expanduser().resolve(),
        scope_model_path=args.scope_model.expanduser().resolve(),
        preset_keys=preset_keys,
        skip_snapshots=bool(args.skip_snapshots),
        skip_bmode=bool(args.skip_bmode),
        skip_ct_snapshots=bool(args.skip_ct_snapshots),
        skip_cut_plane_ct=bool(args.skip_cut_plane_ct),
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
