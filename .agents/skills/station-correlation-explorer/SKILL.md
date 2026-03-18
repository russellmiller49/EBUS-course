---
name: station-correlation-explorer
description: Use this skill when building or modifying the CT to bronchoscopic to ultrasound station explorer in the SoCal EBUS Prep app. Trigger for multi-view station correlation, local structured anatomy content, station selector UI, landmark checklists, and recognition challenges. Do not use for knobology controls or standalone map screens.
---

# Goal
Build a tri-view learning module that shows the same station across CT, bronchoscopic, and ultrasound representations so the learner can connect them mentally.

# Included stations for v1
Include the same core station set used by the map module:
- 2R, 2L
- 4R, 4L
- 7
- 10R, 10L
- 11R, 11L

# Required experiences
1. Station selector
2. Correlated explorer screen
3. Landmark checklist
4. Recognition challenge
5. Review summary

# Explorer requirements
The main screen must allow the learner to view, for one station at a time:
- CT correlate
- bronchoscopic / airway correlate
- ultrasound / EBUS correlate

Recommended implementation:
- segmented control, tabs, or horizontally paged cards
- clear station title and brief memory cue
- optional zoom on each image/panel

# Landmark checklist
For each station, provide a concise checklist such as:
- adjacent structures
- key airway landmark
- common confusion pair
- high-yield memory phrase

# Recognition challenge
At minimum provide one exercise where the learner sees one representation and identifies the station.
Better:
- randomize representation type
- provide immediate feedback
- track accuracy by station

# Data model
Use a structured station correlation object with fields like:
- id
- displayName
- aliases
- zone
- ctAsset
- bronchoscopyAsset
- ultrasoundAsset
- landmarkBullets
- memoryCue
- confusionPairs
- quizItems

# Scope control
- v1 should stay fast and mostly 2D.
- Do not build a full 3D anatomy engine.
- Use placeholders if final illustrations are not ready.
- Do not use patient-specific CT or EBUS images unless they are fully de-identified and explicitly approved.

# Done when
- Learner can switch stations quickly.
- The three views stay synchronized to the selected station.
- Recognition challenge works and stores results locally.
- The module is stable on iOS and Android.
