# Pilot satisfaction — implementation and reporting

## What is included

- Two **internal** surveys: Curriculum and ePortfolio; six UI languages (en/pl/de/it/el/bg).
- Four 1–5 questions (clarity, practical relevance, usability, overall satisfaction) plus two optional free-text fields.
- Only after WP3 post-assessment (Curriculum) or completing a published case study (ePortfolio).
- Exactly one submission per authenticated account and survey area; repeated submits are rejected by a database unique constraint.
- Respondent explicitly selects pilot country (AT/BG/CY/IT/PL); locale and account email **do not** determine country.
- ePortfolio respondent selects one completed case study; data record is linked to its database ID.
- Admin page: `/[locale]/admin/pilot-satisfaction` shows unique respondents per country and per area and average overall satisfaction. Poland counter has an **operational target** of 15 for each area. No personal details or free-text comments in the dashboard.

## Essential methodology caveat

Official WP3 guidelines (version 0.1, 10 Feb 2026) require the post-pilot **external survey during/after the workshop**, administered through the consortium Google Form, and 75 completed surveys consortium-wide (approximately 15/country). The form indicated in WP3 guidelines is:

https://docs.google.com/forms/d/e/1FAIpQLSd7HkZOE4-U2N8GkCSE_4rzUIUW7WqrQ4MT2h1cUG7Cd8cjuQ/viewform

The internal Curriculum questionnaire added here is **not an official replacement** and is not validated against the consortium's official questions. Never report its count as a WP3 satisfaction indicator without explicit coordination and reconciliation with Google Forms and workshop attendance.

The WP4 ePortfolio questionnaire is a concise **draft** to be reviewed with the work-package lead. We have not received confirmed official WP4 question wording or a source prescribing 15 WP4 responses. Country selection is self-declared, not proof of attendance. A target of 15 is used for internal planning only. Do not claim the formal WP4 indicator is achieved based solely on this dashboard.

## Deployment and data safety

1. Apply the new Prisma migration to an **isolated staging database** first (check `DIRECT_URL`!). Run `npx prisma migrate deploy` only when the target is verified; **do not** run `prisma migrate reset` or the full `prisma/seed.js`.
2. `npx prisma generate`, `npm run typecheck`, `npm run test:unit:run`, `npm run build`.
3. Manual regression: Polish learner completion page -> ePortfolio survey; Polish educator pre/post -> Curriculum survey; double submission; unauthorized/non-completer cannot submit; locale switches; admin totals. Repeat smoke tests for Greek and Bulgarian.
4. Apply migration to pilot database only after a restorable backup. Deploy Next.js application after migration is complete. Keep E2E on a different Supabase project.
5. Confirm retention/access arrangements for linked survey results; comments may contain identifiable content. Add local institutional privacy text as required.

## Data model

`PilotSatisfactionSubmission`: userId, scope, countryCode, caseStudyId (only for ePortfolio), four ratings, strengths/improvements, submittedAt. Unique `(userId, scope)`. Row-level security enabled and Data API privileges revoked; write only through server actions that revalidate role and completion state.

## Future follow-up

- Approval or replacement of draft questionnaires with official consortium instruments.
- Verified assignment of participant to country/pilot cohort (currently user-selected country).
- Reconciliation with actual WP3 Google Forms counts and workshop attendance; do not infer from interface locale.
- Formal method for analysis of free-text feedback; restrict access and exclude identifying details from shared reports.
