import { describe, expect, it, vi } from "vitest";
vi.mock("@/lib/prisma", () => ({ prisma: {} }));
import { generalFeedbackWhere, parseGeneralFeedbackFilters } from "@/lib/admin/general-feedback";

describe("general feedback filters", () => {
  it("validates category and page without allowing arbitrary JSON filter input", () => {
    expect(parseGeneralFeedbackFilters(new URLSearchParams("category=bug&page=2"))).toEqual({
      category: "bug",
      page: 2,
    });
    expect(parseGeneralFeedbackFilters(new URLSearchParams("category=nope&page=-100"))).toEqual({
      category: "all",
      page: 1,
    });
    expect(generalFeedbackWhere("bug")).toEqual({
      surveyType: "general_platform_feedback",
      answers: { path: ["category"], equals: "bug" },
    });
    expect(generalFeedbackWhere("all")).toEqual({ surveyType: "general_platform_feedback" });
  });
});
