import { describe, expect, it } from 'vitest';

import type { QuizQuestionContent } from '@/content/types';
import { calculateQuizResult } from '@/lib/quiz';

const questions: QuizQuestionContent[] = [
  {
    id: 'q1',
    moduleId: 'knobology',
    prompt: 'Question 1',
    type: 'single-best-answer',
    options: [
      { id: 'a', label: 'A' },
      { id: 'b', label: 'B' },
    ],
    correctOptionId: 'a',
    explanation: 'Because A.',
  },
  {
    id: 'q2',
    moduleId: 'station-map',
    prompt: 'Question 2',
    type: 'scenario',
    options: [
      { id: 'a', label: 'A' },
      { id: 'b', label: 'B' },
    ],
    correctOptionId: 'b',
    explanation: 'Because B.',
  },
];

describe('calculateQuizResult', () => {
  it('counts answered and correct questions separately', () => {
    const result = calculateQuizResult([...questions], { q1: 'a' });

    expect(result.correctCount).toBe(1);
    expect(result.answeredCount).toBe(1);
    expect(result.totalCount).toBe(2);
    expect(result.percent).toBe(50);
  });
});
