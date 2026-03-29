const {
  getFirstUnansweredQuestionIndex,
  getNextUnansweredQuestionIndex,
  scorePretest,
} = require('../logic');

describe('pretest logic', () => {
  const questions = [
    { id: 'q1', correctOptionId: 'a', options: [] },
    { id: 'q2', correctOptionId: 'c', options: [] },
    { id: 'q3', correctOptionId: 'b', options: [] },
  ];

  it('scores answers without revealing the answer key', () => {
    const result = scorePretest(questions, {
      q1: 'a',
      q2: 'b',
      q3: 'b',
    });

    expect(result.correctCount).toBe(2);
    expect(result.answeredCount).toBe(3);
    expect(result.totalCount).toBe(3);
    expect(result.percent).toBe(67);
  });

  it('finds the first unanswered question and wraps to the next unanswered one', () => {
    const answers = {
      q1: 'a',
      q3: 'b',
    };

    expect(getFirstUnansweredQuestionIndex(questions, answers)).toBe(1);
    expect(getNextUnansweredQuestionIndex(questions, answers, 2)).toBe(1);
  });

  it('returns -1 when every question already has an answer', () => {
    const answers = {
      q1: 'a',
      q2: 'c',
      q3: 'b',
    };

    expect(getFirstUnansweredQuestionIndex(questions, answers)).toBe(-1);
    expect(getNextUnansweredQuestionIndex(questions, answers, 0)).toBe(-1);
  });
});
