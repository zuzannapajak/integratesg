# Completion UX: Curriculum, ePortfolio and satisfaction

## Review and implemented changes

| Area                             | Previous behavior                                                                                                         | Revised behavior / recommendation                                                                                                                                                                                                                                    |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Curriculum module completion     | Several actions of similar visual importance; 100% progress, certificate and secondary content compete with the next step | One primary CTA determined by pilot state; certificate and progress are supporting information; review/retake are tertiary                                                                                                                                           |
| Curriculum pilot post-assessment | Assessment was accessible from the Curriculum listing, not prioritized on the module completion page                      | Completed module can link directly to the post-assessment when the participant has completed the initial pre-assessment                                                                                                                                              |
| Curriculum feedback              | Feedback is eligible after the post-assessment                                                                            | After post-assessment, the completion page links to feedback; once already submitted, the next CTA returns to modules                                                                                                                                                |
| Satisfaction success             | Confirmation without an obvious onward action                                                                             | Shared success / already-submitted / unavailable result with a single return action                                                                                                                                                                                  |
| ePortfolio completion            | Completion page previously gave next case study prominence over feedback                                                  | The ePortfolio component was edited manually in the user's working tree in an earlier step. This patch deliberately does not replace that file. Ensure feedback is the primary CTA, and remove "Up next" and any duplicated next-case-study CTA in the local version |

## Journey matrix

1. Curriculum module completed, pilot pre-assessment completed but post-assessment missing: primary CTA opens post-assessment.
2. Curriculum module completed, pilot post-assessment completed, feedback not submitted: primary CTA opens the Curriculum satisfaction form.
3. Curriculum module completed, pilot feedback already submitted or not part of pilot: primary CTA returns to the Curriculum listing.
4. ePortfolio case study completed: feedback should be the primary CTA while eligible; a secondary link to the ePortfolio library is sufficient.
5. Satisfaction submitted: show an explicit success confirmation and a return link; repeated visits show a no-duplicate response state.
6. Satisfaction unavailable: show the eligibility requirement and a route back to the relevant learning area.

## UX safeguards

- The survey remains an internal platform survey; it does not replace the official WP3 post-workshop Google Forms evaluation.
- Do not count internal answers as official satisfaction survey responses.
- A course being 100% complete does not necessarily mean the entire pilot is complete.
- Preserve the existing certificate eligibility and retake confirmation behavior.
- Buttons and links have visible focus indicators and at least 44px interactive height for primary actions.
- Do not expose a feedback CTA before the pilot post-assessment is completed.
- Do not silently hide a database migration issue. `PilotSatisfactionSubmission` must exist before using the feedback workflow.

## Smoke test checklist

- Test six locales: en, pl, de, it, el, bg; confirm no raw translation keys or clipped buttons.
- Mobile (375px), tablet and desktop: one visually dominant CTA, no horizontal overflow.
- Keyboard-only: tab order, focus styles, and link text.
- Curriculum status variants: no pre-assessment, post-assessment pending, survey pending, survey submitted.
- Certificate available and unavailable; test the retake confirmation.
- ePortfolio: completion -> feedback -> survey success -> library.
- Curriculum: module completion -> post-assessment -> feedback -> survey success.
- Supabase migration verified before database-backed views.
