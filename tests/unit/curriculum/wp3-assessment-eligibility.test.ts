import { describe, expect, it } from "vitest";

import { getWp3PostEligibility } from "@/lib/curriculum/wp3-assessment-eligibility";

const now = new Date("2026-11-10T12:00:00Z");

function assessment(
  overrides: Partial<NonNullable<Parameters<typeof getWp3PostEligibility>[0]>> = {},
) {
  return {
    status: "pilot_active",
    preAssessmentCompletedAt: now,
    preAssessmentSkippedAt: null,
    postAssessmentCompletedAt: null,
    ...overrides,
  };
}

describe("WP3 POST eligibility", () => {
  it("permits the standard PRE -> module -> POST flow", () => {
    expect(getWp3PostEligibility(assessment(), 1)).toEqual({ eligible: true, reason: null });
  });

  it("permits POST after PRE was skipped, without requiring a PRE score", () => {
    expect(
      getWp3PostEligibility(
        assessment({
          status: "pre_skipped",
          preAssessmentCompletedAt: null,
          preAssessmentSkippedAt: now,
        }),
        1,
      ),
    ).toEqual({ eligible: true, reason: null });
  });

  it("requires one completed module regardless of the PRE decision", () => {
    expect(getWp3PostEligibility(assessment(), 0).reason).toBe("no_completed_module");
    expect(
      getWp3PostEligibility(
        assessment({
          status: "pre_skipped",
          preAssessmentCompletedAt: null,
          preAssessmentSkippedAt: now,
        }),
        0,
      ).reason,
    ).toBe("no_completed_module");
  });

  it("rejects missing PRE decision, an already-submitted POST and missing records", () => {
    expect(getWp3PostEligibility(null, 1).reason).toBe("no_pilot");
    expect(getWp3PostEligibility(assessment({ preAssessmentCompletedAt: null }), 1).reason).toBe(
      "pre_missing",
    );
    expect(getWp3PostEligibility(assessment({ postAssessmentCompletedAt: now }), 1).reason).toBe(
      "post_completed",
    );
    expect(getWp3PostEligibility(assessment({ status: "pre_prompt_shown" }), 1).reason).toBe(
      "pilot_not_active",
    );
  });
});
