import type { StationMapQuizRound, StationMapReviewSummary } from '@/features/stations/types';

export function shuffleStationIds(stationIds: string[], random: () => number = Math.random): string[] {
  const nextIds = [...stationIds];

  for (let index = nextIds.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    const current = nextIds[index];

    nextIds[index] = nextIds[swapIndex];
    nextIds[swapIndex] = current;
  }

  return nextIds;
}

export function evaluatePinTheStationGuess(round: StationMapQuizRound, selectedStationId: string) {
  return {
    correctStationId: round.stationId,
    isCorrect: round.stationId === selectedStationId,
    selectedStationId,
  };
}

export function buildStationMapReviewSummary({
  bookmarkedCount,
  correctCount,
  reviewedStationIds,
  totalRounds,
  totalStations,
}: {
  bookmarkedCount: number;
  correctCount: number;
  reviewedStationIds: string[];
  totalRounds: number;
  totalStations: number;
}): StationMapReviewSummary {
  const reviewedCount = new Set(reviewedStationIds).size;
  const quizAccuracy = totalRounds > 0 ? Math.round((correctCount / totalRounds) * 100) : 0;
  const coverageRatio = totalStations > 0 ? reviewedCount / totalStations : 0;
  const coverageLabel =
    coverageRatio >= 1
      ? 'Full core map reviewed'
      : coverageRatio >= 0.55
        ? 'Core landmarks mostly covered'
        : 'Keep tracing the map for more repetition';
  const quizLabel =
    quizAccuracy >= 80
      ? 'Ready to move into the explorer'
      : quizAccuracy >= 60
        ? 'Solid recall with a few confusion pairs left'
        : 'Revisit the map and flashcards before advancing';

  return {
    reviewedCount,
    bookmarkedCount,
    quizAccuracy,
    coverageLabel,
    quizLabel,
  };
}
