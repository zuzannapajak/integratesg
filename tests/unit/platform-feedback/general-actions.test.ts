import { beforeEach, describe, expect, it, vi } from "vitest";

const auth = vi.hoisted(() => ({ requireAuthenticatedUserId: vi.fn() }));
type CreateSurveyArgs = {
  data: {
    roundKey: string;
    userId: string;
    isPilotAtSubmission: boolean;
  };
};

const db = vi.hoisted(() => ({
  findUnique: vi.fn(),
  create: vi.fn<(args: CreateSurveyArgs) => Promise<{ id: string }>>(),
}));
const cache = vi.hoisted(() => ({ revalidatePath: vi.fn() }));

vi.mock("@/lib/auth/require-authenticated-user-id", () => auth);
vi.mock("@/lib/prisma", () => ({
  prisma: {
    profile: { findUnique: db.findUnique },
    surveySubmission: { create: db.create },
  },
}));
vi.mock("next/cache", () => cache);

import { submitGeneralFeedbackAction } from "@/features/platform-feedback/general-actions";

const valid = { locale: "en", category: "bug", message: "A broken link" } as const;

beforeEach(() => {
  vi.clearAllMocks();
  auth.requireAuthenticatedUserId.mockResolvedValue("user-123");
  db.findUnique.mockResolvedValue({ role: "learner" });
  db.create.mockResolvedValue({ id: "saved" });
});

describe("general feedback action", () => {
  it.each(["learner", "educator"])("allows %s without pilot membership", async (role) => {
    db.findUnique.mockResolvedValue({ role });
    await expect(submitGeneralFeedbackAction(valid)).resolves.toEqual({ ok: true });
    expect(db.findUnique).toHaveBeenCalledWith({
      where: { id: "user-123" },
      select: { role: true },
    });
    expect(db.create).toHaveBeenCalledTimes(1);
    const createArgs = db.create.mock.calls[0][0];
    expect(createArgs).toMatchObject({
      data: {
        userId: "user-123",
        surveyType: "general_platform_feedback",
        roleAtSubmission: role,
        locale: "en",
        isPilotAtSubmission: false,
        pilotCohortCode: null,
        countryCode: null,
        answers: { category: "bug", message: "A broken link" },
        activitySnapshot: {},
      },
    });
    expect(createArgs.data.roundKey).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
  });

  it("allows a new feedback round each time", async () => {
    await submitGeneralFeedbackAction(valid);
    await submitGeneralFeedbackAction(valid);
    const first = db.create.mock.calls[0][0].data.roundKey;
    const second = db.create.mock.calls[1][0].data.roundKey;
    expect(first).not.toBe(second);
  });

  it("rejects administrators and users without a profile", async () => {
    db.findUnique.mockResolvedValue({ role: "admin" });
    await expect(submitGeneralFeedbackAction(valid)).rejects.toThrow("FORBIDDEN");
    db.findUnique.mockResolvedValue(null);
    await expect(submitGeneralFeedbackAction(valid)).rejects.toThrow("FORBIDDEN");
    expect(db.create).not.toHaveBeenCalled();
  });

  it("validates both locale and message before database persistence", async () => {
    await expect(submitGeneralFeedbackAction({ ...valid, locale: "xx" })).rejects.toThrow(
      "INVALID_LOCALE",
    );
    await expect(submitGeneralFeedbackAction({ ...valid, message: "   " })).rejects.toThrow(
      "INVALID_MESSAGE",
    );
    expect(db.create).not.toHaveBeenCalled();
  });

  it("does not trust user identity or pilot flags from the caller", async () => {
    await submitGeneralFeedbackAction(valid);
    const data = db.create.mock.calls[0][0].data;
    expect(data.userId).toBe("user-123");
    expect(data.isPilotAtSubmission).toBe(false);
  });
});
