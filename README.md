# SoCal EBUS Prep — Codex kit

This kit is meant to be dropped into a fresh repository before asking Codex to build the first three mobile app modules:

1. Ultrasound Foundations + EBUS Knobology
2. Mediastinal Station Map
3. CT ↔ Bronchoscopic ↔ Ultrasound Station Explorer

## Recommended setup

- Put `AGENTS.md` at the repository root.
- Keep the three skills in `.agents/skills/...` at the repository root.
- Start Codex from the repository root so it can see both `AGENTS.md` and the repo skills.
- For major work, ask Codex to plan first, then implement.

Codex usage flow:

1. Start in the repo root.
2. Run a planning prompt from `prompts/01_scaffold.md`.
3. After the shell app is in place, use the feature prompts in order:
   - `prompts/02_knobology.md`
   - `prompts/03_station_map.md`
   - `prompts/04_station_explorer.md`
4. Review the diff, run the app on iOS and Android, and make Codex fix issues before moving to the next feature.

## Notes for curriculum assets

- Use app-owned SVGs, illustrations, and de-identified sample images.
- Do **not** ship slide screenshots directly in the app UI.
- Keep all educational content in JSON/Markdown so it can be updated without restructuring the codebase.
- Make every simulation clearly educational and not a diagnostic device.

## Case 001 Co-Registration

The case 001 explorer now uses one patient-space scene instead of a separate GLB view plus 2D slice cards. `model/case_001_ct.nrrd` is the geometry truth: the enrichment step reads its `space origin`, `space directions`, and `sizes`, converts each `.mrk.json` control point into LPS world space, derives voxel indices with the inverse IJK-to-world transform, and writes that data into `content/cases/generated/case_001.enriched.json`.

At runtime the viewer builds one explicit `patientToScene` transform and uses it for the shared scene graph. The CT slice planes, target markers, and crosshair are placed in patient coordinates under that transform, while the GLB is wrapped in the inverse so the pre-exported anatomy still lands in the same scene space without any extra auto-centering or rescaling. If a slice stack looks like a cropped viewport export instead of a clean full-extent texture, the enriched manifest now emits a warning and carries normalized crop metadata so the plane texture mapping can be corrected explicitly.

## Suggested repo layout

```text
app/
  (tabs)/
  modules/
components/
features/
  knobology/
  stations/
  explorer/
content/
  modules/
  stations/
assets/
  illustrations/
  ultrasound/
  ct/
  bronchoscopy/
lib/
store/
utils/
```
