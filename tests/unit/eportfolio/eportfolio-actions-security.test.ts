import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuthenticatedUserId: vi.fn(),
  touchProgress: vi.fn(),
  completeProgress: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/auth/require-authenticated-user-id", () => ({
  requireAuthenticatedUserId: mocks.requireAuthenticatedUserId,
}));

vi.mock("@/lib/eportfolio/progress", () => ({
  touchEportfolioProgress: mocks.touchProgress,
  completeEportfolioProgress: mocks.completeProgress,
}));

vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
}));

import {
  completeCaseStudyAction,
  markCaseStudyCompletedAction,
  touchCaseStudyProgressAction,
} from "@/features/eportfolio/actions";

const progressResult = {
  id: "progress-1",
  caseStudyId: "case-barilla",
  status: "in_progress" as const,
  startedAt: new Date("2026-09-22T08:00:00.000Z"),
  lastOpenedAt: new Date("2026-09-22T08:00:00.000Z"),
  completedAt: null,
  createdAt: new Date("2026-09-22T08:00:00.000Z"),
};

describe("ePortfolio Server Actions security", () => {
  beforeEach(() => {
    for (const mock of Object.values(mocks)) {
      mock.mockReset();
    }

    mocks.requireAuthenticatedUserId.mockResolvedValue("session-user");
    mocks.touchProgress.mockResolvedValue(progressResult);
    mocks.completeProgress.mockResolvedValue({
      ...progressResult,
      status: "completed",
      completedAt: new Date("2026-09-22T09:00:00.000Z"),
    });
  });

  it("derives userId from the authenticated session when opening a case", async () => {
    await touchCaseStudyProgressAction({
      slug: "barilla",
      locale: "en",
      userId: "attacker-controlled-id",
    } as never);

    expect(mocks.requireAuthenticatedUserId).toHaveBeenCalledTimes(1);
    expect(mocks.touchProgress).toHaveBeenCalledWith({
      userId: "session-user",
      slug: "barilla",
    });
  });

  it("derives userId from the authenticated session when completing a case", async () => {
    await completeCaseStudyAction({
      slug: "barilla",
      locale: "en",
      userId: "attacker-controlled-id",
    } as never);

    expect(mocks.completeProgress).toHaveBeenCalledWith({
      userId: "session-user",
      slug: "barilla",
    });
  });

  it("keeps the legacy completion action session-bound", async () => {
    await markCaseStudyCompletedAction({
      slug: "barilla",
      locale: "en",
    });

    expect(mocks.completeProgress).toHaveBeenCalledWith({
      userId: "session-user",
      slug: "barilla",
    });
  });

  it("does not mutate progress when authentication fails", async () => {
    mocks.requireAuthenticatedUserId.mockRejectedValue(new Error("Unauthorized"));

    await expect(
      completeCaseStudyAction({
        slug: "barilla",
        locale: "en",
      }),
    ).rejects.toThrow("Unauthorized");

    expect(mocks.completeProgress).not.toHaveBeenCalled();
  });

  it("rejects malformed slug and locale before mutating progress", async () => {
    await expect(
      completeCaseStudyAction({
        slug: "../draft-case",
        locale: "en",
      }),
    ).rejects.toThrow("Invalid case study slug.");

    await expect(
      touchCaseStudyProgressAction({
        slug: "barilla",
        locale: "../../pl",
      }),
    ).rejects.toThrow("Invalid locale.");

    expect(mocks.touchProgress).not.toHaveBeenCalled();
    expect(mocks.completeProgress).not.toHaveBeenCalled();
  });
});
