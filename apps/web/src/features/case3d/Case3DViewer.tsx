import { useEffect, useMemo, useReducer, useRef, useState } from 'react';

import { axisNameToIndex } from '../../../../../features/case3d/patient-space';
import type { CasePlane, RuntimeCaseManifest } from '../../../../../features/case3d/types';
import { useCaseOverlay } from './useCaseOverlay';
import { useCasePlanes } from './useCasePlanes';
import { useCaseTargets, getTargetLabel } from './useCaseTargets';
import { useCaseVolume } from './useCaseVolume';
import { VtkViewport } from './VtkViewport';
import { caseViewerReducer, createInitialViewerState } from './viewerState';
import { getCrosshairWorld } from './vtk/coordinateTransforms';
import type { LoadedCaseVolume } from './vtk/loadCaseVolume';
import type { LoadedSegmentation } from './vtk/loadSegmentation';
import type { OrthogonalClipMode } from './viewerState';

interface Case3DViewerProps {
  manifest: RuntimeCaseManifest;
}

const PLANE_LABELS: Record<CasePlane, string> = {
  axial: 'Axial',
  coronal: 'Coronal',
  sagittal: 'Sagittal',
};

const SEGMENT_GROUP_SORT_ORDER: Record<string, number> = {
  airway: 0,
  vessels: 1,
  cardiac: 2,
  gi: 3,
  other: 4,
  nodes: 5,
};
const EMPTY_SEGMENTS: RuntimeCaseManifest['segmentation']['segments'] = [];

function getPlaneAxisSize(manifest: RuntimeCaseManifest, plane: CasePlane) {
  return manifest.volumeGeometry.sizes[axisNameToIndex(manifest.volumeGeometry.axisMap[plane])];
}

function SliceCard({
  manifest,
  plane,
  planeIndex,
  crosshairWorld,
  overlayOpacity,
  segmentationRef,
  selectedSegments,
  showSegmentationOverlay,
  visibleSegments,
  volumeReady,
  volumeRef,
  onPlaneIndexChange,
}: {
  manifest: RuntimeCaseManifest;
  plane: CasePlane;
  planeIndex: number;
  crosshairWorld: [number, number, number];
  overlayOpacity: number;
  segmentationRef: { current: LoadedSegmentation | null };
  selectedSegments: RuntimeCaseManifest['segmentation']['segments'];
  showSegmentationOverlay: boolean;
  visibleSegments: RuntimeCaseManifest['segmentation']['segments'];
  volumeReady: boolean;
  volumeRef: { current: LoadedCaseVolume | null };
  onPlaneIndexChange: (value: number) => void;
}) {
  const axisSize = getPlaneAxisSize(manifest, plane);

  return (
    <article className="case3d-panel">
      <div className="case3d-panel__header">
        <div>
          <div className="eyebrow">Orthogonal CT</div>
          <h3>{PLANE_LABELS[plane]}</h3>
        </div>
      </div>
      <div className="case3d-panel__viewport">
        {volumeReady ? (
          <>
            <VtkViewport
              className="case-vtk-viewport"
              crosshairWorld={crosshairWorld}
              hasSegmentation={showSegmentationOverlay}
              hasVolume={volumeReady}
              manifest={manifest}
              mode="slice"
              overlayOpacity={overlayOpacity}
              plane={plane}
              planeIndex={planeIndex}
              segmentationRef={segmentationRef}
              selectedSegments={showSegmentationOverlay ? selectedSegments : EMPTY_SEGMENTS}
              showSegmentationOverlay={showSegmentationOverlay}
              visible
              visibleSegments={showSegmentationOverlay ? visibleSegments : EMPTY_SEGMENTS}
              volumeRef={volumeRef}
            />
          </>
        ) : (
          <div className="case3d-panel__placeholder">Loading CT volume…</div>
        )}
      </div>
      <label className="case3d-slider">
        <span>
          Slice {planeIndex + 1} / {axisSize}
        </span>
        <input
          max={axisSize - 1}
          min={0}
          onChange={(event) => onPlaneIndexChange(Number(event.target.value))}
          type="range"
          value={planeIndex}
        />
      </label>
    </article>
  );
}

function OrthogonalPlaneControls({
  orthogonalClipMode,
  orthogonalClipPlane,
  orthogonalPlaneOpacity,
  planeVisibility,
  threeDOrthogonalPlanesVisible,
  onOrthogonalClipModeChange,
  onOrthogonalClipPlaneChange,
  onOrthogonalPlaneOpacityChange,
  onPlaneVisibilityChange,
  onThreeDOrthogonalPlanesVisibilityChange,
}: {
  orthogonalClipMode: OrthogonalClipMode;
  orthogonalClipPlane: CasePlane;
  orthogonalPlaneOpacity: number;
  planeVisibility: Record<CasePlane, boolean>;
  threeDOrthogonalPlanesVisible: boolean;
  onOrthogonalClipModeChange: (mode: OrthogonalClipMode) => void;
  onOrthogonalClipPlaneChange: (plane: CasePlane) => void;
  onOrthogonalPlaneOpacityChange: (value: number) => void;
  onPlaneVisibilityChange: (plane: CasePlane, visible: boolean) => void;
  onThreeDOrthogonalPlanesVisibilityChange: (visible: boolean) => void;
}) {
  return (
    <section className="case3d-hero__control-group">
      <div>
        <div className="eyebrow">3D CT</div>
        <h4 className="case3d-hero__control-title">Orthogonal planes</h4>
      </div>
      <p className="case3d-note">3D-only visibility. The slice cards below stay visible.</p>
      <label className="case3d-toggle">
        <input
          checked={threeDOrthogonalPlanesVisible}
          onChange={(event) => onThreeDOrthogonalPlanesVisibilityChange(event.target.checked)}
          type="checkbox"
        />
        <span>Show 3D CT planes</span>
      </label>
      <div className="case3d-toggle-list">
        <label className="case3d-toggle">
          <input
            checked={planeVisibility.axial}
            disabled={!threeDOrthogonalPlanesVisible}
            onChange={(event) => onPlaneVisibilityChange('axial', event.target.checked)}
            type="checkbox"
          />
          <span>Axial</span>
        </label>
        <label className="case3d-toggle">
          <input
            checked={planeVisibility.coronal}
            disabled={!threeDOrthogonalPlanesVisible}
            onChange={(event) => onPlaneVisibilityChange('coronal', event.target.checked)}
            type="checkbox"
          />
          <span>Coronal</span>
        </label>
        <label className="case3d-toggle">
          <input
            checked={planeVisibility.sagittal}
            disabled={!threeDOrthogonalPlanesVisible}
            onChange={(event) => onPlaneVisibilityChange('sagittal', event.target.checked)}
            type="checkbox"
          />
          <span>Sagittal</span>
        </label>
      </div>
      <label className="case3d-slider">
        <span>3D CT plane opacity</span>
        <input
          max={1}
          min={0}
          onChange={(event) => onOrthogonalPlaneOpacityChange(Number(event.target.value))}
          step={0.01}
          type="range"
          value={orthogonalPlaneOpacity}
        />
      </label>
      <label className="case3d-select">
        <span>3D anatomy clipping</span>
        <select
          onChange={(event) => onOrthogonalClipModeChange(event.target.value as OrthogonalClipMode)}
          value={orthogonalClipMode}>
          <option value="none">No clipping</option>
          <option value="hide-above">Hide above CT plane</option>
          <option value="hide-below">Hide below CT plane</option>
        </select>
      </label>
      <label className="case3d-select">
        <span>Clipping plane</span>
        <select
          disabled={orthogonalClipMode === 'none'}
          onChange={(event) => onOrthogonalClipPlaneChange(event.target.value as CasePlane)}
          value={orthogonalClipPlane}>
          <option value="axial">Axial</option>
          <option value="coronal">Coronal</option>
          <option value="sagittal">Sagittal</option>
        </select>
      </label>
    </section>
  );
}

function ThreeDSceneControls({
  cutPlaneOpacity,
  cutPlaneVisible,
  onCutPlaneOpacityChange,
  onCutPlaneVisibilityChange,
  onOrthogonalClipModeChange,
  onOrthogonalClipPlaneChange,
  onOrthogonalPlaneOpacityChange,
  onOverlayOpacityChange,
  onPlaneVisibilityChange,
  onResetCamera,
  onResetCutPlane,
  onThreeDOrthogonalPlanesVisibilityChange,
  orthogonalClipMode,
  orthogonalClipPlane,
  orthogonalPlaneOpacity,
  overlayOpacity,
  planeVisibility,
  threeDOrthogonalPlanesVisible,
}: {
  cutPlaneOpacity: number;
  cutPlaneVisible: boolean;
  onCutPlaneOpacityChange: (value: number) => void;
  onCutPlaneVisibilityChange: (visible: boolean) => void;
  onOrthogonalClipModeChange: (mode: OrthogonalClipMode) => void;
  onOrthogonalClipPlaneChange: (plane: CasePlane) => void;
  onOrthogonalPlaneOpacityChange: (value: number) => void;
  onOverlayOpacityChange: (value: number) => void;
  onPlaneVisibilityChange: (plane: CasePlane, visible: boolean) => void;
  onResetCamera?: () => void;
  onResetCutPlane: () => void;
  onThreeDOrthogonalPlanesVisibilityChange: (visible: boolean) => void;
  orthogonalClipMode: OrthogonalClipMode;
  orthogonalClipPlane: CasePlane;
  orthogonalPlaneOpacity: number;
  overlayOpacity: number;
  planeVisibility: Record<CasePlane, boolean>;
  threeDOrthogonalPlanesVisible: boolean;
}) {
  return (
    <>
      <section className="case3d-hero__control-group">
        <div>
          <div className="eyebrow">3D Anatomy</div>
          <h4 className="case3d-hero__control-title">Surface opacity</h4>
        </div>
        <label className="case3d-slider">
          <span>Anatomy opacity</span>
          <input
            max={1}
            min={0.05}
            onChange={(event) => onOverlayOpacityChange(Number(event.target.value))}
            step={0.01}
            type="range"
            value={overlayOpacity}
          />
        </label>
      </section>

      <section className="case3d-hero__control-group">
        <div>
          <div className="eyebrow">Cut Plane</div>
          <h4 className="case3d-hero__control-title">Arbitrary reslice</h4>
        </div>
        <label className="case3d-toggle">
          <input
            checked={cutPlaneVisible}
            onChange={(event) => onCutPlaneVisibilityChange(event.target.checked)}
            type="checkbox"
          />
          <span>Show cut plane</span>
        </label>
        <label className="case3d-slider">
          <span>Cut-plane opacity</span>
          <input
            max={1}
            min={0.05}
            onChange={(event) => onCutPlaneOpacityChange(Number(event.target.value))}
            step={0.01}
            type="range"
            value={cutPlaneOpacity}
          />
        </label>
        <button className="case3d-button" onClick={onResetCutPlane} type="button">
          Reset cut plane
        </button>
        <p className="case3d-note">
          Drag or rotate the cut plane in the 3D scene. The resliced CT panel below stays locked to that same plane.
        </p>
      </section>

      <OrthogonalPlaneControls
        onOrthogonalClipModeChange={onOrthogonalClipModeChange}
        onOrthogonalClipPlaneChange={onOrthogonalClipPlaneChange}
        onOrthogonalPlaneOpacityChange={onOrthogonalPlaneOpacityChange}
        onPlaneVisibilityChange={onPlaneVisibilityChange}
        onThreeDOrthogonalPlanesVisibilityChange={onThreeDOrthogonalPlanesVisibilityChange}
        orthogonalClipMode={orthogonalClipMode}
        orthogonalClipPlane={orthogonalClipPlane}
        orthogonalPlaneOpacity={orthogonalPlaneOpacity}
        planeVisibility={planeVisibility}
        threeDOrthogonalPlanesVisible={threeDOrthogonalPlanesVisible}
      />

      {onResetCamera ? (
        <button className="case3d-button case3d-button--secondary" onClick={onResetCamera} type="button">
          Reset camera
        </button>
      ) : null}
    </>
  );
}

export function Case3DViewer({ manifest }: Case3DViewerProps) {
  const [state, dispatch] = useReducer(caseViewerReducer, manifest, createInitialViewerState);
  const [resetCameraToken, setResetCameraToken] = useState(0);
  const [fullscreenControlsOpen, setFullscreenControlsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const volumeState = useCaseVolume();
  const volumeRef = useRef<LoadedCaseVolume | null>(null);
  const segmentationRef = useRef<LoadedSegmentation | null>(null);
  const heroViewportRef = useRef<HTMLDivElement | null>(null);

  volumeRef.current = volumeState.ct;
  segmentationRef.current = volumeState.segmentation;
  const { selectedStation, selectedTarget, stationTargets, landmarkTargets } = useCaseTargets(
    manifest,
    state.selectedStationId,
    state.selectedTargetId,
  );
  const crosshairWorld = useMemo(() => getCrosshairWorld(manifest, state.crosshairVoxel), [manifest, state.crosshairVoxel]);
  const { planeIndices } = useCasePlanes(manifest, state.crosshairVoxel, crosshairWorld);
  const { selectedSegmentIds, visibleSegments } = useCaseOverlay(
    manifest,
    state.overlayGroups,
    state.selectedTargetId,
    state.hiddenSegmentIds,
  );
  const selectedSegments = useMemo(
    () => visibleSegments.filter((segment) => selectedSegmentIds.has(segment.id)),
    [selectedSegmentIds, visibleSegments],
  );
  const stationOrder = useMemo(
    () => new Map(manifest.stations.map((station, index) => [station.id, index])),
    [manifest.stations],
  );
  const anatomySegments = useMemo(
    () =>
      manifest.segmentation.segments
        .filter((segment) => segment.groupId !== 'nodes')
        .sort((left, right) => {
          const groupWeight = SEGMENT_GROUP_SORT_ORDER[left.groupId] - SEGMENT_GROUP_SORT_ORDER[right.groupId];

          return groupWeight !== 0 ? groupWeight : left.name.localeCompare(right.name);
        }),
    [manifest.segmentation.segments],
  );
  const nodalSegments = useMemo(
    () =>
      manifest.segmentation.segments
        .filter((segment) => segment.groupId === 'nodes')
        .sort((left, right) => {
          const leftOrder = stationOrder.get(left.stationIds[0] ?? '') ?? Number.MAX_SAFE_INTEGER;
          const rightOrder = stationOrder.get(right.stationIds[0] ?? '') ?? Number.MAX_SAFE_INTEGER;
          return leftOrder !== rightOrder ? leftOrder - rightOrder : left.name.localeCompare(right.name);
        }),
    [manifest.segmentation.segments, stationOrder],
  );
  const nodalSegmentIds = useMemo(() => nodalSegments.map((segment) => segment.id), [nodalSegments]);
  const threeDPlaneVisibility = state.threeDOrthogonalPlanesVisible
    ? state.planeVisibility
    : {
        axial: false,
        coronal: false,
        sagittal: false,
      };

  const stationTargetOptions = stationTargets.length > 0 ? stationTargets : [selectedTarget];

  useEffect(() => {
    const handleFullscreenChange = () => {
      const active = document.fullscreenElement === heroViewportRef.current;
      setIsFullscreen(active);
      setFullscreenControlsOpen(active);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  async function toggleFullscreen() {
    if (!heroViewportRef.current) {
      return;
    }

    if (document.fullscreenElement === heroViewportRef.current) {
      await document.exitFullscreen();
      return;
    }

    await heroViewportRef.current.requestFullscreen();
  }

  const sceneControlProps = {
    cutPlaneOpacity: state.cutPlane.opacity,
    cutPlaneVisible: state.cutPlane.visible,
    onCutPlaneOpacityChange: (value: number) => dispatch({ type: 'set-cut-plane-opacity', value }),
    onCutPlaneVisibilityChange: (visible: boolean) => dispatch({ type: 'set-cut-plane-visibility', visible }),
    onOrthogonalClipModeChange: (mode: OrthogonalClipMode) => dispatch({ type: 'set-orthogonal-clip-mode', mode }),
    onOrthogonalClipPlaneChange: (plane: CasePlane) => dispatch({ type: 'set-orthogonal-clip-plane', plane }),
    onOrthogonalPlaneOpacityChange: (value: number) => dispatch({ type: 'set-three-d-plane-opacity', value }),
    onOverlayOpacityChange: (value: number) => dispatch({ type: 'set-overlay-opacity', value }),
    onPlaneVisibilityChange: (plane: CasePlane, visible: boolean) =>
      dispatch({ type: 'set-plane-visibility', plane, visible }),
    onResetCutPlane: () => dispatch({ type: 'reset-cut-plane' }),
    onThreeDOrthogonalPlanesVisibilityChange: (visible: boolean) =>
      dispatch({ type: 'set-three-d-plane-visibility', visible }),
    orthogonalClipMode: state.orthogonalClip.mode,
    orthogonalClipPlane: state.orthogonalClip.plane,
    orthogonalPlaneOpacity: state.orthogonalPlaneOpacity,
    overlayOpacity: state.overlayOpacity,
    planeVisibility: state.planeVisibility,
    threeDOrthogonalPlanesVisible: state.threeDOrthogonalPlanesVisible,
  } satisfies Parameters<typeof ThreeDSceneControls>[0];

  function setNodalSegmentsVisible(segmentIds: string[], visible: boolean) {
    dispatch({ type: 'set-overlay-group', key: 'nodes', value: true });
    dispatch({ type: 'set-segments-visibility', segmentIds, visible });
  }

  return (
    <div className="page-stack">
      <section className="section-card case3d-layout">
        <div className="case3d-sidebar">
          <article className="case3d-panel case3d-panel--controls">
            <div className="case3d-panel__header">
              <div>
                <div className="eyebrow">Targeting</div>
                <h3>Selectors</h3>
              </div>
            </div>
            <label className="case3d-select">
              <span>Station</span>
              <select
                onChange={(event) => {
                  const station = manifest.stations.find((entry) => entry.id === event.target.value) ?? manifest.stations[0];
                  const target =
                    manifest.targets.find((entry) => entry.id === station.primaryTargetId) ??
                    manifest.targets.find((entry) => entry.stationId === station.id) ??
                    manifest.targets[0];

                  dispatch({
                    type: 'select-station',
                    manifest,
                    stationId: station.id,
                    targetId: target.id,
                    world: target.world.position,
                  });
                }}
                value={selectedStation.id}>
                {manifest.stations.map((station) => (
                  <option key={station.id} value={station.id}>
                    {station.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="case3d-select">
              <span>Target</span>
              <select
                onChange={(event) => {
                  const target = manifest.targets.find((entry) => entry.id === event.target.value) ?? manifest.targets[0];

                  dispatch({
                    type: 'select-target',
                    manifest,
                    stationId: target.stationId ?? selectedStation.id,
                    targetId: target.id,
                    world: target.world.position,
                  });
                }}
                value={selectedTarget.id}>
                {stationTargetOptions.map((target) => (
                  <option key={target.id} value={target.id}>
                    {getTargetLabel(target)}
                  </option>
                ))}
                {landmarkTargets.length > 0 ? <option disabled>──────────</option> : null}
                {landmarkTargets.map((target) => (
                  <option key={target.id} value={target.id}>
                    Landmark · {target.displayLabel}
                  </option>
                ))}
              </select>
            </label>
          </article>

          <article className="case3d-panel case3d-panel--controls">
            <div className="case3d-panel__header">
              <div>
                <div className="eyebrow">Overlay</div>
                <h3>3D anatomy and overlays</h3>
              </div>
            </div>
            <label className="case3d-toggle">
              <input
                checked={state.overlayGroups.allAnatomy}
                onChange={(event) => dispatch({ type: 'set-overlay-group', key: 'allAnatomy', value: event.target.checked })}
                type="checkbox"
              />
              <span>All anatomy</span>
            </label>
            <label className="case3d-toggle">
              <input
                checked={state.overlayGroups.airway}
                onChange={(event) => dispatch({ type: 'set-overlay-group', key: 'airway', value: event.target.checked })}
                type="checkbox"
              />
              <span>Airway</span>
            </label>
            <label className="case3d-toggle">
              <input
                checked={state.overlayGroups.vessels}
                onChange={(event) => dispatch({ type: 'set-overlay-group', key: 'vessels', value: event.target.checked })}
                type="checkbox"
              />
              <span>Vessels and adjacent anatomy</span>
            </label>
            <label className="case3d-toggle">
              <input
                checked={state.overlayGroups.nodes}
                onChange={(event) => dispatch({ type: 'set-overlay-group', key: 'nodes', value: event.target.checked })}
                type="checkbox"
              />
              <span>Nodes</span>
            </label>
            <label className="case3d-toggle">
              <input
                checked={state.sliceSegmentationVisible}
                onChange={(event) =>
                  dispatch({ type: 'set-slice-segmentation-visibility', visible: event.target.checked })
                }
                type="checkbox"
              />
              <span>2D segmentation overlay</span>
            </label>
          </article>

          <article className="case3d-panel case3d-panel--controls">
            <div className="case3d-panel__header">
              <div>
                <div className="eyebrow">Visibility</div>
                <h3>Individual structures</h3>
              </div>
            </div>
            <p className="case3d-note">Group toggles above act as master switches. These checkboxes fine-tune specific structures and lymph nodes.</p>
            <div className="case3d-segment-section">
              <strong className="case3d-segment-section__title">Anatomy structures</strong>
              <div className="case3d-segment-list">
                {anatomySegments.map((segment) => (
                  <label className="case3d-toggle" key={segment.id}>
                    <input
                      checked={!state.hiddenSegmentIds.includes(segment.id)}
                      onChange={(event) =>
                        dispatch({ type: 'set-segment-visibility', segmentId: segment.id, visible: event.target.checked })
                      }
                      type="checkbox"
                    />
                    <span>{segment.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="case3d-segment-section">
              <div className="case3d-segment-section__heading">
                <strong className="case3d-segment-section__title">Lymph nodes</strong>
                <div className="case3d-button-row">
                  <button
                    className="case3d-button case3d-button--secondary"
                    onClick={() => setNodalSegmentsVisible(nodalSegmentIds, false)}
                    type="button">
                    Hide all
                  </button>
                  <button
                    className="case3d-button case3d-button--secondary"
                    onClick={() => setNodalSegmentsVisible(nodalSegmentIds, true)}
                    type="button">
                    Show all
                  </button>
                </div>
              </div>
              <div className="case3d-segment-list">
                {nodalSegments.map((segment) => (
                  <label className="case3d-toggle" key={segment.id}>
                    <input
                      checked={!state.hiddenSegmentIds.includes(segment.id)}
                      onChange={(event) => setNodalSegmentsVisible([segment.id], event.target.checked)}
                      type="checkbox"
                    />
                    <span>{segment.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </article>
        </div>

        <div className="case3d-main">
          <article className="case3d-panel case3d-panel--hero">
            <div className="case3d-panel__header">
              <div>
                <div className="eyebrow">Shared Scene</div>
                <h3>3D patient-space view</h3>
              </div>
              <div className="case3d-panel__header-actions">
                <button className="case3d-button" onClick={() => setResetCameraToken((value) => value + 1)} type="button">
                  Reset camera
                </button>
                <button className="case3d-button" onClick={() => void toggleFullscreen()} type="button">
                  {isFullscreen ? 'Exit full screen' : 'Full screen'}
                </button>
              </div>
            </div>
            <div className="case3d-hero">
              <div className="case3d-panel__viewport case3d-panel__viewport--hero" ref={heroViewportRef}>
                {volumeState.loading ? (
                  <div className="case3d-panel__placeholder">Loading case geometry…</div>
                ) : volumeState.error ? (
                  <div className="case3d-panel__placeholder">{volumeState.error}</div>
                ) : (
                  <VtkViewport
                    className="case-vtk-viewport"
                    cutPlaneNormal={state.cutPlane.normal}
                    cutPlaneOpacity={state.cutPlane.opacity}
                    cutPlaneOrigin={state.cutPlane.origin}
                    cutPlaneVisible={state.cutPlane.visible}
                    crosshairWorld={crosshairWorld}
                    hasSegmentation={Boolean(volumeState.segmentation)}
                    hasVolume={Boolean(volumeState.ct)}
                    manifest={manifest}
                    mode="three-d"
                    onCutPlaneChange={(origin, normal) => dispatch({ type: 'set-cut-plane', origin, normal })}
                    orthogonalClipMode={state.orthogonalClip.mode}
                    orthogonalClipPlane={state.orthogonalClip.plane}
                    orthogonalPlaneOpacity={state.orthogonalPlaneOpacity}
                    overlayOpacity={state.overlayOpacity}
                    planeIndices={planeIndices}
                    planeVisibility={threeDPlaneVisibility}
                    resetCameraToken={resetCameraToken}
                    selectedSegments={selectedSegments}
                    segmentationRef={segmentationRef}
                    showGlb
                    visibleSegments={visibleSegments}
                    volumeRef={volumeRef}
                  />
                )}
                {isFullscreen ? (
                  <>
                    <div className="case3d-fullscreen-toolbar">
                      <button
                        aria-expanded={fullscreenControlsOpen}
                        className="case3d-button case3d-button--overlay"
                        onClick={() => setFullscreenControlsOpen((value) => !value)}
                        type="button">
                        Scene controls
                      </button>
                      <button
                        className="case3d-button case3d-button--overlay"
                        onClick={() => void toggleFullscreen()}
                        type="button">
                        Exit full screen
                      </button>
                    </div>
                    {fullscreenControlsOpen ? (
                      <aside className="case3d-fullscreen-menu" aria-label="Fullscreen 3D scene controls">
                        <ThreeDSceneControls
                          {...sceneControlProps}
                          onResetCamera={() => setResetCameraToken((value) => value + 1)}
                        />
                      </aside>
                    ) : null}
                  </>
                ) : null}
              </div>
              {!isFullscreen ? (
                <aside className="case3d-hero__controls" aria-label="3D scene controls">
                  <ThreeDSceneControls {...sceneControlProps} />
                </aside>
              ) : null}
            </div>
          </article>

          <div className="case3d-grid">
            <SliceCard
              crosshairWorld={crosshairWorld}
              manifest={manifest}
              overlayOpacity={state.overlayOpacity}
              onPlaneIndexChange={(value) => dispatch({ type: 'set-plane-axis-index', plane: 'axial', axisIndex: value, manifest })}
              plane="axial"
              planeIndex={planeIndices.axial}
              segmentationRef={segmentationRef}
              selectedSegments={selectedSegments}
              showSegmentationOverlay={state.sliceSegmentationVisible}
              visibleSegments={visibleSegments}
              volumeReady={Boolean(volumeState.ct)}
              volumeRef={volumeRef}
            />
            <SliceCard
              crosshairWorld={crosshairWorld}
              manifest={manifest}
              overlayOpacity={state.overlayOpacity}
              onPlaneIndexChange={(value) =>
                dispatch({ type: 'set-plane-axis-index', plane: 'coronal', axisIndex: value, manifest })
              }
              plane="coronal"
              planeIndex={planeIndices.coronal}
              segmentationRef={segmentationRef}
              selectedSegments={selectedSegments}
              showSegmentationOverlay={state.sliceSegmentationVisible}
              visibleSegments={visibleSegments}
              volumeReady={Boolean(volumeState.ct)}
              volumeRef={volumeRef}
            />
            <SliceCard
              crosshairWorld={crosshairWorld}
              manifest={manifest}
              overlayOpacity={state.overlayOpacity}
              onPlaneIndexChange={(value) =>
                dispatch({ type: 'set-plane-axis-index', plane: 'sagittal', axisIndex: value, manifest })
              }
              plane="sagittal"
              planeIndex={planeIndices.sagittal}
              segmentationRef={segmentationRef}
              selectedSegments={selectedSegments}
              showSegmentationOverlay={state.sliceSegmentationVisible}
              visibleSegments={visibleSegments}
              volumeReady={Boolean(volumeState.ct)}
              volumeRef={volumeRef}
            />
            <article className="case3d-panel">
              <div className="case3d-panel__header">
                <div>
                  <div className="eyebrow">Arbitrary Cut</div>
                  <h3>Resliced CT</h3>
                </div>
              </div>
              <div className="case3d-panel__viewport">
                {volumeState.ct ? (
                  <VtkViewport
                    className="case-vtk-viewport"
                    hasVolume={Boolean(volumeState.ct)}
                    manifest={manifest}
                    mode="cut"
                    normal={state.cutPlane.normal}
                    opacity={state.cutPlane.opacity}
                    origin={state.cutPlane.origin}
                    visible={state.cutPlane.visible}
                    volumeRef={volumeRef}
                  />
                ) : (
                  <div className="case3d-panel__placeholder">Waiting for volume…</div>
                )}
              </div>
              <p className="case3d-note">
                This panel uses `ImageResliceMapper` against the CT volume and stays aligned to the draggable plane in
                the 3D scene.
              </p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
