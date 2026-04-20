# SoCal EBUS Prep

This repository now targets the web app only. The active application lives in `apps/web`, with shared curriculum content and case assets kept at the repo root.

1. Ultrasound Foundations + EBUS Knobology
2. Mediastinal Station Map
3. CT ↔ Bronchoscopic ↔ Ultrasound Station Explorer

## Commands

From the repo root:

```bash
npm install
npm run dev
npm run build
npm run build:embed
npm run typecheck
npm run test
```

These commands proxy into `apps/web`.

## Deployment model

This repo is the source of truth for the course itself. The current production integration is not a standalone app deploy from this repository.

- Edit course UI, content, and learning logic here in `EBUS-course`.
- Build and sync the static bundle into `Interventional-Pulm-Education-Project`.
- Let the main site own the `/socal-ebus-course` wrapper page, iframe, redirects, and CSP/frame headers.

Use `npm run build:embed` when you want to validate the same subpath-hosted bundle shape that the main site serves from `/socal-ebus-course/app/`.

## Browser env

The web app only accepts browser-safe `VITE_*` variables.

- `VITE_APP_CODE=ebus_course`
- `VITE_COURSE_CODE=socal_ebus_prep`
- Optional live browser-side sync: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

Do not place service-role keys or other server secrets in this repository.

## Notes for curriculum assets

- Use app-owned SVGs, illustrations, and de-identified sample images.
- Do **not** ship slide screenshots directly in the app UI.
- Keep all educational content in JSON/Markdown so it can be updated without restructuring the codebase.
- Make every simulation clearly educational and not a diagnostic device.

## Case 001 Co-Registration

The case 001 viewer now uses one shared patient-space scene rooted in `model/case_001_ct.nrrd`. The build step reads its `space origin`, `space directions`, and `sizes`, converts each `.mrk.json` control point into LPS world space, derives voxel indices with the inverse IJK-to-world transform, parses segmentation metadata from `model/case_001_segmentation.nrrd`, and writes the runtime payload to `content/cases/case_001.runtime.json`.

Source-of-truth order matters: CT geometry comes first, segmentation comes second, markups provide targets, and the GLB is optional display polish only. The segmentation labelmap is trusted before the GLB because it carries explicit medical-image geometry and segment metadata, while the GLB is a presentation export that must be brought back into patient space with an explicit inverse transform instead of being auto-centered or rescaled independently.

## Repo layout

```text
apps/
  web/
content/
  cases/
  course/
  modules/
  quizzes/
  stations/
assets/
  pretest/
features/
  case3d/
model/
scripts/
```
