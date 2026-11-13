@AGENTS.md

Start with npm ci and npm run dev. Do not infer work from historical course material. Keep durable task notes in docs/tasks and review the actual diff before claiming completion.

## UI work follows the DoRoboty design system

Read [DOROBOTY.md](docs/design-system/DOROBOTY.md) before choosing any style or layout. It is the
required visual direction for new and changed screens: warm paper, Space Grotesk + IBM Plex Mono,
one orange signal, 1px lines and no blurred shadows. The host token layer is
[tokens.css](tokens.css) and the shared recipes are [src/app/doroboty.css](src/app/doroboty.css).
[GUI.md](GUI.md) is the short entry point.

Poster People is **no longer the target**. `docs/design-system/agent-kit` stays immutable as the
record of that earlier direction, and [README.md](docs/design-system/README.md),
[IMPLEMENTATION.md](docs/design-system/IMPLEMENTATION.md),
[HOST-COMPONENTS.md](docs/design-system/HOST-COMPONENTS.md),
[RECORDS.md](docs/design-system/RECORDS.md) and
[VERIFICATION.md](docs/design-system/VERIFICATION.md) remain useful for component contracts, host
ownership, routes/state/focus rules and acceptance scenarios — not for color, type or shape. Do not
reintroduce pink, Geist Serif or the people illustration.

Adapt the direction into existing React features, Base UI `render` components and the host tokens;
preserve hash routing, Zod, persona data, localStorage and application/employer workflows. Scope
visual changes to the requested task. Validate new UI at 1440 and 390 with keyboard and state
checks, run ./scripts/verify, update FEATURES.md for actual behavior changes and report actual
evidence. `npm run design-system:check` still verifies the archived kit's 67 files; the main app
runs with npm run dev at port 3001.
