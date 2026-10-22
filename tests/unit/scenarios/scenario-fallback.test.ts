import { resolveScenarioBySlug } from "@/lib/scenarios/simulator/resolve-scenario";
import { describe, expect, it } from "vitest";

describe("scenario translation fallback", () => {
  it("returns the English scenario when the requested locale is unavailable", () => {
    const englishScenario = resolveScenarioBySlug("scenario-02", "en");
    const italianScenario = resolveScenarioBySlug("scenario-02", "it");

    expect(englishScenario).not.toBeNull();
    expect(italianScenario).not.toBeNull();
    expect(italianScenario?.locale).toBe("en");
    expect(italianScenario?.title).toBe(englishScenario?.title);
    expect(italianScenario?.challenges[0]?.question).toBe(englishScenario?.challenges[0]?.question);
  });

  it("returns null for an unknown scenario slug", () => {
    expect(resolveScenarioBySlug("unknown-scenario", "pl")).toBeNull();
  });
});
