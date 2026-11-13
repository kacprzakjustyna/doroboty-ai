# Link the prototype folder to the Netlify project

## Intent

Connect the working copy to the existing Netlify project so deploy state can be
inspected from this repository, and establish what the application actually
requires before its URL is shared with course participants.

## Acceptance criteria

- The working copy is linked to the Netlify project and `netlify status`
  resolves the project id.
- `.netlify/` is ignored by Git (linking writes `.netlify/state.json`, which
  must never be committed).
- Build settings reported by Netlify match what the repository actually builds.
- Publication blockers are identified from the live site, not from API status
  alone.

## What was done

- Linked the working copy with `netlify link --id 16fa0d3f-35b5-4183-b954-fa76dbf13d2e`.
  The CLI wrote `.netlify/state.json` and appended `.netlify` to `.gitignore`.
- Verified the deployed site over HTTPS.

## Evidence

- `npm ci` exit 0; `npm run build` (`tsc --noEmit && vite build`) exit 0,
  2347 modules, output `dist/` (16 MB) in 3.5 s.
- Netlify project `dynamic-kleicha-52254b`, team `DoRobotyAI` (Free plan),
  production branch `main`, build command `npm run build`, publish directory
  `dist`, build image `noble`.
- Latest production deploy `ready`, 2026-11-13T07:46:12Z, no error message.
- `origin/main` and the working branch are both at `81682a8`; `git log
origin/main..HEAD` is empty, so the published build matches current source.
- Live site returns HTTP 401 with a `Login Redirect` page to
  `app.netlify.com/edge-access` on `/`, `/case/baseline.csv`,
  `/cv/anna-kowalska-cv-v1.pdf` and an unknown path.
- Site record reports `sso_login: true`, `sso_login_context: "all"`,
  `has_password: false`; the team reports `site_sso_login: true`. The project is
  therefore behind team-login protection (private visibility) for all deploys.

## Findings that require a decision

1. **The published URL is not reachable by participants.** Teams created on or
   after 2026-07-28 default to private projects. On the Free plan the only
   alternatives are Public or Private; shared-password visibility is Pro only.
   Making the project public requires a successful production deploy, which
   exists. Project visibility has no public API, CLI or MCP surface and must be
   changed in the Netlify dashboard.
2. **Public visibility removes every boundary between roles.** BRIEF.md already
   states that a static build provides no confidentiality between roles and that
   role selection is a simulation. Published assets include
   `public/case/baseline.csv`, two synthetic persona CV PDFs and 26 demo logos.

## Not changed

- No `netlify.toml` was added. Build command and publish directory currently
  live only in the Netlify UI; moving them into the repository would make the
  configuration reproducible but is a separate decision.
- No redirect rule was added. The application uses `HashRouter` with Vite
  `base: "./"`, so every route is served from `/`; a `/* /index.html 200`
  fallback would only guard against direct hits on unknown paths.

## Product behavior register

FEATURES.md was reviewed and needs no update: linking the working copy to a
hosting provider changes no application behavior, route, role boundary or
stored data.
