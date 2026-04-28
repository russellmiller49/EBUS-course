from __future__ import annotations

import importlib.util
import json
from pathlib import Path
from types import SimpleNamespace

from PIL import Image


TOOL_ROOT = Path(__file__).resolve().parents[1]
SCRIPT_PATH = TOOL_ROOT / "scripts" / "export_course_case.py"


def _load_export_module():
    spec = importlib.util.spec_from_file_location("course_export", SCRIPT_PATH)
    assert spec is not None
    assert spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_snapshot_file_name_is_stable_for_preset_keys():
    module = _load_export_module()

    assert module.snapshot_file_name("station_7_node_a::rms") == "station_7_node_a__rms.json"
    assert module.bmode_snapshot_image_file_name("station_7_node_a::rms") == "station_7_node_a__rms.png"
    assert module.bmode_snapshot_metadata_file_name("station_7_node_a::rms") == "station_7_node_a__rms.json"
    assert module.ct_snapshot_image_file_name("station_7_node_a::rms") == "station_7_node_a__rms.png"
    assert module.ct_snapshot_metadata_file_name("station_7_node_a::rms") == "station_7_node_a__rms.json"
    assert module.cut_plane_ct_snapshot_image_file_name("station_7_node_a::rms") == "station_7_node_a__rms.png"
    assert module.cut_plane_ct_snapshot_metadata_file_name("station_7_node_a::rms") == "station_7_node_a__rms.json"
    assert module.deterministic_bmode_seed("station_7_node_a::rms") == module.deterministic_bmode_seed(
        "station_7_node_a::rms"
    )


def test_course_export_writes_static_manifest_without_runtime_api(tmp_path):
    module = _load_export_module()
    output_dir = tmp_path / "case-001"

    module.export_course_case(
        manifest_path=TOOL_ROOT / "configs" / "3d_slicer_files.yaml",
        output_dir=output_dir,
        clean_model_dir=TOOL_ROOT.parents[1] / "model",
        scope_model_path=TOOL_ROOT / "model" / "EBUS_tip.glb",
        preset_keys=None,
        skip_snapshots=True,
        skip_bmode=True,
        skip_ct_snapshots=True,
        skip_cut_plane_ct=True,
    )

    manifest_path = output_dir / "case_manifest.web.json"
    assert manifest_path.exists()
    assert (output_dir / "geometry" / "airway_mesh.json").exists()
    assert (output_dir / "models" / "device" / "EBUS_tip.glb").exists()


def test_course_export_writes_bmode_snapshots_for_every_preset(tmp_path, monkeypatch):
    module = _load_export_module()
    output_dir = tmp_path / "case-001"

    def fake_render_preset(*_args, output_path, metadata_path, **_kwargs):
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)
        Path(metadata_path).parent.mkdir(parents=True, exist_ok=True)
        Image.new("RGB", (8, 8), color=(24, 24, 24)).save(output_path)
        Path(metadata_path).write_text('{"engine": "physics", "engine_version": "physics-v1"}')
        return SimpleNamespace(
            metadata=SimpleNamespace(
                image_size=[8, 8],
                engine=_kwargs.get("engine", "physics"),
                engine_version="physics-v1" if _kwargs.get("engine", "physics") == "physics" else "localizer-v1",
                view_kind="physics_bmode" if _kwargs.get("engine", "physics") == "physics" else "localizer_virtual",
                contact_world=[0, 0, 0],
                device_axes={
                    "nUS": [1, 0, 0],
                    "nB": [0, 1, 0],
                    "nC": [0, 0, 1],
                },
                slice_thickness_mm=4,
            )
        )

    monkeypatch.setattr(module, "render_preset", fake_render_preset)

    def fake_render_wide_cut_plane_ct_snapshot(
        _context,
        render_metadata,
        *,
        output_path,
        metadata_path,
        manifest_path,
        image_relative_path,
        metadata_relative_path,
        calibration_points_lps=None,
    ):
        Image.new("RGB", (8, 8), color=(42, 42, 42)).save(output_path)
        metadata = {
            "image": image_relative_path,
            "metadata": metadata_relative_path,
            "image_size": [8, 8],
            "manifest_path": module.public_metadata_path(manifest_path),
            "engine": "localizer",
            "engine_version": render_metadata.engine_version,
            "view_kind": "wide_ct_cut_plane",
            "coordinate_frame": "web_xyz_mm_from_lps",
            "plane_center": [0, 0, 0],
            "x_axis": [1, 0, 0],
            "y_axis": [0, 1, 0],
            "plane_normal": [0, 0, 1],
            "x_range_mm": [-50, 90],
            "y_range_mm": [-70, 70],
            "y_axis_anatomical_direction": "cephalic",
            "calibration_points": [],
        }
        Path(metadata_path).write_text(json.dumps(metadata))
        return metadata

    monkeypatch.setattr(module, "render_wide_cut_plane_ct_snapshot", fake_render_wide_cut_plane_ct_snapshot)

    module.export_course_case(
        manifest_path=TOOL_ROOT / "configs" / "3d_slicer_files.yaml",
        output_dir=output_dir,
        clean_model_dir=TOOL_ROOT.parents[1] / "model",
        scope_model_path=TOOL_ROOT / "model" / "EBUS_tip.glb",
        preset_keys=None,
        skip_snapshots=True,
    )

    manifest = json.loads((output_dir / "case_manifest.web.json").read_text())
    refs = manifest["sector_bmode_snapshots"]
    ct_refs = manifest["sector_ct_snapshots"]
    cut_plane_refs = manifest["cut_plane_ct_snapshots"]

    assert len(refs) == len(manifest["presets"])
    assert len(ct_refs) == len(manifest["presets"])
    assert len(cut_plane_refs) == len(manifest["presets"])
    for preset in manifest["presets"]:
        ref = refs[preset["preset_key"]]
        ct_ref = ct_refs[preset["preset_key"]]
        cut_plane_ref = cut_plane_refs[preset["preset_key"]]
        image_path = output_dir / ref["image"]
        metadata_path = output_dir / ref["metadata"]
        ct_image_path = output_dir / ct_ref["image"]
        ct_metadata_path = output_dir / ct_ref["metadata"]
        cut_plane_image_path = output_dir / cut_plane_ref["image"]
        cut_plane_metadata_path = output_dir / cut_plane_ref["metadata"]

        assert image_path.exists()
        assert metadata_path.exists()
        assert ref["image_size"] == [8, 8]
        assert ref["engine"] == "physics"
        assert ref["engine_version"] == "physics-v1"
        metadata = json.loads(metadata_path.read_text())
        assert metadata["output_path"] == ref["image"]
        assert metadata["metadata_path"] == ref["metadata"]
        assert not metadata["manifest_path"].startswith("/")
        with Image.open(image_path) as image:
            assert image.size == (8, 8)
        assert ct_image_path.exists()
        assert ct_metadata_path.exists()
        assert ct_ref["image_size"] == [8, 8]
        assert ct_ref["engine"] == "localizer"
        assert ct_ref["engine_version"] == "localizer-v1"
        assert ct_ref["view_kind"] == "localizer_virtual"
        ct_metadata = json.loads(ct_metadata_path.read_text())
        assert ct_metadata["output_path"] == ct_ref["image"]
        assert ct_metadata["metadata_path"] == ct_ref["metadata"]
        assert not ct_metadata["manifest_path"].startswith("/")
        with Image.open(ct_image_path) as image:
            assert image.size == (8, 8)
        assert cut_plane_image_path.exists()
        assert cut_plane_metadata_path.exists()
        assert cut_plane_ref["image_size"] == [8, 8]
        assert cut_plane_ref["engine"] == "localizer"
        assert cut_plane_ref["engine_version"] == "localizer-v1"
        assert cut_plane_ref["view_kind"] == "wide_ct_cut_plane"
        assert cut_plane_ref["coordinate_frame"] == "web_xyz_mm_from_lps"
        assert cut_plane_ref["x_range_mm"] == [-50, 90]
        assert cut_plane_ref["y_range_mm"] == [-70, 70]
        assert cut_plane_ref["y_axis_anatomical_direction"] == "cephalic"
        assert cut_plane_ref["calibration_points"] == []
        cut_plane_metadata = json.loads(cut_plane_metadata_path.read_text())
        assert cut_plane_metadata["image"] == cut_plane_ref["image"]
        assert cut_plane_metadata["metadata"] == cut_plane_ref["metadata"]
        assert not cut_plane_metadata["manifest_path"].startswith("/")
        with Image.open(cut_plane_image_path) as image:
            assert image.size == (8, 8)
