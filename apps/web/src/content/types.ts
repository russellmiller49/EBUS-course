export type RootModuleId = 'pretest' | 'knobology' | 'station-map' | 'station-explorer' | 'case-3d-explorer';
export type AppRouteId = 'home' | 'pretest' | 'stations' | 'knobology' | 'lectures' | 'quiz' | 'case-001';
export type StationZoneKey = 'upper' | 'subcarinal' | 'hilar';
export type ExplorerViewId = 'ct' | 'bronchoscopy' | 'ultrasound';
export type LessonSectionKind =
  | 'overview'
  | 'learning-objectives'
  | 'core-concept'
  | 'landmarks'
  | 'pitfall'
  | 'clinical-pearl'
  | 'technique'
  | 'staging'
  | 'artifact'
  | 'sonographic-pattern'
  | 'case';
export type QuizQuestionType =
  | 'single-best-answer'
  | 'multi-select'
  | 'ordering'
  | 'image-interpretation'
  | 'case-vignette';
export type QuizDifficulty = 'basic' | 'intermediate' | 'advanced';
export type StationAccessProfile = 'EBUS' | 'EUS-B' | 'Both' | 'Visualized only';
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
  rationale: string;
}

export type PretestQuestionType = 'single-best-answer' | 'scenario' | 'image-interpretation';
export type PretestImageAssetKey = 'pretest-q2-figure' | 'pretest-q8-figure' | 'pretest-q22-figure';

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

export interface QuizQuestionContent {
  id: string;
  moduleId: RootModuleId;
  prompt: string;
  type: QuizQuestionType;
  options: QuizQuestionOption[];
  correctOptionIds: string[];
  explanation: string;
  difficulty: QuizDifficulty;
  tags: string[];
  caseTitle?: string;
  caseSummary?: string;
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

export interface LessonCaseVignette {
  title: string;
  scenario: string;
  prompt: string;
  takeaway: string;
}

export interface LessonSection {
  id: string;
  title: string;
  kind: LessonSectionKind;
  body: string;
  bullets?: string[];
  imageIds?: string[];
  relatedStationIds?: string[];
  pearl?: string;
  pitfall?: string;
  checklist?: string[];
  caseVignette?: LessonCaseVignette;
}

export interface EducationalModuleContent {
  id: string;
  title: string;
  summary: string;
  learningObjectives: string[];
  sections: LessonSection[];
}

export interface StationBoundaryDefinition {
  superior: string;
  inferior: string;
  medial?: string;
  lateral?: string;
  anterior?: string;
  posterior?: string;
}

export interface StationStagingImplication {
  ipsilateral: string;
  contralateral: string;
  note: string;
}

export interface StationPerspectiveChecklist {
  ct: string[];
  bronchoscopy: string[];
  ultrasound: string[];
}

export interface StationContent {
  id: string;
  displayName: string;
  shortLabel: string;
  iaslcName: string;
  zone: string;
  laterality: string;
  description: string;
  accessNotes: string;
  accessProfile: StationAccessProfile;
  bestEbusWindow: string;
  landmarkVessels: string[];
  boundaryDefinition: StationBoundaryDefinition;
  boundaryNotes: string[];
  nStageImplication: StationStagingImplication;
  clinicalImportance: string;
  memoryCues: string[];
  confusionPairs: string[];
  commonConfusionPair: string;
  relatedStationIds: string[];
  whatYouSee: StationPerspectiveChecklist;
  safePunctureConsiderations: string[];
  stagingChangeFinding: string;
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
  explanation: string;
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

export interface StationRecognitionQuizItem {
  id: string;
  viewId: ExplorerViewId;
  prompt: string;
  optionIds: string[];
  explanation: string;
}

export interface StationCorrelationContent {
  stationId: string;
  aliases: string[];
  landmarkChecklist: string[];
  views: Record<ExplorerViewId, ExplorerViewContent>;
  quizItems: StationRecognitionQuizItem[];
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

export interface StationAnnotationRegion {
  label: string;
  points: Array<[number, number]>;
}

export interface StationAnnotationSet {
  width: number;
  height: number;
  regions: StationAnnotationRegion[];
}

export interface StationMediaVariant {
  id: string;
  label: string;
  image?: string;
  revealImage?: string;
  note?: string;
  annotationKey?: string;
  annotations?: StationAnnotationSet;
}

export interface StationMediaEntry {
  ctVariants?: StationMediaVariant[];
  bronchoscopyVariants?: StationMediaVariant[];
  ebusVariants?: StationMediaVariant[];
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

export interface CombinedStation extends StationContent {
  zoneKey: StationZoneKey;
  aliases: string[];
  landmarkChecklist: string[];
  mapNode: StationMapNode;
  views: Record<ExplorerViewId, ExplorerViewContent>;
  quizItems: StationRecognitionQuizItem[];
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
