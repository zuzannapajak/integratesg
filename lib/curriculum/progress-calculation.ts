type CalculateCurriculumProgressInput = {
  totalLessons: number;
  completedLessons: number;
  totalPostQuizzes: number;
  completedPostQuizzes: number;
  hasPreQuiz: boolean;
  hasFinishedPreQuiz: boolean;
};

function clampCompleted(value: number, total: number) {
  return Math.min(Math.max(value, 0), Math.max(total, 0));
}

export function calculateCurriculumProgress({
  totalLessons,
  completedLessons,
  totalPostQuizzes,
  completedPostQuizzes,
  hasPreQuiz,
  hasFinishedPreQuiz,
}: CalculateCurriculumProgressInput) {
  const normalizedTotalLessons = Math.max(totalLessons, 0);
  const normalizedTotalPostQuizzes = Math.max(totalPostQuizzes, 0);
  const totalCheckpoints =
    normalizedTotalLessons + normalizedTotalPostQuizzes + (hasPreQuiz ? 1 : 0);

  if (totalCheckpoints === 0) {
    return 0;
  }

  const completedCheckpoints =
    clampCompleted(completedLessons, normalizedTotalLessons) +
    clampCompleted(completedPostQuizzes, normalizedTotalPostQuizzes) +
    (hasPreQuiz && hasFinishedPreQuiz ? 1 : 0);

  return Math.min(100, Math.round((completedCheckpoints / totalCheckpoints) * 100));
}
