# Roll the DoRoboty design system out across the application

## Intent

The project owner changed the visual direction: the DoRoboty design system (warm paper, Space
Grotesk + IBM Plex Mono, one orange signal), packaged in the `doroboty-screens` skill and measured
from the DoRoboty.ai landing, replaces Poster People. The request was explicit that this applies
everywhere, not to a single screen, and that it had been asked for before — so the authority
documents are part of the change, otherwise the repository keeps steering work back to the old
direction.

## Scope

1. Host token layer and shared recipes carry the measured values; no raw hex anywhere in `src/`.
2. Every screen reached from the hash routes — home, listing, offer, company, methodology, person
   picker, candidate workspace, employer workspace, application flow, records — follows the new
   surfaces, type, shape, data role and motion rules.
3. Content rules that the design system treats as binding are implemented, not just documented.
4. CLAUDE.md, AGENTS.md, GUI.md and docs/design-system/README.md name the new direction as required
   and demote Poster People to a historical record, with the immutable kit left untouched.

## Acceptance criteria

- Fonts: Space Grotesk 400/500/700 and IBM Plex Mono 400/500 bundled locally with Latin and Latin
  Extended subsets; no remote font request; Polish diacritics render from the bundled files.
- Palette: paper `#f2efe9`, paper 2 `#e8e4db`, ink `#121417`, ink 2 `#3a3f44`, muted `#6e6a61`,
  line `#d6d1c6`, signal `#ff4a1c`, signal-on-light `#c2350f`, wash `#fbe1d5`, danger `#b42318`.
- Bright orange never appears as letters; at most one signal action is visible per view.
- Radii 6 / 14 / 999px; every divider and edge is a 1px line; no blurred shadow in the product.
- All data — salary, dates, locations, counters, score, status, field labels — is IBM Plex Mono.
- Lists render as rows divided by a line, not as a grid of cards.
- The match score shows `NN/100` in ink with no band, bar or color, and the method-limit note is
  visible wherever a score is.
- No horizontal overflow at 390px; keyboard focus is a 2px `#c2350f` ring at 2px offset.
- `./scripts/verify` passes, including axe checks in the browser journeys.

## Decisions taken during the work

- **Muted text on raised surfaces.** `#6e6a61` reaches 4.6 : 1 on paper but only 4.2 : 1 on
  paper 2, which axe correctly flags. Raised surfaces therefore step the muted role up to ink 2
  (9.4 : 1) instead of inventing a new color. Rule lives in `src/app/doroboty.css`.
- **People illustration removed.** `people.png` belongs to Poster People and brings pink and yellow
  into a palette that allows one accent. The home opening now carries a three-cell mono fact strip
  built from real scenario counts; the listing and employer sections lost the decorative image.
  A replacement illustration in the new direction is an open question for the owner.
- **Confetti removed.** The design system limits motion to control-state transitions and has no
  success color, so the submission burst was deleted (component, CSS and state). Submission is
  confirmed by the existing notice; the "submit only once" journey still covers the behavior.
- **Brand wordmark.** The robot mark in a pink square was replaced by the wordmark the design
  system specifies: "DoRoboty" in Space Grotesk 700 plus ".ai" in IBM Plex Mono 500 in
  signal-on-light.
- **Score wording.** "Match Score: 84%" became `84/100` with a screen-reader prefix in Polish,
  matching both the design system and the project's Polish-UI standard.
- **Spacing and motion tokens** moved to the system's scale (4/8/12/16/24/32/56, 120–200ms linear),
  replacing the Poster People spring curves.

## Evidence

Browser journeys: 34 passed (`npx playwright test`), including the rewritten design-system
assertions and axe checks on public and workspace screens. Screens inspected at 1440 and 390:
home, listing, offer, person picker, candidate applications, employer candidates, employer offers,
organization, profile, saved. Audit per screen: no horizontal overflow, one signal button in the
first view, no orange letters on light, only Space Grotesk and IBM Plex Mono in use, no blurred
shadow, no element left invisible.
