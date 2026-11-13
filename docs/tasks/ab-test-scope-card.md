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
- Repeat purchase within 90 days: 1 042 of 2 376 purchases with a complete window = **43.9%**.
  The discovery documents state 30% for the same idea; the definitions differ and must be
  reconciled before anyone links a test result to the 30% -> 60% goal.

## Design decisions and why

- **Primary metric: hold rate** (applications parked as "wstrzymane" within 25 days / all
  applications assigned). It is the closest observable trace of opportunity O01 - an application
  is held exactly when the recruiter cannot tell what the candidate did themselves. Chosen for
  that reason, not because it is the cheapest to measure.
- **Denominator is all assigned applications**, not screened ones, so the card cannot improve the
  metric by slowing the recruiter down.
- **Repeat purchase was rejected as the primary metric**: at 33 purchases per week, detecting
  43.9% -> 50% needs roughly 15 months of recruitment plus a 90-day window. The hold rate is a
  proxy and the card says so.
- **Randomization unit: the application**, assigned at submission, 50/50. Recruiter-level
  assignment would remove contamination but needs 3-6x the sample and cluster-adjusted
  calculations; the bundled calculator does not support that design.
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
- `experiments/karta-zakresu/ab-test-card-v1.html` - earlier render, kept; its recommendation text
  said 60 days instead of the correct 70.
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

- Which definition of repeat purchase is canonical, 43.9% (per purchase, 90-day window, from the
  data) or the 30% in the discovery documents.
- The candidate-side card does not exist. A real test needs the card to be filled from the
  candidate's own words, so either the assistant is built first or the content is extracted from
  the existing free-text answer.
- Whether the course write-up should also show the recruiter-level (cluster) variant as the
  contamination-free alternative, with its larger sample requirement.
