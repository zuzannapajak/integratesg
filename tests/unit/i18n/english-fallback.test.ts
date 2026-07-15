import { applyEnglishFallback } from "@/lib/i18n/english-fallback";
import { describe, expect, it } from "vitest";

describe("applyEnglishFallback", () => {
  const english = {
    title: "English title",
    description: "English description",
    labels: {
      continue: "Continue",
      back: "Back",
    },
    objectives: ["English objective"],
  };

  it("keeps localized values and fills missing nested keys from English", () => {
    expect(
      applyEnglishFallback(english, {
        title: "Polski tytuł",
        labels: {
          continue: "Kontynuuj",
        },
      }),
    ).toEqual({
      title: "Polski tytuł",
      description: "English description",
      labels: {
        continue: "Kontynuuj",
        back: "Back",
      },
      objectives: ["English objective"],
    });
  });

  it("uses English for empty strings and empty arrays", () => {
    expect(
      applyEnglishFallback(english, {
        title: "   ",
        description: "",
        objectives: [],
      }),
    ).toEqual(english);
  });

  it("uses the complete English object when a locale file is unavailable", () => {
    expect(applyEnglishFallback(english, null)).toEqual(english);
  });

  it("preserves additional localized keys", () => {
    expect(
      applyEnglishFallback(english, {
        title: "Polski tytuł",
        translatorNote: "Wersja robocza",
      }),
    ).toMatchObject({
      title: "Polski tytuł",
      translatorNote: "Wersja robocza",
    });
  });
});
