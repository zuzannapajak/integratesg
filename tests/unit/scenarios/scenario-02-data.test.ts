import { scenario02Data, scenario02Ids } from "@/content/scenarios/scenario-02";
import { type ScenarioData } from "@/lib/scenarios/simulator/format";
import { safeParseScenarioData } from "@/lib/scenarios/simulator/schema";
import { describe, expect, it } from "vitest";

type Scenario02Data = ScenarioData<"scenario-02">;

/**
 * Extracts values from every member of an object union.
 *
 * A plain `T[keyof T]` is not sufficient for unions whose members
 * have disjoint keys, because `keyof` then becomes `never`.
 */
type ValueOfUnion<T> = T extends object ? T[keyof T] : never;

type Scenario02Challenge = ValueOfUnion<Scenario02Data["definition"]["challenges"]>;

type Scenario02Choice = ValueOfUnion<Scenario02Challenge["choices"]>;

type Scenario02LocaleChallenge = ValueOfUnion<Scenario02Data["locales"]["en"]["challenges"]>;

type Scenario02LocaleChoice = ValueOfUnion<Scenario02LocaleChallenge["choices"]>;

/**
 * Typed replacement for Object.values().
 *
 * Object.values() may select its `any[]` overload when it receives
 * a union of object types with different keys. This helper preserves
 * the declared value type.
 */
function objectValues<TValue>(object: Readonly<Record<string, TValue>>): TValue[] {
  return Object.values(object);
}

function getDefinitionChallenges(): Scenario02Challenge[] {
  return objectValues<Scenario02Challenge>(scenario02Data.definition.challenges);
}

function getDefinitionChoices(challenge: Scenario02Challenge): Scenario02Choice[] {
  return objectValues<Scenario02Choice>(challenge.choices);
}

function getLocaleChallenges(): Scenario02LocaleChallenge[] {
  return objectValues<Scenario02LocaleChallenge>(scenario02Data.locales.en.challenges);
}

function getLocaleChoices(challenge: Scenario02LocaleChallenge): Scenario02LocaleChoice[] {
  return objectValues<Scenario02LocaleChoice>(challenge.choices);
}

describe("Scenario 2 data", () => {
  it("passes the complete scenario data schema", () => {
    const result = safeParseScenarioData("scenario-02", scenario02Data);

    expect(result.success).toBe(true);
  });

  it("contains the correct scenario metadata", () => {
    const definition = scenario02Data.definition;

    expect(definition.id).toBe("scenario-02");

    expect(definition.slug).toBe("scenario-02");

    expect(definition.order).toBe(2);
    expect(definition.version).toBe(1);

    expect(definition.sourcePartner).toBe("CleverMind");

    expect(definition.curriculumModuleSlug).toBe(
      "module-2-strategy-vision-and-organisational-alignment",
    );
  });

  it("uses separate PNG backgrounds for pre-start and in-progress views", () => {
    const assets = scenario02Data.definition.assets;

    expect(assets.preStartBackground).toBe("/scenarios/scenario-02/pre-start.png");

    expect(assets.inProgressBackground).toBe("/scenarios/scenario-02/in-progress.png");

    expect(assets.preStartBackground).not.toBe(assets.inProgressBackground);

    expect(assets.preStartBackground).toMatch(/\.png$/i);

    expect(assets.inProgressBackground).toMatch(/\.png$/i);
  });

  it("contains exactly three ordered challenges", () => {
    const challenges = getDefinitionChallenges().sort(
      (first, second) => first.order - second.order,
    );

    expect(challenges).toHaveLength(3);

    expect(challenges.map((challenge) => challenge.id)).toEqual([
      scenario02Ids.challenges.priorities,
      scenario02Ids.challenges.financialPressure,
      scenario02Ids.challenges.peopleAndTeams,
    ]);

    expect(challenges.map((challenge) => challenge.order)).toEqual([1, 2, 3]);
  });

  it("contains valid pathway and challenge hotspot positions", () => {
    const { pathwayPosition } = scenario02Data.definition;

    expect(pathwayPosition.x).toBeGreaterThanOrEqual(0);

    expect(pathwayPosition.x).toBeLessThanOrEqual(100);

    expect(pathwayPosition.y).toBeGreaterThanOrEqual(0);

    expect(pathwayPosition.y).toBeLessThanOrEqual(100);

    for (const challenge of getDefinitionChallenges()) {
      expect(challenge.hotspot.x).toBeGreaterThanOrEqual(0);

      expect(challenge.hotspot.x).toBeLessThanOrEqual(100);

      expect(challenge.hotspot.y).toBeGreaterThanOrEqual(0);

      expect(challenge.hotspot.y).toBeLessThanOrEqual(100);
    }
  });

  it("contains exactly three ordered choices per challenge", () => {
    for (const challenge of getDefinitionChallenges()) {
      const choices = getDefinitionChoices(challenge);

      expect(choices).toHaveLength(3);

      expect(choices.map((choice) => choice.order).sort((first, second) => first - second)).toEqual(
        [1, 2, 3],
      );
    }
  });

  it("contains exactly one optimal choice per challenge", () => {
    for (const challenge of getDefinitionChallenges()) {
      const optimalChoices = getDefinitionChoices(challenge).filter((choice) => choice.isOptimal);

      expect(optimalChoices).toHaveLength(1);
    }
  });

  it("uses the expected optimal decisions", () => {
    const { priorities, financialPressure, peopleAndTeams } = scenario02Ids.challenges;

    const priorityOptimalChoice = getDefinitionChoices(
      scenario02Data.definition.challenges[priorities],
    ).find((choice) => choice.isOptimal);

    const financeOptimalChoice = getDefinitionChoices(
      scenario02Data.definition.challenges[financialPressure],
    ).find((choice) => choice.isOptimal);

    const peopleOptimalChoice = getDefinitionChoices(
      scenario02Data.definition.challenges[peopleAndTeams],
    ).find((choice) => choice.isOptimal);

    expect(priorityOptimalChoice?.id).toBe(scenario02Ids.choices.priorities.materialPriorities);

    expect(financeOptimalChoice?.id).toBe(
      scenario02Ids.choices.financialPressure.phasedBusinessCase,
    );

    expect(peopleOptimalChoice?.id).toBe(scenario02Ids.choices.peopleAndTeams.sharedOwnership);
  });

  it("contains complete English scenario content", () => {
    const content = scenario02Data.locales.en;

    expect(content.scenarioId).toBe("scenario-02");

    expect(content.locale).toBe("en");

    expect(content.title).toBe("Strategy, Vision and Organisational Alignment");

    expect(content.shortTitle).toBe("Strategy & Alignment");

    expect(content.introduction.length).toBeGreaterThan(20);

    expect(content.boardAlt.length).toBeGreaterThan(20);

    expect(content.objectives).toHaveLength(3);

    expect(getLocaleChallenges()).toHaveLength(3);

    expect(content.summary.takeaways).toHaveLength(3);
  });

  it("contains locale content for every defined challenge", () => {
    const definitionChallengeIds = Object.keys(scenario02Data.definition.challenges).sort();

    const localeChallengeIds = Object.keys(scenario02Data.locales.en.challenges).sort();

    expect(localeChallengeIds).toEqual(definitionChallengeIds);
  });

  it("contains locale content for every defined choice", () => {
    const challengeIds = Object.keys(scenario02Data.definition.challenges) as Array<
      keyof typeof scenario02Data.definition.challenges
    >;

    for (const challengeId of challengeIds) {
      const definitionChallenge = scenario02Data.definition.challenges[challengeId];

      const localeChallenge = scenario02Data.locales.en.challenges[challengeId];

      const definitionChoiceIds = Object.keys(definitionChallenge.choices).sort();

      const localeChoiceIds = Object.keys(localeChallenge.choices).sort();

      expect(localeChoiceIds).toEqual(definitionChoiceIds);
    }
  });

  it("contains complete content and feedback for every decision", () => {
    for (const challenge of getLocaleChallenges()) {
      expect(challenge.title.length).toBeGreaterThan(5);

      expect(challenge.shortTitle.length).toBeGreaterThan(3);

      expect(challenge.context.length).toBeGreaterThan(20);

      expect(challenge.question.length).toBeGreaterThan(10);

      const choices = getLocaleChoices(challenge);

      expect(choices).toHaveLength(3);

      for (const choice of choices) {
        expect(choice.text.length).toBeGreaterThan(20);

        expect(choice.feedback.body.length).toBeGreaterThan(20);
      }
    }
  });

  it("contains a complete scenario summary", () => {
    const summary = scenario02Data.locales.en.summary;

    expect(summary.title.length).toBeGreaterThan(5);

    expect(summary.body?.length ?? 0).toBeGreaterThan(20);

    expect(summary.takeaways).toHaveLength(3);

    for (const takeaway of summary.takeaways) {
      expect(takeaway.length).toBeGreaterThan(20);
    }
  });
});
