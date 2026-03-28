import { useMemo, useReducer, useState } from 'react';

import { axisNameToIndex } from '../../../../../features/case3d/patient-space';
import type { CasePlane, RuntimeCaseManifest } from '../../../../../features/case3d/types';
import { useCaseOverlay } from './useCaseOverlay';
import { useCasePlanes } from './useCasePlanes';
import { useCaseTargets, getTargetLabel } from './useCaseTargets';
import { useCaseVolume } from './useCaseVolume';
import { VtkViewport } from './VtkViewport';
import { caseViewerReducer, createInitialViewerState } from './viewerState';
import { getCrosshairWorld } from './vtk/coordinateTransforms';

interface Case3DViewerProps {
  manifest: RuntimeCaseManifest;
}

const PLANE_LABELS: Record<CasePlane, string> = {
  axial: 'Axial',
  coronal: 'Coronal',
  sagittal: 'Sagittal',
};

function getPlaneAxisSize(manifest: RuntimeCaseManifest, plane: CasePlane) {
  return manifest.volumeGeometry.sizes[axisNameToIndex(manifest.volumeGeometry.axisMap[plane])];
}

function SliceCard({
  manifest,
  plane,
  planeIndex,
  visible,
  crosshair,
  volumeLoaded,
  onPlaneIndexChange,
  onToggleVisibility,
}: {
  manifest: RuntimeCaseManifest;
  plane: CasePlane;
  planeIndex: number;
  visible: boolean;
  crosshair: { u: number; v: number };
  volumeLoaded: ReturnType<typeof useCaseVolume>['ct'];
  onPlaneIndexChange: (value: number) => void;
  onToggleVisibility: (value: boolean) => void;
}) {
  const axisSize = getPlaneAxisSize(manifest, plane);

  return (
    <article className="case3d-panel">
      <div className="case3d-panel__header">
        <div>
          <div className="eyebrow">Orthogonal CT</div>
          <h3>{PLANE_LABELS[plane]}</h3>
        </div>
        <label className="case3d-toggle">
          <input checked={visible} onChange={(event) => onToggleVisibility(event.target.checked)} type="checkbox" />
          <span>{visible ? 'Visible' : 'Hidden'}</span>
        </label>
      </div>
      <div className="case3d-panel__viewport">
        {volumeLoaded ? (
          <>
            <VtkViewport
              className="case-vtk-viewport"
              manifest={manifest}
              mode="slice"
              plane={plane}
              planeIndex={planeIndex}
              visible={visible}
              volume={volumeLoaded}
            />
            <div aria-hidden className="case3d-crosshair-overlay">
              <span className="case3d-crosshair-overlay__vertical" style={{ left: `${crosshair.u * 100}%` }} />
              <span className="case3d-crosshair-overlay__horizontal" style={{ top: `${crosshair.v * 100}%` }} />
            </div>
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

export function Case3DViewer({ manifest }: Case3DViewerProps) {
  const [state, dispatch] = useReducer(caseViewerReducer, manifest, createInitialViewerState);
  const [resetCameraToken, setResetCameraToken] = useState(0);
  const volumeState = useCaseVolume();
  const { selectedStation, selectedTarget, stationTargets, landmarkTargets } = useCaseTargets(
    manifest,
    state.selectedStationId,
    state.selectedTargetId,
  );
  const crosshairWorld = useMemo(() => getCrosshairWorld(manifest, state.crosshairVoxel), [manifest, state.crosshairVoxel]);
  const { planeIndices, crosshairUv } = useCasePlanes(manifest, state.crosshairVoxel, crosshairWorld);
  const { selectedSegmentIds, visibleSegments } = useCaseOverlay(manifest, state.overlayGroups, state.selectedTargetId);
  const selectedSegments = useMemo(
    () => manifest.segmentation.segments.filter((segment) => selectedSegmentIds.has(segment.id)),
    [manifest.segmentation.segments, selectedSegmentIds],
  );

  const stationTargetOptions = stationTargets.length > 0 ? stationTargets : [selectedTarget];

  return (
    <div className="page-stack">
      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Case 001</div>
            <h2>Patient-space tri-planar viewer</h2>
          </div>
        </div>
        <p>
          CT geometry is the runtime truth, segmentation is the anatomy alignment truth, and markups drive the target
          list and crosshair. The GLB remains optional polish on top of that shared patient-space scene.
        </p>
        <div className="mini-card-grid">
          <article className="mini-card">
            <strong>{manifest.stations.length}</strong>
            <p>Stations</p>
          </article>
          <article className="mini-card">
            <strong>{manifest.targets.length}</strong>
            <p>Targets from markups</p>
          </article>
          <article className="mini-card">
            <strong>{manifest.segmentation.segments.length}</strong>
            <p>Segmentation segments</p>
          </article>
          <article className="mini-card">
            <strong>{selectedTarget.displayLabel}</strong>
            <p>Current target</p>
          </article>
        </div>
      </section>

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
            <div className="stack-list">
              <article className="mini-card">
                <strong>Crosshair</strong>
                <p>
                  {crosshairWorld[0].toFixed(1)}, {crosshairWorld[1].toFixed(1)}, {crosshairWorld[2].toFixed(1)} mm
                </p>
              </article>
              <article className="mini-card">
                <strong>Matched segments</strong>
                <p>{selectedSegments.length > 0 ? selectedSegments.map((segment) => segment.name).join(', ') : 'None'}</p>
              </article>
            </div>
          </article>

          <article className="case3d-panel case3d-panel--controls">
            <div className="case3d-panel__header">
              <div>
                <div className="eyebrow">Overlay</div>
                <h3>Segmentation and GLB</h3>
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
                checked={state.overlayGroups.glb}
                onChange={(event) => dispatch({ type: 'set-overlay-group', key: 'glb', value: event.target.checked })}
                type="checkbox"
              />
              <span>Optional GLB polish</span>
            </label>
            <label className="case3d-slider">
              <span>Overlay opacity</span>
              <input
                max={1}
                min={0.05}
                onChange={(event) => dispatch({ type: 'set-overlay-opacity', value: Number(event.target.value) })}
                step={0.01}
                type="range"
                value={state.overlayOpacity}
              />
            </label>
          </article>

          <article className="case3d-panel case3d-panel--controls">
            <div className="case3d-panel__header">
              <div>
                <div className="eyebrow">Cut Plane</div>
                <h3>Arbitrary reslice</h3>
              </div>
            </div>
            <label className="case3d-toggle">
              <input
                checked={state.cutPlane.visible}
                onChange={(event) => dispatch({ type: 'set-cut-plane-visibility', visible: event.target.checked })}
                type="checkbox"
              />
              <span>Show cut plane</span>
            </label>
            <label className="case3d-slider">
              <span>Cut-plane opacity</span>
              <input
                max={1}
                min={0.05}
                onChange={(event) => dispatch({ type: 'set-cut-plane-opacity', value: Number(event.target.value) })}
                step={0.01}
                type="range"
                value={state.cutPlane.opacity}
              />
            </label>
            <button className="case3d-button" onClick={() => dispatch({ type: 'reset-cut-plane' })} type="button">
              Reset cut plane
            </button>
            <p className="case3d-note">
              Drag or rotate the plane directly in the 3D view. The cut viewport and segmentation clipping stay tied to
              that same world-space plane.
            </p>
          </article>
        </div>

        <div className="case3d-main">
          <article className="case3d-panel case3d-panel--hero">
            <div className="case3d-panel__header">
              <div>
                <div className="eyebrow">Shared Scene</div>
                <h3>3D patient-space view</h3>
              </div>
              <button className="case3d-button" onClick={() => setResetCameraToken((value) => value + 1)} type="button">
                Reset camera
              </button>
            </div>
            <div className="case3d-panel__viewport case3d-panel__viewport--hero">
              {volumeState.loading ? (
                <div className="case3d-panel__placeholder">Loading CT and segmentation…</div>
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
                  manifest={manifest}
                  mode="three-d"
                  onCutPlaneChange={(origin, normal) => dispatch({ type: 'set-cut-plane', origin, normal })}
                  overlayOpacity={state.overlayOpacity}
                  planeIndices={planeIndices}
                  planeVisibility={state.planeVisibility}
                  resetCameraToken={resetCameraToken}
                  selectedSegments={selectedSegments}
                  segmentation={volumeState.segmentation}
                  showGlb={state.overlayGroups.glb}
                  visibleSegments={visibleSegments}
                  volume={volumeState.ct}
                />
              )}
            </div>
          </article>

          <div className="case3d-grid">
            <SliceCard
              crosshair={crosshairUv.axial}
              manifest={manifest}
              onPlaneIndexChange={(value) => dispatch({ type: 'set-plane-axis-index', plane: 'axial', axisIndex: value, manifest })}
              onToggleVisibility={(visible) => dispatch({ type: 'set-plane-visibility', plane: 'axial', visible })}
              plane="axial"
              planeIndex={planeIndices.axial}
              visible={state.planeVisibility.axial}
              volumeLoaded={volumeState.ct}
            />
            <SliceCard
              crosshair={crosshairUv.coronal}
              manifest={manifest}
              onPlaneIndexChange={(value) =>
                dispatch({ type: 'set-plane-axis-index', plane: 'coronal', axisIndex: value, manifest })
              }
              onToggleVisibility={(visible) => dispatch({ type: 'set-plane-visibility', plane: 'coronal', visible })}
              plane="coronal"
              planeIndex={planeIndices.coronal}
              visible={state.planeVisibility.coronal}
              volumeLoaded={volumeState.ct}
            />
            <SliceCard
              crosshair={crosshairUv.sagittal}
              manifest={manifest}
              onPlaneIndexChange={(value) =>
                dispatch({ type: 'set-plane-axis-index', plane: 'sagittal', axisIndex: value, manifest })
              }
              onToggleVisibility={(visible) => dispatch({ type: 'set-plane-visibility', plane: 'sagittal', visible })}
              plane="sagittal"
              planeIndex={planeIndices.sagittal}
              visible={state.planeVisibility.sagittal}
              volumeLoaded={volumeState.ct}
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
                    manifest={manifest}
                    mode="cut"
                    normal={state.cutPlane.normal}
                    opacity={state.cutPlane.opacity}
                    origin={state.cutPlane.origin}
                    visible={state.cutPlane.visible}
                    volume={volumeState.ct}
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
