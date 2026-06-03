"use server";

import { getSafeCurriculumNextPath } from "@/lib/curriculum/pilot";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

type SkipCurriculumPilotPreAssessmentInput = {
  courseSlug: string;
};

type SubmitCurriculumPilotPreAssessmentInput = {
  locale: string;
  nextPath: string;
  answers: Array<{
    questionId: string;
    value: number;
  }>;
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

export async function submitCurriculumPilotPreAssessmentAction(
  input: SubmitCurriculumPilotPreAssessmentInput,
) {
  const userId = await getAuthedUserId();
  const safeNextPath = getSafeCurriculumNextPath(input.locale, input.nextPath);

  if (input.answers.length === 0) {
    throw new Error("Assessment answers are required.");
  }

  const uniqueQuestionIds = new Set(input.answers.map((answer) => answer.questionId));

  if (uniqueQuestionIds.size !== input.answers.length) {
    throw new Error("Each question can be answered only once.");
  }

  const result = await prisma.$transaction(async (tx) => {
    const now = new Date();

    const existingPilot = await tx.curriculumPilot.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
        status: true,
        preAssessmentSeenAt: true,
        preAssessmentSkippedAt: true,
        preAssessmentCompletedAt: true,
        postAssessmentAverageScore: true,
      },
    });

    const pilot =
      existingPilot ??
      (await tx.curriculumPilot.create({
        data: {
          userId,
          status: "pre_prompt_shown",
          preAssessmentSeenAt: now,
        },
        select: {
          id: true,
          status: true,
          preAssessmentSeenAt: true,
          preAssessmentSkippedAt: true,
          preAssessmentCompletedAt: true,
          postAssessmentAverageScore: true,
        },
      }));

    if (pilot.preAssessmentSkippedAt || pilot.status === "pre_skipped") {
      throw new Error("Pre-assessment has already been skipped.");
    }

    if (pilot.preAssessmentCompletedAt) {
      throw new Error("Pre-assessment has already been submitted.");
    }

    if (pilot.status !== "pre_prompt_shown") {
      throw new Error("Pre-assessment is no longer available.");
    }

    const questions = await tx.curriculumPilotQuestion.findMany({
      where: {
        isActive: true,
        inputType: "likert",
      },
      orderBy: {
        sortOrder: "asc",
      },
      select: {
        id: true,
        minValue: true,
        maxValue: true,
        sortOrder: true,
      },
    });

    if (questions.length === 0) {
      throw new Error("Pre-assessment questions are not configured.");
    }

    if (input.answers.length !== questions.length) {
      throw new Error("All pre-assessment questions must be answered.");
    }

    const questionsById = new Map(questions.map((question) => [question.id, question]));
    const normalizedAnswers = input.answers.map((answer) => {
      const question = questionsById.get(answer.questionId);

      if (!question) {
        throw new Error("Invalid pre-assessment question.");
      }

      const minValue = question.minValue ?? 1;
      const maxValue = question.maxValue ?? 5;

      if (!Number.isInteger(answer.value) || answer.value < minValue || answer.value > maxValue) {
        throw new Error("Invalid pre-assessment answer value.");
      }

      return {
        questionId: answer.questionId,
        value: answer.value,
        sortOrder: question.sortOrder,
      };
    });

    normalizedAnswers.sort((a, b) => a.sortOrder - b.sortOrder);

    const totalScore = normalizedAnswers.reduce((sum, answer) => sum + answer.value, 0);
    const averageScore = Number((totalScore / normalizedAnswers.length).toFixed(2));

    const courseAttempts = await tx.userCourseAttempt.findMany({
      where: {
        userId,
      },
      select: {
        courseId: true,
        status: true,
        startedAt: true,
        completedAt: true,
      },
    });

    const startedCourseIds = courseAttempts
      .filter((attempt) => attempt.status !== "not_started" || Boolean(attempt.startedAt))
      .map((attempt) => attempt.courseId);

    const completedCourseIds = courseAttempts
      .filter((attempt) => attempt.status === "completed" || Boolean(attempt.completedAt))
      .map((attempt) => attempt.courseId);

    await tx.curriculumPilotSubmission.create({
      data: {
        pilotId: pilot.id,
        type: "pre",
        submittedAt: now,
        totalScore,
        averageScore,
        answersSnapshot: normalizedAnswers.map((answer) => ({
          questionId: answer.questionId,
          value: answer.value,
        })),
        modulesStartedBeforeSubmission: startedCourseIds.length,
        modulesCompletedBeforeSubmission: completedCourseIds.length,
        startedCourseIdsSnapshot: startedCourseIds,
        completedCourseIdsSnapshot: completedCourseIds,
        answers: {
          create: normalizedAnswers.map((answer) => ({
            questionId: answer.questionId,
            valueInt: answer.value,
          })),
        },
      },
    });

    await tx.curriculumPilot.update({
      where: {
        id: pilot.id,
      },
      data: {
        status: "pilot_active",
        preAssessmentSeenAt: pilot.preAssessmentSeenAt ?? now,
        preAssessmentCompletedAt: now,
        preAssessmentAverageScore: averageScore,
        assessmentAverageScoreDelta:
          pilot.postAssessmentAverageScore === null
            ? null
            : Number((pilot.postAssessmentAverageScore - averageScore).toFixed(2)),
      },
    });

    return {
      averageScore,
      totalScore,
    };
  });

  return {
    ok: true,
    nextPath: safeNextPath,
    averageScore: result.averageScore,
    totalScore: result.totalScore,
  };
}
