# IntegratESG — WP3/WP4 evaluation and general feedback release review

This checklist is a release gate, **not a claim that checks have already passed**.

## Scope and expected flows

- WP3 (educators): PRE (optional), modules, POST after at least one completed module; skipping PRE must not block POST. Comparing PRE/POST requires both submissions.
- WP4 Case Studies: standard survey for eligible users after a completed case study, independent of pilot participation.
- WP4 Scenarios: standard survey for **learners and educators** after at least one completed scenario; count unique scenarios, not repeat attempts.
- WP3/WP4 pilot: separate, one-time platform satisfaction survey per relevant cohort after required assessments; standard users must not receive it.
- General platform feedback: floating link for learner and educator, regardless of pilot membership and on scenario pages. Not counted as formal WP3/WP4 evaluation.
- Administrator: general feedback can be filtered by category, paginated, deleted individually; individual evaluation responses can be filtered by country, survey type, group and role, and exactly the filtered subset can be exported.
- i18n: EN, PL, DE, IT, BG, EL; country comes from explicit pilot assignment, **not** preferred language.

## Local checks (PowerShell from repo root)

```powershell
npm ci
npx prisma validate
npx prisma generate
npm run format:check
npm run lint
npm run typecheck
npm run test:unit:run
```

On a **dedicated, disposable test database only** (confirm `TEST_DATABASE_URL`, `DATABASE_URL`, `DIRECT_URL`):

```powershell
npx prisma migrate status
npm run test:integration
```

Playwright requires the documented isolated E2E database and credentials; **never** run against production:

```powershell
npm run test:e2e:journeys
```

Verify the required CI checks on the actual merge request: `quality`, `integration`, `seed-idempotency`, `e2e`. Confirm the target database migration status against the exact intended environment. Do **not** mark the MR Ready merely because formatting and typing pass.

## Privacy and data policy

- General feedback is linked to an authenticated profile **in storage** for accountability, but the standard admin listing does not return the name, email or user ID. The administrator sees role, locale, category, date and message.
- Free-text messages can themselves contain personal data, even without account identifiers. Inform administrators and avoid sharing screenshots or exports outside authorized personnel.
- General feedback is excluded from official pilot metrics. Response-level evaluation view and exports never contain account IDs or email addresses.
- CSV export of evaluation answers omits free text by default. The explicit _qualitative_ export may include personal data and must be handled appropriately. Avoid uploading such CSVs to public project artifacts.
- Only administrators can view or permanently delete individual general-feedback messages. Deletion is restricted by **surveyType**, so it cannot delete formal WP3/WP4 answers.
- **Retention remains a policy decision:** recommended starting proposal is 12 months for informal feedback, subject to project owners' data-protection approval. No automatic deletion has been enabled without that approval. The administrator has a manual deletion action. Document the approved policy and implement any required scheduled purge separately before production rollout.
- Country on legacy WP3 PRE/POST has no historical snapshot. When current assignments are ambiguous, display country as unknown rather than inventing a value.

## Performance limitations and follow-ups

- General feedback pagination and category filtering are executed in PostgreSQL, not against an arbitrary 100-row slice.
- The evaluation response view loads the response-oriented tables and paginates in application memory. It is suitable for initial pilot volumes; for large deployments move to database-level unified pagination / indexed materialized view and bounded exports.
- Authenticated feedback limits: minimum 60 seconds between submissions and at most 10 per rolling hour. A PostgreSQL serializable transaction rejects simultaneous submissions that race the limit.

## Manual acceptance scenarios

1. Open the floating link as learner and educator on dashboard and scenario player; send a short comment. Neither role needs pilot participation.
2. After submitting, try again immediately; the UI displays a localized rate-limit message.
3. As admin, confirm floating link absent and `/feedback` forbidden. Find the report in `/admin/feedback`, filter by category, move across pages, delete only the chosen report.
4. As learner/educator, `/admin/feedback`, `/admin/evaluation/responses`, and both export routes must be inaccessible. Direct server-action calls must enforce role too.
5. Confirm aggregate pilot metrics did not change after general feedback.
6. Review `/admin/evaluation/responses` with country=PL and type=wp4_scenarios; compare the exact same rows in exported CSV. Then filter by different country, verify disjoint results.
7. Confirm normal CSV excludes free-text answers; the optional qualitative CSV includes only approved text fields and opens in a spreadsheet without formula execution.
8. Test historical WP3 PRE/POST without a country snapshot, multiple cohorts, and the case of no matching records.
9. Run each of six locales through the feedback form, admin filters, and evaluation response view; no `MISSING_MESSAGE` in logs.
10. Check usability on narrow viewport, keyboard navigation, and that pagination/deletion does not reveal unrelated entries.

## Merge readiness

- [ ] CI quality (format, lint, typecheck, unit, production build) green
- [ ] Isolated test DB migrations + integration suites green
- [ ] E2E smoke + evaluation journeys green
- [ ] Manual roles, locale, CSV, rate-limit, and privacy checks passed
- [ ] Retention and access policy approved by responsible project owner
- [ ] All changes reviewed and no pending local modifications
- [ ] MR converted from Draft to Ready **after** the above gates
