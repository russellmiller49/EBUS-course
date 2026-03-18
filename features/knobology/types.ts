import type { QuizQuestionContent } from '@/lib/types';

export type KnobologyStepId =
  | 'primer'
  | 'control-lab'
  | 'doppler-mini-lab'
  | 'quick-reference'
  | 'quiz'
  | 'completion-summary';

export type KnobologyControlKey = 'depth' | 'gain' | 'contrast';

export interface KnobologyLessonSection {
  id: string;
  title: string;
  summary: string;
  bestMove: string;
  pitfall: string;
}

export interface KnobologyControlState {
  depth: number;
  gain: number;
  contrast: number;
  colorDoppler: boolean;
  calipers: boolean;
  frozen: boolean;
  saved: boolean;
}

export interface KnobologyCorrectionExercise {
  id: string;
  title: string;
  symptom: string;
  instructions: string;
  focusControl: KnobologyControlKey;
  start: Pick<KnobologyControlState, 'depth' | 'gain' | 'contrast'>;
  target: Pick<KnobologyControlState, 'depth' | 'gain' | 'contrast'>;
  successMessage: string;
}

export interface KnobologyReferenceCard {
  id: string;
  title: string;
  whenToUse: string;
  whatChanges: string;
  noviceTrap: string;
}

export interface KnobologyDopplerPath {
  id: string;
  label: string;
  description: string;
}

export interface KnobologyDopplerLab {
  title: string;
  brief: string;
  prompt: string;
  safePathId: string;
  paths: KnobologyDopplerPath[];
}

export interface KnobologyModuleContent {
  primerSections: KnobologyLessonSection[];
  controlLabExercises: KnobologyCorrectionExercise[];
  dopplerLab: KnobologyDopplerLab;
  quickReferenceCards: KnobologyReferenceCard[];
  quizQuestionIds: string[];
  assetPlaceholders: Array<{
    key: string;
    label: string;
    note: string;
  }>;
}

export interface KnobologyFrameModel {
  brightness: number;
  hazeOpacity: number;
  nodeTop: number;
  nodeOpacity: number;
  nodeBorderOpacity: number;
  colorSignalOpacity: number;
  calipersVisible: boolean;
  frozen: boolean;
  saved: boolean;
}

export interface KnobologyEvaluation {
  score: number;
  isSolved: boolean;
  feedback: string;
  frame: KnobologyFrameModel;
}

export interface KnobologyQuizResult {
  correctCount: number;
  totalCount: number;
  percent: number;
  answeredCount: number;
  results: Array<{
    question: QuizQuestionContent;
    selectedOptionId?: string;
    isCorrect: boolean;
  }>;
}
