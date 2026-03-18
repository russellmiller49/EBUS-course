import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/theme';

interface ProgressBarProps {
  value: number;
}

export function ProgressBar({ value }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: clamped }} style={styles.track}>
      <View style={[styles.fill, { width: `${clamped}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 999,
    height: 10,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    backgroundColor: colors.teal,
    borderRadius: 999,
    height: '100%',
  },
});
