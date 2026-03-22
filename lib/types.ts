export type ModuleId = 'knobology' | 'station-map' | 'station-explorer';
export type BookmarkKind = 'module' | 'station' | 'card';

export interface AssetPlaceholder {
  key: string;
  label: string;
  folder: string;
  note: string;
}

export interface ModuleContent {
  id: ModuleId;
  slug: string;
  shortTitle: string;
  title: string;
  summary: string;
  overview: string;
  estimatedMinutes: number;
  featureFolder: string;
  route: string;
  goals: string[];
  plannedExperiences: string[];
  assetPlaceholders: AssetPlaceholder[];
  relatedStationIds: string[];
}

export interface StationAssetKeys {
  map: string;
  ct: string;
  bronchoscopy: string;
  ultrasound: string;
}

export interface StationContent {
  id: string;
  displayName: string;
  shortLabel: string;
  zone: string;
  laterality: string;
  description: string;
  accessNotes: string;
  memoryCues: string[];
  confusionPairs: string[];
  relatedStationIds: string[];
  assetKeys: StationAssetKeys;
}

export interface QuizQuestionOption {
  id: string;
  label: string;
}

export interface QuizQuestionContent {
  id: string;
  moduleId: ModuleId;
  prompt: string;
  type: 'single-best-answer' | 'image-interpretation' | 'scenario';
  options: QuizQuestionOption[];
  correctOptionId: string;
  explanation: string;
}

export interface RecognitionStat {
  attempts: number;
  correct: number;
}

export interface ModuleProgress {
  startedAt: string | null;
  completedAt: string | null;
  percentComplete: number;
  lastScreen: string | null;
  quizScore: number | null;
  recognitionStats: Record<string, RecognitionStat>;
}

export interface BookmarkedItem {
  id: string;
  kind: BookmarkKind;
  label: string;
  moduleId?: ModuleId;
}

export interface LearnerProgressState {
  version: 1;
  moduleProgress: Record<ModuleId, ModuleProgress>;
  bookmarks: BookmarkedItem[];
  lastViewedStationId: string | null;
}

export interface FeatureMilestone {
  id: string;
  title: string;
  description: string;
}

export interface FeatureScaffold {
  moduleId: ModuleId;
  statusLabel: string;
  emphasis: string;
  milestones: FeatureMilestone[];
  persistenceNotes: string[];
}

export interface CourseInfoQuickFact {
  value: string;
  label: string;
}

export interface CourseInfoAgendaItem {
  time: string;
  title: string;
  detail: string;
}

export interface CourseInfoContent {
  courseTitle: string;
  hostLine: string;
  hostDepartment: string;
  dateLabel: string;
  timeLabel: string;
  venueName: string;
  venueDetail: string;
  audience: string;
  overview: string;
  quickFacts: CourseInfoQuickFact[];
  courseDirectors: string[];
  facultySummary: string;
  formatHighlights: string[];
  prepWindow: string;
  prepTopics: string[];
  liveDayAgenda: CourseInfoAgendaItem[];
  addressLines: string[];
  parkingNote: string;
  travelNote: string;
}
