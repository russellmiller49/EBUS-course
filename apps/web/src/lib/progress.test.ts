import { describe, expect, it } from 'vitest';

import {
  chooseStoredLearnerProgress,
  createInitialLearnerProgress,
  getLearnerProgressStorageKey,
  learnerProgressReducer,
  normalizeLearnerProgress,
  parseStoredLearnerProgress,
} from '@/lib/progress';

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
      completedAt: expect.any(String),
    });
  });

  it('accumulates tracked engagement time by learning module', () => {
    const initial = createInitialLearnerProgress();
    const next = learnerProgressReducer(initial, {
      type: 'recordModuleEngagement',
      moduleId: 'lectures',
      seconds: 95,
    });

    expect(next.engagement.lectures.totalSeconds).toBe(95);
    expect(next.engagement.lectures.lastTrackedAt).toEqual(expect.any(String));
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
    expect(normalized.engagement.lectures.totalSeconds).toBe(0);
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

  it('parses legacy local progress payloads and scopes signed-in storage keys', () => {
    const parsed = parseStoredLearnerProgress({
      bookmarkedStations: ['4R'],
    });

    expect(parsed?.state.bookmarkedStations).toEqual(['4R']);
    expect(parsed?.savedAt).toBeNull();
    expect(getLearnerProgressStorageKey('learner-123')).toBe('socal-ebus-prep.web.learner-progress:learner-123');
  });

  it('prefers the newer remote snapshot over stale local storage', () => {
    const local = {
      savedAt: '2026-04-01T10:00:00.000Z',
      state: createInitialLearnerProgress(),
    };
    const remoteState = createInitialLearnerProgress();
    remoteState.pretest.submittedAt = '2026-04-02T09:00:00.000Z';
    const remote = {
      savedAt: '2026-04-02T10:00:00.000Z',
      state: remoteState,
    };

    expect(chooseStoredLearnerProgress(local, remote)).toBe(remote);
  });
});
