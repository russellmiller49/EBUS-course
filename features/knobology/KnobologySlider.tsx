import Slider from '@react-native-community/slider';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';

interface KnobologySliderProps {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  hint: string;
  disabled?: boolean;
}

export function KnobologySlider({
  label,
  value,
  onValueChange,
  hint,
  disabled = false,
}: KnobologySliderProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      <Slider
        disabled={disabled}
        maximumTrackTintColor={colors.border}
        maximumValue={100}
        minimumTrackTintColor={colors.accent}
        minimumValue={0}
        onValueChange={onValueChange}
        step={1}
        style={styles.slider}
        thumbTintColor={colors.accent}
        value={value}
      />
      <Text style={styles.hint}>{hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hint: {
    color: colors.inkSoft,
    fontSize: 12,
    lineHeight: 17,
  },
  label: {
    color: colors.ink,
    fontFamily: 'SpaceMono',
    fontSize: 14,
  },
  slider: {
    marginHorizontal: -10,
  },
  value: {
    color: colors.accent,
    fontFamily: 'SpaceMono',
    fontSize: 13,
  },
  wrapper: {
    gap: 4,
  },
});
