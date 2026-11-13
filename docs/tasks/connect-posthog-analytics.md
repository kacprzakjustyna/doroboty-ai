# Connect PostHog product analytics

## Intent

Add PostHog Cloud product analytics to the prototype so the AIPH3 participant can observe
events, funnels and retention for the marketplace journey. Autocapture is enabled so that
interaction data arrives without hand-instrumenting every control. Session replay stays off
and free-text controls are excluded from autocapture, because the prototype carries candidate
answers and CV metadata and `AGENTS.md` forbids logging private free text.

This reverses the `SYS-03` "Removed" state for telemetry delivery. It does not add a server
route: collection is client-side only, keyed by a public project key read from the environment.

## Acceptance criteria

- `posthog-js` is a runtime dependency and the project builds, lints and type-checks with it.
- Analytics initialise only when `VITE_PUBLIC_POSTHOG_KEY` is set. With no key the app runs
  unchanged, sends nothing and logs a single development notice; no crash and no network call.
- The ingestion host defaults to PostHog Cloud EU and is overridable with
  `VITE_PUBLIC_POSTHOG_HOST`.
- Autocapture is on. Session replay and surveys are off. Person profiles stay `identified_only`
  and the prototype never calls `identify`, so events remain anonymous.
- `$pageview` is captured manually on every hash-route change, because automatic
  `history_change` capture is not documented to cover `#/...` URLs. No duplicate pageview is
  sent for the same route under React `StrictMode` double-effects.
- Shared `Input` and `Textarea` primitives carry `data-ph-no-autocapture`, so typed values and
  those elements are excluded from autocapture by PostHog's default `css_selector_ignorelist`.
  Callers can still override the attribute.
- Every event carries `app=doroboty-prototype` and `data_source=synthetic-demo` so prototype
  traffic is never mistaken for production data.
- `.env.example` documents both variables; real keys stay untracked via `.gitignore`.
- `FEATURES.md` records the changed telemetry behavior.
- `./scripts/verify` is run and actual results are reported.

## Implementation and verification

- Added `posthog-js@1.448.0` as a runtime dependency. `npm install` also re-sorted the existing
  dependency blocks in `package.json` alphabetically; no existing version changed. The lockfile
  gained 12 PostHog transitive packages and no existing package was bumped. The `npm audit`
  findings (`deepmerge`, `minimatch` via `shadcn`/`ts-morph`/`typescript-eslint`) pre-date this
  change and are not introduced by PostHog.
- `src/lib/analytics.ts` holds init, a narrow `PrototypeEvent` union, `trackEvent` and
  `trackPageview`. `initAnalytics()` runs from `src/main.tsx` before the first render and returns
  early with a development notice when no key is present. `src/lib/use-analytics-pageviews.ts`
  sends `$pageview` from inside `HashRouter` via the `AnalyticsPageviews` component in
  `src/features/prototype/app.tsx`. Route de-duplication lives at module scope, because a
  component ref is recreated by StrictMode's double mount and would not suppress the duplicate.
- Option names were taken from the current PostHog JS config and autocapture documentation, not
  from memory. Two assumptions were corrected against it: the autocapture exclusion hook is
  `.ph-no-autocapture` / `[data-ph-no-autocapture]` (`ph-no-capture` is the session-replay block
  class), and `css_selector_ignorelist` is deliberately left unset because supplying a custom
  list would replace the defaults that honour those attributes.
- `data-ph-no-autocapture` was first added only to the shared `Input`/`Textarea` primitives. A
  browser check found 17 inputs on `/#/oferty` with none guarded, because the marketplace search
  field, the filter facets and the settings file picker are raw elements. The free-text search
  input (`marketplace.tsx`) and the file picker (`settings.tsx`) were guarded as well. The 16
  filter checkboxes are intentionally left capturable: they hold no free text and record which
  filters are used.
- `./scripts/verify` initially failed at `design-system:check` because the container shells into
  Node v22.23.4 while the repository requires Node 24; this is an environment issue, not a
  product failure. Re-run with `/opt/node24/bin` (Node 24.22.1, npm 11.19.1) the full gate
  passed: formatting, archived-kit integrity (67 files), lint, types, 30 unit tests in 5 files,
  participant packet verification, production build and 39 Chromium journeys. The build keeps its
  pre-existing >500 kB chunk warning.
- Browser checks against the production build, with PostHog traffic served by a local stand-in so
  nothing left the machine. Without a key: the app renders, `window.posthog` is absent and zero
  requests are made. With a key: PostHog bootstraps (config and `/flags/` requests observed) and
  no `$snapshot` is produced, confirming replay is off. A canary string typed into the candidate
  answer field and submitted did not appear in any outbound payload, and the field carries the
  exclusion attribute; all free-text inputs reached were guarded.
- NOT VERIFIED: event arrival in a PostHog project. posthog-js drops events from automated
  browsers via its bot filter, which reports the dropped event by name as `$pageview` — evidence
  that manual pageview capture fires, but not proof of ingestion. Overriding the user agent and
  masking `navigator.webdriver` did not defeat the filter; capturing in an automated browser
  needs `opt_out_useragent_filter: true`, which was not added to product code. Ingestion,
  dashboards and retention remain unverified from this repository and must be confirmed with a
  real key in PostHog's Activity view.
- Not included: manual `job_viewed` / `apply_clicked` / `filter_used` instrumentation. The typed
  `trackEvent` helper is in place for it; autocapture covers the interactions meanwhile.

## Separate review

Reviewed the completed diff. `package.json` carries only the new dependency plus npm's
alphabetical re-sort; the lockfile adds only PostHog packages. No secret is committed:
`.env.example` holds empty values and `.gitignore` keeps `.env*` untracked behind an
`!.env.example` exception. No new font, colour, radius or design token was introduced and no
screen layout changed, so the design system is untouched. Hash routing, Zod schemas, persona
data, localStorage and the application/employer workflows are unchanged; all 39 existing
journeys still pass. The dummy key used for local checks exists only in files outside the
repository and the dummy-key build output was deleted. No merge, deployment, publishing or human
approval is claimed.
