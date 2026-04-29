import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import * as THREE from 'three';
import { describe, expect, it } from 'vitest';

import { simulatorCaseAssetUrl } from './paths';
import { computeSimulatorPose, pointAtS, type SimulatorProbePose } from './pose';
import {
  resolveSimulatorSectorSource,
  shouldUseSnapshotSectorItems,
  simulatorSectorSourceLabel,
} from './sectorSource';
import { contourIsCloseable, hasUsableSectorContourGeometry } from './SectorView';
import { buildPlaneIntersectionRasterMask, buildPointCloudSectorItems } from './SimulatorPage';
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
