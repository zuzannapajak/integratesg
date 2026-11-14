import {
  GENERAL_FEEDBACK_MAX_LENGTH,
  GENERAL_FEEDBACK_SURVEY_TYPE,
  validateGeneralFeedback,
} from "@/lib/platform-feedback/general-definition";
import { describe, expect, it } from "vitest";

describe("voluntary general feedback validation", () => {
  const valid = { locale: "en", category: "suggestion", message: "Useful idea" } as const;

  it("uses a dedicated survey type separate from formal pilot evaluations", () => {
    expect(GENERAL_FEEDBACK_SURVEY_TYPE).not.toBe("platform_wp3");
    expect(GENERAL_FEEDBACK_SURVEY_TYPE).not.toBe("platform_wp4");
  });

  it("trims messages while preserving the selected category", () => {
    expect(validateGeneralFeedback({ ...valid, message: "  Useful idea  " })).toEqual(valid);
  });

  it("rejects missing, blank, invalid or excessive feedback", () => {
    expect(() => validateGeneralFeedback(null)).toThrow("INVALID_FEEDBACK");
    expect(() => validateGeneralFeedback({ ...valid, message: "  " })).toThrow("INVALID_MESSAGE");
    expect(() =>
      validateGeneralFeedback({ ...valid, message: "x".repeat(GENERAL_FEEDBACK_MAX_LENGTH + 1) }),
    ).toThrow("INVALID_MESSAGE");
    expect(() => validateGeneralFeedback({ ...valid, category: "unknown" })).toThrow(
      "INVALID_CATEGORY",
    );
  });
});
