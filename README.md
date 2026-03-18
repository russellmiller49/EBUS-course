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
