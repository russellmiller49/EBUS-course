import enrichedCaseManifestData from '@/content/cases/generated/case_001.enriched.json';
import { case001SliceAssetIndex } from '@/content/cases/generated/case_001-asset-index';

import type {
  Case3DModuleContent,
  CasePlane,
  CaseReviewPrompt,
  CaseStation,
  EnrichedCaseManifest,
  EnrichedCaseTarget,
} from '@/features/case3d/types';

const caseManifest = enrichedCaseManifestData as unknown as EnrichedCaseManifest;
const stationMap = new Map(caseManifest.stations.map((station) => [station.id, station]));
const targetMap = new Map(caseManifest.targets.map((target) => [target.id, target]));
const targetsByStation = new Map(
  caseManifest.stations.map((station) => [
    station.id,
    caseManifest.targets.filter((target) => target.stationId === station.id),
  ]),
);

const reviewPrompts: CaseReviewPrompt[] = [
  {
    id: 'find-4r',
    prompt: 'Find 4R.',
    answerKind: 'station',
    correctId: '4R',
    optionIds: ['4R', '4L', '2R', '10R'],
    explanation: '4R is the right paratracheal station and stays anchored to the airway and azygous region.',
  },
  {
    id: 'find-carina',
    prompt: 'Find the carina.',
    answerKind: 'target',
    correctId: 'landmark_carina',
    optionIds: ['landmark_carina', 'landmark_trachea', 'landmark_left_mainstem', 'landmark_esophagus'],
    explanation: 'The carina is the airway bifurcation and a reliable orientation landmark before moving into 10R or 10L.',
  },
  {
    id: 'find-esophagus',
    prompt: 'Show the esophagus.',
    answerKind: 'target',
    correctId: 'landmark_esophagus',
    optionIds: ['landmark_esophagus', 'landmark_aorta', 'landmark_left_atrium', 'landmark_superior_vena_cava'],
    explanation: 'The esophagus is the GI landmark in this case and helps separate posterior structures from vascular ones.',
  },
  {
    id: 'orient-4l',
    prompt: 'Which structure helps orient station 4L?',
    answerKind: 'target',
    correctId: 'landmark_aorta',
    optionIds: ['landmark_aorta', 'landmark_azygous_vein', 'landmark_right_pa', 'landmark_esophagus'],
    explanation: 'The aorta is a high-yield 4L anchor and a common teaching cue when distinguishing left paratracheal anatomy.',
  },
  {
    id: 'find-azygous',
    prompt: 'Find the azygous vein.',
    answerKind: 'target',
    correctId: 'landmark_azygous_vein',
    optionIds: ['landmark_azygous_vein', 'landmark_superior_vena_cava', 'landmark_brachiocephalic_trunk', 'landmark_right_pa'],
    explanation: 'The azygous vein is a classic 4R orientation structure and sits among the right-sided vascular landmarks.',
  },
];

const case3DModuleContent: Case3DModuleContent = {
  introSections: [
    {
      id: 'why-case-linkage',
      title: 'One target, three linked views',
      summary: 'This module keeps the selected station or landmark tied to the bundled 3D case model plus the exported CT slice stacks.',
      takeaway: 'Select a target once, then watch the slice viewer jump to the derived frame for that anatomy.',
    },
    {
      id: 'toggle-focus',
      title: 'Filter the clutter',
      summary: 'Structure toggles let the learner strip the case down to lymph nodes, airway, vessels, cardiac structures, or GI anatomy.',
      takeaway: 'Keep lymph nodes, airway, and vessels on first. Add cardiac or GI structures only when you need extra orientation.',
    },
    {
      id: 'review-loop',
      title: 'Use the quick review loop',
      summary: 'The review set asks for a few high-yield nodes and landmarks with instant feedback rather than a long quiz.',
      takeaway: 'The score is lightweight; the real goal is learning which anchors help you relocate a station quickly.',
    },
  ],
  reviewPrompts,
};

export function getCase3DManifest(): EnrichedCaseManifest {
  return caseManifest;
}

export function getCase3DModuleContent(): Case3DModuleContent {
  return case3DModuleContent;
}

export function getCase3DStations(): CaseStation[] {
  return caseManifest.stations;
}

export function getCase3DTargets(): EnrichedCaseTarget[] {
  return caseManifest.targets;
}

export function getCase3DStationById(stationId: string): CaseStation | undefined {
  return stationMap.get(stationId);
}

export function getCase3DTargetById(targetId: string): EnrichedCaseTarget | undefined {
  return targetMap.get(targetId);
}

export function getCaseTargetsForStation(stationId: string): EnrichedCaseTarget[] {
  return targetsByStation.get(stationId) ?? [];
}

export function getCase3DSliceAssets(plane: CasePlane) {
  return case001SliceAssetIndex[plane];
}

export function getCase3DReviewPrompts(): CaseReviewPrompt[] {
  return reviewPrompts;
}
