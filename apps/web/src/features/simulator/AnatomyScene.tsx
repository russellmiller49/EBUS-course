import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { simulatorCaseAssetUrl } from './paths';
import { cephalicImageAxis, sectorPlaneNormal, toVector, type SimulatorProbePose } from './pose';
import type {
  SimulatorCaseManifest,
  SimulatorCleanModelAsset,
  SimulatorCutPlaneCalibrationPoint,
  SimulatorCutPlaneCtSnapshot,
  SimulatorLayerState,
  SimulatorLoadedAssets,
  SimulatorPreset,
  SimulatorScopeModelAsset,
} from './types';

const GLB_SCENE_TO_WEB_MM_MATRIX = new THREE.Matrix4().set(
  1000,
  0,
  0,
  0,
  0,
  1000,
  0,
  0,
  0,
  0,
  1000,
  0,
  0,
  0,
  0,
  1,
);
const AIRWAY_TRANSLUCENCY_REDUCTION = 0.15;

type GlbAsset = Pick<SimulatorCleanModelAsset, 'asset'> | Pick<SimulatorScopeModelAsset, 'asset'>;

const glbModelCache = new Map<string, Promise<THREE.Group>>();

function loadGlbModel(asset: GlbAsset): Promise<THREE.Group> {
  const url = simulatorCaseAssetUrl(asset.asset);
  const cached = glbModelCache.get(url);

  if (cached) {
    return cached;
  }

  const loader = new GLTFLoader();
  const promise = loader.loadAsync(url).then((gltf) => gltf.scene);
  glbModelCache.set(url, promise);
  return promise;
}

function primaryCleanModel(caseData: SimulatorCaseManifest): SimulatorCleanModelAsset | null {
  const models = caseData.assets.clean_models ?? [];
  return models.find((asset) => asset.primary) ?? models[0] ?? null;
}

function normalizedAnatomyName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanModelStructureId(name: string): string {
  const normalized = normalizedAnatomyName(name);

  if (!normalized) {
    return 'context';
  }

  if (normalized === 'airway') {
    return 'airway_wall';
  }

  if (normalized.startsWith('station ')) {
    return normalized.replace('station ', 'station_').replace(/\s+/g, '').toLowerCase();
  }

  const exact: Record<string, string> = {
    'left atrial appendage': 'atrial_appendage_left',
    'azygous vein': 'azygous',
    'superior vena cava': 'superior_vena_cava',
  };

  return exact[normalized] ?? normalized.replace(/\s+/g, '_');
}

function cleanModelLayer(structureId: string): keyof SimulatorLayerState {
  if (structureId === 'airway_wall') {
    return 'airway';
  }

  if (structureId.startsWith('station_')) {
    return 'stations';
  }

  if (structureId.includes('atrium') || structureId.includes('ventricle') || structureId.includes('appendage')) {
    return 'heart';
  }

  if (
    structureId.includes('artery') ||
    structureId.includes('vein') ||
    structureId.includes('venous') ||
    structureId.includes('cava') ||
    structureId.includes('aorta') ||
    structureId.includes('azygous') ||
    structureId.includes('trunk')
  ) {
    return 'vessels';
  }

  return 'context';
}

function cleanModelColor(structureId: string, colorMap: Record<string, string>): string {
  if (structureId === 'airway_wall') {
    return colorMap.airway ?? '#22c7c9';
  }

  if (structureId.startsWith('station_')) {
    return colorMap.lymph_node ?? colorMap.station ?? '#93c56f';
  }

  if (colorMap[structureId]) {
    return colorMap[structureId];
  }

  if (structureId.includes('artery') || structureId.includes('aorta') || structureId.includes('trunk')) {
    return '#d13f3f';
  }

  if (structureId.includes('vein') || structureId.includes('venous') || structureId.includes('cava')) {
    return '#2276c9';
  }

  if (structureId.includes('esophagus')) {
    return '#b79667';
  }

  return '#7b8587';
}

function cleanModelOpacity(layer: keyof SimulatorLayerState, highlighted: boolean, teachingView: boolean): number {
  const airwayOpacity = (opacity: number) => opacity + (1 - opacity) * AIRWAY_TRANSLUCENCY_REDUCTION;

  if (teachingView && !highlighted) {
    const muted: Partial<Record<keyof SimulatorLayerState, number>> = {
      airway: airwayOpacity(0.1),
      vessels: 0.12,
      heart: 0.22,
      stations: 0.08,
      context: 0.04,
    };
    return muted[layer] ?? 0.06;
  }

  if (highlighted) {
    if (layer === 'airway') {
      return airwayOpacity(0.22);
    }

    if (layer === 'heart') {
      return 0.62;
    }

    return layer === 'context' ? 0.42 : 0.74;
  }

  const opacityByLayer: Partial<Record<keyof SimulatorLayerState, number>> = {
    airway: airwayOpacity(0.16),
    vessels: 0.58,
    heart: 0.48,
    stations: 0.36,
    context: 0.16,
  };

  return opacityByLayer[layer] ?? 0.5;
}

function withClipping<T extends THREE.Material>(material: T, clippingPlanes: THREE.Plane[] | null): T {
  if (clippingPlanes) {
    material.clippingPlanes = clippingPlanes;
  }

  return material;
}

function isTeachingFocus(
  structureId: string,
  selectedPreset: SimulatorPreset,
  intersectedStructureIds: Set<string>,
  activeStructure: string | null,
): boolean {
  return (
    structureId === 'airway_wall' ||
    structureId === selectedPreset.station_key ||
    activeStructure === structureId ||
    intersectedStructureIds.has(structureId)
  );
}

function disposeMaterial(material: THREE.Material | THREE.Material[] | undefined): void {
  if (Array.isArray(material)) {
    material.forEach((item) => item.dispose());
    return;
  }

  material?.dispose();
}

function createFanGeometry(apex: THREE.Vector3, left: THREE.Vector3, right: THREE.Vector3): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry().setFromPoints([apex, left, right]);
  geometry.setIndex([0, 1, 2]);
  geometry.setAttribute(
    'uv',
    new THREE.Float32BufferAttribute(
      [
        0.5, 0.93,
        0.1, 0.08,
        0.9, 0.08,
      ],
      2,
    ),
  );
  geometry.computeVertexNormals();
  return geometry;
}

function lpsToWebVector(vector: THREE.Vector3): THREE.Vector3 {
  return new THREE.Vector3(vector.x, vector.z, -vector.y);
}

function cutPlaneSnapshotVector(snapshot: SimulatorCutPlaneCtSnapshot, value: [number, number, number]): THREE.Vector3 {
  const vector = toVector(value);
  return snapshot.coordinate_frame === 'web_xyz_mm_from_lps' ? vector : lpsToWebVector(vector);
}

function cutPlaneBasis(snapshot: SimulatorCutPlaneCtSnapshot) {
  return {
    center: cutPlaneSnapshotVector(snapshot, snapshot.plane_center),
    xAxis: cutPlaneSnapshotVector(snapshot, snapshot.x_axis).normalize(),
    yAxis: cutPlaneSnapshotVector(snapshot, snapshot.y_axis).normalize(),
  };
}

function cutPlanePointAt(snapshot: SimulatorCutPlaneCtSnapshot, xMm: number, yMm: number): THREE.Vector3 {
  const { center, xAxis, yAxis } = cutPlaneBasis(snapshot);
  return center.clone().add(xAxis.clone().multiplyScalar(xMm)).add(yAxis.clone().multiplyScalar(yMm));
}

function cutPlaneCorners(snapshot: SimulatorCutPlaneCtSnapshot): THREE.Vector3[] {
  const { center, xAxis, yAxis } = cutPlaneBasis(snapshot);
  const [xMin, xMax] = snapshot.x_range_mm;
  const [yMin, yMax] = snapshot.y_range_mm;

  return [
    center.clone().add(xAxis.clone().multiplyScalar(xMin)).add(yAxis.clone().multiplyScalar(yMin)),
    center.clone().add(xAxis.clone().multiplyScalar(xMax)).add(yAxis.clone().multiplyScalar(yMin)),
    center.clone().add(xAxis.clone().multiplyScalar(xMax)).add(yAxis.clone().multiplyScalar(yMax)),
    center.clone().add(xAxis.clone().multiplyScalar(xMin)).add(yAxis.clone().multiplyScalar(yMax)),
  ];
}

function createCutPlaneGeometry(snapshot: SimulatorCutPlaneCtSnapshot): THREE.BufferGeometry {
  const [bottomLeft, bottomRight, topRight, topLeft] = cutPlaneCorners(snapshot);
  const geometry = new THREE.BufferGeometry().setFromPoints([bottomLeft, bottomRight, topRight, topLeft]);
  geometry.setIndex([0, 1, 2, 0, 2, 3]);
  geometry.setAttribute(
    'uv',
    new THREE.Float32BufferAttribute(
      [
        0, 0,
        1, 0,
        1, 1,
        0, 1,
      ],
      2,
    ),
  );
  geometry.computeVertexNormals();
  return geometry;
}

function createCutPlaneFrameGeometry(snapshot: SimulatorCutPlaneCtSnapshot): THREE.BufferGeometry {
  return new THREE.BufferGeometry().setFromPoints(cutPlaneCorners(snapshot));
}

function createCutPlaneCrosshairGeometry(snapshot: SimulatorCutPlaneCtSnapshot, halfLengthMm: number): THREE.BufferGeometry {
  const { center, xAxis, yAxis } = cutPlaneBasis(snapshot);
  return new THREE.BufferGeometry().setFromPoints([
    center.clone().add(xAxis.clone().multiplyScalar(-halfLengthMm)),
    center.clone().add(xAxis.clone().multiplyScalar(halfLengthMm)),
    center.clone().add(yAxis.clone().multiplyScalar(-halfLengthMm)),
    center.clone().add(yAxis.clone().multiplyScalar(halfLengthMm)),
  ]);
}

function createCutPlaneCalibrationGeometry(
  snapshot: SimulatorCutPlaneCtSnapshot,
  point: SimulatorCutPlaneCalibrationPoint,
  halfLengthMm: number,
): THREE.BufferGeometry {
  const { xAxis, yAxis } = cutPlaneBasis(snapshot);
  const center = cutPlanePointAt(snapshot, point.plane_mm[0], point.plane_mm[1]);
  return new THREE.BufferGeometry().setFromPoints([
    center.clone().add(xAxis.clone().multiplyScalar(-halfLengthMm)),
    center.clone().add(xAxis.clone().multiplyScalar(halfLengthMm)),
    center.clone().add(yAxis.clone().multiplyScalar(-halfLengthMm)),
    center.clone().add(yAxis.clone().multiplyScalar(halfLengthMm)),
  ]);
}

function createCutPlaneLineMaterial(color: string, opacity: number): THREE.LineBasicMaterial {
  return new THREE.LineBasicMaterial({
    color,
    depthTest: false,
    depthWrite: false,
    opacity,
    transparent: true,
  });
}

function axisVector(axis: string | undefined, fallback: THREE.Vector3): THREE.Vector3 {
  const normalized = axis?.trim().toLowerCase();
  const sign = normalized?.startsWith('-') ? -1 : 1;
  const key = normalized?.replace(/^[+-]/, '');

  if (key === 'x') {
    return new THREE.Vector3(sign, 0, 0);
  }

  if (key === 'y') {
    return new THREE.Vector3(0, sign, 0);
  }

  if (key === 'z') {
    return new THREE.Vector3(0, 0, sign);
  }

  return fallback.clone().normalize();
}

function scopePoseQuaternion(pose: SimulatorProbePose, scopeModel: SimulatorScopeModelAsset): THREE.Quaternion {
  const depthAxis = pose.depthAxis.clone().normalize();
  const shaftAxis = scopeModel.lock_to_fan ? cephalicImageAxis(pose) : pose.tangent.clone().normalize();
  const lateralAxis = scopeModel.lock_to_fan
    ? new THREE.Vector3().crossVectors(depthAxis, shaftAxis).normalize()
    : pose.lateralAxis.clone().normalize();
  const worldBasis = new THREE.Matrix4().makeBasis(lateralAxis, depthAxis, shaftAxis);
  const modelBasis = new THREE.Matrix4().makeBasis(
    axisVector(scopeModel.lateral_axis, new THREE.Vector3(1, 0, 0)),
    axisVector(scopeModel.depth_axis, new THREE.Vector3(0, 1, 0)),
    axisVector(scopeModel.shaft_axis, new THREE.Vector3(0, 0, 1)),
  );

  return new THREE.Quaternion().setFromRotationMatrix(worldBasis.multiply(modelBasis.invert()));
}

function anchorCoordinate(minimum: number, maximum: number, mode: 'min' | 'center' | 'max' | undefined): number {
  if (mode === 'min') {
    return minimum;
  }

  if (mode === 'max') {
    return maximum;
  }

  return (minimum + maximum) / 2;
}

function scopeFanApexAnchorLocal(model: THREE.Group, scopeModel: SimulatorScopeModelAsset): THREE.Vector3 {
  if (scopeModel.fan_apex_anchor_point) {
    return toVector(scopeModel.fan_apex_anchor_point);
  }

  const bounds = new THREE.Box3().setFromObject(model);
  if (bounds.isEmpty()) {
    return new THREE.Vector3();
  }

  const anchor = scopeModel.fan_apex_anchor ?? {};
  return new THREE.Vector3(
    anchorCoordinate(bounds.min.x, bounds.max.x, anchor.x),
    anchorCoordinate(bounds.min.y, bounds.max.y, anchor.y),
    anchorCoordinate(bounds.min.z, bounds.max.z, anchor.z),
  );
}

function prepareScopeModel(
  template: THREE.Group,
  pose: SimulatorProbePose,
  scopeModel: SimulatorScopeModelAsset,
): THREE.Group {
  const model = template.clone(true);
  const apexAnchorLocal = scopeFanApexAnchorLocal(model, scopeModel);
  const poseQuaternion = scopePoseQuaternion(pose, scopeModel);
  const scale = Number.isFinite(scopeModel.scale_mm_per_unit) ? scopeModel.scale_mm_per_unit : 44;
  const apexAnchorOffset = apexAnchorLocal.clone().multiplyScalar(scale).applyQuaternion(poseQuaternion);

  model.name = `scope-model:${scopeModel.key}`;
  model.quaternion.copy(poseQuaternion);
  model.scale.setScalar(scale);
  model.position.copy(pose.position.clone().sub(apexAnchorOffset));
  model.traverse((object) => {
    const mesh = object as THREE.Mesh;

    if (!mesh.isMesh) {
      return;
    }

    if (!mesh.geometry.getAttribute('normal')) {
      mesh.geometry.computeVertexNormals();
    }

    mesh.userData.sharedAssetGeometry = true;
    mesh.renderOrder = 8;
  });

  return model;
}

export function AnatomyScene({
  activeStructure,
  assets,
  cameraPose,
  caseData,
  intersectedStructureIds,
  layers,
  pose,
  selectedPreset,
  ctCutPlaneImageUrl,
  ctCutPlaneSnapshot,
  teachingView,
}: {
  activeStructure: string | null;
  assets: SimulatorLoadedAssets;
  cameraPose: SimulatorProbePose;
  caseData: SimulatorCaseManifest;
  intersectedStructureIds: Set<string>;
  layers: SimulatorLayerState;
  pose: SimulatorProbePose;
  selectedPreset: SimulatorPreset;
  ctCutPlaneImageUrl?: string | null;
  ctCutPlaneSnapshot?: SimulatorCutPlaneCtSnapshot | null;
  teachingView: boolean;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor('#101416', 1);
    container.replaceChildren(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog('#101416', 360, 780);

    const boundsCenter = toVector(caseData.bounds.center);
    const size = toVector(caseData.bounds.size);
    const sceneRadius = Math.max(size.x, size.y, size.z, 180);
    const focus = cameraPose.position.clone().add(cameraPose.depthAxis.clone().multiplyScalar(15));
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, sceneRadius * 8);
    camera.position.copy(
      focus
        .clone()
        .add(cameraPose.lateralAxis.clone().multiplyScalar(92))
        .add(cameraPose.depthAxis.clone().multiplyScalar(-118))
        .add(cameraPose.tangent.clone().multiplyScalar(58))
        .add(new THREE.Vector3(0, 54, 0)),
    );
    camera.lookAt(focus);

    const cutPlane = layers.cutPlane
      ? new THREE.Plane().setFromNormalAndCoplanarPoint(sectorPlaneNormal(pose), pose.position)
      : null;
    if (cutPlane && cutPlane.distanceToPoint(camera.position) > 0) {
      cutPlane.negate();
    }
    const anatomyClippingPlanes = cutPlane ? [cutPlane] : null;
    renderer.localClippingEnabled = Boolean(anatomyClippingPlanes);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(focus);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.55;
    controls.zoomSpeed = 0.8;

    scene.add(new THREE.AmbientLight('#f2f7ef', 1.75));
    const light = new THREE.DirectionalLight('#ffffff', 2);
    light.position.copy(boundsCenter.clone().add(new THREE.Vector3(100, 160, 120)));
    scene.add(light);

    const cleanModel = primaryCleanModel(caseData);
    let cancelled = false;
    let ctCutPlaneTexture: THREE.Texture | null = null;

    if (cleanModel) {
      loadGlbModel(cleanModel)
        .then((template) => {
          if (cancelled) {
            return;
          }

          const model = template.clone(true);
          model.name = `clean-model:${cleanModel.key}`;
          model.applyMatrix4(GLB_SCENE_TO_WEB_MM_MATRIX);
          let visibleMeshCount = 0;
          model.traverse((object) => {
            const mesh = object as THREE.Mesh;

            if (!mesh.isMesh) {
              return;
            }

            const structureId = cleanModelStructureId(mesh.name || mesh.parent?.name || '');
            const layer = cleanModelLayer(structureId);
            mesh.visible = Boolean(layers[layer]);

            if (!mesh.visible) {
              return;
            }

            visibleMeshCount += 1;
            if (!mesh.geometry.getAttribute('normal')) {
              mesh.geometry.computeVertexNormals();
            }

            const highlighted = isTeachingFocus(structureId, selectedPreset, intersectedStructureIds, activeStructure);
            mesh.userData.sharedAssetGeometry = true;
            mesh.material = withClipping(
              new THREE.MeshBasicMaterial({
                color: cleanModelColor(structureId, caseData.color_map),
                depthWrite: false,
                opacity: cleanModelOpacity(layer, highlighted, teachingView),
                side: THREE.DoubleSide,
                transparent: true,
              }),
              anatomyClippingPlanes,
            );
            mesh.userData.generatedMaterial = true;
            mesh.renderOrder = layer === 'airway' || layer === 'context' ? 0 : 1;
          });
          scene.add(model);
          container.dataset.cleanMeshCount = String(visibleMeshCount);
        })
        .catch((loadError) => {
          console.error('Failed to load simulator anatomy model', loadError);
        });
    }

    if (!cleanModel && layers.airway) {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(assets.airway.vertices.flat(), 3));
      geometry.setIndex(assets.airway.triangles.flat());
      geometry.computeVertexNormals();
      scene.add(
        new THREE.Mesh(
          geometry,
          withClipping(
            new THREE.MeshStandardMaterial({
              color: caseData.color_map.airway ?? '#22c7c9',
              metalness: 0.02,
              opacity: 0.34 + (1 - 0.34) * AIRWAY_TRANSLUCENCY_REDUCTION,
              roughness: 0.66,
              side: THREE.DoubleSide,
              transparent: true,
            }),
            anatomyClippingPlanes,
          ),
        ),
      );
    }

    if (layers.centerline) {
      const group = new THREE.Group();
      for (const polyline of assets.centerlines.polylines) {
        const geometry = new THREE.BufferGeometry().setFromPoints(polyline.points.map(toVector));
        const material = withClipping(
          new THREE.LineBasicMaterial({
            color: polyline.line_index === selectedPreset.line_index ? '#eef4f2' : '#56666a',
            opacity: polyline.line_index === selectedPreset.line_index ? 0.82 : 0.28,
            transparent: true,
          }),
          anatomyClippingPlanes,
        );
        group.add(new THREE.Line(geometry, material));
      }
      scene.add(group);
    }

    if (!cleanModel && layers.stations) {
      for (const station of caseData.assets.stations) {
        const points = assets.stations[station.key]?.points ?? [];
        if (!points.length) {
          continue;
        }

        const highlighted = isTeachingFocus(station.key, selectedPreset, intersectedStructureIds, activeStructure);
        scene.add(
          new THREE.Points(
            new THREE.BufferGeometry().setFromPoints(points.map(toVector)),
            withClipping(
              new THREE.PointsMaterial({
                color: station.color,
                depthWrite: false,
                opacity: highlighted ? 0.9 : teachingView ? 0.1 : 0.48,
                size: highlighted ? 2.5 : 1.55,
                transparent: true,
              }),
              anatomyClippingPlanes,
            ),
          ),
        );
      }
    }

    if (!cleanModel && layers.vessels) {
      for (const vessel of caseData.assets.vessels) {
        const points = assets.vessels[vessel.key]?.points ?? [];
        if (!points.length) {
          continue;
        }

        const highlighted = isTeachingFocus(vessel.key, selectedPreset, intersectedStructureIds, activeStructure);
        scene.add(
          new THREE.Points(
            new THREE.BufferGeometry().setFromPoints(points.map(toVector)),
            withClipping(
              new THREE.PointsMaterial({
                color: vessel.color,
                depthWrite: false,
                opacity: highlighted ? 0.9 : teachingView ? 0.12 : 0.4,
                size: highlighted ? 2.25 : 1.2,
                transparent: true,
              }),
              anatomyClippingPlanes,
            ),
          ),
        );
      }
    }

    if (layers.nodes) {
      for (const node of caseData.anatomy.nodes) {
        const active =
          isTeachingFocus(node.station_key, selectedPreset, intersectedStructureIds, activeStructure) ||
          activeStructure === node.key;
        const sphere = new THREE.Mesh(
          new THREE.SphereGeometry(active ? node.radius_mm * 1.1 : node.radius_mm, 18, 12),
          withClipping(
            new THREE.MeshStandardMaterial({
              color: node.color,
              opacity: active ? 0.94 : teachingView ? 0.08 : 0.46,
              roughness: 0.5,
              transparent: true,
            }),
            anatomyClippingPlanes,
          ),
        );
        sphere.position.copy(toVector(node.position));
        scene.add(sphere);
      }
    }

    const scopeGroup = new THREE.Group();
    const scopeModel = caseData.assets.scope_model ?? null;
    if (!scopeModel || scopeModel.show_auxiliary_shaft !== false) {
      const shaftStart = pose.position.clone().add(pose.tangent.clone().multiplyScalar(-22));
      const shaftEnd = pose.position.clone().add(pose.tangent.clone().multiplyScalar(34));
      scopeGroup.add(
        new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([shaftStart, shaftEnd]),
          new THREE.LineBasicMaterial({ color: '#f5e4c8' }),
        ),
      );
    }

    if (scopeModel) {
      loadGlbModel(scopeModel)
        .then((template) => {
          if (!cancelled) {
            scopeGroup.add(prepareScopeModel(template, pose, scopeModel));
          }
        })
        .catch((loadError) => {
          console.error('Failed to load simulator scope model', loadError);
        });
    } else {
      const contact = new THREE.Mesh(
        new THREE.SphereGeometry(3.1, 20, 12),
        new THREE.MeshStandardMaterial({ color: '#f5e166', emissive: '#3a2e05', emissiveIntensity: 0.35 }),
      );
      contact.position.copy(pose.position);
      scopeGroup.add(contact);
    }
    scene.add(scopeGroup);

    if (layers.fan || (layers.cutPlane && ctCutPlaneImageUrl)) {
      const maxDepth = caseData.render_defaults.max_depth_mm;
      const fanDepth = maxDepth;
      const halfWidth = fanDepth * Math.tan(THREE.MathUtils.degToRad(caseData.render_defaults.sector_angle_deg / 2));
      const imageAxis = cephalicImageAxis(pose);
      const apex = pose.position;
      const farCenter = apex.clone().add(pose.depthAxis.clone().multiplyScalar(fanDepth));
      const left = farCenter.clone().add(imageAxis.clone().multiplyScalar(-halfWidth));
      const right = farCenter.clone().add(imageAxis.clone().multiplyScalar(halfWidth));
      const fanGeometry = createFanGeometry(apex, left, right);

      if (layers.cutPlane && ctCutPlaneImageUrl && ctCutPlaneSnapshot) {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(
          ctCutPlaneImageUrl,
          (texture) => {
            if (cancelled) {
              texture.dispose();
              return;
            }

            ctCutPlaneTexture = texture;
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.needsUpdate = true;

            const ctCutPlane = new THREE.Mesh(
              createCutPlaneGeometry(ctCutPlaneSnapshot),
              new THREE.MeshBasicMaterial({
                color: '#ffffff',
                depthTest: false,
                depthWrite: false,
                map: texture,
                opacity: 0.86,
                side: THREE.DoubleSide,
                transparent: true,
              }),
            );
            ctCutPlane.name = 'ct-cut-plane-wide-texture';
            ctCutPlane.renderOrder = 20;
            ctCutPlane.userData.generatedMaterial = true;
            scene.add(ctCutPlane);

            const frame = new THREE.LineLoop(
              createCutPlaneFrameGeometry(ctCutPlaneSnapshot),
              createCutPlaneLineMaterial('#f8fbff', 0.94),
            );
            frame.name = 'ct-cut-plane-wide-frame';
            frame.renderOrder = 21;
            frame.userData.generatedMaterial = true;
            scene.add(frame);

            const centerCrosshair = new THREE.LineSegments(
              createCutPlaneCrosshairGeometry(ctCutPlaneSnapshot, 7),
              createCutPlaneLineMaterial('#66ecff', 0.95),
            );
            centerCrosshair.name = 'ct-cut-plane-contact-crosshair';
            centerCrosshair.renderOrder = 22;
            centerCrosshair.userData.generatedMaterial = true;
            scene.add(centerCrosshair);

            const visibleCalibrationPoints = (ctCutPlaneSnapshot.calibration_points ?? []).filter(
              (point) => point.visible,
            );
            visibleCalibrationPoints.forEach((point) => {
              const marker = new THREE.LineSegments(
                createCutPlaneCalibrationGeometry(ctCutPlaneSnapshot, point, 9),
                createCutPlaneLineMaterial('#ffe14a', point.near_plane === false ? 0.72 : 0.96),
              );
              marker.name = `ct-cut-plane-calibration:${point.key}`;
              marker.renderOrder = 23;
              marker.userData.generatedMaterial = true;
              scene.add(marker);
            });

            container.dataset.ctCutPlane = 'loaded';
            container.dataset.ctCutPlaneCoordinateFrame = ctCutPlaneSnapshot.coordinate_frame ?? 'LPS_mm';
            container.dataset.ctCutPlaneFrame = `${ctCutPlaneSnapshot.x_range_mm.join(',')};${ctCutPlaneSnapshot.y_range_mm.join(',')}`;
            container.dataset.ctCutPlaneYAxis = ctCutPlaneSnapshot.y_axis_anatomical_direction ?? 'unknown';
            container.dataset.ctCutPlaneCalibration = visibleCalibrationPoints.map((point) => point.key).join(',');
          },
          undefined,
          () => {
            container.dataset.ctCutPlane = 'error';
          },
        );
      } else {
        container.dataset.ctCutPlane = 'off';
      }

      const fan = new THREE.Mesh(
        fanGeometry,
        new THREE.MeshBasicMaterial({
          color: '#8bd4ff',
          depthWrite: false,
          opacity: layers.cutPlane && ctCutPlaneImageUrl ? 0.1 : layers.cutPlane ? 0.12 : 0.18,
          side: THREE.DoubleSide,
          transparent: true,
        }),
      );
      fan.renderOrder = 5;
      if (layers.fan) {
        scene.add(fan);
      }
      const fanEdge = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([apex, left, right, apex]),
        new THREE.LineBasicMaterial({ color: '#bfe7ff', opacity: 0.72, transparent: true }),
      );
      fanEdge.renderOrder = 6;
      scene.add(fanEdge);
    }

    let frameId = 0;
    const render = () => {
      controls.update();
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(render);
    };
    render();

    const resizeObserver = new ResizeObserver(() => {
      const nextWidth = container.clientWidth || width;
      const nextHeight = container.clientHeight || height;
      renderer.setSize(nextWidth, nextHeight);
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
    });
    resizeObserver.observe(container);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      ctCutPlaneTexture?.dispose();
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry && !mesh.userData.sharedAssetGeometry) {
          mesh.geometry.dispose();
        }
        if (mesh.userData.generatedMaterial) {
          disposeMaterial(mesh.material);
        }
      });
    };
  }, [
    activeStructure,
    assets,
    cameraPose,
    caseData,
    intersectedStructureIds,
    layers,
    pose,
    selectedPreset,
    ctCutPlaneImageUrl,
    ctCutPlaneSnapshot,
    teachingView,
  ]);

  return (
    <div
      className="simulator-scene-canvas"
      data-clean-model={primaryCleanModel(caseData)?.asset ?? ''}
      data-ct-cut-plane-image={ctCutPlaneImageUrl ?? ''}
      data-fan-depth-axis={pose.depthAxis.toArray().map((value) => value.toFixed(3)).join(',')}
      data-fan-image-axis={cephalicImageAxis(pose).toArray().map((value) => value.toFixed(3)).join(',')}
      data-scope-model={caseData.assets.scope_model?.asset ?? ''}
      ref={containerRef}
    />
  );
}
