const fs = require('fs');
const path = require('path');

const {
  deriveAxisMap,
  generateCaseOutputs,
  mapFrameIndex,
  parseMarkupFile,
  parseNrrdHeader,
  worldToContinuousVoxel,
} = require('../case-001-enrichment');
const {
  axialSliceAssets,
  coronalSliceAssets,
  sagittalSliceAssets,
} = require('../../content/cases/generated/case_001-asset-index');

const repoRoot = path.resolve(__dirname, '../..');

describe('parseMarkupFile', () => {
  it('reads the first control point and coordinate system from a markup file', () => {
    const markupPath = path.join(repoRoot, 'model/markups/4R_1.mrk.json');
    const parsed = parseMarkupFile(fs.readFileSync(markupPath, 'utf8'), markupPath);

    expect(parsed.coordinateSystem).toBe('LPS');
    expect(parsed.position[0]).toBeCloseTo(-17.060216670665696);
    expect(parsed.position[1]).toBeCloseTo(-177.95478321979417);
    expect(parsed.position[2]).toBeCloseTo(1220.0412926391382);
  });
});

describe('NRRD geometry mapping', () => {
  const ctPath = path.join(repoRoot, 'model/case_001_ct.nrrd');
  const geometry = parseNrrdHeader(fs.readFileSync(ctPath));

  it('derives the expected axis map from CT directions', () => {
    expect(deriveAxisMap(geometry.spaceDirections)).toEqual({
      sagittal: 'i',
      coronal: 'j',
      axial: 'k',
    });
  });

  it('converts a real LPS target point into continuous voxel space', () => {
    const markupPath = path.join(repoRoot, 'model/markups/4R_1.mrk.json');
    const markup = parseMarkupFile(fs.readFileSync(markupPath, 'utf8'), markupPath);
    const voxel = worldToContinuousVoxel(markup.position, geometry);

    expect(voxel[0]).toBeCloseTo(152.15622837774478);
    expect(voxel[1]).toBeCloseTo(123.76802702314234);
    expect(voxel[2]).toBeCloseTo(74.72065852660035);
  });
});

describe('mapFrameIndex', () => {
  it('maps normalized positions into exported frame indices when frame count differs from voxel depth', () => {
    expect(mapFrameIndex(0.5, 60, 121, 180)).toBe(90);
    expect(mapFrameIndex(0.9, 109, 121, 121)).toBe(109);
  });

  it('honors reversed coverage assumptions for exported slice stacks', () => {
    expect(mapFrameIndex(0.434640522875817, 133, 307, 160, [1, 0])).toBe(90);
  });
});

describe('generated outputs', () => {
  it('builds the enriched manifest and the asset index using local assets', () => {
    const outputs = generateCaseOutputs(repoRoot);

    expect(outputs.enrichedManifest.targets).toHaveLength(56);
    expect(outputs.runtimeManifest.targets).toHaveLength(56);
    expect(outputs.enrichedManifest.targets.every((target) => target.sliceIndex.axial !== null)).toBe(true);
    expect(outputs.enrichedManifest.volumeGeometry.coordinateSystem).toBe('LPS');
    expect(outputs.enrichedManifest.patientToScene.name).toBe('patientToScene');
    expect(outputs.enrichedManifest.targets[0].world.coordinateSystem).toBe('LPS');
    expect(outputs.enrichedManifest.sliceTextureMetadata.coronal.sourceLooksCropped).toBe(true);
    expect(outputs.runtimeManifest.segmentation.coordinateSystem).toBe('LPS');
    expect(outputs.runtimeManifest.segmentation.segments.length).toBeGreaterThan(10);
    expect(outputs.runtimeManifest.bounds.union.coordinateSystem).toBe('LPS');
    expect(outputs.runtimeManifest.targets.every((target) => target.insideCtBounds)).toBe(true);
    expect(outputs.enrichedManifest.warnings.length).toBeGreaterThan(0);
    expect(outputs.assetIndexSource).toContain('export const axialSliceAssets');
  });

  it('exports the generated asset arrays with the expected shape', () => {
    expect(axialSliceAssets).toHaveLength(180);
    expect(coronalSliceAssets).toHaveLength(220);
    expect(sagittalSliceAssets).toHaveLength(160);
  });
});
