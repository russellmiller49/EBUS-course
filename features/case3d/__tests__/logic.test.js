import { getCase3DManifest } from '../content';
import {
  buildCaseReviewSummary,
  evaluateCaseReviewAnswer,
  getNearestLandmarks,
  normalizeVisibleToggleSetIds,
  resolveCaseSelection,
} from '../logic';

const manifest = getCase3DManifest();

describe('normalizeVisibleToggleSetIds', () => {
  it('keeps known ids in canonical order and falls back when empty', () => {
    expect(normalizeVisibleToggleSetIds(['cardiac', 'lymph_nodes', 'bogus', 'cardiac'])).toEqual([
      'lymph_nodes',
      'cardiac',
    ]);
    expect(normalizeVisibleToggleSetIds(['bogus'])).toEqual(['lymph_nodes', 'airway', 'vessels']);
    expect(normalizeVisibleToggleSetIds([])).toEqual([]);
  });
});

describe('resolveCaseSelection', () => {
  it('uses the station primary target in station mode and isolates the explicit target in target mode', () => {
    const stationMode = resolveCaseSelection({
      manifest,
      selectionMode: 'station',
      selectedStationId: '4R',
      selectedTargetId: 'node_4R_3',
      visibleToggleSetIds: ['lymph_nodes', 'airway', 'vessels'],
    });

    expect(stationMode.focusTarget.id).toBe('node_4R_1');
    expect(stationMode.activeTargets.map((target) => target.id)).toEqual(['node_4R_1', 'node_4R_2', 'node_4R_3']);

    const targetMode = resolveCaseSelection({
      manifest,
      selectionMode: 'target',
      selectedStationId: '4R',
      selectedTargetId: 'node_4R_3',
      visibleToggleSetIds: ['lymph_nodes', 'airway', 'vessels'],
    });

    expect(targetMode.focusTarget.id).toBe('node_4R_3');
    expect(targetMode.activeTargets.map((target) => target.id)).toEqual(['node_4R_3']);
  });
});

describe('getNearestLandmarks', () => {
  it('returns the closest non-node landmarks to the selected target', () => {
    const nearby = getNearestLandmarks(manifest, 'node_4L_1', 3);

    expect(nearby).toHaveLength(3);
    expect(nearby.every((target) => target.kind === 'landmark')).toBe(true);
  });
});

describe('evaluateCaseReviewAnswer', () => {
  it('reports correctness against the prompt answer id', () => {
    const result = evaluateCaseReviewAnswer(
      {
        id: 'prompt',
        prompt: 'Find 4R.',
        answerKind: 'station',
        correctId: '4R',
        optionIds: ['4R', '4L'],
        explanation: '4R is the right paratracheal station.',
      },
      '4L',
    );

    expect(result.correctId).toBe('4R');
    expect(result.isCorrect).toBe(false);
    expect(result.selectedId).toBe('4L');
  });
});

describe('buildCaseReviewSummary', () => {
  it('summarizes coverage and score as percentages', () => {
    const summary = buildCaseReviewSummary({
      reviewScore: 4,
      reviewPromptCount: 5,
      totalTargetCount: 20,
      visitedTargetIds: ['a', 'b', 'c', 'd', 'e'],
    });

    expect(summary.reviewScore).toBe(4);
    expect(summary.normalizedScore).toBe(80);
    expect(summary.coverage).toBe(25);
    expect(summary.visitedCount).toBe(5);
  });
});
