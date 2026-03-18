import type { StationContent } from '@/lib/types';

export type ExplorerStepId = 'selector' | 'tri-view' | 'checklist' | 'challenge' | 'summary';
export type ExplorerViewId = 'ct' | 'bronchoscopy' | 'ultrasound';
export type ExplorerVisualAnchor =
  | 'upper-left'
  | 'upper-right'
  | 'middle-left'
  | 'middle-right'
  | 'center'
  | 'lower-left'
  | 'lower-right';

export interface ExplorerIntroSection {
  id: string;
  title: string;
  summary: string;
  takeaway: string;
}

export interface StationExplorerModuleContent {
  introSections: ExplorerIntroSection[];
  reviewPrompts: string[];
  extensionNote: string;
}

export interface ExplorerViewContent {
  title: string;
  orientation: string;
  focusLabel: string;
  caption: string;
  visualAnchor: ExplorerVisualAnchor;
}

export interface ExplorerQuizItemContent {
  id: string;
  viewId: ExplorerViewId;
  prompt: string;
  optionIds: string[];
}

export interface StationCorrelationContent {
  stationId: string;
  aliases: string[];
  landmarkChecklist: string[];
  views: Record<ExplorerViewId, ExplorerViewContent>;
  quizItems: ExplorerQuizItemContent[];
}

export interface ExplorerViewState extends ExplorerViewContent {
  assetKey: string;
}

export interface ExplorerStation extends StationContent {
  aliases: string[];
  landmarkChecklist: string[];
  primaryMemoryCue: string;
  views: Record<ExplorerViewId, ExplorerViewState>;
  quizItems: ExplorerQuizItemContent[];
}

export interface ExplorerChallengeRound extends ExplorerQuizItemContent {
  stationId: string;
}

export interface ExplorerRecognitionSummary {
  attemptedStations: number;
  overallAccuracy: number;
  strongestStationId: string | null;
  totalAttempts: number;
  totalCorrect: number;
  weakestStationIds: string[];
}
