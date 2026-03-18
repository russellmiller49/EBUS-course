import type { QuizQuestionContent } from '@/lib/types';
import type { KnobologyQuizResult } from '@/features/knobology/types';

export function scoreKnobologyQuiz(
  questions: QuizQuestionContent[],
  answers: Record<string, string>,
): KnobologyQuizResult {
  const results = questions.map((question) => {
    const selectedOptionId = answers[question.id];

    return {
      question,
      selectedOptionId,
      isCorrect: selectedOptionId === question.correctOptionId,
    };
  });

  const answeredCount = results.filter((result) => Boolean(result.selectedOptionId)).length;
  const correctCount = results.filter((result) => result.isCorrect).length;
  const totalCount = questions.length;
  const percent = totalCount === 0 ? 0 : Math.round((correctCount / totalCount) * 100);

  return {
    correctCount,
    totalCount,
    percent,
    answeredCount,
    results,
  };
}
