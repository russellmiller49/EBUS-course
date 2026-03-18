import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { Screen } from '@/components/Screen';
import { SectionCard } from '@/components/SectionCard';
import { StatusPill } from '@/components/StatusPill';
import { colors } from '@/constants/theme';
import { KnobologyModule } from '@/features/knobology/KnobologyModule';
import { moduleScaffolds } from '@/features/module-registry';
import { StationMapModule } from '@/features/stations/StationMapModule';
import { getModuleBySlug, getQuizQuestions, getStationById } from '@/lib/content';
import type { ModuleId } from '@/lib/types';
import { isBookmarked, useLearnerProgress } from '@/store/learner-progress';

export default function ModuleDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const module = typeof slug === 'string' ? getModuleBySlug(slug) : undefined;
  const { state, markModuleVisited, setQuizScore, setLastViewedStation, toggleBookmark, toggleModuleCompletion } =
    useLearnerProgress();

  useEffect(() => {
    if (module && module.id !== 'knobology' && module.id !== 'station-map') {
      markModuleVisited(module.id, 'overview');
    }
  }, [module?.id]);

  if (!module) {
    return (
      <Screen eyebrow="Missing route" title="Module not found" subtitle="The requested module slug is not in the local content registry.">
        <SectionCard title="Fallback" subtitle="Check the route or the module content file.">
          <Text style={styles.bodyText}>No module matched the provided slug.</Text>
        </SectionCard>
      </Screen>
    );
  }

  if (module.id === 'knobology') {
    return (
      <>
        <Stack.Screen options={{ title: module.shortTitle }} />
        <KnobologyModule module={module} />
      </>
    );
  }

  if (module.id === 'station-map') {
    return (
      <>
        <Stack.Screen options={{ title: module.shortTitle }} />
        <StationMapModule module={module} />
      </>
    );
  }

  const scaffold = moduleScaffolds[module.id];
  const moduleProgress = state.moduleProgress[module.id];
  const isModuleBookmarked = isBookmarked(state, module.id, 'module');
  const relatedStations = module.relatedStationIds
    .map((stationId) => getStationById(stationId))
    .filter((station): station is NonNullable<typeof station> => Boolean(station));
  const quizQuestions = getQuizQuestions(module.id);

  return (
    <>
      <Stack.Screen options={{ title: module.shortTitle }} />
      <Screen eyebrow={module.featureFolder} title={module.title} subtitle={module.overview}>
        <SectionCard title="Scaffold status" subtitle={scaffold.emphasis} tone="navy">
          <View style={styles.tagRow}>
            <StatusPill label={scaffold.statusLabel} tone="gold" />
            <StatusPill label={`${moduleProgress.percentComplete}% tracked`} tone="teal" />
            <StatusPill label={`${quizQuestions.length} placeholder questions`} tone="accent" />
          </View>
          <View style={styles.actionRow}>
            <ActionButton
              label={moduleProgress.completedAt ? 'Unmark complete' : 'Mark placeholder complete'}
              onPress={() => toggleModuleCompletion(module.id, 'overview')}
            />
            <ActionButton
              label={isModuleBookmarked ? 'Saved to review' : 'Save module'}
              onPress={() =>
                toggleBookmark({
                  id: module.id,
                  kind: 'module',
                  label: module.title,
                  moduleId: module.id,
                })
              }
              variant="secondary"
            />
          </View>
        </SectionCard>

        <SectionCard title="Learning goals" subtitle="Loaded from a local JSON content file.">
          {module.goals.map((goal) => (
            <Text key={goal} style={styles.bodyText}>
              {`\u2022 ${goal}`}
            </Text>
          ))}
        </SectionCard>

        <SectionCard title="Planned experiences" subtitle="Feature-specific work can replace these placeholders without changing the route contract.">
          {scaffold.milestones.map((milestone) => (
            <View key={milestone.id} style={styles.milestoneRow}>
              <FontAwesome color={colors.accent} name="circle" size={10} />
              <View style={styles.milestoneCopy}>
                <Text style={styles.milestoneTitle}>{milestone.title}</Text>
                <Text style={styles.bodyText}>{milestone.description}</Text>
              </View>
            </View>
          ))}
        </SectionCard>

        <SectionCard title="Asset placeholders" subtitle="Stable asset keys and folders are already mapped for later replacement.">
          {module.assetPlaceholders.map((asset) => (
            <View key={asset.key} style={styles.assetRow}>
              <Text style={styles.milestoneTitle}>{asset.label}</Text>
              <Text style={styles.bodyText}>{asset.note}</Text>
              <StatusPill label={`${asset.folder}/${asset.key}`} tone="neutral" />
            </View>
          ))}
        </SectionCard>

        {relatedStations.length ? (
          <SectionCard
            title="Related stations"
            subtitle="This uses the same shared station schema that the future map and explorer modules will consume.">
            {relatedStations.map((station) => (
              <View key={station.id} style={styles.stationRow}>
                <View style={styles.milestoneCopy}>
                  <Text style={styles.milestoneTitle}>{station.displayName}</Text>
                  <Text style={styles.bodyText}>{station.memoryCues[0]}</Text>
                </View>
                <ActionButton
                  label="Set last viewed"
                  onPress={() => setLastViewedStation(station.id)}
                  variant="secondary"
                />
              </View>
            ))}
          </SectionCard>
        ) : null}

        <SectionCard title="Persistence notes" subtitle="These are module-specific but use the shared learner progress store.">
          {scaffold.persistenceNotes.map((note, index) => (
            <Text key={note} style={styles.bodyText}>
              {`${index + 1}. ${note}`}
            </Text>
          ))}
          <ActionButton
            label="Seed placeholder quiz score"
            onPress={() => setQuizScore(module.id as ModuleId, quizQuestions.length)}
            variant="secondary"
          />
        </SectionCard>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  actionRow: {
    gap: 12,
  },
  assetRow: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    gap: 8,
    paddingBottom: 14,
  },
  bodyText: {
    color: colors.ink,
    fontSize: 14,
    lineHeight: 21,
  },
  milestoneCopy: {
    flex: 1,
    gap: 4,
  },
  milestoneRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
  },
  milestoneTitle: {
    color: colors.ink,
    fontFamily: 'SpaceMono',
    fontSize: 14,
  },
  stationRow: {
    gap: 10,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
