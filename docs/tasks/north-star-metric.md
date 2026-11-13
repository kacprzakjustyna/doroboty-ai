# North Star metric for DoRoboty.ai

## Source of this task

Worked through with Justyna on 2026-11-13 using the Amplitude North Star Framework
(North Star Playbook). Inputs: `BRIEF.md`, `docs/case/CASE_PROTOCOL.md`, the supersprint
`tydzien-2` decision and the discovery figures recorded in
[ab-test-scope-card.md](ab-test-scope-card.md), plus the I2 prototype notes
([scope-card-recruiter-view.md](scope-card-recruiter-view.md),
[discovery-case-applicants.md](discovery-case-applicants.md),
[handover-2026-11-06.md](handover-2026-11-06.md)).

This note records a measurement proposal. It changes no product behavior and asserts no measured
result. All figures come from `kacprzakjustyna/doroboty-ai-superbrain` (private):
`discovery/data/applications.csv` and `purchases.csv`, 45 000 applications over 34 weeks
(2025-11-07 - 2026-06-30). The CSVs stay out of this repository.

## Game: transaction

DoRoboty.ai is a two-sided marketplace and value appears when a candidate and a company are
matched, so the transaction archetype fits ("nights booked", not "time spent").

- **Not attention.** Neither side wants to spend more time here. A recruiter has ~54 applications
  per publication and a 2-day median screening decision; rising time in product would mean the
  recruiter is stuck. Under an attention game, the 17.0% hold rate would read as engagement.
- **Not productivity.** The screening decision is a task, so productivity is tempting, but the
  product sells access to the other side of the market, not screening throughput. A productivity
  metric would measure the recruiter alone and drop the candidate out of the North Star. The
  productivity character of the bottleneck belongs in the inputs instead (efficiency).
- **The counted transaction is the match, not the ad purchase.** The purchase is the business
  output and a lagging indicator: companies pay before they receive value, and repeat purchase is
  a consequence of the first ad working.
- **Consequence:** the completed transaction is rare and partly unobservable. Hires do not exist
  in the data; the furthest observable point is employer continuation after the first conversation
  (`CASE_PROTOCOL.md`), 1 620 over 34 weeks against 1 340 applications per week. The North Star
  therefore has to be a milestone on the way to the transaction, not the closed transaction.

## North Star: "Trafne rozmowy"

**Weekly number of first conversations after which the employer decided to continue with that
candidate.**

|                  |                                                                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Unit             | pair (candidate x publication), counted once                                                                                               |
| Condition        | the pair has a recorded "first interview" stage **and** a "continue" decision within **35 days** of that interview                         |
| Time attribution | ISO week in which the **interview took place**, not the week of the decision                                                               |
| Anti-funnel rule | only the decision following the **first** interview counts, at most one per pair, so a company adding later stages cannot raise the metric |
| Exclusions       | later interviews of the same pair; applications withdrawn by the candidate before the interview; demo data (`data_source=synthetic-demo`)  |
| Reporting        | weekly, 4-week rolling average, **always next to "per publication with applications"** (1.93 today)                                        |
| Baseline         | 1 620 / 34 weeks = **~48 per week**, against 146 first interviews and 1 340 applications per week                                          |

The 35-day window follows the data: post-interview decision median 9 days, maximum 34.

### Why this shows the product helps

- **Two-sided in a single event.** A continuation means the company found someone worth continuing
  with and the candidate reached a process that matches what they actually did. It is the only
  point in the data where both sides' interests are satisfied at once.
- **Influenceable.** The scope card acts exactly where this number is made: if the recruiter can
  see the "ja / zespol" boundary before inviting, fewer conversations happen "just to check" and a
  larger share of those held end in continuation. Candidate-side (assistant) and recruiter-side
  (card, list ordering) levers aim at the same number from both ends.
- **Harder to fake than the alternatives.** It is not a text artifact, so smoothing sentences
  cannot raise it. It is _not_ immune: recording a continuation is a cheap stage change in a
  panel, and the cost of the next stage is often borne by someone other than the screener
  (477 screening recruiters). It needs the guardrails below rather than trust.

### Why we expect it to be leading (unproven)

> If "Trafne rozmowy" improves, we expect a company to pay for its next ad within 90 days,
> because continuation after the interview is the first moment the company sees that the ad it
> paid for produced a candidate worth continuing with - and it decides on the next purchase based
> on what it got for the last one.

Timing: purchase day 0 -> applications days 0-30 -> screening +2 days -> first interview weeks 1-4
-> **continuation +9 days (median)** -> next-ad draft weeks 4-12 -> **repeat purchase measured at
90 days**. The North Star closes in ~5 weeks, the business outcome in 13: a lead of roughly 8-10
weeks, inside the same causal chain rather than merely earlier in time.

Supporting observation, deliberately not called evidence: in June 2026 continuation fell
33.6% -> 30.1% and repeat purchase fell 45.0% -> 30.0%, while the mean Match Score rose
68.4 -> 78.5. In the one moment the business outcome broke, this metric moved with it and the
cosmetic metric moved against it.

**Status: plausible assumption, not a verified relationship.** One observation, not a series;
observational, not randomized; S18 in Justyna's own documents offers a rival explanation (next-ad
draft timing is a system rule, not a company decision), and the chain passes through hiring, which
the data does not record. Documentation must say "unproven" until test 1 below passes.

### Tests on existing data

1. **Company-level correlation (primary).** Unit: company x month of first purchase. X = trafne
   rozmowy from that company's ads within 90 days of the purchase. Y = new paid purchase in the
   same window (definition from `supersprint/tydzien-2/01-cel.md`, each company once, only cohorts
   with a complete 90-day window). Control for the number of ads bought. Expectation: companies
   with zero trafne rozmowy return markedly less often than companies with at least one.
2. **Does the June 2026 break show up in the North Star?** Compare trafne rozmowy per publication
   for the June cohort (180 companies, 30.0%) against January 2025 - May 2026 (2 196 companies,
   45.0%).
3. **Lead, not co-movement.** Cross-correlate weekly series at 0-16 weeks of lag; the peak should
   sit near 8-10 weeks. Only 34 weeks of data, so this is supporting, not decisive.

### Abandon the metric if

- test 1 comes out flat - companies with zero trafne rozmowy repurchase as often as others;
- the June cohort has a normal number of trafne rozmowy per publication, so the purchase drop has
  another source and this metric measures something that did not change;
- an audit shows continuations are recorded loosely (most end in a second-stage rejection), making
  the event too cheap;
- hiring becomes measurable - then the North Star moves to filled positions and trafne rozmowy
  becomes an input.

## Inputs

Ordered as a chain: 1 and 5 supply the material, 2 and 3 turn it into better decisions and compose
the North Star arithmetically, 4 decides whether the result reaches revenue.

### 1. Applications with a concrete fact (candidate side) - up

Share of submitted applications where **"Efekt"** and **"Jak to sprawdzono"** are filled in the
candidate's own words (not "Kandydat tego nie podal"). **Baseline unknown** - the open question
from the A/B note ("how many of the four fields can be filled from current answers"), to be
measured on a sample first.

Ideas: build the candidate screen with the assistant asking exactly those two questions
("Jaki byl efekt? Skad wiesz, ze zadzialalo?"), candidate approval of the card before sending, and
a "this is what the recruiter will see" preview.

Not the 4/4 field counter: Kuba and Natalia both score 3/4 and both leave "Efekt" empty, so the
counter already failed to separate two candidates. These two fields are the gap that carries the
distinguishing information.

### 2. Invitation precision - up

Share of first interviews that end in "continue" within 35 days. **Today 32.7%** (1 620 of 4 950);
33.6% before June 2026, 30.1% after.

Ideas: scope card above the assistant-polished answer (shipped: `scope-card.tsx` inside
`recruiting-application.tsx`), the card signal on the candidate list, ordering the list by card
content instead of Match Score, honest "Kandydat tego nie podal" instead of filling gaps.

Link: **North Star = first interviews x this share.** At today's 146 interviews per week,
32.7% -> 38% moves 48 -> 56 trafne rozmowy with no extra interview for anyone. It also polices the
other inputs: it falls when people are invited "just to check", so if the North Star rises while
this falls, the market grew and the product did not.

### 3. Held applications - down

Share of applications marked "wstrzymane" within 25 days, over **all assigned applications** (not
screened ones, so the card cannot improve it by slowing the recruiter down). **Today 17.0%**
(7 641 of 45 000), ~228 per week; the A/B plan targets 14.4%.

Ideas: the card itself (this is the A/B test's primary metric); bringing held applications back
onto the list before the ad closes.

Link: a held application yields neither an interview nor a rejection - stalled potential, and the
closest observable trace of opportunity O01.

### 4. Publications with at least one trafna rozmowa - up

Share of publications with applications that produced >=1 trafna rozmowa in the ad's lifetime.
**Baseline unknown**; only the mean is known, **1.93 continuations per publication** (1 620 / 840),
and the distribution is what matters.

Ideas: completeness and ordering of the candidate list on ads that produced nothing; resurfacing
held applications; candidate reach on hard roles.

Link: this is how the North Star reaches the business outcome. If test 1 shows a **threshold**
("at least one") rather than a linear relation - likely at a mean of 1.93 - then repeat purchase
improves by moving ads from zero to one, not from two to three.

### 5. Applications with any decision - up

Share of applications with a recorded screening decision within 25 days. **Today 57%**
(25 668 screened of 45 000), so **~43% (19 332, ~570 per week) carry no recorded decision at all**.
Caveat: not confirmed to be "never" - some may have been in flight at the 2026-06-30 cut-off; the
distribution of time-to-decision settles this.

Ideas: the card shortens screening of a single application; list ordered by card content; a
reminder about unreviewed applications before the ad closes.

Link: an application without a decision can never become a trafna rozmowa - 570 per week against 48. This is both the candidate-side blind spot (the worst experience the product produces) and the
largest reserve of North Star growth in the funnel.

### How they compose

```
applications 1 340/wk
   |  x invite 14.7%              ->  197 invitations
   |  x interview realised 74%    ->  146 first interviews
   |  x [2] continuation 32.7%    ->   48  North Star: trafne rozmowy
   |
   |- [3] 17.0% held (228/wk) leave the chain before the invitation
   |- [5] 43% (570/wk) never get a decision at all
   |- [1] concrete facts feed the decision that creates [2] and [3]
   |_ [4] how those 48 spread over 840 publications decides repeat purchase
```

## Guardrails (watch, do not optimise)

- **Median time to screening decision** (2 days today) - so inputs 3 and 5 do not improve through a
  "reject everything fast" rush.
- **Invite share of applications** (14.7% today) - so input 2 does not rise by inviting only safe
  bets, which cuts out candidates with unusual paths.
- **Share of publications for hard roles** - so growth does not come from an easier role mix.

## Rejected candidates for the North Star

| Candidate                                         | Why not                                                                                                                                                                          |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Filled positions (the real transaction)           | not in the data; the furthest observable point is continuation (`CASE_PROTOCOL.md`); also too rare and slow                                                                      |
| Repeat purchase within 90 days                    | business output, lagging; at 180 companies per monthly cohort, 5 pp needs ~15 months of recruitment                                                                              |
| Hold rate (17.0%)                                 | measures the absence of value, recruiter-only, improves with haste; kept as the A/B primary metric and a guardrail                                                               |
| Match Score                                       | demonstrated counter-example: rose 68.4 -> 78.5 while invites and continuations fell                                                                                             |
| Submitted applications                            | the executive hypothesis the data undercuts; at 54 applications per ad, more volume is cost, not value                                                                           |
| Invitations                                       | rewards inviting "just to check", which is the problem itself                                                                                                                    |
| Interviews rejected as "inny zakres" (Ola's case) | good and candidate-protective, but nearly the complement of input 2 - those rejections _are_ the missing continuations, so it would double-count; kept as a breakdown of input 2 |

## Known limits of this proposal

- The North Star counts an event that means "not rejected yet", not a hire. The anti-funnel rule
  blocks the multi-stage inflation; it does not block a company that used to reject after one
  interview now adding a second stage.
- An absolute count rises when the marketplace grows, with no product improvement. This is why the
  per-publication figure is reported with it and input 2 exists.
- The candidate side has no measured baseline for returning after a rejection, so "candidates come
  back" stays a labelled assumption, not an expectation supported by data. The candidate screen
  (the I2 assistant) does not exist, so input 1 currently has no product surface.
- Nothing here is measurable in the prototype as it stands: `src/lib/analytics.ts` carries
  autocapture and `application_submitted`, so stage-change events (`first_interview`, `continued`)
  with the candidate-publication pair would have to be added - a decision for later, not part of
  this note.

## Next steps

Three figures, all computable from `applications.csv`, none requiring new measurement: the baseline
for input 1, the distribution of continuations per publication for input 4, and the time-to-decision
distribution behind input 5. Then test 1.

## Validation

No source, fixture or UI file changed, so `./scripts/verify` was not run. `FEATURES.md` was
reviewed: this note adds no product behavior to the prototype, so the register needed no update.
