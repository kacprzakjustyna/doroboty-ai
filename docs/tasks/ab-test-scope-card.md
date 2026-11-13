# A/B test design: scope card in the recruiter view (I2)

## Source of this task

Agreed with Justyna on 2026-11-13. The scope card for the recruiter is already implemented
(see [scope-card-recruiter-view.md](scope-card-recruiter-view.md) and
[discovery-case-applicants.md](discovery-case-applicants.md)). This task designs the randomized
test that would decide whether the card is worth keeping, as the course deliverable asks for:
hypothesis, variants A and B, random assignment, metrics, and how we would know the change helped.

The test is a plan for the real DoRoboty product. It cannot run on the AIPH3 prototype, which has
no traffic. On the course it stays a simulation, as experiment E2 does.

## What the discovery data shows

Read from `kacprzakjustyna/doroboty-ai-superbrain` (private, attached to the session only, not
copied into this repository), `discovery/data/applications.csv` and `purchases.csv`.

- 45 000 applications, 2025-11-07 - 2026-06-30, 34 weeks: **1 340 applications per week**,
  840 publications with applications (54 each on average), 477 screening recruiters.
- Screening funnel: 25 668 screened (57%), of which reject 11 427, **hold 7 641**, invite 6 600.
  Invite rate among screened 25.7%; per received application 14.7%; **hold per received
  application 17.0%**.
- 4 950 first interviews, 1 620 "continue" afterwards: 32.7% of interviews, **3.6% of received
  applications**.
- Decision timing from submission: screening median 2 days / p99 24; post-interview decision
  median 9 days / max 34.
- Writing assistant (used on 11 700 applications) raises the mean match score 68.4 -> 78.5 while
  invites fall 26.3% -> 24.1% and continuations 33.6% -> 30.1%. Observational, not randomized;
  it motivates the test rather than proving anything. This matches the S20 note in the
  discovery documents.
- Repeat purchase, under the definition adopted in `supersprint/tydzien-2/01-cel.md` (a company's
  new paid purchase within 90 days of its first purchase in month M, each company counted once,
  only cohorts with a complete 90-day window before the last purchase in the data, 2026-09-28):
  **45.0%** for January 2025 - May 2026 (988 of 2 196) and **30.0%** for June 2026 (54 of 180).
  Recomputed from `purchases.csv`, reproducing that document company for company, month by month
  (monthly rates 43.8-46.3% before the drop).
  The earlier 43.9% in this note was a different cut - per purchase across the whole period - so
  it is the long-run average, not a competing definition. **There is no conflict to resolve.**

## Design decisions and why

- **Primary metric: hold rate** (applications parked as "wstrzymane" within 25 days / all
  applications assigned). It is the closest observable trace of opportunity O01 - an application
  is held exactly when the recruiter cannot tell what the candidate did themselves. Chosen for
  that reason, not because it is the cheapest to measure.
- **Denominator is all assigned applications**, not screened ones, so the card cannot improve the
  metric by slowing the recruiter down.
- **Repeat purchase was rejected as the primary metric**: against the 30.0% baseline and 180
  companies per monthly cohort, a realistic five-point contribution (30% -> 35%) needs about 15
  months of recruitment plus the 90-day window. The hold rate is a proxy and the card says so.
- **Card content comes from the candidate's existing answer** (decided 2026-11-13), extracted by
  rule, with empty fields left empty. Nothing changes on the candidate side and the candidate-side
  assistant is not built for this test, so what the test measures is "a card built from what
  candidates already write", not "a perfectly filled card".
- **Randomization unit: the application**, assigned at submission, 50/50. Recruiter-level
  assignment would remove contamination but costs about 7 weeks of recruitment at an
  intra-recruiter correlation of 0.02 and 14 weeks at 0.05, and above roughly 0.08 it is
  unreachable at any duration, because a cluster design's power comes from the number of clusters
  and there are only 477 recruiters. Waiting longer adds applications to existing recruiters, not
  recruiters. That correlation has not been measured yet and can be computed from the data.
- **The recruiter-level alternative stays in the write-up** rather than being dropped (decided
  2026-11-13). It costs nothing in a simulated test, it answers the most likely reviewer question
  ("how do you know the recruiter did not learn?"), and the ceiling result above is the clearest
  teaching point in the whole design.
- **Known contamination**: a recruiter sees both variants and learns to look for specifics in A as
  well, which biases the measured difference toward zero. A positive result is therefore
  trustworthy; a null result is ambiguous. Recorded as a blocker on the card.

## Sizing (alpha 0.05 two-sided, power 0.80, two proportions)

Baseline 17.0%, target 14.4% (-15% relative, the smallest change worth acting on):
**3 203 applications required per arm**, 3 350 available in 35 days of recruitment at 1 340/week,
power 0.82. Readout 70 days (35 days recruitment + the longest guardrail window of 35 days).
Minimum detectable change at that traffic and duration: 2.49 pp.

Guardrails, both detection-only (a statistically significant deterioration holds the rollout):
continuation after the first interview (3.6% today, 35-day window) and invite rate (14.7% today,
25-day window).

## Deliverable

- `experiments/karta-zakresu/card.json` - the plan.
- `experiments/karta-zakresu/ab-test-card.html` - standalone offline card with the calculator.
- `experiments/karta-zakresu/ab-test-card-v1.html` and `-v2.html` - earlier renders, kept. v1's
  recommendation said 60 days instead of the correct 70; v2 still carried the resolved
  repeat-purchase question and the pre-decision description of the card's content.
- A Polish narrative write-up of the five parts for a reader outside the project, as a Claude doc:
  https://claude.ai/artifact/CAYC2uGhpCV6CPoT6GmRNw - context and diagnosis, the five parts, what
  the test cannot settle, the rejected recruiter-level alternative and the sources of every figure.
- `.prettierignore` now excludes `experiments/**/*.html`, because the rendered cards are generated
  artifacts, as `docs/production-readiness.html` already is.

## Validation (2026-11-13)

- The skill's own calculator test suite: 11 tests, passed.
- Renderer summary through Node 24: required 3 203 per arm, available 3 350, power 0.8174,
  recruitment 35 days, readout 70 days, MDE 0.0249.
- Browser checks (Chromium, local file): 1440 and 390 px with no horizontal overflow, no JavaScript
  errors, calculator responds to a changed effect, "Wróć do planu" restores the saved plan, and the
  results panel with example counts (A 569/3 350, B 452/3 350) reports p < 0.0001 and a 95%
  interval of -5.21 to -1.77 pp.
- `npx prettier --check .` passes on the whole repository.
- NOT RUN: the full `./scripts/verify` gate. No source, fixture or UI file changed, so unit tests,
  types, build and browser journeys are unaffected by this change.
- FEATURES.md reviewed: this task adds no product behavior to the prototype, so the register needed
  no update.

## Open questions

- How much recruiters differ from each other in hold rate (the intra-recruiter correlation). It
  does not change this plan, but it decides whether the recruiter-level alternative could ever
  work. Computable from `applications.csv`.
- How many of the four card fields can actually be filled from current answers. Check on a sample
  before a real test: a card that is mostly empty measures something else.

Resolved on 2026-11-13: the repeat-purchase definition (no conflict; `01-cel.md` is canonical),
the source of the card's content (existing answers, no candidate-side assistant), and keeping the
recruiter-level alternative in the write-up.
