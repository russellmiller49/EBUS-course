import {
  CASE3D_TOGGLE_SET_IDS,
  DEFAULT_CASE3D_VISIBLE_TOGGLE_SET_IDS,
  type CasePlane,
  type CaseReviewPrompt,
  type CaseSelectionMode,
  type CaseStation,
  type EnrichedCaseManifest,
  type EnrichedCaseTarget,
  type ToggleSet,
  type ToggleSetId,
} from '@/features/case3d/types';

export const DEFAULT_CASE3D_TOGGLE_SET: ToggleSet = {
  lymph_nodes: true,
  airway: true,
  vessels: true,
  cardiac: false,
  gi: false,
};

function compareDistance(left: EnrichedCaseTarget, right: EnrichedCaseTarget, anchor: EnrichedCaseTarget) {
  return getDistanceToAnchor(left, anchor) - getDistanceToAnchor(right, anchor);
}

function getDistanceToAnchor(candidate: EnrichedCaseTarget, anchor: EnrichedCaseTarget): number {
  const [candidateX, candidateY, candidateZ] = candidate.markup.position;
  const [anchorX, anchorY, anchorZ] = anchor.markup.position;

  return Math.hypot(candidateX - anchorX, candidateY - anchorY, candidateZ - anchorZ);
}

function resolveDefaultStation(manifest: EnrichedCaseManifest): CaseStation {
  return manifest.stations[0];
}

function resolvePrimaryTarget(manifest: EnrichedCaseManifest, station: CaseStation): EnrichedCaseTarget {
  return (
    manifest.targets.find((target) => target.id === station.primaryTargetId) ??
    manifest.targets.find((target) => target.stationId === station.id) ??
    manifest.targets[0]
  );
}

export function normalizeVisibleToggleSetIds(visibleToggleSetIds: string[] | null | undefined): ToggleSetId[] {
  if (!Array.isArray(visibleToggleSetIds)) {
    return [...DEFAULT_CASE3D_VISIBLE_TOGGLE_SET_IDS];
  }

  const visibleSet = new Set(
    visibleToggleSetIds.filter((toggleId): toggleId is ToggleSetId =>
      CASE3D_TOGGLE_SET_IDS.includes(toggleId as ToggleSetId),
    ),
  );
  const normalized = CASE3D_TOGGLE_SET_IDS.filter((toggleId) => visibleSet.has(toggleId));

  if (normalized.length === 0 && visibleToggleSetIds.length > 0) {
    return [...DEFAULT_CASE3D_VISIBLE_TOGGLE_SET_IDS];
  }

  return normalized;
}

export function createToggleSet(visibleToggleSetIds: string[] | null | undefined): ToggleSet {
  const normalizedIds = new Set(normalizeVisibleToggleSetIds(visibleToggleSetIds));

  return CASE3D_TOGGLE_SET_IDS.reduce(
    (toggleSet, toggleId) => ({
      ...toggleSet,
      [toggleId]: normalizedIds.has(toggleId),
    }),
    {} as ToggleSet,
  );
}

export function getVisibleTargets(targets: EnrichedCaseTarget[], visibleToggleSetIds: string[] | null | undefined) {
  const toggleSet = createToggleSet(visibleToggleSetIds);

  return targets.filter((target) => toggleSet[target.structureGroupId]);
}

export function resolveCaseSelection({
  manifest,
  selectionMode,
  selectedStationId,
  selectedTargetId,
  visibleToggleSetIds,
}: {
  manifest: EnrichedCaseManifest;
  selectionMode: CaseSelectionMode;
  selectedStationId: string | null;
  selectedTargetId: string | null;
  visibleToggleSetIds: string[] | null | undefined;
}) {
  const resolvedStation =
    manifest.stations.find((station) => station.id === selectedStationId) ?? resolveDefaultStation(manifest);
  const stationTargets = manifest.targets.filter((target) => target.stationId === resolvedStation.id);
  const primaryTarget = resolvePrimaryTarget(manifest, resolvedStation);
  const resolvedTarget =
    stationTargets.find((target) => target.id === selectedTargetId) ??
    manifest.targets.find((target) => target.id === selectedTargetId) ??
    primaryTarget;
  const focusTarget = selectionMode === 'station' ? primaryTarget : resolvedTarget;
  const activeTargetIds =
    selectionMode === 'station'
      ? new Set(resolvedStation.targetIds)
      : new Set([resolvedTarget.id]);
  const visibleTargets = getVisibleTargets(manifest.targets, visibleToggleSetIds);

  return {
    activeTargets: manifest.targets.filter((target) => activeTargetIds.has(target.id)),
    focusTarget,
    primaryTarget,
    resolvedStation,
    resolvedTarget,
    stationTargets,
    visibleTargets,
  };
}

export function getNearestLandmarks(
  manifest: EnrichedCaseManifest,
  targetId: string,
  count = 3,
): EnrichedCaseTarget[] {
  const anchor = manifest.targets.find((target) => target.id === targetId);

  if (!anchor) {
    return [];
  }

  return manifest.targets
    .filter((target) => target.kind === 'landmark' && target.id !== targetId)
    .sort((left, right) => compareDistance(left, right, anchor))
    .slice(0, count);
}

export function clampFrameIndex(frameIndex: number, frameCount: number): number {
  if (frameCount <= 1) {
    return 0;
  }

  return Math.max(0, Math.min(frameCount - 1, frameIndex));
}

export function getCenteredFrameIndex(target: EnrichedCaseTarget, plane: CasePlane, offset: number, frameCount: number): number {
  return clampFrameIndex(target.sliceIndex[plane] + offset, frameCount);
}

export function evaluateCaseReviewAnswer(prompt: CaseReviewPrompt, selectedId: string) {
  return {
    correctId: prompt.correctId,
    isCorrect: prompt.correctId === selectedId,
    selectedId,
  };
}

export function buildCaseReviewSummary({
  reviewScore,
  reviewPromptCount,
  visitedTargetIds,
  totalTargetCount,
}: {
  reviewScore: number | null;
  reviewPromptCount: number;
  visitedTargetIds: string[];
  totalTargetCount: number;
}) {
  const coverage = totalTargetCount > 0 ? Math.round((visitedTargetIds.length / totalTargetCount) * 100) : 0;
  const normalizedScore = reviewScore === null ? 0 : Math.round((reviewScore / Math.max(1, reviewPromptCount)) * 100);

  return {
    coverage,
    normalizedScore,
    reviewScore: reviewScore ?? 0,
    visitedCount: visitedTargetIds.length,
  };
}
