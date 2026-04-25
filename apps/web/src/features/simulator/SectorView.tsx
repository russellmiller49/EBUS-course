import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import { clamp } from './pose';
import { formatSimulatorStation } from './stationIds';
import type { SimulatorCaseManifest, SimulatorPreset, SimulatorSectorItem, SimulatorSectorRasterMask, Vec2 } from './types';

function hexToRgb(color: string) {
  const normalized = color.trim().replace(/^#/, '');
  const expanded = normalized.length === 3
    ? normalized.split('').map((digit) => `${digit}${digit}`).join('')
    : normalized;
  const parsed = Number.parseInt(expanded, 16);

  if (!Number.isFinite(parsed) || expanded.length !== 6) {
    return { r: 147, g: 197, b: 111 };
  }

  return {
    r: (parsed >> 16) & 255,
    g: (parsed >> 8) & 255,
    b: parsed & 255,
  };
}

function drawFanClip(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const sx = width / 100;
  const sy = height / 100;
  ctx.beginPath();
  ctx.moveTo(50 * sx, 7 * sy);
  ctx.lineTo(10 * sx, 92 * sy);
  ctx.quadraticCurveTo(50 * sx, 99 * sy, 90 * sx, 92 * sy);
  ctx.closePath();
}

function drawSectorTexture(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = '#020303';
  ctx.fillRect(0, 0, width, height);
  ctx.save();
  drawFanClip(ctx, width, height);
  ctx.clip();

  const gradient = ctx.createLinearGradient(0, (7 * height) / 100, 0, (94 * height) / 100);
  gradient.addColorStop(0, '#303635');
  gradient.addColorStop(0.3, '#202526');
  gradient.addColorStop(0.72, '#111617');
  gradient.addColorStop(1, '#090b0c');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const noise = document.createElement('canvas');
  noise.width = 160;
  noise.height = 160;
  const noiseCtx = noise.getContext('2d');

  if (noiseCtx) {
    const image = noiseCtx.createImageData(noise.width, noise.height);
    for (let y = 0; y < noise.height; y += 1) {
      for (let x = 0; x < noise.width; x += 1) {
        const index = (y * noise.width + x) * 4;
        const seed = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        const value = 34 + Math.floor((seed - Math.floor(seed)) * 52);
        image.data[index] = value;
        image.data[index + 1] = value;
        image.data[index + 2] = value;
        image.data[index + 3] = 42;
      }
    }
    noiseCtx.putImageData(image, 0, 0);
    ctx.globalAlpha = 0.38;
    ctx.drawImage(noise, 0, 0, width, height);
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}

function drawRasterMask(
  ctx: CanvasRenderingContext2D,
  item: SimulatorSectorItem,
  rasterMask: SimulatorSectorRasterMask,
  width: number,
  height: number,
) {
  const { r, g, b } = hexToRgb(item.color);
  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = rasterMask.width;
  maskCanvas.height = rasterMask.height;
  const maskCtx = maskCanvas.getContext('2d');

  if (!maskCtx) {
    return;
  }

  const opacity = item.kind === 'vessel' ? 0.82 : 0.48;
  const image = maskCtx.createImageData(rasterMask.width, rasterMask.height);
  for (let index = 0; index < rasterMask.alpha.length && index < rasterMask.width * rasterMask.height; index += 1) {
    const alpha = clamp(Number(rasterMask.alpha[index]) || 0, 0, 255);
    const offset = index * 4;
    image.data[offset] = r;
    image.data[offset + 1] = g;
    image.data[offset + 2] = b;
    image.data[offset + 3] = Math.round(alpha * opacity);
  }
  maskCtx.putImageData(image, 0, 0);

  const top = (8 * height) / 100;
  const fanHeight = (82 * height) / 100;
  const rowHeight = Math.max(1, fanHeight / Math.max(rasterMask.height - 1, 1) + 1.25);
  const warpedCanvas = document.createElement('canvas');
  warpedCanvas.width = Math.ceil(width);
  warpedCanvas.height = Math.ceil(height);
  const warpedCtx = warpedCanvas.getContext('2d');

  if (!warpedCtx) {
    return;
  }

  warpedCtx.save();
  drawFanClip(warpedCtx, width, height);
  warpedCtx.clip();
  warpedCtx.imageSmoothingEnabled = true;
  warpedCtx.imageSmoothingQuality = 'high';
  for (let row = 0; row < rasterMask.height; row += 1) {
    const depthRatio = rasterMask.height <= 1 ? 0 : row / (rasterMask.height - 1);
    const y = top + depthRatio * fanHeight - rowHeight / 2;
    const halfWidth = (depthRatio * 39 * width) / 100;
    const rowWidth = halfWidth * 2;

    if (rowWidth < 0.5) {
      continue;
    }

    warpedCtx.drawImage(maskCanvas, 0, row, rasterMask.width, 1, width / 2 - halfWidth, y, rowWidth, rowHeight);
  }
  warpedCtx.restore();

  ctx.save();
  drawFanClip(ctx, width, height);
  ctx.clip();
  ctx.filter = item.kind === 'vessel' ? 'blur(1.15px)' : 'blur(0.8px)';
  ctx.drawImage(warpedCanvas, 0, 0, width, height);
  ctx.filter = 'none';
  ctx.restore();
}

function isClosedContour(points: Vec2[]): boolean {
  if (points.length < 4) {
    return false;
  }

  const first = points[0];
  const last = points[points.length - 1];
  return Math.hypot(first[0] - last[0], first[1] - last[1]) <= 1.5;
}

export function SectorView({
  activeStructure,
  caseData,
  items,
  selectedPreset,
  setActiveStructure,
  source,
}: {
  activeStructure: string | null;
  caseData: SimulatorCaseManifest;
  items: SimulatorSectorItem[];
  selectedPreset: SimulatorPreset;
  setActiveStructure: (value: string | null) => void;
  source: string;
}) {
  const rasterCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const maxDepth = caseData.render_defaults.max_depth_mm;
  const halfTan = Math.tan(THREE.MathUtils.degToRad(caseData.render_defaults.sector_angle_deg / 2));
  const visibleItems = items.filter((item) => item.visible || item.kind === 'airway' || item.kind === 'contact');

  function itemPosition(item: SimulatorSectorItem) {
    const depthRatio = clamp(item.depthMm / maxDepth, 0, 1);
    const x = 50 + (item.lateralMm / Math.max(maxDepth * halfTan, 1)) * 39;
    const y = 8 + depthRatio * 82;

    return { x: clamp(x, 9, 91), y };
  }

  function sectorPoint(point: Vec2) {
    const [lateralMm, depthMm] = point;
    const depthRatio = clamp(depthMm / maxDepth, 0, 1);
    const x = 50 + (lateralMm / Math.max(maxDepth * halfTan, 1)) * 39;
    const y = 8 + depthRatio * 82;

    return { x: clamp(x, 8, 92), y: clamp(y, 7, 93) };
  }

  function contourPath(points: Vec2[], forceClosed = false) {
    if (points.length < 2) {
      return '';
    }

    const closed = isClosedContour(points) || forceClosed;
    const mapped = points.map(sectorPoint);
    const path = mapped.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(' ');

    return `${path}${closed ? ' Z' : ''}`;
  }

  function itemShape(item: SimulatorSectorItem) {
    const xScale = 39 / Math.max(maxDepth * halfTan, 1);
    const yScale = 82 / Math.max(maxDepth, 1);
    let vector: [number, number] = item.majorAxisVectorMm ?? [1, 0];
    if (!item.majorAxisMm && item.lateralExtentMm && item.depthExtentMm) {
      const lateralSpan = item.lateralExtentMm[1] - item.lateralExtentMm[0];
      const depthSpan = item.depthExtentMm[1] - item.depthExtentMm[0];
      vector = Math.abs(lateralSpan) >= Math.abs(depthSpan) ? [1, 0] : [0, 1];
    }

    const vectorNorm = Math.hypot(vector[0], vector[1]) || 1;
    const unitLateral = vector[0] / vectorNorm;
    const unitDepth = vector[1] / vectorNorm;
    const lateralSpan = item.lateralExtentMm ? Math.abs(item.lateralExtentMm[1] - item.lateralExtentMm[0]) : 0;
    const depthSpan = item.depthExtentMm ? Math.abs(item.depthExtentMm[1] - item.depthExtentMm[0]) : 0;
    const majorMm = Math.max(item.majorAxisMm ?? Math.max(lateralSpan, depthSpan), item.kind === 'vessel' ? 4.5 : 6);
    const minorMm = Math.max(item.minorAxisMm ?? Math.min(lateralSpan || majorMm, depthSpan || majorMm), item.kind === 'vessel' ? 2.5 : 4);
    const majorScale = Math.hypot(unitLateral * xScale, unitDepth * yScale);
    const minorScale = Math.hypot(-unitDepth * xScale, unitLateral * yScale);
    const rawMajor = (majorMm / 2) * majorScale;
    const rawMinor = (minorMm / 2) * minorScale;
    const angleDeg = THREE.MathUtils.radToDeg(Math.atan2(unitDepth * yScale, unitLateral * xScale));

    if (item.kind === 'vessel') {
      const rx = clamp(rawMajor, 4.8, 31);
      const ry = clamp(Math.min(rawMinor, rx * 0.3), 2.3, 9.5);
      return { angleDeg, rx, ry };
    }

    return {
      angleDeg,
      rx: clamp(rawMajor, 6.4, 10.5),
      ry: clamp(rawMinor, 3.8, 7.0),
    };
  }

  const renderItems = [...visibleItems].sort((a, b) => {
    const order = { node: 0, vessel: 1, airway: 2, contact: 3 };
    return order[a.kind] - order[b.kind] || a.depthMm - b.depthMm || a.label.localeCompare(b.label);
  });

  useEffect(() => {
    const canvas = rasterCanvasRef.current;
    const parent = canvas?.parentElement;

    if (!canvas || !parent) {
      return;
    }

    const draw = () => {
      const bounds = canvas.getBoundingClientRect();
      const width = Math.max(1, bounds.width);
      const height = Math.max(1, bounds.height);
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        return;
      }

      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#020303';
      ctx.fillRect(0, 0, width, height);
      const viewSize = Math.min(width, height);
      const viewOffsetX = (width - viewSize) / 2;
      const viewOffsetY = (height - viewSize) / 2;
      ctx.save();
      ctx.translate(viewOffsetX, viewOffsetY);
      drawSectorTexture(ctx, viewSize, viewSize);
      const rasterItems = [...visibleItems]
        .filter((item) => (item.kind === 'node' || item.kind === 'vessel') && item.rasterMask?.alpha?.length)
        .sort((a, b) => {
          const order = { vessel: 0, node: 1 };
          return order[a.kind as 'node' | 'vessel'] - order[b.kind as 'node' | 'vessel'] || a.depthMm - b.depthMm;
        });
      for (const item of rasterItems) {
        if (item.rasterMask) {
          drawRasterMask(ctx, item, item.rasterMask, viewSize, viewSize);
        }
      }
      ctx.restore();
    };

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(parent);
    return () => observer.disconnect();
  }, [visibleItems, maxDepth]);

  return (
    <section className="simulator-sector-pane" aria-label="Labeled EBUS sector" data-sector-source={source}>
      <div className="simulator-pane-header">
        <div>
          <span className="eyebrow">EBUS sector</span>
          <h2>
            Station {formatSimulatorStation(selectedPreset.station)} Node {selectedPreset.node.toUpperCase()}
          </h2>
        </div>
        <span className="simulator-chip">{selectedPreset.approach}</span>
      </div>
      <div className="simulator-sector-viewport">
        <canvas
          ref={rasterCanvasRef}
          className="simulator-sector-raster-canvas"
          data-raster-mask-layer="clean-sector"
          aria-hidden="true"
        />
        <svg className="simulator-sector-svg" viewBox="0 0 100 100" role="img" aria-label="Synchronized labeled EBUS sector">
          <defs>
            <clipPath id="simulatorFanClip">
              <path d="M50 7 L10 92 Q50 99 90 92 Z" />
            </clipPath>
          </defs>
          <path d="M50 7 L10 92 Q50 99 90 92 Z" fill="none" stroke="#d5dde0" strokeOpacity="0.76" strokeWidth="0.55" />
          <g clipPath="url(#simulatorFanClip)">
            <path d="M14 14 C27 22, 72 22, 86 14" stroke="#e7e4dd" strokeOpacity="0.22" strokeWidth="1.25" fill="none" />
            {renderItems.map((item) => {
              const position = itemPosition(item);
              const active = activeStructure === item.id;

              if (item.kind === 'airway') {
                return (
                  <path
                    key={item.id}
                    d="M45.8 14.2 C48.5 16.3, 51.5 16.3, 54.2 14.2"
                    onMouseEnter={() => setActiveStructure(item.id)}
                    onMouseLeave={() => setActiveStructure(null)}
                    stroke={active ? '#fff5c2' : item.color}
                    strokeWidth={active ? 2.2 : 1.5}
                    fill="none"
                  />
                );
              }

              if (item.kind === 'contact') {
                return <circle key={item.id} cx="50" cy="8" r="1.6" fill={item.color} />;
              }

              const shape = itemShape(item);
              const contourPaths = (item.contoursMm ?? []).map((contour, index) => ({
                closed: item.contourClosed?.[index] ?? isClosedContour(contour),
                path: contourPath(contour),
              })).filter((contour) => contour.path.length > 0);

              return (
                <g
                  key={item.id}
                  tabIndex={0}
                  className="simulator-sector-hotspot"
                  data-structure-id={item.id}
                  data-contour-count={contourPaths.length}
                  onMouseEnter={() => setActiveStructure(item.id)}
                  onMouseLeave={() => setActiveStructure(null)}
                  onFocus={() => setActiveStructure(item.id)}
                  onBlur={() => setActiveStructure(null)}
                >
                  {contourPaths.length > 0 ? (
                    contourPaths.map((contour, index) => (
                      <path
                        key={`${item.id}-contour-${index}`}
                        d={contour.path}
                        fill={contour.closed && !item.rasterMask?.alpha?.length ? item.color : 'none'}
                        fillOpacity={item.kind === 'vessel' ? 0.66 : 0.5}
                        stroke={active ? '#dcffd0' : item.kind === 'node' ? '#9cf0a2' : item.color}
                        strokeOpacity={active ? 0.9 : 0.62}
                        strokeWidth={active ? 0.8 : 0.42}
                      />
                    ))
                  ) : (
                    <ellipse
                      cx={position.x}
                      cy={position.y}
                      rx={active ? shape.rx * 1.08 : shape.rx}
                      ry={active ? shape.ry * 1.08 : shape.ry}
                      transform={`rotate(${shape.angleDeg.toFixed(1)} ${position.x.toFixed(2)} ${position.y.toFixed(2)})`}
                      fill={item.color}
                      fillOpacity={item.kind === 'node' ? 0.58 : 0.66}
                      stroke={active ? '#dcffd0' : item.color}
                      strokeOpacity={active ? 0.96 : 0.82}
                      strokeWidth={active ? 1.0 : 0.5}
                    />
                  )}
                  {active ? (
                    <text x={clamp(position.x + 3.2, 15, 85)} y={clamp(position.y - 4.5, 14, 88)} fill="#d9f0ee" fontSize="2.8">
                      {item.label}
                    </text>
                  ) : null}
                </g>
              );
            })}
          </g>
          <line x1="94" y1="10" x2="94" y2="91" stroke="#758086" strokeOpacity="0.34" strokeWidth="0.5" />
          {[0, 10, 20, 30, 40].map((tick) => (
            <g key={tick}>
              <line x1="92.2" x2="94" y1={8 + (tick / maxDepth) * 82} y2={8 + (tick / maxDepth) * 82} stroke="#758086" strokeOpacity="0.38" strokeWidth="0.45" />
              <text x="95" y={9 + (tick / maxDepth) * 82} fill="#8d999e" fillOpacity="0.5" fontSize="2.55">
                {tick}
              </text>
            </g>
          ))}
          <text x="13" y="96" fill="#8d999e" fillOpacity="0.58" fontSize="2.55">
            caudal
          </text>
          <text x="76" y="96" fill="#8d999e" fillOpacity="0.58" fontSize="2.55">
            cephalic
          </text>
        </svg>
      </div>
      <div className="simulator-structure-list">
        {visibleItems.filter((item) => item.kind !== 'contact').map((item) => (
          <button
            key={item.id}
            type="button"
            className={activeStructure === item.id ? 'simulator-structure-row simulator-structure-row--active' : 'simulator-structure-row'}
            onMouseEnter={() => setActiveStructure(item.id)}
            onMouseLeave={() => setActiveStructure(null)}
            onFocus={() => setActiveStructure(item.id)}
            onBlur={() => setActiveStructure(null)}
          >
            <span className="simulator-swatch" style={{ backgroundColor: item.color }} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
