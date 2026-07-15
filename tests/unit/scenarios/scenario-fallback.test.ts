import { resolveScenarioBySlug } from "@/lib/scenarios/simulator/resolve-scenario";
import { describe, expect, it } from "vitest";

describe("scenario translation fallback", () => {
  it("returns the English scenario when the requested locale is unavailable", () => {
    const englishScenario = resolveScenarioBySlug("scenario-02", "en");
    const polishScenario = resolveScenarioBySlug("scenario-02", "pl");

    expect(englishScenario).not.toBeNull();
    expect(polishScenario).not.toBeNull();
    expect(polishScenario?.locale).toBe("en");
    expect(polishScenario?.title).toBe(englishScenario?.title);
    expect(polishScenario?.challenges[0]?.question).toBe(englishScenario?.challenges[0]?.question);
  });

  it("returns null for an unknown scenario slug", () => {
    expect(resolveScenarioBySlug("unknown-scenario", "pl")).toBeNull();
  });
});
