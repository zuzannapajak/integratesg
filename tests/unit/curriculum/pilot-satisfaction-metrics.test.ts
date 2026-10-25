import { describe, expect, it } from "vitest";
import { summarizePilotSatisfaction } from "@/lib/pilot-satisfaction/metrics";

describe("pilot satisfaction counters", () => {
  it("counts unique users by country and area, never counting other countries toward Poland", () => {
    const values = [
      { userId: "a", scope: "curriculum", countryCode: "PL", overallSatisfaction: 5 },
      { userId: "a", scope: "curriculum", countryCode: "PL", overallSatisfaction: 5 },
      { userId: "b", scope: "eportfolio", countryCode: "PL", overallSatisfaction: 3 },
      { userId: "c", scope: "curriculum", countryCode: "IT", overallSatisfaction: 2 },
    ];
    const result = summarizePilotSatisfaction(values);
    expect(result.find((row) => row.scope === "curriculum")?.byCountry.find((row) => row.countryCode === "PL")?.respondents).toBe(1);
    expect(result.find((row) => row.scope === "eportfolio")?.byCountry.find((row) => row.countryCode === "PL")?.respondents).toBe(1);
    expect(result.find((row) => row.scope === "curriculum")?.byCountry.find((row) => row.countryCode === "IT")?.respondents).toBe(1);
  });
  it("uses a 15 respondent planning target per area and returns zero rather than negative remaining", () => {
    const group = Array.from({ length: 16 }, (_, i) => ({ userId: `u${i}`, scope: "curriculum", countryCode: "PL", overallSatisfaction: 4 }));
    const row = summarizePilotSatisfaction(group)[0]?.byCountry.find((entry) => entry.countryCode === "PL");
    expect(row).toBeDefined();
    expect(row?.respondents).toBe(16);
    expect(row?.remaining).toBe(0);
  });
});
