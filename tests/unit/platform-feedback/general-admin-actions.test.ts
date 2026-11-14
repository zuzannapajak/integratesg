import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  requireRole: vi.fn(),
  deleteMany: vi.fn(),
  revalidatePath: vi.fn(),
}));
vi.mock("@/features/auth/requireRole", () => ({ requireRole: mocks.requireRole }));
vi.mock("@/lib/prisma", () => ({ prisma: { surveySubmission: { deleteMany: mocks.deleteMany } } }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
import { deleteGeneralFeedbackAction } from "@/features/platform-feedback/general-admin-actions";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.requireRole.mockResolvedValue(null);
  mocks.deleteMany.mockResolvedValue({ count: 1 });
});
const form = (id: string, locale = "en") => {
  const data = new FormData();
  data.set("id", id);
  data.set("locale", locale);
  return data;
};

describe("general feedback deletion boundaries", () => {
  it("checks administrator access and restricts deletion by survey type", async () => {
    await deleteGeneralFeedbackAction(form("general-report-id"));
    expect(mocks.requireRole).toHaveBeenCalledWith("en", "admin");
    expect(mocks.deleteMany).toHaveBeenCalledWith({
      where: { id: "general-report-id", surveyType: "general_platform_feedback" },
    });
  });

  it("never deletes when authentication fails", async () => {
    mocks.requireRole.mockRejectedValue(new Error("FORBIDDEN"));
    await expect(deleteGeneralFeedbackAction(form("general-report-id"))).rejects.toThrow(
      "FORBIDDEN",
    );
    expect(mocks.deleteMany).not.toHaveBeenCalled();
  });

  it("rejects invalid identifiers before modifying data", async () => {
    await expect(deleteGeneralFeedbackAction(form("x"))).rejects.toThrow("INVALID_FEEDBACK_ID");
    expect(mocks.deleteMany).not.toHaveBeenCalled();
  });
});
