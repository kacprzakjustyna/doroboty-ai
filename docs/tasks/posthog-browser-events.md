# PostHog browser events

## Intent and acceptance

Course task: add the PostHog browser library so the prototype collects browser events.

- `posthog-js` is a dependency and is initialised once in `src/main.tsx`.
- Capture starts only when `VITE_PUBLIC_POSTHOG_KEY` is set at build time; local dev, tests and participant packages send nothing by default.
- Pageviews follow hash-route changes; autocapture masks element text and attributes; session replay is off; no identification. This keeps the "never log private free text" rule.
- The project key is a public `phc_` key, read from the environment, not committed.
- FEATURES.md gains SYS-14 and the limits line is updated.

## Validation

`./scripts/verify` passed under Node 24.22.3 (the container ships Node 22, so a Node 24 binary was used for the run): formatting, 67-file kit check, lint, types, 32 unit tests (2 new in src/lib/analytics.test.ts), packet, build and 39 Chromium journeys.

Browser probe of the built app: without the key no request goes to posthog.com; with a dummy key the SDK loads its remote config from eu-assets.i.posthog.com and calls eu.i.posthog.com/flags/. Real event ingestion still needs a real project key set as a build environment variable (for example in Netlify) and was not verified here. No UI changed, so the design system and 1440/390 screen checks do not apply.
