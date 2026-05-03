import { useEffect, useMemo, useRef } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { AppShell } from '@/components/AppShell';
import type { AppRouteId, NavigationItem } from '@/content/types';
import { HomePage } from '@/app/routes/HomePage';
import { WelcomePage } from '@/app/routes/WelcomePage';
import { AuthPage } from '@/app/routes/AuthPage';
import { AdminPage } from '@/app/routes/AdminPage';
import { AccountPage } from '@/app/routes/AccountPage';
import { SponsorsPage } from '@/app/routes/SponsorsPage';
import { StationsPage } from '@/app/routes/StationsPage';
import { StationsExplorePage } from '@/app/routes/stations/ExplorePage';
import { StationsFlashcardsPage } from '@/app/routes/stations/FlashcardsPage';
import { StationsHandbookPage } from '@/app/routes/stations/HandbookPage';
import { StationsQuizPage } from '@/app/routes/stations/StationsQuizPage';
import { SonographicInterpretationPage } from '@/app/routes/stations/SonographicInterpretationPage';
import { KnobologyPage } from '@/app/routes/KnobologyPage';
import { LecturesPage } from '@/app/routes/LecturesPage';
import { PretestPage } from '@/app/routes/PretestPage';
import { PostCoursePage } from '@/app/routes/PostCoursePage';
import { Case001Page } from '@/app/routes/Case001Page';
import { SimulatorPage } from '@/app/routes/SimulatorPage';
import { TnmStagingPage } from '@/app/routes/TnmStagingPage';
import { NotFoundPage } from '@/app/routes/NotFoundPage';
import { canAccessRoute, getLockedRoutePath, getRouteLockReason } from '@/lib/access';
import { useCourseAdminSessionActive, useCourseVendorSessionActive } from '@/lib/adminSession';
import { useAuth } from '@/lib/auth';
import { useCourseNow } from '@/lib/courseClock';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { useLearnerProgress } from '@/lib/progress';
import { recordModuleSession } from '@/lib/supabaseTracking';

const navItems: NavigationItem[] = [
  { id: 'home', label: 'Course home', icon: '⌂', path: '/' },
  { id: 'welcome', label: 'Welcome', icon: 'ⓘ', path: '/welcome' },
  { id: 'sponsors', label: 'Sponsors', icon: '☆', path: '/sponsors' },
  { id: 'pretest', label: 'Pre-course survey and test', icon: '◇', path: '/pretest' },
  { id: 'lectures', label: 'Lectures', icon: '▶', path: '/lectures' },
  { id: 'knobology', label: 'Knobology', icon: '◐', path: '/knobology' },
  { id: 'stations', label: 'Stations', icon: '◎', path: '/stations' },
  { id: 'tnm-staging', label: 'TNM-9', icon: '◆', path: '/tnm-staging' },
  { id: 'case-001', label: '3D Anatomy', icon: '◫', path: '/cases/case-001' },
  { id: 'simulator', label: 'Simulator', icon: '◌', path: '/simulator' },
  { id: 'post-course', label: 'Post-course survey and test', icon: '◈', path: '/post-course' },
];

const adminNavItem: NavigationItem = { id: 'admin', label: 'Dashboard', icon: '▣', path: '/admin' };

function resolveRouteId(pathname: string): AppRouteId | null {
  if (pathname === '/') {
    return 'home';
  }

  if (pathname.startsWith('/welcome')) {
    return 'welcome';
  }

  if (pathname.startsWith('/course-info') || pathname.startsWith('/home')) {
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

  if (pathname.startsWith('/post-course')) {
    return 'post-course';
  }

  if (pathname.startsWith('/knobology')) {
    return 'knobology';
  }

  if (pathname.startsWith('/lectures')) {
    return 'lectures';
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

  if (pathname.startsWith('/post-course')) {
    return 'lectures';
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
  const nowMs = useCourseNow();
  const adminSessionActive = useCourseAdminSessionActive();
  const vendorSessionActive = useCourseVendorSessionActive();
  const previewSessionActive = adminSessionActive || vendorSessionActive;
  const accountComplete = !isSupabaseEnabled || Boolean(user);
  const accessOptions = useMemo(
    () => ({ accountComplete, admin: adminSessionActive, nowMs, preview: vendorSessionActive }),
    [accountComplete, adminSessionActive, nowMs, vendorSessionActive],
  );
  const sessionRef = useRef<{
    moduleId: ReturnType<typeof getTrackedModuleId>;
    path: string;
    startedAt: number;
  } | null>(null);
  const routeId = resolveRouteId(location.pathname);
  const isAuthPath = location.pathname.startsWith('/auth');
  const isAdminPath = location.pathname.startsWith('/admin');
  const isPublicOnboardingPath =
    location.pathname === '/' ||
    location.pathname.startsWith('/welcome') ||
    location.pathname.startsWith('/course-info') ||
    location.pathname.startsWith('/home') ||
    location.pathname.startsWith('/pretest') ||
    location.pathname.startsWith('/sponsors');

  const activeNavItems = useMemo(() => (adminSessionActive ? [...navItems, adminNavItem] : navItems), [adminSessionActive]);

  const gatedNavItems = useMemo(() => {
    return activeNavItems.map((item) => ({
      ...item,
      locked: !canAccessRoute(item.id, state, accessOptions),
      lockedReason: getRouteLockReason(item.id, state, accessOptions) ?? undefined,
      path: getLockedRoutePath(item.id, item.path, state, accessOptions),
    }));
  }, [accessOptions, activeNavItems, state]);

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

  if (!hydrated || (isSupabaseEnabled && authLoading && !previewSessionActive)) {
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

  if (isSupabaseEnabled && !user && !previewSessionActive && !isAuthPath && !isAdminPath && !isPublicOnboardingPath) {
    const next = `${location.pathname}${location.search}`;

    return <Navigate replace to={`/auth?next=${encodeURIComponent(next)}`} />;
  }

  if (isSupabaseEnabled && user && isPasswordRecoverySession && !previewSessionActive && !isAuthPath && !isAdminPath) {
    return <Navigate replace to="/auth?mode=reset-password" />;
  }

  if (isSupabaseEnabled && user && profile?.mustSetPassword && !previewSessionActive && !isAuthPath && !isAdminPath) {
    const next = `${location.pathname}${location.search}`;

    return <Navigate replace to={`/auth?next=${encodeURIComponent(next)}`} />;
  }

  if (isSupabaseEnabled && user && profile?.approvalStatus === 'pending' && !previewSessionActive && !isAuthPath && !isAdminPath) {
    const next = `${location.pathname}${location.search}`;

    return <Navigate replace to={`/auth?next=${encodeURIComponent(next)}`} />;
  }

  if (routeId && !canAccessRoute(routeId, state, accessOptions)) {
    return <Navigate replace to={getLockedRoutePath(routeId, location.pathname, state, accessOptions)} />;
  }

  return (
    <AppShell navItems={gatedNavItems}>
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<WelcomePage />} path="/welcome" />
        <Route element={<Navigate replace to="/" />} path="/course-info" />
        <Route element={<Navigate replace to="/" />} path="/home" />
        <Route element={<SponsorsPage />} path="/sponsors" />
        <Route element={<AuthPage />} path="/auth" />
        <Route element={<AdminPage />} path="/admin" />
        <Route element={<AccountPage />} path="/account" />
        <Route element={<PretestPage />} path="/pretest" />
        <Route element={<PostCoursePage />} path="/post-course" />
        <Route element={<StationsPage />} path="/stations">
          <Route element={<Navigate replace to="explore" />} index />
          <Route element={<StationsExplorePage />} path="explore" />
          <Route element={<SonographicInterpretationPage />} path="sonographic-interpretation" />
          <Route element={<StationsFlashcardsPage />} path="flashcards" />
          <Route element={<StationsQuizPage />} path="quiz" />
          <Route element={<StationsHandbookPage />} path="handbook" />
        </Route>
        <Route element={<KnobologyPage />} path="/knobology" />
        <Route element={<TnmStagingPage />} path="/tnm-staging" />
        <Route element={<LecturesPage />} path="/lectures" />
        <Route element={<Navigate replace to="/lectures" />} path="/quiz" />
        <Route element={<Case001Page />} path="/cases/case-001" />
        <Route element={<SimulatorPage />} path="/simulator" />
        <Route element={<NotFoundPage />} path="*" />
      </Routes>
    </AppShell>
  );
}
