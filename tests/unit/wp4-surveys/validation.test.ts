import { describe, expect, it } from "vitest";
import { normalizeWp4SurveyInput } from "@/lib/wp4-surveys/validation";

const caseStudy = {
  scope: "case-studies",
  locale: "el",
  engagementEase: 4,
  greenTransitionUnderstanding: 5,
  esgEcosystemUnderstanding: 3,
  skills: ["systems_thinking", "data_literacy"],
  challenges: "None",
  improvements: "No changes needed",
};
const scenario = {
  scope: "scenarios",
  locale: "bg",
  incorporationEase: 3,
  participantEngagement: 4,
  skills: ["decision_making"],
  challenges: "None",
  implementationChallenges: "None",
  improvements: "None",
};

describe("WP4 approved questionnaire input", () => {
  it("accepts Case Studies (three ratings, multi-select, two required texts)", () => {
    expect(normalizeWp4SurveyInput(caseStudy)).toMatchObject(caseStudy);
  });
  it("accepts Scenarios (two ratings, multi-select, three required texts)", () => {
    expect(normalizeWp4SurveyInput(scenario)).toMatchObject(scenario);
  });
  it("rejects missing fields, invalid ratings, skills, duplicates and injected metrics", () => {
    for (const payload of [
      { ...caseStudy, engagementEase: 0 },
      { ...caseStudy, greenTransitionUnderstanding: 6 },
      { ...caseStudy, skills: [] },
      { ...caseStudy, skills: ["data_literacy", "data_literacy"] },
      { ...caseStudy, skills: ["other"] },
      { ...caseStudy, challenges: "   " },
      { ...caseStudy, countryCode: "US" },
      { ...caseStudy, caseStudiesCompleted: 999 },
      { ...scenario, implementationChallenges: "" },
      { ...scenario, locale: "fr" },
      { ...scenario, incorporationEase: "5" },
    ]) {
      expect(() => normalizeWp4SurveyInput(payload)).toThrow("INVALID_WP4_SURVEY");
    }
  });
  it("trims whitespace and enforces free-text bounds", () => {
    expect(normalizeWp4SurveyInput({ ...caseStudy, challenges: " None  " }).challenges).toBe(
      "None",
    );
    expect(() =>
      normalizeWp4SurveyInput({ ...scenario, improvements: "x".repeat(2001) }),
    ).toThrow();
  });
});
