import {
  buildStructureVisibilityEntries,
  clampOrbitPolar,
  clampOrbitRadius,
  formatStructureLabel,
  normalizeMeshKey,
  toSceneCoordinates,
} from '../viewer-logic';
import { getCase3DManifest } from '../content';

const manifest = getCase3DManifest();

describe('normalizeMeshKey', () => {
  it('normalizes spaces and casing so GLB node names can match manifest labels', () => {
    expect(normalizeMeshKey('Station 4R')).toBe('station_4r');
    expect(normalizeMeshKey(' superior vena cava ')).toBe('superior_vena_cava');
  });
});

describe('formatStructureLabel', () => {
  it('turns underscored node names into readable labels', () => {
    expect(formatStructureLabel('superior_vena_cava')).toBe('Superior Vena Cava');
    expect(formatStructureLabel('Station_4R')).toBe('Station 4R');
  });
});

describe('toSceneCoordinates', () => {
  it('maps case-space markup points into the GLB scene frame', () => {
    expect(toSceneCoordinates([-10, -200, 1250])).toEqual([-0.01, 1.25, 0.2]);
  });
});

describe('orbit clamps', () => {
  it('keeps orbit polar and radius in a usable range', () => {
    expect(clampOrbitPolar(0)).toBeGreaterThan(0);
    expect(clampOrbitPolar(Math.PI)).toBeLessThan(Math.PI);
    expect(clampOrbitRadius(0.01, 0.2)).toBeGreaterThanOrEqual(0.12);
    expect(clampOrbitRadius(5, 0.2)).toBeLessThanOrEqual(0.56);
  });
});

describe('buildStructureVisibilityEntries', () => {
  it('groups targets by resolved structure and marks hidden structures', () => {
    const entries = buildStructureVisibilityEntries(manifest.targets, ['airway']);
    const airwayEntry = entries.find((entry) => entry.key === 'airway');
    const station4r = entries.find((entry) => entry.key === 'station_4r');

    expect(airwayEntry.hidden).toBe(true);
    expect(airwayEntry.targetCount).toBeGreaterThan(1);
    expect(station4r.targetIds).toEqual(['node_4R_1', 'node_4R_2', 'node_4R_3']);
  });
});
