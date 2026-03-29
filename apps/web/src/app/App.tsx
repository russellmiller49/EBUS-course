import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { AppShell } from '@/components/AppShell';
import type { AppRouteId, NavigationItem } from '@/content/types';
import { HomePage } from '@/app/routes/HomePage';
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
import { NotFoundPage } from '@/app/routes/NotFoundPage';
import { useLearnerProgress } from '@/lib/progress';

const navItems: NavigationItem[] = [
  { id: 'home', label: 'Home', icon: '⌂', path: '/' },
  { id: 'pretest', label: 'Pretest', icon: '◇', path: '/pretest' },
  { id: 'lectures', label: 'Lectures', icon: '▶', path: '/lectures' },
  { id: 'knobology', label: 'Knobology', icon: '◐', path: '/knobology' },
  { id: 'stations', label: 'Stations', icon: '◎', path: '/stations' },
  { id: 'case-001', label: 'Case', icon: '◫', path: '/cases/case-001' },
  { id: 'quiz', label: 'Quiz', icon: '✎', path: '/quiz' },
];

function resolveRouteId(pathname: string): AppRouteId | null {
  if (pathname === '/') {
    return 'home';
  }

  if (pathname.startsWith('/stations')) {
    return 'stations';
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

  return null;
}

export function App() {
  const location = useLocation();
  const { visitRoute } = useLearnerProgress();

  useEffect(() => {
    const routeId = resolveRouteId(location.pathname);

    if (routeId) {
      visitRoute(routeId);
    }
  }, [location.pathname, visitRoute]);

  return (
    <AppShell navItems={navItems}>
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<PretestPage />} path="/pretest" />
        <Route element={<StationsPage />} path="/stations">
          <Route element={<Navigate replace to="explore" />} index />
          <Route element={<StationsExplorePage />} path="explore" />
          <Route element={<StationsFlashcardsPage />} path="flashcards" />
          <Route element={<StationsQuizPage />} path="quiz" />
          <Route element={<StationsHandbookPage />} path="handbook" />
        </Route>
        <Route element={<KnobologyPage />} path="/knobology" />
        <Route element={<LecturesPage />} path="/lectures" />
        <Route element={<QuizPage />} path="/quiz" />
        <Route element={<Case001Page />} path="/cases/case-001" />
        <Route element={<NotFoundPage />} path="*" />
      </Routes>
    </AppShell>
  );
}
