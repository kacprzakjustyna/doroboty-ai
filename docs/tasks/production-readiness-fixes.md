# Production readiness fixes (course exercise)

## Intent

Close the preparation-stage gaps found in [docs/production-readiness.html](../production-readiness.html). This is a course exercise: nothing is deployed and the GitHub Pages target is described, not configured.

## Acceptance criteria

- Cross-tab writes: when another tab changes the saved scenario, this tab adopts the newer valid save and tells the user, so its next save does not silently discard the other tab's changes. Invalid or removed foreign saves are ignored. Browser test with two tabs.
- Render failures: a crash inside the routed UI shows a Polish recovery screen instead of a blank page, with scenario export, a way back to the listing, reload and a link to report the problem. No private free text is logged. Browser test.
- Support: settings explain where to report a problem (GitHub Issues bug form).
- Release guide: docs describe how a course release to GitHub Pages would be built from a specific commit, what to check right after publishing, how to roll back and what to do when hosting is unavailable.
- UI follows existing Poster People host recipes (`prototype-section`, `prototype-panel`, Button variants); no new visual family.
- FEATURES.md updated (SYS-09/SYS-10, settings); `./scripts/verify` steps run; readiness report refreshed.

## Results (2026-11-13)

- Implemented: storage-event sync in `src/features/prototype/store.tsx`, `RenderErrorBoundary` in `src/features/prototype/error-boundary.tsx` (wired in `app.tsx`), report link in settings (`support.ts`), release guide `docs/RELEASE.md`, FEATURES.md SYS-10/SYS-12/CAN-17.
- Checks run in the session container (Node 22.23.4, not the required 24): format, kit integrity (67 files), lint, typecheck, 27 unit tests, packet verifier, build and 37/37 Playwright tests passed. The design-system example check (`agent-kit` check script) refuses Node 22, so the full `./scripts/verify` gate is still to be run on Node 24.
- The new two-tab test fails against the previous `store.tsx` and passes with the fix.
- Visual check: recovery page and settings at 1280px and 390px, no horizontal scroll, keyboard Tab reaches the recovery actions. Existing settings page has no side gutter at 390px (pre-existing, out of scope).
