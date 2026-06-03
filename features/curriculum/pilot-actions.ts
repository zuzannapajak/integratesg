"use server";

import { getSafeCurriculumNextPath } from "@/lib/curriculum/pilot";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import type { Prisma } from "@prisma/client";

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

type SubmitCurriculumPilotPostAssessmentInput = {
  locale: string;
  nextPath: string;
  answers: Array<{
    questionId: string;
    value?: number;
    valueText?: string;
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

function normalizeOpenText(value: string | undefined) {
  const normalized = value?.trim() ?? "";

  return normalized.length > 0 ? normalized : null;
}

async function getCourseProgressSnapshots(tx: Prisma.TransactionClient, userId: string) {
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

  return {
    startedCourseIds,
    completedCourseIds,
  };
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

    const { startedCourseIds, completedCourseIds } = await getCourseProgressSnapshots(tx, userId);

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

export async function submitCurriculumPilotPostAssessmentAction(
  input: SubmitCurriculumPilotPostAssessmentInput,
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

    const pilot = await tx.curriculumPilot.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
        status: true,
        preAssessmentAverageScore: true,
        preAssessmentCompletedAt: true,
        preAssessmentSkippedAt: true,
        postAssessmentCompletedAt: true,
      },
    });

    if (!pilot) {
      throw new Error("Pilot path has not been started.");
    }

    if (pilot.preAssessmentSkippedAt || pilot.status === "pre_skipped") {
      throw new Error("Post-assessment is not available after skipping pre-assessment.");
    }

    if (!pilot.preAssessmentCompletedAt) {
      throw new Error("Pre-assessment must be completed before post-assessment.");
    }

    if (pilot.postAssessmentCompletedAt || pilot.status === "pilot_completed") {
      throw new Error("Post-assessment has already been submitted.");
    }

    if (pilot.status !== "pilot_active") {
      throw new Error("Post-assessment is not currently available.");
    }

    const { startedCourseIds, completedCourseIds } = await getCourseProgressSnapshots(tx, userId);

    if (completedCourseIds.length < 1) {
      throw new Error("At least one module must be completed before post-assessment.");
    }

    const questions = await tx.curriculumPilotQuestion.findMany({
      where: {
        isActive: true,
        inputType: {
          in: ["likert", "open_text"],
        },
      },
      orderBy: {
        sortOrder: "asc",
      },
      select: {
        id: true,
        inputType: true,
        minValue: true,
        maxValue: true,
        isRequired: true,
        sortOrder: true,
      },
    });

    if (questions.length === 0) {
      throw new Error("Post-assessment questions are not configured.");
    }

    const questionsById = new Map(questions.map((question) => [question.id, question]));
    const inputAnswersByQuestionId = new Map(
      input.answers.map((answer) => [answer.questionId, answer]),
    );

    for (const question of questions) {
      const submittedAnswer = inputAnswersByQuestionId.get(question.id);

      if (!submittedAnswer) {
        throw new Error("All post-assessment questions must be answered.");
      }

      if (question.inputType === "likert" && !Number.isInteger(submittedAnswer.value)) {
        throw new Error("All post-assessment questions must be answered.");
      }

      if (question.inputType === "open_text" && !normalizeOpenText(submittedAnswer.valueText)) {
        throw new Error("All post-assessment questions must be answered.");
      }
    }

    const normalizedAnswers = input.answers
      .map((answer) => {
        const question = questionsById.get(answer.questionId);

        if (!question) {
          throw new Error("Invalid post-assessment question.");
        }

        if (question.inputType === "likert") {
          const value = answer.value;
          const minValue = question.minValue ?? 1;
          const maxValue = question.maxValue ?? 5;

          if (
            typeof value !== "number" ||
            !Number.isInteger(value) ||
            value < minValue ||
            value > maxValue
          ) {
            throw new Error("Invalid post-assessment answer value.");
          }

          return {
            questionId: answer.questionId,
            valueInt: value,
            valueText: null,
            sortOrder: question.sortOrder,
            scoreValue: value,
          };
        }

        const normalizedText = normalizeOpenText(answer.valueText);

        if (!normalizedText && !question.isRequired) {
          return null;
        }

        return {
          questionId: answer.questionId,
          valueInt: null,
          valueText: normalizedText,
          sortOrder: question.sortOrder,
          scoreValue: null,
        };
      })
      .filter((answer): answer is NonNullable<typeof answer> => Boolean(answer));

    normalizedAnswers.sort((a, b) => a.sortOrder - b.sortOrder);

    const scoredAnswers = normalizedAnswers.filter(
      (answer): answer is typeof answer & { scoreValue: number } =>
        typeof answer.scoreValue === "number",
    );

    if (scoredAnswers.length === 0) {
      throw new Error("Post-assessment score answers are required.");
    }

    const totalScore = scoredAnswers.reduce((sum, answer) => sum + answer.scoreValue, 0);
    const averageScore = Number((totalScore / scoredAnswers.length).toFixed(2));
    const averageDelta =
      pilot.preAssessmentAverageScore === null
        ? null
        : Number((averageScore - pilot.preAssessmentAverageScore).toFixed(2));

    await tx.curriculumPilotSubmission.create({
      data: {
        pilotId: pilot.id,
        type: "post",
        submittedAt: now,
        totalScore,
        averageScore,
        answersSnapshot: normalizedAnswers.map((answer) => ({
          questionId: answer.questionId,
          value: answer.valueInt,
          valueText: answer.valueText,
        })),
        modulesStartedBeforeSubmission: startedCourseIds.length,
        modulesCompletedBeforeSubmission: completedCourseIds.length,
        startedCourseIdsSnapshot: startedCourseIds,
        completedCourseIdsSnapshot: completedCourseIds,
        answers: {
          create: normalizedAnswers.map((answer) => ({
            questionId: answer.questionId,
            valueInt: answer.valueInt,
            valueText: answer.valueText,
          })),
        },
      },
    });

    await tx.curriculumPilot.update({
      where: {
        id: pilot.id,
      },
      data: {
        status: "pilot_completed",
        postAssessmentCompletedAt: now,
        postAssessmentAverageScore: averageScore,
        assessmentAverageScoreDelta: averageDelta,
      },
    });

    return {
      averageScore,
      totalScore,
      averageDelta,
    };
  });

  return {
    ok: true,
    nextPath: safeNextPath,
    averageScore: result.averageScore,
    totalScore: result.totalScore,
    averageDelta: result.averageDelta,
  };
}
