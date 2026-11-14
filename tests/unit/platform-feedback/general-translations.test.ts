import { APP_LOCALES } from "@/lib/i18n/locales";
import { GENERAL_FEEDBACK_CATEGORIES } from "@/lib/platform-feedback/general-definition";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("general feedback translations", () => {
  it.each(APP_LOCALES)("contains the form and admin messages for %s", (locale) => {
    const file = join(process.cwd(), "messages", "platform-feedback-shells", `${locale}.json`);
    const messages: unknown = JSON.parse(readFileSync(file, "utf8"));
    const protectedMessages = (messages as { Protected: Record<string, unknown> }).Protected;
    const form = protectedMessages.GeneralFeedbackForm as Record<string, unknown>;
    const admin = protectedMessages.GeneralFeedbackAdmin as Record<string, unknown>;
    expect(typeof form.title).toBe("string");
    expect(typeof form.privacyNote).toBe("string");
    expect(typeof form.submit).toBe("string");
    expect(typeof admin.title).toBe("string");
    expect(admin.recentCount).toContain("{count}");
    for (const category of GENERAL_FEEDBACK_CATEGORIES) {
      expect(typeof (form.categories as Record<string, string>)[category]).toBe("string");
      expect(typeof (admin.categories as Record<string, string>)[category]).toBe("string");
    }
  });
});
