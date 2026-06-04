import { prisma } from "@/lib/prisma";

type PilotSubmissionType = "pre" | "post";

export type CurriculumPilotQuestionStat = {
  questionId: string;
  key: string;
  prompt: string;
  preAverage: number | null;
  postAverage: number | null;
  delta: number | null;
  preAnswers: number;
  postAnswers: number;
};

export type CurriculumPilotUserRow = {
  userId: string;
  learnerName: string;
  learnerEmail: string;
  status: string;
  preCompletedAt: string | null;
  postCompletedAt: string | null;
  preAverage: number | null;
  postAverage: number | null;
  delta: number | null;
  modulesBeforePost: number | null;
};

export type CurriculumPilotAdminStats = {
  generatedAt: string;
  summary: {
    startedPilotPath: number;
    preCompleted: number;
    postCompleted: number;
    preSkipped: number;
    averagePreScore: number | null;
    averagePostScore: number | null;
    averageDelta: number | null;
    averageModulesBeforePost: number | null;
  };
  questionStats: CurriculumPilotQuestionStat[];
  userRows: CurriculumPilotUserRow[];
};

function average(values: number[]) {
  if (values.length === 0) return null;
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2));
}

function formatDate(value: Date | null) {
  if (!value) return null;
  return value.toISOString();
}

function pickPrompt(
  translations: Array<{ language: string; prompt: string }>,
  locale: string,
  fallback: string,
) {
  return (
    translations.find((translation) => translation.language === locale)?.prompt ??
    translations.find((translation) => translation.language === "en")?.prompt ??
    translations.at(0)?.prompt ??
    fallback
  );
}

function getLearnerName(user: { fullName: string | null; email: string }) {
  if (user.fullName?.trim()) return user.fullName.trim();
  return user.email;
}

export async function getCurriculumPilotAdminStats(
  locale: string,
): Promise<CurriculumPilotAdminStats> {
  const [pilots, questions] = await Promise.all([
    prisma.curriculumPilot.findMany({
      orderBy: [{ updatedAt: "desc" }],
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        submissions: {
          include: {
            answers: {
              include: {
                question: {
                  select: {
                    id: true,
                    key: true,
                    sortOrder: true,
                  },
                },
              },
            },
          },
        },
      },
    }),
    prisma.curriculumPilotQuestion.findMany({
      where: {
        isActive: true,
        inputType: "likert",
      },
      orderBy: {
        sortOrder: "asc",
      },
      include: {
        translations: {
          where: {
            language: {
              in: [locale, "en"],
            },
          },
        },
      },
    }),
  ]);

  const postSubmissions = pilots
    .flatMap((pilot) => pilot.submissions)
    .filter((submission) => submission.type === "post");

  const preScores = pilots
    .map((pilot) => pilot.preAssessmentAverageScore)
    .filter((value): value is number => typeof value === "number");

  const postScores = pilots
    .map((pilot) => pilot.postAssessmentAverageScore)
    .filter((value): value is number => typeof value === "number");

  const deltas = pilots
    .map((pilot) => pilot.assessmentAverageScoreDelta)
    .filter((value): value is number => typeof value === "number");

  const modulesBeforePost = postSubmissions.map(
    (submission) => submission.modulesCompletedBeforeSubmission,
  );

  function getQuestionAverage(questionId: string, type: PilotSubmissionType) {
    const values = pilots.flatMap((pilot) =>
      pilot.submissions
        .filter((submission) => submission.type === type)
        .flatMap((submission) =>
          submission.answers
            .filter((answer) => answer.questionId === questionId)
            .map((answer) => answer.valueInt)
            .filter((value): value is number => typeof value === "number"),
        ),
    );

    return {
      average: average(values),
      count: values.length,
    };
  }

  const questionStats = questions.map((question) => {
    const pre = getQuestionAverage(question.id, "pre");
    const post = getQuestionAverage(question.id, "post");

    return {
      questionId: question.id,
      key: question.key,
      prompt: pickPrompt(question.translations, locale, question.key),
      preAverage: pre.average,
      postAverage: post.average,
      delta:
        pre.average !== null && post.average !== null
          ? Number((post.average - pre.average).toFixed(2))
          : null,
      preAnswers: pre.count,
      postAnswers: post.count,
    };
  });

  const userRows = pilots.map((pilot) => {
    const postSubmission = pilot.submissions.find((submission) => submission.type === "post");

    return {
      userId: pilot.userId,
      learnerName: getLearnerName(pilot.user),
      learnerEmail: pilot.user.email,
      status: pilot.status,
      preCompletedAt: formatDate(pilot.preAssessmentCompletedAt),
      postCompletedAt: formatDate(pilot.postAssessmentCompletedAt),
      preAverage: pilot.preAssessmentAverageScore,
      postAverage: pilot.postAssessmentAverageScore,
      delta: pilot.assessmentAverageScoreDelta,
      modulesBeforePost: postSubmission?.modulesCompletedBeforeSubmission ?? null,
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      startedPilotPath: pilots.length,
      preCompleted: pilots.filter((pilot) => pilot.preAssessmentCompletedAt).length,
      postCompleted: pilots.filter((pilot) => pilot.postAssessmentCompletedAt).length,
      preSkipped: pilots.filter((pilot) => pilot.preAssessmentSkippedAt).length,
      averagePreScore: average(preScores),
      averagePostScore: average(postScores),
      averageDelta: average(deltas),
      averageModulesBeforePost: average(modulesBeforePost),
    },
    questionStats,
    userRows,
  };
}
