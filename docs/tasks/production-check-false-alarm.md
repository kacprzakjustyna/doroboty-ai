# Production check is red on every push to main

## Intent

`Production check` (`.github/workflows/production-check.yml`) has failed on every push to `main`
since PR #10 added PostHog, while the deployed site is healthy. A check that is always red teaches
everyone to ignore it, which is worse than having no check, so it has to either be made accurate
again or be narrowed to what it can actually prove.

## Diagnosis (confirmed in this session, Node 24.22.1)

`scripts/check-production.mjs` built the commit in CI and required the live page to name exactly the
hashed entry files that build produced. Vite hashes by content, so that comparison only holds while
the CI build is byte-identical to Netlify's. It is not: `VITE_PUBLIC_POSTHOG_KEY` is a build variable
in the Netlify project only (see `connect-posthog-analytics.md`), and Vite inlines its value into the
entry chunk.

Reproduced here, not taken from the earlier report:

- `npm run build` with no key: `assets/index-BeYB5eFB.js`.
- `npm run build` with the key read out of the published bundle:
  `assets/index-cZbaOk1F.js` — byte-for-byte the name the live site serves.
- The CSS (`index-BNodhuhD.css`) and the SVG icon are identical in all three cases, because no
  environment value reaches them. Only the JS entry differs.

So the failure is entirely the missing build variable in CI, and the live site is fine.

## Decision: narrow the check (option 2 of the brief)

Option 1 — add `VITE_PUBLIC_POSTHOG_KEY` as a GitHub Actions secret and pass it to the build step —
keeps the original guarantee and is preferred. It is not available to this agent: the GitHub Actions
secrets API is refused through the session proxy
(`GET repos/.../actions/secrets/public-key` → HTTP 403, "Access to this GitHub Actions path is not
permitted through this proxy") and no tool in this session can write repository secrets. Only the
repository owner can add it.

The brief says not to work around that, so the key is **not** written into the workflow in plain
text, even though the value is public by design (it ships in the bundle and the browser sends it on
every request).

Option 2 is therefore implemented: the check verifies site health instead of build identity.

## Acceptance criteria

- A push to `main` leaves `Production check` green while the site is healthy.
- The workflow still fails when the live site is not serving the application correctly: it does not
  answer, its page names no hashed assets, an asset it names does not resolve, or the HSTS or
  nosniff header is missing. Demonstrated through the existing `workflow_dispatch` site address
  input.
- `scripts/check-production.mjs` states in its own comment what the check no longer proves, so the
  next reader does not mistake a green run for "the newest commit is live".
- `FEATURES.md` SYS-13 and `docs/RELEASE.md` describe the narrowed guarantee.
- `./scripts/verify` passes on Node 24.

## What changed

- `scripts/check-production.mjs` takes only a site address. It no longer reads `dist/index.html`,
  so it no longer needs a local build at all. One attempt now fetches the page, collects the hashed
  `assets/...` names the **live** page itself declares, requires at least one of them, fetches each
  one, and requires `strict-transport-security` and `x-content-type-options` on the page response.
  Per-request timeouts and whole-attempt retries are kept from the previous fix, so a reset or hung
  connection is still a retry rather than a crash.
- The retry deadline default dropped from 600s to 120s (`CHECK_TIMEOUT_SECONDS` still overrides).
  Ten minutes existed to wait for a Netlify deploy to land; nothing in the narrowed check waits for
  a deploy, so the remaining retries only absorb transient network failures and a genuinely broken
  site now goes red in about two minutes instead of ten.
- The workflow dropped `npm ci` and `npm run build`, which only existed to produce the hashes to
  compare against; `npm run check` in CI already proves the commit builds. The job keeps checkout
  and Node 24 from `.nvmrc` because the script runs under node, and its ceiling went from 20 to 10
  minutes.
- `FEATURES.md` SYS-13 and `docs/RELEASE.md` rewritten for the narrowed guarantee, including the
  explicit note that a failed or stuck deploy which leaves the previous build serving correctly now
  passes.

## Results

- Reproduction of the diagnosis: both builds above, plus `curl` of the live page
  (`src="./assets/index-cZbaOk1F.js"`, `strict-transport-security` and `x-content-type-options`
  present on the response).
- `node scripts/check-production.mjs https://dynamic-kleicha-52254b.netlify.app` → exit 0,
  "Production is healthy", naming the three assets the live page declares. The same command on the
  previous script exits 1 with "not published yet", which is the false alarm being fixed.
- `node scripts/check-production.mjs https://dynamic-kleicha-52254b.netlify.app/test-alert` with a
  5s deadline → exit 1 (HTTP 404), the failure path `docs/RELEASE.md` tells the owner to use with
  the `workflow_dispatch` input.
- Local stand-in server, each case with a 5s deadline: healthy page → exit 0; page naming an asset
  that 404s → exit 1 naming that asset; page served without the two headers → exit 1 naming both;
  page with no hashed assets → exit 1; page that resets the connection twice and then answers →
  exit 0 after retries.
- No argument → exit 2 with usage.
- `./scripts/verify` on Node 24.22.1: pass — formatting, archived-kit integrity, lint, types, 30
  unit tests, participant packet, production build (the pre-existing >500 kB chunk warning stays)
  and 39 Chromium journeys.

### The workflow itself, run on this branch through `workflow_dispatch`

- Run [43484839974](https://github.com/kacprzakjustyna/doroboty-ai/actions/runs/43484839974)
  against the real site: **success** in 12 seconds of run time, logging "Production is healthy …
  serves assets/icon-DQw2TG_i.svg, assets/index-cZbaOk1F.js, assets/index-BNodhuhD.css". The same
  commit's state of `main` failed this workflow twice in a row before the change
  ([43481085848](https://github.com/kacprzakjustyna/doroboty-ai/actions/runs/43481085848),
  [43469402510](https://github.com/kacprzakjustyna/doroboty-ai/actions/runs/43469402510)), which is
  the false alarm.
- Run [43484932995](https://github.com/kacprzakjustyna/doroboty-ai/actions/runs/43484932995) with
  the site address set to `…/test-alert`: **failure** after six 404 retries, about two minutes,
  ending "Production check failed within 120s". This is the deliberate failure the owner uses to
  confirm the alert email still arrives, so that run sent one.
- Not proven from here: the `push` trigger on `main`, which only runs once this branch is merged.

## Limits of this fix

The workflow can no longer tell a successful deploy from a stuck one, because both leave a healthy
site. Two ways out, neither taken here:

- The preferred one, from the brief: the owner adds `VITE_PUBLIC_POSTHOG_KEY` as an Actions secret,
  the workflow builds again with it in `env`, and `scripts/check-production.mjs` goes back to
  comparing hashes. That reverts this commit's script and workflow.
- Without any secret: have the Netlify build write its `COMMIT_REF` into the published output and
  have the check compare that value with `GITHUB_SHA`. That restores the freshness guarantee and
  survives any future build variable, but it changes the build output and was outside the scope
  given, so it is only noted.
