# DoRoboty design system — required visual direction

This is the accepted visual direction for every new and changed screen in this application. It
replaces Poster People, which is now a historical reference only (see
[Status of the previous direction](#status-of-the-previous-direction)).

Source: the measured DoRoboty.ai landing (`DESIGN.md` of the `landing-doroboty` project) and the
`doroboty-screens` skill that packages it. The values below are the ported copy that this repository
implements; the host token layer is [tokens.css](../../tokens.css) and the shared recipes are
[src/app/doroboty.css](../../src/app/doroboty.css). Where this document and the running code
disagree, this document wins and the code is the defect.

## Character

Warm paper, ink, and one orange signal. Typography carries the hierarchy: large tight headings,
short paragraphs, and mono labels above sections. Depth comes from paper tones and 1px lines —
there are no blurred shadows anywhere. Color appears in points, not areas.

## Tokens

| Role            | Value     | Host token                      | Use                                          |
| --------------- | --------- | ------------------------------- | -------------------------------------------- |
| Paper           | `#f2efe9` | `--gui-paper`, `--gui-canvas`   | page, flat chrome, fields, dialogs           |
| Paper 2         | `#e8e4db` | `--gui-surface-raised`          | cards, panels, quiet hovers                  |
| Ink             | `#121417` | `--gui-ink`, `--gui-text`       | text, emphasis contours, labels on orange    |
| Ink 2           | `#3a3f44` | `--gui-ink-2`                   | lead and descriptions, muted text on paper 2 |
| Muted           | `#6e6a61` | `--gui-text-muted`              | mono labels and captions **on paper only**   |
| Line            | `#d6d1c6` | `--gui-line`, `--gui-edge`      | every 1px divider, field and card edge       |
| Signal          | `#ff4a1c` | `--gui-color-1`, `--gui-accent` | **backgrounds and shapes only**              |
| Signal on light | `#c2350f` | `--gui-accent-text-on-light`    | orange letters on paper; focus ring          |
| Signal ink      | `#121417` | `--gui-accent-text`             | label on an orange surface                   |
| Signal wash     | `#fbe1d5` | `--gui-signal-wash`             | background of a highlighted choice           |
| Danger          | `#b42318` | `--gui-error`                   | validation errors only                       |

Contrast, computed from these values: ink on signal 5.5 : 1 · signal-on-light on paper 4.8 : 1 ·
plain signal on paper **2.9 : 1**, which is why bright orange is never used for text. Muted on paper
is 4.6 : 1 but only 4.2 : 1 on paper 2, so every raised surface steps muted up to ink 2; that rule
lives in `doroboty.css` and axe enforces it in the browser journeys.

Radii: **6px** buttons and fields, **14px** cards, **999px** choices and tags. Shape states intent —
a capsule means "choose", a 6px rectangle means "do".

## The five roles of orange

1. Signal action — **at most one per view**.
2. Accent in a heading (as letters, therefore `--gui-accent-text-on-light`).
3. Marking the default choice.
4. Marking a change or something new.
5. Focus.

Orange never marks errors, never colors the match score, never singles out one category, and never
colors numbers or step indices on light surfaces — those are facts, so they are ink.

## Typography

Space Grotesk 400/500/700 for headings, body and controls. IBM Plex Mono 400/500 for everything that
is data: labels, prices, units, dates, locations, counters, score, status. Both are bundled locally
as WOFF2 in [src/app/fonts](../../src/app/fonts) with Latin and Latin Extended subsets, so Polish
diacritics render from the bundled files and the product makes no remote font request.

Product screens are quieter than the landing: page title ~32px, section 20px, body 17px/1.6. The
landing-style home and listing openings keep the large display size through
`clamp(2.3rem, 1.3rem + 4.4vw, 4.75rem)`.

## Layout and components

- Lists are **rows divided by a 1px line**, not a grid of cards (`.pp-job-card`, `.prototype-rows`).
- Detail pages put the reading column on the left and a definition list plus one action on the
  right; on mobile the facts come before the long description.
- Three equal items become columns with a top line.
- Content column max 1080px, gutter 22 → 40 → 56px; long text stays near 62 characters a line.
- Dark `--panel` sections belong to marketing and are not used in the product.
- Motion is control-state transitions only, 120–200ms, and respects `prefers-reduced-motion`. No
  animated numbers, no decorative bursts, no spinners with color.

## Content rules that bind the UI

- The **match score** orders reading; it does not predict who will do the job well. Show it as a mono
  number `NN/100` in ink, with no bar, band or color, and keep the method-limit note (`ScoreLimitNote`)
  visible wherever a score appears. Never write "best candidate", "guaranteed right choice" or
  "AI will choose for you".
- Prices, companies, people and dates in examples are demo data and are labelled as such.
- No invented testimonials, client logos or revenue claims.
- Tone: technical, direct, short sentences, numbers with units. No neon "AI look": no purple, glow,
  gradients or sparkle icons.

## Verification for a changed screen

Check at 1440 and 390: no horizontal overflow, at most one signal button in the first view, no
`#ff4a1c` letters on a light surface, every fact in IBM Plex Mono, no blurred shadow, no raw hex
outside the token layer, visible keyboard focus, and the score note present wherever a score is.
`npm run check` (or `./scripts/verify`) runs format, lint, types, unit tests, the static build and
the browser journeys, including the design-system assertions in `tests/e2e/prototype.spec.ts`.

## Status of the previous direction

`docs/design-system/agent-kit` (Poster People 1.0.0) stays in the repository, unchanged and
verifiable with `npm run design-system:check`, as the record of the earlier direction. It is **not**
the target for new work, and its pink/Geist Serif values must not be reintroduced.
[README.md](README.md), [IMPLEMENTATION.md](IMPLEMENTATION.md), [HOST-COMPONENTS.md](HOST-COMPONENTS.md),
[RECORDS.md](RECORDS.md), [VERIFICATION.md](VERIFICATION.md) and [STATUS.md](STATUS.md) describe that
earlier integration; read them for component contracts and host ownership, not for color, type or
shape decisions.
