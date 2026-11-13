# Scope card assistant (I2 prototype from supersprint week 2)

## Source of this task

Discovery decision approved 2026-10-30 (supersprint `tydzien-2`, stages 1-5 and 7), supplied by
Justyna as uploaded documents, not present in this repository. Outcome under test: companies that
bought in month M make a new paid purchase within 90 days, 30% -> 60%, with ~45% as the first
milestone. Selected opportunity O01: the recruiter cannot tell from an application what the
candidate did themselves. Selected idea I2 (r4). Experiment E2 stays a plan; this task builds only
the clickable prototype the decision asks for. Course deadline ~2026-11-23.

Decision type is explicitly "develop as a prototype and keep researching", not "roll out".

## Intent and acceptance

Add two prototype screens inside the existing React/hash-routed application, Polish UI.

**Design system (decided by Justyna, 2026-11-06):** the `doroboty-screens` skill is the
authoritative visual direction for this work and overrides the Poster People direction currently
required by `CLAUDE.md` and `AGENTS.md`. That means warm paper, Space Grotesk + IBM Plex Mono and a
single orange signal. Those two repository instruction files still mandate Poster People, so they
have to be updated in this change; otherwise any later session reverts the screens.

1. **Candidate side.** Before submitting, an assistant asks about a vague answer ("Co dokladnie
   zrobiles sam? Jaki byl efekt? Skad wiesz, ze zadzialalo?"), then composes a fixed-structure card
   _Moja czesc / Co robil zespol / Efekt / Jak to sprawdzono_ in the candidate's own words. The
   candidate reviews it and either approves or corrects it before it is attached to the
   application. The candidate can ask the assistant what a question means.
2. **Recruiter side.** The approved card appears at the top of the application record, with a line
   counting the concrete facts it contains ("3 konkrety: ...") or stating that there are none.

Acceptance:

- The card is only attached after explicit candidate approval; an unapproved card is never shown to
  the employer. "ja"/"my" wording stays as the candidate wrote it; the assistant never rewrites the
  candidate's sentences into its own.
- The assistant is deterministic and local: scripted prompts and rule-based extraction, no model,
  no backend, no external runtime request, no new dependency. The fact counter is an explicit
  heuristic and is labelled as a prototype signal, not a score.
- Declining the assistant must remain possible and must not block submitting an application.
- Preserve the existing apply flow: role gates, hash URLs, Zod schemas shared with the form, draft
  save/resume, legacy `sourceNotes`/`generatedAnswer` fields kept separate from the approved
  answer, answer/consent validation and focus, immutable submitted records.
- Store the card as its own new field rather than reusing the legacy generated-answer fields, so
  historical v1 saves and imports keep their current meaning. Existing exports must still import.
- Verify the prototype against the three raw answers from the discovery data (Kuba, Natalia, Ola)
  and record whether the card surfaces the Kuba/Natalia difference the recruiter missed. This is
  the decision's own success check for the first step.

## Out of scope

I4 (third-party confirmation of scope), I7 (lower-risk publication at payment), running E2, any
claim that the card changes repeat purchase. Discovery CSVs stay out of this repository unless
Justyna asks for them; the register of product behavior must not present the hypothesis as a
measured result.

## Open questions

- The three raw answers (`application_answer_raw` for Kuba, Natalia, Ola) are not in this
  repository and are required for the decision's verification step.
- The prototype personas are Anna Kowalska, Marek Nowak, Karolina Wisniewska and Tomasz Zielinski;
  the discovery personas are different people. Decide whether to map the discovery cases onto
  existing personas or add new synthetic ones.
- Stage 6 of the supersprint cycle was not supplied; stages jump from 5 (Experiments) to 7
  (Decision).

## Validation

Not yet run. To fill in with actual results: `./scripts/verify`, desktop/mobile widths, keyboard
and state checks, assistant-declined and card-corrected paths, draft persistence across reload,
legacy import, and a separate review pass. FEATURES.md must be updated in the same change for the
new candidate and employer behavior.
