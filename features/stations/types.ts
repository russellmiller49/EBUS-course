import type { StationContent } from '@/lib/types';

export type StationMapStepId = 'overview' | 'map' | 'flashcards' | 'quiz' | 'summary';

export interface StationMapIntroSection {
  id: string;
  title: string;
  summary: string;
  takeaway: string;
}

export interface StationMapQuizRound {
  id: string;
  stationId: string;
  prompt: string;
  hint: string;
}

export interface StationMapModuleContent {
  introSections: StationMapIntroSection[];
  mapTips: string[];
  flashcardPrompt: string;
  quizRounds: StationMapQuizRound[];
  reviewChecklist: string[];
  extensionNote: string;
}

export interface StationMapLandmark {
  id: string;
  kind: 'tube' | 'branch' | 'hub';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  label: string;
}

export interface StationMapNode {
  stationId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface StationMapLayout {
  designWidth: number;
  designHeight: number;
  landmarks: StationMapLandmark[];
  nodes: StationMapNode[];
}

export interface StationMapStation extends StationContent {
  mapNode: StationMapNode;
}

export interface StationMapReviewSummary {
  reviewedCount: number;
  bookmarkedCount: number;
  quizAccuracy: number;
  coverageLabel: string;
  quizLabel: string;
}
