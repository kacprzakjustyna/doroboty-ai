# Working on DoRoboty.ai Case

This is an AIPH3 teaching prototype, separate from the public production portal.
Read BRIEF.md, docs/case/CASE_PROTOCOL.md, TODO.md and relevant FEATURES.md entries before product work.

## Start and boundaries

- Participant setup: Node.js 24, npm ci, npm run dev (http://127.0.0.1:3001).
- Role selection is a simulation, not security.
- Share plain Zod schemas between forms and domain operations.
- Preserve human editing and approval. Use synthetic data only.
- Keep historical case evidence separate from prototype state. Include only baseline in participant packages; source history and instructor materials must not be distributed.

## Workflow

1. Record intent and acceptance criteria in docs/tasks/ for changes larger than one line.
2. Do not let multiple agents write in one worktree.
3. Implement and run ./scripts/verify before claiming completion; explain actual failures.
4. Perform a separate review pass before merging. Record durable lessons when useful.

## Product behavior register

FEATURES.md describes current behavior, not a roadmap. Update it in the same change/commit for added, changed, removed or simulated flows. Preserve stable IDs, route/role/data boundaries and source/test references. Do not equate source coverage with an executed test or deployment. For changes without behavioral impact, record that the register was reviewed and did not need updating.

## Required design system

For every new or changed screen, use the `doroboty-screens` skill: warm paper, Space Grotesk + IBM Plex Mono and a single orange signal. Invoke it before choosing styles or layout. Justyna decided on 2026-11-06 that this skill is the authoritative visual direction and that it overrides Poster People, which this file previously required.

The skill emits static HTML/CSS. Translate its typography, color roles, spacing, anatomy and states into this project's React/TypeScript/Vite code and existing Base UI primitives. Keep the `render` API, hash routes, domain data and persistent local flows. Do not import the skill's markup, reset or example data into product React code. Current application styling is the superseded direction; convert it only within the active task scope.

`GUI.md` and `docs/design-system/` (including its README) document Poster People and are retained as history only. They no longer decide how a screen should look. Keep `docs/design-system/agent-kit` byte-identical; `npm run design-system:check` still verifies it. Implement product changes in src/ and the host token layer. Validate desktop/mobile, long content, keyboard/state and recovery yourself; no reference report verifies a new screen.

## Standards

- Code, comments and authored engineering documentation are English; end-user UI and canonical AIPH source wording are Polish.
- Use npm, Node.js 24 and package-lock.json. No second package manager.
- Features belong in src/features; src/components/ui contains shared Base UI primitives.
- For UI changes invoke the `doroboty-screens` skill and implement its direction with the existing Base UI components and render composition API. Do not take visual decisions from GUI.md or docs/design-system/, which document the superseded Poster People direction.
- Use React Router hash routes.
- Never log private free text or introduce secrets into the frontend.

## Validation

- npm run check verifies formatting, lint, types, unit tests, static build and browser journeys. ./scripts/verify runs the same gate.
- npm run dev never installs browser binaries or system tools. Browser tests require a provisioned Playwright Chromium; if missing, report it. Do not install OS dependencies automatically.
- Check mobile/desktop, keyboard access, error states and data recovery.
- Report what actually ran. Local checks do not prove CI, publishing or human approval.
