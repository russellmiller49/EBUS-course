import { useState } from 'react';

import { courseInfo } from '@/content/course';
import { SupabaseAuthDialog } from '@/features/supabase/SupabaseAuthDialog';
import { useSupabaseSync } from '@/features/supabase/SupabaseSyncProvider';

export function TopHeader() {
  const { configured, hasSession, signOut, status, userEmail } = useSupabaseSync();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  async function handleSignOut() {
    setSignOutError(null);

    try {
      await signOut();
    } catch (error) {
      setSignOutError(error instanceof Error ? error.message : 'Unable to sign out of the learner session.');
    }
  }

  return (
    <>
      <header className="top-header">
        <div className="top-header__identity">
          <div className="top-header__mark" aria-hidden="true">
            📡
          </div>
          <div>
            <div className="eyebrow">SoCal EBUS 2026</div>
            <h1 className="top-header__title">Fellow Prep</h1>
            <p className="top-header__subtitle">{courseInfo.hostLine}</p>
          </div>
        </div>
        <div className="top-header__meta">
          <span>{courseInfo.dateLabel}</span>
          <span>{courseInfo.venueName}</span>
          <div className="top-header__auth">
            <span className="top-header__auth-status">
              {!configured
                ? 'Local-only mode'
                : status === 'checking-session'
                  ? 'Checking learner session...'
                  : hasSession
                    ? userEmail ?? 'Authenticated learner'
                    : 'Supabase sync ready'}
            </span>
            {!configured ? (
              <span className="tag">Offline-first fallback</span>
            ) : hasSession ? (
              <button
                className="button button--ghost top-header__action"
                disabled={status === 'syncing'}
                onClick={() => void handleSignOut()}
                type="button"
              >
                Sign out
              </button>
            ) : (
              <button
                className="button top-header__action"
                disabled={status === 'checking-session'}
                onClick={() => setIsAuthDialogOpen(true)}
                type="button"
              >
                {status === 'checking-session' ? 'Checking session...' : 'Learner sign in'}
              </button>
            )}
          </div>
          {signOutError ? (
            <p className="auth-feedback auth-feedback--error top-header__feedback" role="status">
              {signOutError}
            </p>
          ) : null}
        </div>
      </header>
      <SupabaseAuthDialog isOpen={isAuthDialogOpen} onClose={() => setIsAuthDialogOpen(false)} />
    </>
  );
}
