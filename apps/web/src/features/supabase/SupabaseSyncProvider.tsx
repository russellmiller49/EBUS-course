import type { PropsWithChildren } from 'react';
import type { Session } from '@supabase/supabase-js';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { useLearnerProgress } from '@/lib/progress';

import { getSupabaseBrowserClient, hasSupabaseBrowserConfig } from './client';
import {
  buildLearnerLectureProgressRows,
  buildLearnerModuleProgressRows,
  buildLearnerPretestAttemptRows,
  buildLearnerProfileRow,
  buildLearnerSnapshotRow,
  hasLearnerProgressActivity,
} from './sync';

type SyncStatus = 'disabled' | 'checking-session' | 'signed-out' | 'ready' | 'syncing' | 'synced' | 'error';

interface SupabaseSyncContextValue {
  configured: boolean;
  hasActivity: boolean;
  hasSession: boolean;
  isDirty: boolean;
  lastSyncedAt: string | null;
  status: SyncStatus;
  syncNow: () => Promise<void>;
  syncError: string | null;
  userEmail: string | null;
}

const SupabaseSyncContext = createContext<SupabaseSyncContextValue | undefined>(undefined);

function formatSyncError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unknown Supabase sync error.';
}

export function SupabaseSyncProvider({ children }: PropsWithChildren) {
  const { hydrated, state } = useLearnerProgress();
  const configured = hasSupabaseBrowserConfig();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<SyncStatus>(configured ? 'checking-session' : 'disabled');
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const hasActivity = useMemo(() => hasLearnerProgressActivity(state), [state]);
  const syncSignature = useMemo(() => JSON.stringify(state), [state]);
  const lastSyncedSignatureRef = useRef<string | null>(null);
  const userId = session?.user.id ?? null;
  const userEmail = session?.user.email ?? null;

  useEffect(() => {
    if (!supabase) {
      setStatus('disabled');
      return;
    }

    let isMounted = true;

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) {
        return;
      }

      if (error) {
        setSyncError(error.message);
        setStatus('error');
        return;
      }

      setSession(data.session);
      setStatus(data.session ? 'ready' : 'signed-out');
      setSyncError(null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setStatus(nextSession ? 'ready' : 'signed-out');
      setSyncError(null);

      if (!nextSession) {
        setLastSyncedAt(null);
        lastSyncedSignatureRef.current = null;
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const syncNow = useCallback(async () => {
    if (!supabase || !userId || !hydrated || !hasActivity) {
      return;
    }

    const identity = {
      id: userId,
      email: userEmail,
    };
    const syncedAt = new Date().toISOString();

    setStatus('syncing');
    setSyncError(null);

    try {
      const { error: profileError } = await supabase.from('learner_profiles').upsert(buildLearnerProfileRow(identity, syncedAt), {
        onConflict: 'id',
      });

      if (profileError) {
        throw profileError;
      }

      const { error: snapshotError } = await supabase
        .from('learner_progress_snapshots')
        .upsert(buildLearnerSnapshotRow(identity, state, syncedAt), { onConflict: 'learner_id' });

      if (snapshotError) {
        throw snapshotError;
      }

      const moduleRows = buildLearnerModuleProgressRows(identity, state, syncedAt);
      if (moduleRows.length > 0) {
        const { error: moduleError } = await supabase
          .from('learner_module_progress')
          .upsert(moduleRows, { onConflict: 'learner_id,module_id' });

        if (moduleError) {
          throw moduleError;
        }
      }

      const lectureRows = buildLearnerLectureProgressRows(identity, state, syncedAt);
      if (lectureRows.length > 0) {
        const { error: lectureError } = await supabase
          .from('learner_lecture_progress')
          .upsert(lectureRows, { onConflict: 'learner_id,lecture_id' });

        if (lectureError) {
          throw lectureError;
        }
      }

      const pretestAttemptRows = buildLearnerPretestAttemptRows(identity, state, syncedAt);
      if (pretestAttemptRows.length > 0) {
        const { error: pretestAttemptError } = await supabase
          .from('learner_pretest_attempts')
          .upsert(pretestAttemptRows, { onConflict: 'learner_id,attempt_number' });

        if (pretestAttemptError) {
          throw pretestAttemptError;
        }
      }

      lastSyncedSignatureRef.current = syncSignature;
      setLastSyncedAt(syncedAt);
      setStatus('synced');
    } catch (error) {
      setSyncError(formatSyncError(error));
      setStatus('error');
    }
  }, [hasActivity, hydrated, state, supabase, syncSignature, userEmail, userId]);

  useEffect(() => {
    if (!supabase || !userId || !hydrated || !hasActivity) {
      return;
    }

    if (lastSyncedSignatureRef.current === syncSignature) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void syncNow();
    }, 900);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [hasActivity, hydrated, supabase, syncNow, syncSignature, userId]);

  const value = useMemo<SupabaseSyncContextValue>(
    () => ({
      configured,
      hasActivity,
      hasSession: Boolean(userId),
      isDirty: hasActivity && lastSyncedSignatureRef.current !== syncSignature,
      lastSyncedAt,
      status,
      syncNow,
      syncError,
      userEmail,
    }),
    [configured, hasActivity, lastSyncedAt, status, syncError, syncNow, syncSignature, userEmail, userId],
  );

  return <SupabaseSyncContext.Provider value={value}>{children}</SupabaseSyncContext.Provider>;
}

export function useSupabaseSync() {
  const context = useContext(SupabaseSyncContext);

  if (!context) {
    throw new Error('useSupabaseSync must be used inside a SupabaseSyncProvider.');
  }

  return context;
}
