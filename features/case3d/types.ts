export type CasePlane = 'axial' | 'coronal' | 'sagittal';
export type CaseSelectionMode = 'station' | 'target';
export type ToggleSetId = 'lymph_nodes' | 'airway' | 'vessels' | 'cardiac' | 'gi';
export type AxisName = 'i' | 'j' | 'k';

export const CASE3D_PLANES: CasePlane[] = ['axial', 'coronal', 'sagittal'];
export const CASE3D_TOGGLE_SET_IDS: ToggleSetId[] = ['lymph_nodes', 'airway', 'vessels', 'cardiac', 'gi'];
export const DEFAULT_CASE3D_VISIBLE_TOGGLE_SET_IDS: ToggleSetId[] = ['lymph_nodes', 'airway', 'vessels'];
export const DEFAULT_CASE3D_PLANE: CasePlane = 'axial';

export interface SliceIndex {
  axial: number;
  coronal: number;
  sagittal: number;
}

export type ToggleSet = Record<ToggleSetId, boolean>;

export interface SliceSeriesEntry {
  folder: string;
  count: number;
  framePattern: string | null;
  displayOrientation: CasePlane;
  coverageAssumption: [number, number];
  indexDerivation: string;
  sourceFolderSpelling?: string;
}

export interface SliceSeries {
  axial: SliceSeriesEntry;
  coronal: SliceSeriesEntry;
  sagittal: SliceSeriesEntry;
}

export interface CaseAssets {
  glbFile: string;
  ctVolumeFile: string;
  segmentationFile?: string;
}

export interface CaseTarget {
  id: string;
  label: string;
  displayLabel: string;
  kind: 'lymph_node' | 'landmark';
  stationId?: string;
  stationGroupId?: string;
  markupFile: string;
  meshNameExpected?: string;
  meshNameVerified?: boolean;
  deriveSliceIndexFromMarkup?: boolean;
  sliceIndex: {
    axial: number | null;
    coronal: number | null;
    sagittal: number | null;
  };
  notes?: string;
  meshName?: string;
}

export interface CaseStation {
  id: string;
  label: string;
  groupLabel: string;
  targetIds: string[];
  primaryTargetId: string;
  kind: 'nodal_station';
}

export interface CaseManifest {
  schemaVersion: number;
  caseId: string;
  title: string;
  description: string;
  assets: CaseAssets;
  coordinateAssumptions: {
    worldCoordinateSystem: string;
    sliceIndicesMustBeDerivedFrom: string[];
    note: string;
  };
  sliceSeries: SliceSeries;
  stations: CaseStation[];
  targets: CaseTarget[];
}

export interface AxisMap {
  sagittal: AxisName;
  coronal: AxisName;
  axial: AxisName;
}

export interface EnrichedCaseTarget extends Omit<CaseTarget, 'sliceIndex'> {
  sliceIndex: SliceIndex;
  voxelIndex: SliceIndex;
  structureGroupId: ToggleSetId;
  markup: {
    coordinateSystem: 'LPS';
    sourceCoordinateSystem: string;
    position: [number, number, number];
  };
  derived: {
    continuousVoxel: [number, number, number];
    roundedVoxel: [number, number, number];
    normalized: Record<CasePlane, number>;
    axisMap: AxisMap;
  };
  meshExists: boolean;
  meshNameResolved: string | null;
}

export interface EnrichedCaseManifest extends Omit<CaseManifest, 'targets'> {
  generatedAt: string;
  meshNames: string[];
  sliceAssetCounts: Record<CasePlane, number>;
  warnings: string[];
  targets: EnrichedCaseTarget[];
}

export interface CaseReviewPrompt {
  id: string;
  prompt: string;
  answerKind: 'station' | 'target';
  correctId: string;
  optionIds: string[];
  explanation: string;
}

export interface Case3DModuleContent {
  introSections: Array<{
    id: string;
    title: string;
    summary: string;
    takeaway: string;
  }>;
  reviewPrompts: CaseReviewPrompt[];
}

export interface Case3DExplorerProgress {
  selectedStationId: string | null;
  selectedTargetId: string | null;
  selectedPlane: CasePlane;
  visibleToggleSetIds: ToggleSetId[];
  visitedTargetIds: string[];
  reviewScore: number | null;
}
