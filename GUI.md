# GUI — DoRoboty.ai

The required visual direction for new and changed screens is the **DoRoboty design system**: warm
paper, Space Grotesk + IBM Plex Mono, one orange signal. The full specification is
[docs/design-system/DOROBOTY.md](docs/design-system/DOROBOTY.md). Read it before UI work.

## In one minute

- **Surfaces.** Paper `#f2efe9` for the page, fields and flat chrome; paper 2 `#e8e4db` for cards
  and panels. No white, no blurred shadow — depth is a paper tone plus a 1px `#d6d1c6` line.
- **Type.** Space Grotesk for headings, body and controls (700 for headings, tight tracking).
  IBM Plex Mono for every fact: labels, prices, units, dates, locations, counters, score, status.
  Product page title ~32px, section 20px, body 17px/1.6.
- **Orange.** `#ff4a1c` is a background or shape, never letters. Orange letters on paper are
  `#c2350f`; a label on orange is ink `#121417`. At most one signal action per view. Errors use
  `#b42318`, never the signal.
- **Shape.** 6px for buttons and fields, 14px for cards, 999px for choices and tags.
- **Lists** are rows divided by a 1px line, not a grid of cards.
- **Motion** is control-state transitions only, 120–200ms, and honours `prefers-reduced-motion`.

## Implement in this app

- Tokens: [tokens.css](tokens.css). Shared recipes: [src/app/doroboty.css](src/app/doroboty.css).
  Marketplace geometry: `src/app/marketplace*.css`, aliased to the same tokens. No raw hex in `src/`.
- Fonts are bundled locally in [src/app/fonts](src/app/fonts) (Latin + Latin Extended, so Polish
  diacritics render offline). Never reference a remote font endpoint.
- Keep React/TypeScript/Vite, hash routes, Base UI's `render` composition, Zod validation, persona
  data and localStorage flows as they are; change the visual layer, not the product contract.
- The match score carries no color and always travels with its method-limit note. Demo data says it
  is demo.
- Check 1440 and 390, long content, keyboard focus and error states. Run `./scripts/verify` and
  update [FEATURES.md](FEATURES.md) for real behavior changes.

## Previous direction

Poster People is archived, not active. `docs/design-system/agent-kit` stays immutable
(`npm run design-system:check`, port 8952 for `npm run design-system:dev`) as the record of that
work, and the other files in `docs/design-system/` still document host component contracts and
acceptance scenarios. Do not take color, type or shape decisions from them.
