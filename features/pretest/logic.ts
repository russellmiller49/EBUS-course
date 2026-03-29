import type { PretestQuestionContent, PretestResult } from '@/features/pretest/types';

export function scorePretest(
  questions: PretestQuestionContent[],
  answers: Record<string, string>,
): PretestResult {
  const results = questions.map((question) => {
    const selectedOptionId = answers[question.id];

    return {
      questionId: question.id,
      selectedOptionId,
      isCorrect: selectedOptionId === question.correctOptionId,
    };
  });
  const correctCount = results.filter((result) => result.isCorrect).length;
  const answeredCount = results.filter((result) => Boolean(result.selectedOptionId)).length;
  const totalCount = questions.length;

  return {
    correctCount,
    answeredCount,
    totalCount,
    percent: totalCount === 0 ? 0 : Math.round((correctCount / totalCount) * 100),
    results,
  };
}

export function getFirstUnansweredQuestionIndex(
  questions: PretestQuestionContent[],
  answers: Record<string, string>,
) {
  return questions.findIndex((question) => !answers[question.id]);
}

export function getNextUnansweredQuestionIndex(
  questions: PretestQuestionContent[],
  answers: Record<string, string>,
  fromIndex: number,
) {
  if (questions.length === 0) {
    return -1;
  }

  for (let offset = 1; offset <= questions.length; offset += 1) {
    const index = (fromIndex + offset) % questions.length;

    if (!answers[questions[index].id]) {
      return index;
    }
  }

  return -1;
}
