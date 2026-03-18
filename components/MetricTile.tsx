import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';

interface MetricTileProps {
  label: string;
  value: string;
  tone?: 'teal' | 'gold' | 'accent';
}

const toneStyles = {
  teal: { backgroundColor: colors.tealSoft, valueColor: colors.teal },
  gold: { backgroundColor: colors.goldSoft, valueColor: colors.gold },
  accent: { backgroundColor: colors.accentSoft, valueColor: colors.accent },
} as const;

export function MetricTile({ label, value, tone = 'accent' }: MetricTileProps) {
  const palette = toneStyles[tone];

  return (
    <View style={[styles.tile, { backgroundColor: palette.backgroundColor }]}>
      <Text style={[styles.value, { color: palette.valueColor }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    borderRadius: 22,
    flexBasis: 104,
    flexGrow: 1,
    gap: 6,
    minHeight: 112,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  value: {
    fontFamily: 'SpaceMono',
    fontSize: 24,
  },
  label: {
    color: colors.inkSoft,
    fontSize: 13,
    lineHeight: 18,
  },
});
