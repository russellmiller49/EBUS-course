import Slider from '@react-native-community/slider';
import { Asset } from 'expo-asset';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
  type LayoutChangeEvent,
} from 'react-native';
import * as THREE from 'three';

import { StatusPill } from '@/components/StatusPill';
import { colors } from '@/constants/theme';
import {
  clampOpacity,
  frameIndexToContinuousAxisIndex,
  getVolumeCenterWorld,
  getVolumeSceneBounds,
  toSceneCoordinates,
} from '@/features/case3d/patient-space';
import { PatientSpaceScene } from '@/features/case3d/PatientSpaceScene';
import { Canvas } from '@/features/case3d/r3f';
import { clampOrbitPolar, clampOrbitRadius } from '@/features/case3d/viewer-logic';
import type {
  CasePlane,
  CaseSelectionMode,
  EnrichedCaseManifest,
  EnrichedCaseTarget,
  SceneLayerId,
  ViewerOpacity,
  ViewerVisibility,
} from '@/features/case3d/types';

const CASE_001_GLB = require('../../model/case_001.glb');
const ORBIT_DRAG_SPEED = 0.012;
const TAP_MOVEMENT_THRESHOLD = 6;
const TAP_DURATION_MS = 260;

type PlaneViewState = {
  centeredFrameIndex: number;
  frameCount: number;
  frameIndex: number;
  source: ImageSourcePropType;
};

interface Case3DCanvasProps {
  activeTargetIds: string[];
  focusedTarget: EnrichedCaseTarget | null;
  manifest: EnrichedCaseManifest;
  onResetPlane: (plane: CasePlane) => void;
  onSetLayerOpacity: (layerId: SceneLayerId, value: number) => void;
  onSetSelectedPlane: (plane: CasePlane) => void;
  onStepPlane: (plane: CasePlane, delta: number) => void;
  onToggleLayer: (layerId: SceneLayerId) => void;
  onToggleTargetFocus?: (targetId: string) => void;
  planeViews: Record<CasePlane, PlaneViewState>;
  selectionMode: CaseSelectionMode;
  viewerOpacity: ViewerOpacity;
  viewerVisibility: ViewerVisibility;
  visibleTargets: EnrichedCaseTarget[];
}

type CameraState = {
  azimuth: number;
  lookAt: [number, number, number];
  polar: number;
  radius: number;
};

type InteractionState = {
  mode: 'pinch' | 'rotate';
  moved: boolean;
  startAzimuth: number;
  startDistance: number | null;
  startLookAt: THREE.Vector3;
  startPolar: number;
  startRadius: number;
  startTime: number;
};

type InteractionMode = 'orbit' | 'pan';

const PLANE_LABELS: Record<CasePlane, string> = {
  axial: 'Axial',
  coronal: 'Coronal',
  sagittal: 'Sagittal',
};

function useBundledAssetUri(source: unknown) {
  const [state, setState] = useState<{ error: string | null; uri: string | null }>({
    error: null,
    uri: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function resolve() {
      if (source === null || source === undefined) {
        setState({ error: null, uri: null });
        return;
      }

      try {
        const asset = Asset.fromModule(source as number);
        await asset.downloadAsync();

        if (cancelled) {
          return;
        }

        setState({
          error: null,
          uri: asset.localUri ?? asset.uri ?? null,
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        setState({
          error: error instanceof Error ? error.message : 'Bundled asset could not be resolved.',
          uri: null,
        });
      }
    }

    resolve();

    return () => {
      cancelled = true;
    };
  }, [source]);

  return state;
}

function LayerToggleButton({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: active }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.layerToggle,
        active ? styles.layerToggleActive : styles.layerToggleInactive,
        pressed ? styles.pressed : null,
      ]}>
      <Text style={[styles.layerToggleLabel, active ? styles.layerToggleLabelActive : styles.layerToggleLabelInactive]}>
        {active ? 'Visible' : 'Hidden'} · {label}
      </Text>
    </Pressable>
  );
}

function PlaneRow({
  plane,
  view,
  opacity,
  visible,
  onOpacityChange,
  onReset,
  onStep,
  onToggle,
}: {
  plane: CasePlane;
  view: PlaneViewState;
  opacity: number;
  visible: boolean;
  onOpacityChange: (value: number) => void;
  onReset: () => void;
  onStep: (delta: number) => void;
  onToggle: () => void;
}) {
  return (
    <View style={styles.controlCard}>
      <View style={styles.controlHeader}>
        <LayerToggleButton active={visible} label={PLANE_LABELS[plane]} onPress={onToggle} />
        <Text style={styles.controlMeta}>
          Frame {view.frameIndex + 1}/{view.frameCount} · target {view.centeredFrameIndex + 1}
        </Text>
      </View>
      <View style={styles.sliderBlock}>
        <Text style={styles.sliderLabel}>Opacity</Text>
        <Slider
          accessibilityLabel={`Adjust ${PLANE_LABELS[plane].toLowerCase()} opacity`}
          maximumTrackTintColor="#D0C3B1"
          maximumValue={1}
          minimumTrackTintColor={colors.accent}
          minimumValue={0}
          onValueChange={onOpacityChange}
          step={0.01}
          style={styles.slider}
          thumbTintColor={colors.accent}
          value={opacity}
        />
      </View>
      <View style={styles.stepRow}>
        <Pressable onPress={() => onStep(-1)} style={({ pressed }) => [styles.stepButton, pressed ? styles.pressed : null]}>
          <Text style={styles.stepButtonLabel}>-1</Text>
        </Pressable>
        <Pressable onPress={() => onStep(1)} style={({ pressed }) => [styles.stepButton, pressed ? styles.pressed : null]}>
          <Text style={styles.stepButtonLabel}>+1</Text>
        </Pressable>
        <Pressable onPress={onReset} style={({ pressed }) => [styles.stepButton, pressed ? styles.pressed : null]}>
          <Text style={styles.stepButtonLabel}>Reset</Text>
        </Pressable>
      </View>
    </View>
  );
}

function createDefaultCameraState(lookAt: [number, number, number], sceneRadius: number): CameraState {
  const baseRadius = Math.max(sceneRadius * 1.6, 0.4);
  const offset = new THREE.Vector3(baseRadius * 0.82, baseRadius * 0.42, baseRadius * 1.08);
  const spherical = new THREE.Spherical().setFromVector3(offset);

  return {
    azimuth: spherical.theta,
    lookAt,
    polar: clampOrbitPolar(spherical.phi),
    radius: clampOrbitRadius(spherical.radius, sceneRadius),
  };
}

function getTouchDistance(touches: readonly { pageX: number; pageY: number }[]) {
  if (touches.length < 2) {
    return null;
  }

  return Math.hypot(touches[0].pageX - touches[1].pageX, touches[0].pageY - touches[1].pageY);
}

function getViewportPanPosition(
  lookAt: THREE.Vector3,
  cameraState: CameraState,
  sceneRadius: number,
  deltaX: number,
  deltaY: number,
) {
  const cameraPosition = lookAt.clone().add(
    new THREE.Vector3().setFromSpherical(
      new THREE.Spherical(cameraState.radius, cameraState.polar, cameraState.azimuth),
    ),
  );
  const forward = lookAt.clone().sub(cameraPosition).normalize();
  let right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0));

  if (right.lengthSq() < 1e-6) {
    right = new THREE.Vector3(1, 0, 0);
  }

  right.normalize();
  const up = new THREE.Vector3().crossVectors(right, forward).normalize();
  const panScale = Math.max(sceneRadius * 0.0024, cameraState.radius * 0.0018);

  return lookAt
    .clone()
    .add(right.multiplyScalar(-deltaX * panScale))
    .add(up.multiplyScalar(deltaY * panScale));
}

export function Case3DCanvas({
  activeTargetIds,
  focusedTarget,
  manifest,
  onResetPlane,
  onSetLayerOpacity,
  onSetSelectedPlane,
  onStepPlane,
  onToggleLayer,
  planeViews,
  selectionMode,
  viewerOpacity,
  viewerVisibility,
  visibleTargets,
}: Case3DCanvasProps) {
  const anatomyAsset = useBundledAssetUri(CASE_001_GLB);
  const planeAssets = {
    axial: useBundledAssetUri(planeViews.axial.source),
    coronal: useBundledAssetUri(planeViews.coronal.source),
    sagittal: useBundledAssetUri(planeViews.sagittal.source),
  };
  const volumeBounds = useMemo(() => getVolumeSceneBounds(manifest.volumeGeometry), [manifest.volumeGeometry]);
  const volumeCenterWorld = useMemo(() => getVolumeCenterWorld(manifest.volumeGeometry), [manifest.volumeGeometry]);
  const defaultLookAt = focusedTarget?.derived.scenePosition ?? toSceneCoordinates(volumeCenterWorld);
  const [cameraState, setCameraState] = useState<CameraState>(() =>
    createDefaultCameraState(defaultLookAt, volumeBounds.radius),
  );
  const [interactionMode, setInteractionMode] = useState<InteractionMode>('orbit');
  const [sceneSize, setSceneSize] = useState({ height: 1, width: 1 });
  const interactionRef = useRef<InteractionState>({
    mode: 'rotate',
    moved: false,
    startAzimuth: cameraState.azimuth,
    startDistance: null,
    startLookAt: new THREE.Vector3(...cameraState.lookAt),
    startPolar: cameraState.polar,
    startRadius: cameraState.radius,
    startTime: 0,
  });

  useEffect(() => {
    setCameraState((currentState) => ({
      ...currentState,
      lookAt: focusedTarget?.derived.scenePosition ?? toSceneCoordinates(volumeCenterWorld),
      radius: clampOrbitRadius(currentState.radius, volumeBounds.radius),
    }));
  }, [focusedTarget?.id, volumeBounds.radius, volumeCenterWorld]);

  function resetView() {
    setCameraState(
      createDefaultCameraState(
        focusedTarget?.derived.scenePosition ?? toSceneCoordinates(volumeCenterWorld),
        volumeBounds.radius,
      ),
    );
  }

  function handleZoom(factor: number) {
    setCameraState((currentState) => ({
      ...currentState,
      radius: clampOrbitRadius(currentState.radius * factor, volumeBounds.radius),
    }));
  }

  function handleCanvasLayout(event: LayoutChangeEvent) {
    setSceneSize({
      height: event.nativeEvent.layout.height,
      width: event.nativeEvent.layout.width,
    });
  }

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: () => Boolean(anatomyAsset.uri),
        onPanResponderGrant: (event) => {
          const touches = event.nativeEvent.touches;

          interactionRef.current = {
            mode: touches.length >= 2 ? 'pinch' : 'rotate',
            moved: false,
            startAzimuth: cameraState.azimuth,
            startDistance: touches.length >= 2 ? getTouchDistance(touches) : null,
            startLookAt: new THREE.Vector3(...cameraState.lookAt),
            startPolar: cameraState.polar,
            startRadius: cameraState.radius,
            startTime: Date.now(),
          };
        },
        onPanResponderMove: (event, gestureState) => {
          const touches = event.nativeEvent.touches;

          if (touches.length >= 2) {
            const distance = getTouchDistance(touches);
            const startDistance = interactionRef.current.startDistance;

            if (!distance || !startDistance) {
              return;
            }

            setCameraState((currentState) => ({
              ...currentState,
              radius: clampOrbitRadius(
                interactionRef.current.startRadius *
                  (startDistance / distance),
                volumeBounds.radius,
              ),
            }));
            interactionRef.current.moved = true;
            return;
          }

          if (interactionMode === 'pan') {
            const nextLookAt = getViewportPanPosition(
              interactionRef.current.startLookAt,
              cameraState,
              volumeBounds.radius,
              gestureState.dx,
              gestureState.dy,
            );

            setCameraState((currentState) => ({
              ...currentState,
              lookAt: nextLookAt.toArray() as [number, number, number],
            }));
          } else {
            setCameraState((currentState) => ({
              ...currentState,
              azimuth: interactionRef.current.startAzimuth - gestureState.dx * ORBIT_DRAG_SPEED,
              polar: clampOrbitPolar(interactionRef.current.startPolar + gestureState.dy * ORBIT_DRAG_SPEED),
            }));
          }

          if (
            Math.abs(gestureState.dx) > TAP_MOVEMENT_THRESHOLD ||
            Math.abs(gestureState.dy) > TAP_MOVEMENT_THRESHOLD
          ) {
            interactionRef.current.moved = true;
          }
        },
        onPanResponderRelease: (_event, gestureState) => {
          const tapLike =
            !interactionRef.current.moved &&
            Math.abs(gestureState.dx) < TAP_MOVEMENT_THRESHOLD &&
            Math.abs(gestureState.dy) < TAP_MOVEMENT_THRESHOLD &&
            Date.now() - interactionRef.current.startTime <= TAP_DURATION_MS;

          if (tapLike && sceneSize.height > 0 && sceneSize.width > 0) {
            return;
          }
        },
        onPanResponderTerminate: () => undefined,
        onStartShouldSetPanResponder: () => Boolean(anatomyAsset.uri),
      }),
    [anatomyAsset.uri, cameraState, interactionMode, sceneSize.height, sceneSize.width, volumeBounds.radius],
  );

  const planeWarnings = (['axial', 'coronal', 'sagittal'] as CasePlane[])
    .map((plane) => manifest.sliceTextureMetadata[plane].warning)
    .filter((warning): warning is string => Boolean(warning));
  const viewerLoading = !anatomyAsset.uri;
  const viewerError = anatomyAsset.error ?? planeAssets.axial.error ?? planeAssets.coronal.error ?? planeAssets.sagittal.error;
  const planeSceneState = useMemo(
    () => ({
      axial: {
        axisIndex:
          planeViews.axial.frameIndex === planeViews.axial.centeredFrameIndex && focusedTarget
            ? focusedTarget.derived.continuousVoxel[2]
            : frameIndexToContinuousAxisIndex(
                planeViews.axial.frameIndex,
                planeViews.axial.frameCount,
                manifest.volumeGeometry.sizes[2],
                manifest.sliceSeries.axial.coverageAssumption,
              ),
        frameIndex: planeViews.axial.frameIndex,
        textureUri: planeAssets.axial.uri,
      },
      coronal: {
        axisIndex:
          planeViews.coronal.frameIndex === planeViews.coronal.centeredFrameIndex && focusedTarget
            ? focusedTarget.derived.continuousVoxel[1]
            : frameIndexToContinuousAxisIndex(
                planeViews.coronal.frameIndex,
                planeViews.coronal.frameCount,
                manifest.volumeGeometry.sizes[1],
                manifest.sliceSeries.coronal.coverageAssumption,
              ),
        frameIndex: planeViews.coronal.frameIndex,
        textureUri: planeAssets.coronal.uri,
      },
      sagittal: {
        axisIndex:
          planeViews.sagittal.frameIndex === planeViews.sagittal.centeredFrameIndex && focusedTarget
            ? focusedTarget.derived.continuousVoxel[0]
            : frameIndexToContinuousAxisIndex(
                planeViews.sagittal.frameIndex,
                planeViews.sagittal.frameCount,
                manifest.volumeGeometry.sizes[0],
                manifest.sliceSeries.sagittal.coverageAssumption,
              ),
        frameIndex: planeViews.sagittal.frameIndex,
        textureUri: planeAssets.sagittal.uri,
      },
    }),
    [
      focusedTarget,
      manifest.sliceSeries.axial.coverageAssumption,
      manifest.sliceSeries.coronal.coverageAssumption,
      manifest.sliceSeries.sagittal.coverageAssumption,
      manifest.volumeGeometry.sizes,
      planeAssets.axial.uri,
      planeAssets.coronal.uri,
      planeAssets.sagittal.uri,
      planeViews.axial.centeredFrameIndex,
      planeViews.axial.frameCount,
      planeViews.axial.frameIndex,
      planeViews.coronal.centeredFrameIndex,
      planeViews.coronal.frameCount,
      planeViews.coronal.frameIndex,
      planeViews.sagittal.centeredFrameIndex,
      planeViews.sagittal.frameCount,
      planeViews.sagittal.frameIndex,
    ],
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>Integrated patient-space viewer</Text>
          <Text style={styles.subtitle}>
            One shared scene holds the anatomy GLB, CT slice planes, target markers, and the 3D crosshair.
          </Text>
        </View>
        <View style={styles.pillRow}>
          <StatusPill label={`${visibleTargets.length} visible targets`} tone="teal" />
          <StatusPill label={`${activeTargetIds.length} active`} tone="gold" />
        </View>
      </View>

      <View onLayout={handleCanvasLayout} style={styles.canvasShell}>
        {anatomyAsset.uri ? (
          <Canvas camera={{ far: 20, fov: 34, near: 0.01, position: [0, 0, 1] }} style={styles.canvas}>
            <PatientSpaceScene
              activeTargetIds={activeTargetIds}
              anatomyUri={anatomyAsset.uri}
              cameraState={cameraState}
              focusedTarget={focusedTarget}
              manifest={manifest}
              planeStates={planeSceneState}
              viewerOpacity={viewerOpacity}
              viewerVisibility={viewerVisibility}
              visibleTargets={visibleTargets}
            />
          </Canvas>
        ) : (
          <View style={styles.canvasFallback} />
        )}
        <View {...panResponder.panHandlers} style={styles.gestureLayer} />
        {viewerLoading || viewerError ? (
          <View style={styles.overlay}>
            <Text style={styles.overlayTitle}>{viewerError ? 'Viewer unavailable' : 'Loading patient-space scene'}</Text>
            <Text style={styles.overlayBody}>
              {viewerError ?? 'Resolving the bundled GLB and current slice textures for the integrated viewer.'}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.toolRow}>
        <Pressable
          accessibilityRole="button"
          onPress={() => setInteractionMode('orbit')}
          style={[styles.toolButton, interactionMode === 'orbit' ? styles.toolButtonActive : null]}>
          <Text style={[styles.toolButtonLabel, interactionMode === 'orbit' ? styles.toolButtonLabelActive : null]}>
            Orbit
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => setInteractionMode('pan')}
          style={[styles.toolButton, interactionMode === 'pan' ? styles.toolButtonActive : null]}>
          <Text style={[styles.toolButtonLabel, interactionMode === 'pan' ? styles.toolButtonLabelActive : null]}>
            Pan
          </Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => handleZoom(0.84)} style={styles.toolButton}>
          <Text style={styles.toolButtonLabel}>Zoom in</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => handleZoom(1.18)} style={styles.toolButton}>
          <Text style={styles.toolButtonLabel}>Zoom out</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={resetView} style={styles.toolButton}>
          <Text style={styles.toolButtonLabel}>Reset view</Text>
        </Pressable>
      </View>

      <View style={styles.controlsColumn}>
        <View style={styles.controlCard}>
          <View style={styles.controlHeader}>
            <LayerToggleButton
              active={viewerVisibility.anatomy}
              label="Anatomy"
              onPress={() => onToggleLayer('anatomy')}
            />
            <Text style={styles.controlMeta}>GLB mesh opacity</Text>
          </View>
          <View style={styles.sliderBlock}>
            <Text style={styles.sliderLabel}>Opacity</Text>
            <Slider
              accessibilityLabel="Adjust anatomy opacity"
              maximumTrackTintColor="#D0C3B1"
              maximumValue={1}
              minimumTrackTintColor={colors.accent}
              minimumValue={0}
              onValueChange={(value) => onSetLayerOpacity('anatomy', clampOpacity(value, viewerOpacity.anatomy))}
              step={0.01}
              style={styles.slider}
              thumbTintColor={colors.accent}
              value={viewerOpacity.anatomy}
            />
          </View>
        </View>

        {(['axial', 'coronal', 'sagittal'] as CasePlane[]).map((plane) => (
          <PlaneRow
            key={plane}
            onOpacityChange={(value) => {
              onSetSelectedPlane(plane);
              onSetLayerOpacity(plane, clampOpacity(value, viewerOpacity[plane]));
            }}
            onReset={() => {
              onSetSelectedPlane(plane);
              onResetPlane(plane);
            }}
            onStep={(delta) => {
              onSetSelectedPlane(plane);
              onStepPlane(plane, delta);
            }}
            onToggle={() => {
              onSetSelectedPlane(plane);
              onToggleLayer(plane);
            }}
            opacity={viewerOpacity[plane]}
            plane={plane}
            view={planeViews[plane]}
            visible={viewerVisibility[plane]}
          />
        ))}
      </View>

      {planeWarnings.length > 0 ? (
        <View style={styles.warningCard}>
          <Text style={styles.warningTitle}>Slice texture warning</Text>
          <Text style={styles.warningBody}>{planeWarnings[0]}</Text>
        </View>
      ) : null}

      {focusedTarget ? (
        <View style={styles.focusCard}>
          <Text style={styles.focusTitle}>
            {selectionMode === 'station'
              ? `Primary focus: ${focusedTarget.displayLabel}`
              : `Selected target: ${focusedTarget.displayLabel}`}
          </Text>
          <Text style={styles.focusBody}>
            The shared crosshair sits at the target world point and each visible plane moves through that same
            patient-space location.
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
  },
  canvasFallback: {
    flex: 1,
  },
  canvasShell: {
    backgroundColor: '#E6DDD1',
    borderColor: '#D0C3B1',
    borderRadius: 28,
    borderWidth: 1,
    height: 340,
    overflow: 'hidden',
    position: 'relative',
  },
  container: {
    gap: 14,
  },
  controlCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  controlHeader: {
    gap: 8,
  },
  controlMeta: {
    color: colors.inkSoft,
    fontSize: 12,
    lineHeight: 18,
  },
  controlsColumn: {
    gap: 10,
  },
  focusBody: {
    color: colors.inkSoft,
    fontSize: 14,
    lineHeight: 20,
  },
  focusCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  focusTitle: {
    color: colors.ink,
    fontFamily: 'SpaceMono',
    fontSize: 13,
  },
  gestureLayer: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  header: {
    gap: 10,
  },
  headerCopy: {
    gap: 4,
  },
  layerToggle: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    minHeight: 40,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  layerToggleActive: {
    backgroundColor: colors.goldSoft,
    borderColor: colors.gold,
  },
  layerToggleInactive: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  layerToggleLabel: {
    fontFamily: 'SpaceMono',
    fontSize: 11,
  },
  layerToggleLabelActive: {
    color: colors.gold,
  },
  layerToggleLabelInactive: {
    color: colors.inkSoft,
  },
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(16, 25, 30, 0.62)',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    paddingHorizontal: 24,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  overlayBody: {
    color: colors.white,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
  overlayTitle: {
    color: colors.white,
    fontFamily: 'SpaceMono',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pressed: {
    opacity: 0.84,
  },
  slider: {
    width: '100%',
  },
  sliderBlock: {
    gap: 6,
  },
  sliderLabel: {
    color: colors.inkSoft,
    fontFamily: 'SpaceMono',
    fontSize: 11,
  },
  stepButton: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    minHeight: 42,
    minWidth: 64,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  stepButtonLabel: {
    color: colors.ink,
    fontFamily: 'SpaceMono',
    fontSize: 11,
    textAlign: 'center',
  },
  stepRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  subtitle: {
    color: colors.inkSoft,
    fontSize: 14,
    lineHeight: 20,
  },
  title: {
    color: colors.ink,
    fontFamily: 'SpaceMono',
    fontSize: 15,
  },
  toolButton: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    minHeight: 42,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  toolButtonActive: {
    backgroundColor: colors.tealSoft,
    borderColor: colors.teal,
  },
  toolButtonLabel: {
    color: colors.inkSoft,
    fontFamily: 'SpaceMono',
    fontSize: 11,
    textAlign: 'center',
  },
  toolButtonLabelActive: {
    color: colors.teal,
  },
  toolRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  warningBody: {
    color: colors.inkSoft,
    fontSize: 13,
    lineHeight: 19,
  },
  warningCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  warningTitle: {
    color: colors.ink,
    fontFamily: 'SpaceMono',
    fontSize: 13,
  },
});
