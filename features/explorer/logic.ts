import type { ExplorerChallengeRound, ExplorerRecognitionSummary } from '@/features/explorer/types';
import type { RecognitionStat } from '@/lib/types';

export function shuffleExplorerRounds<T>(items: T[], random: () => number = Math.random): T[] {
  const nextItems = [...items];

  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    const current = nextItems[index];

    nextItems[index] = nextItems[swapIndex];
    nextItems[swapIndex] = current;
  }

  return nextItems;
}

export function evaluateRecognitionAnswer(round: ExplorerChallengeRound, selectedStationId: string) {
  return {
    correctStationId: round.stationId,
    isCorrect: round.stationId === selectedStationId,
    selectedStationId,
  };
}

function getAccuracy(stat?: RecognitionStat) {
  if (!stat || stat.attempts === 0) {
    return 0;
  }

  return Math.round((stat.correct / stat.attempts) * 100);
}

export function buildExplorerRecognitionSummary({
  recognitionStats,
  stationIds,
}: {
  recognitionStats: Record<string, RecognitionStat>;
  stationIds: string[];
}): ExplorerRecognitionSummary {
  const attemptedStations = stationIds.filter((stationId) => (recognitionStats[stationId]?.attempts ?? 0) > 0);
  const totalAttempts = attemptedStations.reduce(
    (sum, stationId) => sum + (recognitionStats[stationId]?.attempts ?? 0),
    0,
  );
  const totalCorrect = attemptedStations.reduce(
    (sum, stationId) => sum + (recognitionStats[stationId]?.correct ?? 0),
    0,
  );
  const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
  const rankedStations = attemptedStations
    .map((stationId) => ({
      accuracy: getAccuracy(recognitionStats[stationId]),
      stationId,
    }))
    .sort((left, right) => left.accuracy - right.accuracy || left.stationId.localeCompare(right.stationId));
  const strongestStationId = rankedStations.length ? rankedStations[rankedStations.length - 1].stationId : null;
  const weakestStationIds = rankedStations.slice(0, 3).map((item) => item.stationId);

  return {
    attemptedStations: attemptedStations.length,
    overallAccuracy,
    strongestStationId,
    totalAttempts,
    totalCorrect,
    weakestStationIds,
  };
}
