import { useEffect, useMemo, useRef, useState } from 'react';
import 'expo-three/lib/polyfill';
import { Asset } from 'expo-asset';
import { GLView, type ExpoWebGLRenderingContext } from 'expo-gl';
import THREE from 'expo-three/lib/Three';
import {
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { StatusPill } from '@/components/StatusPill';
import { colors } from '@/constants/theme';
import type { CaseSelectionMode, EnrichedCaseTarget, ToggleSetId } from '@/features/case3d/types';
import {
  buildStructureVisibilityEntries,
  clampOrbitPolar,
  clampOrbitRadius,
  formatStructureLabel,
  getTargetStructureKey,
  normalizeMeshKey,
  toSceneCoordinates,
  type StructureVisibilityEntry,
} from '@/features/case3d/viewer-logic';

interface Case3DCanvasProps {
  selectionMode: CaseSelectionMode;
  visibleTargets: EnrichedCaseTarget[];
  activeTargetIds: string[];
  focusTargetId: string;
  onSelectTarget: (targetId: string) => void;
}

type RuntimeRefs = {
  camera: InstanceType<typeof THREE.PerspectiveCamera>;
  gl: ExpoWebGLRenderingContext;
  interactiveMeshes: InstanceType<typeof THREE.Mesh>[];
  markerGeometry: InstanceType<typeof THREE.SphereGeometry>;
  markerMap: Map<string, InstanceType<typeof THREE.Mesh>>;
  meshMap: Map<string, InstanceType<typeof THREE.Mesh>[]>;
  raycaster: InstanceType<typeof THREE.Raycaster>;
  renderer: InstanceType<typeof THREE.WebGLRenderer>;
  scene: InstanceType<typeof THREE.Scene>;
  sceneCenter: InstanceType<typeof THREE.Vector3>;
  sceneRadius: number;
};

type OrbitState = {
  azimuth: number;
  lookAt: InstanceType<typeof THREE.Vector3>;
  polar: number;
  radius: number;
};

type PickedStructure = {
  key: string;
  label: string;
};

type InteractionState = {
  mode: 'pinch' | 'rotate';
  moved: boolean;
  startAzimuth: number;
  startDistance: number | null;
  startLookAt: InstanceType<typeof THREE.Vector3>;
  startPolar: number;
  startRadius: number;
  startTime: number;
};

type InteractionMode = 'orbit' | 'pan';

type MarkerChip = {
  id: string;
  label: string;
};

type ToneConfig = {
  fill: string;
  highlight: string;
  marker: string;
};

type LoadedGlb = {
  scene?: InstanceType<typeof THREE.Group>;
};

const CASE_001_GLB = require('../../model/case_001.glb');
const MIN_CAMERA_RADIUS = 0.18;
const TAP_DURATION_MS = 260;
const TAP_MOVEMENT_THRESHOLD = 6;
const ORBIT_DRAG_SPEED = 0.012;

const GROUP_TONES: Record<ToggleSetId, ToneConfig> = {
  lymph_nodes: { fill: '#34D058', highlight: '#7BFF91', marker: '#D4FFD8' },
  airway: { fill: colors.teal, highlight: '#4FB7AE', marker: '#B3ECE5' },
  vessels: { fill: colors.gold, highlight: '#D6A33D', marker: '#F3E0A8' },
  cardiac: { fill: colors.navy, highlight: '#46627B', marker: '#AFC3D4' },
  gi: { fill: colors.danger, highlight: '#E27368', marker: '#F8C7C2' },
};

const RED_STRUCTURE_TONE: ToneConfig = {
  fill: '#C2463E',
  highlight: '#F07469',
  marker: '#F8CEC7',
};

const DARK_BLUE_STRUCTURE_TONE: ToneConfig = {
  fill: '#1E4D84',
  highlight: '#4F7EB7',
  marker: '#BCD1EC',
};

const LIGHT_BLUE_STRUCTURE_TONE: ToneConfig = {
  fill: '#72C8F7',
  highlight: '#A9E5FF',
  marker: '#DDF6FF',
};

const DARK_RED_STRUCTURE_TONE: ToneConfig = {
  fill: '#8B3134',
  highlight: '#B65457',
  marker: '#EBC2C3',
};

const STRUCTURE_TONE_OVERRIDES: Record<string, ToneConfig> = {
  aorta: RED_STRUCTURE_TONE,
  azygous_vein: LIGHT_BLUE_STRUCTURE_TONE,
  brachiocephalic_trunk: RED_STRUCTURE_TONE,
  inferior_vena_cava: DARK_BLUE_STRUCTURE_TONE,
  left_atrial_appendage: RED_STRUCTURE_TONE,
  left_atrium: RED_STRUCTURE_TONE,
  left_brachiocephalic_vein: DARK_BLUE_STRUCTURE_TONE,
  left_common_carotid_artery: RED_STRUCTURE_TONE,
  left_subclavian_artery: RED_STRUCTURE_TONE,
  left_ventricle: RED_STRUCTURE_TONE,
  pulmonary_artery: DARK_BLUE_STRUCTURE_TONE,
  pulmonary_venous_system: DARK_RED_STRUCTURE_TONE,
  right_atrium: DARK_BLUE_STRUCTURE_TONE,
  right_brachiocephalic_vein: DARK_BLUE_STRUCTURE_TONE,
  right_common_carotid_artery: RED_STRUCTURE_TONE,
  right_subclavian_artery: RED_STRUCTURE_TONE,
  right_ventricle: DARK_BLUE_STRUCTURE_TONE,
  superior_vena_cava: DARK_BLUE_STRUCTURE_TONE,
};

function asColor(hex: string) {
  return new THREE.Color(hex);
}

function createRenderer(gl: ExpoWebGLRenderingContext) {
  const renderer = new THREE.WebGLRenderer({
    canvas: {
      addEventListener: () => undefined,
      clientHeight: gl.drawingBufferHeight,
      height: gl.drawingBufferHeight,
      removeEventListener: () => undefined,
      style: {},
      width: gl.drawingBufferWidth,
    },
    context: gl,
  });

  renderer.setClearColor('#E6DDD1');
  renderer.setPixelRatio(1);
  renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

  return renderer;
}

function ensureNavigatorUserAgent() {
  if (typeof navigator === 'undefined' || typeof navigator.userAgent === 'string') {
    return;
  }

  try {
    Object.defineProperty(navigator, 'userAgent', {
      configurable: true,
      value: 'ReactNative Expo',
    });
  } catch {
    (navigator as { userAgent?: string }).userAgent = 'ReactNative Expo';
  }
}

async function loadBundledGlbAsync(assetModule: number) {
  const asset = Asset.fromModule(assetModule);
  await asset.downloadAsync();

  const assetUri = asset.localUri ?? asset.uri;

  if (!assetUri) {
    throw new Error('Bundled anatomy model could not be resolved.');
  }

  const response = await fetch(assetUri);

  if (!response.ok) {
    throw new Error(`Bundled anatomy model could not be read (${response.status}).`);
  }

  ensureNavigatorUserAgent();

  const loader = new GLTFLoader();
  const arrayBuffer = await response.arrayBuffer();

  return await new Promise<LoadedGlb>((resolve, reject) => {
    loader.parse(arrayBuffer, '', (gltf) => resolve(gltf as LoadedGlb), reject);
  });
}

function toSceneVector(target: Pick<EnrichedCaseTarget, 'markup'>) {
  return new THREE.Vector3(...toSceneCoordinates(target.markup.position));
}

function getToneForStructure(meshKey: string, fallbackGroupId: ToggleSetId) {
  return STRUCTURE_TONE_OVERRIDES[meshKey] ?? GROUP_TONES[fallbackGroupId];
}

function getToneForTarget(target: Pick<EnrichedCaseTarget, 'meshNameResolved' | 'structureGroupId'>) {
  const meshKey = normalizeMeshKey(target.meshNameResolved);

  return getToneForStructure(meshKey, target.structureGroupId);
}

function cloneMaterial(
  material: InstanceType<typeof THREE.Material> | InstanceType<typeof THREE.Material>[] | undefined,
) {
  if (!material) {
    return material;
  }

  if (Array.isArray(material)) {
    return material.map((entry) => {
      const cloned = entry.clone();
      cloned.transparent = true;
      return cloned;
    });
  }

  const cloned = material.clone();
  cloned.transparent = true;
  return cloned;
}

function applyMaterialState(
  mesh: InstanceType<typeof THREE.Mesh>,
  tone: ToneConfig,
  visible: boolean,
  active: boolean,
  focused: boolean,
) {
  mesh.visible = visible;

  if (!mesh.material) {
    return;
  }

  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

  materials.forEach((material: InstanceType<typeof THREE.Material>) => {
    const phongLike = material as typeof THREE.MeshStandardMaterial.prototype;

    if ('opacity' in phongLike) {
      phongLike.opacity = visible ? (focused ? 1 : active ? 0.94 : 0.26) : 0;
    }

    if ('color' in phongLike && phongLike.color) {
      phongLike.color.copy(asColor(focused ? tone.highlight : tone.fill));
    }

    if ('emissive' in phongLike && phongLike.emissive) {
      phongLike.emissive.copy(asColor(focused ? tone.highlight : tone.fill));
      phongLike.emissiveIntensity = focused ? 0.54 : active ? 0.22 : 0.04;
    }

    material.needsUpdate = true;
  });
}

function updateMarkerState(
  marker: InstanceType<typeof THREE.Mesh>,
  tone: ToneConfig,
  visible: boolean,
  active: boolean,
  focused: boolean,
  sceneRadius: number,
) {
  marker.visible = visible;
  marker.scale.setScalar(focused ? 1.9 : active ? 1.45 : 1);

  if (marker.material && !Array.isArray(marker.material)) {
    marker.material.color.copy(asColor(focused ? tone.highlight : tone.marker));
    marker.material.opacity = visible ? (focused ? 1 : active ? 0.96 : 0.54) : 0;
    marker.material.emissive.copy(asColor(focused ? tone.highlight : tone.fill));
    marker.material.emissiveIntensity = focused ? 0.9 : active ? 0.28 : 0.08;
    marker.material.needsUpdate = true;
  }

  const bob = visible ? sceneRadius * 0.0032 : 0;
  marker.position.y += bob;
}

function buildMarkerGeometry(sceneRadius: number) {
  return new THREE.SphereGeometry(Math.max(sceneRadius * 0.02, 0.005), 18, 18);
}

function createDefaultOrbit(sceneCenter: InstanceType<typeof THREE.Vector3>, sceneRadius: number): OrbitState {
  const baseRadius = Math.max(sceneRadius * 1.75, 0.38);
  const offset = new THREE.Vector3(baseRadius * 0.82, baseRadius * 0.42, baseRadius * 1.08);
  const spherical = new THREE.Spherical().setFromVector3(offset);

  return {
    azimuth: spherical.theta,
    lookAt: sceneCenter.clone(),
    polar: clampOrbitPolar(spherical.phi),
    radius: clampOrbitRadius(spherical.radius, sceneRadius),
  };
}

function getCameraOffsetFromOrbit(orbit: OrbitState) {
  return new THREE.Vector3().setFromSpherical(
    new THREE.Spherical(orbit.radius, orbit.polar, orbit.azimuth),
  );
}

function getViewportPanPosition(
  lookAt: InstanceType<typeof THREE.Vector3>,
  orbit: OrbitState,
  sceneRadius: number,
  deltaX: number,
  deltaY: number,
) {
  const cameraPosition = lookAt.clone().add(getCameraOffsetFromOrbit(orbit));
  const forward = lookAt.clone().sub(cameraPosition).normalize();
  let right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0));

  if (right.lengthSq() < 1e-6) {
    right = new THREE.Vector3(1, 0, 0);
  }

  right.normalize();
  const up = new THREE.Vector3().crossVectors(right, forward).normalize();
  const panScale = Math.max(sceneRadius * 0.0024, orbit.radius * 0.0018);

  return lookAt
    .clone()
    .add(right.multiplyScalar(-deltaX * panScale))
    .add(up.multiplyScalar(deltaY * panScale));
}

function getTouchDistance(touches: readonly { pageX: number; pageY: number }[]) {
  if (touches.length < 2) {
    return null;
  }

  return Math.hypot(touches[0].pageX - touches[1].pageX, touches[0].pageY - touches[1].pageY);
}

function getVisibleMarkerChips(
  visibleTargets: EnrichedCaseTarget[],
  activeTargetIds: string[],
  focusTargetId: string,
): MarkerChip[] {
  const activeTargetSet = new Set(activeTargetIds);
  const activeTargets = visibleTargets.filter((target) => activeTargetSet.has(target.id));
  const chips = activeTargets.length > 0 ? activeTargets : visibleTargets.slice(0, 8);

  return chips.map((target) => ({
    id: target.id,
    label: target.id === focusTargetId ? `${target.displayLabel} • focus` : target.displayLabel,
  }));
}

export function Case3DCanvas({
  selectionMode,
  visibleTargets,
  activeTargetIds,
  focusTargetId,
  onSelectTarget,
}: Case3DCanvasProps) {
  const runtimeRef = useRef<RuntimeRefs | null>(null);
  const orbitRef = useRef<OrbitState>({
    azimuth: 0,
    lookAt: new THREE.Vector3(),
    polar: Math.PI / 2,
    radius: MIN_CAMERA_RADIUS,
  });
  const animationFrameRef = useRef<number | null>(null);
  const loadVersionRef = useRef(0);
  const desiredCameraPositionRef = useRef(new THREE.Vector3());
  const desiredLookAtRef = useRef(new THREE.Vector3());
  const canvasSizeRef = useRef({ height: 1, width: 1 });
  const interactionStateRef = useRef<InteractionState>({
    mode: 'rotate',
    moved: false,
    startAzimuth: 0,
    startDistance: null,
    startLookAt: new THREE.Vector3(),
    startPolar: Math.PI / 2,
    startRadius: MIN_CAMERA_RADIUS,
    startTime: 0,
  });
  const pickStructureRef = useRef<(x: number, y: number) => void>(() => undefined);
  const syncCameraRef = useRef<() => void>(() => undefined);
  const visibleTargetsRef = useRef<EnrichedCaseTarget[]>(visibleTargets);
  const activeTargetSetRef = useRef(new Set(activeTargetIds));
  const focusTargetIdRef = useRef(focusTargetId);
  const structureEntryMapRef = useRef(new Map<string, StructureVisibilityEntry>());
  const [sceneStatus, setSceneStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [sceneMessage, setSceneMessage] = useState('Loading bundled anatomy model...');
  const [pickedStructure, setPickedStructure] = useState<PickedStructure | null>(null);
  const [hiddenStructureKeys, setHiddenStructureKeys] = useState<string[]>([]);
  const [interactionMode, setInteractionMode] = useState<InteractionMode>('orbit');

  const focusTarget = visibleTargets.find((target) => target.id === focusTargetId) ?? null;
  const markerChips = getVisibleMarkerChips(visibleTargets, activeTargetIds, focusTargetId);
  const verifiedMeshCount = visibleTargets.filter((target) => target.meshExists).length;
  const structureEntries = useMemo(
    () => buildStructureVisibilityEntries(visibleTargets, hiddenStructureKeys),
    [hiddenStructureKeys, visibleTargets],
  );
  const hiddenStructureSet = useMemo(() => new Set(hiddenStructureKeys), [hiddenStructureKeys]);

  visibleTargetsRef.current = visibleTargets;
  activeTargetSetRef.current = new Set(activeTargetIds);
  focusTargetIdRef.current = focusTargetId;
  structureEntryMapRef.current = new Map(structureEntries.map((entry) => [entry.key, entry]));

  useEffect(() => {
    const availableKeys = new Set(buildStructureVisibilityEntries(visibleTargets).map((entry) => entry.key));

    setHiddenStructureKeys((currentKeys) => {
      const nextKeys = currentKeys.filter((key) => availableKeys.has(key));

      return nextKeys.length === currentKeys.length ? currentKeys : nextKeys;
    });
  }, [visibleTargets]);

  useEffect(() => {
    if (!pickedStructure) {
      return;
    }

    if (!structureEntries.some((entry) => entry.key === pickedStructure.key && !entry.hidden)) {
      setPickedStructure(null);
    }
  }, [pickedStructure, structureEntries]);

  function syncDesiredCameraFromOrbit() {
    const runtime = runtimeRef.current;

    if (!runtime) {
      return;
    }

    orbitRef.current.radius = clampOrbitRadius(orbitRef.current.radius, runtime.sceneRadius);
    desiredLookAtRef.current.copy(orbitRef.current.lookAt);
    desiredCameraPositionRef.current
      .copy(orbitRef.current.lookAt)
      .add(getCameraOffsetFromOrbit(orbitRef.current));
  }

  syncCameraRef.current = syncDesiredCameraFromOrbit;

  function resetOrbitToFocus() {
    const runtime = runtimeRef.current;

    if (!runtime) {
      return;
    }

    const nextLookAt = focusTarget ? toSceneVector(focusTarget) : runtime.sceneCenter.clone();
    const nextOrbit = createDefaultOrbit(nextLookAt, runtime.sceneRadius);

    orbitRef.current = nextOrbit;
    syncDesiredCameraFromOrbit();
  }

  function handleZoom(factor: number) {
    const runtime = runtimeRef.current;

    if (!runtime) {
      return;
    }

    orbitRef.current.radius = clampOrbitRadius(orbitRef.current.radius * factor, runtime.sceneRadius);
    syncDesiredCameraFromOrbit();
  }

  function handleViewportPan(startLookAt: InstanceType<typeof THREE.Vector3>, deltaX: number, deltaY: number) {
    const runtime = runtimeRef.current;

    if (!runtime) {
      return;
    }

    orbitRef.current.lookAt.copy(
      getViewportPanPosition(startLookAt, orbitRef.current, runtime.sceneRadius, deltaX, deltaY),
    );
    syncDesiredCameraFromOrbit();
  }

  function handleToggleStructureVisibility(structureKey: string) {
    setHiddenStructureKeys((currentKeys) =>
      currentKeys.includes(structureKey)
        ? currentKeys.filter((key) => key !== structureKey)
        : [...currentKeys, structureKey],
    );
  }

  function handleCanvasLayout(event: LayoutChangeEvent) {
    canvasSizeRef.current = {
      height: event.nativeEvent.layout.height,
      width: event.nativeEvent.layout.width,
    };
  }

  function pickStructureAt(locationX: number, locationY: number) {
    const runtime = runtimeRef.current;

    if (!runtime) {
      return;
    }

    const { height, width } = canvasSizeRef.current;

    if (height <= 0 || width <= 0) {
      return;
    }

    const pointer = new THREE.Vector2((locationX / width) * 2 - 1, -((locationY / height) * 2 - 1));
    runtime.raycaster.setFromCamera(pointer, runtime.camera);

    const hits = runtime.raycaster.intersectObjects(
      runtime.interactiveMeshes.filter((mesh) => mesh.visible),
      false,
    );
    const hit = hits.find((entry: (typeof hits)[number]) => entry.object.visible);

    if (!hit) {
      setPickedStructure(null);
      return;
    }

    const meshKey =
      typeof hit.object.userData.meshKey === 'string'
        ? (hit.object.userData.meshKey as string)
        : normalizeMeshKey(hit.object.name);
    const entry = structureEntryMapRef.current.get(meshKey);

    setPickedStructure({
      key: meshKey,
      label: entry?.label ?? formatStructureLabel(hit.object.name),
    });

    const preferredTarget =
      visibleTargetsRef.current.find(
        (target) => getTargetStructureKey(target) === meshKey && target.id === focusTargetIdRef.current,
      ) ??
      visibleTargetsRef.current.find(
        (target) => getTargetStructureKey(target) === meshKey && activeTargetSetRef.current.has(target.id),
      ) ??
      (entry?.targetCount === 1
        ? visibleTargetsRef.current.find((target) => target.id === entry.targetIds[0])
        : undefined);

    if (preferredTarget) {
      onSelectTarget(preferredTarget.id);
    }
  }

  pickStructureRef.current = pickStructureAt;

  function syncSceneState() {
    const runtime = runtimeRef.current;

    if (!runtime) {
      return;
    }

    const visibleTargetsByMesh = new Map<string, EnrichedCaseTarget[]>();

    visibleTargets.forEach((target) => {
      if (!target.meshNameResolved) {
        return;
      }

      const meshKey = normalizeMeshKey(target.meshNameResolved);
      const currentTargets = visibleTargetsByMesh.get(meshKey) ?? [];
      currentTargets.push(target);
      visibleTargetsByMesh.set(meshKey, currentTargets);
    });

    runtime.meshMap.forEach((meshes, meshName) => {
      const linkedTargets = visibleTargetsByMesh.get(meshName) ?? [];
      const hidden = hiddenStructureSet.has(meshName);
      const visible = linkedTargets.length > 0 && !hidden;
      const active = linkedTargets.some((target) => activeTargetSetRef.current.has(target.id));
      const focused = linkedTargets.some((target) => target.id === focusTargetIdRef.current);
      const tone = linkedTargets[0]
        ? getToneForStructure(meshName, linkedTargets[0].structureGroupId)
        : GROUP_TONES.airway;

      meshes.forEach((mesh) => {
        applyMaterialState(mesh, tone, visible, active, focused);
      });
    });

    visibleTargets.forEach((target) => {
      let marker = runtime.markerMap.get(target.id);

      if (!marker) {
        const markerTone = getToneForTarget(target);
        const markerMaterial = new THREE.MeshStandardMaterial({
          color: asColor(markerTone.marker),
          emissive: asColor(markerTone.fill),
          emissiveIntensity: 0.2,
          metalness: 0.1,
          roughness: 0.4,
          transparent: true,
        });
        marker = new THREE.Mesh(runtime.markerGeometry, markerMaterial);
        runtime.markerMap.set(target.id, marker);
        runtime.scene.add(marker);
      }

      const hidden = hiddenStructureSet.has(getTargetStructureKey(target));
      const active = activeTargetSetRef.current.has(target.id);
      const focused = target.id === focusTargetIdRef.current;
      const markerTone = getToneForTarget(target);

      marker.position.copy(toSceneVector(target));
      updateMarkerState(
        marker,
        markerTone,
        false,
        active,
        focused,
        runtime.sceneRadius,
      );
    });

    runtime.markerMap.forEach((marker, markerId) => {
      if (visibleTargets.some((target) => target.id === markerId)) {
        return;
      }

      marker.visible = false;
    });

    orbitRef.current.lookAt.copy(focusTarget ? toSceneVector(focusTarget) : runtime.sceneCenter.clone());
    syncDesiredCameraFromOrbit();
  }

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: () => sceneStatus === 'ready',
        onPanResponderGrant: (event) => {
          const touches = event.nativeEvent.touches;

          interactionStateRef.current = {
            mode: touches.length >= 2 ? 'pinch' : 'rotate',
            moved: false,
            startAzimuth: orbitRef.current.azimuth,
            startDistance: touches.length >= 2 ? getTouchDistance(touches) : null,
            startLookAt: orbitRef.current.lookAt.clone(),
            startPolar: orbitRef.current.polar,
            startRadius: orbitRef.current.radius,
            startTime: Date.now(),
          };
        },
        onPanResponderMove: (event, gestureState) => {
          const runtime = runtimeRef.current;

          if (!runtime) {
            return;
          }

          const touches = event.nativeEvent.touches;

          if (touches.length >= 2) {
            const distance = getTouchDistance(touches);

            if (!distance) {
              return;
            }

            if (interactionStateRef.current.mode !== 'pinch' || !interactionStateRef.current.startDistance) {
              interactionStateRef.current.mode = 'pinch';
              interactionStateRef.current.startDistance = distance;
              interactionStateRef.current.startRadius = orbitRef.current.radius;
            }

            orbitRef.current.radius = clampOrbitRadius(
              interactionStateRef.current.startRadius *
                (interactionStateRef.current.startDistance / distance),
              runtime.sceneRadius,
            );
            interactionStateRef.current.moved = true;
            syncCameraRef.current();
            return;
          }

          if (interactionMode === 'pan') {
            handleViewportPan(interactionStateRef.current.startLookAt, gestureState.dx, gestureState.dy);
          } else {
            orbitRef.current.azimuth =
              interactionStateRef.current.startAzimuth - gestureState.dx * ORBIT_DRAG_SPEED;
            orbitRef.current.polar = clampOrbitPolar(
              interactionStateRef.current.startPolar + gestureState.dy * ORBIT_DRAG_SPEED,
            );
            syncCameraRef.current();
          }

          if (
            Math.abs(gestureState.dx) > TAP_MOVEMENT_THRESHOLD ||
            Math.abs(gestureState.dy) > TAP_MOVEMENT_THRESHOLD
          ) {
            interactionStateRef.current.moved = true;
          }
        },
        onPanResponderRelease: (event, gestureState) => {
          const tapLike =
            !interactionStateRef.current.moved &&
            Math.abs(gestureState.dx) < TAP_MOVEMENT_THRESHOLD &&
            Math.abs(gestureState.dy) < TAP_MOVEMENT_THRESHOLD &&
            Date.now() - interactionStateRef.current.startTime <= TAP_DURATION_MS;

          if (tapLike) {
            pickStructureRef.current(event.nativeEvent.locationX, event.nativeEvent.locationY);
          }
        },
        onPanResponderTerminate: () => undefined,
        onStartShouldSetPanResponder: () => sceneStatus === 'ready',
      }),
    [interactionMode, sceneStatus],
  );

  async function handleContextCreate(gl: ExpoWebGLRenderingContext) {
    const loadVersion = loadVersionRef.current + 1;
    loadVersionRef.current = loadVersion;
    setSceneStatus('loading');
    setSceneMessage('Loading bundled anatomy model...');

    const scene = new THREE.Scene();
    scene.background = asColor('#E6DDD1');

    const camera = new THREE.PerspectiveCamera(
      34,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.01,
      20,
    );
    const renderer = createRenderer(gl);

    const ambientLight = new THREE.AmbientLight('#FFF3E2', 1.2);
    const keyLight = new THREE.DirectionalLight('#FFFFFF', 1.2);
    keyLight.position.set(1.2, 1.6, 1.8);
    const fillLight = new THREE.DirectionalLight('#AFC3D4', 0.7);
    fillLight.position.set(-1.3, 0.8, 1.1);

    scene.add(ambientLight);
    scene.add(keyLight);
    scene.add(fillLight);

    try {
      const loaded = await loadBundledGlbAsync(CASE_001_GLB);

      if (loadVersionRef.current !== loadVersion) {
        return;
      }

      const modelRoot = 'scene' in loaded && loaded.scene ? loaded.scene : loaded;
      const meshMap = new Map<string, InstanceType<typeof THREE.Mesh>[]>();
      const markerMap = new Map<string, InstanceType<typeof THREE.Mesh>>();
      const interactiveMeshes: InstanceType<typeof THREE.Mesh>[] = [];

      modelRoot.traverse((node: any) => {
        if (!node?.isMesh) {
          return;
        }

        node.material = cloneMaterial(node.material);
        node.castShadow = false;
        node.receiveShadow = false;

        if (!node.name) {
          return;
        }

        const meshKey = normalizeMeshKey(node.name);
        node.userData.meshKey = meshKey;
        interactiveMeshes.push(node);

        const linkedMeshes = meshMap.get(meshKey) ?? [];
        linkedMeshes.push(node);
        meshMap.set(meshKey, linkedMeshes);
      });

      scene.add(modelRoot);

      const bounds = new THREE.Box3().setFromObject(modelRoot);
      const boundingSphere = bounds.getBoundingSphere(new THREE.Sphere());
      const sceneCenter = boundingSphere.center.clone();
      const sceneRadius = Math.max(boundingSphere.radius, MIN_CAMERA_RADIUS);
      const markerGeometry = buildMarkerGeometry(sceneRadius);

      visibleTargets.forEach((target) => {
        const markerMaterial = new THREE.MeshStandardMaterial({
          color: asColor(GROUP_TONES[target.structureGroupId].marker),
          emissive: asColor(GROUP_TONES[target.structureGroupId].fill),
          emissiveIntensity: 0.2,
          metalness: 0.1,
          roughness: 0.4,
          transparent: true,
        });
        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
        marker.position.copy(toSceneVector(target));
        marker.visible = false;
        markerMap.set(target.id, marker);
        scene.add(marker);
      });

      runtimeRef.current = {
        camera,
        gl,
        interactiveMeshes,
        markerGeometry,
        markerMap,
        meshMap,
        raycaster: new THREE.Raycaster(),
        renderer,
        scene,
        sceneCenter,
        sceneRadius,
      };

      orbitRef.current = createDefaultOrbit(sceneCenter, sceneRadius);
      syncDesiredCameraFromOrbit();
      camera.position.copy(desiredCameraPositionRef.current);
      camera.lookAt(desiredLookAtRef.current);

      syncSceneState();
      setSceneStatus('ready');
      setSceneMessage('Loaded');

      const renderFrame = () => {
        const runtime = runtimeRef.current;

        if (!runtime) {
          return;
        }

        runtime.camera.position.lerp(desiredCameraPositionRef.current, 0.16);
        runtime.camera.lookAt(desiredLookAtRef.current);
        runtime.renderer.render(runtime.scene, runtime.camera);
        runtime.gl.endFrameEXP();
        animationFrameRef.current = requestAnimationFrame(renderFrame);
      };

      animationFrameRef.current = requestAnimationFrame(renderFrame);
    } catch (error) {
      runtimeRef.current = null;
      setSceneStatus('error');
      setSceneMessage(error instanceof Error ? error.message : 'The bundled GLB could not be loaded.');
    }
  }

  useEffect(() => {
    syncSceneState();
  }, [activeTargetIds, focusTargetId, hiddenStructureKeys, visibleTargets]);

  useEffect(() => {
    return () => {
      loadVersionRef.current += 1;

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      runtimeRef.current?.renderer.dispose();
      runtimeRef.current = null;
    };
  }, []);

  const interactionHint =
    sceneStatus === 'ready'
      ? interactionMode === 'pan'
        ? 'Pan mode is active. Drag to reposition the model in the viewer, pinch or use zoom buttons to change distance, and tap a visible structure to identify it.'
        : 'Orbit mode is active. Drag to rotate the model, pinch or use zoom buttons to change distance, and tap a visible structure to identify it.'
      : sceneMessage;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>Runtime GLB explorer</Text>
          <Text style={styles.subtitle}>
            Switch between orbit and pan, zoom in or out, tap structures to identify them, and hide individual anatomy when you want a cleaner view.
          </Text>
        </View>
        <View style={styles.pillRow}>
          <StatusPill label={`${visibleTargets.length} visible`} tone="teal" />
          <StatusPill label={`${verifiedMeshCount} mesh-linked`} tone="gold" />
        </View>
      </View>

      <View onLayout={handleCanvasLayout} style={styles.canvasShell}>
        <GLView
          accessibilityLabel="Interactive 3D anatomy model"
          onContextCreate={handleContextCreate}
          style={styles.canvas}
        />
        <View {...panResponder.panHandlers} style={styles.gestureLayer} />
        {pickedStructure ? (
          <View pointerEvents="none" style={styles.viewerLabel}>
            <Text style={styles.viewerLabelText}>{pickedStructure.label}</Text>
          </View>
        ) : null}
        {sceneStatus !== 'ready' ? (
          <View style={styles.overlay}>
            <Text style={styles.overlayTitle}>
              {sceneStatus === 'error' ? '3D model unavailable' : 'Loading 3D model'}
            </Text>
            <Text style={styles.overlayBody}>{sceneMessage}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.toolRow}>
        <Pressable
          accessibilityLabel="Set orbit mode"
          accessibilityRole="button"
          onPress={() => setInteractionMode('orbit')}
          style={[styles.toolButton, interactionMode === 'orbit' ? styles.toolButtonActive : null]}>
          <Text style={[styles.toolButtonLabel, interactionMode === 'orbit' ? styles.toolButtonLabelActive : null]}>
            Orbit
          </Text>
        </Pressable>
        <Pressable
          accessibilityLabel="Set pan mode"
          accessibilityRole="button"
          onPress={() => setInteractionMode('pan')}
          style={[styles.toolButton, interactionMode === 'pan' ? styles.toolButtonActive : null]}>
          <Text style={[styles.toolButtonLabel, interactionMode === 'pan' ? styles.toolButtonLabelActive : null]}>
            Pan
          </Text>
        </Pressable>
        <Pressable
          accessibilityLabel="Zoom in"
          accessibilityRole="button"
          onPress={() => handleZoom(0.84)}
          style={styles.toolButton}>
          <Text style={styles.toolButtonLabel}>Zoom in</Text>
        </Pressable>
        <Pressable
          accessibilityLabel="Zoom out"
          accessibilityRole="button"
          onPress={() => handleZoom(1.18)}
          style={styles.toolButton}>
          <Text style={styles.toolButtonLabel}>Zoom out</Text>
        </Pressable>
        <Pressable
          accessibilityLabel="Reset 3D view"
          accessibilityRole="button"
          onPress={resetOrbitToFocus}
          style={styles.toolButton}>
          <Text style={styles.toolButtonLabel}>Reset view</Text>
        </Pressable>
      </View>

      <View style={styles.tipCard}>
        <Text style={styles.tipTitle}>3D controls</Text>
        <Text style={styles.tipBody}>{interactionHint}</Text>
      </View>

      <View style={styles.chipRow}>
        {markerChips.map((chip) => (
          <Pressable
            key={chip.id}
            accessibilityRole="button"
            accessibilityLabel={`Focus ${chip.label}`}
            onPress={() => onSelectTarget(chip.id)}
            style={[styles.markerChip, chip.id === focusTargetId ? styles.markerChipActive : null]}>
            <Text style={styles.markerChipLabel}>{chip.label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.structureSection}>
        <View style={styles.structureHeader}>
          <Text style={styles.structureTitle}>Structure visibility</Text>
          {hiddenStructureKeys.length > 0 ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Show all structures"
              onPress={() => setHiddenStructureKeys([])}
              style={styles.structureReset}>
              <Text style={styles.structureResetLabel}>Show all</Text>
            </Pressable>
          ) : null}
        </View>
        <View style={styles.structureChipRow}>
          {structureEntries.map((entry) => (
            <Pressable
              key={entry.key}
              accessibilityRole="button"
              accessibilityLabel={`${entry.hidden ? 'Show' : 'Hide'} ${entry.label}`}
              onPress={() => handleToggleStructureVisibility(entry.key)}
              style={[
                styles.structureChip,
                STRUCTURE_CHIP_TONE_STYLES[entry.structureGroupId],
                entry.hidden ? styles.structureChipHidden : null,
              ]}>
              <Text style={[styles.structureChipLabel, entry.hidden ? styles.structureChipLabelHidden : null]}>
                {entry.label}
                {entry.targetCount > 1 ? ` · ${entry.targetCount}` : ''}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {focusTarget ? (
        <View style={styles.focusCard}>
          <Text style={styles.focusTitle}>
            {selectionMode === 'station'
              ? `Primary focus: ${focusTarget.displayLabel}`
              : `Selected target: ${focusTarget.displayLabel}`}
          </Text>
          <Text style={styles.focusBody}>
            {focusTarget.meshExists
              ? `Mesh "${focusTarget.meshNameResolved}" is rendered live and highlighted in the GLB.`
              : 'This target stays selectable through its 3D marker even though the expected mesh name was not found in the GLB.'}
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
  canvasShell: {
    backgroundColor: '#E6DDD1',
    borderColor: '#D0C3B1',
    borderRadius: 28,
    borderWidth: 1,
    height: 320,
    overflow: 'hidden',
    position: 'relative',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  container: {
    gap: 14,
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
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    gap: 10,
  },
  headerCopy: {
    gap: 4,
  },
  markerChip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  markerChipActive: {
    backgroundColor: '#DCE8E6',
    borderColor: colors.teal,
  },
  markerChipLabel: {
    color: colors.ink,
    fontFamily: 'SpaceMono',
    fontSize: 12,
  },
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(230, 221, 209, 0.9)',
    bottom: 0,
    gap: 8,
    justifyContent: 'center',
    left: 0,
    paddingHorizontal: 24,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  overlayBody: {
    color: colors.inkSoft,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  overlayTitle: {
    color: colors.ink,
    fontFamily: 'SpaceMono',
    fontSize: 14,
    textAlign: 'center',
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  structureChip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  structureChipLabel: {
    color: colors.ink,
    fontFamily: 'SpaceMono',
    fontSize: 12,
  },
  structureChipLabelHidden: {
    color: colors.inkSoft,
  },
  structureChipHidden: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    opacity: 0.66,
  },
  structureChipAirway: {
    backgroundColor: colors.tealSoft,
    borderColor: colors.teal,
  },
  structureChipCardiac: {
    backgroundColor: '#D9E2E8',
    borderColor: colors.navy,
  },
  structureChipGi: {
    backgroundColor: colors.dangerSoft,
    borderColor: colors.danger,
  },
  structureChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  structureChipLymphNodes: {
    backgroundColor: '#D7F7DE',
    borderColor: '#34D058',
  },
  structureChipVessels: {
    backgroundColor: colors.goldSoft,
    borderColor: colors.gold,
  },
  structureHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  structureReset: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  structureResetLabel: {
    color: colors.ink,
    fontFamily: 'SpaceMono',
    fontSize: 12,
  },
  structureSection: {
    gap: 10,
  },
  structureTitle: {
    color: colors.ink,
    fontFamily: 'SpaceMono',
    fontSize: 13,
  },
  subtitle: {
    color: colors.inkSoft,
    fontSize: 14,
    lineHeight: 20,
  },
  viewerLabel: {
    backgroundColor: 'rgba(23, 50, 69, 0.88)',
    borderRadius: 999,
    left: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    position: 'absolute',
    top: 14,
  },
  viewerLabelText: {
    color: colors.white,
    fontFamily: 'SpaceMono',
    fontSize: 12,
  },
  tipBody: {
    color: colors.inkSoft,
    fontSize: 13,
    lineHeight: 19,
  },
  tipCard: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  tipTitle: {
    color: colors.ink,
    fontFamily: 'SpaceMono',
    fontSize: 12,
  },
  title: {
    color: colors.ink,
    fontFamily: 'SpaceMono',
    fontSize: 15,
  },
  toolButton: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  toolButtonActive: {
    backgroundColor: '#DCE8E6',
    borderColor: colors.teal,
  },
  toolButtonLabel: {
    color: colors.ink,
    fontFamily: 'SpaceMono',
    fontSize: 12,
  },
  toolButtonLabelActive: {
    color: colors.teal,
  },
  toolRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});

const STRUCTURE_CHIP_TONE_STYLES: Record<ToggleSetId, any> = {
  airway: styles.structureChipAirway,
  cardiac: styles.structureChipCardiac,
  gi: styles.structureChipGi,
  lymph_nodes: styles.structureChipLymphNodes,
  vessels: styles.structureChipVessels,
};
