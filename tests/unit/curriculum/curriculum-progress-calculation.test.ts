import { describe, expect, it } from "vitest";

import { calculateCurriculumProgress } from "@/lib/curriculum/progress-calculation";

describe("calculateCurriculumProgress", () => {
  it("returns 0 for curriculum without lessons or quizzes", () => {
    expect(
      calculateCurriculumProgress({
        totalLessons: 0,
        completedLessons: 0,
        totalPostQuizzes: 0,
        completedPostQuizzes: 0,
        hasPreQuiz: false,
        hasFinishedPreQuiz: false,
      }),
    ).toBe(0);
  });

  it("calculates an intermediate value from the actual number of checkpoints", () => {
    expect(
      calculateCurriculumProgress({
        totalLessons: 2,
        completedLessons: 1,
        totalPostQuizzes: 0,
        completedPostQuizzes: 0,
        hasPreQuiz: false,
        hasFinishedPreQuiz: false,
      }),
    ).toBe(50);

    expect(
      calculateCurriculumProgress({
        totalLessons: 1,
        completedLessons: 1,
        totalPostQuizzes: 1,
        completedPostQuizzes: 0,
        hasPreQuiz: true,
        hasFinishedPreQuiz: true,
      }),
    ).toBe(67);
  });

  it("caps completed checkpoints and returns 100 at completion", () => {
    expect(
      calculateCurriculumProgress({
        totalLessons: 2,
        completedLessons: 99,
        totalPostQuizzes: 2,
        completedPostQuizzes: 99,
        hasPreQuiz: true,
        hasFinishedPreQuiz: true,
      }),
    ).toBe(100);
  });
});
