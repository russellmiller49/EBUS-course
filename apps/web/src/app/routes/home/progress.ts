import type { LearnerProgressState } from '@/lib/progress';

export interface HomeLearningStep {
  id: 'lectures' | 'knobology' | 'stations' | 'case-001' | 'quiz';
  path: string;
  percent: number;
  title: string;
  visitedAt: string | null;
}

const learningStepDefinitions: Array<Pick<HomeLearningStep, 'id' | 'path' | 'title'>> = [
  { id: 'lectures', title: 'Lectures', path: '/lectures' },
  { id: 'knobology', title: 'Knobology', path: '/knobology' },
  { id: 'stations', title: 'Stations', path: '/stations/explore' },
  { id: 'case-001', title: 'Case 001', path: '/cases/case-001' },
  { id: 'quiz', title: 'Quiz', path: '/quiz' },
];

function getTimestamp(value: string | null): number {
  if (!value) {
    return 0;
  }

  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function getStationsPercent(state: LearnerProgressState): number {
  const stationMap = state.moduleProgress['station-map'].percentComplete;
  const stationExplorer = state.moduleProgress['station-explorer'].percentComplete;

  return Math.round((stationMap + stationExplorer) / 2);
}

function getStationsVisitedAt(state: LearnerProgressState): string | null {
  const visitedAt = [
    state.moduleProgress['station-map'].visitedAt,
    state.moduleProgress['station-explorer'].visitedAt,
  ].filter(Boolean) as string[];

  if (visitedAt.length === 0) {
    return null;
  }

  return [...visitedAt].sort((left, right) => getTimestamp(right) - getTimestamp(left))[0] ?? null;
}

export function buildHomeProgressModel(state: LearnerProgressState) {
  const learningSteps: HomeLearningStep[] = learningStepDefinitions.map((step) => {
    if (step.id === 'stations') {
      return {
        ...step,
        percent: getStationsPercent(state),
        visitedAt: getStationsVisitedAt(state),
      };
    }

    const progress = state.moduleProgress[step.id];

    return {
      ...step,
      percent: progress.percentComplete,
      visitedAt: progress.visitedAt,
    };
  });

  const visitedSteps = learningSteps.filter((step) => step.visitedAt);
  const incompleteVisitedSteps = visitedSteps.filter((step) => step.percent < 100);
  const orderedCandidates = [...(incompleteVisitedSteps.length > 0 ? incompleteVisitedSteps : visitedSteps)].sort(
    (left, right) => getTimestamp(right.visitedAt) - getTimestamp(left.visitedAt),
  );

  return {
    learningSteps,
    resumeModule: orderedCandidates[0] ?? learningSteps.find((step) => step.percent < 100) ?? learningSteps[0] ?? null,
  };
}
