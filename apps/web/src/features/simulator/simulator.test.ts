import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { simulatorCaseAssetUrl } from './paths';
import { computeSimulatorPose, pointAtS } from './pose';
import {
  resolveSimulatorSectorSource,
  shouldUseSnapshotSectorItems,
  simulatorSectorSourceLabel,
} from './sectorSource';
import { normalizeSimulatorStationId } from './stationIds';
import type { SimulatorCaseManifest, SimulatorCenterlinePolyline, SimulatorPreset } from './types';

describe('simulator static assets', () => {
  it('loads a manifest with precomputed station snap snapshots', () => {
    const manifest = JSON.parse(
      readFileSync(resolve(process.cwd(), 'public/simulator/case-001/case_manifest.web.json'), 'utf8'),
    ) as SimulatorCaseManifest;

    expect(manifest.presets.length).toBeGreaterThan(0);
    expect(Object.keys(manifest.sector_snapshots ?? {}).length).toBe(manifest.presets.length);
    expect(manifest.assets.scope_model?.asset).toContain('EBUS_tip.glb');
  });

  it('builds base-aware URLs for static simulator assets', () => {
    expect(simulatorCaseAssetUrl('geometry/airway_mesh.json')).toMatch(
      /\/simulator\/case-001\/geometry\/airway_mesh\.json$/,
    );
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
