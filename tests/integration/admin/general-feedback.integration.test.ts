import { afterAll, describe, expect, it, vi } from "vitest";

const mockAuth = vi.hoisted(() => ({ userId: "" }));
vi.mock("@/lib/auth/require-authenticated-user-id", () => ({
  requireAuthenticatedUserId: () => Promise.resolve(mockAuth.userId),
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { submitGeneralFeedbackAction } from "@/features/platform-feedback/general-actions";
import { getGeneralFeedbackAdminPage } from "@/lib/admin/general-feedback";
import { prisma } from "@/lib/prisma";
import { cleanupDatabaseFixtures, createProfile, unique } from "../database/fixtures";

afterAll(cleanupDatabaseFixtures);

describe("general feedback persistence and admin queries (isolated test DB)", () => {
  it("persists non-pilot feedback for learner and enforces the one-minute limit", async () => {
    const learner = await createProfile("learner");
    mockAuth.userId = learner.id;
    const input = { locale: "en", category: "bug", message: "Integration bug report" } as const;
    expect(await submitGeneralFeedbackAction(input)).toEqual({ ok: true });
    expect(await submitGeneralFeedbackAction(input)).toEqual({ ok: false, reason: "rate_limited" });
    const saved = await prisma.surveySubmission.findFirst({
      where: { userId: learner.id, surveyType: "general_platform_feedback" },
    });
    expect(saved?.answers).toEqual({ category: "bug", message: "Integration bug report" });
    expect(saved?.isPilotAtSubmission).toBe(false);
    expect(saved?.pilotCohortCode).toBeNull();
    await prisma.surveySubmission.updateMany({
      where: { userId: learner.id, surveyType: "general_platform_feedback" },
      data: { submittedAt: new Date(Date.now() - 120_000) },
    });
    expect(await submitGeneralFeedbackAction(input)).toEqual({ ok: true });
    expect(
      await prisma.surveySubmission.count({
        where: { userId: learner.id, surveyType: "general_platform_feedback" },
      }),
    ).toBe(2);
  });

  it("serializes concurrent submissions so a single user cannot bypass the limit", async () => {
    const learner = await createProfile("learner");
    mockAuth.userId = learner.id;
    const input = { locale: "en", category: "suggestion", message: "Concurrent test" } as const;
    const results = await Promise.all([
      submitGeneralFeedbackAction(input),
      submitGeneralFeedbackAction(input),
    ]);
    expect(results.filter((result) => result.ok)).toHaveLength(1);
    expect(results.filter((result) => !result.ok)).toHaveLength(1);
    expect(
      await prisma.surveySubmission.count({
        where: { userId: learner.id, surveyType: "general_platform_feedback" },
      }),
    ).toBe(1);
  });

  it("paginates and filters older reports without exposing profile identifiers", async () => {
    const educator = await createProfile("educator");
    const suffix = unique("feedback-page");
    await prisma.surveySubmission.createMany({
      data: Array.from({ length: 23 }, (_, index) => ({
        userId: educator.id,
        surveyType: "general_platform_feedback",
        surveyVersion: 1,
        roundKey: `${suffix}-${index}`,
        locale: "de",
        countryCode: null,
        roleAtSubmission: "educator" as const,
        isPilotAtSubmission: false,
        answers: {
          category: index < 21 ? "suggestion" : "content",
          message: `Feedback number ${index}`,
        },
        activitySnapshot: {},
        submittedAt: new Date(Date.now() + index * 1_000),
      })),
    });
    const all = await getGeneralFeedbackAdminPage({ category: "all", page: 1 });
    const older = await getGeneralFeedbackAdminPage({ category: "all", page: 2 });
    expect(all.total).toBeGreaterThanOrEqual(23);
    expect(all.rows).toHaveLength(20);
    expect(older.rows.length).toBeGreaterThanOrEqual(3);
    expect(new Set([...all.rows, ...older.rows].map((r) => r.id)).size).toBe(
      20 + older.rows.length,
    );
    const content = await getGeneralFeedbackAdminPage({ category: "content", page: 1 });
    expect(content.rows.some((row) => row.message === "Feedback number 21")).toBe(true);
    expect(content.rows.every((row) => row.category === "content")).toBe(true);
    expect(JSON.stringify(all.rows)).not.toContain(educator.id);
    expect(JSON.stringify(all.rows)).not.toContain(educator.email);
  });
});
