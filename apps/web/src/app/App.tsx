import { useEffect, useMemo, useRef } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { AppShell } from '@/components/AppShell';
import type { AppRouteId, NavigationItem } from '@/content/types';
import { HomePage } from '@/app/routes/HomePage';
import { AuthPage } from '@/app/routes/AuthPage';
import { AdminPage } from '@/app/routes/AdminPage';
import { AccountPage } from '@/app/routes/AccountPage';
import { SponsorsPage } from '@/app/routes/SponsorsPage';
import { StationsPage } from '@/app/routes/StationsPage';
import { StationsExplorePage } from '@/app/routes/stations/ExplorePage';
import { StationsFlashcardsPage } from '@/app/routes/stations/FlashcardsPage';
import { StationsHandbookPage } from '@/app/routes/stations/HandbookPage';
import { StationsQuizPage } from '@/app/routes/stations/StationsQuizPage';
import { KnobologyPage } from '@/app/routes/KnobologyPage';
import { LecturesPage } from '@/app/routes/LecturesPage';
import { PretestPage } from '@/app/routes/PretestPage';
import { QuizPage } from '@/app/routes/QuizPage';
import { Case001Page } from '@/app/routes/Case001Page';
import { SimulatorPage } from '@/app/routes/SimulatorPage';
import { TnmStagingPage } from '@/app/routes/TnmStagingPage';
import { NotFoundPage } from '@/app/routes/NotFoundPage';
import { canAccessRoute, getLockedRoutePath, getRouteLockReason } from '@/lib/access';
import { useCourseAdminSessionActive } from '@/lib/adminSession';
import { useAuth } from '@/lib/auth';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { useLearnerProgress } from '@/lib/progress';
import { recordModuleSession } from '@/lib/supabaseTracking';

const navItems: NavigationItem[] = [
  { id: 'home', label: 'Home', icon: '⌂', path: '/' },
  { id: 'sponsors', label: 'Sponsors', icon: '☆', path: '/sponsors' },
  { id: 'pretest', label: 'Pretest', icon: '◇', path: '/pretest' },
  { id: 'lectures', label: 'Lectures', icon: '▶', path: '/lectures' },
  { id: 'knobology', label: 'Knobology', icon: '◐', path: '/knobology' },
  { id: 'stations', label: 'Stations', icon: '◎', path: '/stations' },
  { id: 'tnm-staging', label: 'TNM-9', icon: '◆', path: '/tnm-staging' },
  { id: 'case-001', label: '3D Anatomy', icon: '◫', path: '/cases/case-001' },
  { id: 'simulator', label: 'Simulator', icon: '◌', path: '/simulator' },
  { id: 'quiz', label: 'Quiz', icon: '✎', path: '/quiz' },
];

const adminNavItem: NavigationItem = { id: 'admin', label: 'Dashboard', icon: '▣', path: '/admin' };

function resolveRouteId(pathname: string): AppRouteId | null {
  if (pathname === '/') {
    return 'home';
  }

  if (pathname.startsWith('/admin')) {
    return 'admin';
  }

  if (pathname.startsWith('/sponsors')) {
    return 'sponsors';
  }

  if (pathname.startsWith('/stations')) {
    return 'stations';
  }

  if (pathname.startsWith('/tnm-staging')) {
    return 'tnm-staging';
  }

  if (pathname.startsWith('/pretest')) {
    return 'pretest';
  }

  if (pathname.startsWith('/knobology')) {
    return 'knobology';
  }

  if (pathname.startsWith('/lectures')) {
    return 'lectures';
  }

  if (pathname.startsWith('/quiz')) {
    return 'quiz';
  }

  if (pathname.startsWith('/cases/case-001')) {
    return 'case-001';
  }

  if (pathname.startsWith('/simulator')) {
    return 'simulator';
  }

  return null;
}

function getTrackedModuleId(pathname: string) {
  if (pathname.startsWith('/pretest')) {
    return 'pretest';
  }

  if (pathname.startsWith('/lectures')) {
    return 'lectures';
  }

  if (pathname.startsWith('/knobology')) {
    return 'knobology';
  }

  if (pathname.startsWith('/stations')) {
    return 'stations';
  }

  if (pathname.startsWith('/tnm-staging')) {
    return 'tnm-staging';
  }

  if (pathname.startsWith('/quiz')) {
    return 'quiz';
  }

  if (pathname.startsWith('/cases/case-001')) {
    return 'case-001';
  }

  if (pathname.startsWith('/simulator')) {
    return 'simulator';
  }

  return null;
}

export function App() {
  const location = useLocation();
  const { hydrated, recordModuleEngagement, state, visitRoute } = useLearnerProgress();
  const { isLoading: authLoading, isPasswordRecoverySession, isSupabaseEnabled, profile, user } = useAuth();
  const adminSessionActive = useCourseAdminSessionActive();
  const sessionRef = useRef<{
    moduleId: ReturnType<typeof getTrackedModuleId>;
    path: string;
    startedAt: number;
  } | null>(null);
  const routeId = resolveRouteId(location.pathname);
  const isAuthPath = location.pathname.startsWith('/auth');
  const isAdminPath = location.pathname.startsWith('/admin');

  const activeNavItems = useMemo(() => (adminSessionActive ? [...navItems, adminNavItem] : navItems), [adminSessionActive]);

  const gatedNavItems = useMemo(() => {
    return activeNavItems.map((item) => ({
      ...item,
      locked: !canAccessRoute(item.id, state, { admin: adminSessionActive }),
      lockedReason: getRouteLockReason(item.id, state, { admin: adminSessionActive }) ?? undefined,
      path: getLockedRoutePath(item.id, item.path, state, { admin: adminSessionActive }),
    }));
  }, [activeNavItems, adminSessionActive, state]);

  useEffect(() => {
    if (routeId) {
      visitRoute(routeId);
    }
  }, [location.pathname, visitRoute]);

  useEffect(() => {
    const now = Date.now();
    const currentModuleId = getTrackedModuleId(location.pathname);
    const previous = sessionRef.current;

    if (previous && (previous.path !== location.pathname || previous.moduleId !== currentModuleId)) {
      const durationSeconds = Math.max(1, Math.round((now - previous.startedAt) / 1000));
      recordModuleEngagement(previous.moduleId!, durationSeconds);

      if (isSupabaseEnabled && user) {
        const client = getSupabaseBrowserClient();

        if (client) {
          void recordModuleSession(client, user.id, {
            moduleId: previous.moduleId!,
            routePath: previous.path,
            startedAt: new Date(previous.startedAt).toISOString(),
            endedAt: new Date(now).toISOString(),
            durationSeconds,
          }).catch(() => {
            // Local engagement totals remain available even if remote inserts fail.
          });
        }
      }
    }

    sessionRef.current = currentModuleId
      ? {
          moduleId: currentModuleId,
          path: location.pathname,
          startedAt: now,
        }
      : null;
  }, [isSupabaseEnabled, location.pathname, recordModuleEngagement, user]);

  useEffect(() => {
    function flushActiveSession() {
      const activeSession = sessionRef.current;

      if (!activeSession) {
        return;
      }

      const endedAt = Date.now();
      const durationSeconds = Math.max(1, Math.round((endedAt - activeSession.startedAt) / 1000));
      recordModuleEngagement(activeSession.moduleId!, durationSeconds);

      if (isSupabaseEnabled && user) {
        const client = getSupabaseBrowserClient();

        if (client) {
          void recordModuleSession(client, user.id, {
            moduleId: activeSession.moduleId!,
            routePath: activeSession.path,
            startedAt: new Date(activeSession.startedAt).toISOString(),
            endedAt: new Date(endedAt).toISOString(),
            durationSeconds,
          }).catch(() => {
            // The next sync cycle still preserves local aggregate time.
          });
        }
      }

      sessionRef.current = {
        ...activeSession,
        startedAt: endedAt,
      };
    }

    function handleVisibilityChange() {
      if (document.visibilityState === 'hidden') {
        flushActiveSession();
      }
    }

    window.addEventListener('beforeunload', flushActiveSession);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', flushActiveSession);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isSupabaseEnabled, recordModuleEngagement, user]);

  if (!hydrated || (isSupabaseEnabled && authLoading)) {
    return (
      <AppShell navItems={gatedNavItems}>
        <div className="page-stack">
          <section className="section-card">
            <div className="eyebrow">Loading workspace</div>
            <h2>Preparing learner access…</h2>
          </section>
        </div>
      </AppShell>
    );
  }

  if (isSupabaseEnabled && !user && !adminSessionActive && !isAuthPath && !isAdminPath) {
    const next = `${location.pathname}${location.search}`;

    return <Navigate replace to={`/auth?next=${encodeURIComponent(next)}`} />;
  }

  if (isSupabaseEnabled && user && isPasswordRecoverySession && !adminSessionActive && !isAuthPath && !isAdminPath) {
    return <Navigate replace to="/auth?mode=reset-password" />;
  }

  if (isSupabaseEnabled && user && profile?.mustSetPassword && !adminSessionActive && !isAuthPath && !isAdminPath) {
    const next = `${location.pathname}${location.search}`;

    return <Navigate replace to={`/auth?next=${encodeURIComponent(next)}`} />;
  }

  if (isSupabaseEnabled && user && profile?.approvalStatus === 'pending' && !adminSessionActive && !isAuthPath && !isAdminPath) {
    const next = `${location.pathname}${location.search}`;

    return <Navigate replace to={`/auth?next=${encodeURIComponent(next)}`} />;
  }

  if (routeId && !canAccessRoute(routeId, state, { admin: adminSessionActive })) {
    return <Navigate replace to={getLockedRoutePath(routeId, location.pathname, state, { admin: adminSessionActive })} />;
  }

  return (
    <AppShell navItems={gatedNavItems}>
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<SponsorsPage />} path="/sponsors" />
        <Route element={<AuthPage />} path="/auth" />
        <Route element={<AdminPage />} path="/admin" />
        <Route element={<AccountPage />} path="/account" />
        <Route element={<PretestPage />} path="/pretest" />
        <Route element={<StationsPage />} path="/stations">
          <Route element={<Navigate replace to="explore" />} index />
          <Route element={<StationsExplorePage />} path="explore" />
          <Route element={<StationsFlashcardsPage />} path="flashcards" />
          <Route element={<StationsQuizPage />} path="quiz" />
          <Route element={<StationsHandbookPage />} path="handbook" />
        </Route>
        <Route element={<KnobologyPage />} path="/knobology" />
        <Route element={<TnmStagingPage />} path="/tnm-staging" />
        <Route element={<LecturesPage />} path="/lectures" />
        <Route element={<QuizPage />} path="/quiz" />
        <Route element={<Case001Page />} path="/cases/case-001" />
        <Route element={<SimulatorPage />} path="/simulator" />
        <Route element={<NotFoundPage />} path="*" />
      </Routes>
    </AppShell>
  );
}
