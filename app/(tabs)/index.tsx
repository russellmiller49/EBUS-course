import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { CourseInfoSection } from '@/components/CourseInfoSection';
import { MetricTile } from '@/components/MetricTile';
import { ModuleCard } from '@/components/ModuleCard';
import { Screen } from '@/components/Screen';
import { SectionCard } from '@/components/SectionCard';
import { StatusPill } from '@/components/StatusPill';
import { colors } from '@/constants/theme';
import { getCourseInfo, getModuleById, getModules, getQuizQuestions, getStationById, getStations } from '@/lib/content';
import { getCompletedModuleCount, useLearnerProgress } from '@/store/learner-progress';

const courseInfo = getCourseInfo();
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
      eyebrow="2026 course companion"
      title="SoCal EBUS Prep"
      subtitle="Pre-course review, live-day logistics, and offline study support for the 10th Annual Southwest Regional Pulmonary/PCCM Fellow EBUS Course.">
      <CourseInfoSection courseInfo={courseInfo} />

      <SectionCard
        title="Prep library"
        subtitle="The core modules and station content stay available locally so fellows can review before the live session."
        tone="navy">
        <View style={styles.heroTopRow}>
          <StatusPill label={hydrated ? 'Progress restored' : 'Restoring progress'} tone="teal" />
          <StatusPill label={`${getQuizQuestions().length} practice prompts loaded`} tone="gold" />
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
          title="Continue learning"
          subtitle="Resume the next module in your local study sequence before the live simulation day.">
          <ModuleCard
            module={nextModule}
            progress={state.moduleProgress[nextModule.id]}
            onPress={() => router.push(`/modules/${nextModule.slug}`)}
          />
        </SectionCard>
      ) : null}

      <SectionCard
        title="Saved on device"
        subtitle="Progress, bookmarks, and recent station review remain on this device between sessions.">
        <View style={styles.list}>
          <Text style={styles.listItem}>
            {completedModules} of {modules.length} modules marked complete so far.
          </Text>
          <Text style={styles.listItem}>
            Last station viewed: {lastStation ? `${lastStation.displayName} (${lastStation.shortLabel})` : 'Not set yet'}.
          </Text>
          <Text style={styles.listItem}>
            Study bank loaded: {getQuizQuestions().length} prompts across {modules.length} modules, with quick review ready to expand as course content grows.
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
