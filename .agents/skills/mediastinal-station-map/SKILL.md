---
name: mediastinal-station-map
description: Use this skill when building or modifying the Mediastinal Station Map module in the SoCal EBUS Prep app. Trigger for IASLC-style station maps, zoomable/tappable station graphics, station detail sheets, flashcards, and map-based quizzes. Do not use for knobology simulation or CT-bronchoscopy-ultrasound tri-view explorer work.
---

# Goal
Build a station map module that helps learners memorize and retrieve the key mediastinal and hilar stations relevant to EBUS staging.

# Minimum station set for v1
Include:
- 2R, 2L
- 4R, 4L
- 7
- 10R, 10L
- 11R, 11L

Optionally structure the content so more stations can be added later without refactoring.

# Required experiences
1. Overview / intro
2. Zoomable station map
3. Station detail bottom sheet or detail screen
4. Flashcard mode
5. Pin-the-station quiz
6. Review summary

# Map requirements
- Use scalable vector graphics or another clean vector approach.
- Each station should be tappable.
- Selected station should show a distinct visual state.
- Avoid relying on color alone.
- Keep the layout readable on smaller phones.

# Station detail requirements
Each station detail must support fields like:
- station name
- short label
- zone / grouping
- laterality
- plain-language anatomic description
- common access notes
- one or two memory cues
- related stations

# Flashcard requirements
- Simple forward/back flip or reveal interaction.
- Support bookmarking.
- Support random order.

# Quiz requirements
Build at least one map-based quiz where the learner must tap the correct station.
Optional second quiz type: match station name to description.

# Content and code organization
- Store station definitions in local structured files.
- Separate drawing data from text content.
- Use a station schema that will also work for the station explorer module.

# Scope control
- Do not overbuild a 3D anatomy viewer in v1.
- Do not introduce a heavy rendering stack unless clearly required.
- Start with a robust 2D map that is fast and easy to maintain.

# Done when
- Learner can open the map, tap stations, review details, and take a quiz.
- Core stations render correctly on iOS and Android.
- Bookmarks and completion state persist locally.
