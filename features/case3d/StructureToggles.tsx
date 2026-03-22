import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import type { ToggleSet, ToggleSetId } from '@/features/case3d/types';

const TOGGLE_LABELS: Record<ToggleSetId, string> = {
  lymph_nodes: 'Lymph nodes',
  airway: 'Airway',
  vessels: 'Vessels',
  cardiac: 'Cardiac',
  gi: 'GI',
};

interface StructureTogglesProps {
  toggleSet: ToggleSet;
  onToggle: (toggleId: ToggleSetId) => void;
}

export function StructureToggles({ toggleSet, onToggle }: StructureTogglesProps) {
  return (
    <View style={styles.row}>
      {(Object.keys(TOGGLE_LABELS) as ToggleSetId[]).map((toggleId) => {
        const enabled = toggleSet[toggleId];

        return (
          <Pressable
            key={toggleId}
            accessibilityRole="switch"
            accessibilityLabel={`${enabled ? 'Hide' : 'Show'} ${TOGGLE_LABELS[toggleId]}`}
            accessibilityState={{ checked: enabled }}
            onPress={() => onToggle(toggleId)}
            style={({ pressed }) => [
              styles.pill,
              enabled ? styles.pillActive : styles.pillInactive,
              pressed ? styles.pillPressed : null,
            ]}>
            <Text style={[styles.label, enabled ? styles.labelActive : styles.labelInactive]}>{TOGGLE_LABELS[toggleId]}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pill: {
    borderRadius: 999,
    borderWidth: 1,
    minHeight: 42,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  pillActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  pillInactive: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  pillPressed: {
    opacity: 0.82,
  },
  label: {
    fontFamily: 'SpaceMono',
    fontSize: 11,
    letterSpacing: 0.2,
  },
  labelActive: {
    color: colors.accent,
  },
  labelInactive: {
    color: colors.inkSoft,
  },
});
