import fs from 'node:fs';
import path from 'node:path';

import { mapNormalizedToFrameIndex } from '../features/case3d/slice-logic';
import type {
  AxisMap,
  AxisName,
  CaseManifest,
  CasePlane,
  CaseTarget,
  EnrichedCaseManifest,
  EnrichedCaseTarget,
  SliceIndex,
  ToggleSetId,
} from '../features/case3d/types';

const AXIS_ORDER: AxisName[] = ['i', 'j', 'k'];
const PLANES: CasePlane[] = ['axial', 'coronal', 'sagittal'];
const DEFAULT_GENERATED_DIR = path.join('content', 'cases', 'generated');
const ENRICHED_MANIFEST_PATH = path.join(DEFAULT_GENERATED_DIR, 'case_001.enriched.json');
const ASSET_INDEX_PATH = path.join(DEFAULT_GENERATED_DIR, 'case_001-asset-index.ts');

type Matrix3 = [
  [number, number, number],
  [number, number, number],
  [number, number, number],
];

type Vector3 = [number, number, number];

interface ParsedMarkup {
  coordinateSystem: string;
  position: Vector3;
}

export interface NrrdGeometry {
  sizes: Vector3;
  spaceDirections: Matrix3;
  spaceOrigin: Vector3;
}

interface ResolvedCasePaths {
  manifestPath: string;
  ctVolumePath: string;
  glbPath: string;
  segmentationPath: string | null;
}

export interface GeneratedCaseOutputs {
  enrichedManifest: EnrichedCaseManifest;
  assetIndexSource: string;
  enrichedManifestPath: string;
  assetIndexPath: string;
}

export function naturalCompare(left: string, right: string): number {
  return left.localeCompare(right, undefined, {
    numeric: true,
    sensitivity: 'base',
  });
}

export function readSeedManifest(manifestPath: string): CaseManifest {
  return JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as CaseManifest;
}

export function parseMarkupFile(fileContents: string, filePath = 'markup'): ParsedMarkup {
  const parsed = JSON.parse(fileContents) as {
    markups?: Array<{
      coordinateSystem?: unknown;
      controlPoints?: Array<{
        position?: unknown;
      }>;
    }>;
  };
  const markups = parsed.markups;

  if (!Array.isArray(markups) || markups.length === 0) {
    throw new Error(`${filePath} is missing markups[0].`);
  }

  const firstMarkup = markups[0];
  const controlPoints = firstMarkup.controlPoints;

  if (!Array.isArray(controlPoints) || controlPoints.length === 0) {
    throw new Error(`${filePath} is missing markups[0].controlPoints[0].`);
  }

  const firstPoint = controlPoints[0];

  if (
    !Array.isArray(firstPoint.position) ||
    firstPoint.position.length !== 3 ||
    firstPoint.position.some((value) => typeof value !== 'number' || Number.isNaN(value))
  ) {
    throw new Error(`${filePath} has a non-numeric markups[0].controlPoints[0].position.`);
  }

  return {
    coordinateSystem: typeof firstMarkup.coordinateSystem === 'string' ? firstMarkup.coordinateSystem : 'UNKNOWN',
    position: [firstPoint.position[0], firstPoint.position[1], firstPoint.position[2]],
  };
}

export function extractNrrdHeader(buffer: Buffer): string {
  const doubleLf = buffer.indexOf('\n\n');

  if (doubleLf >= 0) {
    return buffer.slice(0, doubleLf).toString('utf8');
  }

  const doubleCrLf = buffer.indexOf('\r\n\r\n');

  if (doubleCrLf >= 0) {
    return buffer.slice(0, doubleCrLf).toString('utf8');
  }

  throw new Error('Unable to locate the NRRD header separator.');
}

function parseVector3(fieldValue: string, fieldName: string): Vector3 {
  const values = fieldValue
    .trim()
    .replace(/^\(/, '')
    .replace(/\)$/, '')
    .split(',')
    .map((value) => Number(value.trim()));

  if (values.length !== 3 || values.some((value) => Number.isNaN(value))) {
    throw new Error(`Unable to parse ${fieldName} as a 3D vector.`);
  }

  return [values[0], values[1], values[2]];
}

export function parseNrrdHeader(input: string | Buffer): NrrdGeometry {
  const headerText = Buffer.isBuffer(input) ? extractNrrdHeader(input) : input;
  const sizesMatch = headerText.match(/^sizes:\s*([^\n\r]+)$/m);
  const directionsMatch = headerText.match(/^space directions:\s*([^\n\r]+)$/m);
  const originMatch = headerText.match(/^space origin:\s*(\([^)]+\))$/m);

  if (!sizesMatch) {
    throw new Error('NRRD header is missing sizes.');
  }

  if (!directionsMatch) {
    throw new Error('NRRD header is missing space directions.');
  }

  if (!originMatch) {
    throw new Error('NRRD header is missing space origin.');
  }

  const sizes = sizesMatch[1]
    .trim()
    .split(/\s+/)
    .map((value) => Number(value)) as Vector3;

  if (sizes.length !== 3 || sizes.some((value) => !Number.isFinite(value))) {
    throw new Error('NRRD header sizes must describe exactly three numeric axes.');
  }

  const directionMatches = [...directionsMatch[1].matchAll(/\([^)]+\)/g)];

  if (directionMatches.length !== 3) {
    throw new Error('NRRD header must contain exactly three space direction vectors.');
  }

  return {
    sizes,
    spaceDirections: [
      parseVector3(directionMatches[0][0], 'space directions[0]'),
      parseVector3(directionMatches[1][0], 'space directions[1]'),
      parseVector3(directionMatches[2][0], 'space directions[2]'),
    ],
    spaceOrigin: parseVector3(originMatch[1], 'space origin'),
  };
}

function buildDirectionMatrix(spaceDirections: Matrix3): Matrix3 {
  return [
    [spaceDirections[0][0], spaceDirections[1][0], spaceDirections[2][0]],
    [spaceDirections[0][1], spaceDirections[1][1], spaceDirections[2][1]],
    [spaceDirections[0][2], spaceDirections[1][2], spaceDirections[2][2]],
  ];
}

export function invertMatrix3(matrix: Matrix3): Matrix3 {
  const [[a, b, c], [d, e, f], [g, h, i]] = matrix;
  const cofactor00 = e * i - f * h;
  const cofactor01 = -(d * i - f * g);
  const cofactor02 = d * h - e * g;
  const cofactor10 = -(b * i - c * h);
  const cofactor11 = a * i - c * g;
  const cofactor12 = -(a * h - b * g);
  const cofactor20 = b * f - c * e;
  const cofactor21 = -(a * f - c * d);
  const cofactor22 = a * e - b * d;
  const determinant = a * cofactor00 + b * cofactor01 + c * cofactor02;

  if (Math.abs(determinant) < 1e-8) {
    throw new Error('Unable to invert the CT direction matrix.');
  }

  return [
    [cofactor00 / determinant, cofactor10 / determinant, cofactor20 / determinant],
    [cofactor01 / determinant, cofactor11 / determinant, cofactor21 / determinant],
    [cofactor02 / determinant, cofactor12 / determinant, cofactor22 / determinant],
  ];
}

function multiplyMatrixVector(matrix: Matrix3, vector: Vector3): Vector3 {
  return [
    matrix[0][0] * vector[0] + matrix[0][1] * vector[1] + matrix[0][2] * vector[2],
    matrix[1][0] * vector[0] + matrix[1][1] * vector[1] + matrix[1][2] * vector[2],
    matrix[2][0] * vector[0] + matrix[2][1] * vector[1] + matrix[2][2] * vector[2],
  ];
}

export function worldToContinuousVoxel(pointLps: Vector3, geometry: NrrdGeometry): Vector3 {
  const lpsToIjk = invertMatrix3(buildDirectionMatrix(geometry.spaceDirections));
  const relativePoint: Vector3 = [
    pointLps[0] - geometry.spaceOrigin[0],
    pointLps[1] - geometry.spaceOrigin[1],
    pointLps[2] - geometry.spaceOrigin[2],
  ];

  return multiplyMatrixVector(lpsToIjk, relativePoint);
}

export function clampContinuousVoxel(voxel: Vector3, sizes: Vector3): Vector3 {
  return voxel.map((value, index) => {
    const upper = Math.max(0, sizes[index] - 1);
    return Math.min(upper, Math.max(0, value));
  }) as Vector3;
}

export function roundVoxel(voxel: Vector3, sizes: Vector3): Vector3 {
  return clampContinuousVoxel(voxel, sizes).map((value) => Math.round(value)) as Vector3;
}

const AXIS_PERMUTATIONS: AxisName[][] = [
  ['i', 'j', 'k'],
  ['i', 'k', 'j'],
  ['j', 'i', 'k'],
  ['j', 'k', 'i'],
  ['k', 'i', 'j'],
  ['k', 'j', 'i'],
];

export function deriveAxisMap(spaceDirections: Matrix3): AxisMap {
  const scores = spaceDirections.map((vector) => vector.map((value) => Math.abs(value)) as Vector3);
  const ranked = AXIS_PERMUTATIONS
    .map((candidate) => {
      const sagittalIndex = AXIS_ORDER.indexOf(candidate[0]);
      const coronalIndex = AXIS_ORDER.indexOf(candidate[1]);
      const axialIndex = AXIS_ORDER.indexOf(candidate[2]);
      const score = scores[sagittalIndex][0] + scores[coronalIndex][1] + scores[axialIndex][2];

      return {
        candidate: {
          sagittal: candidate[0],
          coronal: candidate[1],
          axial: candidate[2],
        } satisfies AxisMap,
        score,
      };
    })
    .sort((left, right) => right.score - left.score);

  return ranked[0].candidate;
}

function axisNameToIndex(axis: AxisName): number {
  return AXIS_ORDER.indexOf(axis);
}

function normalizeVoxelIndex(index: number, axisLength: number): number {
  if (axisLength <= 1) {
    return 0;
  }

  return Math.min(1, Math.max(0, index / (axisLength - 1)));
}

export function buildNormalizedPositions(roundedVoxel: Vector3, sizes: Vector3, axisMap: AxisMap): Record<CasePlane, number> {
  return {
    sagittal: normalizeVoxelIndex(roundedVoxel[axisNameToIndex(axisMap.sagittal)], sizes[axisNameToIndex(axisMap.sagittal)]),
    coronal: normalizeVoxelIndex(roundedVoxel[axisNameToIndex(axisMap.coronal)], sizes[axisNameToIndex(axisMap.coronal)]),
    axial: normalizeVoxelIndex(roundedVoxel[axisNameToIndex(axisMap.axial)], sizes[axisNameToIndex(axisMap.axial)]),
  };
}

function usesDefaultCoverageAssumption(coverageAssumption?: [number, number]) {
  return !coverageAssumption || (coverageAssumption[0] === 0 && coverageAssumption[1] === 1);
}

export function mapFrameIndex(
  normalizedPosition: number,
  voxelIndex: number,
  voxelAxisLength: number,
  frameCount: number,
  coverageAssumption?: [number, number],
): number {
  if (frameCount <= 1) {
    return 0;
  }

  if (frameCount === voxelAxisLength && usesDefaultCoverageAssumption(coverageAssumption)) {
    return Math.min(frameCount - 1, Math.max(0, voxelIndex));
  }

  return mapNormalizedToFrameIndex(normalizedPosition, frameCount, coverageAssumption);
}

export function parseGlbMeshNames(buffer: Buffer): string[] {
  const magic = buffer.toString('utf8', 0, 4);

  if (magic !== 'glTF') {
    throw new Error('The GLB file is missing the glTF header.');
  }

  let offset = 12;
  let jsonChunk: Buffer | null = null;

  while (offset < buffer.length) {
    const chunkLength = buffer.readUInt32LE(offset);
    offset += 4;
    const chunkType = buffer.toString('utf8', offset, offset + 4);
    offset += 4;
    const chunkData = buffer.slice(offset, offset + chunkLength);
    offset += chunkLength;

    if (chunkType === 'JSON') {
      jsonChunk = chunkData;
      break;
    }
  }

  if (!jsonChunk) {
    throw new Error('The GLB file does not contain a JSON chunk.');
  }

  const parsed = JSON.parse(jsonChunk.toString('utf8')) as {
    meshes?: Array<{
      name?: string;
    }>;
  };

  return (parsed.meshes ?? []).flatMap((mesh) => (typeof mesh.name === 'string' ? [mesh.name] : []));
}

function ensurePathExists(filePath: string, description: string): string {
  if (!fs.existsSync(filePath)) {
    throw new Error(`${description} not found: ${filePath}`);
  }

  return filePath;
}

export function resolveRepoPath(rootDir: string, repoRelativePath: string): string {
  const normalized = repoRelativePath.replace(/\\/g, '/').replace(/^\.\//, '');
  const segments = normalized.split('/').filter(Boolean);

  if (segments.length === 0) {
    throw new Error('Cannot resolve an empty repository path.');
  }

  let current = rootDir;

  for (const segment of segments) {
    const direct = path.join(current, segment);

    if (fs.existsSync(direct)) {
      current = direct;
      continue;
    }

    const lowered = path.join(current, segment.toLowerCase());

    if (fs.existsSync(lowered)) {
      current = lowered;
      continue;
    }

    const entries = fs.readdirSync(current, { withFileTypes: true });
    const matchedEntry = entries.find((entry) => entry.name.toLowerCase() === segment.toLowerCase());

    if (!matchedEntry) {
      throw new Error(`Unable to resolve ${repoRelativePath} from ${rootDir}.`);
    }

    current = path.join(current, matchedEntry.name);
  }

  return current;
}

export function tryResolveRepoPath(rootDir: string, repoRelativePath: string): string | null {
  try {
    return resolveRepoPath(rootDir, repoRelativePath);
  } catch {
    return null;
  }
}

export function listSliceSeriesFiles(rootDir: string, folderPath: string): string[] {
  const absoluteFolder = resolveRepoPath(rootDir, folderPath);

  return fs
    .readdirSync(absoluteFolder)
    .filter((name) => name.toLowerCase().endsWith('.png'))
    .sort(naturalCompare);
}

function isPointInsideExtentLazily(pointLps: Vector3, geometry: NrrdGeometry): boolean {
  const voxel = worldToContinuousVoxel(pointLps, geometry);

  return voxel.every((value, index) => value >= -1 && value <= geometry.sizes[index] + 1);
}

export function toLpsPosition(markup: ParsedMarkup, geometry: NrrdGeometry, warnings: string[], filePath: string): Vector3 {
  if (markup.coordinateSystem === 'LPS') {
    return markup.position;
  }

  if (markup.coordinateSystem === 'RAS') {
    return [-markup.position[0], -markup.position[1], markup.position[2]];
  }

  if (isPointInsideExtentLazily(markup.position, geometry)) {
    warnings.push(`${filePath} uses ${markup.coordinateSystem}; defaulting to LPS because the point is inside the CT extent.`);
    return markup.position;
  }

  throw new Error(
    `${filePath} uses unknown coordinateSystem "${markup.coordinateSystem}" and the default LPS interpretation falls outside the CT extent.`,
  );
}

function resolveMeshName(meshNameExpected: string | undefined, meshNames: string[]): string | null {
  if (!meshNameExpected) {
    return null;
  }

  const exactMatch = meshNames.find((meshName) => meshName === meshNameExpected);

  if (exactMatch) {
    return exactMatch;
  }

  const caseInsensitiveMatch = meshNames.find(
    (meshName) => meshName.toLowerCase() === meshNameExpected.toLowerCase(),
  );

  return caseInsensitiveMatch ?? null;
}

export function classifyStructureGroup(target: Pick<CaseTarget, 'kind' | 'id' | 'displayLabel'>, meshNameResolved: string | null): ToggleSetId {
  if (target.kind === 'lymph_node') {
    return 'lymph_nodes';
  }

  const haystack = `${target.id} ${target.displayLabel} ${meshNameResolved ?? ''}`.toLowerCase();

  if (haystack.includes('esophagus')) {
    return 'gi';
  }

  if (
    haystack.includes('airway') ||
    haystack.includes('trachea') ||
    haystack.includes('carina') ||
    haystack.includes('mainstem') ||
    haystack.includes('bronchus')
  ) {
    return 'airway';
  }

  if (
    haystack.includes('atrium') ||
    haystack.includes('ventricle') ||
    haystack.includes('appendage') ||
    haystack.includes('cardiac')
  ) {
    return 'cardiac';
  }

  return 'vessels';
}

function buildVoxelIndex(axisMap: AxisMap, roundedVoxel: Vector3): SliceIndex {
  return {
    axial: roundedVoxel[axisNameToIndex(axisMap.axial)],
    coronal: roundedVoxel[axisNameToIndex(axisMap.coronal)],
    sagittal: roundedVoxel[axisNameToIndex(axisMap.sagittal)],
  };
}

function getResolvedPaths(rootDir: string, manifest: CaseManifest): ResolvedCasePaths {
  const segmentationPath = manifest.assets.segmentationFile
    ? tryResolveRepoPath(rootDir, manifest.assets.segmentationFile)
    : null;

  return {
    manifestPath: ensurePathExists(path.join(rootDir, 'content', 'cases', 'case_001_manifest.json'), 'Seed manifest'),
    ctVolumePath: ensurePathExists(resolveRepoPath(rootDir, manifest.assets.ctVolumeFile), 'CT volume'),
    glbPath: ensurePathExists(resolveRepoPath(rootDir, manifest.assets.glbFile), 'GLB model'),
    segmentationPath: segmentationPath && fs.existsSync(segmentationPath) ? segmentationPath : null,
  };
}

export function buildAssetIndexSource(sliceFiles: Record<CasePlane, string[]>): string {
  const seriesToSource = (plane: CasePlane, sourceFolder: string) => {
    const entries = sliceFiles[plane].map(
      (fileName) => `  require('../../../model/sliceSeries/${sourceFolder}/${fileName}') as ImageSourcePropType,`,
    );

    return `export const ${plane}SliceAssets: ImageSourcePropType[] = [\n${entries.join('\n')}\n];`;
  };

  return [
    "import type { ImageSourcePropType } from 'react-native';",
    '',
    seriesToSource('axial', 'axial'),
    '',
    seriesToSource('coronal', 'coronal'),
    '',
    seriesToSource('sagittal', 'sagital'),
    '',
    'export const case001SliceAssetIndex = {',
    '  axial: axialSliceAssets,',
    '  coronal: coronalSliceAssets,',
    '  sagittal: sagittalSliceAssets,',
    '} as const;',
    '',
    'export type Case001SliceAssetIndex = typeof case001SliceAssetIndex;',
    '',
  ].join('\n');
}

export function generateCaseOutputs(rootDir: string): GeneratedCaseOutputs {
  const manifestPath = path.join(rootDir, 'content', 'cases', 'case_001_manifest.json');
  const manifest = readSeedManifest(manifestPath);
  const resolvedPaths = getResolvedPaths(rootDir, manifest);
  const geometry = parseNrrdHeader(fs.readFileSync(resolvedPaths.ctVolumePath));
  const axisMap = deriveAxisMap(geometry.spaceDirections);
  const meshNames = parseGlbMeshNames(fs.readFileSync(resolvedPaths.glbPath)).sort(naturalCompare);
  const warnings: string[] = [];
  const sliceFiles: Record<CasePlane, string[]> = {
    axial: listSliceSeriesFiles(rootDir, manifest.sliceSeries.axial.folder),
    coronal: listSliceSeriesFiles(rootDir, manifest.sliceSeries.coronal.folder),
    sagittal: listSliceSeriesFiles(rootDir, manifest.sliceSeries.sagittal.folder),
  };

  if (manifest.assets.segmentationFile && !resolvedPaths.segmentationPath) {
    warnings.push(`Segmentation file is referenced but missing: ${manifest.assets.segmentationFile}`);
  }

  const enrichedTargets: EnrichedCaseTarget[] = manifest.targets.map((target) => {
    const markupPath = resolveRepoPath(rootDir, target.markupFile);
    const markup = parseMarkupFile(fs.readFileSync(markupPath, 'utf8'), markupPath);
    const positionLps = toLpsPosition(markup, geometry, warnings, markupPath);
    const continuousVoxel = clampContinuousVoxel(worldToContinuousVoxel(positionLps, geometry), geometry.sizes);
    const roundedVoxel = roundVoxel(continuousVoxel, geometry.sizes);
    const normalized = buildNormalizedPositions(roundedVoxel, geometry.sizes, axisMap);
    const voxelIndex = buildVoxelIndex(axisMap, roundedVoxel);
    const sliceIndex: SliceIndex = {
      axial: mapFrameIndex(
        normalized.axial,
        voxelIndex.axial,
        geometry.sizes[axisNameToIndex(axisMap.axial)],
        sliceFiles.axial.length,
        manifest.sliceSeries.axial.coverageAssumption,
      ),
      coronal: mapFrameIndex(
        normalized.coronal,
        voxelIndex.coronal,
        geometry.sizes[axisNameToIndex(axisMap.coronal)],
        sliceFiles.coronal.length,
        manifest.sliceSeries.coronal.coverageAssumption,
      ),
      sagittal: mapFrameIndex(
        normalized.sagittal,
        voxelIndex.sagittal,
        geometry.sizes[axisNameToIndex(axisMap.sagittal)],
        sliceFiles.sagittal.length,
        manifest.sliceSeries.sagittal.coverageAssumption,
      ),
    };
    const meshNameResolved = resolveMeshName(target.meshNameExpected, meshNames);

    if (!meshNameResolved && target.meshNameExpected) {
      warnings.push(`Mesh not found for ${target.id}: expected "${target.meshNameExpected}".`);
    }

    return {
      ...target,
      sliceIndex,
      voxelIndex,
      structureGroupId: classifyStructureGroup(target, meshNameResolved),
      markup: {
        coordinateSystem: 'LPS',
        sourceCoordinateSystem: markup.coordinateSystem,
        position: positionLps,
      },
      derived: {
        continuousVoxel,
        roundedVoxel,
        normalized,
        axisMap,
      },
      meshExists: Boolean(meshNameResolved),
      meshNameResolved,
    };
  });

  if (enrichedTargets.some((target) => PLANES.some((plane) => Number.isNaN(target.sliceIndex[plane])))) {
    throw new Error('At least one target is missing a derived slice index.');
  }

  return {
    enrichedManifest: {
      ...manifest,
      generatedAt: new Date().toISOString(),
      meshNames,
      sliceAssetCounts: {
        axial: sliceFiles.axial.length,
        coronal: sliceFiles.coronal.length,
        sagittal: sliceFiles.sagittal.length,
      },
      warnings,
      targets: enrichedTargets,
    },
    assetIndexSource: buildAssetIndexSource(sliceFiles),
    enrichedManifestPath: path.join(rootDir, ENRICHED_MANIFEST_PATH),
    assetIndexPath: path.join(rootDir, ASSET_INDEX_PATH),
  };
}

export function writeCaseOutputs(rootDir: string): GeneratedCaseOutputs {
  const outputs = generateCaseOutputs(rootDir);

  fs.mkdirSync(path.dirname(outputs.enrichedManifestPath), { recursive: true });
  fs.writeFileSync(outputs.enrichedManifestPath, `${JSON.stringify(outputs.enrichedManifest, null, 2)}\n`);
  fs.writeFileSync(outputs.assetIndexPath, outputs.assetIndexSource);

  return outputs;
}
