import { toSceneCoordinates as toSceneCoordinatesShared } from '@/features/case3d/patient-space';
import type { EnrichedCaseTarget, ToggleSetId, Vector3Tuple } from '@/features/case3d/types';

const MIN_ORBIT_POLAR = 0.35;

export interface StructureVisibilityEntry {
  key: string;
  label: string;
  hidden: boolean;
  structureGroupId: ToggleSetId;
  targetCount: number;
  targetIds: string[];
}

export function normalizeMeshKey(name: string | null | undefined) {
  return (name ?? '').trim().replace(/\s+/g, '_').toLowerCase();
}

export function formatStructureLabel(name: string | null | undefined) {
  const normalized = (name ?? '').trim().replace(/_/g, ' ');

  if (!normalized) {
    return 'Unknown structure';
  }

  return normalized
    .split(' ')
    .filter(Boolean)
    .map((segment) => {
      const lower = segment.toLowerCase();

      if (segment === lower) {
        return lower.charAt(0).toUpperCase() + lower.slice(1);
      }

      return segment;
    })
    .join(' ');
}

export function getTargetStructureKey(target: Pick<EnrichedCaseTarget, 'id' | 'meshNameResolved'>) {
  return normalizeMeshKey(target.meshNameResolved ?? target.id);
}

export function getTargetStructureLabel(target: Pick<EnrichedCaseTarget, 'displayLabel' | 'meshNameResolved'>) {
  return target.meshNameResolved ?? target.displayLabel;
}

export function toSceneCoordinates(position: Vector3Tuple) {
  return toSceneCoordinatesShared(position);
}

export function clampOrbitPolar(value: number) {
  return Math.max(MIN_ORBIT_POLAR, Math.min(Math.PI - MIN_ORBIT_POLAR, value));
}

export function clampOrbitRadius(radius: number, sceneRadius: number) {
  const minRadius = Math.max(sceneRadius * 0.72, 0.12);
  const maxRadius = Math.max(sceneRadius * 2.8, minRadius + 0.12);

  return Math.max(minRadius, Math.min(maxRadius, radius));
}

export function buildStructureVisibilityEntries(
  visibleTargets: EnrichedCaseTarget[],
  hiddenStructureKeys: string[] = [],
): StructureVisibilityEntry[] {
  const hiddenSet = new Set(hiddenStructureKeys);
  const structureMap = new Map<string, Omit<StructureVisibilityEntry, 'hidden'>>();

  visibleTargets.forEach((target) => {
    const key = getTargetStructureKey(target);
    const existing = structureMap.get(key);

    if (existing) {
      existing.targetIds.push(target.id);
      existing.targetCount += 1;
      return;
    }

    structureMap.set(key, {
      key,
      label: getTargetStructureLabel(target),
      structureGroupId: target.structureGroupId,
      targetCount: 1,
      targetIds: [target.id],
    });
  });

  return [...structureMap.values()]
    .map((entry) => ({
      ...entry,
      hidden: hiddenSet.has(entry.key),
    }))
    .sort((left, right) => left.label.localeCompare(right.label));
}
