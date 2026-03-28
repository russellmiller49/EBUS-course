import { useState } from 'react';

import type { KnobologyProcessorActionId } from '@/features/knobology/logic';

interface EuMe2ImageMeta {
  src: string;
  width: number;
  height: number;
  notes?: string;
}

interface EuMe2Trackball {
  cx: number;
  cy: number;
  r: number;
}

interface EuMe2Region {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface EuMe2RectHotspot {
  id: string;
  label: string;
  shape: 'rect';
  x: number;
  y: number;
  w: number;
  h: number;
  action: KnobologyProcessorActionId;
}

interface EuMe2CircleHotspot {
  id: string;
  label: string;
  shape: 'circle';
  cx: number;
  cy: number;
  r: number;
  action: KnobologyProcessorActionId;
}

export type EuMe2Hotspot = EuMe2RectHotspot | EuMe2CircleHotspot;

export interface EuMe2Layout {
  image: EuMe2ImageMeta;
  trackball: EuMe2Trackball;
  regions: Record<string, EuMe2Region>;
  hotspots: EuMe2Hotspot[];
}

function getHotspotStyle(hotspot: EuMe2Hotspot) {
  if (hotspot.shape === 'rect') {
    return {
      left: `${hotspot.x * 100}%`,
      top: `${hotspot.y * 100}%`,
      width: `${hotspot.w * 100}%`,
      height: `${hotspot.h * 100}%`,
    };
  }

  return {
    left: `${(hotspot.cx - hotspot.r) * 100}%`,
    top: `${(hotspot.cy - hotspot.r) * 100}%`,
    width: `${hotspot.r * 200}%`,
    height: `${hotspot.r * 200}%`,
    borderRadius: '999px',
  };
}

export function EuMe2Keyboard({
  activeActionId,
  debug = false,
  layout,
  onAction,
}: {
  activeActionId?: KnobologyProcessorActionId | null;
  debug?: boolean;
  layout: EuMe2Layout;
  onAction: (actionId: KnobologyProcessorActionId) => void;
}) {
  const [hoveredHotspotId, setHoveredHotspotId] = useState<string | null>(null);
  const [pressedHotspotId, setPressedHotspotId] = useState<string | null>(null);

  return (
    <figure className={`eu-me2${debug ? ' eu-me2--debug' : ''}`}>
      <div className="eu-me2__frame" style={{ aspectRatio: `${layout.image.width} / ${layout.image.height}` }}>
        <img alt="Olympus EU-ME2 processor keyboard" className="eu-me2__image" src={layout.image.src} />
        <div className="eu-me2__overlay">
          {debug ? (
            <>
              <div
                className="eu-me2__trackball"
                style={{
                  left: `${(layout.trackball.cx - layout.trackball.r) * 100}%`,
                  top: `${(layout.trackball.cy - layout.trackball.r) * 100}%`,
                  width: `${layout.trackball.r * 200}%`,
                  height: `${layout.trackball.r * 200}%`,
                }}
              >
                <span>Trackball</span>
              </div>
              {Object.entries(layout.regions).map(([regionId, region]) => (
                <div
                  key={regionId}
                  className="eu-me2__region"
                  style={{
                    left: `${region.x * 100}%`,
                    top: `${region.y * 100}%`,
                    width: `${region.w * 100}%`,
                    height: `${region.h * 100}%`,
                  }}
                >
                  <span>{regionId}</span>
                </div>
              ))}
            </>
          ) : null}

          {layout.hotspots.map((hotspot) => {
            const isActive =
              hoveredHotspotId === hotspot.id ||
              pressedHotspotId === hotspot.id ||
              activeActionId === hotspot.action;

            return (
              <button
                key={hotspot.id}
                aria-label={`${hotspot.label} (${hotspot.action})`}
                aria-pressed={activeActionId === hotspot.action}
                className={`eu-me2__hotspot eu-me2__hotspot--${hotspot.shape}${isActive ? ' eu-me2__hotspot--active' : ''}`}
                onBlur={() => setHoveredHotspotId((current) => (current === hotspot.id ? null : current))}
                onClick={() => onAction(hotspot.action)}
                onFocus={() => setHoveredHotspotId(hotspot.id)}
                onMouseEnter={() => setHoveredHotspotId(hotspot.id)}
                onMouseLeave={() => {
                  setHoveredHotspotId((current) => (current === hotspot.id ? null : current));
                  setPressedHotspotId((current) => (current === hotspot.id ? null : current));
                }}
                onPointerDown={() => setPressedHotspotId(hotspot.id)}
                onPointerUp={() => setPressedHotspotId((current) => (current === hotspot.id ? null : current))}
                style={getHotspotStyle(hotspot)}
                type="button"
              >
                <span className="sr-only">{hotspot.label}</span>
                {debug ? (
                  <span className="eu-me2__hotspot-label">
                    {hotspot.label}
                    <small>{hotspot.action}</small>
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
      <figcaption className="eu-me2__caption">{layout.image.notes}</figcaption>
    </figure>
  );
}
