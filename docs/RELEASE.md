# Release guide (course exercise)

This prototype is a course exercise. Nothing is deployed automatically and no hosting is configured in this repository. This guide records how a release to GitHub Pages **would** be done, checked and undone, so the readiness checklist ([production-readiness.html](production-readiness.html)) can assess the plan.

## What a release is

A release is the static `dist/` folder built from one known commit. The app has no server, database or secrets; all scenario data stays in each visitor's browser (localStorage). The saved data format is version 1 and unchanged by this release, so code can be rolled back without touching any data.

## Build a specific version

1. Check out the exact commit and note its hash: `git rev-parse HEAD`.
2. Use Node.js 24 (`.nvmrc`) and the lockfile: `npm ci`.
3. Run the full gate: `./scripts/verify`. Do not release if it fails.
4. Build: `npm run build`. The output is `dist/` (relative asset paths, `base: "./"`), so it works under the GitHub Pages project path `/doroboty-ai/`.

## Publish to GitHub Pages (manual, when actually wanted)

GitHub Pages can serve a folder built by a GitHub Actions workflow (Settings → Pages → Source: GitHub Actions). That requires a separate, reviewed workflow change and is out of scope for the course exercise. Record the published commit hash next to the release.

## Smoke check right after publishing

Open the published address in a private window and check:

1. The homepage loads with illustration, fonts and company logos.
2. A deep link such as `#/oferty/ai-product-manager` opens directly and after a refresh.
3. Main journey: choose Anna → apply to an offer → switch to the employer → record a decision → refresh; data is still there.
4. Settings: export downloads `doroboty-scenariusz.json`; the "Zgłoś problem" link opens the GitHub bug form.
5. The browser developer tools show no failed requests and no requests to external services.
6. The address uses `https://`.

## Roll back

Rebuild and republish the last known good commit (or revert the faulty commit on `main` and republish). Because the data format did not change, visitors' saved scenarios keep working with the previous version.

## When hosting is unavailable or a release is broken

- Participants run the prototype locally: `npm ci`, then `npm run dev`, and open http://127.0.0.1:3001. Alternatively use the participant package (`npm run package:participant -- /absolute/output`).
- Scenario data is not lost when hosting is down: it lives in each browser. Users can export it in settings and import it in a local copy.
- Problems are reported through GitHub Issues (bug form). The repository owner responds.
