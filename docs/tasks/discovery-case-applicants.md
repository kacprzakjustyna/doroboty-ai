# Discovery-case applicants for the I2 recruiter prototype

## Intent

First step of the I2 prototype (see [candidate-scope-card-assistant.md](candidate-scope-card-assistant.md)
and [handover-2026-11-06.md](handover-2026-11-06.md)). Decided with Justyna on 2026-11-07:

- The prototype is built for the **recruiter** first; the candidate-side assistant may follow later.
- The recruiter list needs the real discovery cases so the scope card can later be checked against
  them: Kuba (`app-000001`, continued after interview), Natalia (`app-000004`, rejected) and Ola
  (`app-000002`, the Splot application, rejected as "inny zakres"; the assistant removed her result).
  Ola's second application (`app-000005`) is deliberately not used, to keep one case per person.
- Cards will later be filled with the candidate's own application text plus their own words from the
  interviews, labelled as a simulation. Nothing is invented to improve a candidate.

Source: `kacprzakjustyna/doroboty-ai-superbrain` (private), `discovery/data/applications.csv`,
`publications.csv` and `discovery/wywiady/`. The CSVs stay out of this repository.

## Acceptance

- Karolina Wiśniewska (BrightLabs) sees Kuba, Natalia and Ola next to Marek Nowak in
  `/#/app/kandydaci`, at stage "submitted" (the moment of the screening decision).
- Each answer is `application_answer_final` verbatim — what the recruiter actually saw — and each
  score is the data's `match_score` (82, 83, 83). The CV text is `candidate_profile_raw` plus
  `portfolio_raw`, with a one-line synthetic header.
- Kuba and Natalia apply to a new BrightLabs ad "AI Engineer — wyszukiwarka dokumentów", adapted
  from `pub-000001`; Ola applies to the existing "AI Operations Specialist", which matches `pub-000002`.
- They are applicants only, not selectable personas. Another company does not see them.
- Existing saves, imports and the integrity check keep working.

## Known limits

- The data writes Ola's raw and final answers with masculine verb forms ("Wdrażałem"); kept verbatim.
- Summaries are short neutral paraphrases of the final answer; the data has no platform summary.
- Real outcomes (invite, interview, decision) are not shown in the UI; they are the benchmark for
  the later card check.
- A scenario saved before this change gets the ad and the cases added on load (`withDiscoveryCases`,
  additive only; skipped on conflict). Imported files are taken as they are.

## Validation (2026-11-07)

`./scripts/verify` passed: format, design-system check, lint, types, 28 unit tests, packet check,
build, 35 browser tests (new: recruiter list and company scoping of the cases). After adding the
load-time upgrade: 29 unit tests (new: an older save gains the cases and keeps user edits), 35
browser tests, all passing. Two existing
assertions changed because the marketplace now has seven jobs (three in "build"). FEATURES.md
EMP-07 and SYS-07 updated.
