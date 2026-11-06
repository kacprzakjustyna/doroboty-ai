@AGENTS.md

Start with npm ci and npm run dev. Do not infer work from historical course material. Keep durable task notes in docs/tasks and review the actual diff before claiming completion.

## UI work follows the doroboty-screens design system

The authoritative visual direction for new and changed screens is the `doroboty-screens` skill: warm paper, Space Grotesk + IBM Plex Mono, one orange signal. Invoke that skill before choosing styles or layout. Justyna decided this on 2026-11-06; it replaces Poster People, which this file previously required.

The skill emits static HTML/CSS. Take its typography, color roles, spacing, anatomy and states and implement them in this application's React/TypeScript/Vite code, the existing Base UI `render` primitives and the host token layer. Do not mount the skill's markup, reset or example data as product code. Preserve hash routing, Zod schemas, persona data, localStorage and application/employer workflows. Scope visual changes to the requested task.

`GUI.md` and `docs/design-system/` document the superseded Poster People direction and are kept as history; they no longer decide how a screen looks. Keep `docs/design-system/agent-kit` immutable — `npm run design-system:check` still verifies its 67 files. The app runs with npm run dev at port 3001. Validate new UI at desktop/mobile widths and with keyboard/state checks, run ./scripts/verify, update FEATURES.md for actual behavior changes and report actual evidence.
