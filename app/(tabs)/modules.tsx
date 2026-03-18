import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ModuleCard } from '@/components/ModuleCard';
import { Screen } from '@/components/Screen';
import { SectionCard } from '@/components/SectionCard';
import { colors } from '@/constants/theme';
import { getModules } from '@/lib/content';
import { useLearnerProgress } from '@/store/learner-progress';

const modules = getModules();

export default function ModulesScreen() {
  const { state } = useLearnerProgress();

  return (
    <Screen
      eyebrow="Module shell"
      title="Modules"
      subtitle="Each module is reachable, backed by local content, and ready for feature-specific implementation.">
      <SectionCard
        title="V1 sequence"
        subtitle="Prompt order and feature folders align so future work lands cleanly without routing churn.">
        {modules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            progress={state.moduleProgress[module.id]}
            onPress={() => router.push(`/modules/${module.slug}`)}
          />
        ))}
      </SectionCard>

      <SectionCard
        title="Placeholder asset policy"
        subtitle="Only local app-owned placeholder keys are wired in. Existing unreviewed screenshots or course slides are intentionally not loaded into the UI.">
        {modules.map((module) => (
          <SectionCard key={module.id} title={module.shortTitle} subtitle={module.featureFolder} tone="teal">
            {module.assetPlaceholders.map((asset) => (
              <View key={asset.key} style={styles.assetRow}>
                <Text style={styles.assetLabel}>{asset.label}</Text>
                <Text style={styles.assetFolder}>{asset.folder}</Text>
                <Text style={styles.assetNote}>{asset.note}</Text>
              </View>
            ))}
          </SectionCard>
        ))}
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  assetFolder: {
    color: colors.accent,
    fontFamily: 'SpaceMono',
    fontSize: 12,
  },
  assetLabel: {
    color: colors.ink,
    fontFamily: 'SpaceMono',
    fontSize: 14,
  },
  assetNote: {
    color: colors.inkSoft,
    fontSize: 13,
    lineHeight: 18,
  },
  assetRow: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    gap: 4,
    paddingBottom: 12,
  },
});
