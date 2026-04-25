import type { SyncStatus } from './SupabaseSyncProvider';

export interface SupabaseSyncSummary {
  detail: string;
  heading: string;
  tags: string[];
}

interface SupabaseSyncSummaryInput {
  configured: boolean;
  hasActivity: boolean;
  hasSession: boolean;
  isDirty: boolean;
  status: SyncStatus;
  syncError: string | null;
}

export function getSupabaseSyncSummary({
  configured,
  hasActivity,
  hasSession,
  isDirty,
  status,
  syncError,
}: SupabaseSyncSummaryInput): SupabaseSyncSummary {
  if (!configured) {
    return {
      heading: 'Live learner sync is off',
      detail: 'The course is running in offline-first mode because no browser-safe Supabase env is configured.',
      tags: ['Local only', 'No Supabase env'],
    };
  }

  if (status === 'checking-session') {
    return {
      heading: 'Checking learner session',
      detail: 'Looking for an existing learner session in this browser so progress can sync automatically if one is available.',
      tags: ['Supabase configured', 'Checking session'],
    };
  }

  if (!hasSession) {
    return {
      heading: 'Supabase sync is ready for learner sign-in',
      detail:
        'Sign in from this course build or from the host site to attach local progress to a learner account. Until then, progress stays on this device.',
      tags: ['Supabase configured', 'Sign-in required'],
    };
  }

  if (!hasActivity) {
    return {
      heading: 'Learner session found',
      detail: 'Progress will stay local until the learner records meaningful activity such as a pretest answer, bookmark, lecture, or module visit.',
      tags: ['Session active', 'Waiting for activity'],
    };
  }

  if (status === 'syncing') {
    return {
      heading: 'Syncing learner progress',
      detail: 'Writing learner profile, progress snapshot, module progress, and lecture progress to the shared Supabase project.',
      tags: ['Session active', 'Sync in progress'],
    };
  }

  if (status === 'error') {
    return {
      heading: 'Supabase sync needs attention',
      detail: syncError ?? 'The last sync attempt failed. Check the shared project schema, policies, and authenticated session.',
      tags: ['Session active', 'Sync error'],
    };
  }

  return {
    heading: isDirty ? 'Learner progress is queued for sync' : 'Learner progress is live',
    detail: isDirty
      ? 'A fresh local change is waiting to be written to Supabase.'
      : 'The latest learner activity has been written to the shared Supabase project.',
    tags: ['Session active', isDirty ? 'Unsynced change' : 'Synced'],
  };
}

export function getSessionStateLabel(options: {
  configured: boolean;
  hasSession: boolean;
  status: SyncStatus;
  userEmail: string | null;
}) {
  const { configured, hasSession, status, userEmail } = options;

  if (!configured) {
    return 'Disabled';
  }

  if (status === 'checking-session') {
    return 'Checking session';
  }

  if (hasSession) {
    return userEmail ?? 'Authenticated learner';
  }

  return 'Signed out';
}

export function getPersistenceTargetLabel(options: {
  configured: boolean;
  hasSession: boolean;
}) {
  const { configured, hasSession } = options;

  if (!configured) {
    return 'localStorage only';
  }

  if (!hasSession) {
    return 'Local until sign-in';
  }

  return 'learner_progress_snapshots';
}
