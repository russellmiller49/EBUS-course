import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, shadows } from '@/constants/theme';
import type { ModuleContent, ModuleProgress } from '@/lib/types';
import { ProgressBar } from '@/components/ProgressBar';
import { StatusPill } from '@/components/StatusPill';

interface ModuleCardProps {
  module: ModuleContent;
  progress: ModuleProgress;
  onPress: () => void;
}

export function ModuleCard({ module, progress, onPress }: ModuleCardProps) {
  const isComplete = Boolean(progress.completedAt);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open ${module.title}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, shadows, { opacity: pressed ? 0.92 : 1 }]}>
      <View style={styles.row}>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{module.shortTitle}</Text>
          <Text style={styles.summary}>{module.summary}</Text>
        </View>
        <FontAwesome color={colors.accent} name="arrow-right" size={18} />
      </View>

      <View style={styles.metaRow}>
        <StatusPill label={`${module.plannedExperiences.length} experiences`} tone="teal" />
        <StatusPill
          label={isComplete ? 'Completed locally' : `${module.estimatedMinutes} min`}
          tone={isComplete ? 'gold' : 'neutral'}
        />
      </View>

      <ProgressBar value={progress.percentComplete} />

      <Text style={styles.footer}>
        {isComplete ? 'Saved on this device and ready to revisit.' : 'Open the module and pick up where you left off.'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: 1,
    gap: 14,
    padding: 18,
  },
  footer: {
    color: colors.inkSoft,
    fontSize: 13,
    lineHeight: 19,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  row: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 14,
    justifyContent: 'space-between',
  },
  summary: {
    color: colors.inkSoft,
    fontSize: 14,
    lineHeight: 20,
  },
  title: {
    color: colors.ink,
    fontFamily: 'SpaceMono',
    fontSize: 16,
    lineHeight: 21,
  },
  titleWrap: {
    flex: 1,
    gap: 6,
  },
});
