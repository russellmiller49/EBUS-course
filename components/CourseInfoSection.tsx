import { Image, StyleSheet, Text, View } from 'react-native';

import { SectionCard } from '@/components/SectionCard';
import { StatusPill } from '@/components/StatusPill';
import { colors } from '@/constants/theme';
import type { CourseInfoContent } from '@/lib/types';

const lomaLindaLogo = require('../additional_info_and_images/loma_linda_logo.png');

interface CourseInfoSectionProps {
  courseInfo: CourseInfoContent;
}

export function CourseInfoSection({ courseInfo }: CourseInfoSectionProps) {
  return (
    <SectionCard
      title="Course Information"
      subtitle="Flyer-based summary for the live 2026 fellow EBUS course."
      tone="navy">
      <View style={styles.heroRow}>
        <View style={styles.logoWrap}>
          <Image
            accessibilityIgnoresInvertColors
            accessibilityLabel="Loma Linda University Health logo"
            source={lomaLindaLogo}
            style={styles.logo}
          />
        </View>
        <View style={styles.heroCopy}>
          <Text style={styles.courseTitle}>{courseInfo.courseTitle}</Text>
          <Text style={styles.hostLine}>{courseInfo.hostLine}</Text>
          <Text style={styles.hostDepartment}>{courseInfo.hostDepartment}</Text>
        </View>
      </View>

      <View style={styles.pillRow}>
        <StatusPill label={courseInfo.dateLabel} tone="gold" />
        <StatusPill label={courseInfo.timeLabel} tone="teal" />
        <StatusPill label={courseInfo.venueName} tone="neutral" />
      </View>

      <Text style={styles.overview}>{courseInfo.overview}</Text>
      <Text style={styles.audience}>{courseInfo.audience}</Text>

      <View style={styles.factRow}>
        {courseInfo.quickFacts.map((fact) => (
          <View key={fact.label} style={styles.factCard}>
            <Text style={styles.factValue}>{fact.value}</Text>
            <Text style={styles.factLabel}>{fact.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Leadership and faculty</Text>
        <Text style={styles.panelText}>Course directors: {courseInfo.courseDirectors.join(' and ')}.</Text>
        <Text style={styles.panelText}>{courseInfo.facultySummary}</Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Course format</Text>
        <View style={styles.list}>
          {courseInfo.formatHighlights.map((item) => (
            <BulletText key={item} text={item} />
          ))}
        </View>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Pre-course preparation</Text>
        <Text style={styles.panelText}>{courseInfo.prepWindow}</Text>
        <View style={styles.list}>
          {courseInfo.prepTopics.map((item) => (
            <BulletText key={item} text={item} />
          ))}
        </View>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Live day snapshot</Text>
        <View style={styles.timeline}>
          {courseInfo.liveDayAgenda.map((item, index) => (
            <View
              key={`${item.time}-${item.title}`}
              style={[styles.timelineItem, index > 0 ? styles.timelineDivider : null]}>
              <Text style={styles.timelineTime}>{item.time}</Text>
              <Text style={styles.timelineTitle}>{item.title}</Text>
              <Text style={styles.timelineDetail}>{item.detail}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Venue and arrival</Text>
        <Text style={styles.panelText}>{courseInfo.venueDetail}</Text>
        {courseInfo.addressLines.map((line) => (
          <Text key={line} style={styles.addressLine}>
            {line}
          </Text>
        ))}
        <Text style={styles.panelText}>{courseInfo.parkingNote}</Text>
        <Text style={styles.panelText}>{courseInfo.travelNote}</Text>
      </View>
    </SectionCard>
  );
}

function BulletText({ text }: { text: string }) {
  return (
    <View style={styles.bulletRow}>
      <View style={styles.bulletDot} />
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  addressLine: {
    color: colors.white,
    fontSize: 13,
    lineHeight: 19,
  },
  audience: {
    color: '#D2E0E7',
    fontSize: 14,
    lineHeight: 21,
  },
  bulletDot: {
    backgroundColor: colors.gold,
    borderRadius: 999,
    height: 6,
    marginTop: 7,
    width: 6,
  },
  bulletRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
  },
  bulletText: {
    color: '#E9F0F2',
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
  },
  courseTitle: {
    color: colors.white,
    fontFamily: 'SpaceMono',
    fontSize: 18,
    lineHeight: 24,
  },
  factCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    borderWidth: 1,
    flexBasis: 92,
    flexGrow: 1,
    gap: 6,
    minHeight: 88,
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  factLabel: {
    color: '#D2E0E7',
    fontSize: 12,
    lineHeight: 17,
  },
  factRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  factValue: {
    color: colors.white,
    fontFamily: 'SpaceMono',
    fontSize: 18,
    lineHeight: 22,
  },
  heroCopy: {
    flex: 1,
    gap: 4,
  },
  heroRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
  hostDepartment: {
    color: '#D2E0E7',
    fontSize: 13,
    lineHeight: 19,
  },
  hostLine: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 20,
  },
  list: {
    gap: 10,
  },
  logo: {
    height: '100%',
    resizeMode: 'contain',
    width: '100%',
  },
  logoWrap: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 24,
    height: 96,
    justifyContent: 'center',
    padding: 14,
    width: 96,
  },
  overview: {
    color: '#F1F5F6',
    fontSize: 14,
    lineHeight: 21,
  },
  panel: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 22,
    borderWidth: 1,
    gap: 12,
    padding: 16,
  },
  panelText: {
    color: '#E9F0F2',
    fontSize: 13,
    lineHeight: 19,
  },
  panelTitle: {
    color: colors.white,
    fontFamily: 'SpaceMono',
    fontSize: 14,
    lineHeight: 20,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeline: {
    gap: 12,
  },
  timelineDetail: {
    color: '#D2E0E7',
    fontSize: 13,
    lineHeight: 19,
  },
  timelineDivider: {
    borderTopColor: 'rgba(255, 255, 255, 0.12)',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 12,
  },
  timelineItem: {
    gap: 4,
  },
  timelineTime: {
    color: '#F5E8C5',
    fontFamily: 'SpaceMono',
    fontSize: 12,
    lineHeight: 16,
  },
  timelineTitle: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
});
