import { useMemo, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';

import { useAuth } from '@/lib/auth';

function normalizeNextPath(candidate: string | null) {
  if (!candidate || !candidate.startsWith('/')) {
    return '/';
  }

  return candidate;
}

export function AuthPage() {
  const { completePasswordSetup, isLoading, isSupabaseEnabled, profile, signInWithPassword, signOut, user } = useAuth();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const nextPath = useMemo(() => normalizeNextPath(searchParams.get('next')), [searchParams]);
  const requiresPasswordSetup = Boolean(user && profile?.mustSetPassword);

  async function handleSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      await signInWithPassword(email.trim(), password);
      setMessage('Signed in. Redirecting to your prep workspace.');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to sign in with that email and password.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePasswordSetup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (newPassword.length < 10) {
      setError('Use at least 10 characters for the learner password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('The new password and confirmation do not match.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      await completePasswordSetup(newPassword);
      setMessage('Password saved. Your learning modules are ready.');
      setNewPassword('');
      setConfirmPassword('');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to save the new password.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isSupabaseEnabled) {
    return (
      <div className="page-stack">
        <section className="hero-card">
          <div className="eyebrow">Supabase setup</div>
          <h2>Auth and learner tracking are ready to wire into your project.</h2>
          <p>
            Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the web app environment, run the SQL in
            `supabase/schema.sql`, and then use the invite script to send learner onboarding emails.
          </p>
          <div className="button-row button-row--wrap">
            <Link className="button" to="/">
              Continue in local mode
            </Link>
          </div>
        </section>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="page-stack">
        <section className="section-card">
          <div className="eyebrow">Learner access</div>
          <h2>Checking your session…</h2>
        </section>
      </div>
    );
  }

  if (user && !requiresPasswordSetup) {
    return <Navigate replace to={nextPath} />;
  }

  return (
    <div className="page-stack">
      <section className="hero-card auth-card">
        <div className="eyebrow">Learner access</div>
        <h2>{requiresPasswordSetup ? 'Create your learner password' : 'Sign in to SoCal EBUS Prep'}</h2>
        <p>
          {requiresPasswordSetup
            ? 'Your invite link worked. Set a password once, then the rest of the course will stay behind your learner account.'
            : 'Use the email and password from your invite. If you just received an invite email, open that link first to activate your account.'}
        </p>
        {message ? <p className="auth-card__message">{message}</p> : null}
        {error ? <p className="auth-card__error">{error}</p> : null}

        {requiresPasswordSetup ? (
          <form className="auth-form" onSubmit={handlePasswordSetup}>
            <label className="field">
              <span>Invite email</span>
              <input disabled type="email" value={user?.email ?? ''} />
            </label>
            <label className="field">
              <span>New password</span>
              <input
                autoComplete="new-password"
                onChange={(event) => setNewPassword(event.target.value)}
                required
                type="password"
                value={newPassword}
              />
            </label>
            <label className="field">
              <span>Confirm password</span>
              <input
                autoComplete="new-password"
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                type="password"
                value={confirmPassword}
              />
            </label>
            <div className="button-row button-row--wrap">
              <button className="button" disabled={isSubmitting} type="submit">
                {isSubmitting ? 'Saving password…' : 'Save password'}
              </button>
              <button className="button button--ghost" onClick={() => void signOut()} type="button">
                Sign out
              </button>
            </div>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleSignIn}>
            <label className="field">
              <span>Email</span>
              <input
                autoComplete="email"
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
            <div className="button-row button-row--wrap">
              <button className="button" disabled={isSubmitting} type="submit">
                {isSubmitting ? 'Signing in…' : 'Sign in'}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
