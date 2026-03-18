import {
  buildStationMapReviewSummary,
  evaluatePinTheStationGuess,
  shuffleStationIds,
} from '../logic';

describe('shuffleStationIds', () => {
  it('returns a deterministic shuffle when a random source is injected', () => {
    const values = [0.9, 0.2, 0.5];
    let index = 0;
    const random = () => values[index++];

    const shuffled = shuffleStationIds(['2R', '2L', '4R', '4L'], random);

    expect(shuffled).toEqual(['4R', '2L', '2R', '4L']);
  });
});

describe('evaluatePinTheStationGuess', () => {
  it('reports correctness and preserves the selected station id', () => {
    const result = evaluatePinTheStationGuess(
      {
        id: 'q-7',
        stationId: '7',
        prompt: 'Select station 7.',
        hint: 'Look below the carina.',
      },
      '10R',
    );

    expect(result.isCorrect).toBe(false);
    expect(result.correctStationId).toBe('7');
    expect(result.selectedStationId).toBe('10R');
  });
});

describe('buildStationMapReviewSummary', () => {
  it('builds review metrics from reviewed stations, bookmarks, and quiz score', () => {
    const summary = buildStationMapReviewSummary({
      bookmarkedCount: 3,
      correctCount: 4,
      reviewedStationIds: ['2R', '4R', '7', '7', '10R', '11R'],
      totalRounds: 5,
      totalStations: 9,
    });

    expect(summary.reviewedCount).toBe(5);
    expect(summary.bookmarkedCount).toBe(3);
    expect(summary.quizAccuracy).toBe(80);
    expect(summary.coverageLabel).toBe('Core landmarks mostly covered');
    expect(summary.quizLabel).toBe('Ready to move into the explorer');
  });
});
