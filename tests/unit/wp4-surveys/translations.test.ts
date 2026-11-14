import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const locales = ["en", "pl", "de", "it", "el", "bg"];
const requiredQuestions = [
  "caseStudies.q1",
  "caseStudies.engagementEase",
  "caseStudies.greenTransitionUnderstanding",
  "caseStudies.esgEcosystemUnderstanding",
  "caseStudies.skills",
  "caseStudies.challenges",
  "caseStudies.improvements",
  "scenarios.incorporationEase",
  "scenarios.participantEngagement",
  "scenarios.skills",
  "scenarios.challenges",
  "scenarios.implementationChallenges",
  "scenarios.improvements",
];

describe("WP4 survey translations", () => {
  it.each(locales)("provides approved questions in %s", (locale) => {
    const messages = JSON.parse(
      readFileSync(resolve("messages/wp4-survey-shells", `${locale}.json`), "utf8"),
    ) as {
      Protected: { Wp4Survey: Record<string, unknown> };
    };
    for (const question of requiredQuestions) {
      const text = question
        .split(".")
        .reduce<unknown>(
          (object, key) =>
            object && typeof object === "object" && key in object
              ? (object as Record<string, unknown>)[key]
              : null,
          messages.Protected.Wp4Survey,
        );
      expect(typeof text, `${locale}: ${question}`).toBe("string");
      expect((text as string).length, `${locale}: ${question}`).toBeGreaterThan(0);
    }
  });
});
