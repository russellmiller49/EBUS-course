import type { FormEvent } from 'react';
import { useEffect, useId, useState } from 'react';

import { useSupabaseSync } from './SupabaseSyncProvider';

function formatAuthError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unable to sign in with that email and password.';
}

export function SupabaseAuthDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { configured, hasSession, signInWithPassword, status, userEmail } = useSupabaseSync();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) {
      setPassword('');
      setError(null);
      setIsSubmitting(false);
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await signInWithPassword(email.trim(), password);
      setPassword('');
      onClose();
    } catch (caught) {
      setError(formatAuthError(caught));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="auth-dialog-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <section
        aria-describedby={`${titleId}-description`}
        aria-labelledby={titleId}
        aria-modal="true"
        className="auth-dialog"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="auth-dialog__header">
          <div>
            <div className="eyebrow">Learner access</div>
            <h2 id={titleId}>
              {!configured
                ? 'Supabase is not configured for this build'
                : status === 'checking-session'
                  ? 'Checking learner session'
                  : hasSession
                    ? 'Learner session active'
                    : 'Sign in to sync progress'}
            </h2>
            <p id={`${titleId}-description`}>
              {!configured
                ? 'This course build remains fully usable in local-only mode until browser-safe Supabase env values are added.'
                : status === 'checking-session'
                  ? 'Looking for an existing learner session in this browser before prompting for sign-in.'
                  : hasSession
                    ? `Signed in as ${userEmail ?? 'an authenticated learner'}.`
                    : 'Use the learner email and password for this shared Supabase project. Existing local progress will stay on this device and begin syncing after sign-in.'}
            </p>
          </div>
          <button
            aria-label="Close learner sign-in dialog"
            className="button button--ghost auth-dialog__close"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>

        {!configured ? (
          <div className="tag-row">
            <span className="tag">Offline-first fallback</span>
            <span className="tag">Local only</span>
          </div>
        ) : status === 'checking-session' ? (
          <div className="tag-row">
            <span className="tag">Supabase configured</span>
            <span className="tag">Checking session</span>
          </div>
        ) : hasSession ? (
          <div className="tag-row">
            <span className="tag">Session active</span>
            <span className="tag">Ready to sync</span>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="field">
              <span>Email</span>
              <input
                autoComplete="email"
                autoFocus
                onChange={(event) => setEmail(event.target.value)}
                required
                type="email"
                value={email}
              />
            </label>
            <label className="field">
              <span>Password</span>
              <input
                autoComplete="current-password"
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
            </label>
            {error ? (
              <p className="auth-feedback auth-feedback--error" role="status">
                {error}
              </p>
            ) : null}
            <div className="button-row button-row--wrap">
              <button className="button" disabled={isSubmitting} type="submit">
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
