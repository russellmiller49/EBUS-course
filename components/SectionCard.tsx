import { StyleSheet, Text, View } from 'react-native';

import { colors, shadows } from '@/constants/theme';

interface SectionCardProps {
  title: string;
  subtitle?: string;
  tone?: 'light' | 'navy' | 'teal';
  children: React.ReactNode;
}

const toneStyles = {
  light: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    titleColor: colors.ink,
    subtitleColor: colors.inkSoft,
  },
  navy: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
    titleColor: colors.white,
    subtitleColor: '#D2E0E7',
  },
  teal: {
    backgroundColor: colors.tealSoft,
    borderColor: colors.tealSoft,
    titleColor: colors.ink,
    subtitleColor: colors.inkSoft,
  },
} as const;

export function SectionCard({ title, subtitle, tone = 'light', children }: SectionCardProps) {
  const palette = toneStyles[tone];

  return (
    <View
      style={[
        styles.card,
        shadows,
        {
          backgroundColor: palette.backgroundColor,
          borderColor: palette.borderColor,
        },
      ]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: palette.titleColor }]}>{title}</Text>
        {subtitle ? <Text style={[styles.subtitle, { color: palette.subtitleColor }]}>{subtitle}</Text> : null}
      </View>
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: 14,
  },
  card: {
    borderRadius: 28,
    borderWidth: 1,
    gap: 18,
    padding: 20,
  },
  header: {
    gap: 6,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  title: {
    fontFamily: 'SpaceMono',
    fontSize: 16,
    lineHeight: 22,
  },
});
