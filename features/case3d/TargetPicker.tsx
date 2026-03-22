import { ScrollView, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import type {
  CaseSelectionMode,
  CaseStation,
  EnrichedCaseTarget,
} from '@/features/case3d/types';

interface TargetPickerProps {
  selectionMode: CaseSelectionMode;
  selectedStationId: string;
  selectedTargetId: string;
  stations: CaseStation[];
  stationTargets: EnrichedCaseTarget[];
  visitedTargetIds: string[];
  onSelectionModeChange: (selectionMode: CaseSelectionMode) => void;
  onSelectStation: (stationId: string) => void;
  onSelectTarget: (targetId: string) => void;
}

const MODE_OPTIONS: Array<{ id: CaseSelectionMode; label: string }> = [
  { id: 'station', label: 'Station view' },
  { id: 'target', label: 'Target view' },
];

function SelectionChip({
  active,
  label,
  onPress,
  accessibilityLabel,
  visited = false,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
  accessibilityLabel: string;
  visited?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        active ? styles.chipActive : styles.chipInactive,
        pressed ? styles.chipPressed : null,
      ]}>
      <Text style={[styles.chipLabel, active ? styles.chipLabelActive : styles.chipLabelInactive]}>{label}</Text>
      {visited ? <View style={[styles.visitedDot, active ? styles.visitedDotActive : null]} /> : null}
    </Pressable>
  );
}

export function TargetPicker({
  selectionMode,
  selectedStationId,
  selectedTargetId,
  stations,
  stationTargets,
  visitedTargetIds,
  onSelectionModeChange,
  onSelectStation,
  onSelectTarget,
}: TargetPickerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.modeRow}>
        {MODE_OPTIONS.map((option) => {
          const active = option.id === selectionMode;

          return (
            <Pressable
              key={option.id}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`Switch to ${option.label.toLowerCase()}`}
              onPress={() => onSelectionModeChange(option.id)}
              style={({ pressed }) => [
                styles.modeButton,
                active ? styles.modeButtonActive : styles.modeButtonInactive,
                pressed ? styles.chipPressed : null,
              ]}>
              <Text style={[styles.modeLabel, active ? styles.modeLabelActive : styles.modeLabelInactive]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.group}>
        <Text style={styles.groupLabel}>Stations</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollRow}>
          {stations.map((station) => (
            <SelectionChip
              key={station.id}
              active={station.id === selectedStationId}
              accessibilityLabel={`Select station ${station.label}`}
              label={station.label}
              onPress={() => onSelectStation(station.id)}
              visited={station.targetIds.some((targetId) => visitedTargetIds.includes(targetId))}
            />
          ))}
        </ScrollView>
      </View>

      {selectionMode === 'target' ? (
        <View style={styles.group}>
          <Text style={styles.groupLabel}>Targets in {selectedStationId}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollRow}>
            {stationTargets.map((target) => (
              <SelectionChip
                key={target.id}
                active={target.id === selectedTargetId}
                accessibilityLabel={`Select target ${target.displayLabel}`}
                label={target.displayLabel}
                onPress={() => onSelectTarget(target.id)}
                visited={visitedTargetIds.includes(target.id)}
              />
            ))}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    minHeight: 40,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  chipActive: {
    backgroundColor: colors.goldSoft,
    borderColor: colors.gold,
  },
  chipInactive: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  chipLabel: {
    fontFamily: 'SpaceMono',
    fontSize: 11,
  },
  chipLabelActive: {
    color: colors.gold,
  },
  chipLabelInactive: {
    color: colors.inkSoft,
  },
  chipPressed: {
    opacity: 0.84,
  },
  container: {
    gap: 12,
  },
  group: {
    gap: 8,
  },
  groupLabel: {
    color: colors.inkSoft,
    fontFamily: 'SpaceMono',
    fontSize: 12,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  modeButton: {
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    minHeight: 46,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modeButtonActive: {
    backgroundColor: colors.tealSoft,
    borderColor: colors.teal,
  },
  modeButtonInactive: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  modeLabel: {
    fontFamily: 'SpaceMono',
    fontSize: 12,
    textAlign: 'center',
  },
  modeLabelActive: {
    color: colors.teal,
  },
  modeLabelInactive: {
    color: colors.inkSoft,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  scrollRow: {
    gap: 10,
    paddingRight: 8,
  },
  visitedDot: {
    backgroundColor: colors.inkSoft,
    borderRadius: 999,
    height: 8,
    width: 8,
  },
  visitedDotActive: {
    backgroundColor: colors.gold,
  },
});
