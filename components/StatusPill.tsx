import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';

type StatusPillTone = 'accent' | 'teal' | 'gold' | 'neutral';

interface StatusPillProps {
  label: string;
  tone?: StatusPillTone;
}

const toneMap = {
  accent: { backgroundColor: colors.accentSoft, color: colors.accent },
  teal: { backgroundColor: colors.tealSoft, color: colors.teal },
  gold: { backgroundColor: colors.goldSoft, color: colors.gold },
  neutral: { backgroundColor: colors.surfaceMuted, color: colors.inkSoft },
} satisfies Record<StatusPillTone, { backgroundColor: string; color: string }>;

export function StatusPill({ label, tone = 'neutral' }: StatusPillProps) {
  const toneStyle = toneMap[tone];

  return (
    <View style={[styles.pill, { backgroundColor: toneStyle.backgroundColor }]}>
      <Text style={[styles.label, { color: toneStyle.color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  label: {
    fontFamily: 'SpaceMono',
    fontSize: 11,
    letterSpacing: 0.3,
  },
});
