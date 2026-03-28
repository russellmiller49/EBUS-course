import { useEffect, useMemo, useRef } from 'react';

// Side-effect import required for vtk.js rendering backends.
import '@kitware/vtk.js/Rendering/Profiles/All';
import vtkGenericRenderWindow from '@kitware/vtk.js/Rendering/Misc/GenericRenderWindow';
import vtkInteractorStyleImage from '@kitware/vtk.js/Interaction/Style/InteractorStyleImage';
import vtkWidgetManager from '@kitware/vtk.js/Widgets/Core/WidgetManager';
import { ViewTypes } from '@kitware/vtk.js/Widgets/Core/WidgetManager/Constants';
import vtkImplicitPlaneWidget from '@kitware/vtk.js/Widgets/Widgets3D/ImplicitPlaneWidget';

import { case001AssetUrls } from './case001';
import { createCrosshairActors, updateCrosshairActors } from './vtk/buildCrosshair';
import { loadGlbOverlay } from './vtk/buildGlbOverlay';
import { createCutPlaneSlice } from './vtk/buildCutPlane';
import { createOrthogonalPlaneActor } from './vtk/buildOrthogonalPlanes';
import { createSegmentationSurfaceActor } from './vtk/buildSegmentationSurface';
import {
  boundsToExtent,
  getBoundsCenter,
  getBoundsRadius,
  getPlaneCameraPosition,
  getPlaneCenterWorld,
  getPlaneNormalWorld,
  getPlaneViewUp,
} from './vtk/coordinateTransforms';

import { crossVectors, normalizeVector } from '../../../../../features/case3d/patient-space';
import type { LoadedCaseVolume } from './vtk/loadCaseVolume';
import type { LoadedSegmentation } from './vtk/loadSegmentation';
import type {
  CasePlane,
  RuntimeCaseManifest,
  SegmentationSegment,
  SliceIndex,
  Vector3Tuple,
} from '../../../../../features/case3d/types';

interface CommonViewportProps {
  className?: string;
}

interface SliceViewportProps extends CommonViewportProps {
  mode: 'slice';
  manifest: RuntimeCaseManifest;
  volume: LoadedCaseVolume | null;
  plane: CasePlane;
  planeIndex: number;
  visible: boolean;
}

interface CutViewportProps extends CommonViewportProps {
  mode: 'cut';
  manifest: RuntimeCaseManifest;
  volume: LoadedCaseVolume | null;
  origin: Vector3Tuple;
  normal: Vector3Tuple;
  opacity: number;
  visible: boolean;
}

interface ThreeDViewportProps extends CommonViewportProps {
  mode: 'three-d';
  manifest: RuntimeCaseManifest;
  volume: LoadedCaseVolume | null;
  segmentation: LoadedSegmentation | null;
  planeIndices: SliceIndex;
  planeVisibility: Record<CasePlane, boolean>;
  crosshairWorld: Vector3Tuple;
  overlayOpacity: number;
  visibleSegments: SegmentationSegment[];
  selectedSegments: SegmentationSegment[];
  cutPlaneOrigin: Vector3Tuple;
  cutPlaneNormal: Vector3Tuple;
  cutPlaneOpacity: number;
  cutPlaneVisible: boolean;
  showGlb: boolean;
  resetCameraToken: number;
  onCutPlaneChange: (origin: Vector3Tuple, normal: Vector3Tuple) => void;
}

type VtkViewportProps = SliceViewportProps | CutViewportProps | ThreeDViewportProps;

type SlicePipeline = {
  actor: ReturnType<typeof createOrthogonalPlaneActor>['actor'];
  mapper: ReturnType<typeof createOrthogonalPlaneActor>['mapper'];
};

type CutPipeline = ReturnType<typeof createCutPlaneSlice>;

type ThreeDPipeline = {
  planeActors: Record<CasePlane, ReturnType<typeof createOrthogonalPlaneActor>>;
  crosshair: ReturnType<typeof createCrosshairActors>;
  cutSlice: ReturnType<typeof createCutPlaneSlice>;
  widgetFactory: any;
  widgetManager: vtkWidgetManager;
  widgetSubscription: { unsubscribe: () => void } | null;
  segmentationActors: Map<string, Exclude<ReturnType<typeof createSegmentationSurfaceActor>, null>>;
  selectedActor: Exclude<ReturnType<typeof createSegmentationSurfaceActor>, null> | null;
  glbImporter: Awaited<ReturnType<typeof loadGlbOverlay>> | null;
};

const EMPTY_SEGMENTS: SegmentationSegment[] = [];

function vectorsClose(left: readonly number[], right: readonly number[], epsilon = 1e-3) {
  return left.every((value, index) => Math.abs(value - right[index]) <= epsilon);
}

function configureSliceCamera(
  genericRenderWindow: vtkGenericRenderWindow,
  manifest: RuntimeCaseManifest,
  plane: CasePlane,
  planeIndex: number,
) {
  const renderer = genericRenderWindow.getRenderer();
  const camera = renderer.getActiveCamera();
  const center = getPlaneCenterWorld(manifest.volumeGeometry, plane, planeIndex);
  const normal = getPlaneNormalWorld(manifest.volumeGeometry, plane);
  const viewUp = getPlaneViewUp(manifest.volumeGeometry, plane);
  const radius = getBoundsRadius(manifest.bounds.ct);
  const bounds = boundsToExtent(manifest.bounds.ct);

  camera.setParallelProjection(true);
  camera.setFocalPoint(center[0], center[1], center[2]);
  camera.setPosition(...getPlaneCameraPosition(center, normal, radius * 1.7));
  camera.setViewUp(viewUp[0], viewUp[1], viewUp[2]);
  camera.setParallelScale(radius * 0.78);
  renderer.resetCameraClippingRange(bounds);
}

function configureCutCamera(
  genericRenderWindow: vtkGenericRenderWindow,
  manifest: RuntimeCaseManifest,
  origin: Vector3Tuple,
  normal: Vector3Tuple,
) {
  const renderer = genericRenderWindow.getRenderer();
  const camera = renderer.getActiveCamera();
  const normalized = normalizeVector(normal);
  const fallbackUp: Vector3Tuple = Math.abs(normalized[2]) > 0.92 ? [0, 1, 0] : [0, 0, 1];
  const right = normalizeVector(crossVectors(normalized, fallbackUp));
  const viewUp = normalizeVector(crossVectors(right, normalized));
  const radius = getBoundsRadius(manifest.bounds.ct);

  camera.setParallelProjection(true);
  camera.setFocalPoint(origin[0], origin[1], origin[2]);
  camera.setPosition(...getPlaneCameraPosition(origin, normalized, radius * 1.35));
  camera.setViewUp(viewUp[0], viewUp[1], viewUp[2]);
  camera.setParallelScale(radius * 0.52);
  renderer.resetCameraClippingRange(boundsToExtent(manifest.bounds.ct));
}

function resetThreeDCamera(genericRenderWindow: vtkGenericRenderWindow, manifest: RuntimeCaseManifest) {
  const renderer = genericRenderWindow.getRenderer();
  const camera = renderer.getActiveCamera();
  const center = getBoundsCenter(manifest.bounds.ct);
  const radius = getBoundsRadius(manifest.bounds.ct);

  camera.setFocalPoint(center[0], center[1], center[2]);
  camera.setPosition(center[0] + radius * 1.08, center[1] - radius * 1.02, center[2] + radius * 0.78);
  camera.setViewUp(0, 0, 1);
  renderer.resetCameraClippingRange(boundsToExtent(manifest.bounds.union));
}

export function VtkViewport(props: VtkViewportProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const genericRenderWindowRef = useRef<vtkGenericRenderWindow | null>(null);
  const pipelineRef = useRef<SlicePipeline | CutPipeline | ThreeDPipeline | null>(null);
  const lastResetCameraTokenRef = useRef(0);
  const cutPlaneRef = useRef<{ normal: Vector3Tuple; origin: Vector3Tuple }>(
    props.mode === 'three-d'
      ? { origin: props.cutPlaneOrigin, normal: props.cutPlaneNormal }
      : { origin: [0, 0, 0], normal: [0, 0, 1] },
  );
  const threeDVisibleSegments = props.mode === 'three-d' ? props.visibleSegments : EMPTY_SEGMENTS;
  const visibleGroupMap = useMemo(() => {
    if (props.mode !== 'three-d') {
      return new Map<string, SegmentationSegment[]>();
    }

    const groups = new Map<string, SegmentationSegment[]>();

    props.visibleSegments.forEach((segment) => {
      const key = segment.groupId;
      const existing = groups.get(key) ?? [];
      existing.push(segment);
      groups.set(key, existing);
    });

    return groups;
  }, [props.mode, threeDVisibleSegments]);

  useEffect(() => {
    if (props.mode !== 'three-d') {
      return;
    }

    cutPlaneRef.current = {
      origin: props.cutPlaneOrigin,
      normal: props.cutPlaneNormal,
    };
  }, [props.mode, props.mode === 'three-d' ? props.cutPlaneOrigin : null, props.mode === 'three-d' ? props.cutPlaneNormal : null]);

  useEffect(() => {
    if (!containerRef.current || genericRenderWindowRef.current) {
      return;
    }

    const genericRenderWindow = vtkGenericRenderWindow.newInstance({
      background: [0.02, 0.04, 0.08],
      container: containerRef.current,
    });
    genericRenderWindow.setContainer(containerRef.current);
    genericRenderWindow.resize();
    genericRenderWindowRef.current = genericRenderWindow;

    return () => {
      if (pipelineRef.current && 'widgetSubscription' in pipelineRef.current) {
        pipelineRef.current.widgetSubscription?.unsubscribe();
      }

      pipelineRef.current = null;
      genericRenderWindow.delete();
      genericRenderWindowRef.current = null;
    };
  }, []);

  useEffect(() => {
    function handleResize() {
      genericRenderWindowRef.current?.resize();
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const genericRenderWindow = genericRenderWindowRef.current;

    if (!genericRenderWindow) {
      return;
    }

    if (props.mode === 'slice' && props.volume && !pipelineRef.current) {
      const renderer = genericRenderWindow.getRenderer();
      const interactor = genericRenderWindow.getInteractor();
      interactor.setInteractorStyle(vtkInteractorStyleImage.newInstance());
      const planeActor = createOrthogonalPlaneActor(
        props.volume.image,
        props.manifest,
        props.plane,
        props.volume.scalarRange,
      );
      renderer.addActor(planeActor.actor);
      pipelineRef.current = planeActor;
      configureSliceCamera(genericRenderWindow, props.manifest, props.plane, props.planeIndex);
      genericRenderWindow.getRenderWindow().render();
    }

    if (props.mode === 'cut' && props.volume && !pipelineRef.current) {
      const renderer = genericRenderWindow.getRenderer();
      const interactor = genericRenderWindow.getInteractor();
      interactor.setInteractorStyle(vtkInteractorStyleImage.newInstance());
      const cutSlice = createCutPlaneSlice(
        props.volume.image,
        props.volume.scalarRange,
        props.origin,
        props.normal,
      );
      renderer.addActor(cutSlice.actor);
      pipelineRef.current = cutSlice;
      configureCutCamera(genericRenderWindow, props.manifest, props.origin, props.normal);
      genericRenderWindow.getRenderWindow().render();
    }

    if (props.mode === 'three-d' && props.volume && props.segmentation && !pipelineRef.current) {
      const renderer = genericRenderWindow.getRenderer();
      const planeActors = {
        axial: createOrthogonalPlaneActor(props.volume.image, props.manifest, 'axial', props.volume.scalarRange),
        coronal: createOrthogonalPlaneActor(props.volume.image, props.manifest, 'coronal', props.volume.scalarRange),
        sagittal: createOrthogonalPlaneActor(props.volume.image, props.manifest, 'sagittal', props.volume.scalarRange),
      } as const;
      const cutSlice = createCutPlaneSlice(
        props.volume.image,
        props.volume.scalarRange,
        props.cutPlaneOrigin,
        props.cutPlaneNormal,
      );
      const crosshair = createCrosshairActors(props.crosshairWorld, 18);
      const widgetManager = vtkWidgetManager.newInstance();
      widgetManager.setRenderer(renderer);
      const widgetFactory = vtkImplicitPlaneWidget.newInstance();
      widgetFactory.placeWidget(boundsToExtent(props.manifest.bounds.ct));
      widgetFactory.setVisibility(props.cutPlaneVisible);
      widgetFactory.setPickable(props.cutPlaneVisible);
      const widgetState = widgetFactory.getWidgetState();
      widgetState.setOrigin(props.cutPlaneOrigin);
      widgetState.setNormal(props.cutPlaneNormal);
      const widgetSubscription = widgetFactory.onWidgetChange(() => {
        const state = widgetFactory.getWidgetState();
        const nextOrigin = state.getOrigin();
        const nextNormal = state.getNormal();

        if (
          vectorsClose(nextOrigin, cutPlaneRef.current.origin) &&
          vectorsClose(nextNormal, cutPlaneRef.current.normal)
        ) {
          return;
        }

        props.onCutPlaneChange(nextOrigin, nextNormal);
      });
      widgetManager.addWidget(widgetFactory, ViewTypes.GEOMETRY);

      Object.values(planeActors).forEach(({ actor }) => renderer.addActor(actor));
      renderer.addActor(cutSlice.actor);
      crosshair.forEach(({ actor }) => renderer.addActor(actor));
      pipelineRef.current = {
        planeActors: {
          axial: planeActors.axial,
          coronal: planeActors.coronal,
          sagittal: planeActors.sagittal,
        },
        crosshair,
        cutSlice,
        widgetFactory,
        widgetManager,
        widgetSubscription,
        segmentationActors: new Map(),
        selectedActor: null,
        glbImporter: null,
      };
      resetThreeDCamera(genericRenderWindow, props.manifest);
      genericRenderWindow.getRenderWindow().render();
    }
    // The volume / segmentation objects are large and stable for the life of the viewer.
    // Keep them out of the dependency array so React dev logging does not recurse through
    // the entire vtk image graph if an imperative VTK call throws.
  }, [props.mode, Boolean(props.volume), props.mode === 'three-d' ? Boolean(props.segmentation) : false]);

  useEffect(() => {
    const genericRenderWindow = genericRenderWindowRef.current;
    const pipeline = pipelineRef.current;

    if (!genericRenderWindow || !pipeline) {
      return;
    }

    if (props.mode === 'slice' && 'mapper' in pipeline) {
      pipeline.mapper.setSlice(props.planeIndex);
      pipeline.actor.setVisibility(props.visible);
      configureSliceCamera(genericRenderWindow, props.manifest, props.plane, props.planeIndex);
      genericRenderWindow.getRenderWindow().render();
    }

    if (props.mode === 'cut' && 'plane' in pipeline && !('planeActors' in pipeline)) {
      pipeline.plane.setOrigin(props.origin);
      pipeline.plane.setNormal(props.normal);
      pipeline.actor.getProperty().setOpacity(props.opacity);
      pipeline.actor.setVisibility(props.visible);
      configureCutCamera(genericRenderWindow, props.manifest, props.origin, props.normal);
      genericRenderWindow.getRenderWindow().render();
    }

    if (props.mode !== 'three-d' || !('planeActors' in pipeline)) {
      return;
    }

    const renderer = genericRenderWindow.getRenderer();
    pipeline.planeActors.axial.mapper.setSlice(props.planeIndices.axial);
    pipeline.planeActors.coronal.mapper.setSlice(props.planeIndices.coronal);
    pipeline.planeActors.sagittal.mapper.setSlice(props.planeIndices.sagittal);
    pipeline.planeActors.axial.actor.setVisibility(props.planeVisibility.axial);
    pipeline.planeActors.coronal.actor.setVisibility(props.planeVisibility.coronal);
    pipeline.planeActors.sagittal.actor.setVisibility(props.planeVisibility.sagittal);
    updateCrosshairActors(pipeline.crosshair, props.crosshairWorld, 18);
    pipeline.cutSlice.plane.setOrigin(props.cutPlaneOrigin);
    pipeline.cutSlice.plane.setNormal(props.cutPlaneNormal);
    pipeline.cutSlice.actor.getProperty().setOpacity(props.cutPlaneOpacity);
    pipeline.cutSlice.actor.setVisibility(props.cutPlaneVisible);
    const widgetState = pipeline.widgetFactory.getWidgetState();

    if (!vectorsClose(widgetState.getOrigin(), props.cutPlaneOrigin)) {
      widgetState.setOrigin(props.cutPlaneOrigin);
    }

    if (!vectorsClose(widgetState.getNormal(), props.cutPlaneNormal)) {
      widgetState.setNormal(props.cutPlaneNormal);
    }

    pipeline.widgetFactory.setVisibility(props.cutPlaneVisible);
    pipeline.widgetFactory.setPickable(props.cutPlaneVisible);

    const buildGroupActor = (groupKey: string, segments: SegmentationSegment[], color: [number, number, number]) => {
      if (pipeline.segmentationActors.has(groupKey) || !props.segmentation) {
        return;
      }

      const actorBundle = createSegmentationSurfaceActor(
        props.manifest,
        props.segmentation,
        segments,
        color,
        props.overlayOpacity,
        pipeline.cutSlice.plane,
      );

      if (!actorBundle) {
        return;
      }

      renderer.addActor(actorBundle.actor);
      pipeline.segmentationActors.set(groupKey, actorBundle);
    };

    buildGroupActor('airway', visibleGroupMap.get('airway') ?? [], [0.55, 0.93, 0.95]);
    buildGroupActor('vessels', visibleGroupMap.get('vessels') ?? [], [0.91, 0.45, 0.43]);
    buildGroupActor('nodes', visibleGroupMap.get('nodes') ?? [], [0.43, 0.91, 0.62]);
    buildGroupActor('cardiac', visibleGroupMap.get('cardiac') ?? [], [0.92, 0.75, 0.45]);
    buildGroupActor('gi', visibleGroupMap.get('gi') ?? [], [0.86, 0.75, 0.59]);

    pipeline.segmentationActors.forEach((bundle, groupKey) => {
      const segments = visibleGroupMap.get(groupKey) ?? [];
      bundle.actor.setVisibility(segments.length > 0);
      bundle.actor.getProperty().setOpacity(props.overlayOpacity);
    });

    if (pipeline.selectedActor) {
      renderer.removeActor(pipeline.selectedActor.actor);
      pipeline.selectedActor = null;
    }

    if (props.selectedSegments.length > 0 && props.segmentation) {
      pipeline.selectedActor = createSegmentationSurfaceActor(
        props.manifest,
        props.segmentation,
        props.selectedSegments,
        [0.99, 0.92, 0.34],
        Math.min(1, props.overlayOpacity + 0.24),
        pipeline.cutSlice.plane,
      );

      if (pipeline.selectedActor) {
        renderer.addActor(pipeline.selectedActor.actor);
      }
    }

    if (props.showGlb && !pipeline.glbImporter) {
      loadGlbOverlay(renderer, props.manifest, case001AssetUrls.glb)
        .then((importer) => {
          pipeline.glbImporter = importer;
          genericRenderWindow.getRenderWindow().render();
        })
        .catch(() => {
          pipeline.glbImporter = null;
        });
    }

    if (pipeline.glbImporter) {
      pipeline.glbImporter.getActors().forEach((actor) => {
        actor.setVisibility(props.showGlb);
        actor.getProperty().setOpacity(0.28);
      });
    }

    if (props.resetCameraToken > lastResetCameraTokenRef.current) {
      lastResetCameraTokenRef.current = props.resetCameraToken;
      resetThreeDCamera(genericRenderWindow, props.manifest);
    }

    genericRenderWindow.getRenderWindow().render();
  }, [
    props.mode,
    visibleGroupMap,
    props.mode === 'slice' ? props.plane : null,
    props.mode === 'slice' ? props.planeIndex : null,
    props.mode === 'slice' ? props.visible : null,
    props.mode === 'cut' ? props.origin : null,
    props.mode === 'cut' ? props.normal : null,
    props.mode === 'cut' ? props.opacity : null,
    props.mode === 'cut' ? props.visible : null,
    props.mode === 'three-d' ? props.crosshairWorld : null,
    props.mode === 'three-d' ? props.overlayOpacity : null,
    props.mode === 'three-d' ? props.selectedSegments : null,
    props.mode === 'three-d' ? props.visibleSegments : null,
    props.mode === 'three-d' ? props.cutPlaneOrigin : null,
    props.mode === 'three-d' ? props.cutPlaneNormal : null,
    props.mode === 'three-d' ? props.cutPlaneOpacity : null,
    props.mode === 'three-d' ? props.cutPlaneVisible : null,
    props.mode === 'three-d' ? props.showGlb : null,
    props.mode === 'three-d' ? props.resetCameraToken : null,
    props.mode === 'three-d' ? props.planeIndices.axial : null,
    props.mode === 'three-d' ? props.planeIndices.coronal : null,
    props.mode === 'three-d' ? props.planeIndices.sagittal : null,
    props.mode === 'three-d' ? props.planeVisibility.axial : null,
    props.mode === 'three-d' ? props.planeVisibility.coronal : null,
    props.mode === 'three-d' ? props.planeVisibility.sagittal : null,
  ]);

  return <div className={props.className ?? 'case-vtk-viewport'} ref={containerRef} />;
}
