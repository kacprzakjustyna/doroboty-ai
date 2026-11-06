# GUI — DoRoboty.ai

**Visual authority:** the `doroboty-screens` skill is the required visual direction for new and changed screens — warm paper, Space Grotesk + IBM Plex Mono, one orange signal. Invoke it before choosing styles or layout. Justyna decided this on 2026-11-06; it replaces Poster People, which this file previously required.

## Read before UI work

1. The `doroboty-screens` skill: typography, color roles, spacing, anatomy and screen patterns. It emits static HTML/CSS, so translate it into product React rather than mounting its markup.
2. [Host implementation rules](docs/design-system/IMPLEMENTATION.md): component owners, actual contracts, URL/focus rules and breakpoint values. These engineering rules still apply whatever the visual direction is.
3. [React component catalog](docs/design-system/HOST-COMPONENTS.md) and [record/CV APIs](docs/design-system/RECORDS.md): what already exists in src/, so a new screen reuses instead of duplicating.
4. [Acceptance checklist](docs/design-system/VERIFICATION.md) and [status/open findings](docs/design-system/STATUS.md): regression scenarios and unresolved issues.

`docs/design-system/` documents the superseded Poster People direction. Read it for the host contract and for what the running code does, not to decide how a screen should look. Keep `docs/design-system/agent-kit` immutable; `npm run design-system:check` still verifies it.

## Implement in this app

- Preserve the requested scope, React/TypeScript/Vite, hash routes, Base UI's `render` composition, Zod/local data operations and current application workflows.
- Do not paste the skill's markup, reset or example data into React, substitute example data for product state, or create a parallel button/card library.
- Implement product UI in src/ and the host token layer.
- Compare desktop/mobile evidence; test long content, missing salary/marks, keyboard focus, selection, dialogs and recovery. Run ./scripts/verify and report actual checks.
- The running application is still styled in the previous direction. Converting a screen is explicit task scope, not a side effect of a documentation edit.
