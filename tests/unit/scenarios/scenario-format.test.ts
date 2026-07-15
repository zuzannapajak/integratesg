import {
  createChallengeId,
  createChoiceId,
  SCENARIO_BASE_LOCALE,
} from "@/lib/scenarios/simulator/format";
import { describe, expect, it } from "vitest";

describe("scenario data format", () => {
  it("uses English as the required base locale", () => {
    expect(SCENARIO_BASE_LOCALE).toBe("en");
  });

  it("creates stable challenge identifiers", () => {
    expect(createChallengeId("scenario-01", "01")).toBe("scenario-01-challenge-01");

    expect(createChallengeId("scenario-04", "03")).toBe("scenario-04-challenge-03");

    expect(createChallengeId("scenario-06", "02")).toBe("scenario-06-challenge-02");
  });

  it("creates stable choice identifiers", () => {
    const challengeId = createChallengeId("scenario-02", "03");

    expect(createChoiceId(challengeId, "01")).toBe("scenario-02-challenge-03-choice-01");

    expect(createChoiceId(challengeId, "02")).toBe("scenario-02-challenge-03-choice-02");

    expect(createChoiceId(challengeId, "03")).toBe("scenario-02-challenge-03-choice-03");
  });
});
