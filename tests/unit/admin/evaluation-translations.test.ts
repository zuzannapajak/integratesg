import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { PLATFORM_RATING_KEYS } from "@/lib/platform-feedback/definition";

const languages = ["en", "pl", "de", "it", "bg", "el"];
function flatten(value: unknown, prefix = ""): string[] {
  if (typeof value === "string") {
    expect(value.trim().length, prefix).toBeGreaterThan(0);
    return [prefix];
  }
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`Invalid translation: ${prefix}`);
  }
  return Object.entries(value).flatMap(([key, child]) => flatten(child, `${prefix}.${key}`));
}
function readTranslations(scope: string, locale: string): Record<string, unknown> {
  return JSON.parse(readFileSync(resolve("messages", scope, `${locale}.json`), "utf8")) as Record<
    string,
    unknown
  >;
}

describe("evaluation and approved platform feedback translations", () => {
  it("ships complete dashboard labels in all six supported locales", () => {
    const reference = flatten(readTranslations("evaluation-admin-shells", "en")).sort();
    for (const locale of languages) {
      const keys = flatten(readTranslations("evaluation-admin-shells", locale)).sort();
      expect(keys, locale).toEqual(reference);
      const stats = readTranslations("admin-stats-shells", locale) as {
        Protected: { AdminStatsShell: { segments: { evaluation: string } } };
      };
      expect(stats.Protected.AdminStatsShell.segments.evaluation.trim().length).toBeGreaterThan(0);
    }
  });

  it("keeps every approved platform rating question translated", () => {
    for (const locale of languages) {
      const messages = readTranslations("platform-feedback-shells", locale) as {
        Protected: {
          PlatformFeedbackForm: { questions: Partial<Record<string, { label: string; hint: string }>> };
        };
      };
      for (const key of PLATFORM_RATING_KEYS) {
        expect(
          messages.Protected.PlatformFeedbackForm.questions[key]?.label,
          `${locale}:${key}`,
        ).toBeTruthy();
        expect(
          messages.Protected.PlatformFeedbackForm.questions[key]?.hint,
          `${locale}:${key}`,
        ).toBeTruthy();
      }
    }
  });
});
