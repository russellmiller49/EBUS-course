import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { colors } from '@/constants/theme';

interface ScreenProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function Screen({ eyebrow, title, subtitle, children }: ScreenProps) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: colors.canvas,
    gap: 18,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  eyebrow: {
    color: colors.accent,
    fontFamily: 'SpaceMono',
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  header: {
    gap: 8,
    paddingBottom: 6,
    paddingTop: 8,
  },
  safeArea: {
    backgroundColor: colors.canvas,
    flex: 1,
  },
  subtitle: {
    color: colors.inkSoft,
    fontSize: 15,
    lineHeight: 22,
  },
  title: {
    color: colors.ink,
    fontFamily: 'SpaceMono',
    fontSize: 28,
    lineHeight: 34,
  },
});
