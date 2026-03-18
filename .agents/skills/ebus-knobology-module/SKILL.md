---
name: ebus-knobology-module
description: Use this skill when building or modifying the Ultrasound Foundations and EBUS Knobology module in the SoCal EBUS Prep app. Trigger for interactive controls, image-fixing exercises, Doppler basics, quick-reference cards, and quiz flows about depth, gain, contrast, color Doppler, calipers, freeze, and save. Do not use for station maps or multi-view anatomy explorer work.
---

# Goal
Build a self-contained mobile learning module that teaches beginners how common EBUS ultrasound controls affect the screen and how to correct poor images.

# Core learning content
The module must cover:
- depth
- gain
- contrast
- color Doppler
- calipers
- freeze
- save

# Product behavior
Implement the module as a sequence of short, tappable experiences:
1. Primer
2. Control lab
3. Doppler mini-lab
4. Quick reference
5. 5-question quiz
6. Completion summary

# UX requirements
- Optimized for portrait mobile layout first.
- Learner should always know what to do next.
- Use simple labels and visible feedback.
- Persist completion and quiz state locally.

# Interaction design
## Primer
A short, swipeable or vertically scrollable intro explaining what each control does.

## Control lab
Build an interactive screen where the learner adjusts one control at a time.
Requirements:
- Include at least 3 sample “bad image” states.
- Let the learner manipulate sliders or toggles.
- Provide immediate explanatory feedback.
- Make it obvious which control improved or worsened the image.
- Use educational approximations only. Do not claim physical fidelity.

## Doppler mini-lab
Build a simple exercise for vessel detection.
Requirements:
- Use a mock ultrasound frame or illustration.
- Let the learner toggle Doppler on and off.
- Add at least one challenge where the learner identifies a safe versus unsafe puncture path.

## Quick reference
Provide a compact card set with one card per control.
Cards must be searchable or horizontally swipable.

## Quiz
At least 5 questions with mixed types:
- single best answer
- image interpretation
- scenario / what control would you change first

# Content and code organization
- Keep module text and questions in local content files.
- Keep image transform logic separate from the screen component.
- Add a small data contract for lesson sections and quiz items.

# Safety and scope
- No clinical recommendations beyond educational generalities.
- No claim that the simulator represents real ultrasound output.
- No patient data.

# Done when
- The module is navigable from the home/modules flow.
- The interactive lab works on iOS and Android.
- Progress persists locally.
- The module can render without network access.
- Basic tests cover scoring and state persistence.
