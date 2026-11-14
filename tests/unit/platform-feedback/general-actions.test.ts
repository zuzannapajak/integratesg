import { beforeEach, describe, expect, it, vi } from "vitest";

const auth = vi.hoisted(() => ({ requireAuthenticatedUserId: vi.fn() }));
type CreateSurveyArgs = {
  data: {
    roundKey: string;
    userId: string;
    surveyType: string;
    surveyVersion: number;
    locale: string;
    isPilotAtSubmission: boolean;
    roleAtSubmission: string;
    countryCode: string | null;
    pilotCohortCode: string | null;
    answers: { category: string; message: string };
    activitySnapshot: Record<string, never>;
  };
};

const db = vi.hoisted(() => {
  const findMany = vi.fn<() => Promise<Array<{ submittedAt: Date }>>>();
  const create = vi.fn<(args: CreateSurveyArgs) => Promise<{ id: string }>>();
  type TxMock = { surveySubmission: { findMany: typeof findMany; create: typeof create } };
  const transaction = vi.fn(async (callback: (tx: TxMock) => Promise<unknown>) =>
    callback({ surveySubmission: { findMany, create } }),
  );
  return { findUnique: vi.fn(), findMany, create, transaction };
});
const cache = vi.hoisted(() => ({ revalidatePath: vi.fn() }));

vi.mock("@/lib/auth/require-authenticated-user-id", () => auth);
vi.mock("@/lib/prisma", () => ({
  prisma: {
    profile: { findUnique: db.findUnique },
    $transaction: db.transaction,
  },
}));
vi.mock("next/cache", () => cache);

import { submitGeneralFeedbackAction } from "@/features/platform-feedback/general-actions";
import { feedbackIsRateLimited } from "@/lib/platform-feedback/rate-limit";

const valid = { locale: "en", category: "bug", message: "A broken link" } as const;

beforeEach(() => {
  vi.clearAllMocks();
  auth.requireAuthenticatedUserId.mockResolvedValue("user-123");
  db.findUnique.mockResolvedValue({ role: "learner" });
  db.findMany.mockResolvedValue([]);
  db.create.mockResolvedValue({ id: "saved" });
});

describe("general feedback action and rate limiting", () => {
  it.each(["learner", "educator"])("accepts %s regardless of pilot membership", async (role) => {
    db.findUnique.mockResolvedValue({ role });
    await expect(submitGeneralFeedbackAction(valid)).resolves.toEqual({ ok: true });
    expect(db.findUnique).toHaveBeenCalledWith({
      where: { id: "user-123" },
      select: { role: true },
    });
    expect(db.create).toHaveBeenCalledTimes(1);
    const args = db.create.mock.calls[0][0];
    expect(args.data).toMatchObject({
      userId: "user-123",
      surveyType: "general_platform_feedback",
      surveyVersion: 1,
      locale: "en",
      roleAtSubmission: role,
      isPilotAtSubmission: false,
      countryCode: null,
      pilotCohortCode: null,
      answers: { category: "bug", message: "A broken link" },
      activitySnapshot: {},
    });
    expect(args.data.roundKey).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
    expect(cache.revalidatePath).toHaveBeenCalledWith("/en/admin/feedback");
  });

  it("prevents re-submitting within 60 seconds", async () => {
    db.findMany.mockResolvedValue([{ submittedAt: new Date() }]);
    await expect(submitGeneralFeedbackAction(valid)).resolves.toEqual({
      ok: false,
      reason: "rate_limited",
    });
    expect(db.create).not.toHaveBeenCalled();
    expect(cache.revalidatePath).not.toHaveBeenCalled();
  });

  it("allows a new round after the cooldown", async () => {
    db.findMany.mockResolvedValue([{ submittedAt: new Date(Date.now() - 90_000) }]);
    await expect(submitGeneralFeedbackAction(valid)).resolves.toEqual({ ok: true });
    expect(db.create).toHaveBeenCalledTimes(1);
  });

  it("enforces the hourly cap independently of the cooldown", async () => {
    const now = new Date("2026-11-14T12:00:00Z");
    const earlier = new Date("2026-11-14T11:30:00Z");
    expect(
      feedbackIsRateLimited(
        Array.from({ length: 10 }, () => earlier),
        now,
      ),
    ).toBe(true);
    expect(feedbackIsRateLimited([earlier], now)).toBe(false);
    db.findMany.mockResolvedValue(Array.from({ length: 10 }, () => ({ submittedAt: earlier })));
    await expect(submitGeneralFeedbackAction(valid)).resolves.toEqual({
      ok: false,
      reason: "rate_limited",
    });
    expect(db.create).not.toHaveBeenCalled();
  });

  it("rejects administrators and missing profiles", async () => {
    db.findUnique.mockResolvedValue({ role: "admin" });
    await expect(submitGeneralFeedbackAction(valid)).rejects.toThrow("FORBIDDEN");
    db.findUnique.mockResolvedValue(null);
    await expect(submitGeneralFeedbackAction(valid)).rejects.toThrow("FORBIDDEN");
    expect(db.transaction).not.toHaveBeenCalled();
  });

  it("rejects invalid locale and text without database writes", async () => {
    await expect(submitGeneralFeedbackAction({ ...valid, locale: "xx" })).rejects.toThrow(
      "INVALID_LOCALE",
    );
    await expect(submitGeneralFeedbackAction({ ...valid, message: "   " })).rejects.toThrow(
      "INVALID_MESSAGE",
    );
    expect(db.transaction).not.toHaveBeenCalled();
  });

  it("does not accept identity or pilot attribution from request input", async () => {
    await submitGeneralFeedbackAction(valid);
    const args = db.create.mock.calls[0][0];
    expect(args.data.userId).toBe("user-123");
    expect(args.data.isPilotAtSubmission).toBe(false);
  });
});
