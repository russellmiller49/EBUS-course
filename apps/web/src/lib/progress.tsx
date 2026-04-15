import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';

import type { AppRouteId, KnobologyControlId, TrackedLearningRouteId } from '@/content/types';
import { useAuth } from '@/lib/auth';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { syncLearnerSnapshot } from '@/lib/supabaseTracking';

const STORAGE_KEY = 'socal-ebus-prep.web.learner-progress';

export interface StoredLearnerProgressRecord {
  savedAt: string | null;
  state: LearnerProgressState;
}

export type ModuleProgressId = 'pretest' | 'knobology' | 'station-map' | 'station-explorer' | 'lectures' | 'quiz' | 'case-001';

function createEngagementSummary() {
  return {
    lastTrackedAt: null,
    totalSeconds: 0,
  };
}

export interface ModuleProgress {
  visitedAt: string | null;
  completedAt: string | null;
  percentComplete: number;
}

export interface LectureWatchState {
  completed: boolean;
  completedAt: string | null;
  watchedSeconds: number;
  lastOpenedAt: string | null;
}

export interface ModuleEngagementSummary {
  totalSeconds: number;
  lastTrackedAt: string | null;
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

export interface PretestProgress {
  answers: Record<string, string>;
  currentQuestionIndex: number;
  submittedAt: string | null;
  unlockedByPasscodeAt: string | null;
  score: number | null;
  answeredCount: number;
  totalQuestions: number;
  attemptCount: number;
}

export interface LearnerProgressState {
  version: 4;
  moduleProgress: Record<ModuleProgressId, ModuleProgress>;
  bookmarkedStations: string[];
  stationRecognitionStats: Record<string, { attempts: number; correct: number }>;
  lectureWatchStatus: Record<string, LectureWatchState>;
  engagement: Record<TrackedLearningRouteId, ModuleEngagementSummary>;
  quizScoreHistory: QuizHistoryEntry[];
  pretest: PretestProgress;
  lastViewedStationId: string | null;
  lastUsedKnobologyControl: KnobologyControlId | null;
}

function isValidTimestamp(value: string | null) {
  return Boolean(value && Number.isFinite(Date.parse(value)));
}

export function getLearnerProgressStorageKey(userId: string | null) {
  return userId ? `${STORAGE_KEY}:${userId}` : STORAGE_KEY;
}

type Action =
  | { type: 'hydrate'; payload: LearnerProgressState }
  | { type: 'visitModule'; moduleId: ModuleProgressId; percentFloor?: number }
  | { type: 'setModuleProgress'; moduleId: ModuleProgressId; percent: number; completed?: boolean }
  | { type: 'toggleStationBookmark'; stationId: string }
  | { type: 'setLectureState'; lectureId: string; watchedSeconds?: number; completed?: boolean; opened?: boolean }
  | { type: 'recordQuizResult'; entry: QuizHistoryEntry }
  | { type: 'recordRecognitionAttempt'; stationId: string; correct: boolean }
  | { type: 'recordModuleEngagement'; moduleId: TrackedLearningRouteId; seconds: number }
  | { type: 'setPretestAnswer'; questionId: string; optionId: string }
  | { type: 'setPretestQuestionIndex'; index: number }
  | { type: 'unlockPretestWithPasscode' }
  | { type: 'submitPretest'; score: number; answeredCount: number; totalQuestions: number }
  | { type: 'setLastViewedStation'; stationId: string }
  | { type: 'setLastUsedKnobologyControl'; controlId: KnobologyControlId }
  | { type: 'reset' };

interface LearnerProgressContextValue {
  state: LearnerProgressState;
  hydrated: boolean;
  visitRoute: (routeId: AppRouteId) => void;
  setModuleProgress: (moduleId: ModuleProgressId, percent: number, completed?: boolean) => void;
  toggleStationBookmark: (stationId: string) => void;
  setLectureState: (lectureId: string, update: { watchedSeconds?: number; completed?: boolean; opened?: boolean }) => void;
  recordModuleEngagement: (moduleId: TrackedLearningRouteId, seconds: number) => void;
  recordQuizResult: (entry: Omit<QuizHistoryEntry, 'completedAt'>) => void;
  recordRecognitionAttempt: (stationId: string, correct: boolean) => void;
  setPretestAnswer: (questionId: string, optionId: string) => void;
  setPretestQuestionIndex: (index: number) => void;
  submitPretest: (summary: { score: number; answeredCount: number; totalQuestions: number }) => void;
  unlockPretestWithPasscode: () => void;
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

function createPretestProgress(): PretestProgress {
  return {
    answers: {},
    currentQuestionIndex: 0,
    submittedAt: null,
    unlockedByPasscodeAt: null,
    score: null,
    answeredCount: 0,
    totalQuestions: 0,
    attemptCount: 0,
  };
}

export function createInitialLearnerProgress(): LearnerProgressState {
  return {
    version: 4,
    moduleProgress: {
      pretest: createModuleProgress(),
      knobology: createModuleProgress(),
      'station-map': createModuleProgress(),
      'station-explorer': createModuleProgress(),
      lectures: createModuleProgress(),
      quiz: createModuleProgress(),
      'case-001': createModuleProgress(),
    },
    bookmarkedStations: [],
    stationRecognitionStats: {},
    engagement: {
      pretest: createEngagementSummary(),
      lectures: createEngagementSummary(),
      knobology: createEngagementSummary(),
      stations: createEngagementSummary(),
      quiz: createEngagementSummary(),
      'case-001': createEngagementSummary(),
    },
    lectureWatchStatus: {},
    quizScoreHistory: [],
    pretest: createPretestProgress(),
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
    version: 4,
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
                    completedAt: typeof value.completedAt === 'string' ? value.completedAt : null,
                    watchedSeconds: typeof value.watchedSeconds === 'number' ? Math.max(0, value.watchedSeconds) : 0,
                    lastOpenedAt: typeof value.lastOpenedAt === 'string' ? value.lastOpenedAt : null,
                  } satisfies LectureWatchState,
                ],
              ];
            }),
          )
        : {},
    engagement:
      raw.engagement && typeof raw.engagement === 'object'
        ? {
            pretest: normalizeEngagementRecord(raw.engagement.pretest),
            lectures: normalizeEngagementRecord(raw.engagement.lectures),
            knobology: normalizeEngagementRecord(raw.engagement.knobology),
            stations: normalizeEngagementRecord(raw.engagement.stations),
            quiz: normalizeEngagementRecord(raw.engagement.quiz),
            'case-001': normalizeEngagementRecord(raw.engagement['case-001']),
          }
        : initial.engagement,
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
    pretest:
      raw.pretest && typeof raw.pretest === 'object'
        ? {
            answers:
              raw.pretest.answers && typeof raw.pretest.answers === 'object'
                ? Object.fromEntries(
                    Object.entries(raw.pretest.answers).flatMap(([questionId, optionId]) =>
                      typeof optionId === 'string' ? [[questionId, optionId]] : [],
                    ),
                  )
                : {},
            currentQuestionIndex:
              typeof raw.pretest.currentQuestionIndex === 'number'
                ? Math.max(0, Math.floor(raw.pretest.currentQuestionIndex))
                : 0,
            submittedAt: typeof raw.pretest.submittedAt === 'string' ? raw.pretest.submittedAt : null,
            unlockedByPasscodeAt:
              typeof raw.pretest.unlockedByPasscodeAt === 'string' ? raw.pretest.unlockedByPasscodeAt : null,
            score: typeof raw.pretest.score === 'number' ? Math.max(0, raw.pretest.score) : null,
            answeredCount:
              typeof raw.pretest.answeredCount === 'number' ? Math.max(0, Math.floor(raw.pretest.answeredCount)) : 0,
            totalQuestions:
              typeof raw.pretest.totalQuestions === 'number' ? Math.max(0, Math.floor(raw.pretest.totalQuestions)) : 0,
            attemptCount:
              typeof raw.pretest.attemptCount === 'number' ? Math.max(0, Math.floor(raw.pretest.attemptCount)) : 0,
          }
        : createPretestProgress(),
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

export function parseStoredLearnerProgress(candidate: unknown): StoredLearnerProgressRecord | null {
  if (!candidate || typeof candidate !== 'object') {
    return null;
  }

  const raw = candidate as Partial<StoredLearnerProgressRecord> & { state?: unknown };

  if ('state' in raw) {
    return {
      savedAt: typeof raw.savedAt === 'string' ? raw.savedAt : null,
      state: normalizeLearnerProgress(raw.state),
    };
  }

  return {
    savedAt: null,
    state: normalizeLearnerProgress(candidate),
  };
}

export function chooseStoredLearnerProgress(
  local: StoredLearnerProgressRecord | null,
  remote: StoredLearnerProgressRecord | null,
) {
  if (!local) {
    return remote;
  }

  if (!remote) {
    return local;
  }

  const localSavedAt = isValidTimestamp(local.savedAt) ? Date.parse(local.savedAt!) : null;
  const remoteSavedAt = isValidTimestamp(remote.savedAt) ? Date.parse(remote.savedAt!) : null;

  if (localSavedAt === null) {
    return remote;
  }

  if (remoteSavedAt === null) {
    return local;
  }

  return localSavedAt >= remoteSavedAt ? local : remote;
}

function normalizeEngagementRecord(candidate: unknown): ModuleEngagementSummary {
  if (!candidate || typeof candidate !== 'object') {
    return createEngagementSummary();
  }

  const record = candidate as Partial<ModuleEngagementSummary>;

  return {
    totalSeconds: typeof record.totalSeconds === 'number' ? Math.max(0, Math.floor(record.totalSeconds)) : 0,
    lastTrackedAt: typeof record.lastTrackedAt === 'string' ? record.lastTrackedAt : null,
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
        completedAt: null,
        watchedSeconds: 0,
        lastOpenedAt: null,
      };
      const nextCompleted = action.completed ?? current.completed;
      const nextWatchedSeconds = Math.max(current.watchedSeconds, action.watchedSeconds ?? current.watchedSeconds);
      const nextCompletedAt = nextCompleted ? current.completedAt ?? new Date().toISOString() : current.completedAt;
      const nextLastOpenedAt = action.opened || nextWatchedSeconds !== current.watchedSeconds ? new Date().toISOString() : current.lastOpenedAt;

      if (
        current.completed === nextCompleted &&
        current.watchedSeconds === nextWatchedSeconds &&
        current.completedAt === nextCompletedAt &&
        current.lastOpenedAt === nextLastOpenedAt
      ) {
        return state;
      }

      return {
        ...state,
        lectureWatchStatus: {
          ...state.lectureWatchStatus,
          [action.lectureId]: {
            completed: nextCompleted,
            completedAt: nextCompletedAt,
            watchedSeconds: nextWatchedSeconds,
            lastOpenedAt: nextLastOpenedAt,
          },
        },
      };
    }
    case 'recordModuleEngagement': {
      const seconds = Math.max(0, Math.floor(action.seconds));

      if (seconds <= 0) {
        return state;
      }

      const current = state.engagement[action.moduleId];

      return {
        ...state,
        engagement: {
          ...state.engagement,
          [action.moduleId]: {
            totalSeconds: current.totalSeconds + seconds,
            lastTrackedAt: new Date().toISOString(),
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
    case 'setPretestAnswer':
      if (state.pretest.answers[action.questionId] === action.optionId) {
        return state;
      }

      return {
        ...state,
        pretest: {
          ...state.pretest,
          answers: {
            ...state.pretest.answers,
            [action.questionId]: action.optionId,
          },
        },
      };
    case 'setPretestQuestionIndex': {
      const nextIndex = Math.max(0, Math.floor(action.index));

      if (state.pretest.currentQuestionIndex === nextIndex) {
        return state;
      }

      return {
        ...state,
        pretest: {
          ...state.pretest,
          currentQuestionIndex: nextIndex,
        },
      };
    }
    case 'unlockPretestWithPasscode':
      if (state.pretest.unlockedByPasscodeAt) {
        return state;
      }

      return {
        ...state,
        pretest: {
          ...state.pretest,
          unlockedByPasscodeAt: new Date().toISOString(),
        },
      };
    case 'submitPretest':
      return {
        ...state,
        pretest: {
          ...state.pretest,
          submittedAt: new Date().toISOString(),
          score: Math.max(0, action.score),
          answeredCount: Math.max(0, action.answeredCount),
          totalQuestions: Math.max(0, action.totalQuestions),
          attemptCount: state.pretest.attemptCount + 1,
        },
      };
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
  const [remoteReady, setRemoteReady] = useState(false);
  const [loadedStorageKey, setLoadedStorageKey] = useState<string | null>(null);
  const syncTimerRef = useRef<number | null>(null);
  const loadedRemoteForUserRef = useRef<string | null>(null);
  const { isSupabaseEnabled, user } = useAuth();
  const activeUserId = isSupabaseEnabled ? user?.id ?? null : null;
  const activeStorageKey = getLearnerProgressStorageKey(activeUserId);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(activeStorageKey);
      const parsed = raw ? parseStoredLearnerProgress(JSON.parse(raw)) : null;

      if (parsed) {
        dispatch({
          type: 'hydrate',
          payload: parsed.state,
        });
      } else {
        dispatch({
          type: 'hydrate',
          payload: createInitialLearnerProgress(),
        });
      }
    } catch {
      // Ignore malformed storage and keep defaults.
      dispatch({
        type: 'hydrate',
        payload: createInitialLearnerProgress(),
      });
    } finally {
      loadedRemoteForUserRef.current = null;
      setLoadedStorageKey(activeStorageKey);
      setHydrated(true);
    }
  }, [activeStorageKey]);

  useEffect(() => {
    if (!hydrated || loadedStorageKey !== activeStorageKey) {
      return;
    }

    window.localStorage.setItem(
      activeStorageKey,
      JSON.stringify({
        savedAt: new Date().toISOString(),
        state,
      } satisfies StoredLearnerProgressRecord),
    );
  }, [activeStorageKey, hydrated, loadedStorageKey, state]);

  useEffect(() => {
    if (!hydrated || loadedStorageKey !== activeStorageKey) {
      return;
    }

    if (!isSupabaseEnabled || !activeUserId) {
      loadedRemoteForUserRef.current = null;
      setRemoteReady(true);
      return;
    }

    if (loadedRemoteForUserRef.current === activeUserId) {
      setRemoteReady(true);
      return;
    }

    const nextClient = getSupabaseBrowserClient();

    if (!nextClient) {
      setRemoteReady(true);
      return;
    }

    const client = nextClient;
    let active = true;
    setRemoteReady(false);

    async function loadRemoteSnapshot() {
      let localRecord: StoredLearnerProgressRecord | null = null;

      try {
        const localRaw = window.localStorage.getItem(activeStorageKey);
        localRecord = localRaw ? parseStoredLearnerProgress(JSON.parse(localRaw)) : null;
      } catch {
        localRecord = null;
      }

      const { data, error } = await client
        .from('learner_progress_snapshots')
        .select('payload, updated_at')
        .eq('learner_id', activeUserId)
        .maybeSingle();

      if (!active) {
        return;
      }

      if (!error) {
        const remoteRecord =
          data?.payload && typeof data === 'object'
            ? {
                savedAt: typeof data.updated_at === 'string' ? data.updated_at : null,
                state: normalizeLearnerProgress(data.payload),
              }
            : null;
        const preferred = chooseStoredLearnerProgress(localRecord, remoteRecord);

        if (preferred && preferred !== localRecord) {
          dispatch({
            type: 'hydrate',
            payload: preferred.state,
          });
        }
      }

      if (error) {
        // Keep the active local snapshot if the remote read fails.
      }

      loadedRemoteForUserRef.current = activeUserId;
      setRemoteReady(true);
    }

    void loadRemoteSnapshot().catch(() => {
      if (!active) {
        return;
      }

      loadedRemoteForUserRef.current = activeUserId;
      setRemoteReady(true);
    });

    return () => {
      active = false;
    };
  }, [activeStorageKey, activeUserId, hydrated, isSupabaseEnabled, loadedStorageKey]);

  useEffect(() => {
    if (!hydrated || !remoteReady || !isSupabaseEnabled || !user) {
      return;
    }

    const client = getSupabaseBrowserClient();

    if (!client) {
      return;
    }

    if (syncTimerRef.current) {
      window.clearTimeout(syncTimerRef.current);
    }

    syncTimerRef.current = window.setTimeout(() => {
      void syncLearnerSnapshot(client, user.id, state).catch(() => {
        // Local progress remains authoritative if remote sync is temporarily unavailable.
      });
    }, 700);

    return () => {
      if (syncTimerRef.current) {
        window.clearTimeout(syncTimerRef.current);
      }
    };
  }, [hydrated, isSupabaseEnabled, remoteReady, state, user]);

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
    (lectureId: string, update: { watchedSeconds?: number; completed?: boolean; opened?: boolean }) => {
      dispatch({
        type: 'setLectureState',
        lectureId,
        watchedSeconds: update.watchedSeconds,
        completed: update.completed,
        opened: update.opened,
      });
    },
    [],
  );

  const recordModuleEngagement = useCallback((moduleId: TrackedLearningRouteId, seconds: number) => {
    dispatch({ type: 'recordModuleEngagement', moduleId, seconds });
  }, []);

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

  const setPretestAnswer = useCallback((questionId: string, optionId: string) => {
    dispatch({ type: 'setPretestAnswer', questionId, optionId });
  }, []);

  const setPretestQuestionIndex = useCallback((index: number) => {
    dispatch({ type: 'setPretestQuestionIndex', index });
  }, []);

  const submitPretest = useCallback((summary: { score: number; answeredCount: number; totalQuestions: number }) => {
    dispatch({ type: 'submitPretest', ...summary });
  }, []);

  const unlockPretestWithPasscode = useCallback(() => {
    dispatch({ type: 'unlockPretestWithPasscode' });
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
      recordModuleEngagement,
      recordQuizResult,
      recordRecognitionAttempt,
      setPretestAnswer,
      setPretestQuestionIndex,
      submitPretest,
      unlockPretestWithPasscode,
      setLastViewedStation,
      setLastUsedKnobologyControl,
      reset,
    }),
    [
      hydrated,
      recordModuleEngagement,
      recordQuizResult,
      recordRecognitionAttempt,
      reset,
      setLastUsedKnobologyControl,
      setLastViewedStation,
      setLectureState,
      setModuleProgress,
      setPretestAnswer,
      setPretestQuestionIndex,
      submitPretest,
      state,
      toggleStationBookmark,
      unlockPretestWithPasscode,
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
