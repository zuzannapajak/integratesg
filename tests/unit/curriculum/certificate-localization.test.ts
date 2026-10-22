// @vitest-environment node

import { describe, expect, it } from "vitest";
import { APP_LOCALES } from "@/lib/i18n/locales";
import {
  CERTIFICATE_COPY,
  formatCertificateDate,
  pickCertificateModuleTitle,
  resolveCertificateLocale,
} from "@/lib/curriculum/certificate-copy";
import { segmentCertificateText } from "@/lib/curriculum/certificate-unicode";

describe("curriculum certificate localization", () => {
  it("has complete non-English copy for every supported platform language", () => {
    for (const locale of APP_LOCALES) {
      const copy = CERTIFICATE_COPY[locale];
      expect(Object.values(copy)).toHaveLength(9);
      for (const value of Object.values(copy)) {
        expect(value.trim().length).toBeGreaterThan(3);
        expect(() => segmentCertificateText(value)).not.toThrow();
      }
    }
    expect(CERTIFICATE_COPY.pl.title).not.toBe(CERTIFICATE_COPY.en.title);
    expect(CERTIFICATE_COPY.el.title).not.toBe(CERTIFICATE_COPY.bg.title);
  });

  it("selects a supported requested language or defaults to English", () => {
    expect(resolveCertificateLocale("pl")).toBe("pl");
    expect(resolveCertificateLocale("el")).toBe("el");
    expect(resolveCertificateLocale("bg")).toBe("bg");
    expect(resolveCertificateLocale("../../admin")).toBe("en");
    expect(resolveCertificateLocale(null)).toBe("en");
  });

  it("selects a localized course title and falls back to English", () => {
    const translations = [
      { language: "en", title: "Foundations of ESG" },
      { language: "pl", title: "Podstawy ESG" },
    ];
    expect(pickCertificateModuleTitle(translations, "course-1", "pl")).toBe("Podstawy ESG");
    expect(pickCertificateModuleTitle(translations, "course-1", "de")).toBe("Foundations of ESG");
    expect(pickCertificateModuleTitle([], "course-1", "de")).toBe("course-1");
  });

  it("formats dates for all six locales deterministically in UTC", () => {
    const date = new Date("2026-10-22T13:00:00Z");
    for (const locale of APP_LOCALES) {
      const formatted = formatCertificateDate(date, locale);
      expect(formatted).toContain("2026");
      expect(() => segmentCertificateText(formatted)).not.toThrow();
    }
    expect(formatCertificateDate(date, "pl")).toContain("października");
  });
});

describe("certificate Unicode font selection", () => {
  it.each([
    ["Polish", "Łucja Brzęgąlińska", "latin-ext"],
    ["German", "Jürgen Weiß", "latin"],
    ["Italian", "Gianluca D’Amico", "latin"],
    ["Greek", "Παπαδόπουλος", "greek"],
    ["Bulgarian", "Иван Петров", "cyrillic"],
    ["Vietnamese", "Nguyễn Văn An", "vietnamese"],
  ] as const)("supports %s certificate names", (_, fullName, expectedSubset) => {
    const runs = segmentCertificateText(fullName);
    expect(runs.map((run) => run.text).join("")).toBe(fullName);
    expect(runs.some((run) => run.subset === expectedSubset)).toBe(true);
  });

  it("normalizes decomposed characters without losing accents", () => {
    const name = "L\u0065\u0301a";
    expect(segmentCertificateText(name).map((run) => run.text).join("")).toBe("Léa");
  });

  it("supports punctuation without using lossy ASCII transliteration", () => {
    const value = "„Dziękuję” — 100% ESG (€)";
    expect(segmentCertificateText(value).map((run) => run.text).join("")).toBe(value);
  });

  it("fails explicitly for unsupported scripts and emoji", () => {
    expect(() => segmentCertificateText("山田太郎")).toThrow(/Unsupported certificate character/);
    expect(() => segmentCertificateText("Test 😀")).toThrow(/U\+1F600/);
  });
});
