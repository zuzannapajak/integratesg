import { describe, expect, it } from "vitest";
import { normalizePilotSatisfactionInput } from "@/lib/pilot-satisfaction/validation";

const good = {
  scope: "curriculum" as const, locale: "pl", countryCode: "PL" as const,
  contentClarity: 5, practicalRelevance: 4, usability: 3, overallSatisfaction: 5,
};

describe("pilot satisfaction submission validation", () => {
  it("accepts a complete curriculum response without a case study", () => {
    expect(normalizePilotSatisfactionInput({ ...good, strengths: "  Dobre! " })).toMatchObject({
      countryCode: "PL", strengths: "Dobre!", caseStudyId: null,
    });
  });
  it("rejects a non-integer rating and out-of-range values", () => {
    for (const value of [0, 6, 2.5, NaN, Infinity]) {
      expect(() => normalizePilotSatisfactionInput({ ...good, usability: value })).toThrow();
    }
  });
  it("requires a referenced case study for ePortfolio", () => {
    expect(() => normalizePilotSatisfactionInput({ ...good, scope: "eportfolio" })).toThrow();
    expect(normalizePilotSatisfactionInput({ ...good, scope: "eportfolio", caseStudyId: "case-study-id" }).caseStudyId).toBe("case-study-id");
  });
  it("disallows attaching a case study to a curriculum survey", () => {
    expect(() => normalizePilotSatisfactionInput({ ...good, caseStudyId: "abc" })).toThrow();
  });
  it("rejects an unsupported country and oversized or incorrectly typed text", () => {
    expect(() => normalizePilotSatisfactionInput({ ...good, countryCode: "FR" as "PL" })).toThrow();
    expect(() => normalizePilotSatisfactionInput({ ...good, improvements: "x".repeat(2001) })).toThrow();
    expect(() => normalizePilotSatisfactionInput({ ...good, strengths: 42 as unknown as string })).toThrow();
  });
});
