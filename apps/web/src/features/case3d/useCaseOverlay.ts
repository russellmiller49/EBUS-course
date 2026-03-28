import { useMemo } from 'react';

import type { RuntimeCaseManifest } from '../../../../../features/case3d/types';

interface OverlayGroupsState {
  allAnatomy: boolean;
  airway: boolean;
  vessels: boolean;
  nodes: boolean;
  glb: boolean;
}

export function useCaseOverlay(
  manifest: RuntimeCaseManifest,
  overlayGroups: OverlayGroupsState,
  selectedTargetId: string,
) {
  return useMemo(() => {
    const selectedTarget = manifest.targets.find((target) => target.id === selectedTargetId) ?? null;
    const selectedSegmentIds = new Set(selectedTarget?.matchedSegmentIds ?? []);
    const visibleSegments = manifest.segmentation.segments.filter((segment) => {
      if (overlayGroups.allAnatomy) {
        return true;
      }

      if (segment.groupId === 'airway') {
        return overlayGroups.airway;
      }

      if (segment.groupId === 'vessels' || segment.groupId === 'cardiac' || segment.groupId === 'gi') {
        return overlayGroups.vessels;
      }

      if (segment.groupId === 'nodes') {
        return overlayGroups.nodes;
      }

      return false;
    });

    return {
      selectedTarget,
      selectedSegmentIds,
      visibleSegments,
    };
  }, [manifest, overlayGroups, selectedTargetId]);
}
