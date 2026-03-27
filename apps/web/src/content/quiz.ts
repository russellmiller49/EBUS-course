import quizBankData from '../../../../content/modules/quiz-bank.json';

import type { QuizQuestionContent, RootModuleId } from '@/content/types';

export const quizQuestions = quizBankData as QuizQuestionContent[];

export function getQuizQuestions(moduleId?: RootModuleId): QuizQuestionContent[] {
  if (!moduleId) {
    return quizQuestions;
  }

  return quizQuestions.filter((question) => question.moduleId === moduleId);
}
