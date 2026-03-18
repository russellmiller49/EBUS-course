import {
  buildExplorerRecognitionSummary,
  evaluateRecognitionAnswer,
  shuffleExplorerRounds,
} from '../logic';

describe('shuffleExplorerRounds', () => {
  it('returns a deterministic order when a random source is injected', () => {
    const values = [0.7, 0.1];
    let index = 0;
    const random = () => values[index++];

    const shuffled = shuffleExplorerRounds([{ id: 'a' }, { id: 'b' }, { id: 'c' }], random);

    expect(shuffled.map((item) => item.id)).toEqual(['b', 'a', 'c']);
  });
});

describe('evaluateRecognitionAnswer', () => {
  it('returns the correct station id and correctness flag', () => {
    const result = evaluateRecognitionAnswer(
      {
        id: 'round-4l',
        stationId: '4L',
        viewId: 'ct',
        prompt: 'Identify the station.',
        optionIds: ['4L', '10L', '2L', '7'],
      },
      '10L',
    );

    expect(result.isCorrect).toBe(false);
    expect(result.correctStationId).toBe('4L');
    expect(result.selectedStationId).toBe('10L');
  });
});

describe('buildExplorerRecognitionSummary', () => {
  it('summarizes attempts, accuracy, and weakest stations', () => {
    const summary = buildExplorerRecognitionSummary({
      recognitionStats: {
        '2R': { attempts: 2, correct: 2 },
        '4R': { attempts: 3, correct: 1 },
        '7': { attempts: 1, correct: 0 },
      },
      stationIds: ['2R', '4R', '7', '10R'],
    });

    expect(summary.attemptedStations).toBe(3);
    expect(summary.totalAttempts).toBe(6);
    expect(summary.totalCorrect).toBe(3);
    expect(summary.overallAccuracy).toBe(50);
    expect(summary.strongestStationId).toBe('2R');
    expect(summary.weakestStationIds).toEqual(['7', '4R', '2R']);
  });
});
