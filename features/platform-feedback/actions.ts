"use server";

import { isAppLocale } from "@/lib/i18n/locales";
import { prisma } from "@/lib/prisma";
import {
  getWp3PlatformFeedbackEligibility,
  WP3_PLATFORM_SURVEY_TYPE,
  WP3_PLATFORM_SURVEY_VERSION,
} from "@/lib/platform-feedback/wp3-eligibility";
import { createClient } from "@/lib/supabase/server";

export type SubmitPlatformFeedbackInput = {
  locale: string;
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

  const ratings = [
    input.easeOfUse,
    input.moduleClarity,
    input.navigation,
    input.testsExperience,
    input.technicalProblems,
    input.overallSatisfaction,
  ];

  if (!ratings.every(validateRating)) {
    throw new Error("INVALID_RATING");
  }

  const suggestions = normalizeText(input.suggestions);
  const technicalNotes = normalizeText(input.technicalNotes);

  // Eligibility is rechecked inside the transaction, not inferred from a client flag.
  // The unique (user, survey, cohort) index also rejects concurrent duplicate submissions.
  await prisma.$transaction(async (tx) => {
    const { eligible, assignment } = await getWp3PlatformFeedbackEligibility(userId, tx);
    if (!eligible || !assignment) {
      throw new Error("SURVEY_NOT_AVAILABLE");
    }

    const [profile, attempts] = await Promise.all([
      tx.profile.findUnique({ where: { id: userId }, select: { role: true } }),
      tx.userCourseAttempt.findMany({
        where: { userId, course: { status: "published" } },
        select: { courseId: true, status: true, startedAt: true, completedAt: true },
      }),
    ]);
    if (profile?.role !== "educator") {
      throw new Error("FORBIDDEN");
    }

    const startedCourseIds = attempts
      .filter((item) => item.status !== "not_started" || item.startedAt !== null)
      .map((item) => item.courseId);
    const completedCourseIds = attempts
      .filter((item) => item.status === "completed" || item.completedAt !== null)
      .map((item) => item.courseId);

    await tx.surveySubmission.create({
      data: {
        userId,
        surveyType: WP3_PLATFORM_SURVEY_TYPE,
        surveyVersion: WP3_PLATFORM_SURVEY_VERSION,
        roundKey: assignment.cohortCode,
        locale: input.locale,
        countryCode: assignment.countryCode,
        roleAtSubmission: profile.role,
        isPilotAtSubmission: true,
        pilotCohortCode: assignment.cohortCode,
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
        activitySnapshot: {
          modulesStarted: startedCourseIds.length,
          modulesCompleted: completedCourseIds.length,
          startedCourseIds,
          completedCourseIds,
          countingRule: "unique_course_ids_v1",
        },
      },
    });
  });

  return { ok: true };
}
