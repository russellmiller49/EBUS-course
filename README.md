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

The case 001 viewer now uses one shared patient-space scene rooted in `model/case_001_ct.nrrd`. The build step reads its `space origin`, `space directions`, and `sizes`, converts each `.mrk.json` control point into LPS world space, derives voxel indices with the inverse IJK-to-world transform, parses segmentation metadata from `model/case_001_segmentation.nrrd`, and writes the runtime payload to `content/cases/case_001.runtime.json`.

Source-of-truth order matters: CT geometry comes first, segmentation comes second, markups provide targets, and the GLB is optional display polish only. The segmentation labelmap is trusted before the GLB because it carries explicit medical-image geometry and segment metadata, while the GLB is a presentation export that must be brought back into patient space with an explicit inverse transform instead of being auto-centered or rescaled independently.

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
