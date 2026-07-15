import { scenario02Data } from "@/content/scenarios/scenario-02";
import {
  assertScenarioTranslationComplete,
  formatScenarioTranslationCompletenessReport,
  validateScenarioTranslationCompleteness,
} from "@/lib/scenarios/simulator/translation-completeness";
import { describe, expect, it } from "vitest";

import { scenario01FixtureIds, validScenario01Data } from "./fixtures/scenario-01-data.fixture";

describe("scenario translation completeness", () => {
  it("accepts complete question, answer and feedback content", () => {
    const report = validateScenarioTranslationCompleteness(
      validScenario01Data.definition,
      "en",
      validScenario01Data.locales.en,
    );

    expect(report.isComplete).toBe(true);
    expect(report.issues).toEqual([]);

    expect(report.counts).toEqual({
      questions: {
        required: 3,
        missing: 0,
      },

      answers: {
        required: 9,
        missing: 0,
      },

      feedbacks: {
        required: 9,
        missing: 0,
      },
    });
  });

  it("reports a missing question, answer and feedback with exact paths", () => {
    const { challenge01Id, challenge01Choice01Id } = scenario01FixtureIds;

    const originalChallenge = validScenario01Data.locales.en.challenges[challenge01Id];

    const originalChoice = originalChallenge.choices[challenge01Choice01Id];

    const incompleteLocale = {
      ...validScenario01Data.locales.en,
      locale: "pl",

      challenges: {
        ...validScenario01Data.locales.en.challenges,

        [challenge01Id]: {
          ...originalChallenge,
          question: "   ",

          choices: {
            ...originalChallenge.choices,

            [challenge01Choice01Id]: {
              ...originalChoice,
              text: "",

              feedback: {
                ...originalChoice.feedback,
                body: "   ",
              },
            },
          },
        },
      },
    };

    const report = validateScenarioTranslationCompleteness(
      validScenario01Data.definition,
      "pl",
      incompleteLocale,
    );

    expect(report.isComplete).toBe(false);

    expect(report.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "question",
          path: `challenges.${challenge01Id}.question`,
        }),

        expect.objectContaining({
          field: "answer",
          choiceId: challenge01Choice01Id,
          path: `challenges.${challenge01Id}.choices.` + `${challenge01Choice01Id}.text`,
        }),

        expect.objectContaining({
          field: "feedback",
          choiceId: challenge01Choice01Id,
          path: `challenges.${challenge01Id}.choices.` + `${challenge01Choice01Id}.feedback.body`,
        }),
      ]),
    );

    expect(report.counts.questions.missing).toBe(1);
    expect(report.counts.answers.missing).toBe(1);
    expect(report.counts.feedbacks.missing).toBe(1);
  });

  it("reports all required content when a challenge translation is missing", () => {
    const { challenge02Id } = scenario01FixtureIds;

    const remainingChallenges = Object.fromEntries(
      Object.entries(validScenario01Data.locales.en.challenges).filter(
        ([challengeId]) => challengeId !== challenge02Id,
      ),
    );

    const report = validateScenarioTranslationCompleteness(validScenario01Data.definition, "de", {
      ...validScenario01Data.locales.en,
      locale: "de",
      challenges: remainingChallenges,
    });

    expect(report.counts.questions.missing).toBe(1);
    expect(report.counts.answers.missing).toBe(3);
    expect(report.counts.feedbacks.missing).toBe(3);
  });

  it("formats and throws a readable validation error", () => {
    const report = validateScenarioTranslationCompleteness(
      validScenario01Data.definition,
      "it",
      null,
    );

    const message = formatScenarioTranslationCompletenessReport(report);

    expect(message).toContain("scenario-01 (it) translation is incomplete");

    expect(message).toContain("3 question(s)");
    expect(message).toContain("9 answer(s)");
    expect(message).toContain("9 feedback(s)");

    expect(() => {
      assertScenarioTranslationComplete(validScenario01Data.definition, "it", null);
    }).toThrow(message);
  });

  it("keeps every currently registered Scenario 2 locale complete", () => {
    for (const [locale, content] of Object.entries(scenario02Data.locales)) {
      const report = validateScenarioTranslationCompleteness(
        scenario02Data.definition,
        locale as keyof typeof scenario02Data.locales,
        content,
      );

      expect(report.isComplete, formatScenarioTranslationCompletenessReport(report)).toBe(true);
    }
  });
});
