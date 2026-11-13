# Keep the Netlify publishing settings in the repository

## Intent

The prototype is published to Netlify from `main` with auto-publishing on, but the
build command, publish directory and headers existed only in the Netlify panel. Nothing in
the repository said how the application is deployed, so the settings could not be reviewed in a
diff, would not survive the project being re-linked or forked, and a contributor reading the code
had no way to know what runs on deploy. `netlify.toml` moves them next to the code.

## Scope

Publishing configuration only. No application code, no product behavior, no visual change.

## Acceptance criteria

- `netlify.toml` states the build command (`npm run build`) and publish directory (`dist`), both
  matching what the working deploy already does.
- The Node version keeps a single source of truth in `.nvmrc` (24); `NODE_VERSION` is deliberately
  not repeated in `netlify.toml`, because it would override `.nvmrc` once the two drift.
- Hashed assets under `/assets/*` are cached immutably; every other response carries `nosniff` and
  a referrer policy.
- The deploy preview for the pull request builds and serves the application correctly **before**
  the change reaches the production site.

## Decisions

- **No framing header.** `X-Frame-Options` / `frame-ancestors` would block the embedded preview of
  a deploy inside the Netlify dashboard, which is how changes are reviewed on this project. The
  prototype has no login and no real personal data, so there is nothing for it to protect.
- **No SPA catch-all rewrite.** The application uses hash routes, so deep links already resolve to
  `index.html` without one; FEATURES.md (SYS-11) records that property. A catch-all would also
  convert a genuinely missing file into a silent 200.
- **No verification gate in the build command.** `./scripts/verify` needs a provisioned Playwright
  Chromium and would make every deploy slow and fragile. CI and the local gate cover that;
  `npm run build` still runs `tsc --noEmit`, so a type error fails the deploy.

## Product behavior register

FEATURES.md was reviewed and needed no update: this change alters how the application is published,
not what it does.

## Evidence

Verification gate to be recorded with the actual run. The meaningful check for this change is the
pull request's Netlify deploy preview: it builds with this file and must serve the application
before the change is merged into `main`.
