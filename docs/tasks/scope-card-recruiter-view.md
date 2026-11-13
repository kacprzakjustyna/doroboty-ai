# Scope card in the recruiter view (I2 prototype)

## Intent

Second step of the I2 prototype, agreed with Justyna on 2026-11-07. Builds on
[discovery-case-applicants.md](discovery-case-applicants.md); acceptance background in
[candidate-scope-card-assistant.md](candidate-scope-card-assistant.md).

The recruiter opens an application and, before the assistant-polished answer, sees a card with four
fixed fields — Moja część / Co robił zespół / Efekt / Jak to sprawdzono — in the candidate's own
words. The candidate-side assistant is not built; the cards are a labelled simulation.

## Content rule

Each field holds only the candidate's own words: their raw application answer, `candidate_profile_raw`
/ `portfolio_raw` from the discovery data, or their research interview (C1 Kuba, C4 Natalia, C2 Ola).
A field the candidate never addressed stays empty and shows "Kandydat tego nie podał." Nothing is
added to make a candidate look better.

## Acceptance

- The card appears at the top of the Answer tab for applications that carry one; other applications
  are unchanged. The list row shows a mono "Karta zakresu · Wypełnione pola: N/4" line.
- The counter counts filled fields only and the card says so, together with the simulation note.
- `scopeCard` is a new optional field, so version-1 saves and exports still load. A save made before
  the card existed gains it for the three cases on load; nothing else in it changes.
- No color on the card or counter; mono for labels and the count; 1px dividers; no overflow at 390px.

## What the cards show (for the course write-up)

- Kuba vs Natalia: after the assistant both answers sound alike (82 vs 83). On the cards the
  difference is immediate — Kuba built the indexing and evaluation the ad asks for; Natalia built the
  demo, presentation and part of the prompts.
- Ola: the card restores the result the assistant dropped ("skrócił się czas…") and her evidence.
  Her team field does not separate her part from the team's.
- Limits: "Efekt" is empty for both Kuba and Natalia. The counter is 3/4 for both, so the **count
  does not distinguish them — only the content does**. The cards are built from long interviews and
  read better than a short assistant exchange would. We know the real outcomes, so a fair check is to
  show the cards to someone who does not and ask whom they would invite.

## Validation (2026-11-07)

`./scripts/verify` passed: 30 unit tests (new: card added to an older save), 35 browser tests (the
recruiter test now checks the card fields, empty-field text, counter, note, absence on Marek's
application and the list signal). Manual screenshots at 1280 and 390: no horizontal overflow.
FEATURES.md EMP-07 and EMP-08 updated.
