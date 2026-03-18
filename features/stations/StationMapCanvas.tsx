import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import type { StationMapLayout, StationMapStation } from '@/features/stations/types';

interface StationMapCanvasProps {
  layout: StationMapLayout;
  mode?: 'browse' | 'quiz';
  selectedStationId: string | null;
  stations: StationMapStation[];
  zoom: number;
  onSelectStation: (stationId: string) => void;
  feedback?: {
    correctStationId: string;
    selectedStationId: string;
  } | null;
}

function scale(value: number, zoom: number, minimum = 0) {
  return Math.max(value * zoom, minimum);
}

const landmarkPalette = {
  branch: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    textColor: colors.inkSoft,
  },
  hub: {
    backgroundColor: colors.goldSoft,
    borderColor: colors.gold,
    textColor: colors.ink,
  },
  tube: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    textColor: colors.inkSoft,
  },
} as const;

export function StationMapCanvas({
  layout,
  mode = 'browse',
  selectedStationId,
  stations,
  zoom,
  onSelectStation,
  feedback = null,
}: StationMapCanvasProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      bounces={false}
      contentContainerStyle={styles.scrollContent}>
      <View
        style={[
          styles.canvas,
          {
            height: scale(layout.designHeight, zoom),
            width: scale(layout.designWidth, zoom),
          },
        ]}>
        <View style={styles.canvasHalo} />

        {layout.landmarks.map((landmark) => {
          const palette = landmarkPalette[landmark.kind];

          return (
            <View
              key={landmark.id}
              style={[
                styles.landmark,
                {
                  backgroundColor: palette.backgroundColor,
                  borderColor: palette.borderColor,
                  borderRadius: landmark.kind === 'hub' ? scale(18, zoom, 12) : scale(999, zoom, 18),
                  height: scale(landmark.height, zoom),
                  left: scale(landmark.x, zoom),
                  top: scale(landmark.y, zoom),
                  transform: [{ rotate: `${landmark.rotation}deg` }],
                  width: scale(landmark.width, zoom),
                },
              ]}>
              <Text
                style={[
                  styles.landmarkLabel,
                  {
                    color: palette.textColor,
                    fontSize: scale(10, zoom, 10),
                  },
                ]}>
                {landmark.label}
              </Text>
            </View>
          );
        })}

        {stations.map((station) => {
          const node = station.mapNode;
          const isSelected = selectedStationId === station.id;
          const isCorrect = feedback?.correctStationId === station.id;
          const isSelectedWrong =
            feedback?.selectedStationId === station.id && feedback?.correctStationId !== station.id;
          const helperLabel = isCorrect ? 'Target' : isSelectedWrong ? 'Review' : isSelected ? 'Active' : null;

          return (
            <Pressable
              key={station.id}
              accessibilityRole="button"
              accessibilityLabel={
                mode === 'quiz' ? `Select ${station.displayName} as the quiz answer` : `Open details for ${station.displayName}`
              }
              onPress={() => onSelectStation(station.id)}
              style={({ pressed }) => [
                styles.stationNode,
                {
                  backgroundColor: isCorrect
                    ? colors.goldSoft
                    : isSelected
                      ? colors.accentSoft
                      : colors.surface,
                  borderColor: isSelectedWrong
                    ? colors.danger
                    : isCorrect
                      ? colors.gold
                      : isSelected
                        ? colors.accent
                        : colors.border,
                  borderRadius: scale(22, zoom, 16),
                  borderWidth: isSelected || isCorrect || isSelectedWrong ? 3 : 2,
                  height: scale(node.height, zoom),
                  left: scale(node.x, zoom),
                  opacity: pressed ? 0.88 : 1,
                  paddingHorizontal: scale(8, zoom, 6),
                  paddingVertical: scale(8, zoom, 6),
                  top: scale(node.y, zoom),
                  width: scale(node.width, zoom),
                },
              ]}>
              <View style={styles.stationHeader}>
                <Text
                  style={[
                    styles.stationId,
                    {
                      fontSize: scale(18, zoom, 15),
                    },
                  ]}>
                  {station.id}
                </Text>
                {isSelected || isCorrect ? (
                  <FontAwesome
                    color={isCorrect ? colors.gold : colors.accent}
                    name={isCorrect ? 'check-circle' : 'crosshairs'}
                    size={scale(16, zoom, 14)}
                  />
                ) : null}
              </View>

              <Text
                numberOfLines={2}
                style={[
                  styles.stationLabel,
                  {
                    fontSize: scale(9, zoom, 9),
                    lineHeight: scale(12, zoom, 11),
                  },
                ]}>
                {station.shortLabel}
              </Text>

              {helperLabel ? (
                <Text
                  style={[
                    styles.helperLabel,
                    {
                      color: isSelectedWrong ? colors.danger : isCorrect ? colors.gold : colors.accent,
                      fontSize: scale(9, zoom, 9),
                    },
                  ]}>
                  {helperLabel}
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  canvas: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 28,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  canvasHalo: {
    backgroundColor: colors.tealSoft,
    borderRadius: 220,
    height: 240,
    left: 40,
    opacity: 0.38,
    position: 'absolute',
    top: 92,
    width: 240,
  },
  helperLabel: {
    fontFamily: 'SpaceMono',
    letterSpacing: 0.2,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  landmark: {
    alignItems: 'center',
    borderWidth: 2,
    justifyContent: 'center',
    position: 'absolute',
  },
  landmarkLabel: {
    fontFamily: 'SpaceMono',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  scrollContent: {
    paddingRight: 12,
  },
  stationHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stationId: {
    color: colors.ink,
    fontFamily: 'SpaceMono',
  },
  stationLabel: {
    color: colors.inkSoft,
  },
  stationNode: {
    justifyContent: 'space-between',
    position: 'absolute',
  },
});
