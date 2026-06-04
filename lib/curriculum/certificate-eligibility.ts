import { CURRICULUM_MODULE_QUIZ_PASSING_SCORE } from "@/lib/curriculum/quiz-rules";
import type { StoredQuizAttempt } from "@/lib/curriculum/types";

type CertificateAttempt = {
  status?: string | null;
  currentStage?: string | null;
  completedAt?: Date | string | null;
  postQuizAttempts?: unknown;
};

type CertificateQuiz = {
  id: string;
  type: string;
  passingScore?: number | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseStoredQuizAttempts(value: unknown): StoredQuizAttempt[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!isRecord(item)) {
      return [];
    }

    if (
      typeof item.attemptNumber !== "number" ||
      typeof item.score !== "number" ||
      typeof item.correctCount !== "number" ||
      typeof item.totalQuestions !== "number" ||
      typeof item.submittedAt !== "string"
    ) {
      return [];
    }

    return [
      {
        quizId: typeof item.quizId === "string" ? item.quizId : undefined,
        quizType: item.quizType === "pre" || item.quizType === "post" ? item.quizType : undefined,
        quizSortOrder: typeof item.quizSortOrder === "number" ? item.quizSortOrder : undefined,
        passed: typeof item.passed === "boolean" ? item.passed : undefined,
        attemptNumber: item.attemptNumber,
        score: item.score,
        correctCount: item.correctCount,
        totalQuestions: item.totalQuestions,
        submittedAt: item.submittedAt,
        flaggedQuestionIds: Array.isArray(item.flaggedQuestionIds)
          ? item.flaggedQuestionIds.filter((id): id is string => typeof id === "string")
          : [],
      },
    ];
  });
}

export function getPassedCurriculumPostQuizIds(postQuizAttempts: unknown) {
  const passedQuizIds = new Set<string>();

  for (const attempt of parseStoredQuizAttempts(postQuizAttempts)) {
    if (
      attempt.quizType === "post" &&
      attempt.quizId &&
      attempt.passed === true &&
      attempt.score >= CURRICULUM_MODULE_QUIZ_PASSING_SCORE
    ) {
      passedQuizIds.add(attempt.quizId);
    }
  }

  return passedQuizIds;
}

export function getCurriculumModuleCertificateEligibility(params: {
  attempt: CertificateAttempt | null;
  quizzes: CertificateQuiz[];
}) {
  const attempt = params.attempt;

  if (!attempt) {
    return {
      isAvailable: false,
      passedRequiredPostQuizzes: 0,
      requiredPostQuizzes: params.quizzes.filter((quiz) => quiz.type === "post").length,
    };
  }

  const requiredPostQuizIds = params.quizzes
    .filter((quiz) => quiz.type === "post")
    .map((quiz) => quiz.id);

  const passedPostQuizIds = getPassedCurriculumPostQuizIds(attempt.postQuizAttempts);

  const passedRequiredPostQuizzes = requiredPostQuizIds.filter((quizId) =>
    passedPostQuizIds.has(quizId),
  ).length;

  const allRequiredPostQuizzesPassed =
    requiredPostQuizIds.length > 0 &&
    requiredPostQuizIds.every((quizId) => passedPostQuizIds.has(quizId));

  const moduleCompleted =
    attempt.status === "completed" &&
    attempt.currentStage === "completed" &&
    Boolean(attempt.completedAt);

  return {
    isAvailable: moduleCompleted && allRequiredPostQuizzesPassed,
    passedRequiredPostQuizzes,
    requiredPostQuizzes: requiredPostQuizIds.length,
  };
}
