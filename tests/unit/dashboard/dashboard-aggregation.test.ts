import { describe, expect, it } from "vitest";

import {
  buildContinueLearningItem,
  buildGamificationStats,
  buildLearnerSummaryMetrics,
  buildWeeklyActivityChart,
  type DashboardCurriculumAttempt,
  type DashboardEportfolioProgress,
  type DashboardScenarioAttempt,
} from "@/lib/dashboard/aggregation";

const t = (key: string) => key;

function scenarioAttempt(
  overrides: Partial<DashboardScenarioAttempt> = {},
): DashboardScenarioAttempt {
  return {
    scenarioId: "scenario-1",
    scenarioSlug: "scenario-1",
    scenarioTitle: "Scenario 1",
    status: "in_progress",
    score: null,
    startedAt: new Date("2026-09-20T10:00:00.000Z"),
    lastOpenedAt: new Date("2026-09-20T10:00:00.000Z"),
    completedAt: null,
    ...overrides,
  };
}

function curriculumAttempt(
  overrides: Partial<DashboardCurriculumAttempt> = {},
): DashboardCurriculumAttempt {
  return {
    status: "in_progress",
    postQuizScore: null,
    startedAt: new Date("2026-09-20T10:00:00.000Z"),
    lastOpenedAt: new Date("2026-09-20T10:00:00.000Z"),
    completedAt: null,
    course: {
      slug: "course-1",
      translations: [
        {
          language: "en",
          title: "Course 1",
          description: "Course description",
        },
      ],
    },
    ...overrides,
  };
}

function eportfolioProgress(
  overrides: Partial<DashboardEportfolioProgress> = {},
): DashboardEportfolioProgress {
  return {
    status: "in_progress",
    startedAt: new Date("2026-09-20T10:00:00.000Z"),
    lastOpenedAt: new Date("2026-09-20T10:00:00.000Z"),
    completedAt: null,
    caseStudy: {
      slug: "case-1",
      translations: [
        {
          language: "en",
          title: "Case study 1",
          summary: "Case study summary",
        },
      ],
    },
    ...overrides,
  };
}

describe("dashboard aggregation", () => {
  describe("buildWeeklyActivityChart", () => {
    it("returns seven zero-value points for a new user", () => {
      const result = buildWeeklyActivityChart([], "en", new Date("2026-09-25T12:00:00.000Z"));

      expect(result).toHaveLength(7);
      expect(result.every((point) => point.value === 0)).toBe(true);
    });

    it("counts activity on the correct days", () => {
      const result = buildWeeklyActivityChart(
        [
          {
            startedAt: new Date("2026-09-24T10:00:00.000Z"),
          },
          {
            startedAt: new Date("2026-09-24T12:00:00.000Z"),
          },
          {
            startedAt: new Date("2026-09-25T08:00:00.000Z"),
          },
        ],
        "en",
        new Date("2026-09-25T12:00:00.000Z"),
      );

      expect(result.at(-2)?.value).toBe(2);
      expect(result.at(-1)?.value).toBe(1);
    });

    it("ignores attempts without startedAt", () => {
      const result = buildWeeklyActivityChart(
        [{ startedAt: null }],
        "en",
        new Date("2026-09-25T12:00:00.000Z"),
      );

      expect(result).toHaveLength(7);
      expect(result.every((point) => point.value === 0)).toBe(true);
    });
  });

  describe("buildContinueLearningItem", () => {
    it("returns null for a completely new user", () => {
      expect(
        buildContinueLearningItem(
          {
            curriculumAttempts: [],
            scenarioAttempts: [],
            eportfolioProgress: [],
            locale: "en",
          },
          t,
        ),
      ).toBeNull();
    });

    it("returns the most recently opened scenario", () => {
      const result = buildContinueLearningItem(
        {
          curriculumAttempts: [
            curriculumAttempt({
              lastOpenedAt: new Date("2026-09-20T10:00:00.000Z"),
            }),
          ],
          scenarioAttempts: [
            scenarioAttempt({
              scenarioSlug: "recent-scenario",
              scenarioTitle: "Recent scenario",
              lastOpenedAt: new Date("2026-09-21T10:00:00.000Z"),
            }),
          ],
          eportfolioProgress: [],
          locale: "en",
        },
        t,
      );

      expect(result).toEqual({
        title: "Recent scenario",
        description: "fallback.continueScenarioDescription",
        href: "/en/scenarios/recent-scenario/play",
        badge: "fallback.scenarioBadge",
        ctaLabel: "fallback.continueScenario",
        kindLabel: "fallback.lastOpened",
      });
    });

    it("returns the most recently opened ePortfolio case study", () => {
      const result = buildContinueLearningItem(
        {
          curriculumAttempts: [],
          scenarioAttempts: [
            scenarioAttempt({
              lastOpenedAt: new Date("2026-09-20T10:00:00.000Z"),
            }),
          ],
          eportfolioProgress: [
            eportfolioProgress({
              lastOpenedAt: new Date("2026-09-22T10:00:00.000Z"),
            }),
          ],
          locale: "en",
        },
        t,
      );

      expect(result).toEqual({
        title: "Case study 1",
        description: "Case study summary",
        href: "/en/eportfolio/case-1",
        badge: "fallback.eportfolioBadge",
        ctaLabel: "fallback.continueCaseStudy",
        kindLabel: "fallback.lastOpened",
      });
    });

    it("uses the ePortfolio fallback copy when summary is missing", () => {
      const result = buildContinueLearningItem(
        {
          curriculumAttempts: [],
          scenarioAttempts: [],
          eportfolioProgress: [
            eportfolioProgress({
              status: "completed",
              caseStudy: {
                slug: "case-1",
                translations: [
                  {
                    language: "en",
                    title: "Completed case",
                    summary: null,
                  },
                ],
              },
            }),
          ],
          locale: "en",
        },
        t,
      );

      expect(result?.description).toBe("fallback.reviewEportfolioDescription");
      expect(result?.ctaLabel).toBe("fallback.reviewCaseStudy");
      expect(result?.kindLabel).toBe("fallback.lastCompleted");
    });

    it("uses review mode for a completed scenario", () => {
      const result = buildContinueLearningItem(
        {
          curriculumAttempts: [],
          scenarioAttempts: [
            scenarioAttempt({
              scenarioSlug: "completed-scenario",
              scenarioTitle: "Completed scenario",
              status: "completed",
            }),
          ],
          eportfolioProgress: [],
          locale: "en",
        },
        t,
      );

      expect(result?.href).toBe("/en/scenarios/completed-scenario/play?mode=review");
      expect(result?.ctaLabel).toBe("fallback.reviewScenario");
      expect(result?.kindLabel).toBe("fallback.lastCompleted");
    });

    it("falls back to the English curriculum translation", () => {
      const result = buildContinueLearningItem(
        {
          curriculumAttempts: [
            curriculumAttempt({
              course: {
                slug: "course-1",
                translations: [
                  {
                    language: "en",
                    title: "English title",
                    description: "English description",
                  },
                ],
              },
            }),
          ],
          scenarioAttempts: [],
          eportfolioProgress: [],
          locale: "pl",
        },
        t,
      );

      expect(result?.title).toBe("English title");
      expect(result?.description).toBe("English description");
    });
  });

  describe("buildLearnerSummaryMetrics", () => {
    it("returns zero-state metrics for a new learner", () => {
      const result = buildLearnerSummaryMetrics("learner", [], [], [], t);

      expect(result).toEqual([
        {
          label: "metrics.completionRate",
          value: "0%",
        },
        {
          label: "metrics.averageScore",
          value: "0%",
        },
      ]);
    });

    it("calculates partial learner progress", () => {
      const result = buildLearnerSummaryMetrics(
        "learner",
        [],
        [
          {
            status: "completed",
            score: 100,
          },
          {
            status: "in_progress",
            score: 50,
          },
        ],
        [],
        t,
      );

      expect(result).toEqual([
        {
          label: "metrics.completionRate",
          value: "50%",
        },
        {
          label: "metrics.averageScore",
          value: "75%",
        },
      ]);
    });

    it("includes ePortfolio progress in the learner completion rate", () => {
      const result = buildLearnerSummaryMetrics(
        "learner",
        [],
        [],
        [
          {
            status: "completed",
          },
          {
            status: "in_progress",
          },
        ],
        t,
      );

      expect(result[0]).toEqual({
        label: "metrics.completionRate",
        value: "50%",
      });
    });

    it("calculates 100 percent learner completion", () => {
      const result = buildLearnerSummaryMetrics(
        "learner",
        [],
        [
          {
            status: "completed",
            score: 100,
          },
          {
            status: "completed",
            score: 80,
          },
        ],
        [
          {
            status: "completed",
          },
        ],
        t,
      );

      expect(result[0]).toEqual({
        label: "metrics.completionRate",
        value: "100%",
      });
    });

    it("ignores missing scenario scores defensively", () => {
      const result = buildLearnerSummaryMetrics(
        "learner",
        [],
        [
          {
            status: "completed",
            score: null,
          },
        ],
        [],
        t,
      );

      expect(result).toEqual([
        {
          label: "metrics.completionRate",
          value: "100%",
        },
        {
          label: "metrics.averageScore",
          value: "0%",
        },
      ]);
    });

    it("returns zero-state metrics for a new educator", () => {
      const result = buildLearnerSummaryMetrics("educator", [], [], [], t);

      expect(result).toEqual([
        {
          label: "metrics.averagePostQuiz",
          value: "0%",
        },
        {
          label: "metrics.modulesInProgress",
          value: "0",
        },
      ]);
    });

    it("calculates educator quiz average and in-progress modules", () => {
      const result = buildLearnerSummaryMetrics(
        "educator",
        [
          curriculumAttempt({
            status: "in_progress",
            postQuizScore: 80,
          }),
          curriculumAttempt({
            status: "completed",
            postQuizScore: 100,
          }),
          curriculumAttempt({
            status: "failed",
            postQuizScore: null,
          }),
        ],
        [],
        [],
        t,
      );

      expect(result).toEqual([
        {
          label: "metrics.averagePostQuiz",
          value: "90%",
        },
        {
          label: "metrics.modulesInProgress",
          value: "1",
        },
      ]);
    });
  });

  describe("buildGamificationStats", () => {
    it("returns a zero streak for a new learner", () => {
      const result = buildGamificationStats("learner", [], t);

      expect(result).toEqual([
        {
          label: "gamification.learningStreak",
          value: "0",
        },
      ]);
    });

    it("calculates consecutive activity days", () => {
      const result = buildGamificationStats(
        "learner",
        [
          {
            startedAt: new Date("2026-09-23T08:00:00.000Z"),
          },
          {
            startedAt: new Date("2026-09-24T08:00:00.000Z"),
          },
          {
            startedAt: new Date("2026-09-25T08:00:00.000Z"),
          },
        ],
        t,
      );

      expect(result).toEqual([
        {
          label: "gamification.learningStreak",
          value: "3",
        },
      ]);
    });

    it("does not count duplicate activity days twice", () => {
      const result = buildGamificationStats(
        "learner",
        [
          {
            startedAt: new Date("2026-09-24T08:00:00.000Z"),
          },
          {
            startedAt: new Date("2026-09-25T08:00:00.000Z"),
          },
          {
            startedAt: new Date("2026-09-25T12:00:00.000Z"),
          },
        ],
        t,
      );

      expect(result[0]?.value).toBe("2");
    });

    it("prefers completedAt when it is available", () => {
      const result = buildGamificationStats(
        "learner",
        [
          {
            startedAt: new Date("2026-09-20T08:00:00.000Z"),
            completedAt: new Date("2026-09-24T08:00:00.000Z"),
          },
          {
            startedAt: new Date("2026-09-25T08:00:00.000Z"),
          },
        ],
        t,
      );

      expect(result[0]?.value).toBe("2");
    });

    it("ignores attempts without activity dates", () => {
      const result = buildGamificationStats(
        "learner",
        [
          {
            startedAt: null,
            completedAt: null,
          },
        ],
        t,
      );

      expect(result[0]?.value).toBe("0");
    });

    it("returns no gamification stats for admin", () => {
      expect(buildGamificationStats("admin", [], t)).toEqual([]);
    });
  });
});
