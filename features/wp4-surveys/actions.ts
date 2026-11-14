"use server";

import { requireAuthenticatedUserId } from "@/lib/auth/require-authenticated-user-id";
import { getWp4PlatformFeedbackEligibility } from "@/lib/platform-feedback/wp4-eligibility";
import { prisma } from "@/lib/prisma";
import {
  WP4_SURVEY_ROUND,
  WP4_SURVEY_TYPES,
  WP4_SURVEY_VERSION,
} from "@/lib/wp4-surveys/definition";
import { getWp4SurveyAvailability } from "@/lib/wp4-surveys/queries";
import { normalizeWp4SurveyInput, type Wp4SurveyInput } from "@/lib/wp4-surveys/validation";
import { revalidatePath } from "next/cache";

export async function submitWp4SurveyAction(input: Wp4SurveyInput | null) {
  const userId = await requireAuthenticatedUserId();
  const normalized = normalizeWp4SurveyInput(input);
  const { scope, locale, ...answers } = normalized;

  const nextPath = await prisma.$transaction(async (tx) => {
    // Never trust a client-provided role, activity count, country or pilot flag.
    const availability = await getWp4SurveyAvailability(userId, scope, tx);
    if (!availability.eligible) throw new Error("SURVEY_NOT_AVAILABLE");

    const profile = await tx.profile.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    if (!profile) throw new Error("PROFILE_REQUIRED");

    // The unique constraint handles concurrent submissions; legacy feedback remains untouched.
    await tx.surveySubmission.create({
      data: {
        userId,
        surveyType: WP4_SURVEY_TYPES[scope],
        surveyVersion: WP4_SURVEY_VERSION,
        roundKey: WP4_SURVEY_ROUND,
        locale,
        countryCode: availability.pilotAssignment?.countryCode ?? null,
        roleAtSubmission: profile.role,
        isPilotAtSubmission: Boolean(availability.pilotAssignment),
        pilotCohortCode: availability.pilotAssignment?.cohortCode ?? null,
        answers:
          scope === "case-studies"
            ? { ...answers, testedCaseStudies: availability.activity.caseStudiesCompleted }
            : answers,
        activitySnapshot: availability.activity,
      },
    });

    const platform = await getWp4PlatformFeedbackEligibility(userId, tx);
    return platform.eligible ? `/${locale}/platform-feedback?context=wp4` : null;
  });

  revalidatePath(`/${locale}/eportfolio`);
  revalidatePath(`/${locale}/scenarios`);
  revalidatePath(`/${locale}/wp4-surveys/${scope}`);
  return { ok: true, nextPath };
}
