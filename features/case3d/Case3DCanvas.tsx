import { Pressable, StyleSheet, Text, View } from 'react-native';

import { StatusPill } from '@/components/StatusPill';
import { colors } from '@/constants/theme';
import type { CaseSelectionMode, EnrichedCaseTarget, ToggleSetId } from '@/features/case3d/types';

interface Case3DCanvasProps {
  selectionMode: CaseSelectionMode;
  visibleTargets: EnrichedCaseTarget[];
  activeTargetIds: string[];
  focusTargetId: string;
  onSelectTarget: (targetId: string) => void;
}

const GROUP_TONES: Record<ToggleSetId, { fill: string; stroke: string }> = {
  lymph_nodes: { fill: colors.accent, stroke: colors.white },
  airway: { fill: colors.teal, stroke: colors.white },
  vessels: { fill: colors.gold, stroke: colors.white },
  cardiac: { fill: colors.navy, stroke: colors.white },
  gi: { fill: colors.danger, stroke: colors.white },
};

export function Case3DCanvas({
  selectionMode,
  visibleTargets,
  activeTargetIds,
  focusTargetId,
  onSelectTarget,
}: Case3DCanvasProps) {
  const activeTargetSet = new Set(activeTargetIds);
  const focusTarget = visibleTargets.find((target) => target.id === focusTargetId) ?? null;
  const verifiedMeshCount = visibleTargets.filter((target) => target.meshExists).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>Web fallback navigator</Text>
          <Text style={styles.subtitle}>Native builds render the bundled GLB at runtime. Web and test environments keep this coordinate-based navigator so the explorer still exports cleanly.</Text>
        </View>
        <View style={styles.pillRow}>
          <StatusPill label={`${visibleTargets.length} visible`} tone="teal" />
          <StatusPill label={`${verifiedMeshCount} mesh-linked`} tone="gold" />
        </View>
      </View>

      <View style={styles.canvas}>
        <View style={styles.gridPlane} />
        <View style={styles.depthShadow} />
        <View style={styles.verticalGuide} />
        <View style={styles.horizontalGuide} />

        {visibleTargets.map((target) => {
          const active = activeTargetSet.has(target.id);
          const focused = focusTargetId === target.id;
          const tone = GROUP_TONES[target.structureGroupId];
          const size = focused ? 20 : active ? 16 : 12;
          const left = `${target.derived.normalized.sagittal * 100}%` as `${number}%`;
          const top = `${(1 - target.derived.normalized.axial) * 100}%` as `${number}%`;

          return (
            <Pressable
              key={target.id}
              accessibilityRole="button"
              accessibilityLabel={`Focus ${target.displayLabel}`}
              onPress={() => onSelectTarget(target.id)}
              style={[
                styles.marker,
                {
                  backgroundColor: tone.fill,
                  borderColor: tone.stroke,
                  height: size,
                  left,
                  opacity: active || focused ? 1 : 0.54,
                  top,
                  transform: [
                    { translateX: -size / 2 },
                    { translateY: -size / 2 },
                    { scale: 0.88 + target.derived.normalized.coronal * 0.35 },
                  ],
                  width: size,
                },
              ]}
            />
          );
        })}
      </View>

      {focusTarget ? (
        <View style={styles.focusCard}>
          <Text style={styles.focusTitle}>
            {selectionMode === 'station' ? `Primary focus: ${focusTarget.displayLabel}` : `Selected target: ${focusTarget.displayLabel}`}
          </Text>
          <Text style={styles.focusBody}>
            {focusTarget.meshExists
              ? `Mesh "${focusTarget.meshNameResolved}" verified in the GLB.`
              : 'This target stays selectable even though its expected mesh name was not found in the GLB.'}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    backgroundColor: '#E6DDD1',
    borderColor: '#D0C3B1',
    borderRadius: 28,
    borderWidth: 1,
    height: 280,
    overflow: 'hidden',
    position: 'relative',
  },
  container: {
    gap: 14,
  },
  depthShadow: {
    backgroundColor: '#D9CCBA',
    borderRadius: 28,
    bottom: 22,
    left: 26,
    opacity: 0.58,
    position: 'absolute',
    right: 26,
    top: 32,
    transform: [{ skewY: '-12deg' }],
  },
  focusBody: {
    color: colors.inkSoft,
    fontSize: 14,
    lineHeight: 20,
  },
  focusCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  focusTitle: {
    color: colors.ink,
    fontFamily: 'SpaceMono',
    fontSize: 13,
  },
  gridPlane: {
    borderColor: 'rgba(23, 50, 69, 0.12)',
    borderRadius: 24,
    borderWidth: 1,
    bottom: 24,
    left: 22,
    position: 'absolute',
    right: 22,
    top: 26,
    transform: [{ skewY: '-11deg' }],
  },
  header: {
    gap: 10,
  },
  headerCopy: {
    gap: 4,
  },
  horizontalGuide: {
    backgroundColor: 'rgba(23, 50, 69, 0.1)',
    height: 1,
    left: '12%',
    position: 'absolute',
    right: '12%',
    top: '52%',
  },
  marker: {
    borderRadius: 999,
    borderWidth: 2,
    position: 'absolute',
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  subtitle: {
    color: colors.inkSoft,
    fontSize: 14,
    lineHeight: 20,
  },
  title: {
    color: colors.ink,
    fontFamily: 'SpaceMono',
    fontSize: 15,
  },
  verticalGuide: {
    backgroundColor: 'rgba(23, 50, 69, 0.1)',
    bottom: '14%',
    position: 'absolute',
    right: '36%',
    top: '12%',
    width: 1,
  },
});
