import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';

import { emptyProfileInput, LearnerProfileFields, validateProfileInput } from '@/features/account/LearnerProfileFields';
import type { LearnerProfileInput } from '@/lib/auth';
import { useAuth } from '@/lib/auth';
import { getBrowserRecoverySessionTokens } from '@/lib/supabase';

type AuthMode = 'sign-in' | 'sign-up' | 'recover' | 'reset-password';

function normalizeNextPath(candidate: string | null) {
  if (!candidate || !candidate.startsWith('/')) {
    return '/';
  }

  return candidate;
}

function getInitialMode(candidate: string | null): AuthMode {
  if (candidate === 'sign-up' || candidate === 'recover' || candidate === 'reset-password') {
    return candidate;
  }

  return 'sign-in';
}

export function AuthPage() {
  const {
    completePasswordSetup,
    isLoading,
    isPasswordRecoverySession,
    isSupabaseEnabled,
    profile,
    refreshProfile,
    requestPasswordRecovery,
    signInWithPassword,
    signOut,
    signUpWithProfile,
    updatePassword,
    user,
  } = useAuth();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<AuthMode>(() => getInitialMode(searchParams.get('mode')));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signupProfile, setSignupProfile] = useState<LearnerProfileInput>(emptyProfileInput);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const nextPath = useMemo(() => normalizeNextPath(searchParams.get('next')), [searchParams]);
  const routeMode = searchParams.get('mode');
  const requiresPasswordSetup = Boolean(user && profile?.mustSetPassword);
  const isPasswordForm = requiresPasswordSetup || mode === 'reset-password' || isPasswordRecoverySession;
  const isPendingApproval = Boolean(user && profile?.approvalStatus === 'pending' && !isPasswordForm);
  const hasRecoverySessionTokens = Boolean(getBrowserRecoverySessionTokens());
  const isMissingRecoverySession = mode === 'reset-password' && !requiresPasswordSetup && !user && !hasRecoverySessionTokens;

  useEffect(() => {
    if (routeMode === 'sign-up' || routeMode === 'recover' || routeMode === 'reset-password') {
      setMode(routeMode);
    }
  }, [routeMode]);

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setMessage(null);
    setError(null);
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }

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

  async function handleSignUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const profileError = validateProfileInput(signupProfile);

    if (profileError) {
      setError(profileError);
      return;
    }

    if (password.length < 10) {
      setError('Use at least 10 characters for the learner password.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      await signUpWithProfile(signupProfile, password);
      setMessage('Account created. Course leadership will approve access before the modules open.');
      setPassword('');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to create the learner account.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRecovery(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      await requestPasswordRecovery(email);
      setMessage('Password recovery email sent. Open the link in that email to choose a new password.');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to send a password recovery email.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePasswordUpdate(event: React.FormEvent<HTMLFormElement>) {
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
      if (requiresPasswordSetup) {
        await completePasswordSetup(newPassword);
        setMessage('Password saved. Your learning modules are ready.');
      } else {
        await updatePassword(newPassword);
        setMessage('Password updated. You can continue to your prep workspace.');
      }
      setNewPassword('');
      setConfirmPassword('');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to save the new password.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRefreshApproval() {
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      await refreshProfile();
      setMessage('Approval status refreshed.');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to refresh approval status.');
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
          <h2>Checking your session...</h2>
        </section>
      </div>
    );
  }

  if (isPendingApproval) {
    return (
      <div className="page-stack">
        <section className="hero-card auth-card">
          <div className="eyebrow">Approval pending</div>
          <h2>Your account is waiting for course leadership approval.</h2>
          <p>
            You are signed in as {user?.email ?? 'this learner account'}, but the course modules stay locked until
            leadership approves your signup.
          </p>
          {message ? <p className="auth-card__message">{message}</p> : null}
          {error ? <p className="auth-card__error">{error}</p> : null}
          <div className="button-row button-row--wrap">
            <button className="button" disabled={isSubmitting} onClick={() => void handleRefreshApproval()} type="button">
              {isSubmitting ? 'Checking...' : 'Check approval status'}
            </button>
            <button className="button button--ghost" onClick={() => void signOut()} type="button">
              Sign out
            </button>
          </div>
        </section>
      </div>
    );
  }

  if (user && !isPasswordForm) {
    return <Navigate replace to={nextPath} />;
  }

  return (
    <div className="page-stack">
      <section className="hero-card auth-card">
        <div className="eyebrow">Learner access</div>
        <h2>
          {isPasswordForm
            ? requiresPasswordSetup
              ? 'Create your learner password'
              : 'Choose a new password'
            : mode === 'sign-up'
              ? 'Create your learner account'
              : mode === 'recover'
                ? 'Recover your password'
                : 'Sign in to SoCal EBUS Prep'}
        </h2>
        <p>
          {isPasswordForm
            ? 'Use a new password for your learner account, then continue into the course workspace.'
            : mode === 'sign-up'
              ? 'Use your institutional email so course participation and progress stay tied to the correct training program.'
              : mode === 'recover'
                ? 'Enter your account email and Supabase will send a recovery link.'
                : 'Use the email and password from your invite or the account you created for the course.'}
        </p>
        {message ? <p className="auth-card__message">{message}</p> : null}
        {error ? <p className="auth-card__error">{error}</p> : null}

        {isPasswordForm ? (
          isMissingRecoverySession ? (
            <div className="auth-form">
              <p className="auth-card__error">
                This recovery link is missing its reset session or has already been used. Request a fresh recovery email,
                then open the newest link.
              </p>
              <div className="button-row button-row--wrap">
                <button className="button" onClick={() => switchMode('recover')} type="button">
                  Request recovery link
                </button>
                <button className="button button--ghost" onClick={() => switchMode('sign-in')} type="button">
                  Back to sign in
                </button>
              </div>
            </div>
          ) : (
          <form className="auth-form" onSubmit={handlePasswordUpdate}>
            <label className="field">
              <span>Account email</span>
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
                {isSubmitting ? 'Saving password...' : 'Save password'}
              </button>
              {user ? (
                <button className="button button--ghost" onClick={() => void signOut()} type="button">
                  Sign out
                </button>
              ) : null}
            </div>
          </form>
          )
        ) : mode === 'sign-up' ? (
          <form className="auth-form" onSubmit={handleSignUp}>
            <LearnerProfileFields onChange={setSignupProfile} values={signupProfile} />
            <label className="field">
              <span>Password</span>
              <input
                autoComplete="new-password"
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
            </label>
            <div className="button-row button-row--wrap">
              <button className="button" disabled={isSubmitting} type="submit">
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </button>
              <button className="button button--ghost" onClick={() => switchMode('sign-in')} type="button">
                Back to sign in
              </button>
            </div>
          </form>
        ) : mode === 'recover' ? (
          <form className="auth-form" onSubmit={handleRecovery}>
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
            <div className="button-row button-row--wrap">
              <button className="button" disabled={isSubmitting} type="submit">
                {isSubmitting ? 'Sending link...' : 'Send recovery link'}
              </button>
              <button className="button button--ghost" onClick={() => switchMode('sign-in')} type="button">
                Back to sign in
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
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </button>
              <button className="button button--ghost" onClick={() => switchMode('sign-up')} type="button">
                Create account
              </button>
              <button className="button button--ghost" onClick={() => switchMode('recover')} type="button">
                Forgot password
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
