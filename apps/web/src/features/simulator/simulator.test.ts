import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import * as THREE from 'three';
import { describe, expect, it } from 'vitest';

import { simulatorCaseAssetUrl, simulatorManifestUrl } from './paths';
import { computeSimulatorPose, pointAtS, type SimulatorProbePose } from './pose';
import {
  resolveSimulatorSectorSource,
  shouldUseSnapshotSectorItems,
  simulatorSectorSourceLabel,
} from './sectorSource';
import { contourIsCloseable, hasUsableSectorContourGeometry } from './SectorView';
import {
  buildPlaneIntersectionRasterMask,
  buildPointCloudSectorItems,
  simulatorSceneStructureVisibilityItems,
} from './SimulatorPage';
import { normalizeSimulatorStationId } from './stationIds';
import type {
  SimulatorCaseManifest,
  SimulatorCenterlinePolyline,
  SimulatorLoadedAssets,
  SimulatorPreset,
  SimulatorSectorItem,
  SimulatorSectorSnapshot,
  Vec2,
  Vec3,
} from './types';

function readSimulatorJson<T>(path: string): T {
  return JSON.parse(readFileSync(resolve(process.cwd(), path), 'utf8')) as T;
}

function readCaseAsset<T>(assetPath: string): T {
  return readSimulatorJson<T>(`public/simulator/case-001/${assetPath}`);
}

function loadSimulatorFixture() {
  const manifest = readCaseAsset<SimulatorCaseManifest>('case_manifest.web.json');
  const assets: SimulatorLoadedAssets = {
    airway: readCaseAsset(manifest.assets.airway_mesh),
    centerlines: readCaseAsset(manifest.assets.centerlines),
    stations: Object.fromEntries(
      manifest.assets.stations.map((asset) => [asset.key, readCaseAsset(asset.asset)]),
    ),
    vessels: Object.fromEntries(
      manifest.assets.vessels.map((asset) => [asset.key, readCaseAsset(asset.asset)]),
    ),
  };

  return { assets, manifest };
}

function liveMaskedSectorItems(
  fixture: ReturnType<typeof loadSimulatorFixture>,
  presetKey: string,
  sOffsetMm: number,
  rollDeg = fixture.manifest.render_defaults.roll_deg,
) {
  const { assets, manifest } = fixture;
  const preset = manifest.presets.find((candidate) => candidate.preset_key === presetKey);
  expect(preset).toBeDefined();
  const polyline = assets.centerlines.polylines.find((candidate) => candidate.line_index === preset?.line_index);
  expect(polyline).toBeDefined();

  if (!preset || !polyline) {
    throw new Error(`Missing simulator fixture data for ${presetKey}`);
  }

  const movedSMm = preset.centerline_s_mm + sOffsetMm;
  const pose = computeSimulatorPose(polyline, movedSMm, rollDeg, preset);

  return buildPointCloudSectorItems({
    assets,
    caseData: manifest,
    lineIndex: polyline.line_index,
    pose,
    selectedPreset: preset,
    sMm: movedSMm,
  })
    .filter((item) => item.visible && item.rasterMask?.alpha.length);
}

function liveMaskedSectorIds(
  fixture: ReturnType<typeof loadSimulatorFixture>,
  presetKey: string,
  sOffsetMm: number,
  rollDeg = fixture.manifest.render_defaults.roll_deg,
) {
  return liveMaskedSectorItems(fixture, presetKey, sOffsetMm, rollDeg).map((item) => item.id);
}

function syntheticPlanePose(): SimulatorProbePose {
  return {
    position: new THREE.Vector3(0, 0, 0),
    tangent: new THREE.Vector3(0, 1, 0),
    depthAxis: new THREE.Vector3(0, 0, 1),
    lateralAxis: new THREE.Vector3(1, 0, 0),
  };
}

function sphereSurfacePoints(center: Vec3, radiusMm: number, rings = 16, segments = 32): Vec3[] {
  const points: Vec3[] = [];

  for (let ring = 1; ring < rings; ring += 1) {
    const phi = (ring / rings) * Math.PI;
    for (let segment = 0; segment < segments; segment += 1) {
      const theta = ((segment + 0.37) / segments) * Math.PI * 2;
      points.push([
        center[0] + radiusMm * Math.sin(phi) * Math.cos(theta),
        center[1] + radiusMm * Math.sin(phi) * Math.sin(theta),
        center[2] + radiusMm * Math.cos(phi),
      ]);
    }
  }

  return points;
}

function cylinderAlongYSurfacePoints({
  center,
  halfLengthMm,
  radiusMm,
  axialSamples = 20,
  radialSamples = 32,
}: {
  center: Vec3;
  halfLengthMm: number;
  radiusMm: number;
  axialSamples?: number;
  radialSamples?: number;
}): Vec3[] {
  const points: Vec3[] = [];

  for (let axial = 0; axial < axialSamples; axial += 1) {
    const y = center[1] - halfLengthMm + (2 * halfLengthMm * axial) / Math.max(axialSamples - 1, 1);
    for (let radial = 0; radial < radialSamples; radial += 1) {
      const theta = ((radial + 0.31) / radialSamples) * Math.PI * 2;
      points.push([
        center[0] + radiusMm * Math.cos(theta),
        y,
        center[2] + radiusMm * Math.sin(theta),
      ]);
    }
  }

  return points;
}

function pairedWallBandSurfacePoints({
  depthMm,
  halfBandGapMm,
  halfLengthMm,
  yHalfThicknessMm,
  samples = 18,
}: {
  depthMm: number;
  halfBandGapMm: number;
  halfLengthMm: number;
  yHalfThicknessMm: number;
  samples?: number;
}): Vec3[] {
  const points: Vec3[] = [];

  for (const z of [depthMm - halfBandGapMm, depthMm + halfBandGapMm]) {
    for (let index = 0; index < samples; index += 1) {
      const x = -halfLengthMm + (2 * halfLengthMm * index) / Math.max(samples - 1, 1);
      points.push([x, -yHalfThicknessMm, z]);
      points.push([x, yHalfThicknessMm, z]);
    }
  }

  return points;
}

function openDistalVesselSurfacePoints({
  bottomDepthMm,
  halfWidthMm,
  outOfPlaneHalfThicknessMm,
  topDepthMm,
  samples = 10,
}: {
  bottomDepthMm: number;
  halfWidthMm: number;
  outOfPlaneHalfThicknessMm: number;
  topDepthMm: number;
  samples?: number;
}): Vec3[] {
  const points: Vec3[] = [];
  const addPointPair = (lateralMm: number, depthMm: number) => {
    points.push([-outOfPlaneHalfThicknessMm, lateralMm, depthMm]);
    points.push([outOfPlaneHalfThicknessMm, lateralMm, depthMm]);
  };

  for (let index = 0; index < samples; index += 1) {
    const t = index / Math.max(samples - 1, 1);
    const z = topDepthMm + (bottomDepthMm - topDepthMm) * t;
    addPointPair(-halfWidthMm, z);
    addPointPair(halfWidthMm, z);
  }

  for (let index = 0; index < samples; index += 1) {
    const t = index / Math.max(samples - 1, 1);
    const x = -halfWidthMm + 2 * halfWidthMm * t;
    addPointPair(x, topDepthMm);
    addPointPair(x, bottomDepthMm);
  }

  return points;
}

function alphaPixelCount(alpha: number[]) {
  return alpha.filter((value) => value > 0).length;
}

function sectorItemWithContours(contoursMm: Vec2[] | Vec2[][]): SimulatorSectorItem {
  const normalizedContours = Array.isArray(contoursMm[0]?.[0])
    ? contoursMm as Vec2[][]
    : [contoursMm as Vec2[]];

  return {
    id: 'test-structure',
    label: 'test structure',
    kind: 'vessel',
    color: '#ffffff',
    depthMm: 20,
    lateralMm: 0,
    visible: true,
    contoursMm: normalizedContours,
  };
}

describe('simulator static assets', () => {
  it('loads a manifest with precomputed station snap snapshots', () => {
    const manifest = readCaseAsset<SimulatorCaseManifest>('case_manifest.web.json');

    expect(manifest.presets.length).toBeGreaterThan(0);
    expect(Object.keys(manifest.sector_snapshots ?? {}).length).toBe(manifest.presets.length);
    expect(manifest.assets.scope_model?.asset).toContain('EBUS_tip.glb');
  });

  it('loads the simplified model trial manifest with mesh-derived point clouds and no snapshots', () => {
    const manifest = readCaseAsset<SimulatorCaseManifest>('case_manifest.simplified.web.json');
    const primaryModel = manifest.assets.clean_models?.find((model) => model.primary);
    const primaryModelPath = resolve(process.cwd(), `public/simulator/case-001/${primaryModel?.asset}`);

    expect(manifest.case_id).toContain('simplified');
    expect(primaryModel?.asset).toBe('models/simplified_sim_model.glb');
    expect(readFileSync(primaryModelPath).subarray(0, 4).toString()).toBe('glTF');
    expect(manifest.render_defaults.sector_realism).toBe('realistic');
    expect(Object.keys(manifest.sector_snapshots ?? {})).toHaveLength(0);
    expect(manifest.presets).toHaveLength(11);
    expect(manifest.assets.stations.map((asset) => asset.key)).toEqual(
      expect.arrayContaining(['station_2l', 'station_4r', 'station_7', 'station_10r', 'station_10l', 'station_11rs']),
    );
    expect(manifest.presets.map((preset) => preset.preset_key)).not.toContain('station_4r_node_b::default');
    expect(manifest.assets.stations.every((asset) => asset.asset.startsWith('geometry/simplified/stations/'))).toBe(true);
    expect(manifest.assets.vessels.every((asset) => asset.asset.startsWith('geometry/simplified/vessels/'))).toBe(true);
  });

  it('uses the simplified simulator manifest as the default app manifest', () => {
    expect(simulatorManifestUrl()).toMatch(
      /\/simulator\/case-001\/case_manifest\.simplified\.web\.json$/,
    );
  });

  it('uses the simplified point list to aim station snap presets', () => {
    const manifest = readCaseAsset<SimulatorCaseManifest>('case_manifest.simplified.web.json');
    const station4r = manifest.presets.find((preset) => preset.preset_key === 'station_4r_node_a::default');
    const station10l = manifest.presets.find((preset) => preset.preset_key === 'station_10l_node_a::default');

    expect(station4r?.station_asset).toBe('geometry/simplified/stations/station_4r_points.json');
    expect(station4r?.contact[0]).toBeCloseTo(-13.355912548975311, 5);
    expect(station4r?.contact[1]).toBeCloseTo(1239.0529931957165, 5);
    expect(station4r?.contact[2]).toBeCloseTo(171.51630648491516, 5);
    expect(station4r?.target[0]).toBeCloseTo(-16.0781483437477, 5);
    expect(station4r?.target[1]).toBeCloseTo(1234.3357423743225, 5);
    expect(station4r?.target[2]).toBeCloseTo(180.22746102818675, 5);
    expect(station4r?.target_lps[0]).toBeCloseTo(-16.0781483437477, 5);
    expect(station4r?.target_lps[1]).toBeCloseTo(-180.22746102818675, 5);
    expect(station4r?.target_lps[2]).toBeCloseTo(1234.3357423743225, 5);
    expect(station4r?.depth_axis?.length).toBe(3);
    expect(station10l?.station_asset).toBe('geometry/simplified/stations/station_10l_points.json');
  });

  it('lists simplified nodes and vessels for individual 3D visibility controls', () => {
    const manifest = readCaseAsset<SimulatorCaseManifest>('case_manifest.simplified.web.json');
    const items = simulatorSceneStructureVisibilityItems(manifest);

    expect(items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'station_4r', kind: 'node' }),
        expect.objectContaining({ id: 'station_10l', kind: 'node' }),
        expect.objectContaining({ id: 'aorta', kind: 'vessel' }),
        expect.objectContaining({ id: 'pulmonary_artery', kind: 'vessel' }),
      ]),
    );
  });

  it('builds base-aware URLs for static simulator assets', () => {
    expect(simulatorCaseAssetUrl('geometry/airway_mesh.json')).toMatch(
      /\/simulator\/case-001\/geometry\/airway_mesh\.json$/,
    );
  });

  it('keeps thin-plane snapshot masks for station 7 and 4L adjacent anatomy', () => {
    const station7 = readCaseAsset<SimulatorSectorSnapshot>('sector_snapshots/station_7_node_a__lms.json');
    const station4l = readCaseAsset<SimulatorSectorSnapshot>('sector_snapshots/station_4l_node_a__default.json');

    const station7MaskedIds = station7.response.sector.labels
      .filter((label) => label.visible && label.raster_mask?.alpha.length)
      .map((label) => label.id);
    const station4lMaskedIds = station4l.response.sector.labels
      .filter((label) => label.visible && label.raster_mask?.alpha.length)
      .map((label) => label.id);

    expect(station7MaskedIds).toEqual(expect.arrayContaining(['station_7', 'pulmonary_venous_system', 'left_atrium']));
    expect(station4lMaskedIds).toEqual(expect.arrayContaining(['station_4l', 'pulmonary_artery', 'aorta']));
  });

  it('keeps adjacent vessel cuts visible in the live sector after movement', () => {
    const fixture = loadSimulatorFixture();

    expect(liveMaskedSectorIds(fixture, 'station_4l_node_a::default', 5)).toEqual(
      expect.arrayContaining(['station_4l', 'pulmonary_artery', 'aorta']),
    );
    expect(liveMaskedSectorIds(fixture, 'station_7_node_a::lms', 2.5)).toEqual(
      expect.arrayContaining(['station_7', 'pulmonary_venous_system', 'left_atrium']),
    );
  });

  it('excludes nearby anatomy that stays entirely on one side of the live fan plane', () => {
    const fixture = loadSimulatorFixture();
    const maskedIds = liveMaskedSectorIds(fixture, 'station_10r_node_a::default', -15);

    expect(maskedIds).toContain('station_10r');
    expect(maskedIds).not.toContain('superior_vena_cava');
  });

  it('renders live sector masks from local fan-plane crossings instead of a thick slab projection', () => {
    const fixture = loadSimulatorFixture();
    const maskedItems = liveMaskedSectorItems(fixture, 'station_7_node_a::lms', 2.5);

    expect(maskedItems.map((item) => item.id)).toEqual(
      expect.arrayContaining(['station_7', 'pulmonary_venous_system', 'left_atrium']),
    );
    expect(maskedItems.every((item) => item.rasterMask?.source === 'browser_point_cloud_plane_contour')).toBe(true);
  });
});

describe('simulator plane-cut mask generator', () => {
  it('cuts a sphere into one smooth filled contour', () => {
    const result = buildPlaneIntersectionRasterMask({
      kind: 'node',
      maxDepthMm: 40,
      points: sphereSurfacePoints([0, 0, 22], 6),
      pose: syntheticPlanePose(),
      sectorAngleDeg: 70,
    });

    expect(result).not.toBeNull();
    expect(result?.rasterMask.source).toBe('browser_point_cloud_plane_contour');
    expect(result?.contoursMm).toHaveLength(1);
    expect(alphaPixelCount(result?.rasterMask.alpha ?? [])).toBeGreaterThan(900);
  });

  it('cuts a cylinder into one continuous vessel mask instead of point circles', () => {
    const result = buildPlaneIntersectionRasterMask({
      kind: 'vessel',
      maxDepthMm: 40,
      points: cylinderAlongYSurfacePoints({
        center: [0, 0, 24],
        halfLengthMm: 10,
        radiusMm: 4,
      }),
      pose: syntheticPlanePose(),
      sectorAngleDeg: 70,
    });

    expect(result).not.toBeNull();
    expect(result?.contoursMm).toHaveLength(1);
    expect(alphaPixelCount(result?.rasterMask.alpha ?? [])).toBeGreaterThan(1500);
  });

  it('unions paired wall bands from a broad vessel into one lumen contour', () => {
    const result = buildPlaneIntersectionRasterMask({
      kind: 'vessel',
      maxDepthMm: 50,
      points: pairedWallBandSurfacePoints({
        depthMm: 28,
        halfBandGapMm: 12,
        halfLengthMm: 13,
        yHalfThicknessMm: 2,
      }),
      pose: syntheticPlanePose(),
      sectorAngleDeg: 70,
    });

    expect(result).not.toBeNull();
    expect(result?.contoursMm).toHaveLength(1);
    expect(alphaPixelCount(result?.rasterMask.alpha ?? [])).toBeGreaterThan(2500);
  });

  it('clips a vessel crossing that exits the distal fan instead of closing it inside the field', () => {
    const result = buildPlaneIntersectionRasterMask({
      kind: 'vessel',
      maxDepthMm: 40,
      points: openDistalVesselSurfacePoints({
        bottomDepthMm: 52,
        halfWidthMm: 8,
        outOfPlaneHalfThicknessMm: 2,
        topDepthMm: 18,
      }),
      pose: syntheticPlanePose(),
      sectorAngleDeg: 70,
    });
    const maxContourDepthMm = Math.max(...(result?.contoursMm.flat().map((point) => point[1]) ?? [0]));

    expect(result).not.toBeNull();
    expect(result?.contoursMm).toHaveLength(1);
    expect(maxContourDepthMm).toBeGreaterThan(39.5);
  });

  it('keeps two adjacent cylinder cuts as separate contours when their plane intersections do not touch', () => {
    const leftCylinder = cylinderAlongYSurfacePoints({
      center: [0, -16, 24],
      halfLengthMm: 5,
      radiusMm: 4,
    });
    const rightCylinder = cylinderAlongYSurfacePoints({
      center: [0, 16, 24],
      halfLengthMm: 5,
      radiusMm: 4,
    });
    const result = buildPlaneIntersectionRasterMask({
      kind: 'vessel',
      maxDepthMm: 40,
      points: [...leftCylinder, ...rightCylinder],
      pose: syntheticPlanePose(),
      sectorAngleDeg: 70,
    });

    expect(result).not.toBeNull();
    expect(result?.contoursMm).toHaveLength(2);
  });
});

describe('simulator sector contour source selection', () => {
  it('treats explicitly closed mm-space contours as usable mask geometry', () => {
    const item = {
      ...sectorItemWithContours([[0, 20], [5, 24], [0, 28], [-5, 24]]),
      contourClosed: [true],
    };

    expect(hasUsableSectorContourGeometry(item)).toBe(true);
  });

  it('promotes explicitly open contours only when the closure chord is anatomically plausible', () => {
    const nearClosedOpenContour = Array.from({ length: 12 }, (_, index): Vec2 => [
      -6 + index,
      22 + Math.sin(index / 2) * 0.25,
    ]);
    const item = {
      ...sectorItemWithContours(nearClosedOpenContour),
      contourClosed: [false],
    };

    expect(contourIsCloseable(nearClosedOpenContour, false)).toBe(true);
    expect(hasUsableSectorContourGeometry(item)).toBe(true);
  });

  it('rejects arc-class open contours so raster or ellipse fallback handles them instead of banana fills', () => {
    const arcContour: Vec2[] = [
      [-6, 20],
      [-4, 24],
      [-1, 27],
      [3, 27],
      [6, 24],
      [7, 20],
    ];
    const item = {
      ...sectorItemWithContours(arcContour),
      contourClosed: [false],
    };

    expect(contourIsCloseable(arcContour, false)).toBe(false);
    expect(hasUsableSectorContourGeometry(item)).toBe(false);
  });

  it('does not treat untagged long open contours as usable unless they are geometrically closed', () => {
    const untaggedOpenContour = Array.from({ length: 12 }, (_, index): Vec2 => [
      -6 + index,
      20 + Math.sin(index / 3),
    ]);

    expect(hasUsableSectorContourGeometry(sectorItemWithContours(untaggedOpenContour))).toBe(false);
  });
});

describe('simulator station IDs', () => {
  it('normalizes split right interlobar station IDs without flattening them', () => {
    expect(normalizeSimulatorStationId('11ri')).toBe('11Ri');
    expect(normalizeSimulatorStationId('11RS')).toBe('11Rs');
    expect(normalizeSimulatorStationId('4r')).toBe('4R');
  });
});

describe('simulator pose math', () => {
  const polyline: SimulatorCenterlinePolyline = {
    line_index: 1,
    points: [
      [0, 0, 0],
      [0, 10, 0],
    ],
    cumulative_lengths_mm: [0, 10],
    total_length_mm: 10,
  };

  it('interpolates centerline distance in millimeters', () => {
    expect(pointAtS(polyline, 4).toArray()).toEqual([0, 4, 0]);
  });

  it('computes an orthonormal probe pose at a station snap', () => {
    const preset: SimulatorPreset = {
      approach: 'default',
      centerline_s_mm: 5,
      contact: [0, 5, 0],
      contact_to_target_distance_mm: 10,
      label: 'Station 4R node A',
      line_index: 1,
      node: 'a',
      preset_id: 'station_4r_node_a',
      preset_key: 'station_4r_node_a::default',
      station: '4r',
      station_key: 'station_4r',
      target: [0, 5, 10],
      target_lps: [0, 0, 0],
      vessel_overlays: [],
    };
    const pose = computeSimulatorPose(polyline, 5, 0, preset);

    expect(pose.tangent.length()).toBeCloseTo(1, 5);
    expect(pose.depthAxis.length()).toBeCloseTo(1, 5);
    expect(pose.lateralAxis.length()).toBeCloseTo(1, 5);
    expect(Math.abs(pose.tangent.dot(pose.depthAxis))).toBeLessThan(1e-6);
  });

  it('supports a complete 360 degree probe roll', () => {
    const preset: SimulatorPreset = {
      approach: 'default',
      centerline_s_mm: 5,
      contact: [0, 5, 0],
      contact_to_target_distance_mm: 10,
      label: 'Station 4R node A',
      line_index: 1,
      node: 'a',
      preset_id: 'station_4r_node_a',
      preset_key: 'station_4r_node_a::default',
      station: '4r',
      station_key: 'station_4r',
      target: [0, 5, 10],
      target_lps: [0, 0, 0],
      vessel_overlays: [],
    };
    const baseline = computeSimulatorPose(polyline, 5, 0, preset);
    const fullRotation = computeSimulatorPose(polyline, 5, 360, preset);
    const halfRotation = computeSimulatorPose(polyline, 5, 180, preset);

    baseline.depthAxis.toArray().forEach((value, index) => {
      expect(fullRotation.depthAxis.toArray()[index]).toBeCloseTo(value, 5);
    });
    baseline.lateralAxis.toArray().forEach((value, index) => {
      expect(fullRotation.lateralAxis.toArray()[index]).toBeCloseTo(value, 5);
    });
    expect(halfRotation.depthAxis.dot(baseline.depthAxis)).toBeCloseTo(-1, 5);
  });
});

describe('simulator sector source selection', () => {
  it('uses the precomputed snapshot only at the exact station snap pose', () => {
    const source = resolveSimulatorSectorSource({
      atSnapshotPose: true,
      hasCurrentSnapshot: true,
      snapshotStatus: 'ready',
    });

    expect(source).toBe('precomputed_volume_snapshot');
    expect(shouldUseSnapshotSectorItems(source)).toBe(true);
    expect(simulatorSectorSourceLabel(source)).toBe('Snapshot sector');
  });

  it('switches to a live point-cloud sector after exploratory movement', () => {
    const source = resolveSimulatorSectorSource({
      atSnapshotPose: false,
      hasCurrentSnapshot: true,
      snapshotStatus: 'ready',
    });

    expect(source).toBe('point_cloud_sector');
    expect(shouldUseSnapshotSectorItems(source)).toBe(false);
    expect(simulatorSectorSourceLabel(source)).toBe('Live sector');
  });

  it('uses the live point-cloud sector when no snapshot is available', () => {
    const source = resolveSimulatorSectorSource({
      atSnapshotPose: false,
      hasCurrentSnapshot: false,
      snapshotStatus: 'missing',
    });

    expect(source).toBe('point_cloud_sector');
    expect(shouldUseSnapshotSectorItems(source)).toBe(false);
  });
});
