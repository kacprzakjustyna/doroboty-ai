# Offer section deep link lands below the top after the font swap

## Intent and acceptance

Find and fix the root cause of the intermittent CI failure of the e2e journey
`offer section links survive copied URLs and restore section focus through history`
(`tests/e2e/prototype.spec.ts`). In the copied tab opened at
`/#/oferty/ai-product-manager#employer`, `#employer` ended at `y = 79.921875` (`scrollY = 1693`)
instead of `y ≈ 28` (`scrollY = 1745`) on CI runs 43406337351 (both attempts) and 43407433349
(first attempt). Locally it passed 30/30.

Acceptance: a cold deep link to an offer section leaves the focused section at its
`scroll-margin-top` once the page has settled, in CI-like font conditions; the test checks the
settled state without skipping, loosening or quarantining the `< 50` assertion; `./scripts/verify`
passes under Node 24.

## Root cause

The page uses bundled web fonts with `font-display: swap`. On a cold load the `JobPage` effect
runs in the first animation frame. At that point the fonts are often still loading, so
`scrollIntoView` measures the page with the **fallback** font. When Space Grotesk / IBM Plex Mono
swap in, the hero and "O roli" text above `#employer` reflow 52px taller. The document position of
the section moves from 1721 to 1772.92, but `scrollY` stays at 1693, so the section ends up 52px
lower (`28 + 52 ≈ 79.92`). Chrome's scroll anchoring does not compensate here.

Evidence from the CI `browser-report` artifact (run 43406337351, attempt 1 trace):

- Screencast of the copied tab at t=19660 ms: page at the top, rendered in an Arial-like fallback
  (Liberation Sans on ubuntu-latest).
- At t=19691 ms: scrolled, `#employer` at the top edge, still in the fallback font.
- At t=19712 ms: the bundled fonts have swapped in and `#employer` sits about 80px down. Every DOM
  snapshot records `scroll_top = 1693`.

Why it only showed up in CI: whether it happens depends on (a) the fallback font's metrics and
(b) whether the swap lands before or after the first frame. This sandbox's fontconfig resolves the
fallback stack to Inter, whose metrics give the same height above the section, so delaying fonts
locally changed nothing. That matches the earlier note that the section top was 1772.92
"regardless of fonts". Rejecting Inter in a private `FONTCONFIG_FILE` (so the stack falls back to
Liberation Sans as on ubuntu-latest) reproduces the exact CI numbers: `y = 79.921875`,
`scrollY = 1693`.

Ruled out: the other worker (contexts are isolated, and the failure reproduces with one context),
the Shell's `main.focus()` / `scrollTo(0, 0)` (it runs only when the pathname changes, and a cold
load has nothing to compare against), viewport/scrollbar (the trace shows 1280×720 and the final
layout matches local), and focus-induced scrolling (`preventScroll: true`; the drift is caused by
layout, not by scrolling).

## Change

- `src/features/prototype/marketplace.tsx` (`JobPage`): in the animation frame, force layout so
  every needed font face is requested, then wait for `document.fonts.ready`. Only after that,
  focus the section (`preventScroll`) and `scrollIntoView` it. Focus and scroll therefore happen
  once against final metrics. When fonts are already loaded (in-app links, history), `ready` is
  already resolved and the delay is one microtask. A cancelled effect (hash or route changed
  meanwhile) does nothing. `document.fonts` is optional-chained for non-browser environments.
- `tests/e2e/prototype.spec.ts`: the copied tab gets a 300 ms delay on `.woff2` responses, so it
  always goes through the cold-font path. Before measuring, the test also waits for
  `document.fonts.ready`, so it checks the settled page, not a pre-swap frame. The assertion is
  unchanged.
- `FEATURES.md` PUB-06: records that section focus/scroll applies once the bundled fonts have
  settled.

## Validation (Node 24.22.3, Playwright Chromium in this sandbox)

The CI-like fallback is a private `fonts.conf` that rejects Inter, kept outside the repository.

- Standalone repro (cold deep link, sample taken the moment `#employer` receives focus), 100 cold
  loads with the CI-like fallback:
  - Old code: wrong at focus time in 53/100; still wrong 300 ms later in 66/100.
  - First attempt (scroll, then re-align after `fonts.ready`): settled correctly 200/200, but
    wrong at focus time in 72/200. The `toBeFocused` → `boundingBox` window could still catch the
    pre-swap frame, about 1 in 100 e2e runs. This is why the final version focuses only after the
    fonts settle.
  - Final code: wrong at focus time in 0/200. With fonts delayed 400 ms and 1500 ms the section
    lands at `y = 27.921875`, `scrollY = 1745`.
- Updated e2e test with the CI-like fallback:
  - Old product code: 10/10 fail with `Received: 79.921875` (deterministic regression check).
  - Fixed code: 60/60 pass (`--repeat-each=60 --workers=2 --retries=0`).
- Updated e2e test with the default local fonts: 30/30 pass.
- `./scripts/verify`: passed. Formatting, the immutable 67-file kit check, lint, types, 27 unit
  tests, packet, build and 37 Chromium journeys; the existing chunk-size warning remains.

Not proven: a green GitHub Actions run. That has to be confirmed on CI after push.

## Review

Reviewed the final diff separately. The effect still runs after the Shell's route focus (rAF).
Keyboard focus on the section is preserved, and the cleanup cancels both the frame and the pending
font promise. No visual or style change, so the design-system rules are not affected. The test
keeps its `< 50` assertion and its history/focus steps.
