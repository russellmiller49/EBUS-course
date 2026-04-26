import { useEffect, useMemo, useState } from 'react';

import { useLearnerProgress } from '@/lib/progress';

import { AnatomyScene } from './AnatomyScene';
import { clamp, computeSimulatorPose, projectToSector, type SimulatorProbePose } from './pose';
import { SectorView } from './SectorView';
import { resolveSimulatorSectorSource, shouldUseSnapshotSectorItems, simulatorSectorSourceLabel } from './sectorSource';
import { formatSimulatorStation } from './stationIds';
import './simulator.css';
import type {
  SimulatorCaseManifest,
  SimulatorLayerState,
  SimulatorLoadedAssets,
  SimulatorPreset,
  SimulatorSectorItem,
  SimulatorSectorRasterMask,
  SimulatorVolumeSectorLabel,
  Vec2,
  Vec3,
} from './types';
import { useSimulatorCase, useSimulatorSectorSnapshot } from './useSimulatorCase';

const SIMULATOR_STATE_STORAGE_KEY = 'socal-ebus-prep:simulator-state:v1';
const SNAP_TARGET_SLAB_HALF_THICKNESS_MM = 18;
const LIVE_CAPTURE_HALF_THICKNESS_MM = {
  node: 6,
  vessel: 18,
} as const;
const LIVE_KERNEL_SIGMA_MM = {
  node: 3,
  vessel: 5,
} as const;
const LIVE_CORE_WEIGHT_THRESHOLD = {
  node: 0.35,
  vessel: 0.28,
} as const;
const LIVE_MINIMUM_POINTS = {
  node: 8,
  vessel: 6,
} as const;
const LIVE_MINIMUM_CORE_POINTS = {
  node: 4,
  vessel: 3,
} as const;
const LIVE_PLANE_INTERSECTION_EPSILON_MM = {
  node: 0.5,
  vessel: 0.5,
} as const;
const LIVE_PLANE_RENDER_HALF_THICKNESS_MM = {
  node: 18,
  vessel: 42,
} as const;
const LIVE_PLANE_RENDER_SIGMA_MM = {
  node: 8,
  vessel: 16,
} as const;
const LIVE_NEAR_PLANE_SIGMA_MM = {
  node: 1.8,
  vessel: 2.4,
} as const;
const LIVE_PLANE_RENDER_RADIUS_PX = {
  node: 4.8,
  vessel: 4.2,
} as const;

const DEFAULT_LAYERS: SimulatorLayerState = {
  airway: true,
  vessels: true,
  heart: true,
  nodes: false,
  stations: true,
  context: false,
  centerline: false,
  fan: true,
  cutPlane: true,
};

const SIMULATOR_LAYER_LABELS: Record<keyof SimulatorLayerState, string> = {
  airway: 'airway',
  vessels: 'vessels',
  heart: 'heart',
  nodes: 'nodes',
  stations: 'Lymph nodes',
  context: 'context',
  centerline: 'centerline',
  fan: 'fan',
  cutPlane: 'cut plane',
};

const VIEWABLE_LAYER_KEYS: Array<keyof SimulatorLayerState> = [
  'airway',
  'vessels',
  'heart',
  'stations',
  'context',
  'fan',
  'cutPlane',
];

interface PersistedSimulatorState {
  layers?: Partial<SimulatorLayerState>;
  lineIndex?: number;
  rollDeg?: number;
  sMm?: number;
  selectedKey?: string;
  teachingView?: boolean;
}

function readPersistedState(): PersistedSimulatorState | null {
  try {
    const raw = window.localStorage.getItem(SIMULATOR_STATE_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PersistedSimulatorState) : null;
  } catch {
    return null;
  }
}

function writePersistedState(value: PersistedSimulatorState) {
  try {
    window.localStorage.setItem(SIMULATOR_STATE_STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Local persistence is a convenience for the module, not a runtime requirement.
  }
}

function normalizeSimulatorLayers(layers: Partial<SimulatorLayerState> | null | undefined): SimulatorLayerState {
  return {
    ...DEFAULT_LAYERS,
    ...(layers ?? {}),
    nodes: false,
    centerline: false,
  };
}

function volumeLabelToSectorItem(label: SimulatorVolumeSectorLabel): SimulatorSectorItem {
  return {
    id: label.id,
    label: label.label,
    kind: label.kind,
    color: label.color,
    depthMm: label.depth_mm,
    lateralMm: label.lateral_mm,
    visible: label.visible,
    depthExtentMm: label.depth_extent_mm,
    lateralExtentMm: label.lateral_extent_mm,
    majorAxisMm: label.major_axis_mm,
    minorAxisMm: label.minor_axis_mm,
    majorAxisVectorMm: label.major_axis_vector_mm,
    aspectRatio: label.aspect_ratio,
    contoursMm: label.contours_mm,
    contourCount: label.contour_count,
    contourSource: label.contour_source,
    contourClosed: label.contour_closed,
    hasClosedContour: label.has_closed_contour,
    rasterMask: label.raster_mask,
  };
}

interface ProjectedSectorPoint {
  depthMm: number;
  lateralMm: number;
  outOfPlaneMm: number;
  inPlaneWeight: number;
}

interface FanSectorPoint {
  depthMm: number;
  lateralMm: number;
  outOfPlaneMm: number;
}

function planeProximityWeight(outOfPlaneMm: number, captureHalfThicknessMm: number, kernelSigmaMm: number) {
  const absoluteDistance = Math.abs(outOfPlaneMm);
  const captureRatio = clamp(absoluteDistance / captureHalfThicknessMm, 0, 1);
  const gaussian = Math.exp(-0.5 * (absoluteDistance / kernelSigmaMm) ** 2);
  const edgeTaper = 1 - captureRatio * captureRatio;

  return gaussian * edgeTaper;
}

function rasterCoordinatesForProjectedPoint(
  point: Pick<ProjectedSectorPoint, 'depthMm' | 'lateralMm'>,
  width: number,
  height: number,
  maxDepthMm: number,
  sectorAngleDeg: number,
) {
  if (point.depthMm <= 0.5) {
    return null;
  }

  const halfWidthMm = Math.max(
    point.depthMm * Math.tan((sectorAngleDeg * Math.PI) / 360),
    0.5,
  );
  const x = ((point.lateralMm / halfWidthMm + 1) / 2) * (width - 1);
  const y = (point.depthMm / maxDepthMm) * (height - 1);

  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return null;
  }

  return { x, y };
}

function addWeightedDisc(
  alpha: Float32Array,
  width: number,
  height: number,
  x: number,
  y: number,
  radius: number,
  weight: number,
) {
  if (weight <= 0 || x < -radius || x > width - 1 + radius || y < -radius || y > height - 1 + radius) {
    return;
  }

  const minX = Math.max(0, Math.floor(x - radius));
  const maxX = Math.min(width - 1, Math.ceil(x + radius));
  const minY = Math.max(0, Math.floor(y - radius));
  const maxY = Math.min(height - 1, Math.ceil(y + radius));

  for (let yy = minY; yy <= maxY; yy += 1) {
    for (let xx = minX; xx <= maxX; xx += 1) {
      const dx = (xx - x) / radius;
      const dy = (yy - y) / radius;
      const distanceSq = dx * dx + dy * dy;

      if (distanceSq > 1) {
        continue;
      }

      const falloff = (1 - distanceSq) * (1 - distanceSq);
      const index = yy * width + xx;
      alpha[index] = Math.max(alpha[index], falloff * weight);
    }
  }
}

function hasFanPlaneIntersection(points: FanSectorPoint[], kind: 'node' | 'vessel'): boolean {
  if (points.length < LIVE_MINIMUM_POINTS[kind]) {
    return false;
  }

  const outOfPlaneValues = points.map((point) => point.outOfPlaneMm);
  const minimum = Math.min(...outOfPlaneValues);
  const maximum = Math.max(...outOfPlaneValues);
  const epsilon = LIVE_PLANE_INTERSECTION_EPSILON_MM[kind];

  return minimum <= -epsilon && maximum >= epsilon;
}

function convexHull(points: Vec2[]): Vec2[] {
  if (points.length <= 3) {
    return points;
  }

  const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (origin: Vec2, a: Vec2, b: Vec2) =>
    (a[0] - origin[0]) * (b[1] - origin[1]) - (a[1] - origin[1]) * (b[0] - origin[0]);
  const lower: Vec2[] = [];
  const upper: Vec2[] = [];

  for (const point of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0) {
      lower.pop();
    }
    lower.push(point);
  }

  for (let index = sorted.length - 1; index >= 0; index -= 1) {
    const point = sorted[index];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0) {
      upper.pop();
    }
    upper.push(point);
  }

  return lower.slice(0, -1).concat(upper.slice(0, -1));
}

function smoothAlphaMask(alpha: Float32Array, width: number, height: number) {
  let source = alpha;

  for (let pass = 0; pass < 2; pass += 1) {
    const next = new Float32Array(source.length);

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        let total = 0;
        let weight = 0;

        for (let dy = -1; dy <= 1; dy += 1) {
          const yy = y + dy;
          if (yy < 0 || yy >= height) {
            continue;
          }

          for (let dx = -1; dx <= 1; dx += 1) {
            const xx = x + dx;
            if (xx < 0 || xx >= width) {
              continue;
            }

            const sampleWeight = dx === 0 && dy === 0 ? 4 : dx === 0 || dy === 0 ? 2 : 1;
            total += source[yy * width + xx] * sampleWeight;
            weight += sampleWeight;
          }
        }

        next[y * width + x] = total / Math.max(weight, 1);
      }
    }

    source = next;
  }

  return source;
}

function rasterMaskFromPlaneCrossingPoints(
  points: FanSectorPoint[],
  {
    kind,
    maxDepthMm,
    sectorAngleDeg,
  }: {
    kind: 'node' | 'vessel';
    maxDepthMm: number;
    sectorAngleDeg: number;
  },
): SimulatorSectorRasterMask | null {
  const width = 160;
  const height = 160;
  const negative = new Float32Array(width * height);
  const positive = new Float32Array(width * height);
  const nearPlane = new Float32Array(width * height);
  const searchHalfThicknessMm = LIVE_PLANE_RENDER_HALF_THICKNESS_MM[kind];
  const searchSigmaMm = LIVE_PLANE_RENDER_SIGMA_MM[kind];
  const nearSigmaMm = LIVE_NEAR_PLANE_SIGMA_MM[kind];
  const epsilon = LIVE_PLANE_INTERSECTION_EPSILON_MM[kind];
  const radius = LIVE_PLANE_RENDER_RADIUS_PX[kind];

  for (const point of points) {
    const coordinates = rasterCoordinatesForProjectedPoint(point, width, height, maxDepthMm, sectorAngleDeg);

    if (!coordinates) {
      continue;
    }

    const absoluteDistance = Math.abs(point.outOfPlaneMm);
    if (absoluteDistance > searchHalfThicknessMm) {
      continue;
    }

    const distanceRatio = clamp(absoluteDistance / searchHalfThicknessMm, 0, 1);
    const crossingWeight = Math.exp(-0.5 * (absoluteDistance / searchSigmaMm) ** 2) * (1 - distanceRatio * distanceRatio * 0.55);
    const nearWeight = Math.exp(-0.5 * (absoluteDistance / nearSigmaMm) ** 2);

    if (point.outOfPlaneMm <= -epsilon) {
      addWeightedDisc(negative, width, height, coordinates.x, coordinates.y, radius, crossingWeight);
    } else if (point.outOfPlaneMm >= epsilon) {
      addWeightedDisc(positive, width, height, coordinates.x, coordinates.y, radius, crossingWeight);
    }

    addWeightedDisc(nearPlane, width, height, coordinates.x, coordinates.y, radius * 0.72, nearWeight);
  }

  const smoothedNegative = smoothAlphaMask(negative, width, height);
  const smoothedPositive = smoothAlphaMask(positive, width, height);
  const smoothedNear = smoothAlphaMask(nearPlane, width, height);
  const values = Array.from(smoothedNegative, (_, index) => {
    const crossing = Math.min(smoothedNegative[index], smoothedPositive[index]);
    const near = smoothedNear[index];
    const raw = crossing * 1.9 + near * 0.38;

    if (raw < 0.045) {
      return 0;
    }

    const t = clamp((raw - 0.045) / 0.34, 0, 1);
    const ramp = t * t * (3 - 2 * t);
    return Math.round(ramp * 255);
  });

  if (!values.some((value) => value > 0)) {
    return null;
  }

  return {
    width,
    height,
    alpha: values,
    source: 'browser_point_cloud_plane_crossing',
    depth_samples: height,
    lateral_samples: width,
  };
}

function projectedPointCloudSectorItem({
  color,
  kind,
  label,
  id,
  maxDepthMm,
  points,
  pose,
  sectorAngleDeg,
}: {
  color: string;
  kind: 'node' | 'vessel';
  label: string;
  id: string;
  maxDepthMm: number;
  points: Vec3[];
  pose: SimulatorProbePose;
  sectorAngleDeg: number;
}): SimulatorSectorItem | null {
  const projected: ProjectedSectorPoint[] = [];
  const fanPoints: FanSectorPoint[] = [];
  const captureHalfThicknessMm = LIVE_CAPTURE_HALF_THICKNESS_MM[kind];
  const kernelSigmaMm = LIVE_KERNEL_SIGMA_MM[kind];

  for (const point of points) {
    const fanProjection = projectToSector(point, pose, maxDepthMm, sectorAngleDeg, Number.POSITIVE_INFINITY);

    if (!fanProjection.visible) {
      continue;
    }

    fanPoints.push({
      depthMm: fanProjection.depthMm,
      lateralMm: fanProjection.lateralMm,
      outOfPlaneMm: fanProjection.outOfPlaneMm,
    });

    if (Math.abs(fanProjection.outOfPlaneMm) <= captureHalfThicknessMm) {
      const weight = planeProximityWeight(fanProjection.outOfPlaneMm, captureHalfThicknessMm, kernelSigmaMm);
      projected.push({
        depthMm: fanProjection.depthMm,
        lateralMm: fanProjection.lateralMm,
        outOfPlaneMm: fanProjection.outOfPlaneMm,
        inPlaneWeight: weight,
      });
    }
  }

  if (!hasFanPlaneIntersection(fanPoints, kind)) {
    return null;
  }

  if (projected.length < LIVE_MINIMUM_POINTS[kind]) {
    return null;
  }

  const corePoints = projected.filter((point) => point.inPlaneWeight >= LIVE_CORE_WEIGHT_THRESHOLD[kind]);
  if (corePoints.length < LIVE_MINIMUM_CORE_POINTS[kind]) {
    return null;
  }

  const lateralValues = corePoints.map((point) => point.lateralMm);
  const depthValues = corePoints.map((point) => point.depthMm);
  const meanLateral = lateralValues.reduce((sum, value) => sum + value, 0) / corePoints.length;
  const meanDepth = depthValues.reduce((sum, value) => sum + value, 0) / corePoints.length;
  const lateralExtentMm: [number, number] = [Math.min(...lateralValues), Math.max(...lateralValues)];
  const depthExtentMm: [number, number] = [Math.min(...depthValues), Math.max(...depthValues)];
  const hull = convexHull(corePoints.map((point) => [point.lateralMm, point.depthMm]));
  const rasterMask = rasterMaskFromPlaneCrossingPoints(fanPoints, { kind, maxDepthMm, sectorAngleDeg });

  if (!rasterMask) {
    return null;
  }

  return {
    id,
    label,
    kind,
    color,
    depthMm: meanDepth,
    lateralMm: meanLateral,
    visible: true,
    depthExtentMm,
    lateralExtentMm,
    contoursMm: hull.length >= 3 ? [[...hull, hull[0]]] : undefined,
    contourCount: hull.length >= 3 ? 1 : 0,
    contourSource: 'browser_point_cloud_hull',
    contourClosed: hull.length >= 3 ? [true] : undefined,
    hasClosedContour: hull.length >= 3,
    rasterMask,
  };
}

function isAtSnapshotPose(
  preset: SimulatorPreset,
  activeLineIndex: number,
  sMm: number,
  rollDeg: number,
  caseData: SimulatorCaseManifest,
) {
  return (
    activeLineIndex === preset.line_index &&
    Math.abs(sMm - preset.centerline_s_mm) <= 1 &&
    Math.abs(rollDeg - caseData.render_defaults.roll_deg) <= 0.1
  );
}

export function buildPointCloudSectorItems({
  assets,
  caseData,
  lineIndex,
  pose,
  selectedPreset,
  sMm,
}: {
  assets: SimulatorLoadedAssets;
  caseData: SimulatorCaseManifest;
  lineIndex: number;
  pose: SimulatorProbePose;
  selectedPreset: SimulatorPreset;
  sMm: number;
}): SimulatorSectorItem[] {
  const maxDepth = caseData.render_defaults.max_depth_mm;
  const sectorAngle = caseData.render_defaults.sector_angle_deg;
  const items: SimulatorSectorItem[] = [
    {
      id: 'airway_wall',
      label: 'airway wall',
      kind: 'airway',
      color: caseData.color_map.airway ?? '#22c7c9',
      depthMm: 2,
      lateralMm: 0,
      visible: true,
    },
    {
      id: 'contact_region',
      label: 'contact region',
      kind: 'contact',
      color: '#f5e166',
      depthMm: 0,
      lateralMm: 0,
      visible: true,
    },
  ];

  for (const station of caseData.assets.stations) {
    const stationPoints = assets.stations[station.key]?.points ?? [];
    if (!stationPoints.length) {
      continue;
    }

    const item = projectedPointCloudSectorItem({
      color: caseData.color_map.lymph_node ?? station.color,
      id: station.key,
      kind: 'node',
      label: station.label.replace(' region', ''),
      maxDepthMm: maxDepth,
      points: stationPoints,
      pose,
      sectorAngleDeg: sectorAngle,
    });

    if (!item) {
      continue;
    }

    items.push(item);
  }

  const atStationSnap = lineIndex === selectedPreset.line_index && Math.abs(sMm - selectedPreset.centerline_s_mm) <= 1;

  if (atStationSnap && !items.some((item) => item.kind === 'node')) {
    const nodeProjection = projectToSector(
      selectedPreset.target,
      pose,
      maxDepth,
      sectorAngle,
      SNAP_TARGET_SLAB_HALF_THICKNESS_MM,
    );

    if (nodeProjection.visible) {
      items.push({
        id: selectedPreset.station_key,
        label: 'lymph node',
        kind: 'node',
        color: caseData.color_map.lymph_node ?? '#93c56f',
        ...nodeProjection,
      });
    }
  }

  for (const listed of caseData.assets.vessels) {
    const vessel = assets.vessels[listed.key];

    if (!vessel) {
      continue;
    }

    const item = projectedPointCloudSectorItem({
      color: listed.color,
      id: listed.key,
      kind: 'vessel',
      label: listed.label,
      maxDepthMm: maxDepth,
      points: vessel.points,
      pose,
      sectorAngleDeg: sectorAngle,
    });

    if (!item) {
      continue;
    }

    items.push(item);
  }

  return items.sort((a, b) => {
    const order = { airway: 0, contact: 1, node: 2, vessel: 3 };
    return order[a.kind] - order[b.kind] || a.depthMm - b.depthMm || a.label.localeCompare(b.label);
  });
}

export function SimulatorPage() {
  const { setModuleProgress } = useLearnerProgress();
  const { assets, caseData, error } = useSimulatorCase();
  const [selectedKey, setSelectedKey] = useState('');
  const [lineIndex, setLineIndex] = useState<number | null>(null);
  const [sMm, setSMm] = useState(0);
  const [rollDeg, setRollDeg] = useState(0);
  const [layers, setLayers] = useState<SimulatorLayerState>(DEFAULT_LAYERS);
  const [teachingView, setTeachingView] = useState(true);
  const [activeStructure, setActiveStructure] = useState<string | null>(null);

  const selectedPreset = useMemo(() => {
    if (!caseData?.presets.length) {
      return null;
    }

    return caseData.presets.find((preset) => preset.preset_key === selectedKey) ?? caseData.presets[0];
  }, [caseData, selectedKey]);

  const { snapshot, status: snapshotStatus } = useSimulatorSectorSnapshot(caseData, selectedPreset?.preset_key ?? null);

  useEffect(() => {
    if (!caseData || selectedKey || !caseData.presets.length) {
      return;
    }

    const persisted = readPersistedState();
    const persistedPreset = caseData.presets.find((preset) => preset.preset_key === persisted?.selectedKey);
    const first = persistedPreset ?? caseData.presets[0];
    setSelectedKey(first.preset_key);
    setLineIndex(typeof persisted?.lineIndex === 'number' ? persisted.lineIndex : first.line_index);
    setSMm(typeof persisted?.sMm === 'number' ? persisted.sMm : first.centerline_s_mm);
    setRollDeg(typeof persisted?.rollDeg === 'number' ? persisted.rollDeg : caseData.render_defaults.roll_deg);
    setLayers(normalizeSimulatorLayers(persisted?.layers));
    setTeachingView(typeof persisted?.teachingView === 'boolean' ? persisted.teachingView : true);
  }, [caseData, selectedKey]);

  useEffect(() => {
    if (!selectedPreset) {
      return;
    }

    writePersistedState({
      layers,
      lineIndex: lineIndex ?? selectedPreset.line_index,
      rollDeg,
      sMm,
      selectedKey: selectedPreset.preset_key,
      teachingView,
    });
  }, [layers, lineIndex, rollDeg, sMm, selectedPreset, teachingView]);

  useEffect(() => {
    if (caseData) {
      setModuleProgress('simulator', 35);
    }
  }, [caseData, setModuleProgress]);

  const activePolyline = useMemo(() => {
    if (!assets?.centerlines.polylines.length || !selectedPreset) {
      return null;
    }

    const resolvedLineIndex = lineIndex ?? selectedPreset.line_index;

    return (
      assets.centerlines.polylines.find((polyline) => polyline.line_index === resolvedLineIndex) ??
      assets.centerlines.polylines.find((polyline) => polyline.line_index === selectedPreset.line_index) ??
      assets.centerlines.polylines[0]
    );
  }, [assets, lineIndex, selectedPreset]);

  const pose = useMemo(() => {
    if (!activePolyline || !selectedPreset) {
      return null;
    }

    return computeSimulatorPose(activePolyline, sMm, rollDeg, selectedPreset);
  }, [activePolyline, rollDeg, sMm, selectedPreset]);

  const cameraPose = useMemo(() => {
    if (!activePolyline || !selectedPreset) {
      return null;
    }

    return computeSimulatorPose(activePolyline, sMm, 0, selectedPreset);
  }, [activePolyline, sMm, selectedPreset]);

  const hasCurrentSnapshot = Boolean(selectedPreset && snapshot?.preset_key === selectedPreset.preset_key);
  const atSnapshotPose = Boolean(
    caseData &&
      selectedPreset &&
      activePolyline &&
      hasCurrentSnapshot &&
      isAtSnapshotPose(selectedPreset, activePolyline.line_index, sMm, rollDeg, caseData),
  );
  const sectorSource = resolveSimulatorSectorSource({
    atSnapshotPose,
    hasCurrentSnapshot,
    snapshotStatus,
  });

  const sectorItems = useMemo<SimulatorSectorItem[]>(() => {
    if (!caseData || !assets || !pose || !selectedPreset || !activePolyline) {
      return [];
    }

    const baseItems: SimulatorSectorItem[] = [
      {
        id: 'airway_wall',
        label: 'airway wall',
        kind: 'airway',
        color: caseData.color_map.airway ?? '#22c7c9',
        depthMm: 2,
        lateralMm: 0,
        visible: true,
      },
      {
        id: 'contact_region',
        label: 'contact region',
        kind: 'contact',
        color: '#f5e166',
        depthMm: 0,
        lateralMm: 0,
        visible: true,
      },
    ];

    if (shouldUseSnapshotSectorItems(sectorSource) && snapshot?.preset_key === selectedPreset.preset_key) {
      return [
        ...baseItems,
        ...snapshot.response.sector.labels.map(volumeLabelToSectorItem),
      ].sort((a, b) => {
        const order = { airway: 0, contact: 1, node: 2, vessel: 3 };
        return order[a.kind] - order[b.kind] || a.depthMm - b.depthMm || a.label.localeCompare(b.label);
      });
    }

    return buildPointCloudSectorItems({
      assets,
      caseData,
      lineIndex: activePolyline.line_index,
      pose,
      selectedPreset,
      sMm,
    });
  }, [activePolyline, assets, caseData, pose, sectorSource, selectedPreset, sMm, snapshot]);

  const intersectedStructureIds = useMemo(() => {
    return new Set(
      sectorItems
        .filter((item) => item.visible && (item.kind === 'node' || item.kind === 'vessel'))
        .map((item) => item.id),
    );
  }, [sectorItems]);

  if (error) {
    return (
      <main className="simulator-load-shell">
        <section className="simulator-load-panel">
          <h1>EBUS Simulator</h1>
          <p>{error}</p>
        </section>
      </main>
    );
  }

  if (!caseData || !assets || !selectedPreset || !activePolyline || !pose || !cameraPose) {
    return (
      <main className="simulator-load-shell">
        <section className="simulator-load-panel">
          <h1>EBUS Simulator</h1>
          <p>Loading static case geometry...</p>
        </section>
      </main>
    );
  }

  const snapToPreset = (preset: SimulatorPreset) => {
    setSelectedKey(preset.preset_key);
    setLineIndex(preset.line_index);
    setSMm(preset.centerline_s_mm);
    setRollDeg(caseData.render_defaults.roll_deg);
    setActiveStructure(preset.station_key);
    setModuleProgress('simulator', 55);
  };

  const updateLayer = (key: keyof SimulatorLayerState) => {
    setLayers((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <div className="simulator-page">
      <section className="simulator-intro">
        <div>
          <div className="eyebrow">Static training simulator</div>
          <h1>EBUS Anatomy Correlation Simulator</h1>
          <p>
            Move along a guided airway centerline, snap to curated nodal targets, and correlate the external anatomy view
            with a labeled EBUS-style sector.
          </p>
        </div>
        <aside>
          Simulated anatomy and EBUS-style views are for orientation training only. They are not clinically validated
          diagnostic images.
        </aside>
      </section>

      <section className="simulator-topbar">
        <div>
          <span className="eyebrow">{caseData.case_id}</span>
          <h2>Station {formatSimulatorStation(selectedPreset.station)}</h2>
        </div>
        <div className="simulator-status-strip">
          <span>{selectedPreset.approach}</span>
          <span>{Math.round(sMm)} mm</span>
          <span>{simulatorSectorSourceLabel(sectorSource)}</span>
        </div>
      </section>

      <section className="simulator-control-rail" aria-label="Simulator controls">
        <label>
          <span>Station snap</span>
          <select
            value={selectedPreset.preset_key}
            onChange={(event) => {
              const preset = caseData.presets.find((candidate) => candidate.preset_key === event.target.value);
              if (preset) {
                snapToPreset(preset);
              }
            }}
          >
            {caseData.presets.map((preset) => (
              <option key={preset.preset_key} value={preset.preset_key}>
                {preset.label}
              </option>
            ))}
          </select>
        </label>
        <label className="simulator-wide-control">
          <span>Advance / retract</span>
          <input
            max={activePolyline.total_length_mm}
            min={0}
            onChange={(event) => {
              setSMm(Number(event.target.value));
              setModuleProgress('simulator', 45);
            }}
            step={0.5}
            type="range"
            value={Math.min(Math.max(sMm, 0), activePolyline.total_length_mm)}
          />
        </label>
        <label>
          <span>Roll</span>
          <input
            max={45}
            min={-45}
            onChange={(event) => {
              setRollDeg(Number(event.target.value));
              setModuleProgress('simulator', 45);
            }}
            step={1}
            type="range"
            value={rollDeg}
          />
        </label>
        <div className="simulator-layer-toggles" aria-label="Anatomy layers">
          <label>
            <input checked={teachingView} onChange={() => setTeachingView((current) => !current)} type="checkbox" />
            <span>teaching</span>
          </label>
          {VIEWABLE_LAYER_KEYS.map((key) => (
            <label key={key}>
              <input checked={layers[key]} onChange={() => updateLayer(key)} type="checkbox" />
              <span>{SIMULATOR_LAYER_LABELS[key]}</span>
            </label>
          ))}
        </div>
      </section>

      <div className="simulator-workspace">
        <section className="simulator-scene-pane" aria-label="External anatomy view">
          <div className="simulator-pane-header">
            <div>
              <span className="eyebrow">External anatomy</span>
              <h2>Scope, airway, vessels, lymph nodes, and fan</h2>
            </div>
            <button className="simulator-button" onClick={() => snapToPreset(selectedPreset)} type="button">
              Snap
            </button>
          </div>
          <AnatomyScene
            activeStructure={activeStructure}
            assets={assets}
            cameraPose={cameraPose}
            caseData={caseData}
            intersectedStructureIds={intersectedStructureIds}
            layers={layers}
            pose={pose}
            selectedPreset={selectedPreset}
            teachingView={teachingView}
          />
        </section>

        <SectorView
          activeStructure={activeStructure}
          caseData={caseData}
          items={sectorItems}
          selectedPreset={selectedPreset}
          setActiveStructure={setActiveStructure}
          source={sectorSource}
        />
      </div>
    </div>
  );
}
