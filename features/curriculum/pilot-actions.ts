"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

type SkipCurriculumPilotPreAssessmentInput = {
  courseSlug: string;
};

async function getAuthedUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user.id;
}

export async function skipCurriculumPilotPreAssessmentAction(
  input: SkipCurriculumPilotPreAssessmentInput,
) {
  const userId = await getAuthedUserId();

  const course = await prisma.course.findUnique({
    where: {
      slug: input.courseSlug,
    },
    select: {
      id: true,
    },
  });

  if (!course) {
    throw new Error("Course not found.");
  }

  const now = new Date();

  const existingPilot = await prisma.curriculumPilot.findUnique({
    where: {
      userId,
    },
    select: {
      status: true,
      preAssessmentSeenAt: true,
      preAssessmentSkippedAt: true,
      preAssessmentCompletedAt: true,
    },
  });

  if (!existingPilot) {
    await prisma.curriculumPilot.create({
      data: {
        userId,
        status: "pre_skipped",
        preAssessmentSeenAt: now,
        preAssessmentSkippedAt: now,
      },
    });

    return { ok: true };
  }

  const preDecisionAlreadyMade = Boolean(
    existingPilot.preAssessmentSkippedAt ?? existingPilot.preAssessmentCompletedAt,
  );

  if (existingPilot.status === "pre_prompt_shown" && !preDecisionAlreadyMade) {
    await prisma.curriculumPilot.update({
      where: {
        userId,
      },
      data: {
        status: "pre_skipped",
        preAssessmentSeenAt: existingPilot.preAssessmentSeenAt ?? now,
        preAssessmentSkippedAt: now,
      },
    });
  }

  return { ok: true };
}
