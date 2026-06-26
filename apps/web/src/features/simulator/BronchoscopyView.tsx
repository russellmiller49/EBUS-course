import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import type { SimulatorProbePose } from './pose';
import type { SimulatorLoadedAssets } from './types';

/**
 * Endoluminal mucosa material — pale-pink airway wall lit by a camera-mounted headlight that falls
 * off with distance, with submucosal vessels and a wet sheen. Drawn on the BackSide so the camera
 * sits inside the lumen. Mirrors the airway-anatomy module's bronchoscopy shader so the EBUS
 * simulator's virtual scope view matches the rest of the platform.
 */
function createBronchoscopyMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    side: THREE.BackSide,
    vertexShader: `
      varying vec3 vWorldPosition;
      varying vec3 vNormalWorld;

      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        vNormalWorld = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vWorldPosition;
      varying vec3 vNormalWorld;

      float hash(vec3 p) {
        return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453123);
      }

      void main() {
        vec3 viewDir = normalize(cameraPosition - vWorldPosition);
        vec3 n = normalize(vNormalWorld);
        if (dot(n, viewDir) < 0.0) {
          n = -n;
        }

        float dist = length(cameraPosition - vWorldPosition);
        float headlight = max(dot(n, viewDir), 0.0);
        float falloff = mix(0.95, 0.4, smoothstep(8.0, 70.0, dist));

        vec3 p = vWorldPosition * 0.13;
        float broadFold = 0.5 + 0.5 * sin(p.z * 5.5 + p.y * 2.2 + sin(p.x * 2.6) * 1.4);
        float fineFold = 0.5 + 0.5 * sin(p.x * 12.0 + p.y * 7.0 + p.z * 4.0);
        float speckle = hash(floor(vWorldPosition * 2.2));
        float mucosa = 0.76 + broadFold * 0.17 + fineFold * 0.05 + (speckle - 0.5) * 0.04;

        vec3 shadowTone = vec3(0.32, 0.10, 0.09);
        vec3 midTone = vec3(0.85, 0.45, 0.40);
        vec3 highTone = vec3(1.0, 0.80, 0.74);
        vec3 base = mix(shadowTone, midTone, clamp(mucosa, 0.0, 1.0));
        base = mix(base, highTone, pow(headlight, 2.4) * 0.30);

        float vesselA = sin(p.x * 9.0 + sin(p.z * 3.4) * 2.2 + p.y * 1.5);
        float vesselB = sin(p.y * 11.0 + sin(p.x * 4.1) * 1.9 - p.z * 2.0);
        float vessel = smoothstep(0.93, 0.99, max(vesselA, vesselB));
        base = mix(base, vec3(0.58, 0.13, 0.12), vessel * 0.28);

        float rimWet = pow(max(dot(reflect(-viewDir, n), viewDir), 0.0), 26.0);
        float sparkleGate = smoothstep(0.982, 1.0, hash(floor(vWorldPosition * 5.0)));
        float sparkle = sparkleGate * pow(headlight, 10.0) * 0.25;

        float exposure = 0.68 + headlight * 0.7;
        vec3 color = base * exposure * falloff;
        color += vec3(1.0, 0.93, 0.88) * (rimWet * 0.26 + sparkle);

        float depthDarken = smoothstep(45.0, 100.0, dist);
        color = mix(color, vec3(0.06, 0.015, 0.012), depthDarken * 0.55);
        color = pow(max(color, vec3(0.0)), vec3(0.92));

        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });
}

/**
 * First-person virtual bronchoscopy from the EBUS scope tip. The airway lumen is built once from the
 * shared mesh (same web-mm space as the centerline/pose); the camera is re-aimed from the live probe
 * pose every frame, so advancing/retracting and roll on the control rail drive the endoluminal view
 * in lockstep with the external anatomy and EBUS sector panes.
 */
export function BronchoscopyView({
  pose,
  assets,
}: {
  pose: SimulatorProbePose;
  assets: SimulatorLoadedAssets;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const poseRef = useRef(pose);
  poseRef.current = pose;

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 360;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor('#070303', 1);
    container.replaceChildren(renderer.domElement);

    const scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight('#ffd9c0', 0.5));

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(assets.airway.vertices.flat(), 3),
    );
    geometry.setIndex(assets.airway.triangles.flat());
    geometry.computeVertexNormals();
    const material = createBronchoscopyMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const camera = new THREE.PerspectiveCamera(85, width / height, 0.4, 4000);

    const forward = new THREE.Vector3();
    const up = new THREE.Vector3();
    const right = new THREE.Vector3();
    const target = new THREE.Vector3();
    const worldUp = new THREE.Vector3(0, 1, 0);
    const worldUpFallback = new THREE.Vector3(0, 0, 1);

    let frameId = 0;
    const render = () => {
      const probe = poseRef.current;
      // Look distally along the centerline tangent (the advance direction), with a stable up that
      // never aligns with the view direction so the horizon doesn't flip in vertical airway runs.
      forward.copy(probe.tangent).normalize();
      up.copy(Math.abs(forward.dot(worldUp)) > 0.92 ? worldUpFallback : worldUp);
      right.crossVectors(forward, up).normalize();
      up.crossVectors(right, forward).normalize();

      camera.position.copy(probe.position);
      camera.up.copy(up);
      target.copy(probe.position).add(forward);
      camera.lookAt(target);

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
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [assets]);

  return <div className="simulator-bronch-canvas" ref={containerRef} />;
}
