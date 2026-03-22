jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

import {
  createInitialLearnerProgress,
  learnerProgressReducer,
  normalizeProgressState,
} from '../learner-progress';

describe('case3d learner progress', () => {
  it('stores the case explorer resume state in the shared reducer', () => {
    const initialState = createInitialLearnerProgress();
    const nextState = learnerProgressReducer(initialState, {
      type: 'updateCase3DExplorer',
      update: {
        selectedStationId: '4R',
        selectedTargetId: 'node_4R_2',
        selectedPlane: 'sagittal',
        visibleToggleSetIds: ['lymph_nodes', 'airway'],
      },
    });

    expect(nextState.case3dExplorer.selectedStationId).toBe('4R');
    expect(nextState.case3dExplorer.selectedTargetId).toBe('node_4R_2');
    expect(nextState.case3dExplorer.selectedPlane).toBe('sagittal');
    expect(nextState.case3dExplorer.visibleToggleSetIds).toEqual(['lymph_nodes', 'airway']);
  });

  it('deduplicates visited target ids', () => {
    const initialState = createInitialLearnerProgress();
    const visitedOnce = learnerProgressReducer(initialState, {
      type: 'markCase3DTargetVisited',
      targetId: 'node_4R_1',
    });
    const visitedTwice = learnerProgressReducer(visitedOnce, {
      type: 'markCase3DTargetVisited',
      targetId: 'node_4R_1',
    });

    expect(visitedTwice.case3dExplorer.visitedTargetIds).toEqual(['node_4R_1']);
  });

  it('restores missing or malformed case explorer state to sane defaults', () => {
    const restored = normalizeProgressState({
      version: 1,
      moduleProgress: {},
      bookmarks: [],
      lastViewedStationId: null,
      case3dExplorer: {
        selectedPlane: 'not-a-plane',
        visibleToggleSetIds: ['bogus'],
        visitedTargetIds: ['node_4R_1', 7, 'node_4R_1'],
      },
    });

    expect(restored.case3dExplorer.selectedPlane).toBe('axial');
    expect(restored.case3dExplorer.visibleToggleSetIds).toEqual(['lymph_nodes', 'airway', 'vessels']);
    expect(restored.case3dExplorer.visitedTargetIds).toEqual(['node_4R_1']);
  });
});
