# SoCal EBUS Prep — Redesign Specification

## Executive Summary

This spec addresses three core problems in the current webapp: information overload on individual pages (especially Stations), disconnected educational content that floats away from the interactive modules it supports, and a navigation order that doesn't match how learners actually prepare for a hands-on EBUS course.

The redesign preserves all existing content and components while restructuring how they're composed, sequenced, and revealed. No content is deleted. No components are rewritten from scratch. The changes are primarily about **composition, routing, and progressive disclosure**.

---

## Problem 1: The Stations Page Is a Megapage

### Current state

`StationsPage.tsx` stacks six distinct learning activities into a single 320-line scroll:

1. Overview intro cards (map + explorer intro sections merged)
2. `EducationModuleRenderer` for `mediastinalAnatomyContent`
3. Station map + detail card (split grid)
4. Flashcard drill
5. Pin-the-station quiz + recognition challenge (split grid)
6. Three more `EducationModuleRenderer` blocks (sonographic, procedural, staging)

A fellow scrolling this page has no way to orient themselves. The education modules at the bottom are essentially invisible — nobody scrolls past two quizzes to find a handbook.

### Proposed fix: Sub-tabbed Stations page

Replace the single scroll with a tabbed layout inside the Stations route. Use the existing `control-pill` button style for the tab selector.

```
/stations              → redirects to /stations/explore
/stations/explore      → Map + StationDetail (the current split-grid)
/stations/flashcards   → Flashcard drill (full width, focused)
/stations/quiz         → Pin-the-station + recognition challenge (stacked, not side-by-side)
/stations/handbook     → All four EducationModuleRenderers
```

**Implementation approach:**

```tsx
// app/routes/StationsPage.tsx — becomes a layout with sub-tabs
export function StationsPage() {
  return (
    <div className="page-stack">
      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Module</div>
            <h2>Mediastinal Stations</h2>
          </div>
        </div>
        <nav className="sub-tab-row" aria-label="Station sub-modules">
          <NavLink to="/stations/explore" className={...}>Explore</NavLink>
          <NavLink to="/stations/flashcards" className={...}>Flashcards</NavLink>
          <NavLink to="/stations/quiz" className={...}>Quiz</NavLink>
          <NavLink to="/stations/handbook" className={...}>Handbook</NavLink>
        </nav>
      </section>
      <Outlet />  {/* nested route renders here */}
    </div>
  );
}
```

New CSS for the sub-tab row:

```css
.sub-tab-row {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 4px 0;
}
```

Each sub-route becomes its own focused file:

- `routes/stations/ExplorePage.tsx` — map + detail card only
- `routes/stations/FlashcardsPage.tsx` — flashcard drill only
- `routes/stations/QuizPage.tsx` — pin-the-station + recognition (stacked vertically)
- `routes/stations/HandbookPage.tsx` — all four education modules

**Why this matters:** Each learning activity gets full-width focus. A fellow can tap "Flashcards" and immediately start drilling without scrolling past the entire station map and detail card. The handbook content becomes discoverable through a dedicated tab instead of being buried after quizzes.

---

## Problem 2: Education Modules Are Disconnected from What They Teach

### Current state

The `EducationModuleRenderer` is a self-contained card that drops into the page as a "Handbook layer" block. It renders learning objectives, then a grid of section cards (core-concept, technique, pitfall, clinical-pearl, etc.). These blocks have no relationship to the interactive content around them:

- On `KnobologyPage`, the `knobologyAdvancedContent` module sits between the header tags and the knobology simulator. A fellow reads the handbook, then scrolls past it to reach the simulator — the educational content and the tool it explains are separated.
- On `StationsPage`, `mediastinalAnatomyContent` appears before the map, while `sonographicInterpretation`, `proceduralTechnique`, and `stagingStrategy` appear after the quizzes.

### Proposed fix: Contextual education via expandable drawers

Instead of rendering education modules as standalone blocks, attach them contextually to the interactive components they support.

**Pattern A: Inline expandable sections within StationDetail**

The `StationDetail` component currently renders ~15 information blocks simultaneously. Restructure it with collapsible accordion sections, and weave relevant education content into those sections.

```tsx
// Conceptual structure for the redesigned StationDetail
<StationDetailHeader station={station} />  {/* name, zone badge, bookmark */}

<TriViewCorrelate station={station} />  {/* CT / Bronch / EBUS — always visible */}

<Accordion defaultOpen="access">
  <AccordionPanel id="access" title="Access & EBUS Window">
    {/* accessProfile, bestEbusWindow, accessNotes */}
  </AccordionPanel>
  
  <AccordionPanel id="boundaries" title="Anatomic Boundaries">
    {/* StationBoundaryCard content */}
  </AccordionPanel>
  
  <AccordionPanel id="staging" title="Staging Significance">
    {/* StationStagingSummary + clinicalImportance */}
  </AccordionPanel>
  
  <AccordionPanel id="landmarks" title="Landmarks & Memory Cues">
    {/* landmarkChecklist + memoryCues + landmarkVessels */}
  </AccordionPanel>
  
  <AccordionPanel id="safety" title="Safe Puncture">
    {/* safePunctureConsiderations */}
  </AccordionPanel>
  
  <AccordionPanel id="whatYouSee" title="What You Should See">
    {/* ct/bronch/ebus checklists */}
  </AccordionPanel>
</Accordion>
```

**Pattern B: "Learn more" drawer on the knobology simulator**

Add a slide-out or collapsible panel to the knobology control lab that shows the relevant `knobologyAdvancedContent` section based on which control is active.

```tsx
// Inside KnobologyPanel, after the simulator
{showLearnMore && (
  <aside className="learn-more-drawer">
    <EducationSectionCard
      section={knobologyAdvancedContent.sections.find(
        s => s.id === `knobology-${activeControl}`
      )}
    />
  </aside>
)}
```

This creates a "interact first, reference on demand" flow instead of "read textbook, then scroll to tool."

---

## Problem 3: Station Detail Is a Wall of Information

### Current state

`StationDetail.tsx` renders everything simultaneously in a two-column layout (`detail-card__grid`). Left column: access info, boundary card, staging summary, landmark checklist, clinical importance, landmark vessels, memory cues, confusion pairs. Right column: three media slots, related images strip, three "what you should see" lists, safe puncture considerations, aliases.

A fellow looking at Station 7 is hit with 15+ distinct information blocks. There's no visual prioritization — boundary definitions have the same visual weight as memory cues.

### Proposed fix: Hero + Accordion

Keep the tri-view correlate images as the **hero** (always visible, full width), since image correlation is the primary learning task. Move everything else into accordion panels grouped by learning intent.

Suggested groups:

| Accordion Section | Contents | Why grouped |
|---|---|---|
| **At a Glance** (default open) | accessProfile, bestEbusWindow, accessNotes, zone, laterality | Quick operational reference |
| **Anatomic Boundaries** | boundaryDefinition, boundaryNotes | Spatial anatomy |
| **What You Should See** | ct checklist, bronch checklist, EBUS checklist | Pairs with the tri-view images above |
| **Staging & Clinical Impact** | nStageImplication, clinicalImportance, stagingChangeFinding | Clinical decision-making |
| **Memory Aids** | memoryCues, confusionPairs, commonConfusionPair, aliases | Study/drill |
| **Landmarks & Safety** | landmarkChecklist, landmarkVessels, safePunctureConsiderations | Procedural reference |

New Accordion component (simple, no dependencies):

```tsx
function Accordion({ children }: { children: ReactNode }) {
  return <div className="accordion">{children}</div>;
}

function AccordionPanel({
  id,
  title,
  defaultOpen = false,
  children,
}: {
  id: string;
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className={`accordion__panel${isOpen ? ' accordion__panel--open' : ''}`}>
      <button
        className="accordion__trigger"
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${id}`}
      >
        <span>{title}</span>
        <span className="accordion__chevron">{isOpen ? '▾' : '▸'}</span>
      </button>
      {isOpen && (
        <div className="accordion__content" id={`accordion-content-${id}`}>
          {children}
        </div>
      )}
    </div>
  );
}
```

CSS:

```css
.accordion {
  display: grid;
  gap: 2px;
}

.accordion__trigger {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 14px 16px;
  border: none;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.03);
  color: var(--text);
  font-family: 'Space Mono', monospace;
  font-size: 0.88rem;
  text-align: left;
  cursor: pointer;
  transition: background 120ms ease;
}

.accordion__trigger:hover {
  background: rgba(255, 255, 255, 0.06);
}

.accordion__content {
  padding: 16px;
  animation: accordionSlide 200ms ease;
}

@keyframes accordionSlide {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

## Problem 4: Navigation Doesn't Follow the Learning Path

### Current state

Nav order: Home → Stations → Case 3D → Knobology → Lectures → Quiz

This makes no pedagogical sense. Stations requires knowledge the learner hasn't built yet. Knobology (learning the machine) should come before Station exploration. Lectures (pre-course prep) are buried in position 5.

### Proposed fix: Reorder to match learning progression

```
Home → Lectures → Knobology → Stations → Cases → Quiz
```

Rationale:
1. **Lectures** — Pre-course reading/viewing (do this days before)
2. **Knobology** — Learn the ultrasound machine controls
3. **Stations** — Learn mediastinal anatomy and EBUS correlation
4. **Cases** — Apply knowledge to a real case
5. **Quiz** — Test yourself across all modules

Update in `App.tsx`:

```tsx
const navItems: NavigationItem[] = [
  { id: 'home',      label: 'Home',       icon: '⌂', path: '/' },
  { id: 'lectures',  label: 'Lectures',   icon: '▶', path: '/lectures' },
  { id: 'knobology', label: 'Knobology',  icon: '◐', path: '/knobology' },
  { id: 'stations',  label: 'Stations',   icon: '◎', path: '/stations' },
  { id: 'case-001',  label: 'Case',       icon: '◫', path: '/cases/case-001' },
  { id: 'quiz',      label: 'Quiz',       icon: '✎', path: '/quiz' },
];
```

Additionally, add a **learning path indicator** on the Home page:

```tsx
<section className="section-card">
  <div className="section-card__heading">
    <div>
      <div className="eyebrow">Recommended path</div>
      <h2>Prepare in order</h2>
    </div>
  </div>
  <div className="learning-path">
    {learningSteps.map((step, i) => (
      <NavLink key={step.id} to={step.path} className="learning-path__step">
        <div className={`learning-path__marker${step.complete ? ' --done' : ''}`}>
          {i + 1}
        </div>
        <div>
          <strong>{step.title}</strong>
          <ProgressBar percent={step.percent} />
        </div>
      </NavLink>
    ))}
  </div>
</section>
```

---

## Problem 5: Quiz Activities Crammed Side-by-Side

### Current state

On the Stations page, pin-the-station quiz and recognition challenge are in a `split-grid` — two unrelated quiz activities sharing a row. On small screens they stack anyway; on desktop they compete for attention.

### Proposed fix

Move these to the dedicated `/stations/quiz` sub-route (see Problem 1). Stack them vertically with a clear transition between them:

```tsx
// routes/stations/QuizPage.tsx
export function StationsQuizPage() {
  return (
    <div className="page-stack">
      <PinTheStationQuiz />   {/* full width */}
      <RecognitionChallenge /> {/* full width, below */}
    </div>
  );
}
```

Reserve `split-grid` only for genuinely linked panels like the map + detail card.

---

## Problem 6: Home Page Progress Is Thin

### Current state

Four mini-cards showing raw numbers (completed modules, bookmarked stations, reviewed lectures, latest quiz %). No actionable "what to do next" guidance.

### Proposed fix: "Continue where you left off" card

Replace the four mini-cards with a contextual resume section:

```tsx
<section className="section-card">
  <div className="section-card__heading">
    <div>
      <div className="eyebrow">Pick up where you left off</div>
      <h2>Your progress</h2>
    </div>
  </div>
  
  {/* Last-visited module with resume button */}
  {lastModule && (
    <NavLink to={lastModule.path} className="resume-card">
      <div>
        <strong>{lastModule.title}</strong>
        <ProgressBar percent={lastModule.percent} />
      </div>
      <span className="button">Resume →</span>
    </NavLink>
  )}
  
  {/* Per-module progress bars */}
  <div className="progress-list">
    {allModules.map(mod => (
      <NavLink key={mod.id} to={mod.path} className="progress-row">
        <span>{mod.title}</span>
        <ProgressBar percent={mod.percent} />
        <span className="progress-row__label">{mod.percent}%</span>
      </NavLink>
    ))}
  </div>
</section>
```

---

## Problem 7: Visual Hierarchy Is Too Uniform

### Current state

Everything uses the same card treatment: `border-radius: var(--radius-lg)`, `border: 1px solid rgba(123, 163, 200, 0.14)`, `background: linear-gradient(...)`. Section cards, mini-cards, education cards, detail cards, quiz cards — they all look the same. Headings (h2, h3) have similar sizing. There's no visual distinction between interactive elements (simulators, quizzes) and reference content (handbook sections, checklists).

### Proposed fixes

**A. Differentiate interactive vs. reference cards:**

```css
/* Interactive elements: simulators, quizzes, exercises */
.interactive-card {
  border-left: 3px solid var(--accent-cyan);
  background: linear-gradient(180deg, rgba(22, 40, 62, 0.72), rgba(8, 16, 28, 0.94));
}

/* Reference/handbook content */
.reference-card {
  border-left: 3px solid var(--text-muted);
  background: rgba(10, 18, 32, 0.48);
}
```

**B. Increase heading contrast:**

```css
/* Primary page heading */
.page-title {
  font-size: clamp(1.6rem, 1.3rem + 1.2vw, 2.4rem);
  font-weight: 700;
  letter-spacing: -0.01em;
}

/* Section heading inside a card */
.section-card h2 {
  font-size: clamp(1.2rem, 1rem + 0.8vw, 1.6rem);
}

/* Sub-heading inside education cards */
.education-card h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-soft);
}
```

**C. Add breathing room between major sections:**

```css
.page-stack {
  gap: 24px;  /* up from 18px */
}

/* Tighter gap within card groups */
.card-group {
  gap: 12px;
}
```

---

## Proposed New Route Structure

```
/                           → HomePage (with learning path + resume card)
/lectures                   → LecturesPage
/knobology                  → KnobologyPage (with contextual learn-more drawers)
/stations                   → StationsLayout (sub-tab shell)
  /stations/explore         → MapExplorePage (map + detail with accordion)
  /stations/flashcards      → FlashcardsPage
  /stations/quiz            → StationsQuizPage (pin + recognition, stacked)
  /stations/handbook        → HandbookPage (4 education modules)
/cases/case-001             → Case001Page
/quiz                       → QuizPage (unchanged)
```

---

## Implementation Priority

| Priority | Change | Effort | Impact |
|---|---|---|---|
| **P0** | Split Stations page into sub-tabs | Medium | High — removes the megapage problem |
| **P0** | Reorder navigation | Trivial | High — fixes the learning flow |
| **P1** | Accordion on StationDetail | Medium | High — makes detail card usable |
| **P1** | Redesign Home page progress section | Low | Medium — better wayfinding |
| **P2** | Visual hierarchy improvements (card differentiation, heading contrast) | Low | Medium — better scanability |
| **P2** | Contextual education drawers on Knobology | Medium | Medium — connects teaching to tools |
| **P3** | Learning path indicator on Home | Low | Low — nice polish |

P0 changes alone will dramatically improve the experience. They can be shipped as a single PR without touching any content JSON files or modifying existing component internals.

---

## Files Changed per Priority

### P0: Stations sub-tabs + nav reorder

New files:
- `apps/web/src/app/routes/stations/ExplorePage.tsx`
- `apps/web/src/app/routes/stations/FlashcardsPage.tsx`
- `apps/web/src/app/routes/stations/StationsQuizPage.tsx`
- `apps/web/src/app/routes/stations/HandbookPage.tsx`

Modified files:
- `apps/web/src/app/App.tsx` (add nested routes, reorder navItems)
- `apps/web/src/app/routes/StationsPage.tsx` (gut to layout shell + Outlet)
- `apps/web/src/styles/index.css` (add sub-tab-row styles)

### P1: Accordion + Home progress

New files:
- `apps/web/src/components/Accordion.tsx`

Modified files:
- `apps/web/src/features/stations/StationDetail.tsx` (wrap sections in accordion)
- `apps/web/src/app/routes/HomePage.tsx` (replace mini-card progress with resume card)
- `apps/web/src/styles/index.css` (accordion styles, resume card styles)

### P2: Visual hierarchy + Knobology drawers

Modified files:
- `apps/web/src/styles/index.css` (card differentiation, heading sizes)
- `apps/web/src/components/education/education.css` (reference card treatment)
- `apps/web/src/features/knobology/KnobologyPanel.tsx` (add learn-more drawer)
