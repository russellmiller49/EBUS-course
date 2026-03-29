jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

import {
  createInitialLearnerProgress,
  learnerProgressReducer,
  normalizeProgressState,
} from '../learner-progress';

describe('learnerProgressReducer', () => {
  it('marks a module complete and records the last screen', () => {
    const initialState = createInitialLearnerProgress();

    const nextState = learnerProgressReducer(initialState, {
      type: 'toggleModuleCompletion',
      moduleId: 'station-map',
      lastScreen: 'overview',
    });

    expect(nextState.moduleProgress['station-map'].completedAt).toEqual(expect.any(String));
    expect(nextState.moduleProgress['station-map'].percentComplete).toBe(100);
    expect(nextState.moduleProgress['station-map'].lastScreen).toBe('overview');
  });

  it('stores resumable module progress without forcing completion', () => {
    const initialState = createInitialLearnerProgress();

    const nextState = learnerProgressReducer(initialState, {
      type: 'setModuleProgress',
      moduleId: 'knobology',
      lastScreen: 'control-lab',
      percentComplete: 38,
    });

    expect(nextState.moduleProgress.knobology.startedAt).toEqual(expect.any(String));
    expect(nextState.moduleProgress.knobology.lastScreen).toBe('control-lab');
    expect(nextState.moduleProgress.knobology.percentComplete).toBe(38);
    expect(nextState.moduleProgress.knobology.completedAt).toBeNull();
  });

  it('toggles bookmarks on and off for the same item', () => {
    const initialState = createInitialLearnerProgress();

    const bookmarked = learnerProgressReducer(initialState, {
      type: 'toggleBookmark',
      item: {
        id: '7',
        kind: 'station',
        label: 'Station 7',
      },
    });

    const unbookmarked = learnerProgressReducer(bookmarked, {
      type: 'toggleBookmark',
      item: {
        id: '7',
        kind: 'station',
        label: 'Station 7',
      },
    });

    expect(bookmarked.bookmarks).toHaveLength(1);
    expect(unbookmarked.bookmarks).toHaveLength(0);
  });

  it('stores recognition accuracy by station inside module progress', () => {
    const initialState = createInitialLearnerProgress();

    const missedState = learnerProgressReducer(initialState, {
      type: 'recordRecognitionAttempt',
      moduleId: 'station-explorer',
      stationId: '4R',
      wasCorrect: false,
    });

    const correctedState = learnerProgressReducer(missedState, {
      type: 'recordRecognitionAttempt',
      moduleId: 'station-explorer',
      stationId: '4R',
      wasCorrect: true,
    });

    expect(correctedState.moduleProgress['station-explorer'].recognitionStats['4R']).toEqual({
      attempts: 2,
      correct: 1,
    });
  });

  it('stores pretest answers and the latest demo submission summary locally', () => {
    const initialState = createInitialLearnerProgress();

    const answeredState = learnerProgressReducer(initialState, {
      type: 'setPretestAnswer',
      questionId: 'pretest-01',
      optionId: 'b',
    });
    const indexedState = learnerProgressReducer(answeredState, {
      type: 'setPretestQuestionIndex',
      index: 7,
    });
    const submittedState = learnerProgressReducer(indexedState, {
      type: 'submitPretest',
      score: 31,
      answeredCount: 42,
      totalQuestions: 42,
    });

    expect(submittedState.pretest.answers['pretest-01']).toBe('b');
    expect(submittedState.pretest.currentQuestionIndex).toBe(7);
    expect(submittedState.pretest.score).toBe(31);
    expect(submittedState.pretest.answeredCount).toBe(42);
    expect(submittedState.pretest.totalQuestions).toBe(42);
    expect(submittedState.pretest.attemptCount).toBe(1);
    expect(submittedState.pretest.submittedAt).toEqual(expect.any(String));
  });

  it('restores missing modules to the default progress shape', () => {
    const restored = normalizeProgressState({
      version: 1,
      moduleProgress: {
        knobology: {
          percentComplete: 70,
          startedAt: '2026-03-18T00:00:00.000Z',
          completedAt: null,
          lastScreen: 'quiz',
          quizScore: 4,
          recognitionStats: {
            '10R': {
              attempts: 3,
              correct: 2,
            },
          },
        },
      },
      bookmarks: [],
      lastViewedStationId: '4R',
    });

    expect(restored.moduleProgress.knobology.percentComplete).toBe(70);
    expect(restored.moduleProgress.knobology.recognitionStats['10R']).toEqual({
      attempts: 3,
      correct: 2,
    });
    expect(restored.moduleProgress.pretest.percentComplete).toBe(0);
    expect(restored.moduleProgress['station-map'].percentComplete).toBe(0);
    expect(restored.moduleProgress['station-explorer'].percentComplete).toBe(0);
    expect(restored.lastViewedStationId).toBe('4R');
    expect(restored.pretest).toEqual({
      answers: {},
      currentQuestionIndex: 0,
      submittedAt: null,
      score: null,
      answeredCount: 0,
      totalQuestions: 0,
      attemptCount: 0,
    });
  });
});
