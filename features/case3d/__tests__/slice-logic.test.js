import { getCase3DManifest } from '../content';
import {
  mapNormalizedToFrameIndex,
  projectWorldPointToSliceUv,
  projectNormalizedToSeriesPosition,
} from '../slice-logic';

const manifest = getCase3DManifest();

describe('projectNormalizedToSeriesPosition', () => {
  it('keeps forward coverage as-is and reverses backward coverage', () => {
    expect(projectNormalizedToSeriesPosition(0.4, [0, 1])).toBeCloseTo(0.4);
    expect(projectNormalizedToSeriesPosition(0.4, [1, 0])).toBeCloseTo(0.6);
  });
});

describe('mapNormalizedToFrameIndex', () => {
  it('maps normalized positions into frame indices using the declared coverage assumption', () => {
    expect(mapNormalizedToFrameIndex(0.434640522875817, 160, [1, 0])).toBe(90);
    expect(mapNormalizedToFrameIndex(0.434640522875817, 160, [0, 1])).toBe(69);
  });
});

describe('projectWorldPointToSliceUv', () => {
  it('projects a world-space target into the active slice plane using CT geometry and crop metadata', () => {
    const target = manifest.targets.find((candidate) => candidate.id === 'node_4L_1');
    expect(target).toBeTruthy();

    const uv = projectWorldPointToSliceUv({
      frameIndex: target.sliceIndex.axial,
      manifest,
      plane: 'axial',
      worldPoint: target.world.position,
    });

    expect(uv.x).toBeGreaterThanOrEqual(0);
    expect(uv.x).toBeLessThanOrEqual(1);
    expect(uv.y).toBeGreaterThanOrEqual(0);
    expect(uv.y).toBeLessThanOrEqual(1);
  });
});
