import { Suspense, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { colors } from '@/constants/theme';
import {
  getPlanePoseAtAxisIndex,
  normalizeSliceCrop,
} from '@/features/case3d/patient-space';
import { useFrame, useLoader, useThree } from '@/features/case3d/r3f';
import { SliceTextureLoader } from '@/features/case3d/slice-texture-loader';
import { normalizeMeshKey } from '@/features/case3d/viewer-logic';
import type {
  CasePlane,
  EnrichedCaseManifest,
  EnrichedCaseTarget,
  Matrix4Tuple,
  ToggleSetId,
  Vector3Tuple,
  ViewerOpacity,
  ViewerVisibility,
} from '@/features/case3d/types';

type PlaneSceneState = {
  axisIndex: number;
  frameIndex: number;
  textureUri: string | null;
};

export interface PatientSpaceSceneProps {
  activeTargetIds: string[];
  anatomyUri: string;
  cameraState: {
    azimuth: number;
    lookAt: Vector3Tuple;
    polar: number;
    radius: number;
  };
  focusedTarget: EnrichedCaseTarget | null;
  manifest: EnrichedCaseManifest;
  planeStates: Record<CasePlane, PlaneSceneState>;
  viewerOpacity: ViewerOpacity;
  viewerVisibility: ViewerVisibility;
  visibleTargets: EnrichedCaseTarget[];
}

type ToneConfig = {
  fill: string;
  highlight: string;
  marker: string;
};

const GROUP_TONES: Record<ToggleSetId, ToneConfig> = {
  lymph_nodes: { fill: '#34D058', highlight: '#7BFF91', marker: '#D4FFD8' },
  airway: { fill: colors.teal, highlight: '#4FB7AE', marker: '#B3ECE5' },
  vessels: { fill: colors.gold, highlight: '#D6A33D', marker: '#F3E0A8' },
  cardiac: { fill: colors.navy, highlight: '#46627B', marker: '#AFC3D4' },
  gi: { fill: colors.danger, highlight: '#E27368', marker: '#F8C7C2' },
};

const STRUCTURE_TONE_OVERRIDES: Record<string, ToneConfig> = {
  aorta: { fill: '#C2463E', highlight: '#F07469', marker: '#F8CEC7' },
  azygous_vein: { fill: '#72C8F7', highlight: '#A9E5FF', marker: '#DDF6FF' },
  brachiocephalic_trunk: { fill: '#C2463E', highlight: '#F07469', marker: '#F8CEC7' },
  inferior_vena_cava: { fill: '#1E4D84', highlight: '#4F7EB7', marker: '#BCD1EC' },
  left_atrial_appendage: { fill: '#C2463E', highlight: '#F07469', marker: '#F8CEC7' },
  left_atrium: { fill: '#C2463E', highlight: '#F07469', marker: '#F8CEC7' },
  left_brachiocephalic_vein: { fill: '#1E4D84', highlight: '#4F7EB7', marker: '#BCD1EC' },
  left_common_carotid_artery: { fill: '#C2463E', highlight: '#F07469', marker: '#F8CEC7' },
  left_subclavian_artery: { fill: '#C2463E', highlight: '#F07469', marker: '#F8CEC7' },
  left_ventricle: { fill: '#C2463E', highlight: '#F07469', marker: '#F8CEC7' },
  pulmonary_artery: { fill: '#1E4D84', highlight: '#4F7EB7', marker: '#BCD1EC' },
  pulmonary_venous_system: { fill: '#8B3134', highlight: '#B65457', marker: '#EBC2C3' },
  right_atrium: { fill: '#1E4D84', highlight: '#4F7EB7', marker: '#BCD1EC' },
  right_brachiocephalic_vein: { fill: '#1E4D84', highlight: '#4F7EB7', marker: '#BCD1EC' },
  right_common_carotid_artery: { fill: '#C2463E', highlight: '#F07469', marker: '#F8CEC7' },
  right_subclavian_artery: { fill: '#C2463E', highlight: '#F07469', marker: '#F8CEC7' },
  right_ventricle: { fill: '#1E4D84', highlight: '#4F7EB7', marker: '#BCD1EC' },
  superior_vena_cava: { fill: '#1E4D84', highlight: '#4F7EB7', marker: '#BCD1EC' },
};

if (typeof globalThis.ProgressEvent === 'undefined') {
  globalThis.ProgressEvent = class ProgressEvent {} as unknown as typeof ProgressEvent;
}

if (typeof navigator !== 'undefined' && typeof navigator.userAgent !== 'string') {
  try {
    Object.defineProperty(navigator, 'userAgent', {
      configurable: true,
      value: 'Expo',
    });
  } catch {
    // Ignore environments that do not allow overriding navigator.userAgent.
  }
}

function asColor(hex: string) {
  return new THREE.Color(hex);
}

function toThreeMatrix4(rowMajor: Matrix4Tuple) {
  return new THREE.Matrix4().set(...rowMajor);
}

function getToneForTarget(target: Pick<EnrichedCaseTarget, 'meshNameResolved' | 'structureGroupId'>) {
  const meshKey = normalizeMeshKey(target.meshNameResolved);
  return STRUCTURE_TONE_OVERRIDES[meshKey] ?? GROUP_TONES[target.structureGroupId];
}

function cloneMaterial(
  material: THREE.Material | THREE.Material[] | undefined,
): THREE.Material | THREE.Material[] | undefined {
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
  mesh: THREE.Mesh,
  tone: ToneConfig,
  visible: boolean,
  opacity: number,
  active: boolean,
  focused: boolean,
) {
  mesh.visible = visible;

  if (!mesh.material) {
    return;
  }

  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  const resolvedOpacity = visible ? opacity * (focused ? 1 : active ? 0.94 : 0.28) : 0;

  materials.forEach((material: THREE.Material) => {
    const phongLike = material as THREE.MeshStandardMaterial;

    if ('opacity' in phongLike) {
      phongLike.opacity = resolvedOpacity;
    }

    if ('color' in phongLike && phongLike.color) {
      phongLike.color.copy(asColor(focused ? tone.highlight : tone.fill));
    }

    if ('emissive' in phongLike && phongLike.emissive) {
      phongLike.emissive.copy(asColor(focused ? tone.highlight : tone.fill));
      phongLike.emissiveIntensity = focused ? 0.42 : active ? 0.16 : 0.04;
    }

    material.needsUpdate = true;
  });
}

function CameraRig({
  azimuth,
  lookAt,
  polar,
  radius,
}: PatientSpaceSceneProps['cameraState']) {
  const { camera } = useThree();
  const desiredLookAt = useMemo(() => new THREE.Vector3(...lookAt), [lookAt]);
  const desiredPosition = useMemo(() => {
    const offset = new THREE.Vector3().setFromSpherical(new THREE.Spherical(radius, polar, azimuth));
    return desiredLookAt.clone().add(offset);
  }, [azimuth, desiredLookAt, polar, radius]);

  useFrame(() => {
    camera.position.lerp(desiredPosition, 0.18);
    camera.lookAt(desiredLookAt);
  });

  return null;
}

function AnatomyModel({
  activeTargetIds,
  anatomyUri,
  focusedTarget,
  manifest,
  opacity,
  visible,
  visibleTargets,
}: {
  activeTargetIds: string[];
  anatomyUri: string;
  focusedTarget: EnrichedCaseTarget | null;
  manifest: EnrichedCaseManifest;
  opacity: number;
  visible: boolean;
  visibleTargets: EnrichedCaseTarget[];
}) {
  const gltf = useLoader(GLTFLoader, anatomyUri) as { scene: THREE.Group };
  const inverseMatrix = useMemo(
    () => toThreeMatrix4(manifest.patientToScene.inverseMatrix),
    [manifest.patientToScene.inverseMatrix],
  );
  const modelRoot = useMemo(() => {
    const cloned = gltf.scene.clone(true);
    cloned.matrixAutoUpdate = false;
    cloned.matrix.copy(inverseMatrix);
    cloned.traverse((node: THREE.Object3D) => {
      if (!('isMesh' in node) || !node.isMesh) {
        return;
      }

      const mesh = node as THREE.Mesh;
      const material = cloneMaterial(mesh.material);

      if (material) {
        mesh.material = material;
      }
      mesh.castShadow = false;
      mesh.receiveShadow = false;
    });
    return cloned;
  }, [gltf.scene, inverseMatrix]);
  const meshMap = useMemo(() => {
    const map = new Map<string, THREE.Mesh[]>();

    modelRoot.traverse((node: THREE.Object3D) => {
      if (!('isMesh' in node) || !node.isMesh || !node.name) {
        return;
      }

      const key = normalizeMeshKey(node.name);
      const meshes = map.get(key) ?? [];
      meshes.push(node as THREE.Mesh);
      map.set(key, meshes);
    });

    return map;
  }, [modelRoot]);

  useEffect(() => {
    const activeSet = new Set(activeTargetIds);
    const visibleTargetsByMesh = new Map<string, EnrichedCaseTarget[]>();

    visibleTargets.forEach((target) => {
      if (!target.meshNameResolved) {
        return;
      }

      const key = normalizeMeshKey(target.meshNameResolved);
      const entries = visibleTargetsByMesh.get(key) ?? [];
      entries.push(target);
      visibleTargetsByMesh.set(key, entries);
    });

    meshMap.forEach((meshes, meshKey) => {
      const linkedTargets = visibleTargetsByMesh.get(meshKey) ?? [];
      const linkedTarget = linkedTargets[0];
      const tone = linkedTarget ? getToneForTarget(linkedTarget) : GROUP_TONES.airway;
      const isActive = linkedTargets.some((target) => activeSet.has(target.id));
      const isFocused = linkedTargets.some((target) => target.id === focusedTarget?.id);
      const isVisible = visible && linkedTargets.length > 0;

      meshes.forEach((mesh) => {
        applyMaterialState(mesh, tone, isVisible, opacity, isActive, isFocused);
      });
    });
  }, [activeTargetIds, focusedTarget?.id, meshMap, opacity, visible, visibleTargets]);

  return <primitive object={modelRoot} />;
}

function SlicePlane({
  geometry,
  manifest,
  opacity,
  plane,
  textureUri,
  axisIndex,
}: {
  geometry: EnrichedCaseManifest['volumeGeometry'];
  manifest: EnrichedCaseManifest;
  opacity: number;
  plane: CasePlane;
  textureUri: string;
  axisIndex: number;
}) {
  const loadedTexture = useLoader(SliceTextureLoader, textureUri) as THREE.Texture;
  const crop = normalizeSliceCrop(manifest.sliceTextureMetadata[plane].crop);
  const texture = useMemo(() => {
    const nextTexture = loadedTexture.clone();
    nextTexture.image = loadedTexture.image;
    nextTexture.source = loadedTexture.source;
    nextTexture.colorSpace = THREE.SRGBColorSpace;
    nextTexture.generateMipmaps = false;
    nextTexture.magFilter = THREE.LinearFilter;
    nextTexture.minFilter = THREE.LinearFilter;
    nextTexture.wrapS = THREE.ClampToEdgeWrapping;
    nextTexture.wrapT = THREE.ClampToEdgeWrapping;
    nextTexture.repeat.set(crop.width, crop.height);
    nextTexture.offset.set(crop.x, 1 - crop.y - crop.height);
    nextTexture.needsUpdate = true;
    return nextTexture;
  }, [crop.height, crop.width, crop.x, crop.y, loadedTexture]);
  const pose = useMemo(
    () => getPlanePoseAtAxisIndex(geometry, plane, axisIndex),
    [axisIndex, geometry, plane],
  );
  const position = useMemo(() => new THREE.Vector3(...pose.center), [pose.center]);
  const quaternion = useMemo(() => {
    const matrix = new THREE.Matrix4().makeBasis(
      new THREE.Vector3(...pose.basisU),
      new THREE.Vector3(...pose.basisV),
      new THREE.Vector3(...pose.normal),
    );
    return new THREE.Quaternion().setFromRotationMatrix(matrix);
  }, [pose.basisU, pose.basisV, pose.normal]);

  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);

  return (
    <mesh
      position={position}
      quaternion={quaternion}
      renderOrder={2}
      scale={[pose.widthMm, pose.heightMm, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        depthWrite={false}
        map={texture}
        opacity={opacity}
        side={THREE.DoubleSide}
        toneMapped={false}
        transparent
      />
    </mesh>
  );
}

function TargetMarkers({
  activeTargetIds,
  focusedTarget,
  visibleTargets,
}: {
  activeTargetIds: string[];
  focusedTarget: EnrichedCaseTarget | null;
  visibleTargets: EnrichedCaseTarget[];
}) {
  const activeSet = useMemo(() => new Set(activeTargetIds), [activeTargetIds]);

  return (
    <>
      {visibleTargets.map((target) => {
        const tone = getToneForTarget(target);
        const isActive = activeSet.has(target.id);
        const isFocused = target.id === focusedTarget?.id;
        const radius = isFocused ? 5 : isActive ? 4 : 2.8;

        return (
          <mesh key={target.id} position={target.world.position} renderOrder={3}>
            <sphereGeometry args={[radius, 18, 18]} />
            <meshStandardMaterial
              color={isFocused ? tone.highlight : tone.marker}
              emissive={isFocused ? tone.highlight : tone.fill}
              emissiveIntensity={isFocused ? 0.72 : isActive ? 0.28 : 0.12}
              opacity={isFocused ? 1 : isActive ? 0.95 : 0.68}
              roughness={0.35}
              transparent
            />
          </mesh>
        );
      })}
    </>
  );
}

function CrosshairPoint({ position }: { position: Vector3Tuple }) {
  return (
    <group position={position} renderOrder={4}>
      <mesh>
        <boxGeometry args={[14, 0.9, 0.9]} />
        <meshBasicMaterial color="#F0FAFF" toneMapped={false} />
      </mesh>
      <mesh>
        <boxGeometry args={[0.9, 14, 0.9]} />
        <meshBasicMaterial color="#F0FAFF" toneMapped={false} />
      </mesh>
      <mesh>
        <boxGeometry args={[0.9, 0.9, 14]} />
        <meshBasicMaterial color="#F0FAFF" toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.2, 18, 18]} />
        <meshBasicMaterial color="#C65D32" toneMapped={false} />
      </mesh>
    </group>
  );
}

export function PatientSpaceScene({
  activeTargetIds,
  anatomyUri,
  cameraState,
  focusedTarget,
  manifest,
  planeStates,
  viewerOpacity,
  viewerVisibility,
  visibleTargets,
}: PatientSpaceSceneProps) {
  const patientToSceneMatrix = useMemo(
    () => toThreeMatrix4(manifest.patientToScene.matrix),
    [manifest.patientToScene.matrix],
  );

  return (
    <>
      <color attach="background" args={['#E6DDD1']} />
      <ambientLight color="#FFF3E2" intensity={1.2} />
      <directionalLight color="#FFFFFF" intensity={1.1} position={[1.2, 1.6, 1.8]} />
      <directionalLight color="#AFC3D4" intensity={0.65} position={[-1.3, 0.8, 1.1]} />
      <CameraRig {...cameraState} />
      <group matrixAutoUpdate={false} matrix={patientToSceneMatrix}>
        <Suspense fallback={null}>
          <AnatomyModel
            activeTargetIds={activeTargetIds}
            anatomyUri={anatomyUri}
            focusedTarget={focusedTarget}
            manifest={manifest}
            opacity={viewerOpacity.anatomy}
            visible={viewerVisibility.anatomy}
            visibleTargets={visibleTargets}
          />
        </Suspense>
        {(['axial', 'coronal', 'sagittal'] as CasePlane[]).map((plane) => {
          const planeState = planeStates[plane];

          if (!viewerVisibility[plane] || !planeState.textureUri) {
            return null;
          }

          return (
            <Suspense key={plane} fallback={null}>
              <SlicePlane
                axisIndex={planeState.axisIndex}
                geometry={manifest.volumeGeometry}
                manifest={manifest}
                opacity={viewerOpacity[plane]}
                plane={plane}
                textureUri={planeState.textureUri}
              />
            </Suspense>
          );
        })}
        <TargetMarkers
          activeTargetIds={activeTargetIds}
          focusedTarget={focusedTarget}
          visibleTargets={visibleTargets}
        />
        {focusedTarget ? <CrosshairPoint position={focusedTarget.world.position} /> : null}
      </group>
    </>
  );
}
