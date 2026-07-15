import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  findMany: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    userScenarioAttempt: {
      findMany: mocks.findMany,
    },
  },
}));

import { scenarioPathwayDefinitions } from "@/content/scenarios/pathway";
import {
  assertScenarioCanStartForUser,
  buildScenarioPathwayItems,
  getScenarioPathwayItemsForUser,
} from "@/lib/scenarios/simulator/server/scenario-pathway";
import { SCENARIO_IDS } from "@/lib/scenarios/simulator/types";

const currentVersions = new Map(SCENARIO_IDS.map((scenarioId) => [scenarioId, 1]));

function getStatuses(
  attempts: ReadonlyArray<{
    scenarioId: string;
    scenarioVersion: number;
    status: "incomplete" | "completed";
  }>,
) {
  return buildScenarioPathwayItems(scenarioPathwayDefinitions, currentVersions, attempts).map(
    ({ id, status, isRecommended }) => ({ id, status, isRecommended: isRecommended ?? false }),
  );
}

beforeEach(() => {
  mocks.findMany.mockResolvedValue([]);
});

describe("scenario pathway progress", () => {
  it("makes only the first scenario available for a new user", () => {
    expect(getStatuses([])).toEqual([
      { id: "scenario-01", status: "available", isRecommended: true },
      { id: "scenario-02", status: "locked", isRecommended: false },
      { id: "scenario-03", status: "locked", isRecommended: false },
      { id: "scenario-04", status: "locked", isRecommended: false },
      { id: "scenario-05", status: "locked", isRecommended: false },
      { id: "scenario-06", status: "locked", isRecommended: false },
    ]);
  });

  it("shows the active scenario and unlocks nothing beyond it", () => {
    expect(
      getStatuses([
        { scenarioId: "scenario-01", scenarioVersion: 1, status: "completed" },
        { scenarioId: "scenario-02", scenarioVersion: 1, status: "incomplete" },
      ]),
    ).toEqual([
      { id: "scenario-01", status: "completed", isRecommended: false },
      { id: "scenario-02", status: "in_progress", isRecommended: true },
      { id: "scenario-03", status: "locked", isRecommended: false },
      { id: "scenario-04", status: "locked", isRecommended: false },
      { id: "scenario-05", status: "locked", isRecommended: false },
      { id: "scenario-06", status: "locked", isRecommended: false },
    ]);
  });

  it("unlocks the next scenario only after every preceding scenario is completed", () => {
    expect(
      getStatuses([
        { scenarioId: "scenario-01", scenarioVersion: 1, status: "completed" },
        { scenarioId: "scenario-02", scenarioVersion: 1, status: "completed" },
        { scenarioId: "scenario-03", scenarioVersion: 1, status: "completed" },
      ]),
    ).toEqual([
      { id: "scenario-01", status: "completed", isRecommended: false },
      { id: "scenario-02", status: "completed", isRecommended: false },
      { id: "scenario-03", status: "completed", isRecommended: false },
      { id: "scenario-04", status: "available", isRecommended: true },
      { id: "scenario-05", status: "locked", isRecommended: false },
      { id: "scenario-06", status: "locked", isRecommended: false },
    ]);
  });

  it("keeps an already active later scenario accessible without unlocking subsequent scenarios", () => {
    expect(
      getStatuses([{ scenarioId: "scenario-03", scenarioVersion: 1, status: "incomplete" }]),
    ).toEqual([
      { id: "scenario-01", status: "available", isRecommended: true },
      { id: "scenario-02", status: "locked", isRecommended: false },
      { id: "scenario-03", status: "in_progress", isRecommended: false },
      { id: "scenario-04", status: "locked", isRecommended: false },
      { id: "scenario-05", status: "locked", isRecommended: false },
      { id: "scenario-06", status: "locked", isRecommended: false },
    ]);
  });

  it("ignores attempts from an obsolete scenario version", () => {
    expect(
      getStatuses([{ scenarioId: "scenario-01", scenarioVersion: 0, status: "completed" }]),
    ).toEqual([
      { id: "scenario-01", status: "available", isRecommended: true },
      { id: "scenario-02", status: "locked", isRecommended: false },
      { id: "scenario-03", status: "locked", isRecommended: false },
      { id: "scenario-04", status: "locked", isRecommended: false },
      { id: "scenario-05", status: "locked", isRecommended: false },
      { id: "scenario-06", status: "locked", isRecommended: false },
    ]);
  });

  it("does not recommend another scenario after the whole pathway is completed", () => {
    const attempts = SCENARIO_IDS.map((scenarioId) => ({
      scenarioId,
      scenarioVersion: 1,
      status: "completed" as const,
    }));

    expect(getStatuses(attempts)).toEqual(
      SCENARIO_IDS.map((id) => ({ id, status: "completed", isRecommended: false })),
    );
  });

  it("loads only attempts for current scenario versions", async () => {
    mocks.findMany.mockResolvedValue([
      { scenarioId: "scenario-01", scenarioVersion: 1, status: "completed" },
    ]);

    const items = await getScenarioPathwayItemsForUser("user-01");

    expect(mocks.findMany).toHaveBeenCalledWith({
      where: {
        userId: "user-01",
        OR: SCENARIO_IDS.map((scenarioId) => ({
          scenarioId,
          scenarioVersion: 1,
        })),
      },
      select: {
        scenarioId: true,
        scenarioVersion: true,
        status: true,
      },
    });

    expect(items[0]?.status).toBe("completed");
    expect(items[1]?.status).toBe("available");
  });

  it("rejects starting a locked scenario on the server", async () => {
    await expect(assertScenarioCanStartForUser("user-01", "scenario-02")).rejects.toThrow(
      "Scenario is locked.",
    );

    await expect(assertScenarioCanStartForUser("user-01", "scenario-01")).resolves.toBeUndefined();
  });
});
