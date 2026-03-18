import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { colors } from '@/constants/theme';
import { Screen } from '@/components/Screen';
import { SectionCard } from '@/components/SectionCard';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <Screen eyebrow="Route fallback" title="Screen not found" subtitle="This route is not part of the current mobile scaffold.">
        <SectionCard title="Try again" subtitle="Return to the course home screen and reopen the module or tab from there.">
          <Link href="/" style={styles.link}>
            Back to home
          </Link>
        </SectionCard>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  link: {
    color: colors.accent,
    fontFamily: 'SpaceMono',
    fontSize: 14,
    paddingVertical: 8,
  },
});
