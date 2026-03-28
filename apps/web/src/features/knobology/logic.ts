import type { KnobologyCorrectionExercise } from '@/content/types';

export interface KnobologyFrameState {
  depth: number;
  gain: number;
  contrast: number;
  colorDoppler: boolean;
  calipers: boolean;
  frozen: boolean;
  saved: boolean;
}

export interface KnobologyFrameMetrics {
  brightness: number;
  hazeOpacity: number;
  nodeSize: number;
  nodeY: number;
  borderOpacity: number;
  colorSignalOpacity: number;
  realFrameBrightness: number;
  realFrameContrast: number;
}

export interface ExerciseEvaluation {
  score: number;
  solved: boolean;
  feedback: string;
}

export function createKnobologyFrameState(exercise: KnobologyCorrectionExercise): KnobologyFrameState {
  return {
    ...exercise.start,
    colorDoppler: false,
    calipers: false,
    frozen: false,
    saved: false,
  };
}

const DEFAULT_DEPTH_FRAME_LEVELS = [20, 40, 60, 80, 100] as const;

export function getDepthFrameIndex(
  depth: number,
  frameCount: number = DEFAULT_DEPTH_FRAME_LEVELS.length,
): number {
  if (frameCount <= 1) {
    return 0;
  }

  const clampedDepth = Math.max(0, Math.min(100, depth));
  const frameLevels =
    frameCount === DEFAULT_DEPTH_FRAME_LEVELS.length
      ? [...DEFAULT_DEPTH_FRAME_LEVELS]
      : Array.from({ length: frameCount }, (_, index) => Math.round(((index + 1) / frameCount) * 100));

  return frameLevels.reduce((closestIndex, level, index) => {
    const closestDelta = Math.abs(frameLevels[closestIndex] - clampedDepth);
    const currentDelta = Math.abs(level - clampedDepth);

    return currentDelta < closestDelta ? index : closestIndex;
  }, 0);
}

export function buildFrameMetrics(state: KnobologyFrameState): KnobologyFrameMetrics {
  return {
    brightness: 0.16 + state.gain / 135,
    hazeOpacity: 0.08 + (100 - state.contrast) / 200,
    nodeSize: 26 + (100 - state.depth) * 0.52,
    nodeY: 16 + state.depth * 0.58,
    borderOpacity: Math.min(0.82, 0.18 + state.contrast / 140),
    colorSignalOpacity: state.colorDoppler ? 0.78 : 0,
    realFrameBrightness: 0.48 + state.gain / 82,
    realFrameContrast: 0.64 + state.contrast / 92,
  };
}

export function evaluateExercise(
  exercise: KnobologyCorrectionExercise,
  state: KnobologyFrameState,
): ExerciseEvaluation {
  const deltas = {
    depth: Math.abs(state.depth - exercise.target.depth),
    gain: Math.abs(state.gain - exercise.target.gain),
    contrast: Math.abs(state.contrast - exercise.target.contrast),
  };
  const totalDelta = deltas.depth + deltas.gain + deltas.contrast;
  const solved = totalDelta <= 24 && deltas[exercise.focusControl] <= 8;
  const score = Math.max(0, Math.round(100 - totalDelta * 1.25));

  if (solved) {
    return {
      score,
      solved: true,
      feedback: exercise.successMessage,
    };
  }

  if (exercise.focusControl === 'depth') {
    return {
      score,
      solved: false,
      feedback:
        state.depth < exercise.target.depth
          ? 'Increase depth until the target settles closer to the middle of the frame.'
          : 'Trim depth slightly so the node is not buried in unused space.',
    };
  }

  if (exercise.focusControl === 'gain') {
    return {
      score,
      solved: false,
      feedback:
        state.gain < exercise.target.gain
          ? 'The frame is still too dark. Raise gain until the border becomes readable.'
          : 'Back gain down a little. The image is starting to look washed out.',
    };
  }

  return {
    score,
    solved: false,
    feedback:
      state.contrast < exercise.target.contrast
        ? 'Increase contrast to recover edge definition.'
        : 'The frame has enough contrast. Fine-tune gain so the border stays clean.',
  };
}
