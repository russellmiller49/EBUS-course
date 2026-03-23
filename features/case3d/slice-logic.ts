import type { CasePlane, SliceSeries } from './types';

const DEFAULT_COVERAGE_ASSUMPTION: [number, number] = [0, 1];

function clampUnit(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(1, value));
}

function normalizeCoverageAssumption(coverageAssumption?: [number, number]) {
  if (
    !coverageAssumption ||
    coverageAssumption.length !== 2 ||
    coverageAssumption.some((value) => !Number.isFinite(value))
  ) {
    return DEFAULT_COVERAGE_ASSUMPTION;
  }

  const [start, end] = coverageAssumption;

  if (start === end) {
    return DEFAULT_COVERAGE_ASSUMPTION;
  }

  return [start, end] as [number, number];
}

export function projectNormalizedToSeriesPosition(normalizedPosition: number, coverageAssumption?: [number, number]) {
  const clampedNormalized = clampUnit(normalizedPosition);
  const [start, end] = normalizeCoverageAssumption(coverageAssumption);

  return clampUnit((clampedNormalized - start) / (end - start));
}

export function mapNormalizedToFrameIndex(
  normalizedPosition: number,
  frameCount: number,
  coverageAssumption?: [number, number],
) {
  if (frameCount <= 1) {
    return 0;
  }

  return Math.round(projectNormalizedToSeriesPosition(normalizedPosition, coverageAssumption) * (frameCount - 1));
}

export function getSliceCrosshairPosition(
  normalized: Record<CasePlane, number>,
  plane: CasePlane,
  sliceSeries: SliceSeries,
) {
  const planeProgress = {
    axial: projectNormalizedToSeriesPosition(normalized.axial, sliceSeries.axial.coverageAssumption),
    coronal: projectNormalizedToSeriesPosition(normalized.coronal, sliceSeries.coronal.coverageAssumption),
    sagittal: projectNormalizedToSeriesPosition(normalized.sagittal, sliceSeries.sagittal.coverageAssumption),
  };

  switch (plane) {
    case 'axial':
      return {
        x: planeProgress.sagittal,
        y: planeProgress.coronal,
      };
    case 'coronal':
      return {
        x: planeProgress.sagittal,
        y: planeProgress.axial,
      };
    case 'sagittal':
      return {
        x: planeProgress.coronal,
        y: planeProgress.axial,
      };
  }
}
