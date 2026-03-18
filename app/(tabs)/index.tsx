import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { MetricTile } from '@/components/MetricTile';
import { ModuleCard } from '@/components/ModuleCard';
import { Screen } from '@/components/Screen';
import { SectionCard } from '@/components/SectionCard';
import { StatusPill } from '@/components/StatusPill';
import { colors } from '@/constants/theme';
import { getModuleById, getModules, getQuizQuestions, getStationById, getStations } from '@/lib/content';
import { getCompletedModuleCount, useLearnerProgress } from '@/store/learner-progress';

const modules = getModules();
const stations = getStations();

export default function HomeScreen() {
  const { state, hydrated } = useLearnerProgress();
  const completedModules = getCompletedModuleCount(state);
  const nextModule =
    modules.find((module) => !state.moduleProgress[module.id].completedAt) ?? getModuleById('knobology');
  const lastStation = state.lastViewedStationId ? getStationById(state.lastViewedStationId) : null;

  return (
    <Screen
      eyebrow="Offline-first scaffold"
      title="SoCal EBUS Prep"
      subtitle="A clean mobile shell for the first three EBUS learning modules, with local content and persisted learner progress already wired in.">
      <SectionCard
        title="Course runway"
        subtitle="Expo Router navigation, local JSON content, and AsyncStorage-backed progress are active."
        tone="navy">
        <View style={styles.heroTopRow}>
          <StatusPill label="Expo SDK 52" tone="gold" />
          <StatusPill label={hydrated ? 'Progress restored' : 'Hydrating progress'} tone="teal" />
        </View>
        <View style={styles.metricRow}>
          <MetricTile label="Modules scaffolded" tone="accent" value={`${modules.length}`} />
          <MetricTile label="Core stations loaded" tone="teal" value={`${stations.length}`} />
          <MetricTile label="Bookmarks saved" tone="gold" value={`${state.bookmarks.length}`} />
        </View>
        <ActionButton label="Open module list" onPress={() => router.push('/modules')} variant="secondary" />
      </SectionCard>

      {nextModule ? (
        <SectionCard
          title="Continue building"
          subtitle="Each module route already owns a stable content contract and a progress entry.">
          <ModuleCard
            module={nextModule}
            progress={state.moduleProgress[nextModule.id]}
            onPress={() => router.push(`/modules/${nextModule.slug}`)}
          />
        </SectionCard>
      ) : null}

      <SectionCard
        title="Persistent signals"
        subtitle="The scaffold already stores progress, bookmarks, and the last station the learner touched.">
        <View style={styles.list}>
          <Text style={styles.listItem}>
            {completedModules} of {modules.length} module placeholders marked complete.
          </Text>
          <Text style={styles.listItem}>
            Last station viewed: {lastStation ? `${lastStation.displayName} (${lastStation.shortLabel})` : 'Not set yet'}.
          </Text>
          <Text style={styles.listItem}>
            Question-bank contract: {modules.length} module routes, {getModules().length} local module summaries, and {getQuizQuestions().length} placeholder quiz items ready for expansion.
          </Text>
        </View>
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroTopRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  list: {
    gap: 10,
  },
  listItem: {
    color: colors.ink,
    fontSize: 14,
    lineHeight: 21,
  },
  metricRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
});
