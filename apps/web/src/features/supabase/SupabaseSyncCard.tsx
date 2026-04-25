import { useState } from 'react';

import { SupabaseAuthDialog } from './SupabaseAuthDialog';
import { getPersistenceTargetLabel, getSessionStateLabel, getSupabaseSyncSummary } from './SupabaseSyncCard.model';
import { useSupabaseSync } from './SupabaseSyncProvider';

function formatTimestamp(value: string | null) {
  if (!value) {
    return 'Not synced yet';
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
}

export function SupabaseSyncCard() {
  const { configured, hasActivity, hasSession, isDirty, lastSyncedAt, signOut, status, syncError, syncNow, userEmail } =
    useSupabaseSync();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [authActionError, setAuthActionError] = useState<string | null>(null);

  const summary = getSupabaseSyncSummary({
    configured,
    hasActivity,
    hasSession,
    isDirty,
    status,
    syncError,
  });

  async function handleSignOut() {
    setAuthActionError(null);

    try {
      await signOut();
    } catch (error) {
      setAuthActionError(error instanceof Error ? error.message : 'Unable to sign out of the learner session.');
    }
  }

  return (
    <>
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
            <strong>{getSessionStateLabel({ configured, hasSession, status, userEmail })}</strong>
            <span>Session state</span>
          </article>
          <article className="mini-card">
            <strong>{formatTimestamp(lastSyncedAt)}</strong>
            <span>Last successful sync</span>
          </article>
          <article className="mini-card">
            <strong>{getPersistenceTargetLabel({ configured, hasSession })}</strong>
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
          {configured && !hasSession ? (
            <button
              className="button"
              disabled={status === 'checking-session'}
              onClick={() => setIsAuthDialogOpen(true)}
              type="button"
            >
              {status === 'checking-session' ? 'Checking session...' : 'Learner sign in'}
            </button>
          ) : null}
          {configured && hasSession ? (
            <button
              className="button button--ghost"
              disabled={status === 'syncing'}
              onClick={() => void handleSignOut()}
              type="button"
            >
              Sign out
            </button>
          ) : null}
          <button
            className="button button--ghost"
            disabled={!configured || !hasSession || !hasActivity || status === 'syncing'}
            onClick={() => void syncNow()}
            type="button"
          >
            {status === 'syncing' ? 'Syncing...' : 'Sync now'}
          </button>
        </div>
        {authActionError ? (
          <p className="auth-feedback auth-feedback--error" role="status">
            {authActionError}
          </p>
        ) : null}
      </section>
      <SupabaseAuthDialog isOpen={isAuthDialogOpen} onClose={() => setIsAuthDialogOpen(false)} />
    </>
  );
}
