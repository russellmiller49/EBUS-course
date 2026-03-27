import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';

import type { AppRouteId, KnobologyControlId } from '@/content/types';

const STORAGE_KEY = 'socal-ebus-prep.web.learner-progress';

type ModuleProgressId = 'knobology' | 'station-map' | 'station-explorer' | 'lectures' | 'quiz' | 'case-001';

export interface ModuleProgress {
  visitedAt: string | null;
  completedAt: string | null;
  percentComplete: number;
}

export interface LectureWatchState {
  completed: boolean;
  watchedSeconds: number;
  lastOpenedAt: string | null;
}

export interface QuizHistoryEntry {
  id: string;
  label: string;
  moduleId: ModuleProgressId | 'mixed';
  correctCount: number;
  totalCount: number;
  percent: number;
  completedAt: string;
}

export interface LearnerProgressState {
  version: 1;
  moduleProgress: Record<ModuleProgressId, ModuleProgress>;
  bookmarkedStations: string[];
  stationRecognitionStats: Record<string, { attempts: number; correct: number }>;
  lectureWatchStatus: Record<string, LectureWatchState>;
  quizScoreHistory: QuizHistoryEntry[];
  lastViewedStationId: string | null;
  lastUsedKnobologyControl: KnobologyControlId | null;
}

type Action =
  | { type: 'hydrate'; payload: LearnerProgressState }
  | { type: 'visitModule'; moduleId: ModuleProgressId; percentFloor?: number }
  | { type: 'setModuleProgress'; moduleId: ModuleProgressId; percent: number; completed?: boolean }
  | { type: 'toggleStationBookmark'; stationId: string }
  | { type: 'setLectureState'; lectureId: string; watchedSeconds?: number; completed?: boolean }
  | { type: 'recordQuizResult'; entry: QuizHistoryEntry }
  | { type: 'recordRecognitionAttempt'; stationId: string; correct: boolean }
  | { type: 'setLastViewedStation'; stationId: string }
  | { type: 'setLastUsedKnobologyControl'; controlId: KnobologyControlId }
  | { type: 'reset' };

interface LearnerProgressContextValue {
  state: LearnerProgressState;
  hydrated: boolean;
  visitRoute: (routeId: AppRouteId) => void;
  setModuleProgress: (moduleId: ModuleProgressId, percent: number, completed?: boolean) => void;
  toggleStationBookmark: (stationId: string) => void;
  setLectureState: (lectureId: string, update: { watchedSeconds?: number; completed?: boolean }) => void;
  recordQuizResult: (entry: Omit<QuizHistoryEntry, 'completedAt'>) => void;
  recordRecognitionAttempt: (stationId: string, correct: boolean) => void;
  setLastViewedStation: (stationId: string) => void;
  setLastUsedKnobologyControl: (controlId: KnobologyControlId) => void;
  reset: () => void;
}

const LearnerProgressContext = createContext<LearnerProgressContextValue | undefined>(undefined);

function createModuleProgress(): ModuleProgress {
  return {
    visitedAt: null,
    completedAt: null,
    percentComplete: 0,
  };
}

export function createInitialLearnerProgress(): LearnerProgressState {
  return {
    version: 1,
    moduleProgress: {
      knobology: createModuleProgress(),
      'station-map': createModuleProgress(),
      'station-explorer': createModuleProgress(),
      lectures: createModuleProgress(),
      quiz: createModuleProgress(),
      'case-001': createModuleProgress(),
    },
    bookmarkedStations: [],
    stationRecognitionStats: {},
    lectureWatchStatus: {},
    quizScoreHistory: [],
    lastViewedStationId: null,
    lastUsedKnobologyControl: null,
  };
}

export function normalizeLearnerProgress(candidate: unknown): LearnerProgressState {
  const initial = createInitialLearnerProgress();

  if (!candidate || typeof candidate !== 'object') {
    return initial;
  }

  const raw = candidate as Partial<LearnerProgressState>;
  const nextModuleProgress = { ...initial.moduleProgress };

  for (const moduleId of Object.keys(nextModuleProgress) as ModuleProgressId[]) {
    const maybeProgress = raw.moduleProgress?.[moduleId];

    if (!maybeProgress || typeof maybeProgress !== 'object') {
      continue;
    }

    nextModuleProgress[moduleId] = {
      visitedAt: typeof maybeProgress.visitedAt === 'string' ? maybeProgress.visitedAt : null,
      completedAt: typeof maybeProgress.completedAt === 'string' ? maybeProgress.completedAt : null,
      percentComplete:
        typeof maybeProgress.percentComplete === 'number'
          ? Math.max(0, Math.min(100, maybeProgress.percentComplete))
          : 0,
    };
  }

  return {
    version: 1,
    moduleProgress: nextModuleProgress,
    bookmarkedStations: Array.isArray(raw.bookmarkedStations)
      ? raw.bookmarkedStations.filter((stationId): stationId is string => typeof stationId === 'string')
      : [],
    stationRecognitionStats:
      raw.stationRecognitionStats && typeof raw.stationRecognitionStats === 'object'
        ? Object.fromEntries(
            Object.entries(raw.stationRecognitionStats).flatMap(([stationId, value]) => {
              if (!value || typeof value !== 'object') {
                return [];
              }

              const attempts = typeof value.attempts === 'number' ? Math.max(0, value.attempts) : 0;
              const correct = typeof value.correct === 'number' ? Math.max(0, Math.min(value.correct, attempts)) : 0;

              return [[stationId, { attempts, correct }]];
            }),
          )
        : {},
    lectureWatchStatus:
      raw.lectureWatchStatus && typeof raw.lectureWatchStatus === 'object'
        ? Object.fromEntries(
            Object.entries(raw.lectureWatchStatus).flatMap(([lectureId, value]) => {
              if (!value || typeof value !== 'object') {
                return [];
              }

              return [
                [
                  lectureId,
                  {
                    completed: typeof value.completed === 'boolean' ? value.completed : false,
                    watchedSeconds: typeof value.watchedSeconds === 'number' ? Math.max(0, value.watchedSeconds) : 0,
                    lastOpenedAt: typeof value.lastOpenedAt === 'string' ? value.lastOpenedAt : null,
                  } satisfies LectureWatchState,
                ],
              ];
            }),
          )
        : {},
    quizScoreHistory: Array.isArray(raw.quizScoreHistory)
      ? raw.quizScoreHistory.filter((entry): entry is QuizHistoryEntry => {
          return (
            Boolean(entry) &&
            typeof entry.id === 'string' &&
            typeof entry.label === 'string' &&
            typeof entry.correctCount === 'number' &&
            typeof entry.totalCount === 'number' &&
            typeof entry.percent === 'number' &&
            typeof entry.completedAt === 'string'
          );
        })
      : [],
    lastViewedStationId: typeof raw.lastViewedStationId === 'string' ? raw.lastViewedStationId : null,
    lastUsedKnobologyControl:
      raw.lastUsedKnobologyControl &&
      [
        'depth',
        'gain',
        'contrast',
        'color-doppler',
        'calipers',
        'freeze',
        'save',
      ].includes(raw.lastUsedKnobologyControl)
        ? raw.lastUsedKnobologyControl
        : null,
  };
}

function getModuleForRoute(routeId: AppRouteId): ModuleProgressId | null {
  if (routeId === 'home') {
    return null;
  }

  if (routeId === 'stations') {
    return 'station-map';
  }

  if (routeId === 'case-001') {
    return 'case-001';
  }

  return routeId;
}

export function learnerProgressReducer(state: LearnerProgressState, action: Action): LearnerProgressState {
  switch (action.type) {
    case 'hydrate':
      return normalizeLearnerProgress(action.payload);
    case 'visitModule': {
      const current = state.moduleProgress[action.moduleId];
      const nextPercent = Math.max(current.percentComplete, action.percentFloor ?? 15);

      if (current.visitedAt && nextPercent === current.percentComplete) {
        return state;
      }

      return {
        ...state,
        moduleProgress: {
          ...state.moduleProgress,
          [action.moduleId]: {
            ...current,
            visitedAt: current.visitedAt ?? new Date().toISOString(),
            percentComplete: nextPercent,
          },
        },
      };
    }
    case 'setModuleProgress': {
      const current = state.moduleProgress[action.moduleId];
      const nextPercent = Math.max(current.percentComplete, Math.max(0, Math.min(100, action.percent)));
      const completedAt =
        action.completed || nextPercent >= 100 ? current.completedAt ?? new Date().toISOString() : current.completedAt;

      if (current.visitedAt && current.percentComplete === nextPercent && current.completedAt === completedAt) {
        return state;
      }

      return {
        ...state,
        moduleProgress: {
          ...state.moduleProgress,
          [action.moduleId]: {
            ...current,
            visitedAt: current.visitedAt ?? new Date().toISOString(),
            percentComplete: nextPercent,
            completedAt,
          },
        },
      };
    }
    case 'toggleStationBookmark': {
      const exists = state.bookmarkedStations.includes(action.stationId);

      return {
        ...state,
        bookmarkedStations: exists
          ? state.bookmarkedStations.filter((stationId) => stationId !== action.stationId)
          : [...state.bookmarkedStations, action.stationId],
      };
    }
    case 'setLectureState': {
      const current = state.lectureWatchStatus[action.lectureId] ?? {
        completed: false,
        watchedSeconds: 0,
        lastOpenedAt: null,
      };
      const nextCompleted = action.completed ?? current.completed;
      const nextWatchedSeconds = Math.max(current.watchedSeconds, action.watchedSeconds ?? current.watchedSeconds);

      if (current.completed === nextCompleted && current.watchedSeconds === nextWatchedSeconds) {
        return state;
      }

      return {
        ...state,
        lectureWatchStatus: {
          ...state.lectureWatchStatus,
          [action.lectureId]: {
            completed: nextCompleted,
            watchedSeconds: nextWatchedSeconds,
            lastOpenedAt: new Date().toISOString(),
          },
        },
      };
    }
    case 'recordQuizResult':
      return {
        ...state,
        quizScoreHistory: [action.entry, ...state.quizScoreHistory].slice(0, 12),
      };
    case 'recordRecognitionAttempt': {
      const current = state.stationRecognitionStats[action.stationId] ?? { attempts: 0, correct: 0 };

      return {
        ...state,
        stationRecognitionStats: {
          ...state.stationRecognitionStats,
          [action.stationId]: {
            attempts: current.attempts + 1,
            correct: current.correct + (action.correct ? 1 : 0),
          },
        },
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
    case 'setLastUsedKnobologyControl':
      if (state.lastUsedKnobologyControl === action.controlId) {
        return state;
      }

      return {
        ...state,
        lastUsedKnobologyControl: action.controlId,
      };
    case 'reset':
      return createInitialLearnerProgress();
    default:
      return state;
  }
}

export function LearnerProgressProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(learnerProgressReducer, undefined, createInitialLearnerProgress);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);

      if (raw) {
        dispatch({
          type: 'hydrate',
          payload: normalizeLearnerProgress(JSON.parse(raw)),
        });
      }
    } catch {
      // Ignore malformed storage and keep defaults.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, state]);

  const visitRoute = useCallback((routeId: AppRouteId) => {
    const moduleId = getModuleForRoute(routeId);

    if (moduleId) {
      dispatch({ type: 'visitModule', moduleId });
    }

    if (routeId === 'stations') {
      dispatch({ type: 'visitModule', moduleId: 'station-explorer', percentFloor: 10 });
    }
  }, []);

  const setModuleProgress = useCallback((moduleId: ModuleProgressId, percent: number, completed?: boolean) => {
    dispatch({ type: 'setModuleProgress', moduleId, percent, completed });
  }, []);

  const toggleStationBookmark = useCallback((stationId: string) => {
    dispatch({ type: 'toggleStationBookmark', stationId });
  }, []);

  const setLectureState = useCallback(
    (lectureId: string, update: { watchedSeconds?: number; completed?: boolean }) => {
      dispatch({
        type: 'setLectureState',
        lectureId,
        watchedSeconds: update.watchedSeconds,
        completed: update.completed,
      });
    },
    [],
  );

  const recordQuizResult = useCallback((entry: Omit<QuizHistoryEntry, 'completedAt'>) => {
    dispatch({
      type: 'recordQuizResult',
      entry: {
        ...entry,
        completedAt: new Date().toISOString(),
      },
    });
  }, []);

  const recordRecognitionAttempt = useCallback((stationId: string, correct: boolean) => {
    dispatch({ type: 'recordRecognitionAttempt', stationId, correct });
  }, []);

  const setLastViewedStation = useCallback((stationId: string) => {
    dispatch({ type: 'setLastViewedStation', stationId });
  }, []);

  const setLastUsedKnobologyControl = useCallback((controlId: KnobologyControlId) => {
    dispatch({ type: 'setLastUsedKnobologyControl', controlId });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'reset' });
  }, []);

  const value: LearnerProgressContextValue = useMemo(
    () => ({
      state,
      hydrated,
      visitRoute,
      setModuleProgress,
      toggleStationBookmark,
      setLectureState,
      recordQuizResult,
      recordRecognitionAttempt,
      setLastViewedStation,
      setLastUsedKnobologyControl,
      reset,
    }),
    [
      hydrated,
      recordQuizResult,
      recordRecognitionAttempt,
      reset,
      setLastUsedKnobologyControl,
      setLastViewedStation,
      setLectureState,
      setModuleProgress,
      state,
      toggleStationBookmark,
      visitRoute,
    ],
  );

  return <LearnerProgressContext.Provider value={value}>{children}</LearnerProgressContext.Provider>;
}

export function useLearnerProgress() {
  const context = useContext(LearnerProgressContext);

  if (!context) {
    throw new Error('useLearnerProgress must be used within LearnerProgressProvider.');
  }

  return context;
}
