# Codex instructions: convert the current EBUS-course repo into a web app using the starter prototype

Use `ebus-prep-prototype.jsx` as the **UI/interaction prototype**, not as the final data source. Keep the existing repo's structured content and logic as the source of truth wherever possible.

## Product decision

Create a **web app first** and do **not** replace the current Expo app in place.

Build the web app in a new folder:
- `apps/web`

Keep the existing mobile/Expo app untouched for reference.

## Framework choice

Preferred:
- Vite
- React
- TypeScript
- React Router

If the local machine is still on Node 18, either:
1. upgrade Node for the web app, or
2. pin the web tooling to a compatible setup.

## High-level goal

Create a polished, responsive web learning app that uses:
- the layout and visual language from `ebus-prep-prototype.jsx`
- the current repo's content JSON and logic from the Expo build
- media manifests for station images, knobology images, and lecture videos
- a later route for the 3D/case explorer using the existing GLB + manifest pipeline

## Do not do this

- Do not blindly port the prototype's hard-coded arrays as production content.
- Do not try to preserve Expo Router or React Native components in the web app.
- Do not keep the current mobile-native 3D implementation.
- Do not delete the existing repo work.

## Source-of-truth mapping

Use the prototype for:
- visual shell
- information hierarchy
- navigation model
- component ideas
- tone and interaction pattern

Use the existing repo for:
- station content
- knobology content
- quiz logic and quiz bank
- learner progress model
- station explorer/case manifest logic
- case enrichment scripts

## Expected route structure

Create routes:
- `/` home/dashboard
- `/stations`
- `/knobology`
- `/lectures`
- `/quiz`
- `/cases/case-001` (phase 2 or hidden behind a feature flag)

## Build plan

### Phase 1: scaffold the web app shell

1. Create `apps/web` as a React + TypeScript web app.
2. Add a shared theme based on the prototype's colors, mono headings, serif body, rounded cards, and dark palette.
3. Port the prototype into decomposed web components, not one giant file.
4. Keep the prototype's mobile-friendly single-column layout as the baseline.
5. Preserve the top nav + bottom nav feel from the prototype.

Suggested component breakdown:
- `AppShell`
- `TopHeader`
- `BottomNav`
- `ModuleCard`
- `StationMap`
- `StationNode`
- `StationDetail`
- `KnobologyPanel`
- `LectureCard`
- `QuizCard`
- `EmptyState`

### Phase 2: replace prototype arrays with repo content

Map the prototype placeholders to the current repo's data:

- `STATIONS` -> existing station data from the repo
- `KNOBOLOGY_CONTROLS` -> knobology content from the repo
- `QUIZ_QUESTIONS` -> quiz bank from the repo
- `PREP_LECTURES` -> create a new `lectures.json` manifest if this does not exist yet

Create a shared web content layer:
- `apps/web/src/content/`

At minimum:
- `stations.ts`
- `knobology.ts`
- `quiz.ts`
- `lectures.ts`
- `media.ts`

If the repo already has JSON files, load and transform them into typed web view models instead of duplicating content.

### Phase 3: media-ready station and knobology views

Replace every prototype placeholder like `Your image here` with manifest-driven media slots.

Create these asset folders:
- `apps/web/public/media/stations/<stationId>/`
- `apps/web/public/media/knobology/`
- `apps/web/public/media/lectures/`
- `apps/web/public/media/cases/case_001/`

Create these manifests:
- `apps/web/src/content/station-media.json`
- `apps/web/src/content/knobology-media.json`
- `apps/web/src/content/lectures.json`

### Station media schema

Each station can have:
- `ctImage`
- `ctAnnotatedImage`
- `bronchoscopyImage`
- `bronchoscopyVideo`
- `ebusImage`
- `ebusVideo`
- `notes`

Example:

```json
{
  "4R": {
    "ctImage": "/media/stations/4R/ct.webp",
    "ctAnnotatedImage": "/media/stations/4R/ct_annotated.webp",
    "bronchoscopyImage": "/media/stations/4R/bronchoscopy.webp",
    "bronchoscopyVideo": "/media/stations/4R/bronchoscopy.mp4",
    "ebusImage": "/media/stations/4R/ebus.webp",
    "ebusVideo": "/media/stations/4R/ebus.mp4",
    "notes": ["Azygos/SVC relationship", "Below 2R and above 10R"]
  }
}
```

### Knobology media schema

Each control concept can have:
- `comparisonImages`
- `clips`
- `caption`

Example:

```json
{
  "gain": {
    "comparisonImages": [
      "/media/knobology/gain_low.webp",
      "/media/knobology/gain_optimal.webp",
      "/media/knobology/gain_high.webp"
    ],
    "clips": ["/media/knobology/gain_sweep.mp4"],
    "caption": "Compare undergained, optimized, and overgained images."
  }
}
```

### Lecture manifest schema

```json
[
  {
    "id": "lecture-01",
    "title": "Introduction to EBUS",
    "week": "Week 1",
    "duration": "2h 15m",
    "poster": "/media/lectures/lecture-01/poster.jpg",
    "video": "/media/lectures/lecture-01/video.mp4",
    "topics": ["Equipment overview", "Scope anatomy"]
  }
]
```

## Phase 4: learner progress on web

Reuse the existing learner-progress concepts, but implement a web adapter using:
- `localStorage` first

Track:
- completed modules
- lecture watch status
- bookmarked stations
- quiz score history
- last viewed station
- last used knobology control

Do not add auth yet.

## Phase 5: 3D explorer route for web

Do this only after the core web app is working.

Create:
- `/cases/case-001`

Use the existing case assets:
- `case_001.glb`
- enriched case manifest
- slice stacks

Important:
- On web, use the web React Three Fiber stack, not the native one.
- Build the 3D viewer as a desktop/tablet-first route.
- Keep it separate from the simpler learning routes.

For the first web pass, it is acceptable to:
- render the GLB
- show target selection
- show synchronized axial/coronal/sagittal image panels
- delay the full co-registered slice-plane-in-3D scene until the basic web experience is stable

## UI expectations

The web app should feel like a refined version of the uploaded prototype:
- single-column on phone
- more spacious multi-column layout on tablet/desktop
- preserve the prototype's dark academic/console aesthetic
- keep mono labels and serif headings

### Responsive targets

- Mobile: 390-480 px wide single-column
- Tablet: 2-column module layouts where appropriate
- Desktop: station detail and media can sit side-by-side

## What to port directly from the prototype

Good candidates to port almost directly:
- top header style
- nav items
- module cards on home screen
- station map visual language
- station detail card layout
- knobology control selector layout
- lecture card layout
- quiz interaction pattern

## What to rewrite instead of porting

Rewrite these using repo data and cleaner architecture:
- hard-coded station list
- hard-coded quiz list
- hard-coded lecture list
- inline styles everywhere (move to CSS modules or a clean design system)
- prototype-only state management in one file

## Recommended folder structure

```text
apps/web/
  public/
    media/
      stations/
      knobology/
      lectures/
      cases/
  src/
    app/
    components/
    features/
      stations/
      knobology/
      lectures/
      quiz/
      cases/
    content/
    hooks/
    lib/
    styles/
```

## Acceptance criteria

1. The prototype look-and-feel is recognizable.
2. Real repo content replaces prototype placeholder arrays.
3. Station detail cards can show real images/videos when assets are added.
4. Knobology can show real comparison media when assets are added.
5. Lectures can display playable local videos or embedded video URLs from a manifest.
6. Quiz works with existing question logic and persists progress locally.
7. The web app builds and runs independently from the Expo app.
8. The 3D case explorer is isolated and does not block the rest of the web app.

## First pass command summary

If using a modern Node environment:
- scaffold the web app
- install routing
- install web 3D dependencies later only when adding the case viewer

## Deliverables

Please produce:
1. `apps/web` scaffold
2. converted prototype shell
3. migrated content adapters from current repo data
4. media manifest support
5. local progress persistence
6. optional hidden `/cases/case-001` route scaffold
7. short `apps/web/README.md` explaining dev/build/media folders
