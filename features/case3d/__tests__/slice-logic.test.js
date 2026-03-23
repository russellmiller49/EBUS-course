import { getCase3DManifest } from '../content';
import {
  getSliceCrosshairPosition,
  mapNormalizedToFrameIndex,
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

describe('getSliceCrosshairPosition', () => {
  it('projects the focused target into plane-specific x and y coordinates', () => {
    const target = manifest.targets.find((candidate) => candidate.id === 'node_4L_1');
    expect(target).toBeTruthy();
    const sliceSeries = {
      ...manifest.sliceSeries,
      sagittal: {
        ...manifest.sliceSeries.sagittal,
        coverageAssumption: [1, 0],
      },
    };

    const axialCrosshair = getSliceCrosshairPosition(target.derived.normalized, 'axial', sliceSeries);
    const sagittalCrosshair = getSliceCrosshairPosition(target.derived.normalized, 'sagittal', sliceSeries);

    expect(axialCrosshair.x).toBeCloseTo(1 - target.derived.normalized.sagittal);
    expect(axialCrosshair.y).toBeCloseTo(target.derived.normalized.coronal);
    expect(sagittalCrosshair.x).toBeCloseTo(target.derived.normalized.coronal);
    expect(sagittalCrosshair.y).toBeCloseTo(target.derived.normalized.axial);
  });
});
