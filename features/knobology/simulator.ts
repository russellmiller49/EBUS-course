import type {
  KnobologyControlKey,
  KnobologyControlState,
  KnobologyCorrectionExercise,
  KnobologyDopplerLab,
  KnobologyEvaluation,
} from '@/features/knobology/types';

const CONTROL_KEYS: KnobologyControlKey[] = ['depth', 'gain', 'contrast'];

function clampControlValue(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function createControlState(
  partial: Pick<KnobologyControlState, 'depth' | 'gain' | 'contrast'>,
): KnobologyControlState {
  return {
    depth: clampControlValue(partial.depth),
    gain: clampControlValue(partial.gain),
    contrast: clampControlValue(partial.contrast),
    colorDoppler: false,
    calipers: false,
    frozen: false,
    saved: false,
  };
}

export function updateControlValue(
  state: KnobologyControlState,
  key: KnobologyControlKey,
  value: number,
): KnobologyControlState {
  if (state.frozen) {
    return state;
  }

  return {
    ...state,
    [key]: clampControlValue(value),
  };
}

export function toggleUtilityControl(
  state: KnobologyControlState,
  key: 'colorDoppler' | 'calipers' | 'frozen' | 'saved',
): KnobologyControlState {
  return {
    ...state,
    [key]: !state[key],
  };
}

export function getCorrectionSolvedCount(
  exercises: KnobologyCorrectionExercise[],
  states: Record<string, KnobologyControlState>,
) {
  return exercises.filter((exercise) => evaluateCorrectionExercise(exercise, states[exercise.id]).isSolved).length;
}

export function buildFrameModel(state: KnobologyControlState) {
  return {
    brightness: 0.2 + state.gain / 140,
    hazeOpacity: 0.08 + (100 - state.contrast) / 180 + state.gain / 260,
    nodeTop: 20 + state.depth * 1.2,
    nodeOpacity: 0.3 + state.gain / 180,
    nodeBorderOpacity: 0.15 + state.contrast / 120,
    colorSignalOpacity: state.colorDoppler ? 0.65 : 0.12,
    calipersVisible: state.calipers,
    frozen: state.frozen,
    saved: state.saved,
  };
}

export function evaluateCorrectionExercise(
  exercise: KnobologyCorrectionExercise,
  state: KnobologyControlState,
): KnobologyEvaluation {
  const deltas = CONTROL_KEYS.map((key) => Math.abs(state[key] - exercise.target[key]));
  const focusedDelta = Math.abs(state[exercise.focusControl] - exercise.target[exercise.focusControl]);
  const averageDelta = deltas.reduce((sum, delta) => sum + delta, 0) / deltas.length;
  const score = Math.max(0, 100 - Math.round(averageDelta * 2.2));
  const isSolved = averageDelta <= 10 && focusedDelta <= 8;
  const direction =
    state[exercise.focusControl] < exercise.target[exercise.focusControl] ? 'increase' : 'decrease';

  let feedback = exercise.instructions;

  if (state.frozen) {
    feedback = 'The frame is frozen. Unfreeze it before making another adjustment.';
  } else if (isSolved) {
    feedback = exercise.successMessage;
  } else if (focusedDelta > 18) {
    feedback = `${direction[0].toUpperCase()}${direction.slice(1)} ${exercise.focusControl} first. ${exercise.symptom}`;
  } else if (averageDelta <= 16) {
    feedback = `You are close. Fine-tune ${exercise.focusControl} and then confirm the border still looks clean.`;
  } else {
    feedback = `The frame is moving in the right direction, but ${exercise.focusControl} still needs a larger change.`;
  }

  if (state.saved) {
    feedback += ' Save is on, so the current teaching frame has been captured.';
  }

  if (state.calipers) {
    feedback += ' Calipers are visible, which is helpful only after the border looks clear.';
  }

  return {
    score,
    isSolved,
    feedback,
    frame: buildFrameModel(state),
  };
}

export function evaluateDopplerChoice(
  lab: KnobologyDopplerLab,
  dopplerOn: boolean,
  selectedPathId: string | null,
) {
  if (!selectedPathId) {
    return {
      status: 'idle' as const,
      feedback: 'Turn Doppler on, then choose the safest path.',
    };
  }

  if (!dopplerOn) {
    return {
      status: 'warning' as const,
      feedback: 'Turn color Doppler on first so the vessel is visible before choosing a path.',
    };
  }

  if (selectedPathId === lab.safePathId) {
    return {
      status: 'correct' as const,
      feedback: 'Correct. That path avoids the color-filled vessel instead of crossing it.',
    };
  }

  return {
    status: 'incorrect' as const,
    feedback: 'Unsafe choice. That path crosses the color Doppler signal and should be avoided in this teaching scenario.',
  };
}
