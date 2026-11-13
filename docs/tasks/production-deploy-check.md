# Production deploy check and Netlify release guide

## Intent

The readiness audit (docs/production-readiness.html, deployment stage) found that a failed or stuck Netlify deploy reaches nobody: on the Free plan Netlify cannot email the owner, and only a GitHub commit status turns red. The release guide also still described GitHub Pages although the prototype is published by Netlify from `main`.

## Acceptance criteria

- A GitHub Actions workflow runs after every push to `main` (and on manual dispatch). It builds the same commit, then waits until the production site serves that build's hashed entry files. If they do not appear within the time limit, or the site or an asset does not answer, the job fails, so GitHub notifies the person who pushed or merged (default GitHub notification settings, Free plan).
- The check runs from a small dependency-free Node script with an explicit timeout; it prints what it expected and what it saw, no secrets.
- Manual dispatch accepts a site address so the owner can trigger a deliberate failure and confirm that the notification email arrives.
- `docs/RELEASE.md` describes the actual Netlify flow: publishing from `main`, deploy previews, the smoke check, rollback by publishing an earlier deploy, and the outage plan.
- FEATURES.md register entry for the new tooling.

## Out of scope

Uptime monitoring between releases (no paid service); Netlify settings.

## Results

- Added `.github/workflows/production-check.yml` and `scripts/check-production.mjs`; rewrote `docs/RELEASE.md` for Netlify; FEATURES.md SYS-13.
- Local runs of the script (session container, Node 22 with the session proxy): against the live site it exited 0 ("Production serves this commit's build and all 3 entry assets"); against `/nie-ma` with a 5s limit it exited 1 after HTTP 404 responses. The workflow itself first runs after this change reaches `main`; the alert email still needs the owner's confirmation via a deliberate manual run.
- Format, lint and packet verifier passed. The participant package allowlist does not include the new script or workflow, so participant forks do not check this site.

## Follow-up: first run on main (2026-11-13)

- The first Production check run on `main` (run 43406337393) failed after about two minutes with an uncaught `fetch failed` / `ECONNRESET`. The commit changed no application files, so the live site already named the expected assets. The script went straight to the per-asset requests, which had no timeout or retry. One request hung and was then reset, and the script crashed instead of retrying.
- Fix: every request has a 15s timeout (`CHECK_REQUEST_SECONDS`), and the complete check (page, headers, every asset) is one attempt that is retried until the deadline. Local fake server reproduction: before the fix, two connection resets crashed the script (exit 1, uncaught). After it, two resets were retried and passed (exit 0); permanent resets and a hanging server each failed with a readable message (exit 1); the live site passed.
- The same push's CI run (43406337351) failed in `offer section links survive copied URLs…` (tests/e2e/prototype.spec.ts:626). In the copied tab, `#employer` sat at y=79.9 instead of <50, and the same value came back on the automatic retry. The same test passed in the PR's CI run on identical code and 30/30 times locally. Several hypotheses did not reproduce locally: delayed fonts with Inter, DejaVu Sans and DejaVu Sans Mono fallbacks, delayed images, CPU throttling up to 16x, and smooth scrolling (the code scrolls with `behavior: "instant"`). The CI trace shows fonts requested about 220ms after the script in the copied tab. Root cause still open; the test is unchanged.
