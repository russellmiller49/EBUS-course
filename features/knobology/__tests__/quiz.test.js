const { scoreKnobologyQuiz } = require('../quiz');

describe('scoreKnobologyQuiz', () => {
  const questions = [
    {
      id: 'q1',
      correctOptionId: 'a',
      options: [],
    },
    {
      id: 'q2',
      correctOptionId: 'c',
      options: [],
    },
    {
      id: 'q3',
      correctOptionId: 'b',
      options: [],
    },
  ];

  it('counts correct answers and computes a percent', () => {
    const result = scoreKnobologyQuiz(questions, {
      q1: 'a',
      q2: 'b',
      q3: 'b',
    });

    expect(result.correctCount).toBe(2);
    expect(result.totalCount).toBe(3);
    expect(result.answeredCount).toBe(3);
    expect(result.percent).toBe(67);
  });

  it('tracks unanswered questions separately', () => {
    const result = scoreKnobologyQuiz(questions, {
      q1: 'a',
    });

    expect(result.correctCount).toBe(1);
    expect(result.answeredCount).toBe(1);
    expect(result.results[1].selectedOptionId).toBeUndefined();
  });
});
