import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';

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
  };
}

export function createInitialLearnerProgress(): LearnerProgressState {
  return {
    version: 1,
    moduleProgress: {
      knobology: createEmptyModuleProgress(),
      'station-map': createEmptyModuleProgress(),
      'station-explorer': createEmptyModuleProgress(),
    },
    bookmarks: [],
    lastViewedStationId: null,
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
    };
  }

  return {
    version: 1,
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

      return {
        ...state,
        moduleProgress: {
          ...state.moduleProgress,
          [action.moduleId]: {
            ...current,
            startedAt: current.startedAt ?? new Date().toISOString(),
            completedAt:
              action.completed || clampedPercent >= 100
                ? current.completedAt ?? new Date().toISOString()
                : current.completedAt,
            percentComplete: Math.max(current.percentComplete, clampedPercent),
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
      return {
        ...state,
        lastViewedStationId: action.stationId,
      };
    case 'setQuizScore': {
      const current = state.moduleProgress[action.moduleId];

      return {
        ...state,
        moduleProgress: {
          ...state.moduleProgress,
          [action.moduleId]: {
            ...current,
            startedAt: current.startedAt ?? new Date().toISOString(),
            percentComplete: Math.max(current.percentComplete, 60),
            quizScore: action.quizScore,
          },
        },
      };
    }
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
