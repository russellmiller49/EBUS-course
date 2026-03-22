import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import type { CasePlane } from '@/features/case3d/types';

const PLANE_LABELS: Record<CasePlane, string> = {
  axial: 'Axial',
  coronal: 'Coronal',
  sagittal: 'Sagittal',
};

interface SliceViewerProps {
  plane: CasePlane;
  frameIndex: number;
  centerFrameIndex: number;
  frameCount: number;
  source: any;
  targetLabel: string;
  onPlaneChange: (plane: CasePlane) => void;
  onStep: (delta: number) => void;
  onReset: () => void;
}

function PlaneButton({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.planeButton, active ? styles.planeButtonActive : styles.planeButtonInactive, pressed ? styles.pressed : null]}>
      <Text style={[styles.planeButtonLabel, active ? styles.planeButtonLabelActive : styles.planeButtonLabelInactive]}>{label}</Text>
    </Pressable>
  );
}

function StepButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.stepButton, pressed ? styles.pressed : null]}>
      <Text style={styles.stepButtonLabel}>{label}</Text>
    </Pressable>
  );
}

export function SliceViewer({
  plane,
  frameIndex,
  centerFrameIndex,
  frameCount,
  source,
  targetLabel,
  onPlaneChange,
  onStep,
  onReset,
}: SliceViewerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.planeRow}>
        {(Object.keys(PLANE_LABELS) as CasePlane[]).map((planeId) => (
          <PlaneButton key={planeId} active={planeId === plane} label={PLANE_LABELS[planeId]} onPress={() => onPlaneChange(planeId)} />
        ))}
      </View>

      <View style={styles.frame}>
        <Image source={source} resizeMode="contain" style={styles.image} />
        <View pointerEvents="none" style={styles.crosshairVertical} />
        <View pointerEvents="none" style={styles.crosshairHorizontal} />
        <View style={styles.badge}>
          <Text style={styles.badgeLabel}>{targetLabel}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.frameMeta}>
          <Text style={styles.frameTitle}>{PLANE_LABELS[plane]} frame</Text>
          <Text style={styles.frameCopy}>
            Showing {frameIndex + 1} of {frameCount}. Center target frame: {centerFrameIndex + 1}.
          </Text>
        </View>
        <View style={styles.controls}>
          <StepButton label="-1" onPress={() => onStep(-1)} />
          <StepButton label="+1" onPress={() => onStep(1)} />
          <StepButton label="Reset" onPress={onReset} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.accent,
    borderRadius: 999,
    left: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    position: 'absolute',
    top: 16,
  },
  badgeLabel: {
    color: colors.white,
    fontFamily: 'SpaceMono',
    fontSize: 11,
  },
  container: {
    gap: 12,
  },
  controls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  crosshairHorizontal: {
    backgroundColor: 'rgba(198, 93, 50, 0.75)',
    height: 2,
    left: '10%',
    position: 'absolute',
    right: '10%',
    top: '50%',
  },
  crosshairVertical: {
    backgroundColor: 'rgba(198, 93, 50, 0.75)',
    bottom: '10%',
    left: '50%',
    position: 'absolute',
    top: '10%',
    width: 2,
  },
  footer: {
    gap: 12,
  },
  frame: {
    alignItems: 'center',
    backgroundColor: '#10191E',
    borderRadius: 28,
    height: 300,
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  frameCopy: {
    color: colors.inkSoft,
    fontSize: 13,
    lineHeight: 18,
  },
  frameMeta: {
    gap: 4,
  },
  frameTitle: {
    color: colors.ink,
    fontFamily: 'SpaceMono',
    fontSize: 14,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  planeButton: {
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    minHeight: 44,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  planeButtonActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  planeButtonInactive: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  planeButtonLabel: {
    fontFamily: 'SpaceMono',
    fontSize: 11,
    textAlign: 'center',
  },
  planeButtonLabelActive: {
    color: colors.white,
  },
  planeButtonLabelInactive: {
    color: colors.inkSoft,
  },
  planeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pressed: {
    opacity: 0.84,
  },
  stepButton: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    minHeight: 42,
    minWidth: 62,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  stepButtonLabel: {
    color: colors.ink,
    fontFamily: 'SpaceMono',
    fontSize: 11,
    textAlign: 'center',
  },
});
