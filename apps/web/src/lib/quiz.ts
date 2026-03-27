import type { QuizQuestionContent } from '@/content/types';

export interface QuizResultItem {
  question: QuizQuestionContent;
  selectedOptionId: string | null;
  isCorrect: boolean;
}

export interface QuizResult {
  correctCount: number;
  totalCount: number;
  answeredCount: number;
  percent: number;
  items: QuizResultItem[];
}

export function calculateQuizResult(
  questions: QuizQuestionContent[],
  answers: Record<string, string | undefined>,
): QuizResult {
  const items = questions.map((question) => {
    const selectedOptionId = answers[question.id] ?? null;
    const isCorrect = selectedOptionId === question.correctOptionId;

    return {
      question,
      selectedOptionId,
      isCorrect,
    };
  });

  const correctCount = items.filter((item) => item.isCorrect).length;
  const answeredCount = items.filter((item) => item.selectedOptionId !== null).length;
  const totalCount = items.length;
  const percent = totalCount === 0 ? 0 : Math.round((correctCount / totalCount) * 100);

  return {
    correctCount,
    totalCount,
    answeredCount,
    percent,
    items,
  };
}
