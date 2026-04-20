IMPLEMENTATION_REPORT

Goal:
- Add an optional live Supabase path to `EBUS-course` without breaking offline-first behavior.
- Give Codex sessions in the related repos a concrete contract for auth, schema, and deployment follow-through.

Scope:
- `EBUS-course/apps/web` browser client, sync provider, and learner-facing sync status UI
- Cross-repo handoff for `Interventional-Pulm-Education-Project` and the shared Supabase project
- Notes for `Procedure_suite` and `POCUS-review` where they share auth/project concerns

Constraints:
- The course is still deployed as a static bundle served by `Interventional-Pulm-Education-Project` under `/socal-ebus-course/app/`.
- This repo must stay browser-only. No `service_role` key, no server secret handling, no server-side Supabase assumptions here.
- Local learner progress remains the default and must work with no session and no Supabase env.
- All remote writes must run under authenticated RLS with the browser anon or publishable key.

Plan:
1. Add a browser-side Supabase client gated behind `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
2. Auto-sync authenticated learner progress from local state into the shared project while preserving local-first fallback.
3. Surface sync state in the UI so failures are visible during integration.
4. Hand off exact next steps to the other repos and shared Supabase project.

Changes Made:
- Added browser-only env support in `apps/web/.env.example` and typed `VITE_*` env access.
- Added `@supabase/supabase-js` and a singleton browser client.
- Added a `SupabaseSyncProvider` that:
  - detects whether a Supabase session exists
  - keeps working when there is no session
  - upserts learner data under RLS when there is a session
- Added a visible `SupabaseSyncCard` to the course home page.
- Updated the pretest copy so it no longer says sync is unavailable.

Evidence:
- Files inspected: [
  `apps/web/src/lib/progress.tsx`,
  `apps/web/src/app/routes/HomePage.tsx`,
  `apps/web/src/app/routes/PretestPage.tsx`,
  `apps/web/src/components/AppShell.tsx`,
  `apps/web/src/components/TopHeader.tsx`,
  `apps/web/src/styles/index.css`,
  `repo_env_templates_and_cutover.md`,
  `supabase_unified_migration.sql`,
  `Interventional-Pulm-Education-Project/SOCAL-EBUS-COURSE-INTEGRATION-GUIDE.md`
]
- Files changed: [
  `apps/web/package.json`,
  `apps/web/package-lock.json`,
  `package.json`,
  `apps/web/.env.example`,
  `apps/web/src/lib/runtime.ts`,
  `apps/web/src/features/supabase/client.ts`,
  `apps/web/src/features/supabase/sync.ts`,
  `apps/web/src/features/supabase/sync.test.ts`,
  `apps/web/src/features/supabase/SupabaseSyncProvider.tsx`,
  `apps/web/src/features/supabase/SupabaseSyncCard.tsx`,
  `apps/web/src/main.tsx`,
  `apps/web/src/app/routes/HomePage.tsx`,
  `apps/web/src/app/routes/PretestPage.tsx`,
  `content/modules/pretest.json`,
  `content/modules/modules.json`
]
- Commands run: [
  `npm --prefix apps/web install @supabase/supabase-js`,
  `npm run typecheck`,
  `npm run test`,
  `npm run build`,
  `npm run build:embed`
]
- Test results: [
  `typecheck` passed,
  `vitest` passed,
  `build` passed,
  `build:embed` passed
]
- Key findings: [
  `EBUS-course` now writes to `learner_profiles`, `learner_progress_snapshots`, `learner_module_progress`, and `learner_lecture_progress` when a Supabase browser session exists.
  The app still works fully offline and locally when env or session are missing.
  The embedded deployment model means the main site repo must own the auth/session story if live sync is expected in production.
]

Open Questions:
- What is the exact shared Supabase project ref for production? The currently connected Supabase MCP did not expose the expected project, so env examples still use placeholders.
- Does `Interventional-Pulm-Education-Project` already establish a Supabase browser session before loading `/socal-ebus-course`? If not, the embedded app will stay local-only even with env configured.
- Is `learner_pretest_attempts` intended to become a first-class synced table, or is `learner_progress_snapshots` the current source of truth for detailed pretest state?

Next Recommended Step:
- Run the repo-specific tasks below in `Interventional-Pulm-Education-Project` and the shared Supabase project before expecting production live sync.

Cross-Repo Handoff

1. `Interventional-Pulm-Education-Project`

Goal:
- Ensure the embedded EBUS app can see an authenticated Supabase browser session on the same shared project.

What changed in `EBUS-course` that this repo must honor:
- The embedded bundle now expects browser-safe env only:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_APP_CODE=ebus_course`
  - `VITE_COURSE_CODE=socal_ebus_prep`
- The embedded app writes under the authenticated user context and does not have any server secret.
- The embedded app is still built for `/socal-ebus-course/app/` via `npm run build:embed`.

Codex task:
- Verify the main site authenticates users against the same shared Supabase project the embedded app will use.
- Verify the wrapper page for `/socal-ebus-course` only embeds the app after a browser session exists, or clearly accepts that the app will remain local-only for signed-out users.
- Confirm the auth callback and browser client use the same Supabase URL and publishable or anon key as the EBUS app.
- Confirm the sync script builds the embedded app with the correct base path and copies the new bundle output.
- Confirm CSP and frame headers still allow the embedded bundle, fonts, media, and vtk asset requests.

Acceptance criteria:
- A signed-in learner opens `/socal-ebus-course`.
- The embedded app shows a live session in the sync card, not "No session".
- Pretest answers or bookmarks result in a successful sync state inside the embedded app.

Suggested files to inspect:
- `src/app/auth/callback/route.ts`
- `src/app/socal-ebus-course/page.tsx`
- `.env.example`
- Supabase browser client factory files
- `scripts/sync-socal-ebus-course.mjs`
- `next.config.mjs`

2. Shared Supabase project

Goal:
- Ensure the canonical learner tables and RLS policies expected by `EBUS-course` exist and allow authenticated self-service writes.

Expected browser writes from `EBUS-course`:
- `public.learner_profiles`
- `public.learner_progress_snapshots`
- `public.learner_module_progress`
- `public.learner_lecture_progress`

Codex task:
- Apply or verify the SQL in `supabase_unified_migration.sql`.
- Confirm these tables exist with the expected conflict targets:
  - `learner_profiles`: primary key on `id`
  - `learner_progress_snapshots`: unique or primary key on `learner_id`
  - `learner_module_progress`: unique key on `(learner_id, module_id)`
  - `learner_lecture_progress`: unique key on `(learner_id, lecture_id)`
- Confirm RLS lets `auth.uid()` insert or update their own rows exactly as the migration assumes.
- Seed any required `app_memberships` rows only if your broader platform depends on them; `EBUS-course` live sync itself currently relies on authenticated self-writes, not admin-only roles.
- If `learner_pretest_attempts` should receive structured writes next, define the exact schema and conflict strategy before changing the web app.

Acceptance criteria:
- With only the publishable or anon key and an authenticated browser session, the EBUS app can upsert the four tables above without policy errors.
- RLS still blocks cross-user access.

Suggested source material:
- `repo_env_templates_and_cutover.md`
- `supabase_unified_migration.sql`
- `apps/web/src/features/supabase/SupabaseSyncProvider.tsx`
- `apps/web/src/features/supabase/sync.ts`

3. `Procedure_suite`

Goal:
- Keep JWT verification aligned with the same shared Supabase project if this service consumes shared user context.

Codex task:
- Verify JWT validation uses the shared Supabase JWKS or JWT secret noted in `repo_env_templates_and_cutover.md`.
- Confirm any QA or user-facing tables that depend on shared auth still work after the unified migration.

Acceptance criteria:
- Tokens minted for the shared project remain valid for protected Procedure Suite routes.

4. `POCUS-review`

Goal:
- Move hardcoded shared-project config out of source and keep the shared auth or project config consistent.

Codex task:
- Replace hardcoded project values with build config or plist or xcconfig keys as described in `repo_env_templates_and_cutover.md`.
- Confirm the app still points at the same shared project if unified auth is intended.

Acceptance criteria:
- The mobile app no longer hardcodes the shared project URL or anon key in source.

Paste-Ready Prompt For Other Codex Sessions

Use this exact prompt in the target repo if you want Codex to continue the integration:

```text
Read these first:
- /Users/russellmiller/Projects/EBUS-course/Codex_handoff_items/supabase-live-sync-cross-repo-handoff.md
- /Users/russellmiller/Projects/repo_env_templates_and_cutover.md
- /Users/russellmiller/Projects/supabase_unified_migration.sql
- /Users/russellmiller/Projects/Interventional-Pulm-Education-Project/SOCAL-EBUS-COURSE-INTEGRATION-GUIDE.md

Context:
- `EBUS-course/apps/web` now has an optional live Supabase browser sync layer.
- It writes authenticated learner data to `learner_profiles`, `learner_progress_snapshots`, `learner_module_progress`, and `learner_lecture_progress`.
- The course is still deployed as a static embedded bundle under `/socal-ebus-course/app/`, so this repo must own whatever auth, env, or database work is needed for that browser sync to succeed.

Task:
- Inspect this repo and implement the missing pieces needed so the embedded EBUS app can use the shared Supabase project successfully.
- Keep the smallest safe scope.
- Run the relevant checks.
- Return an evidence-based summary with files changed, commands run, and any remaining blockers.
```
