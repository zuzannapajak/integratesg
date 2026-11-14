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
import {
  feedbackIsRateLimited,
  GENERAL_FEEDBACK_HOURLY_LIMIT,
} from "@/lib/platform-feedback/rate-limit";
import { Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";

/** General feedback is independent of pilot evaluation and can be sent repeatedly within limits. */
export async function submitGeneralFeedbackAction(input: GeneralFeedbackInput | null) {
  const userId = await requireAuthenticatedUserId();
  const feedback = validateGeneralFeedback(input);
  if (!isAppLocale(feedback.locale)) throw new Error("INVALID_LOCALE");

  const profile = await prisma.profile.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  if (!profile || !isSelfServiceRole(profile.role)) throw new Error("FORBIDDEN");

  const now = new Date();
  const hourAgo = new Date(now.getTime() - 60 * 60_000);
  try {
    // Serializable prevents simultaneous submissions from bypassing the per-user limit.
    // A concurrent serialization conflict is treated as rate limiting rather than retried.
    await prisma.$transaction(
      async (tx) => {
        const recent = await tx.surveySubmission.findMany({
          where: {
            userId,
            surveyType: GENERAL_FEEDBACK_SURVEY_TYPE,
            submittedAt: { gte: hourAgo },
          },
          orderBy: [{ submittedAt: "desc" }, { id: "desc" }],
          take: GENERAL_FEEDBACK_HOURLY_LIMIT,
          select: { submittedAt: true },
        });
        if (
          feedbackIsRateLimited(
            recent.map((item) => item.submittedAt),
            now,
          )
        ) {
          throw new Error("FEEDBACK_RATE_LIMITED");
        }
        await tx.surveySubmission.create({
          data: {
            userId,
            surveyType: GENERAL_FEEDBACK_SURVEY_TYPE,
            surveyVersion: GENERAL_FEEDBACK_SURVEY_VERSION,
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
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  } catch (error) {
    if (
      (error instanceof Error && error.message === "FEEDBACK_RATE_LIMITED") ||
      (typeof error === "object" && error !== null && "code" in error && error.code === "P2034")
    ) {
      return { ok: false as const, reason: "rate_limited" as const };
    }
    throw error;
  }

  revalidatePath(`/${feedback.locale}/admin/stats`);
  revalidatePath(`/${feedback.locale}/admin/platform-feedback`);
  revalidatePath(`/${feedback.locale}/admin/feedback`);
  return { ok: true as const };
}
