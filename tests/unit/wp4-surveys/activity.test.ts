import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({ prisma: {} }));
vi.mock("@/content/scenarios/pathway", () => ({
  scenarioPathwayDefinitions: [{ id: "scenario-01", slug: "scenario-01" }],
}));
vi.mock("@/lib/scenarios/simulator/resolve-scenario", () => ({
  resolveScenarioBySlug: vi.fn(() => ({ version: 1 })),
}));

import { buildWp4ActivitySnapshot, getWp4ActivitySnapshot } from "@/lib/wp4-surveys/activity";

const when = new Date("2026-11-11T10:00:00Z");

describe("WP4 activity snapshot", () => {
  it("counts distinct completed scenarios once, regardless of attempts", () => {
    const snapshot = buildWp4ActivitySnapshot(
      [],
      [
        { scenarioId: "scenario-01", status: "completed" },
        { scenarioId: "scenario-01", status: "incomplete" },
        { scenarioId: "scenario-01", status: "completed" },
        { scenarioId: "scenario-02", status: "incomplete" },
      ],
    );
    expect(snapshot.scenariosStarted).toBe(2);
    expect(snapshot.scenariosCompleted).toBe(1);
    expect(snapshot.completedScenarioIds).toEqual(["scenario-01"]);
  });
  it("queries only published cases and current scenario versions for the authenticated user", async () => {
    const db = {
      userCaseStudyProgress: { findMany: vi.fn().mockResolvedValue([]) },
      userScenarioAttempt: { findMany: vi.fn().mockResolvedValue([]) },
    };
    const snapshot = await getWp4ActivitySnapshot(
      "actual-user",
      db as unknown as NonNullable<Parameters<typeof getWp4ActivitySnapshot>[1]>,
    );
    expect(snapshot.caseStudiesCompleted).toBe(0);
    expect(db.userCaseStudyProgress.findMany).toHaveBeenCalledWith({
      where: { userId: "actual-user", caseStudy: { status: "published" } },
      select: {
        caseStudyId: true,
        status: true,
        startedAt: true,
        lastOpenedAt: true,
        completedAt: true,
      },
    });
    expect(db.userScenarioAttempt.findMany).toHaveBeenCalledWith({
      where: { userId: "actual-user", OR: [{ scenarioId: "scenario-01", scenarioVersion: 1 }] },
      select: { scenarioId: true, status: true },
    });
  });

  it("distinguishes opened from completed case studies", () => {
    const snapshot = buildWp4ActivitySnapshot(
      [
        {
          caseStudyId: "case-b",
          status: "in_progress",
          startedAt: when,
          lastOpenedAt: when,
          completedAt: null,
        },
        {
          caseStudyId: "case-a",
          status: "completed",
          startedAt: when,
          lastOpenedAt: when,
          completedAt: when,
        },
        {
          caseStudyId: "case-c",
          status: "not_started",
          startedAt: null,
          lastOpenedAt: null,
          completedAt: null,
        },
      ],
      [],
    );
    expect(snapshot.caseStudiesStarted).toBe(2);
    expect(snapshot.caseStudiesCompleted).toBe(1);
    expect(snapshot.startedCaseStudyIds).toEqual(["case-a", "case-b"]);
    expect(snapshot.completedCaseStudyIds).toEqual(["case-a"]);
  });
});
