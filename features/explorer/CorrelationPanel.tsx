import { StyleSheet, Text, View } from 'react-native';

import { StatusPill } from '@/components/StatusPill';
import { colors } from '@/constants/theme';
import type { ExplorerStation, ExplorerViewId, ExplorerVisualAnchor } from '@/features/explorer/types';

interface CorrelationPanelProps {
  station: ExplorerStation;
  viewId: ExplorerViewId;
}

const anchorStyles: Record<ExplorerVisualAnchor, { left?: number; right?: number; top?: number; bottom?: number }> = {
  'upper-left': { left: 18, top: 18 },
  'upper-right': { right: 18, top: 18 },
  'middle-left': { left: 14, top: 70 },
  'middle-right': { right: 14, top: 70 },
  center: { left: 76, top: 68 },
  'lower-left': { bottom: 16, left: 16 },
  'lower-right': { bottom: 16, right: 16 },
};

export function CorrelationPanel({ station, viewId }: CorrelationPanelProps) {
  const view = station.views[viewId];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>{view.title}</Text>
          <Text style={styles.subtitle}>{view.orientation}</Text>
        </View>
        <StatusPill label={view.assetKey} tone="neutral" />
      </View>

      <View style={[styles.artboard, viewId === 'ct' && styles.ctArtboard, viewId === 'bronchoscopy' && styles.airwayArtboard, viewId === 'ultrasound' && styles.ultrasoundArtboard]}>
        {viewId === 'ct' ? (
          <>
            <View style={styles.ctRingOuter} />
            <View style={styles.ctRingInner} />
            <View style={styles.ctAirway} />
            <View style={styles.ctVesselLeft} />
            <View style={styles.ctVesselRight} />
          </>
        ) : null}

        {viewId === 'bronchoscopy' ? (
          <>
            <View style={styles.airwayTunnel} />
            <View style={styles.airwayLeftBranch} />
            <View style={styles.airwayRightBranch} />
            <View style={styles.airwayGlow} />
          </>
        ) : null}

        {viewId === 'ultrasound' ? (
          <>
            <View style={styles.ultrasoundHeader} />
            <View style={styles.ultrasoundStripeOne} />
            <View style={styles.ultrasoundStripeTwo} />
            <View style={styles.ultrasoundStripeThree} />
            <View style={styles.ultrasoundTargetBase} />
          </>
        ) : null}

        <View
          style={[
            styles.focusChip,
            anchorStyles[view.visualAnchor],
            viewId === 'ct' && styles.focusChipCt,
            viewId === 'bronchoscopy' && styles.focusChipAirway,
            viewId === 'ultrasound' && styles.focusChipUltrasound,
          ]}>
          <Text style={[styles.focusLabel, viewId === 'bronchoscopy' && styles.focusLabelAirway]}>{view.focusLabel}</Text>
        </View>
      </View>

      <Text style={styles.caption}>{view.caption}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  airwayArtboard: {
    backgroundColor: colors.navy,
  },
  airwayGlow: {
    backgroundColor: 'rgba(216, 238, 233, 0.14)',
    borderRadius: 120,
    height: 150,
    left: 42,
    position: 'absolute',
    top: 20,
    width: 150,
  },
  airwayLeftBranch: {
    backgroundColor: '#2F6074',
    borderRadius: 18,
    height: 28,
    left: 26,
    position: 'absolute',
    top: 102,
    transform: [{ rotate: '-26deg' }],
    width: 104,
  },
  airwayRightBranch: {
    backgroundColor: '#2F6074',
    borderRadius: 18,
    height: 28,
    left: 122,
    position: 'absolute',
    top: 102,
    transform: [{ rotate: '26deg' }],
    width: 104,
  },
  airwayTunnel: {
    backgroundColor: '#3A7185',
    borderRadius: 42,
    height: 118,
    left: 92,
    position: 'absolute',
    top: 14,
    width: 68,
  },
  artboard: {
    borderRadius: 24,
    height: 190,
    overflow: 'hidden',
    position: 'relative',
  },
  caption: {
    color: colors.inkSoft,
    fontSize: 13,
    lineHeight: 19,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: 1,
    gap: 12,
    padding: 16,
  },
  ctAirway: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 2,
    height: 44,
    left: 108,
    position: 'absolute',
    top: 72,
    width: 44,
  },
  ctArtboard: {
    backgroundColor: '#E9DED0',
  },
  ctRingInner: {
    backgroundColor: '#F6EFE6',
    borderRadius: 68,
    height: 136,
    left: 62,
    position: 'absolute',
    top: 24,
    width: 136,
  },
  ctRingOuter: {
    backgroundColor: '#CFC2B1',
    borderRadius: 84,
    height: 168,
    left: 46,
    position: 'absolute',
    top: 10,
    width: 168,
  },
  ctVesselLeft: {
    backgroundColor: colors.accentSoft,
    borderRadius: 24,
    height: 40,
    left: 60,
    position: 'absolute',
    top: 66,
    width: 36,
  },
  ctVesselRight: {
    backgroundColor: colors.tealSoft,
    borderRadius: 26,
    height: 42,
    left: 168,
    position: 'absolute',
    top: 60,
    width: 40,
  },
  focusChip: {
    borderRadius: 18,
    maxWidth: 120,
    minWidth: 92,
    paddingHorizontal: 12,
    paddingVertical: 10,
    position: 'absolute',
  },
  focusChipAirway: {
    backgroundColor: '#F5E8C5',
    borderColor: colors.gold,
    borderWidth: 1,
  },
  focusChipCt: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
    borderWidth: 1,
  },
  focusChipUltrasound: {
    backgroundColor: colors.tealSoft,
    borderColor: colors.teal,
    borderWidth: 1,
  },
  focusLabel: {
    color: colors.ink,
    fontFamily: 'SpaceMono',
    fontSize: 10,
    lineHeight: 14,
  },
  focusLabelAirway: {
    color: colors.ink,
  },
  header: {
    alignItems: 'flex-start',
    gap: 10,
  },
  headerCopy: {
    gap: 4,
  },
  subtitle: {
    color: colors.inkSoft,
    fontSize: 13,
    lineHeight: 19,
  },
  title: {
    color: colors.ink,
    fontFamily: 'SpaceMono',
    fontSize: 14,
    lineHeight: 20,
  },
  ultrasoundArtboard: {
    backgroundColor: '#1C2A33',
  },
  ultrasoundHeader: {
    backgroundColor: '#2D4351',
    height: 26,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  ultrasoundStripeOne: {
    backgroundColor: '#344854',
    height: 26,
    left: 18,
    opacity: 0.52,
    position: 'absolute',
    top: 46,
    width: 210,
  },
  ultrasoundStripeThree: {
    backgroundColor: '#4A5F6A',
    height: 30,
    left: 8,
    opacity: 0.36,
    position: 'absolute',
    top: 126,
    width: 240,
  },
  ultrasoundStripeTwo: {
    backgroundColor: '#516572',
    height: 22,
    left: 28,
    opacity: 0.42,
    position: 'absolute',
    top: 86,
    width: 180,
  },
  ultrasoundTargetBase: {
    backgroundColor: '#6A7B86',
    borderRadius: 999,
    height: 74,
    left: 96,
    opacity: 0.52,
    position: 'absolute',
    top: 74,
    width: 74,
  },
});
