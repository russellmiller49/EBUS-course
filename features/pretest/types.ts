export type PretestImageAssetKey = 'pretest-q2-figure' | 'pretest-q8-figure' | 'pretest-q22-figure';
export type PretestQuestionType = 'single-best-answer' | 'scenario' | 'image-interpretation';

export interface PretestQuestionOption {
  id: string;
  label: string;
}

export interface PretestQuestionContent {
  id: string;
  prompt: string;
  type: PretestQuestionType;
  imageAssetKey: PretestImageAssetKey | null;
  options: PretestQuestionOption[];
  correctOptionId: string;
}

export interface PretestContent {
  id: 'pretest';
  title: string;
  summary: string;
  instructions: string[];
  demoPolicy: string;
  questions: PretestQuestionContent[];
}

export interface PretestResultItem {
  questionId: string;
  selectedOptionId?: string;
  isCorrect: boolean;
}

export interface PretestResult {
  correctCount: number;
  answeredCount: number;
  totalCount: number;
  percent: number;
  results: PretestResultItem[];
}

export interface PretestProgress {
  answers: Record<string, string>;
  currentQuestionIndex: number;
  submittedAt: string | null;
  score: number | null;
  answeredCount: number;
  totalQuestions: number;
  attemptCount: number;
}
