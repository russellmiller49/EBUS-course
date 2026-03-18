import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, shadows } from '@/constants/theme';

type ActionButtonVariant = 'primary' | 'secondary' | 'danger';

interface ActionButtonProps {
  label: string;
  onPress: () => void;
  variant?: ActionButtonVariant;
  icon?: React.ReactNode;
  accessibilityLabel?: string;
}

const toneStyles = {
  primary: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
    color: colors.white,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    color: colors.ink,
  },
  danger: {
    backgroundColor: colors.dangerSoft,
    borderColor: colors.danger,
    color: colors.danger,
  },
} satisfies Record<ActionButtonVariant, { backgroundColor: string; borderColor: string; color: string }>;

export function ActionButton({
  label,
  onPress,
  variant = 'primary',
  icon,
  accessibilityLabel,
}: ActionButtonProps) {
  const tone = toneStyles[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        shadows,
        {
          backgroundColor: tone.backgroundColor,
          borderColor: tone.borderColor,
          opacity: pressed ? 0.88 : 1,
        },
      ]}>
      <View style={styles.content}>
        {icon ? <View style={styles.icon}>{icon}</View> : null}
        <Text style={[styles.label, { color: tone.color }]}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 18,
    borderWidth: 1,
    minHeight: 54,
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: 'SpaceMono',
    fontSize: 13,
    letterSpacing: 0.3,
  },
});
