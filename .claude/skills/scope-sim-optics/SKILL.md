---
name: scope-sim-optics
description: >-
  Shared context for the scope-simulator optics work in this repo
  (apps/web/src/features/simulator + tools/ebus-simulator). Load it whenever
  working on the endoscopic optical camera, device calibration, sector-image
  render styles, the Python signal-render snapshot pipeline, or any numbered
  phase of the scope-optics plan. It encodes the repo map, the axis/coordinate
  conventions, the single-source-of-truth calibration rule, validation
  commands, and the known pitfalls so each phase prompt can stay short.
---

# Scope simulator — optics & calibration context

This is a **training-only** anatomy scope simulator (a web app that lets
trainees drive a virtual scope through a tubular anatomical model and see a
synthetic grayscale sector image). It is an educational tool — **not for
clinical use, not a medical device**. Everything below is a software task:
cameras, coordinate frames, calibration data, render pipelines, and tests.

## How to use this skill

Each phase prompt says "load `scope-sim-optics`, then do Phase N." When loaded:
1. Skim this file for the repo map, axis conventions, and validation commands —
   do **not** re-derive them from scratch each phase.
2. Do only the work the phase prompt describes. Keep every change **additive
   and backward-compatible** unless the phase says otherwise.
3. Validate with the commands in the "Validation" section before finishing.
4. Keep prose (comments, commit messages, PR text) in the neutral vocabulary
   below.

## Neutral vocabulary (use these terms in prose)

Reference existing file/symbol names verbatim (they're paths), but describe the
*work* with generic engineering terms:

- endoscopic optical camera / **the optical pane** — the forward-view camera in
  `BronchoscopyView.tsx`.
- **sector image** / grayscale sector render / acoustic sector — the 2D image in
  `SectorView.tsx`.
- **the scope** / probe pose — the driven instrument (`SimulatorProbePose`).
- **the tubular channel** / lumen surface / channel wall / contact surface — the
  anatomical model geometry.
- **target structure** — a region of interest anchored at a station preset.
- **flow channel** — a tubular fluid region (the things drawn as `kind: 'vessel'`).
- **distal contact cap** — the translucent inflatable cap at the scope tip.
- **guide-line** — the optional straight overlay line.
- **device profile** — the calibration record identified by the opaque id
  `bf_uc180f`.
- **trainees / reviewers** — the audience; gate learner-facing changes behind QA.

## Repo map (what each file owns)

Web app (Vite + React + TypeScript + three.js), under `apps/web/src/features/simulator/`:
- `pose.ts` — owns the scope pose model. `SimulatorProbePose` has
  `position, tangent, depthAxis, lateralAxis` (all `THREE.Vector3`). This is the
  right home for any new axis/frame helpers.
- `BronchoscopyView.tsx` — the optical pane. Today it aims the camera straight
  down `probe.tangent` (around line 141, `forward.copy(probe.tangent)`), camera
  at `probe.position`.
- `SectorView.tsx` — the 2D sector-image renderer (SVG overlays + canvas). Owns
  the "realistic" render and the hover labels / educational color overlays.
- `AnatomyScene.tsx` — the external 3D view; already loads and poses the scope
  tip model (`SimulatorScopeModelAsset`, `scopePoseQuaternion`,
  `scopeFanApexAnchorLocal`).
- `types.ts` — manifest + asset schema (`SimulatorCaseManifest`,
  `render_defaults` with optional `sector_realism: 'realistic'`,
  `sector_snapshots?: Record<string,string>`). New manifest fields go here,
  **optional and additive**.
- `useSimulatorCase.ts` — case + snapshot loaders. `useSimulatorCase()` and
  `useSimulatorSectorSnapshot(caseData, presetKey)` (reads
  `caseData.sector_snapshots?.[presetKey]`). New loaders/hooks go here.
- `SimulatorPage.tsx` — composition + access mode. Takes
  `showVirtualBronchoscopy` and computes
  `showVirtualBronchoscopyPane = showVirtualBronchoscopy && !publicTrainingMode`.
- `simulator.test.ts` — the existing vitest suite for this feature.

Asset build:
- `scripts/cases/build-simplified-simulator-assets.mjs` — the source of the
  default web manifest (`case_manifest.simplified.web.json`), point clouds,
  station-snap targets, and `sector_realism`. New calibration/snapshot manifest
  fields must be emitted here.

Python signal-render tools, under `tools/ebus-simulator/src/ebus_simulator/`:
- `device.py` — `CPEBUSDeviceModel` (id `bf_uc180f`) currently
  `video_axis_offset_deg=20.0`, `sector_angle_deg=60.0`, `displayed_range_mm=40.0`.
  `DevicePose` tracks `shaft_axis_world, video_axis_world, probe_axis_world,
  lateral_axis_world` and more. The optical axis is built at
  `_rotation_toward(shaft_axis, probe_axis, model.video_axis_offset_deg)`.
- `physics_renderer.py` — the high-fidelity grayscale-image module (attenuation,
  scatter, impedance boundaries, masks, artifacts, speckle, TGC, log
  compression). This is the intended source of high-realism station snapshots.

## Axis / coordinate conventions (the heart of the plan)

The scope pose is an orthonormal frame. Names differ across TS and Python but
map 1:1 — use ONE shared conceptual frame; do not maintain two independent
camera calculations:

| Concept                | TS (`SimulatorProbePose`) | Python (`DevicePose`)  |
|------------------------|---------------------------|------------------------|
| along-shaft / advance  | `tangent`                 | `shaft_axis_world`     |
| optical view direction | (derive)                  | `video_axis_world`     |
| toward the sector/scan side | `depthAxis`          | `probe_axis_world`     |
| in-image lateral       | `lateralAxis`             | `lateral_axis_world`   |

The **forward-oblique optical axis** is the shaft axis rotated by
`optical_axis_offset_deg` toward the scan side. Target for this plan is **30°**
(the Python model currently uses 20° — bring both to a single calibrated value).
The rotation **sign is calibratable**: the scan side may need flipping after a
visual review against reference video, so never hard-code the sign — read it
from the device profile.

Vector form (forward-oblique optical axis):
`forward = shaftAxis*cos(θ) + (sign * depthAxis)*sin(θ)`, normalized, with
`θ = optical_axis_offset_deg` in radians.

## Single-source-of-truth calibration rule

There must be **one** device-calibration record. Author it once, export it into
the web manifest from `build-simplified-simulator-assets.mjs`, and have both the
TS app and the Python tools consume the same numbers (offset angle, sector
angle, displayed range, FOV, near/far, eye offsets, sign). Do not scatter magic
constants across `BronchoscopyView.tsx` and `device.py`.

## Conventions & guardrails

- **Additive schema only.** New manifest fields are optional; existing cases
  without them must still load and render.
- **Debug flags via URL.** Follow the existing pattern for optional runtime
  toggles (e.g. `?bronchDebug=1`, `?sectorStyle=classic|realistic|physics`,
  `?bronchView=1`). Also allow manifest/localStorage where the plan asks.
- **Access gating.** The optical pane stays admin-only until per-station QA is
  signed off; only then gate it for trainees behind a manifest flag
  (`render_defaults.endoscopic_view_public`) or URL flag.
- **No new heavy deps by default.** `three-mesh-bvh` is **not** installed in
  `apps/web`. Start any surface-contact/ray work with native three.js raycasting;
  only add a dependency if profiling shows it's needed, and call that out.
- **Keep the interactive fallback.** The browser point-cloud / fan-plane sector
  is the free-drive path and is already tested; the Python renderer supplies
  high-quality *station-anchored* snapshots on top of it, not a replacement.
- **Educational framing stays.** Preserve disclaimers and neutral prompts.

## Validation (run from repo root)

- `npm test` — vitest (proxies to `apps/web`; suite lives in `simulator.test.ts`).
- `npm run typecheck` — `tsc --noEmit`.
- `npm run build` — `vite build`.

Add new unit tests to `apps/web/src/features/simulator/simulator.test.ts` (or a
sibling `*.test.ts`) using vitest (`describe/it/expect`). Python changes: add a
small pytest or a `python -m py_compile` syntax check; do **not** require running
the full render pipeline in CI.

## Phase order (for reference)

1. Calibrated forward-oblique optical camera in `BronchoscopyView` (+ debug axes).
2. One device-calibration record → manifest + `pose.ts` + `device.py` unified.
3. Distal tip / contact cap / lens realism in the optical pane.
4. Restore `classic | realistic | physics` sector-style toggle.
5. Generate signal-render sector snapshots from the Python renderer.
6. Show snapshots as the sector-image background under the interactive labels.
7. Improve the free-drive sector (gain, depth, TGC, flow overlay, contact quality).
8. Access-mode flag to make the optical pane trainee-facing after QA.
