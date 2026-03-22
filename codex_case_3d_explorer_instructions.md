# Codex instructions: build `case-3d-explorer` for `case_001` and compute slice indices from `.mrk.json`

## Goal

Build a new module in the existing Expo / React Native EBUS prep app that lets the learner:

1. select a nodal station or individual target from `case_001`
2. view the linked 3D segmented model from `model/case_001.glb`
3. toggle structures on/off (`lymph_nodes`, `airway`, `vessels`, `cardiac`, `gi`)
4. jump linked axial / coronal / sagittal slice views to the selected target
5. switch between station view and individual-target view
6. see landmark labels and a short teaching card for the selected target
7. persist last-selected station, plane, and toggle state in the shared learner-progress store

Use **local bundled assets only**. Do not attempt full DICOM import or on-device segmentation.

Use `content/cases/case_001_manifest.json` as the seed manifest and generate an enriched runtime manifest.

---

## Input files

Use these files exactly:

- `model/case_001.glb`
- `model/case_001_ct.nrrd`
- `model/case_001_segmentation.nrrd`
- `model/markups/*.mrk.json`
- `model/sliceSeries/axial/*`
- `model/sliceSeries/coronal/*`
- `model/sliceSeries/sagital/*`
- `content/cases/case_001_manifest.json`

---

## Critical requirement: compute slice indices automatically from `.mrk.json`

Do **not** hardcode `sliceIndex` values.

Create a build-time enrichment script:

- `scripts/enrich-case-001.ts`

The script must:

1. read the seed manifest
2. enumerate actual image filenames in each slice-series folder
3. read every referenced `.mrk.json`
4. extract the **first control point** from each markup file
5. honor the markup file's `coordinateSystem`
6. read CT volume geometry from `model/case_001_ct.nrrd`
7. derive slice indices automatically for:
   - `sliceIndex.axial`
   - `sliceIndex.coronal`
   - `sliceIndex.sagittal`
8. verify mesh names inside the GLB
9. write generated outputs:
   - `content/cases/generated/case_001.enriched.json`
   - `content/cases/generated/case_001-asset-index.ts`

### Parsing `.mrk.json`

Assume each markup file contains one relevant point list and one primary control point.

Read:
- `markups[0].coordinateSystem`
- `markups[0].controlPoints[0].position`

Fail loudly if:
- the file is missing
- `markups` is empty
- `controlPoints` is empty
- the first point has no numeric `position`

### Handling coordinate systems

Do **not** assume RAS.

Algorithm:
- if markup `coordinateSystem === "LPS"`, keep the point as LPS
- if markup `coordinateSystem === "RAS"`, convert to LPS by negating X and Y
- if the value is missing or unknown, warn and default to LPS only if the numeric result still falls plausibly inside the CT extent; otherwise fail with a clear error

Use one consistent working frame for the enrichment script. Prefer **LPS** internally because the markup JSON commonly uses LPS and NRRD geometry is easier to interpret in that frame.

### Reading CT geometry from NRRD

Use a Node-compatible NRRD parser or write a minimal parser that reads at least:
- `sizes`
- `space directions`
- `space origin`

Build a 4x4 `ijkToLps` matrix from:
- the 3 direction vectors as columns
- the origin as the translation

Then invert it to get `lpsToIjk`.

For each markup point:
- convert LPS world point → continuous voxel coordinates `[i, j, k]`
- keep both:
  - `continuousVoxel`: raw float values
  - `roundedVoxel`: rounded integer values clamped to valid voxel bounds

### Determining plane mapping robustly

Do **not** assume:
- `i = sagittal`
- `j = coronal`
- `k = axial`

Instead:
1. inspect the 3 column vectors of the direction matrix
2. determine which voxel axis aligns most strongly with:
   - left/right → sagittal
   - anterior/posterior → coronal
   - inferior/superior → axial

Then derive a normalized position in each plane:

- `normalized.sagittal`
- `normalized.coronal`
- `normalized.axial`

Each normalized value must be clamped to `[0, 1]`.

### Mapping voxel position to exported slice image indices

The slice folders contain exported images, not raw CT voxels.

Therefore:
- if image count exactly matches the relevant CT axis length, use the rounded voxel index directly
- otherwise map by normalized position:

`frameIndex = round(normalized * (count - 1))`

Store both in the enriched manifest when useful:

- `voxelIndex`
- `sliceIndex`

Use `sliceIndex` for the UI because the UI is rendering the exported slice images.

### Required enriched fields per target

For every target in the enriched manifest, add:

- `markup`
  - `coordinateSystem`
  - `position`
- `derived`
  - `continuousVoxel`
  - `roundedVoxel`
  - `normalized`
  - `axisMap` (which voxel axis maps to each display plane)
- `sliceIndex`
  - `axial`
  - `coronal`
  - `sagittal`
- `meshExists`
- `meshNameResolved`

### Verifying GLB mesh names

At build time, inspect `model/case_001.glb` and collect all mesh names.

For each target:
- if `meshNameExpected` exists, set:
  - `meshExists: true`
  - `meshNameResolved: meshNameExpected`
- if missing:
  - set `meshExists: false`
  - keep the target in the enriched manifest
  - emit a warning with the target id and expected mesh name

Do not crash on missing mesh names unless the missing mesh breaks a default landing target.

---

## Asset index generation

Generate `content/cases/generated/case_001-asset-index.ts` that exports typed arrays for:

- axial image modules
- coronal image modules
- sagittal image modules

Use the actual folder contents, sorted naturally.

Normalize the source folder spelling:
- source folder is `sagital`
- display plane should still be `sagittal`

The UI should use the generated asset index rather than string paths.

---

## Types to add

Create:

- `features/case3d/types.ts`

Include at least:

- `CaseManifest`
- `CaseTarget`
- `CaseStation`
- `SliceSeries`
- `SliceIndex`
- `ToggleSet`
- `EnrichedCaseTarget`
- `EnrichedCaseManifest`
- `AxisMap`

The UI must consume the enriched manifest only, never raw `.mrk.json` directly.

---

## Module registration

Add a module entry in `content/modules/modules.json`:

- `slug`: `case-3d-explorer`
- `title`: `3D Anatomy + Slice Explorer`
- `estimatedMinutes`: 12–18
- `category`: `anatomy`
- `status`: `available`

Route it from `app/modules/[slug].tsx`.

---

## UI to build

Create:

- `features/case3d/Case3DExplorerModule.tsx`
- `features/case3d/Case3DCanvas.tsx`
- `features/case3d/SliceViewer.tsx`
- `features/case3d/TargetPicker.tsx`
- `features/case3d/StructureToggles.tsx`
- `features/case3d/TeachingCard.tsx`
- `features/case3d/content.ts`
- `features/case3d/logic.ts`

### Screen flow

1. Intro panel
2. Explorer screen
3. Review mode
4. Summary screen

### Explorer behavior

- station mode:
  - selecting a station highlights all targets in that station
  - camera focus uses `primaryTargetId`
- target mode:
  - selecting a target highlights only that target
- structure toggles:
  - `lymph_nodes`
  - `airway`
  - `vessels`
  - `cardiac`
  - `gi`
- default visibility:
  - lymph nodes ON
  - airway ON
  - vessels ON
  - cardiac OFF
  - gi OFF

### Slice viewer behavior

v1 should show one plane at a time:
- Axial
- Coronal
- Sagittal

When a target is selected:
- jump to `sliceIndex[selectedPlane]`

Also support:
- +/- stepping through nearby frames
- label badge or crosshair overlay
- quick reset to target center

---

## Persistence

Extend the learner-progress store with state for this module:

- `selectedStationId`
- `selectedTargetId`
- `selectedPlane`
- `visibleToggleSetIds`
- `visitedTargetIds`
- `reviewScore`

Resume the module where the learner left off.

---

## Review mode

Add 5 lightweight prompts such as:
- Find 4R
- Find the carina
- Show the esophagus
- Which structure helps orient station 4L?
- Find the azygous vein

Use instant feedback; do not overcomplicate scoring.

---

## Tests

Add tests for:

- `.mrk.json` parsing
- NRRD axis mapping and voxel conversion
- normalized-position → frame-index mapping
- target grouping / station selection logic
- persistence reducer behavior
- generated asset-index shape

Suggested files:

- `features/case3d/__tests__/logic.test.js`
- `scripts/__tests__/enrich-case-001.test.js`
- `store/__tests__/learner-progress.case3d.test.js`

---

## Validation checklist

Before finishing, run:

- `npm run typecheck`
- `npm test -- --runInBand`
- `npx expo export --platform web`

If Expo Go or simulator is available, also do a manual smoke test:
- module opens
- 3D scene renders
- selecting a target updates slice position
- toggles work
- resume works

---

## Done when

The task is done when:

- the module appears in the Modules tab
- the route is stable on native and web
- selecting a station or target updates both 3D highlighting and slice position
- structure toggles work
- review mode works
- slice indices are generated automatically from `.mrk.json` + CT geometry
- no target in the enriched manifest has a missing `sliceIndex`
