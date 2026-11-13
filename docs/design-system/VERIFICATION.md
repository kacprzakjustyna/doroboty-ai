# Poster People — application acceptance checklist

Use with [implementation rules](IMPLEMENTATION.md) and the [project guide](README.md). This checklist incorporates the implementation audits A01–A08/R01–R04 and the later process/application/interaction work. Read the [host catalog](HOST-COMPONENTS.md), [record APIs](RECORDS.md) and [status/open findings](STATUS.md) for current owners. It defines checks to execute; it does not claim any future screen has passed them.

## Evidence required before completion

1. Record affected routes, families, shared consumers and acceptance criteria in docs/tasks/. Identify reference requirements versus host adaptations before implementation.
2. Run the source on port 8952 and the app on port 3001. Compare the same viewport, with local fonts loaded, using complete pages and relevant states. Preserve the immutable kit.
3. Compare anatomy, order, typography, spacing, contours and states. Capture pairs and record computed values where a difference is unclear. Different fixture text/counts do not require identical heights or total page length.
4. Check desktop 1280px and mobile 390px, then 320px and the relevant 1100/850/700/600 boundaries (including adjacent widths when a rule changes). After changing viewport width, wait for layout/media styles to settle (for example, two animation frames) before sampling computed values. Inspect clipped/overlapping children, not only document scrollWidth: global overflow clipping can hide defects.
5. Exercise the state/keyboard matrix below. Include long Polish content, company initials, missing salary, empty results, disabled actions, errors and recovery. Check affected workspace consumers and portals as well as marketplace pages.
6. Run `./scripts/verify`. Add focused regressions for discovered failures and important source anatomy; tests that only check overflow or take screenshots are insufficient for visual acceptance.
7. Perform a separate comparison/review pass. For each audit finding record **closed / partial / open**, evidence and remaining scope. Write the final outcome from that evidence, not from the intended implementation or a green test count.

## Canonical values to compare

These checkpoints are declared in the immutable [source component](agent-kit/styles/components.css), [listing](agent-kit/styles/listing.css) and [offer](agent-kit/styles/offer.css) styles. They are not new token names. At intermediate/adjacent widths, read the active source rule and preserve its ordering.

| Viewport CSS width | Listing entry H1 | Card title | Card salary | Offer H1 | Offer salary | Search action | Offer action |
| ------------------ | ---------------- | ---------- | ----------- | -------- | ------------ | ------------- | ------------ |
| 1280               | 72px             | 28px       | 15px        | 64px     | 24px         | 14px          | 14px         |
| 1100               | 58px             | 26px       | 13px        | 54px     | 22px         | 14px          | 13px         |
| 850                | 52px             | 28px       | 14px        | 46px     | 20px         | 12px          | 12px         |
| 700                | 52px             | 28px       | 14px        | 47px     | 25px         | 12px          | 14px         |
| 600 / 390          | 43px             | 26px       | 13px        | 47px     | 25px         | 12px          | 14px         |

- Geist Serif headings: Regular 400, no synthetic bold. Body/controls: Arial/Helvetica/system sans. Source actions use weight 600, line-height 1.5 and normal tracking; do not check font size alone.
- At 1280px the source search is 1200px wide, spanning the content area. It stays visible outside mobile filters. Preserve its split mobile rows and category row below.
- Card title line-height is 1.12 desktop and 1.13 at <=600px (26px → 29.38px). Keep complete wrapping and role-specific tracking.
- Offer reading H2: 36px base, 32px in the 701–850 range, 33px at <=700px. Offer salary line-height is 1.45 through 700px (25px → 36.25px), then 1.35 at <=600px (25px → 33.75px).
- Desktop offer conditions use 350px / 310px / 285px columns at the documented breakpoints and sticky top 24px; at <=700px they are static before reading, with a two-column terms list.
- Main radii are 10/18/24px, with documented exceptions. Check one visible ink contour per surface/control, including quiet saves, panels, homepage categories and dialogs.

## Interaction matrix

| Trigger                                      | Required result                                                                                         | Regression to catch                                                        |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Query/location submit, facet/category change | URL and applied results agree; current draft/apply model is explicit                                    | Search moved into filters, invented filter semantics, stale field defaults |
| Reset → back → forward                       | Query, location, categories and facets return to the matching visible state                             | URL clears while Product remains in the textbox                            |
| Keyboard remove middle/last chip             | Surviving chip / results heading receives focus after render                                            | Active element becomes BODY                                                |
| Save/unsave                                  | Stable name, correct aria-pressed, visible state, logical retained/restored focus                       | Changing toggle names or destroying the focus target                       |
| Mobile filters open → scroll → close/Escape  | Named modal, contained focus, independent scroll body, stationary header/footer, trigger focus restored | Centered-dialog animation offsets full-height filters; footer hides fields |
| Section link primary click / Enter           | Correct route and focused/scrolled section                                                              | Mouse-only scroll interception                                             |
| Copy section URL → fresh page; back/forward  | Same offer and section resolve without a server or route error                                          | Bare #employer navigates to NotFound                                       |
| Missing salary / long title / missing logo   | Explicit absence, complete wrapping, initials; no invented values/content                               | Tiny pay, clipped title, illustration used as employer identity            |
| Shared primitive/token change                | Recheck public and role screens, form/error states and portals                                          | Fixing a single page breaks other consumers                                |

## Host screen and component checks

| Area / trigger           | Required check                                                                                                                                                                                                    | Regression to catch                                                                                                                                        |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Employer Answer/CV tabs  | Named tabs/panels; arrows/Home/End and focus-following selection; note survives switching; scope assertions to the named panel.                                                                                   | Fake/static tabs, lost note, unlabelled panel queries colliding with an inert exiting panel.                                                               |
| Submitted CV             | Answer has no CV controls; CV has matching local open/download and framed native PDF. Visually inspect the actual PDF in a capable browser, not just iframe src.                                                  | File row leaking into Answer, unrelated prepared CV, a blank frame claimed to be a verified preview.                                                       |
| Custom CV / snapshot     | Complete saved text, no mismatched prepared file; same submitted CV after profile edits. Editable form says “CV z Twojego profilu”.                                                                               | Hidden/truncated custom data or current-profile data substituted for an immutable snapshot.                                                                |
| Record headings          | Hidden sheet H2; answer, CV and recruiter note H3 at 26px/400. Preserve label association and spacing at 1280/390/320px.                                                                                          | Changing a tag without changing the actual size, synthetic serif bold, skipped outline or detached field label.                                            |
| Timeline/stage action    | Only actual events and allowed nextStages; success appends/clears note, focuses updated status; terminal state has no editor/actions. Candidate has no employer notes.                                            | Invented completed steps, lost note on failure, BODY focus after removal, role leakage.                                                                    |
| MatchScore               | Test 0/39/40/59/60/79/80/100; compare every caller, ink/fill contrast and visible percentage. Current 72% is yellow.                                                                                              | Always-pink header tag, divergent thresholds, facts styled as controls or real assessment claims.                                                          |
| BackLink                 | Same 13/12px text, 17px arrow, 9px gap, 36px minimum; pointer/color/underline hover, visible focus and valid copied/Enter hash destination.                                                                       | Per-route arrow/color/spacing or a visual back button pointing to an invalid route.                                                                        |
| Enabled/disabled actions | Compare computed resting and painted hover colors and cursor in public/role/portal contexts. Selected states retain contrast; facts remain inert.                                                                 | Underline-only feedback, missing pointer, selected text disappearing, disabled actions appearing active.                                                   |
| Offer action siblings    | Measure Apply/Save vertical separation at desktop and mobile; gap is at least 10px.                                                                                                                               | React markup relying on a source .button sibling selector it does not match.                                                                               |
| Application preview/form | Full real job facts and in-place description; keyboard disclosure does not lose answer/consent. At <=850px context precedes form. Preserve draft/reload, consent reset, validation focus and local submission.    | Navigating away to read context, nested CV panels, restored legacy source notes exposed as approved answer.                                                |
| Successful submit        | Only successful local submit; one record, disabled success controls, 900ms redirect; no effect for invalid input, draft save or existing records. The decorative burst was removed with the design-system change. | Celebration on click/failure, duplicate records, timer redirect after the owner leaves, effect replay on refresh.                                          |
| Reduced motion           | No celebration delay with reduced motion; textual confirmation remains and no decorative portal exists at all. Control transitions stay within 120–200ms.                                                         | Flashing hidden motion, animation as the sole feedback, blocked inputs or page overflow.                                                                   |
| Company profile audit    | Scan the actual company route with Axe; validate dl/dt/dd grouping and keep website action outside dl. Check identity/surface contours, candidate save controls and empty state.                                  | General accessibility tests passing while the company route remains untested. NH-01–NH-05 stay open until implementation and targeted evidence close them. |

The employer history/summary margin moves after the reading sheet at <=950px; the candidate application's context/form stack changes at <=850px. Check those boundaries independently rather than treating every host screen as one breakpoint system. Source listing/offer breakpoints remain unchanged.

When freezing an animation frame or mocking timers, distinguish that inspection from a real-time completion/reduced-motion test. Store evidence in a new task-specific directory and report which state was actually exercised.

For candidate submitted records, verify the same Answer/CV snapshot composition with a role-title header and the correct applications-list BackLink. Candidate history is projected to stage/date before rendering; employer notes and legacy source/generated text must be absent in both tabs. Check withdrawal open → confirm focus, cancel → trigger focus, success → surviving status focus, reload persistence, terminal actions and wrong-candidate deep links. Recheck employer notes/stage actions whenever shared ApplicationRecord changes.

## What each check proves

| Evidence                                         | Supports                                                                                         | Does not establish                                                                 |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `npm run design-system:check`                    | Kit inventory/hashes, local reference integrity and standalone example tests                     | React screen adoption or visual acceptance                                         |
| `./scripts/verify`                               | Checks actually run: formatting, kit checks, lint, types, units, packet, build, browser journeys | Unasserted visual details, complete accessibility, CI/deployment or human approval |
| Route screenshot matrix and no external requests | Captured routes/viewports and runtime independence during that run                               | Source conformity unless compared; complete keyboard/state coverage                |
| Paired source/app captures + computed styles     | Observed anatomy and measured visual roles at those states/widths                                | All data combinations or untested breakpoints                                      |
| A focused regression test                        | Its executed trigger and assertions                                                              | Every behavior of the component or a complete design audit                         |

## Completion wording and extensions

Keep historical audit reports. Add closure evidence rather than deleting a finding. Store current captures in a new task-specific evidence directory; do not overwrite earlier audit artifacts. Link task results from the engineering record, and distinguish source coverage from executed tests. Do not report all findings closed while any criterion is partial.

Do not propose a system update to legitimize an implementation defect. First restore already documented families, then describe genuinely missing host recipes with anatomy, states, keyboard behavior, responsive rules and evidence. The user can authorize documentation updates without that constituting a new versioned kit release, publishing or general design approval.

Current regression examples are in [browser journeys](../../tests/e2e/prototype.spec.ts), including canonical marketplace typography/search geometry, reset/history, filter focus, route-aware section links, chip successors, shared surfaces/actions, record tabs/notes/CV, application preview/draft retention and normal/reduced-motion submit celebration. Ad-hoc visual/boundary audits in the task records cover additional states; they are not automatically permanent CI regressions. Re-read current tests before relying on them; this file does not assert that they ran in a later task.
