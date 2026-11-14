"use server";

import { requireAuthenticatedUserId } from "@/lib/auth/require-authenticated-user-id";
import { isSelfServiceRole } from "@/lib/auth/roles";
import { isAppLocale } from "@/lib/i18n/locales";
import {
  GENERAL_FEEDBACK_SURVEY_TYPE,
  GENERAL_FEEDBACK_SURVEY_VERSION,
  validateGeneralFeedback,
  type GeneralFeedbackInput,
} from "@/lib/platform-feedback/general-definition";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";

/** General feedback is independent of pilot eligibility and can be submitted repeatedly. */
export async function submitGeneralFeedbackAction(input: GeneralFeedbackInput | null) {
  const userId = await requireAuthenticatedUserId();
  const feedback = validateGeneralFeedback(input);
  if (!isAppLocale(feedback.locale)) throw new Error("INVALID_LOCALE");

  const profile = await prisma.profile.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  if (!profile || !isSelfServiceRole(profile.role)) throw new Error("FORBIDDEN");

  await prisma.surveySubmission.create({
    data: {
      userId,
      surveyType: GENERAL_FEEDBACK_SURVEY_TYPE,
      surveyVersion: GENERAL_FEEDBACK_SURVEY_VERSION,
      // Unlike a one-time pilot questionnaire, each voluntary report is a new round.
      roundKey: randomUUID(),
      locale: feedback.locale,
      countryCode: null,
      roleAtSubmission: profile.role,
      isPilotAtSubmission: false,
      pilotCohortCode: null,
      answers: { category: feedback.category, message: feedback.message },
      activitySnapshot: {},
    },
  });

  revalidatePath(`/${feedback.locale}/admin/stats`);
  revalidatePath(`/${feedback.locale}/admin/platform-feedback`);
  return { ok: true };
}
