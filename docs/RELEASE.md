# Release guide (course exercise)

The prototype is published by Netlify (project `dynamic-kleicha-52254b`, https://dynamic-kleicha-52254b.netlify.app). Every push to `main` is built and published automatically; every pull request gets its own deploy preview. Publishing settings live in [netlify.toml](../netlify.toml). The readiness checklist ([production-readiness.html](production-readiness.html)) assesses this plan and the live site.

## What a release is

A release is the static `dist/` folder that Netlify builds from one commit on `main` (`npm run build`, Node.js from `.nvmrc`). The app has no server, database or secrets; all scenario data stays in each visitor's browser (localStorage). The saved data format is version 1, so publishing an older build does not touch anyone's data.

## Before merging to main

1. Open a pull request. CI runs the full gate (`./scripts/verify`) on Node.js 24; do not merge while it is red.
2. Open the pull request's Netlify deploy preview (link in the Netlify bot comment) and click through the smoke check below on a phone-sized window too: hosting can add things that never appear locally.

## After merging: automatic production check

The **Production check** workflow ([.github/workflows/production-check.yml](../.github/workflows/production-check.yml)) builds the merged commit and waits up to 10 minutes until the production site serves that build's hashed files (`assets/index-<hash>.js`), then checks the assets and security headers. If Netlify's deploy failed or got stuck, the workflow fails and GitHub emails the person who merged. On the Netlify Free plan this replaces the deploy-failure email, which needs a paid plan.

It only runs after a push to `main`; it does not monitor the site between releases.

To confirm the email actually arrives: GitHub → Actions → Production check → Run workflow, set the site address to a wrong one (for example `https://dynamic-kleicha-52254b.netlify.app/test-alert`), run it and wait about 10 minutes for the failure email. GitHub's own notification settings (Settings → Notifications → Actions) must keep failed-workflow emails on.

## Smoke check right after publishing

Open the published address in a private window and check:

1. The homepage loads with its fonts, the opening fact strip and company logos.
2. A deep link such as `#/oferty/ai-product-manager` opens directly and after a refresh.
3. Main journey: choose Anna → apply to an offer → switch to the employer → record a decision → refresh; data is still there.
4. Settings: export downloads `doroboty-scenariusz.json`; the "Zgłoś problem" link opens the GitHub bug form.
5. On a phone-width window, open Oferty → Filtry: nothing covers the "Pokaż N ofert" button.
6. The browser developer tools show no failed requests and no requests to other domains.
7. The address uses `https://`.

## Roll back

1. In Netlify open the project → Deploys and pick the last deploy that worked (each lists its commit).
2. Use "Publish deploy" on it. The site switches immediately; nothing is rebuilt.
3. Netlify can pause auto publishing after a manual publish. Fix or revert the faulty commit on `main`, then make sure auto publishing is on again, otherwise later merges will not go live.

Because the data format did not change, visitors' saved scenarios keep working with the previous build.

## When hosting is unavailable or a release is broken

- Participants run the prototype locally: `npm ci`, then `npm run dev`, and open http://127.0.0.1:3001. Alternatively use the participant package (`npm run package:participant -- /absolute/output`).
- Scenario data is not lost when hosting is down: it lives in each browser. Users can export it in settings and import it in a local copy.
- Problems are reported through GitHub Issues (bug form). The repository owner responds.
