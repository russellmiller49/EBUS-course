import { Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { Screen } from '@/components/Screen';
import { SectionCard } from '@/components/SectionCard';
import { StatusPill } from '@/components/StatusPill';
import { useLearnerProgress } from '@/store/learner-progress';

export default function SettingsScreen() {
  const { resetProgress } = useLearnerProgress();

  return (
    <Screen
      eyebrow="Scaffold notes"
      title="Settings"
      subtitle="The settings tab keeps the shell practical: local-only data, placeholder assets, and a fast reset loop for development.">
      <SectionCard
        title="Current app profile"
        subtitle="Clean light-mode first, portrait-first layout, and no network dependency for the v1 teaching modules.">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <StatusPill label="Offline content" tone="teal" />
          <StatusPill label="AsyncStorage progress" tone="accent" />
          <StatusPill label="Placeholder assets only" tone="gold" />
        </View>
      </SectionCard>

      <SectionCard
        title="Content rules"
        subtitle="These constraints come directly from the repo docs and stay visible while the app is still early.">
        <Text>- Educational product only, not a diagnostic device.</Text>
        <Text>- No copyrighted slide screenshots are loaded into the UI.</Text>
        <Text>- All course content is local and can be swapped later without route changes.</Text>
      </SectionCard>

      <SectionCard
        title="Developer reset"
        subtitle="Use this while building or testing the scaffold flow.">
        <ActionButton label="Clear learner progress" onPress={resetProgress} variant="danger" />
      </SectionCard>
    </Screen>
  );
}
