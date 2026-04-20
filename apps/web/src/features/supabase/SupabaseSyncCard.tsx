import { useMemo } from 'react';

import { useSupabaseSync } from './SupabaseSyncProvider';

function formatTimestamp(value: string | null) {
  if (!value) {
    return 'Not synced yet';
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
}

export function SupabaseSyncCard() {
  const { configured, hasActivity, hasSession, isDirty, lastSyncedAt, status, syncError, syncNow, userEmail } =
    useSupabaseSync();

  const summary = useMemo(() => {
    if (!configured) {
      return {
        heading: 'Live learner sync is off',
        detail: 'The course is running in offline-first mode because no browser-safe Supabase env is configured.',
        tags: ['Local only', 'No Supabase env'],
      };
    }

    if (!hasSession) {
      return {
        heading: 'Supabase is ready, but no learner session was found',
        detail:
          'Once the parent site signs the learner in against the shared project, this app can sync progress under RLS without any service-role key.',
        tags: ['Supabase configured', 'No session'],
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
  }, [configured, hasActivity, hasSession, isDirty, status, syncError]);

  return (
    <section className="section-card">
      <div className="section-card__heading">
        <div>
          <div className="eyebrow">Live learner sync</div>
          <h2>{summary.heading}</h2>
          <p>{summary.detail}</p>
        </div>
      </div>

      <div className="mini-card-grid">
        <article className="mini-card">
          <strong>{hasSession ? userEmail ?? 'Authenticated learner' : configured ? 'Signed out' : 'Disabled'}</strong>
          <span>Session state</span>
        </article>
        <article className="mini-card">
          <strong>{formatTimestamp(lastSyncedAt)}</strong>
          <span>Last successful sync</span>
        </article>
        <article className="mini-card">
          <strong>{configured ? 'learner_progress_snapshots' : 'localStorage only'}</strong>
          <span>Primary persistence target</span>
        </article>
      </div>

      <div className="tag-row">
        {summary.tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
        <span className="tag">Offline-first fallback</span>
      </div>

      <div className="button-row button-row--wrap">
        <button className="button button--ghost" disabled={!configured || !hasSession || !hasActivity || status === 'syncing'} onClick={() => void syncNow()} type="button">
          {status === 'syncing' ? 'Syncing...' : 'Sync now'}
        </button>
      </div>
    </section>
  );
}
