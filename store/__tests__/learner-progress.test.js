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
        },
      },
      bookmarks: [],
      lastViewedStationId: '4R',
    });

    expect(restored.moduleProgress.knobology.percentComplete).toBe(70);
    expect(restored.moduleProgress['station-map'].percentComplete).toBe(0);
    expect(restored.moduleProgress['station-explorer'].percentComplete).toBe(0);
    expect(restored.lastViewedStationId).toBe('4R');
  });
});
