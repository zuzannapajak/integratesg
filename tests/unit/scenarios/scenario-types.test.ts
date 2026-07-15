import {
  CHALLENGE_NUMBERS,
  CHOICE_NUMBERS,
  CURRICULUM_MODULE_SLUG_BY_SCENARIO_ID,
  SCENARIO_IDS,
  SCENARIO_ORDER_BY_ID,
  SCENARIO_PARTNER_BY_ID,
  type ChallengeIdFor,
  type ChoiceIdFor,
} from "@/lib/scenarios/simulator/types";
import { describe, expect, it } from "vitest";

function acceptScenario01ChallengeId(value: ChallengeIdFor<"scenario-01">) {
  return value;
}

function acceptScenario01Challenge01ChoiceId(value: ChoiceIdFor<"scenario-01-challenge-01">) {
  return value;
}

describe("scenario simulator types", () => {
  it("defines exactly six ordered scenarios", () => {
    expect(SCENARIO_IDS).toEqual([
      "scenario-01",
      "scenario-02",
      "scenario-03",
      "scenario-04",
      "scenario-05",
      "scenario-06",
    ]);

    expect(SCENARIO_ORDER_BY_ID).toEqual({
      "scenario-01": 1,
      "scenario-02": 2,
      "scenario-03": 3,
      "scenario-04": 4,
      "scenario-05": 5,
      "scenario-06": 6,
    });
  });

  it("defines three challenges and three choices", () => {
    expect(CHALLENGE_NUMBERS).toEqual(["01", "02", "03"]);
    expect(CHOICE_NUMBERS).toEqual(["01", "02", "03"]);
  });

  it("uses stable challenge and choice identifier formats", () => {
    expect(acceptScenario01ChallengeId("scenario-01-challenge-01")).toBe(
      "scenario-01-challenge-01",
    );

    expect(acceptScenario01Challenge01ChoiceId("scenario-01-challenge-01-choice-01")).toBe(
      "scenario-01-challenge-01-choice-01",
    );
  });

  it("maps scenarios to the existing curriculum modules", () => {
    expect(CURRICULUM_MODULE_SLUG_BY_SCENARIO_ID["scenario-01"]).toBe(
      "module-1-introduction-to-esg-and-sustainable-development",
    );

    expect(CURRICULUM_MODULE_SLUG_BY_SCENARIO_ID["scenario-06"]).toBe(
      "module-6-monitoring-reporting-and-future-trends-of-esg",
    );
  });

  it("maps source partners to the correct scenarios", () => {
    expect(SCENARIO_PARTNER_BY_ID["scenario-01"]).toBe("IoD");
    expect(SCENARIO_PARTNER_BY_ID["scenario-02"]).toBe("CleverMind");
    expect(SCENARIO_PARTNER_BY_ID["scenario-03"]).toBe("die Berater");
    expect(SCENARIO_PARTNER_BY_ID["scenario-04"]).toBe("TUL");
    expect(SCENARIO_PARTNER_BY_ID["scenario-05"]).toBe("SBC");
    expect(SCENARIO_PARTNER_BY_ID["scenario-06"]).toBe("EGINA");
  });
});
