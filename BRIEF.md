# DoRoboty.ai AIPH3 — Prototype Brief

## Product

A forkable recruitment prototype for non-technical AIPH3 participants working with coding agents. This is separate from the public DoRoboty.ai production site.

## Primary outcome

A participant can start with Node.js 24 and npm, extend the prototype and test a coherent job → candidate application → employer decision workflow.

## Behavior

- Preserve Polish product UI, Build / Apply / Lead taxonomy, local assets and shared Base UI controls. New and changed UI follows the accepted [DoRoboty design system](docs/design-system/DOROBOTY.md); adapt its visual roles within the requested scope while preserving the product contract. Installing the reference does not itself convert current application styling.
- Use prepared personas instead of real accounts. Candidate and employer views share one browser-local scenario.
- Provide reset, validated import/export and recovery guidance.
- Retain jobs, filters/list/map, companies, profiles, sample CVs, saved jobs, application drafts/submission and recruiting decisions.
- Candidates write their application answers directly; there is no candidate notes editor or AI proposal flow. Legacy candidate notes/generated text remain separate from approved answers in version-1 saves and imports, and are preserved when saving or submitting a resumed draft.
- Preserve employer source briefs separately from approved descriptions. UX demonstrations are not evidence of model quality or hiring probability.
- Keep submitted applications/CVs immutable while profiles and jobs evolve.
- Keep historical teaching evidence separate from locally created prototype records. The shipped stage is baseline only.

## Boundaries

A shareable static build contains no secrets and provides no confidentiality between roles. Hosting is optional and provider-independent.

## Learning

Participants investigate user needs, choose a solution, change the prototype and test it with a real person. The historical case distinguishes completed applications and text-based proxy scores from recruiting outcomes. Synthetic evidence does not establish product effectiveness.

Canonical original Polish materials in docs/source are historical instructor references, not setup instructions or participant package content.

## Success

Fresh checkout: npm ci → npm run dev. A complete workflow survives reload. Hash deep links work on static hosting. Import/reset/recovery and role/person-specific views behave consistently. ./scripts/verify passes and a separate review is completed.
