import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';

import {
  CASE3D_TOGGLE_SET_IDS,
  DEFAULT_CASE3D_PLANE,
  DEFAULT_CASE3D_VISIBLE_TOGGLE_SET_IDS,
  type Case3DExplorerProgress,
  type CasePlane,
  type ToggleSetId,
} from '@/features/case3d/types';
import { MODULE_IDS } from '@/lib/constants';
import type { BookmarkedItem, LearnerProgressState, ModuleId, ModuleProgress } from '@/lib/types';

const STORAGE_KEY = 'socal-ebus-prep.v1.learner-progress';

type Action =
  | { type: 'hydrate'; payload: LearnerProgressState }
  | { type: 'markVisited'; moduleId: ModuleId; lastScreen: string }
  | { type: 'setModuleProgress'; moduleId: ModuleId; lastScreen: string; percentComplete: number; completed?: boolean }
  | { type: 'toggleModuleCompletion'; moduleId: ModuleId; lastScreen: string }
  | { type: 'toggleBookmark'; item: BookmarkedItem }
  | { type: 'setLastViewedStation'; stationId: string }
  | { type: 'setQuizScore'; moduleId: ModuleId; quizScore: number }
  | { type: 'recordRecognitionAttempt'; moduleId: ModuleId; stationId: string; wasCorrect: boolean }
  | { type: 'updateCase3DExplorer'; update: Partial<Case3DExplorerProgress> }
  | { type: 'markCase3DTargetVisited'; targetId: string }
  | { type: 'setCase3DReviewScore'; reviewScore: number }
  | { type: 'reset' };

interface LearnerProgressContextValue {
  state: LearnerProgressState;
  hydrated: boolean;
  markModuleVisited: (moduleId: ModuleId, lastScreen: string) => void;
  setModuleProgress: (moduleId: ModuleId, update: { lastScreen: string; percentComplete: number; completed?: boolean }) => void;
  toggleModuleCompletion: (moduleId: ModuleId, lastScreen: string) => void;
  toggleBookmark: (item: BookmarkedItem) => void;
  setLastViewedStation: (stationId: string) => void;
  setQuizScore: (moduleId: ModuleId, quizScore: number) => void;
  recordRecognitionAttempt: (moduleId: ModuleId, stationId: string, wasCorrect: boolean) => void;
  updateCase3DExplorer: (update: Partial<Case3DExplorerProgress>) => void;
  markCase3DTargetVisited: (targetId: string) => void;
  setCase3DReviewScore: (reviewScore: number) => void;
  resetProgress: () => void;
}

const LearnerProgressContext = createContext<LearnerProgressContextValue | undefined>(undefined);

function createEmptyModuleProgress(): ModuleProgress {
  return {
    startedAt: null,
    completedAt: null,
    percentComplete: 0,
    lastScreen: null,
    quizScore: null,
    recognitionStats: {},
  };
}

function createInitialCase3DExplorerProgress(): Case3DExplorerProgress {
  return {
    selectedStationId: null,
    selectedTargetId: null,
    selectedPlane: DEFAULT_CASE3D_PLANE,
    visibleToggleSetIds: [...DEFAULT_CASE3D_VISIBLE_TOGGLE_SET_IDS],
    visitedTargetIds: [],
    reviewScore: null,
  };
}

function normalizeVisibleToggleSetIds(value: unknown): ToggleSetId[] {
  if (!Array.isArray(value)) {
    return [...DEFAULT_CASE3D_VISIBLE_TOGGLE_SET_IDS];
  }

  const visibleSet = new Set(
    value.filter(
      (toggleId): toggleId is ToggleSetId =>
        typeof toggleId === 'string' && CASE3D_TOGGLE_SET_IDS.includes(toggleId as ToggleSetId),
    ),
  );
  const normalized = CASE3D_TOGGLE_SET_IDS.filter((toggleId) => visibleSet.has(toggleId));

  if (normalized.length === 0 && value.length > 0) {
    return [...DEFAULT_CASE3D_VISIBLE_TOGGLE_SET_IDS];
  }

  return normalized;
}

function normalizeSelectedPlane(value: unknown): CasePlane {
  return value === 'axial' || value === 'coronal' || value === 'sagittal' ? value : DEFAULT_CASE3D_PLANE;
}

function normalizeCase3DExplorerProgress(candidate: unknown): Case3DExplorerProgress {
  const initialState = createInitialCase3DExplorerProgress();

  if (!candidate || typeof candidate !== 'object') {
    return initialState;
  }

  const raw = candidate as Partial<Case3DExplorerProgress>;

  return {
    selectedStationId: typeof raw.selectedStationId === 'string' ? raw.selectedStationId : null,
    selectedTargetId: typeof raw.selectedTargetId === 'string' ? raw.selectedTargetId : null,
    selectedPlane: normalizeSelectedPlane(raw.selectedPlane),
    visibleToggleSetIds: normalizeVisibleToggleSetIds(raw.visibleToggleSetIds),
    visitedTargetIds: Array.isArray(raw.visitedTargetIds)
      ? [...new Set(raw.visitedTargetIds.filter((targetId): targetId is string => typeof targetId === 'string'))]
      : [],
    reviewScore: typeof raw.reviewScore === 'number' ? raw.reviewScore : null,
  };
}

function areStringArraysEqual(left: string[], right: string[]) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

export function createInitialLearnerProgress(): LearnerProgressState {
  return {
    version: 2,
    moduleProgress: {
      knobology: createEmptyModuleProgress(),
      'station-map': createEmptyModuleProgress(),
      'station-explorer': createEmptyModuleProgress(),
      'case-3d-explorer': createEmptyModuleProgress(),
    },
    bookmarks: [],
    lastViewedStationId: null,
    case3dExplorer: createInitialCase3DExplorerProgress(),
  };
}

export function normalizeProgressState(candidate: unknown): LearnerProgressState {
  const initialState = createInitialLearnerProgress();

  if (!candidate || typeof candidate !== 'object') {
    return initialState;
  }

  const raw = candidate as Partial<LearnerProgressState>;
  const moduleProgress = { ...initialState.moduleProgress };

  for (const moduleId of MODULE_IDS) {
    const maybeModule = raw.moduleProgress?.[moduleId];

    if (!maybeModule || typeof maybeModule !== 'object') {
      continue;
    }

    moduleProgress[moduleId] = {
      startedAt: typeof maybeModule.startedAt === 'string' ? maybeModule.startedAt : null,
      completedAt: typeof maybeModule.completedAt === 'string' ? maybeModule.completedAt : null,
      percentComplete:
        typeof maybeModule.percentComplete === 'number'
          ? Math.max(0, Math.min(100, maybeModule.percentComplete))
          : 0,
      lastScreen: typeof maybeModule.lastScreen === 'string' ? maybeModule.lastScreen : null,
      quizScore: typeof maybeModule.quizScore === 'number' ? maybeModule.quizScore : null,
      recognitionStats:
        maybeModule.recognitionStats && typeof maybeModule.recognitionStats === 'object'
          ? Object.fromEntries(
              Object.entries(maybeModule.recognitionStats).flatMap(([stationId, stat]) => {
                if (!stat || typeof stat !== 'object') {
                  return [];
                }

                const attempts = typeof stat.attempts === 'number' ? Math.max(0, stat.attempts) : 0;
                const correct = typeof stat.correct === 'number' ? Math.max(0, stat.correct) : 0;

                return [[stationId, { attempts, correct: Math.min(correct, attempts) }]];
              }),
            )
          : {},
    };
  }

  return {
    version: 2,
    moduleProgress,
    bookmarks: Array.isArray(raw.bookmarks)
      ? raw.bookmarks.filter((bookmark): bookmark is BookmarkedItem => {
          return (
            Boolean(bookmark) &&
            typeof bookmark.id === 'string' &&
            typeof bookmark.label === 'string' &&
            (bookmark.kind === 'module' || bookmark.kind === 'station' || bookmark.kind === 'card')
          );
        })
      : [],
    lastViewedStationId: typeof raw.lastViewedStationId === 'string' ? raw.lastViewedStationId : null,
    case3dExplorer: normalizeCase3DExplorerProgress(raw.case3dExplorer),
  };
}

export function learnerProgressReducer(
  state: LearnerProgressState,
  action: Action,
): LearnerProgressState {
  switch (action.type) {
    case 'hydrate':
      return normalizeProgressState(action.payload);
    case 'markVisited': {
      const current = state.moduleProgress[action.moduleId];

      return {
        ...state,
        moduleProgress: {
          ...state.moduleProgress,
          [action.moduleId]: {
            ...current,
            startedAt: current.startedAt ?? new Date().toISOString(),
            percentComplete: Math.max(current.percentComplete, 20),
            lastScreen: action.lastScreen,
          },
        },
      };
    }
    case 'setModuleProgress': {
      const current = state.moduleProgress[action.moduleId];
      const clampedPercent = Math.max(0, Math.min(100, action.percentComplete));
      const startedAt = current.startedAt ?? new Date().toISOString();
      const completedAt =
        action.completed || clampedPercent >= 100
          ? current.completedAt ?? new Date().toISOString()
          : current.completedAt;
      const percentComplete = Math.max(current.percentComplete, clampedPercent);

      if (
        current.startedAt === startedAt &&
        current.completedAt === completedAt &&
        current.percentComplete === percentComplete &&
        current.lastScreen === action.lastScreen
      ) {
        return state;
      }

      return {
        ...state,
        moduleProgress: {
          ...state.moduleProgress,
          [action.moduleId]: {
            ...current,
            startedAt,
            completedAt,
            percentComplete,
            lastScreen: action.lastScreen,
          },
        },
      };
    }
    case 'toggleModuleCompletion': {
      const current = state.moduleProgress[action.moduleId];
      const isComplete = Boolean(current.completedAt);

      return {
        ...state,
        moduleProgress: {
          ...state.moduleProgress,
          [action.moduleId]: {
            ...current,
            startedAt: current.startedAt ?? new Date().toISOString(),
            completedAt: isComplete ? null : new Date().toISOString(),
            percentComplete: isComplete ? 20 : 100,
            lastScreen: action.lastScreen,
          },
        },
      };
    }
    case 'toggleBookmark': {
      const exists = state.bookmarks.some(
        (bookmark) => bookmark.id === action.item.id && bookmark.kind === action.item.kind,
      );

      return {
        ...state,
        bookmarks: exists
          ? state.bookmarks.filter(
              (bookmark) => !(bookmark.id === action.item.id && bookmark.kind === action.item.kind),
            )
          : [...state.bookmarks, action.item],
      };
    }
    case 'setLastViewedStation':
      if (state.lastViewedStationId === action.stationId) {
        return state;
      }

      return {
        ...state,
        lastViewedStationId: action.stationId,
      };
    case 'setQuizScore': {
      const current = state.moduleProgress[action.moduleId];
      const startedAt = current.startedAt ?? new Date().toISOString();
      const percentComplete = Math.max(current.percentComplete, 60);

      if (
        current.startedAt === startedAt &&
        current.percentComplete === percentComplete &&
        current.quizScore === action.quizScore
      ) {
        return state;
      }

      return {
        ...state,
        moduleProgress: {
          ...state.moduleProgress,
          [action.moduleId]: {
            ...current,
            startedAt,
            percentComplete,
            quizScore: action.quizScore,
          },
        },
      };
    }
    case 'recordRecognitionAttempt': {
      const current = state.moduleProgress[action.moduleId];
      const currentStat = current.recognitionStats[action.stationId] ?? {
        attempts: 0,
        correct: 0,
      };

      return {
        ...state,
        moduleProgress: {
          ...state.moduleProgress,
          [action.moduleId]: {
            ...current,
            startedAt: current.startedAt ?? new Date().toISOString(),
            recognitionStats: {
              ...current.recognitionStats,
              [action.stationId]: {
                attempts: currentStat.attempts + 1,
                correct: currentStat.correct + (action.wasCorrect ? 1 : 0),
              },
            },
          },
        },
      };
    }
    case 'updateCase3DExplorer': {
      const nextSelectedPlane = normalizeSelectedPlane(
        action.update.selectedPlane ?? state.case3dExplorer.selectedPlane,
      );
      const nextVisibleToggleSetIds = normalizeVisibleToggleSetIds(
        action.update.visibleToggleSetIds ?? state.case3dExplorer.visibleToggleSetIds,
      );
      const nextVisitedTargetIds = Array.isArray(action.update.visitedTargetIds)
        ? [...new Set(action.update.visitedTargetIds.filter((targetId): targetId is string => typeof targetId === 'string'))]
        : state.case3dExplorer.visitedTargetIds;
      const nextSelectedStationId =
        typeof action.update.selectedStationId === 'string'
          ? action.update.selectedStationId
          : state.case3dExplorer.selectedStationId;
      const nextSelectedTargetId =
        typeof action.update.selectedTargetId === 'string'
          ? action.update.selectedTargetId
          : state.case3dExplorer.selectedTargetId;
      const nextReviewScore =
        typeof action.update.reviewScore === 'number'
          ? action.update.reviewScore
          : action.update.reviewScore === null
            ? null
            : state.case3dExplorer.reviewScore;

      if (
        state.case3dExplorer.selectedPlane === nextSelectedPlane &&
        state.case3dExplorer.selectedStationId === nextSelectedStationId &&
        state.case3dExplorer.selectedTargetId === nextSelectedTargetId &&
        state.case3dExplorer.reviewScore === nextReviewScore &&
        areStringArraysEqual(state.case3dExplorer.visibleToggleSetIds, nextVisibleToggleSetIds) &&
        areStringArraysEqual(state.case3dExplorer.visitedTargetIds, nextVisitedTargetIds)
      ) {
        return state;
      }

      return {
        ...state,
        case3dExplorer: {
          ...state.case3dExplorer,
          ...action.update,
          selectedPlane: nextSelectedPlane,
          visibleToggleSetIds: nextVisibleToggleSetIds,
          visitedTargetIds: nextVisitedTargetIds,
        },
      };
    }
    case 'markCase3DTargetVisited':
      if (state.case3dExplorer.visitedTargetIds.includes(action.targetId)) {
        return state;
      }

      return {
        ...state,
        case3dExplorer: {
          ...state.case3dExplorer,
          visitedTargetIds: [...state.case3dExplorer.visitedTargetIds, action.targetId],
        },
      };
    case 'setCase3DReviewScore':
      if (state.case3dExplorer.reviewScore === action.reviewScore) {
        return state;
      }

      return {
        ...state,
        case3dExplorer: {
          ...state.case3dExplorer,
          reviewScore: action.reviewScore,
        },
      };
    case 'reset':
      return createInitialLearnerProgress();
    default:
      return state;
  }
}

export function LearnerProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(learnerProgressReducer, undefined, createInitialLearnerProgress);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function hydrateProgress() {
      try {
        const storedValue = await AsyncStorage.getItem(STORAGE_KEY);

        if (!cancelled && storedValue) {
          dispatch({
            type: 'hydrate',
            payload: normalizeProgressState(JSON.parse(storedValue)),
          });
        }
      } catch {
        // Ignore malformed or unavailable storage and continue with defaults.
      } finally {
        if (!cancelled) {
          setHydrated(true);
        }
      }
    }

    hydrateProgress();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {
      // Persist best-effort only for the scaffold.
    });
  }, [hydrated, state]);

  const value = useMemo<LearnerProgressContextValue>(
    () => ({
      state,
      hydrated,
      markModuleVisited: (moduleId, lastScreen) =>
        dispatch({ type: 'markVisited', moduleId, lastScreen }),
      setModuleProgress: (moduleId, update) =>
        dispatch({ type: 'setModuleProgress', moduleId, ...update }),
      toggleModuleCompletion: (moduleId, lastScreen) =>
        dispatch({ type: 'toggleModuleCompletion', moduleId, lastScreen }),
      toggleBookmark: (item) => dispatch({ type: 'toggleBookmark', item }),
      setLastViewedStation: (stationId) => dispatch({ type: 'setLastViewedStation', stationId }),
      setQuizScore: (moduleId, quizScore) => dispatch({ type: 'setQuizScore', moduleId, quizScore }),
      recordRecognitionAttempt: (moduleId, stationId, wasCorrect) =>
        dispatch({ type: 'recordRecognitionAttempt', moduleId, stationId, wasCorrect }),
      updateCase3DExplorer: (update) => dispatch({ type: 'updateCase3DExplorer', update }),
      markCase3DTargetVisited: (targetId) => dispatch({ type: 'markCase3DTargetVisited', targetId }),
      setCase3DReviewScore: (reviewScore) => dispatch({ type: 'setCase3DReviewScore', reviewScore }),
      resetProgress: () => dispatch({ type: 'reset' }),
    }),
    [hydrated, state],
  );

  return (
    <LearnerProgressContext.Provider value={value}>{children}</LearnerProgressContext.Provider>
  );
}

export function useLearnerProgress() {
  const context = useContext(LearnerProgressContext);

  if (!context) {
    throw new Error('useLearnerProgress must be used within LearnerProgressProvider');
  }

  return context;
}

export function getCompletedModuleCount(state: LearnerProgressState) {
  return MODULE_IDS.filter((moduleId) => Boolean(state.moduleProgress[moduleId].completedAt)).length;
}

export function isBookmarked(state: LearnerProgressState, id: string, kind: BookmarkedItem['kind']) {
  return state.bookmarks.some((bookmark) => bookmark.id === id && bookmark.kind === kind);
}
