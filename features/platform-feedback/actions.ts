"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

type SubmitPlatformFeedbackInput = {
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
  const normalized = value?.trim() ?? "";
  return normalized.length > 0 ? normalized : null;
}

export async function submitPlatformFeedbackAction(input: SubmitPlatformFeedbackInput) {
  const userId = await getAuthedUserId();

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

  const now = new Date();

  await prisma.$transaction(async (tx) => {
    await tx.platformFeedbackSubmission.create({
      data: {
        userId,
        easeOfUse: input.easeOfUse,
        moduleClarity: input.moduleClarity,
        navigation: input.navigation,
        testsExperience: input.testsExperience,
        technicalProblems: input.technicalProblems,
        overallSatisfaction: input.overallSatisfaction,
        suggestions: normalizeText(input.suggestions),
        technicalNotes: normalizeText(input.technicalNotes),
      },
    });

    await tx.platformFeedbackReminder.upsert({
      where: {
        userId,
      },
      update: {
        submittedAt: now,
        dismissedAt: now,
        remindLaterAt: null,
      },
      create: {
        userId,
        submittedAt: now,
        dismissedAt: now,
        remindLaterAt: null,
      },
    });
  });

  return {
    ok: true,
  };
}
