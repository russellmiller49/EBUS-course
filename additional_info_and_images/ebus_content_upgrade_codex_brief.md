# EBUS Course Web App — Content Upgrade Brief

## Why upgrade
The current repo structure is already content-first enough to support a major educational rewrite without a UI rebuild. The root repo separates `content/`, `features/`, `model/`, and `scripts/`, and the README still emphasizes keeping educational material in JSON/Markdown and updating content without restructuring the codebase.

## Content strategy
Build the curriculum around 5 layers:
1. **Foundational concepts** — ultrasound physics, echogenicity, artifacts, processor controls.
2. **Spatial anatomy** — station boundaries, landmark vessels, airway windows, staging implications.
3. **Procedural technique** — balloon contact, puncture mechanics, safe sampling path, fanning, capsule-to-capsule sampling.
4. **Interpretation** — CHS, CNS, heterogeneity, margins, Doppler, vascular patterns, elastography caveats.
5. **Clinical decision-making** — which node to sample, what changes N-stage, what to avoid, why false negatives happen.

## Recommended new content blocks
### 1. Knobology / Ultrasound Foundations
Replace the current simplified module with these sections:
- Why EBUS images look the way they do
- Acoustic impedance and why air degrades imaging
- Frequency vs wavelength
- Resolution vs penetration: RP-EBUS vs CP-EBUS
- Echogenicity: anechoic, hypoechoic, isoechoic, hyperechoic
- Gain vs contrast vs depth/penetration
- Color Doppler vs power Doppler
- Freeze, calipers, and when they matter
- Artifacts:
  - reverberation
  - comet tail
  - tadpole tail
  - acoustic shadow
  - mirror image
- Node-targeting pearls:
  - avoid necrotic/Doppler-negative hypoechoic areas
  - identify vessels before puncture
  - puncture between cartilage rings when needed
  - use fanning and capsule-to-capsule sampling

### 2. Mediastinal Anatomy / Station Map
Deepen each station page with:
- IASLC station name and exact boundary definition
- N-stage implication by laterality
- Best EBUS window
- Best landmark vessel(s)
- Common confusion pair
- Accessible by EBUS, EUS-B, both, or visualized-only
- Why the station matters clinically

High-priority station set:
- 2R
- 2L
- 4R
- 4L
- 7
- 10R
- 10L
- 11Rs
- 11Ri
- 11L

Add “confusion rules”:
- 1 vs 2/4 boundary rules
- 2R/2L and 4R/4L are divided by the **left lateral tracheal border**
- 4R vs 10R divided by **inferior azygos margin**
- 4L vs 10L divided by **superior left main PA margin**
- 4L is medial to ligamentum arteriosum; 5/6 are lateral
- 3a/3p/7 are not lateralized in the same way as 2/4/10/11

### 3. Station Explorer
For each station, add:
- What you should see on CT
- What you should see bronchoscopically
- What you should see on EBUS
- Landmark checklist
- What not to confuse it with
- Safe puncture considerations
- What finding changes staging

### 4. Sonographic Interpretation
Add a separate interpretive layer:
- CHS
- CNS
- distinct margins
- heterogeneous echogenicity
- nodal conglomeration
- vascular patterns
- what makes a node suspicious vs reassuring
- elastography: useful adjunct, not substitute for tissue

### 5. Step-by-step Technique
Create a concise but detailed procedural technique section:
- scope orientation in neutral position
- balloon inflation/contact
- identifying target and vessel check
- sheath/needle setup and scope-protection step
- puncture mechanics
- fanning
- capsule-to-capsule sampling
- when to measure
- when images are misleading
- common causes of non-diagnostic specimens

## Quiz redesign
Replace overly simple recognition quizzes with:
- concept checks
- image interpretation
- artifact troubleshooting
- station-boundary questions
- case-based staging decisions
- next-best-action questions
- multi-select and sequence items

Suggested quiz composition per major module:
- 3 foundational recall questions
- 3 interpretation questions
- 2 technique/pitfall questions
- 2 short case questions

Every question should include:
- correct answer
- teaching explanation
- why the distractors are wrong
- difficulty tag
- station/module tag

## Proposed content schema
Use structured JSON or MDX frontmatter-driven content.

```ts
export type LessonSection = {
  id: string;
  title: string;
  kind:
    | 'overview'
    | 'learning-objectives'
    | 'core-concept'
    | 'landmarks'
    | 'pitfall'
    | 'clinical-pearl'
    | 'technique'
    | 'staging'
    | 'artifact'
    | 'sonographic-pattern'
    | 'case';
  body: string;
  bullets?: string[];
  imageIds?: string[];
  videoIds?: string[];
  relatedStationIds?: string[];
};

export type QuizItem = {
  id: string;
  type:
    | 'single-best-answer'
    | 'multi-select'
    | 'ordering'
    | 'image-interpretation'
    | 'case-vignette';
  prompt: string;
  choices?: { id: string; text: string }[];
  answer: string | string[];
  explanation: string;
  distractorRationales?: Record<string, string>;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  tags: string[];
};
```

## File plan
If the current web app root differs, mirror this structure under the actual web source tree.

```text
content/
  modules/
    knobology-advanced.json
    mediastinal-anatomy.json
    sonographic-interpretation.json
    procedural-technique.json
    staging-strategy.json
  stations/
    2R.json
    2L.json
    4R.json
    4L.json
    7.json
    10R.json
    10L.json
    11Rs.json
    11Ri.json
    11L.json
  quizzes/
    knobology-advanced.json
    mediastinal-anatomy.json
    sonographic-interpretation.json
    procedural-technique.json
```

## UI changes needed
Add support for these components:
- LearningObjectivesCard
- ClinicalPearlCallout
- PitfallCallout
- StationBoundaryCard
- StagingImplicationBadge
- LandmarkChecklist
- ArtifactCard
- QuizExplanationPanel
- RelatedImagesStrip
- CaseVignetteCard

## Codex prompt
Use the existing repo as the base and implement a major content upgrade for the EBUS educational modules.

Goal:
The current app has strong media and visualization, but the written educational content and quizzes are too simplified. Upgrade the educational layer so the app reads like a concise fellowship-level EBUS handbook rather than a light intro app.

Important rules:
1. Keep the current routing and media system unless there is a clear blocker.
2. Do not delete current features. Upgrade the content architecture under `content/` and the renderers under the current web app source tree.
3. Preserve existing assets and case viewers.
4. Add richer explanatory content, teaching callouts, and better quiz logic.
5. Do not copy long passages from any source verbatim. Use concise original educational summaries.

Tasks:
1. Audit the current content files under `content/` and identify the simplified anatomy / knobology / quiz files.
2. Create a richer content schema that supports:
   - learning objectives
   - core concept sections
   - clinical pearls
   - pitfalls
   - station boundaries
   - staging implications
   - artifact explanations
   - detailed quiz explanations
3. Create or update content for these modules:
   - advanced knobology / ultrasound foundations
   - mediastinal anatomy and IASLC stations
   - sonographic interpretation of lymph nodes
   - linear EBUS procedural technique
   - staging and sampling strategy
4. Create detailed station content for:
   - 2R, 2L, 4R, 4L, 7, 10R, 10L, 11Rs, 11Ri, 11L
5. Upgrade the quizzes:
   - use case-based items
   - add artifact recognition questions
   - add station-boundary questions
   - add safe-sampling questions
   - add explanation text for every answer choice
6. Add UI components for richer educational rendering:
   - learning objectives card
   - clinical pearl callout
   - pitfall callout
   - station boundary card
   - landmark checklist
   - artifact card
   - quiz explanation panel
7. Wire the current station explorer and knobology routes so they can render the richer content blocks.
8. Keep content text in JSON/Markdown/MDX rather than embedding it in components.
9. Add a short authoring guide describing how to extend station pages and quizzes.

Acceptance criteria:
- The app content is substantially more detailed than the current simplified version.
- Knobology includes physics, artifacts, Doppler, and sampling pearls.
- Station pages clearly explain boundaries, landmarks, and staging implications.
- Quizzes are explanation-heavy and not simple recall only.
- The implementation preserves the current media-rich structure while making the educational layer much stronger.
