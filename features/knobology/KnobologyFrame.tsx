import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import type { KnobologyFrameModel } from '@/features/knobology/types';

const SPECKLES = [
  { left: 42, top: 36 },
  { left: 76, top: 96 },
  { left: 124, top: 48 },
  { left: 146, top: 152 },
  { left: 188, top: 76 },
  { left: 224, top: 118 },
  { left: 246, top: 54 },
  { left: 274, top: 162 },
];

interface KnobologyFrameProps {
  frame: KnobologyFrameModel;
}

export function KnobologyFrame({ frame }: KnobologyFrameProps) {
  const vesselTop = Math.min(frame.nodeTop + 16, 78);

  return (
    <View style={styles.wrapper}>
      <View style={styles.screen}>
        {SPECKLES.map((speckle, index) => (
          <View
            key={`${speckle.left}-${speckle.top}-${index}`}
            style={[
              styles.speckle,
              {
                left: speckle.left,
                opacity: Math.min(frame.brightness, 0.72),
                top: speckle.top,
              },
            ]}
          />
        ))}

        <View style={[styles.brightnessWash, { opacity: Math.min(frame.brightness, 0.7) }]} />
        <View style={[styles.haze, { opacity: Math.min(frame.hazeOpacity, 0.72) }]} />

        <View
          style={[
            styles.node,
            {
              opacity: Math.min(frame.nodeOpacity, 0.9),
              top: frame.nodeTop,
            },
          ]}>
          <View
            style={[
              styles.nodeBorder,
              {
                borderColor: `rgba(248, 240, 220, ${Math.min(frame.nodeBorderOpacity, 0.9)})`,
              },
            ]}
          />
        </View>

        <View
          style={[
            styles.vessel,
            {
              opacity: Math.min(frame.colorSignalOpacity, 0.8),
              top: vesselTop,
            },
          ]}
        />

        {frame.calipersVisible ? (
          <>
            <View style={[styles.caliper, styles.caliperLeft, { top: frame.nodeTop + 6 }]} />
            <View style={[styles.caliper, styles.caliperRight, { top: frame.nodeTop + 6 }]} />
          </>
        ) : null}

        {frame.frozen ? (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>Frozen</Text>
          </View>
        ) : null}

        {frame.saved ? (
          <View style={styles.savedBadge}>
            <Text style={styles.savedBadgeText}>Saved</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.caption}>Educational approximation only. No clinical fidelity is claimed.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.goldSoft,
    borderRadius: 999,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    position: 'absolute',
    top: 12,
  },
  bannerText: {
    color: colors.gold,
    fontFamily: 'SpaceMono',
    fontSize: 11,
  },
  brightnessWash: {
    backgroundColor: '#F4EEE4',
    borderRadius: 26,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  caliper: {
    borderColor: colors.goldSoft,
    borderWidth: 2,
    height: 42,
    position: 'absolute',
    width: 8,
  },
  caliperLeft: {
    left: 102,
  },
  caliperRight: {
    left: 214,
  },
  caption: {
    color: colors.inkSoft,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 8,
  },
  haze: {
    backgroundColor: '#C8D2D6',
    borderRadius: 24,
    bottom: 14,
    left: 18,
    position: 'absolute',
    right: 18,
    top: 14,
  },
  node: {
    backgroundColor: '#6F7F88',
    borderRadius: 999,
    height: 54,
    left: 106,
    position: 'absolute',
    width: 112,
  },
  nodeBorder: {
    borderRadius: 999,
    borderWidth: 2,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  savedBadge: {
    backgroundColor: colors.accent,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    position: 'absolute',
    right: 12,
    top: 12,
  },
  savedBadgeText: {
    color: colors.white,
    fontFamily: 'SpaceMono',
    fontSize: 11,
  },
  screen: {
    backgroundColor: '#041018',
    borderColor: colors.border,
    borderRadius: 28,
    borderWidth: 1,
    height: 260,
    overflow: 'hidden',
    position: 'relative',
  },
  speckle: {
    backgroundColor: '#E7ECEF',
    borderRadius: 999,
    height: 6,
    position: 'absolute',
    width: 6,
  },
  vessel: {
    backgroundColor: '#D86B43',
    borderRadius: 999,
    height: 24,
    left: 92,
    position: 'absolute',
    width: 142,
  },
  wrapper: {
    width: '100%',
  },
});
