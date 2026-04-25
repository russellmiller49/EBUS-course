import * as THREE from 'three';

import type { SimulatorCenterlinePolyline, SimulatorPreset, Vec3 } from './types';

export interface SimulatorProbePose {
  position: THREE.Vector3;
  tangent: THREE.Vector3;
  depthAxis: THREE.Vector3;
  lateralAxis: THREE.Vector3;
}

export function toVector(point: Vec3): THREE.Vector3 {
  return new THREE.Vector3(point[0], point[1], point[2]);
}

export function toTuple(vector: THREE.Vector3): Vec3 {
  return [vector.x, vector.y, vector.z];
}

export function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}

export function pointAtS(polyline: SimulatorCenterlinePolyline, sMm: number): THREE.Vector3 {
  const points = polyline.points;
  const lengths = polyline.cumulative_lengths_mm;

  if (points.length === 0) {
    return new THREE.Vector3();
  }

  if (points.length === 1) {
    return toVector(points[0]);
  }

  const clamped = clamp(sMm, 0, polyline.total_length_mm);

  if (clamped <= 0) {
    return toVector(points[0]);
  }

  if (clamped >= polyline.total_length_mm) {
    return toVector(points[points.length - 1]);
  }

  let segmentIndex = 0;
  while (segmentIndex < lengths.length - 1 && lengths[segmentIndex + 1] < clamped) {
    segmentIndex += 1;
  }

  const startLength = lengths[segmentIndex] ?? 0;
  const endLength = lengths[segmentIndex + 1] ?? startLength;
  const t = endLength > startLength ? (clamped - startLength) / (endLength - startLength) : 0;

  return toVector(points[segmentIndex]).lerp(toVector(points[segmentIndex + 1]), t);
}

export function tangentAtS(polyline: SimulatorCenterlinePolyline, sMm: number): THREE.Vector3 {
  const windowMm = 5;
  const start = pointAtS(polyline, Math.max(0, sMm - windowMm));
  const end = pointAtS(polyline, Math.min(polyline.total_length_mm, sMm + windowMm));
  const tangent = end.sub(start);

  if (tangent.lengthSq() > 1e-8) {
    return tangent.normalize();
  }

  if (polyline.points.length >= 2) {
    return toVector(polyline.points[polyline.points.length - 1]).sub(toVector(polyline.points[0])).normalize();
  }

  return new THREE.Vector3(0, 1, 0);
}

function fallbackDepthAxis(tangent: THREE.Vector3): THREE.Vector3 {
  const candidates = [
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, 0, 1),
  ].sort((a, b) => Math.abs(a.dot(tangent)) - Math.abs(b.dot(tangent)));

  for (const candidate of candidates) {
    const projected = candidate.clone().sub(tangent.clone().multiplyScalar(candidate.dot(tangent)));

    if (projected.lengthSq() > 1e-8) {
      return projected.normalize();
    }
  }

  return new THREE.Vector3(0, 1, 0);
}

function normalizedVectorOrNull(point: Vec3 | null | undefined): THREE.Vector3 | null {
  if (!point) {
    return null;
  }

  const vector = toVector(point);
  return vector.lengthSq() > 1e-8 ? vector.normalize() : null;
}

export function computeSimulatorPose(
  polyline: SimulatorCenterlinePolyline,
  sMm: number,
  rollDeg: number,
  preset: SimulatorPreset,
): SimulatorProbePose {
  const centerlinePosition = pointAtS(polyline, sMm);
  let position = centerlinePosition.clone();
  let tangent = tangentAtS(polyline, sMm);
  const presetShaft = normalizedVectorOrNull(preset.shaft_axis);

  if (presetShaft && tangent.dot(presetShaft) < 0) {
    tangent.multiplyScalar(-1);
  }

  const atStationSnap = polyline.line_index === preset.line_index && Math.abs(sMm - preset.centerline_s_mm) <= 1;

  if (presetShaft && atStationSnap) {
    tangent = presetShaft;
  }

  if (polyline.line_index === preset.line_index) {
    const referenceCenterlinePosition = pointAtS(polyline, preset.centerline_s_mm);
    const radialOffset = toVector(preset.contact).sub(referenceCenterlinePosition);
    radialOffset.sub(tangent.clone().multiplyScalar(radialOffset.dot(tangent)));

    if (radialOffset.lengthSq() > 1e-8) {
      position = atStationSnap ? toVector(preset.contact) : centerlinePosition.clone().add(radialOffset);
    }
  }

  let depthAxis = normalizedVectorOrNull(preset.depth_axis) ?? toVector(preset.target).sub(position);
  depthAxis.sub(tangent.clone().multiplyScalar(depthAxis.dot(tangent)));

  if (depthAxis.lengthSq() <= 1e-8) {
    depthAxis = fallbackDepthAxis(tangent);
  } else {
    depthAxis.normalize();
  }

  if (toVector(preset.target).sub(position).dot(depthAxis) < 0) {
    depthAxis.multiplyScalar(-1);
  }

  depthAxis.applyAxisAngle(tangent, THREE.MathUtils.degToRad(rollDeg)).normalize();
  const lateralAxis = new THREE.Vector3().crossVectors(tangent, depthAxis).normalize();
  depthAxis = new THREE.Vector3().crossVectors(lateralAxis, tangent).normalize();

  return { position, tangent, depthAxis, lateralAxis };
}

export function cephalicImageAxis(pose: SimulatorProbePose): THREE.Vector3 {
  const webCephalicAxis = new THREE.Vector3(0, 1, 0);
  const axis = pose.tangent.clone().normalize();

  return axis.dot(webCephalicAxis) >= 0 ? axis : axis.multiplyScalar(-1);
}

export function sectorPlaneNormal(pose: SimulatorProbePose): THREE.Vector3 {
  const imageAxis = cephalicImageAxis(pose);
  return new THREE.Vector3().crossVectors(imageAxis, pose.depthAxis).normalize();
}

export function projectToSector(
  point: Vec3,
  pose: SimulatorProbePose,
  maxDepthMm: number,
  sectorAngleDeg: number,
  slabHalfThicknessMm = 4,
) {
  const offset = toVector(point).sub(pose.position);
  const imageAxis = cephalicImageAxis(pose);
  const planeNormal = sectorPlaneNormal(pose);
  const depthMm = offset.dot(pose.depthAxis);
  const lateralMm = offset.dot(imageAxis);
  const outOfPlaneMm = offset.dot(planeNormal);
  const halfWidth = Math.max(0, depthMm) * Math.tan(THREE.MathUtils.degToRad(sectorAngleDeg / 2));
  const inSectorPlane = depthMm >= 0 && depthMm <= maxDepthMm && Math.abs(lateralMm) <= halfWidth + 1e-6;
  const inSliceSlab = Math.abs(outOfPlaneMm) <= slabHalfThicknessMm;

  return { depthMm, lateralMm, outOfPlaneMm, visible: inSectorPlane && inSliceSlab };
}
