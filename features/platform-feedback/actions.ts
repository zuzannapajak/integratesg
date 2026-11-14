"use server";

import { isAppLocale } from "@/lib/i18n/locales";
import { PLATFORM_RATING_KEYS } from "@/lib/platform-feedback/definition";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  getWp3PlatformFeedbackEligibility,
  WP3_PLATFORM_SURVEY_TYPE,
  WP3_PLATFORM_SURVEY_VERSION,
} from "@/lib/platform-feedback/wp3-eligibility";
import { createClient } from "@/lib/supabase/server";
import {
  getWp4PlatformFeedbackEligibility,
  WP4_PLATFORM_SURVEY_TYPE,
  WP4_PLATFORM_SURVEY_VERSION,
} from "@/lib/platform-feedback/wp4-eligibility";
import { getWp4ActivitySnapshot } from "@/lib/wp4-surveys/activity";

export type SubmitPlatformFeedbackInput = {
  locale: string;
  context?: "wp3" | "wp4";
  easeOfUse: number;
  moduleClarity: number;
  navigation: number;
  testsExperience: number;
  technicalProblems: number;
  overallSatisfaction: number;
  suggestions?: string;
  technicalNotes?: string;
};

async function getAuthedUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  return user.id;
}

function validateRating(value: number) {
  return Number.isInteger(value) && value >= 1 && value <= 5;
}

function normalizeText(value: string | undefined) {
  if (value !== undefined && typeof value !== "string") {
    throw new Error("INVALID_TEXT");
  }
  const normalized = value?.trim() ?? "";
  if (normalized.length > 4000) {
    throw new Error("TEXT_TOO_LONG");
  }
  return normalized.length > 0 ? normalized : null;
}

export async function submitPlatformFeedbackAction(input: SubmitPlatformFeedbackInput | null) {
  const userId = await getAuthedUserId();

  if (!input || !isAppLocale(input.locale)) {
    throw new Error("INVALID_LOCALE");
  }

  const ratings = PLATFORM_RATING_KEYS.map((key) => input[key]);

  if (!ratings.every(validateRating)) {
    throw new Error("INVALID_RATING");
  }

  const requestedContext: unknown = input.context;
  if (requestedContext !== undefined && requestedContext !== "wp3" && requestedContext !== "wp4") {
    throw new Error("INVALID_CONTEXT");
  }
  const context = requestedContext === "wp4" ? "wp4" : "wp3";

  const suggestions = normalizeText(input.suggestions);
  const technicalNotes = normalizeText(input.technicalNotes);

  // Verify eligibility within the same transaction that persists the answer.
  await prisma.$transaction(async (tx) => {
    const [profile, eligibility] = await Promise.all([
      tx.profile.findUnique({ where: { id: userId }, select: { role: true } }),
      context === "wp3"
        ? getWp3PlatformFeedbackEligibility(userId, tx)
        : getWp4PlatformFeedbackEligibility(userId, tx),
    ]);
    if (!eligibility.eligible || !eligibility.assignment || !profile) {
      throw new Error("SURVEY_NOT_AVAILABLE");
    }
    if (context === "wp3" && profile.role !== "educator") throw new Error("FORBIDDEN");
    if (context === "wp4" && !["learner", "educator"].includes(profile.role)) {
      throw new Error("FORBIDDEN");
    }

    const snapshot =
      context === "wp3"
        ? await (async () => {
            const attempts = await tx.userCourseAttempt.findMany({
              where: { userId, course: { status: "published" } },
              select: { courseId: true, status: true, startedAt: true, completedAt: true },
            });
            const startedCourseIds = attempts
              .filter((item) => item.status !== "not_started" || item.startedAt !== null)
              .map((item) => item.courseId);
            const completedCourseIds = attempts
              .filter((item) => item.status === "completed" || item.completedAt !== null)
              .map((item) => item.courseId);
            return {
              modulesStarted: startedCourseIds.length,
              modulesCompleted: completedCourseIds.length,
              startedCourseIds,
              completedCourseIds,
              countingRule: "unique_course_ids_v1",
            };
          })()
        : await getWp4ActivitySnapshot(userId, tx);

    await tx.surveySubmission.create({
      data: {
        userId,
        surveyType: context === "wp3" ? WP3_PLATFORM_SURVEY_TYPE : WP4_PLATFORM_SURVEY_TYPE,
        surveyVersion:
          context === "wp3" ? WP3_PLATFORM_SURVEY_VERSION : WP4_PLATFORM_SURVEY_VERSION,
        roundKey: eligibility.assignment.cohortCode,
        locale: input.locale,
        countryCode: eligibility.assignment.countryCode,
        roleAtSubmission: profile.role,
        isPilotAtSubmission: true,
        pilotCohortCode: eligibility.assignment.cohortCode,
        answers: {
          easeOfUse: input.easeOfUse,
          moduleClarity: input.moduleClarity,
          navigation: input.navigation,
          testsExperience: input.testsExperience,
          technicalProblems: input.technicalProblems,
          overallSatisfaction: input.overallSatisfaction,
          suggestions,
          technicalNotes,
        },
        activitySnapshot: snapshot,
      },
    });
  });

  revalidatePath(`/${input.locale}/platform-feedback`);
  if (context === "wp4") {
    revalidatePath(`/${input.locale}/eportfolio`);
    revalidatePath(`/${input.locale}/scenarios`);
  } else {
    revalidatePath(`/${input.locale}/curriculum`);
  }
  return { ok: true };
}
