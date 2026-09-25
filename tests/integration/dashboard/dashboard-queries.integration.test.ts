import { afterAll, describe, expect, it } from "vitest";

import { buildLearnerSummaryMetrics } from "@/lib/dashboard/aggregation";
import { getDashboardLearningSnapshot } from "@/lib/dashboard/queries";
import { prisma } from "@/lib/prisma";
import {
  cleanupDatabaseFixtures,
  createCaseStudy,
  createCourse,
  createProfile,
  unique,
} from "../database/fixtures";

const t = (key: string) => key;

function learnerMetrics(snapshot: Awaited<ReturnType<typeof getDashboardLearningSnapshot>>) {
  return buildLearnerSummaryMetrics(
    "learner",
    [],
    snapshot.scenarioAttempts.map((attempt) => ({
      status: attempt.status,
      score: null,
    })),
    snapshot.eportfolioProgress,
    t,
  );
}

function completionRate(snapshot: Awaited<ReturnType<typeof getDashboardLearningSnapshot>>) {
  return learnerMetrics(snapshot).find((metric) => metric.label === "metrics.completionRate")
    ?.value;
}

describe("dashboard learning queries", () => {
  afterAll(async () => {
    await cleanupDatabaseFixtures();
  });

  it("returns an empty learning snapshot for a new learner", async () => {
    const learner = await createProfile("learner");

    const snapshot = await getDashboardLearningSnapshot({
      userId: learner.id,
      role: "learner",
      locale: "en",
    });

    expect(snapshot.curriculumAttempts).toEqual([]);
    expect(snapshot.scenarioAttempts).toEqual([]);
    expect(snapshot.eportfolioProgress).toEqual([]);
    expect(snapshot.publishedCoursesCount).toBe(0);
  });

  it("returns only the requested user's curriculum, scenario and ePortfolio records", async () => {
    const userA = await createProfile("educator");
    const userB = await createProfile("educator");
    const course = await createCourse(unique("dashboard-course"));
    const caseStudy = await createCaseStudy(unique("dashboard-case"));
    const scenarioId = unique("dashboard-scenario");

    await Promise.all([
      prisma.userCourseAttempt.create({
        data: {
          userId: userA.id,
          courseId: course.id,
          status: "in_progress",
          progressPercent: 50,
          postQuizScore: 80,
          startedAt: new Date("2026-09-23T08:00:00.000Z"),
          lastOpenedAt: new Date("2026-09-23T09:00:00.000Z"),
        },
      }),
      prisma.userCourseAttempt.create({
        data: {
          userId: userB.id,
          courseId: course.id,
          status: "completed",
          progressPercent: 100,
          postQuizScore: 100,
          startedAt: new Date("2026-09-22T08:00:00.000Z"),
          lastOpenedAt: new Date("2026-09-22T09:00:00.000Z"),
          completedAt: new Date("2026-09-22T10:00:00.000Z"),
        },
      }),
      prisma.userScenarioAttempt.create({
        data: {
          userId: userA.id,
          scenarioId,
          scenarioVersion: 1,
          locale: "en",
          attemptNumber: 1,
          status: "incomplete",
          startedAt: new Date("2026-09-24T08:00:00.000Z"),
          lastOpenedAt: new Date("2026-09-24T09:00:00.000Z"),
        },
      }),
      prisma.userScenarioAttempt.create({
        data: {
          userId: userB.id,
          scenarioId,
          scenarioVersion: 1,
          locale: "en",
          attemptNumber: 1,
          status: "completed",
          startedAt: new Date("2026-09-21T08:00:00.000Z"),
          lastOpenedAt: new Date("2026-09-21T09:00:00.000Z"),
          completedAt: new Date("2026-09-21T10:00:00.000Z"),
        },
      }),
      prisma.userCaseStudyProgress.create({
        data: {
          userId: userA.id,
          caseStudyId: caseStudy.id,
          status: "in_progress",
          startedAt: new Date("2026-09-25T08:00:00.000Z"),
          lastOpenedAt: new Date("2026-09-25T09:00:00.000Z"),
        },
      }),
      prisma.userCaseStudyProgress.create({
        data: {
          userId: userB.id,
          caseStudyId: caseStudy.id,
          status: "completed",
          startedAt: new Date("2026-09-20T08:00:00.000Z"),
          lastOpenedAt: new Date("2026-09-20T09:00:00.000Z"),
          completedAt: new Date("2026-09-20T10:00:00.000Z"),
        },
      }),
    ]);

    const [snapshotA, snapshotB] = await Promise.all([
      getDashboardLearningSnapshot({
        userId: userA.id,
        role: "educator",
        locale: "en",
      }),
      getDashboardLearningSnapshot({
        userId: userB.id,
        role: "educator",
        locale: "en",
      }),
    ]);

    expect(snapshotA.curriculumAttempts).toHaveLength(1);
    expect(snapshotA.scenarioAttempts).toHaveLength(1);
    expect(snapshotA.eportfolioProgress).toHaveLength(1);
    expect(snapshotA.curriculumAttempts[0]?.userId).toBe(userA.id);
    expect(snapshotA.scenarioAttempts[0]?.userId).toBe(userA.id);
    expect(snapshotA.eportfolioProgress[0]?.userId).toBe(userA.id);

    expect(snapshotB.curriculumAttempts).toHaveLength(1);
    expect(snapshotB.scenarioAttempts).toHaveLength(1);
    expect(snapshotB.eportfolioProgress).toHaveLength(1);
    expect(snapshotB.curriculumAttempts[0]?.userId).toBe(userB.id);
    expect(snapshotB.scenarioAttempts[0]?.userId).toBe(userB.id);
    expect(snapshotB.eportfolioProgress[0]?.userId).toBe(userB.id);
  });

  it("produces 0, partial and 100 percent learner completion from real database state", async () => {
    const learner = await createProfile("learner");
    const caseStudyA = await createCaseStudy(unique("dashboard-progress-case-a"));
    const caseStudyB = await createCaseStudy(unique("dashboard-progress-case-b"));
    const scenarioA = unique("dashboard-progress-scenario-a");
    const scenarioB = unique("dashboard-progress-scenario-b");

    const [scenarioAttemptA, scenarioAttemptB, caseProgressA, caseProgressB] = await Promise.all([
      prisma.userScenarioAttempt.create({
        data: {
          userId: learner.id,
          scenarioId: scenarioA,
          scenarioVersion: 1,
          locale: "en",
          attemptNumber: 1,
          status: "incomplete",
        },
      }),
      prisma.userScenarioAttempt.create({
        data: {
          userId: learner.id,
          scenarioId: scenarioB,
          scenarioVersion: 1,
          locale: "en",
          attemptNumber: 1,
          status: "incomplete",
        },
      }),
      prisma.userCaseStudyProgress.create({
        data: {
          userId: learner.id,
          caseStudyId: caseStudyA.id,
          status: "in_progress",
          startedAt: new Date("2026-09-23T08:00:00.000Z"),
          lastOpenedAt: new Date("2026-09-23T08:00:00.000Z"),
        },
      }),
      prisma.userCaseStudyProgress.create({
        data: {
          userId: learner.id,
          caseStudyId: caseStudyB.id,
          status: "in_progress",
          startedAt: new Date("2026-09-24T08:00:00.000Z"),
          lastOpenedAt: new Date("2026-09-24T08:00:00.000Z"),
        },
      }),
    ]);

    const zeroSnapshot = await getDashboardLearningSnapshot({
      userId: learner.id,
      role: "learner",
      locale: "en",
    });

    expect(completionRate(zeroSnapshot)).toBe("0%");

    await Promise.all([
      prisma.userScenarioAttempt.update({
        where: {
          id: scenarioAttemptA.id,
        },
        data: {
          status: "completed",
          completedAt: new Date("2026-09-25T08:00:00.000Z"),
        },
      }),
      prisma.userCaseStudyProgress.update({
        where: {
          id: caseProgressA.id,
        },
        data: {
          status: "completed",
          completedAt: new Date("2026-09-25T08:00:00.000Z"),
        },
      }),
    ]);

    const partialSnapshot = await getDashboardLearningSnapshot({
      userId: learner.id,
      role: "learner",
      locale: "en",
    });

    expect(completionRate(partialSnapshot)).toBe("50%");

    await Promise.all([
      prisma.userScenarioAttempt.update({
        where: {
          id: scenarioAttemptB.id,
        },
        data: {
          status: "completed",
          completedAt: new Date("2026-09-25T09:00:00.000Z"),
        },
      }),
      prisma.userCaseStudyProgress.update({
        where: {
          id: caseProgressB.id,
        },
        data: {
          status: "completed",
          completedAt: new Date("2026-09-25T09:00:00.000Z"),
        },
      }),
    ]);

    const completeSnapshot = await getDashboardLearningSnapshot({
      userId: learner.id,
      role: "learner",
      locale: "en",
    });

    expect(completionRate(completeSnapshot)).toBe("100%");
  });

  it("reflects ePortfolio activity on the next dashboard query", async () => {
    const learner = await createProfile("learner");
    const caseStudy = await createCaseStudy(unique("dashboard-update-case"));

    const beforeActivity = await getDashboardLearningSnapshot({
      userId: learner.id,
      role: "learner",
      locale: "en",
    });

    expect(beforeActivity.eportfolioProgress).toEqual([]);

    const progress = await prisma.userCaseStudyProgress.create({
      data: {
        userId: learner.id,
        caseStudyId: caseStudy.id,
        status: "in_progress",
        startedAt: new Date("2026-09-25T10:00:00.000Z"),
        lastOpenedAt: new Date("2026-09-25T10:00:00.000Z"),
      },
    });

    const afterOpen = await getDashboardLearningSnapshot({
      userId: learner.id,
      role: "learner",
      locale: "en",
    });

    expect(afterOpen.eportfolioProgress).toHaveLength(1);
    expect(afterOpen.eportfolioProgress[0]?.status).toBe("in_progress");
    expect(afterOpen.eportfolioProgress[0]?.caseStudy.slug).toBe(caseStudy.slug);

    await prisma.userCaseStudyProgress.update({
      where: {
        id: progress.id,
      },
      data: {
        status: "completed",
        lastOpenedAt: new Date("2026-09-25T11:00:00.000Z"),
        completedAt: new Date("2026-09-25T11:00:00.000Z"),
      },
    });

    const afterCompletion = await getDashboardLearningSnapshot({
      userId: learner.id,
      role: "learner",
      locale: "en",
    });

    expect(afterCompletion.eportfolioProgress[0]?.status).toBe("completed");
    expect(afterCompletion.eportfolioProgress[0]?.completedAt).toEqual(
      new Date("2026-09-25T11:00:00.000Z"),
    );
  });
});
