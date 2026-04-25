export type Vec2 = [number, number];
export type Vec3 = [number, number, number];

export interface SimulatorMeshAsset {
  vertices: Vec3[];
  triangles: Vec3[];
}

export interface SimulatorPointCloudAsset {
  key: string;
  label: string;
  points: Vec3[];
}

export interface SimulatorCenterlinePolyline {
  line_index: number;
  points: Vec3[];
  cumulative_lengths_mm: number[];
  total_length_mm: number;
}

export interface SimulatorCenterlineAsset {
  primary_line_index: number;
  primary_total_length_mm: number;
  polylines: SimulatorCenterlinePolyline[];
}

export interface SimulatorListedAsset {
  key: string;
  label: string;
  asset: string;
  color: string;
  point_count: number;
}

export interface SimulatorCleanModelAsset {
  key: string;
  label: string;
  asset: string;
  coordinate_frame: string;
  web_transform: string;
  primary?: boolean;
}

export interface SimulatorScopeModelAsset {
  key: string;
  label: string;
  asset: string;
  coordinate_frame: string;
  shaft_axis: string;
  depth_axis: string;
  lateral_axis: string;
  origin: string;
  fan_apex_anchor?: {
    x?: 'min' | 'center' | 'max';
    y?: 'min' | 'center' | 'max';
    z?: 'min' | 'center' | 'max';
  };
  fan_apex_anchor_point?: Vec3 | null;
  scale_mm_per_unit: number;
  lock_to_fan?: boolean;
  show_auxiliary_shaft?: boolean;
}

export interface SimulatorPreset {
  preset_key: string;
  preset_id: string;
  station: string;
  node: string;
  approach: string;
  label: string;
  line_index: number;
  centerline_s_mm: number;
  contact: Vec3;
  target: Vec3;
  target_lps: Vec3;
  station_key: string;
  vessel_overlays: string[];
  contact_to_target_distance_mm: number;
  shaft_axis?: Vec3 | null;
  depth_axis?: Vec3 | null;
  lateral_axis?: Vec3 | null;
}

export interface SimulatorNodeMarker {
  key: string;
  preset_key: string;
  station_key: string;
  label: string;
  position: Vec3;
  radius_mm: number;
  color: string;
}

export interface SimulatorCaseManifest {
  case_id: string;
  render_defaults: {
    sector_angle_deg: number;
    max_depth_mm: number;
    roll_deg: number;
  };
  bounds: {
    min: Vec3;
    max: Vec3;
    center: Vec3;
    size: Vec3;
  };
  assets: {
    airway_mesh: string;
    centerlines: string;
    vessels: SimulatorListedAsset[];
    stations: SimulatorListedAsset[];
    clean_models?: SimulatorCleanModelAsset[];
    scope_model?: SimulatorScopeModelAsset | null;
  };
  navigation: {
    primary_line_index: number;
    primary_total_length_mm: number;
  };
  presets: SimulatorPreset[];
  anatomy: {
    nodes: SimulatorNodeMarker[];
  };
  color_map: Record<string, string>;
  sector_snapshots?: Record<string, string>;
  notes?: Record<string, string>;
}

export interface SimulatorLoadedAssets {
  airway: SimulatorMeshAsset;
  centerlines: SimulatorCenterlineAsset;
  vessels: Record<string, SimulatorPointCloudAsset>;
  stations: Record<string, SimulatorPointCloudAsset>;
}

export interface SimulatorSectorRasterMask {
  width: number;
  height: number;
  alpha: number[];
  source?: string;
  depth_samples?: number;
  lateral_samples?: number;
}

export interface SimulatorVolumeSectorLabel {
  id: string;
  key: string;
  label: string;
  kind: 'node' | 'vessel';
  color: string;
  depth_mm: number;
  lateral_mm: number;
  visible: boolean;
  depth_extent_mm?: [number, number];
  lateral_extent_mm?: [number, number];
  major_axis_mm?: number;
  minor_axis_mm?: number;
  major_axis_vector_mm?: [number, number];
  aspect_ratio?: number;
  contours_mm?: Vec2[][];
  contour_count?: number;
  contour_source?: string;
  contour_closed?: boolean[];
  has_closed_contour?: boolean;
  raster_mask?: SimulatorSectorRasterMask | null;
}

export interface SimulatorVolumeSectorResponse {
  source: 'volume_masks';
  sector: {
    labels: SimulatorVolumeSectorLabel[];
  };
}

export interface SimulatorSectorSnapshot {
  schema_version: 1;
  preset_key: string;
  query: {
    line_index: number;
    s_mm: number;
    roll_deg: number;
    max_depth_mm: number;
    sector_angle_deg: number;
  };
  response: SimulatorVolumeSectorResponse;
}

export interface SimulatorSectorItem {
  id: string;
  label: string;
  kind: 'airway' | 'node' | 'vessel' | 'contact';
  color: string;
  depthMm: number;
  lateralMm: number;
  visible: boolean;
  depthExtentMm?: [number, number];
  lateralExtentMm?: [number, number];
  majorAxisMm?: number;
  minorAxisMm?: number;
  majorAxisVectorMm?: [number, number];
  aspectRatio?: number;
  contoursMm?: Vec2[][];
  contourCount?: number;
  contourSource?: string;
  contourClosed?: boolean[];
  hasClosedContour?: boolean;
  rasterMask?: SimulatorSectorRasterMask | null;
}

export interface SimulatorLayerState {
  airway: boolean;
  vessels: boolean;
  heart: boolean;
  nodes: boolean;
  stations: boolean;
  context: boolean;
  centerline: boolean;
  fan: boolean;
}
