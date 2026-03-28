import { describe, expect, it } from 'vitest';

import { createKnobologyFrameState, getDepthFrameIndex, reduceKnobologyFrameState } from '@/features/knobology/logic';

const exercise = {
  id: 'test',
  title: 'Test exercise',
  symptom: 'Too dark.',
  instructions: 'Raise gain.',
  focusControl: 'gain' as const,
  start: {
    depth: 40,
    gain: 20,
    contrast: 40,
  },
  target: {
    depth: 40,
    gain: 60,
    contrast: 40,
  },
  successMessage: 'Solved.',
};

describe('getDepthFrameIndex', () => {
  it('maps depth values to the nearest real EBUS depth frame', () => {
    expect(getDepthFrameIndex(0, 5)).toBe(0);
    expect(getDepthFrameIndex(28, 5)).toBe(0);
    expect(getDepthFrameIndex(40, 5)).toBe(1);
    expect(getDepthFrameIndex(68, 5)).toBe(2);
    expect(getDepthFrameIndex(82, 5)).toBe(3);
    expect(getDepthFrameIndex(100, 5)).toBe(4);
  });

  it('falls back safely when only one frame is available', () => {
    expect(getDepthFrameIndex(55, 1)).toBe(0);
  });
});

describe('reduceKnobologyFrameState', () => {
  it('updates the shared simulator state for processor actions', () => {
    let state = createKnobologyFrameState(exercise);

    state = reduceKnobologyFrameState(state, { type: 'PROCESSOR_ACTION', actionId: 'GAIN_UP' });
    state = reduceKnobologyFrameState(state, { type: 'PROCESSOR_ACTION', actionId: 'TOGGLE_PIP' });
    state = reduceKnobologyFrameState(state, { type: 'PROCESSOR_ACTION', actionId: 'TOGGLE_FREEZE' });
    state = reduceKnobologyFrameState(state, { type: 'PROCESSOR_ACTION', actionId: 'CINE_REVIEW_MODE' });
    state = reduceKnobologyFrameState(state, { type: 'PROCESSOR_ACTION', actionId: 'CINE_STEP_FORWARD' });
    state = reduceKnobologyFrameState(state, { type: 'PROCESSOR_ACTION', actionId: 'MEASURE_MODE' });
    state = reduceKnobologyFrameState(state, { type: 'PROCESSOR_ACTION', actionId: 'MEASURE_SET' });
    state = reduceKnobologyFrameState(state, { type: 'PROCESSOR_ACTION', actionId: 'FLOW_MODE' });

    expect(state.gain).toBe(28);
    expect(state.pipEnabled).toBe(true);
    expect(state.frozen).toBe(true);
    expect(state.cineReviewMode).toBe(true);
    expect(state.cineFrame).toBe(1);
    expect(state.calipers).toBe(true);
    expect(state.measurementPoints).toBe(2);
    expect(state.mode).toBe('flow');
    expect(state.colorDoppler).toBe(true);
  });
});
