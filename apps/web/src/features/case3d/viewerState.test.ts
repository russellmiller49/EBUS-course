import { describe, expect, it } from 'vitest';

import runtimeData from '../../../../../content/cases/case_001.runtime.json';

import { caseViewerReducer, createInitialViewerState } from './viewerState';

import type { RuntimeCaseManifest } from '../../../../../features/case3d/types';

const manifest = runtimeData as unknown as RuntimeCaseManifest;

describe('caseViewerReducer', () => {
  it('moves the crosshair and cut plane when selecting a target', () => {
    const initialState = createInitialViewerState(manifest);
    const target = manifest.targets.find((entry) => entry.id === 'landmark_carina') ?? manifest.targets[0];

    const nextState = caseViewerReducer(initialState, {
      type: 'select-target',
      manifest,
      stationId: target.stationId ?? initialState.selectedStationId,
      targetId: target.id,
      world: target.world.position,
    });

    expect(nextState.selectedTargetId).toBe(target.id);
    expect(nextState.cutPlane.origin).toEqual(target.world.position);
    expect(nextState.crosshairVoxel[2]).toBeCloseTo(target.derived.continuousVoxel[2], 3);
  });

  it('updates the requested orthogonal axis index without disturbing the others', () => {
    const initialState = createInitialViewerState(manifest);

    const nextState = caseViewerReducer(initialState, {
      type: 'set-plane-axis-index',
      plane: 'axial',
      axisIndex: 80,
      manifest,
    });

    expect(nextState.crosshairVoxel[2]).toBe(80);
    expect(nextState.crosshairVoxel[0]).toBe(initialState.crosshairVoxel[0]);
    expect(nextState.crosshairVoxel[1]).toBe(initialState.crosshairVoxel[1]);
  });
});
