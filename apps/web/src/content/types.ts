export type RootModuleId = 'knobology' | 'station-map' | 'station-explorer' | 'case-3d-explorer';
export type AppRouteId = 'home' | 'stations' | 'knobology' | 'lectures' | 'quiz' | 'case-001';
export type StationZoneKey = 'upper' | 'subcarinal' | 'hilar';
export type ExplorerViewId = 'ct' | 'bronchoscopy' | 'ultrasound';
export type KnobologyControlId =
  | 'depth'
  | 'gain'
  | 'contrast'
  | 'color-doppler'
  | 'calipers'
  | 'freeze'
  | 'save';

export interface ModuleContent {
  id: RootModuleId;
  slug: string;
  shortTitle: string;
  title: string;
  summary: string;
  overview: string;
  estimatedMinutes: number;
  route: string;
  goals: string[];
  plannedExperiences: string[];
  relatedStationIds: string[];
}

export interface QuizQuestionOption {
  id: string;
  label: string;
}

export interface QuizQuestionContent {
  id: string;
  moduleId: RootModuleId;
  prompt: string;
  type: 'single-best-answer' | 'image-interpretation' | 'scenario';
  options: QuizQuestionOption[];
  correctOptionId: string;
  explanation: string;
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

export interface StationMapQuizRound {
  id: string;
  stationId: string;
  prompt: string;
  hint: string;
}

export interface StationMapModuleContent {
  introSections: Array<{
    id: string;
    title: string;
    summary: string;
    takeaway: string;
  }>;
  mapTips: string[];
  flashcardPrompt: string;
  quizRounds: StationMapQuizRound[];
  reviewChecklist: string[];
  extensionNote: string;
}

export interface ExplorerViewContent {
  title: string;
  orientation: string;
  focusLabel: string;
  caption: string;
  visualAnchor:
    | 'upper-left'
    | 'upper-right'
    | 'middle-left'
    | 'middle-right'
    | 'center'
    | 'lower-left'
    | 'lower-right';
}

export interface StationCorrelationContent {
  stationId: string;
  aliases: string[];
  landmarkChecklist: string[];
  views: Record<ExplorerViewId, ExplorerViewContent>;
  quizItems: Array<{
    id: string;
    viewId: ExplorerViewId;
    prompt: string;
    optionIds: string[];
  }>;
}

export interface StationExplorerModuleContent {
  introSections: Array<{
    id: string;
    title: string;
    summary: string;
    takeaway: string;
  }>;
  reviewPrompts: string[];
  extensionNote: string;
}

export interface KnobologyLessonSection {
  id: string;
  title: string;
  summary: string;
  bestMove: string;
  pitfall: string;
}

export interface KnobologyCorrectionExercise {
  id: string;
  title: string;
  symptom: string;
  instructions: string;
  focusControl: 'depth' | 'gain' | 'contrast';
  start: {
    depth: number;
    gain: number;
    contrast: number;
  };
  target: {
    depth: number;
    gain: number;
    contrast: number;
  };
  successMessage: string;
}

export interface KnobologyReferenceCard {
  id: KnobologyControlId;
  title: string;
  whenToUse: string;
  whatChanges: string;
  noviceTrap: string;
}

export interface KnobologyDopplerLab {
  title: string;
  brief: string;
  prompt: string;
  safePathId: string;
  paths: Array<{
    id: string;
    label: string;
    description: string;
  }>;
}

export interface KnobologyModuleContent {
  primerSections: KnobologyLessonSection[];
  controlLabExercises: KnobologyCorrectionExercise[];
  dopplerLab: KnobologyDopplerLab;
  quickReferenceCards: KnobologyReferenceCard[];
  quizQuestionIds: string[];
}

export interface StationMediaEntry {
  ctImage?: string;
  ctAnnotatedImage?: string;
  bronchoscopyImage?: string;
  bronchoscopyVideo?: string;
  ebusImage?: string;
  ebusVideo?: string;
  notes?: string[];
}

export interface KnobologyMediaEntry {
  comparisonImages?: string[];
  clips?: string[];
  caption?: string;
}

export interface LectureManifestItem {
  id: string;
  title: string;
  subtitle: string;
  week: string;
  duration: string;
  poster?: string;
  video?: string;
  embedUrl?: string;
  topics: string[];
  status: 'available' | 'locked';
}

export interface NavigationItem {
  id: AppRouteId;
  label: string;
  icon: string;
  path: string;
}

export interface AppModuleCard {
  id: AppRouteId;
  title: string;
  description: string;
  accent: string;
  icon: string;
  path: string;
}

export interface ZoneTheme {
  bg: string;
  border: string;
  text: string;
  label: string;
}

export interface CombinedStation {
  id: string;
  displayName: string;
  shortLabel: string;
  zone: string;
  zoneKey: StationZoneKey;
  laterality: string;
  description: string;
  accessNotes: string;
  memoryCues: string[];
  confusionPairs: string[];
  relatedStationIds: string[];
  aliases: string[];
  landmarkChecklist: string[];
  mapNode: StationMapNode;
  views: Record<ExplorerViewId, ExplorerViewContent>;
  quizItems: StationCorrelationContent['quizItems'];
  media: StationMediaEntry;
}

export interface StationMapConnection {
  from: string;
  to: string;
}

export interface CombinedCaseManifest {
  caseId: string;
  title: string;
  description: string;
  assets: {
    glbFile: string;
    ctVolumeFile: string;
    segmentationFile: string;
  };
  sliceSeries: Record<
    'axial' | 'coronal' | 'sagittal',
    {
      folder: string;
      count: number;
      displayOrientation: string;
    }
  >;
  stations: Array<{
    id: string;
    label: string;
    groupLabel: string;
    targetIds: string[];
    primaryTargetId: string;
  }>;
}
