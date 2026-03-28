# SoCal EBUS Prep Web

This folder contains the standalone web scaffold requested in `webapp_codex_instructions.md`.

## Source of truth

- UI shell and interaction style are adapted from the prototype.
- Structured content still comes from the repo root where available:
  - `content/stations/*`
  - `content/modules/*`
  - `content/course/course-info.json`
  - `content/cases/generated/case_001.enriched.json`
- Web-only lecture and media manifests live under `apps/web/src/content/`.

## Commands

Run from [`apps/web`](/home/rjm/projects/EBUS_course/apps/web):

```bash
npm install
npm run dev
npm run build
npm run typecheck
npm run test
```

## Media folders

Static web media should be added under:

- `public/media/stations/<stationId>/`
- `public/media/knobology/`
- `public/media/lectures/<lectureId>/`
- `public/media/cases/case_001/`

The corresponding manifests are:

- [`src/content/station-media.json`](/home/rjm/projects/EBUS_course/apps/web/src/content/station-media.json)
- [`src/content/knobology-media.json`](/home/rjm/projects/EBUS_course/apps/web/src/content/knobology-media.json)
- [`src/content/lectures.json`](/home/rjm/projects/EBUS_course/apps/web/src/content/lectures.json)

Processor hotspot tuning note:

- The EU-ME2 hotspot coordinates are approximate starter values.
- Retune hotspot positions in `src/features/knobology/processor/eu-me2-layout.json` only, not in JSX.

## Notes

- Vite is configured to read repo-root JSON outside `apps/web`, so the web app does not duplicate station, quiz, or case content.
- The `/cases/case-001` route now uses the repo-native vtk.js viewer.

Case 001 source-of-truth note:

- Runtime hierarchy is `case_001_ct.nrrd` for image geometry, `case_001_segmentation.nrrd` for anatomy overlay alignment, then `model/markups/*.mrk.json` for targets. The GLB is optional display polish only.
- Segmentation is trusted before GLB because the labelmap shares explicit medical-image world geometry, while the GLB is a presentation export that needs an explicit transform to re-enter patient space.
- `scripts/cases/build-case-assets.ts` reads the CT, segmentation header metadata, and markups, validates target bounds, derives voxel and slice coordinates, and emits `content/cases/case_001.runtime.json` for the web viewer.
