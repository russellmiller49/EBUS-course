import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { SectionCard } from '@/components/SectionCard';
import { StatusPill } from '@/components/StatusPill';
import { colors } from '@/constants/theme';
import { getModules, getStations } from '@/lib/content';
import { getCompletedModuleCount, isBookmarked, useLearnerProgress } from '@/store/learner-progress';

const modules = getModules();
const stations = getStations();

export default function ProgressScreen() {
  const { state, setLastViewedStation, toggleBookmark } = useLearnerProgress();
  const completedModules = getCompletedModuleCount(state);

  return (
    <Screen
      eyebrow="Persistence layer"
      title="Progress"
      subtitle="Everything on this screen is local-first and survives app restart through AsyncStorage.">
      <SectionCard
        title="Completion overview"
        subtitle="The module cards reflect live persisted state rather than hardcoded placeholders.">
        <Text style={styles.summaryText}>
          {completedModules} of {modules.length} modules marked complete, {state.bookmarks.length} bookmarks saved.
        </Text>
        {modules.map((module) => (
          <View key={module.id} style={styles.progressRow}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>{module.shortTitle}</Text>
              <StatusPill
                label={`${state.moduleProgress[module.id].percentComplete}%`}
                tone={state.moduleProgress[module.id].completedAt ? 'gold' : 'neutral'}
              />
            </View>
            <ProgressBar value={state.moduleProgress[module.id].percentComplete} />
          </View>
        ))}
      </SectionCard>

      <SectionCard
        title="Quick review"
        subtitle="Tap a station to mark it as last viewed. Bookmarking is already shared with the future map and explorer modules.">
        {stations.map((station) => {
          const bookmarked = isBookmarked(state, station.id, 'station');

          return (
            <View key={station.id} style={styles.stationRow}>
              <View style={styles.stationCopy}>
                <Text style={styles.stationTitle}>{station.displayName}</Text>
                <Text style={styles.stationSubtitle}>{station.memoryCues[0]}</Text>
              </View>
              <View style={styles.stationActions}>
                <ActionButton
                  label="Set last viewed"
                  onPress={() => setLastViewedStation(station.id)}
                  variant="secondary"
                  accessibilityLabel={`Set ${station.displayName} as the last viewed station`}
                />
                <ActionButton
                  label={bookmarked ? 'Saved' : 'Save'}
                  onPress={() =>
                    toggleBookmark({
                      id: station.id,
                      kind: 'station',
                      label: station.displayName,
                    })
                  }
                  variant={bookmarked ? 'primary' : 'secondary'}
                  icon={<FontAwesome color={bookmarked ? colors.white : colors.accent} name="bookmark" size={14} />}
                  accessibilityLabel={`${bookmarked ? 'Remove' : 'Save'} ${station.displayName} bookmark`}
                />
              </View>
            </View>
          );
        })}
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  progressHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressRow: {
    gap: 10,
  },
  progressTitle: {
    color: colors.ink,
    fontFamily: 'SpaceMono',
    fontSize: 14,
  },
  stationActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  stationCopy: {
    flex: 1,
    gap: 4,
  },
  stationRow: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    gap: 12,
    paddingBottom: 16,
  },
  stationSubtitle: {
    color: colors.inkSoft,
    fontSize: 13,
    lineHeight: 18,
  },
  stationTitle: {
    color: colors.ink,
    fontFamily: 'SpaceMono',
    fontSize: 14,
  },
  summaryText: {
    color: colors.ink,
    fontSize: 14,
    lineHeight: 21,
  },
});
