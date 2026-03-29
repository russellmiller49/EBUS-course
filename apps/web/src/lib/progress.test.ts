import { describe, expect, it } from 'vitest';

import { createInitialLearnerProgress, learnerProgressReducer, normalizeLearnerProgress } from '@/lib/progress';

describe('learnerProgressReducer', () => {
  it('records lecture completion and preserves the larger watched duration', () => {
    const initial = createInitialLearnerProgress();
    const state = learnerProgressReducer(initial, {
      type: 'setLectureState',
      lectureId: 'lecture-01',
      watchedSeconds: 120,
      completed: false,
    });
    const next = learnerProgressReducer(state, {
      type: 'setLectureState',
      lectureId: 'lecture-01',
      watchedSeconds: 30,
      completed: true,
    });

    expect(next.lectureWatchStatus['lecture-01']).toMatchObject({
      watchedSeconds: 120,
      completed: true,
    });
  });

  it('normalizes malformed persisted state back to defaults', () => {
    const normalized = normalizeLearnerProgress({
      moduleProgress: {
        knobology: {
          visitedAt: 42,
          percentComplete: 500,
        },
      },
      bookmarkedStations: ['4R', null],
    });

    expect(normalized.moduleProgress.knobology.percentComplete).toBe(100);
    expect(normalized.moduleProgress.knobology.visitedAt).toBeNull();
    expect(normalized.bookmarkedStations).toEqual(['4R']);
  });

  it('stores and submits the web pretest locally', () => {
    const initial = createInitialLearnerProgress();
    const answered = learnerProgressReducer(initial, {
      type: 'setPretestAnswer',
      questionId: 'pretest-01',
      optionId: 'b',
    });
    const indexed = learnerProgressReducer(answered, {
      type: 'setPretestQuestionIndex',
      index: 9,
    });
    const submitted = learnerProgressReducer(indexed, {
      type: 'submitPretest',
      score: 31,
      answeredCount: 42,
      totalQuestions: 42,
    });

    expect(submitted.pretest.answers['pretest-01']).toBe('b');
    expect(submitted.pretest.currentQuestionIndex).toBe(9);
    expect(submitted.pretest.score).toBe(31);
    expect(submitted.pretest.answeredCount).toBe(42);
    expect(submitted.pretest.totalQuestions).toBe(42);
    expect(submitted.pretest.attemptCount).toBe(1);
    expect(submitted.pretest.submittedAt).toEqual(expect.any(String));
  });
});
