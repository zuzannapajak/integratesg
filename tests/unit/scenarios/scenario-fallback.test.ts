import { resolveScenarioBySlug } from "@/lib/scenarios/simulator/resolve-scenario";
import { describe, expect, it } from "vitest";

describe("scenario translation fallback", () => {
  it("returns the Italian scenario when the translation exists", () => {
    const italian = resolveScenarioBySlug("scenario-02", "it");
    const english = resolveScenarioBySlug("scenario-02", "en");

    expect(italian).not.toBeNull();
    expect(italian?.locale).toBe("it");
    expect(italian?.title).not.toBe(english?.title);
    expect(italian?.challenges[0]?.question).not.toBe(english?.challenges[0]?.question);
  });

  it("keeps an English fallback for unavailable languages", () => {
    const english = resolveScenarioBySlug("scenario-02", "en");
    const french = resolveScenarioBySlug("scenario-02", "fr");

    expect(french).toEqual(english);
  });

  it("returns null for an unknown scenario slug", () => {
    expect(resolveScenarioBySlug("unknown-scenario", "pl")).toBeNull();
  });
});
