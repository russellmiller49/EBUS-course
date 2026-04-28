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

function rgbToHsl(r: number, g: number, b: number) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rn) {
      h = (gn - bn) / d + (gn < bn ? 6 : 0);
    } else if (max === gn) {
      h = (bn - rn) / d + 2;
    } else {
      h = (rn - gn) / d + 4;
    }
    h /= 6;
  }

  return { h, s, l };
}

function hslToRgb(h: number, s: number, l: number) {
  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  };
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function adjustHsl(color: string, saturation: number, lightness: number) {
  const { r, g, b } = hexToRgb(color);
  const hsl = rgbToHsl(r, g, b);
  const out = hslToRgb(hsl.h, clamp(saturation, 0, 1), clamp(lightness, 0, 1));
  return `rgb(${out.r}, ${out.g}, ${out.b})`;
}

function tintForKind(kind: 'node' | 'vessel', alphaRatio: number, baseColor: string) {
  const base = hexToRgb(baseColor);

  if (kind === 'vessel') {
    const lowR = 10;
    const lowG = 13;
    const lowB = 16;
    const rimWeight = 4 * alphaRatio * (1 - alphaRatio);
    const tintMix = 0.28 + rimWeight * 0.36;
    return {
      r: Math.round(lerp(lowR, base.r, tintMix)),
      g: Math.round(lerp(lowG, base.g, tintMix)),
      b: Math.round(lerp(lowB, base.b, tintMix)),
      opacity: 0.84,
    };
  }

  const hsl = rgbToHsl(base.r, base.g, base.b);
  const high = hslToRgb(hsl.h, 0.28, 0.42);
  const lowMixT = 0.12;
  const lowR = lerp(0x1a, base.r, lowMixT);
  const lowG = lerp(0x1f, base.g, lowMixT);
  const lowB = lerp(0x1d, base.b, lowMixT);
  const t = smoothstep(0.15, 0.85, alphaRatio);
  return {
    r: Math.round(lerp(lowR, high.r, t)),
    g: Math.round(lerp(lowG, high.g, t)),
    b: Math.round(lerp(lowB, high.b, t)),
    opacity: 0.62,
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

function hash2(ix: number, iy: number) {
  const s = Math.sin(ix * 127.1 + iy * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function valueNoise2D(x: number, y: number) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const u = fx * fx * (3 - 2 * fx);
  const v = fy * fy * (3 - 2 * fy);
  const a = hash2(ix, iy);
  const b = hash2(ix + 1, iy);
  const c = hash2(ix, iy + 1);
  const d = hash2(ix + 1, iy + 1);
  return lerp(lerp(a, b, u), lerp(c, d, u), v);
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
  noise.width = 240;
  noise.height = 240;
  const noiseCtx = noise.getContext('2d');

  if (noiseCtx) {
    const image = noiseCtx.createImageData(noise.width, noise.height);
    const baseScale = 0.045;
    for (let y = 0; y < noise.height; y += 1) {
      for (let x = 0; x < noise.width; x += 1) {
        const index = (y * noise.width + x) * 4;
        const n1 = valueNoise2D(x * baseScale, y * baseScale);
        const n2 = valueNoise2D(x * baseScale * 2, y * baseScale * 2);
        const n3 = valueNoise2D(x * baseScale * 4, y * baseScale * 4);
        const summed = (n1 * 0.6 + n2 * 0.3 + n3 * 0.15) / (0.6 + 0.3 + 0.15);
        const value = 28 + Math.floor(summed * 38);
        image.data[index] = value;
        image.data[index + 1] = value;
        image.data[index + 2] = value;
        image.data[index + 3] = 42;
      }
    }
    noiseCtx.putImageData(image, 0, 0);
    ctx.globalAlpha = 0.32;
    ctx.drawImage(noise, 0, 0, width, height);
    ctx.globalAlpha = 1;
  }

  const vignette = ctx.createRadialGradient(width * 0.5, 0, 0, width * 0.5, height, height * 1.15);
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, 'rgba(0,0,0,0.28)');
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'source-over';

  const bloom = ctx.createLinearGradient(0, (7 * height) / 100, 0, (25 * height) / 100);
  bloom.addColorStop(0, 'rgba(255,255,255,0.05)');
  bloom.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = bloom;
  ctx.fillRect(0, 0, width, (25 * height) / 100);
  ctx.globalCompositeOperation = 'source-over';

  ctx.restore();
}

function drawRasterMask(
  ctx: CanvasRenderingContext2D,
  item: SimulatorSectorItem,
  rasterMask: SimulatorSectorRasterMask,
  width: number,
  height: number,
) {
  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = rasterMask.width;
  maskCanvas.height = rasterMask.height;
  const maskCtx = maskCanvas.getContext('2d');

  if (!maskCtx) {
    return;
  }

  const kind: 'node' | 'vessel' = item.kind === 'vessel' ? 'vessel' : 'node';
  const image = maskCtx.createImageData(rasterMask.width, rasterMask.height);
  for (let index = 0; index < rasterMask.alpha.length && index < rasterMask.width * rasterMask.height; index += 1) {
    const alpha = clamp(Number(rasterMask.alpha[index]) || 0, 0, 255);
    const offset = index * 4;
    const tint = tintForKind(kind, alpha / 255, item.color);
    image.data[offset] = tint.r;
    image.data[offset + 1] = tint.g;
    image.data[offset + 2] = tint.b;
    image.data[offset + 3] = Math.round(alpha * tint.opacity);
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
  ctx.filter = item.kind === 'vessel' ? 'blur(2.2px)' : 'blur(1.6px)';
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

    if (mapped.length < 3) {
      const fallback = mapped
        .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
        .join(' ');
      return `${fallback}${closed ? ' Z' : ''}`;
    }

    const get = (index: number) => {
      if (closed) {
        return mapped[((index % mapped.length) + mapped.length) % mapped.length];
      }
      return mapped[Math.max(0, Math.min(mapped.length - 1, index))];
    };

    const segCount = closed ? mapped.length : mapped.length - 1;
    const tension = 0.5;
    let d = `M${mapped[0].x.toFixed(2)} ${mapped[0].y.toFixed(2)}`;

    for (let i = 0; i < segCount; i += 1) {
      const p0 = get(i - 1);
      const p1 = get(i);
      const p2 = get(i + 1);
      const p3 = get(i + 2);
      const cp1x = p1.x + ((p2.x - p0.x) * tension) / 3;
      const cp1y = p1.y + ((p2.y - p0.y) * tension) / 3;
      const cp2x = p2.x - ((p3.x - p1.x) * tension) / 3;
      const cp2y = p2.y - ((p3.y - p1.y) * tension) / 3;
      d += ` C${cp1x.toFixed(2)} ${cp1y.toFixed(2)} ${cp2x.toFixed(2)} ${cp2y.toFixed(2)} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
    }

    if (closed) {
      d += ' Z';
    }

    return d;
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

  function itemArea(item: SimulatorSectorItem) {
    const lateralSpan = item.lateralExtentMm ? Math.abs(item.lateralExtentMm[1] - item.lateralExtentMm[0]) : 0;
    const depthSpan = item.depthExtentMm ? Math.abs(item.depthExtentMm[1] - item.depthExtentMm[0]) : 0;
    const fromExtents = lateralSpan * depthSpan;
    const fromAxes = (item.majorAxisMm ?? 0) * (item.minorAxisMm ?? 0);
    return Math.max(fromExtents, fromAxes, 1);
  }

  const renderItems = [...visibleItems].sort((a, b) => {
    const kindOrder = { vessel: 0, node: 1, airway: 2, contact: 3 };
    const kindDiff = kindOrder[a.kind] - kindOrder[b.kind];
    if (kindDiff !== 0) return kindDiff;
    const areaDiff = itemArea(b) - itemArea(a);
    if (areaDiff !== 0) return areaDiff;
    return b.depthMm - a.depthMm;
  });
  const activeItem = renderItems.find((item) => item.id === activeStructure && item.kind !== 'contact') ?? null;
  const activeItemPosition = activeItem ? itemPosition(activeItem) : null;
  const activeCalloutSide = activeItemPosition && activeItemPosition.x <= 50 ? 'left' : 'right';
  const activeCalloutAnchor = activeItemPosition
    ? {
        x: activeCalloutSide === 'left' ? 13 : 87,
        y: clamp(activeItemPosition.y, 14, 86),
      }
    : null;
  const activeKindLabel = activeItem?.kind === 'node'
    ? 'lymph node'
    : activeItem?.kind === 'vessel'
      ? 'vessel'
      : activeItem?.kind === 'airway'
        ? 'airway'
        : '';

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
      for (const item of renderItems) {
        if ((item.kind === 'node' || item.kind === 'vessel') && item.rasterMask?.alpha?.length) {
          drawRasterMask(ctx, item, item.rasterMask, viewSize, viewSize);
        }
      }
      ctx.restore();
    };

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(parent);
    return () => observer.disconnect();
  }, [renderItems, maxDepth]);

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
            <filter id="sectorEdgeSoften" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="0.35" />
            </filter>
            <filter id="sectorActiveGlow" x="-25%" y="-25%" width="150%" height="150%">
              <feGaussianBlur stdDeviation="0.7" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path d="M50 7 L10 92 Q50 99 90 92 Z" fill="none" stroke="#d5dde0" strokeOpacity="0.76" strokeWidth="0.55" />
          <g clipPath="url(#simulatorFanClip)">
            <path d="M14 14 C27 22, 72 22, 86 14" stroke="#e7e4dd" strokeOpacity="0.22" strokeWidth="1.25" fill="none" />
            {renderItems.map((item) => {
              const position = itemPosition(item);
              const active = activeStructure === item.id;

              if (item.kind === 'airway') {
                const airwayStroke = adjustHsl(item.color, 0.55, active ? 0.78 : 0.6);
                return (
                  <path
                    key={item.id}
                    d="M45.8 14.2 C48.5 16.3, 51.5 16.3, 54.2 14.2"
                    onMouseEnter={() => setActiveStructure(item.id)}
                    onMouseLeave={() => setActiveStructure(null)}
                    stroke={airwayStroke}
                    strokeOpacity={active ? 0.92 : 0.78}
                    strokeWidth={active ? 2.0 : 1.4}
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
              const baseHsl = (() => {
                const { r, g, b } = hexToRgb(item.color);
                return rgbToHsl(r, g, b);
              })();
              const rimColor = adjustHsl(item.color, clamp(baseHsl.s * 0.9, 0, 1), clamp(baseHsl.l * 0.55, 0.12, 0.5));
              const activeRim = adjustHsl(item.color, baseHsl.s, 0.88);
              const strokeColor = active ? activeRim : rimColor;

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
                  filter={active ? 'url(#sectorActiveGlow)' : undefined}
                >
                  {contourPaths.length > 0 ? (
                    contourPaths.map((contour, index) => (
                      <path
                        key={`${item.id}-contour-${index}`}
                        d={contour.path}
                        fill={contour.closed ? item.color : 'none'}
                        fillOpacity={contour.closed ? (active ? 0.98 : 0.92) : 0}
                        stroke={strokeColor}
                        strokeOpacity={active ? 0.95 : 0.7}
                        strokeWidth={active ? 0.6 : 0.35}
                        strokeLinejoin="round"
                        filter="url(#sectorEdgeSoften)"
                      />
                    ))
                  ) : (
                    <ellipse
                      cx={position.x}
                      cy={position.y}
                      rx={active ? shape.rx * 1.06 : shape.rx}
                      ry={active ? shape.ry * 1.06 : shape.ry}
                      transform={`rotate(${shape.angleDeg.toFixed(1)} ${position.x.toFixed(2)} ${position.y.toFixed(2)})`}
                      fill={item.color}
                      fillOpacity={active ? 0.98 : 0.92}
                      stroke={strokeColor}
                      strokeOpacity={active ? 0.95 : 0.7}
                      strokeWidth={active ? 0.6 : 0.35}
                      filter="url(#sectorEdgeSoften)"
                    />
                  )}
                </g>
              );
            })}
          </g>
          {activeItem && activeItemPosition && activeCalloutAnchor ? (
            <g className="simulator-sector-label-leader" pointerEvents="none">
              <path
                d={`M${activeItemPosition.x.toFixed(2)} ${activeItemPosition.y.toFixed(2)} L${activeCalloutAnchor.x.toFixed(2)} ${activeCalloutAnchor.y.toFixed(2)}`}
              />
              <circle cx={activeItemPosition.x} cy={activeItemPosition.y} r="0.8" />
            </g>
          ) : null}
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
        {activeItem && activeCalloutAnchor ? (
          <div
            className={`simulator-sector-callout simulator-sector-callout--${activeCalloutSide}`}
            style={{
              left: `${activeCalloutAnchor.x}%`,
              top: `${activeCalloutAnchor.y}%`,
            }}
          >
            <span className="simulator-sector-callout__swatch" style={{ backgroundColor: activeItem.color }} />
            <span className="simulator-sector-callout__text">
              <span>{activeItem.label}</span>
              <span>{activeKindLabel}</span>
            </span>
          </div>
        ) : null}
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
