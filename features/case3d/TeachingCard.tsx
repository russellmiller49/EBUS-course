import { StyleSheet, Text, View } from 'react-native';

import { StatusPill } from '@/components/StatusPill';
import { colors } from '@/constants/theme';
import type { CaseStation, EnrichedCaseTarget } from '@/features/case3d/types';

interface TeachingCardProps {
  station?: CaseStation | null;
  target: EnrichedCaseTarget;
  nearbyLandmarks: EnrichedCaseTarget[];
}

export function TeachingCard({ station, target, nearbyLandmarks }: TeachingCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{target.displayLabel}</Text>
        <View style={styles.pillRow}>
          <StatusPill label={station ? `Station ${station.label}` : 'Landmark focus'} tone="gold" />
          <StatusPill label={target.structureGroupId.replace('_', ' ')} tone="teal" />
        </View>
      </View>

      <Text style={styles.body}>
        {target.notes ?? 'Use the selected target as the anchor, then compare its derived slice position against the nearby landmarks.'}
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Derived slice center</Text>
        <Text style={styles.sectionBody}>
          Axial {target.sliceIndex.axial + 1}, coronal {target.sliceIndex.coronal + 1}, sagittal {target.sliceIndex.sagittal + 1}.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nearby anchors</Text>
        <Text style={styles.sectionBody}>
          {nearbyLandmarks.length
            ? nearbyLandmarks.map((landmark) => landmark.displayLabel).join(', ')
            : 'No nearby landmarks were derived for this target.'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mesh link</Text>
        <Text style={styles.sectionBody}>
          {target.meshExists
            ? `Verified mesh: ${target.meshNameResolved}.`
            : 'Expected mesh name was not found in the GLB, so the target is currently driven by markup position only.'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    color: colors.inkSoft,
    fontSize: 14,
    lineHeight: 20,
  },
  container: {
    gap: 14,
  },
  header: {
    gap: 8,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  section: {
    gap: 4,
  },
  sectionBody: {
    color: colors.inkSoft,
    fontSize: 13,
    lineHeight: 18,
  },
  sectionTitle: {
    color: colors.ink,
    fontFamily: 'SpaceMono',
    fontSize: 12,
  },
  title: {
    color: colors.ink,
    fontFamily: 'SpaceMono',
    fontSize: 18,
  },
});
