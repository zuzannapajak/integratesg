// @vitest-environment node

import { describe, expect, it } from "vitest";
import type { AppLocale } from "@/lib/i18n/locales";
import { buildCurriculumCertificatePdf } from "@/lib/curriculum/certificate-pdf";

const cases: Array<{ locale: AppLocale; learnerName: string; moduleTitle: string }> = [
  { locale: "en", learnerName: "Olivia O'Connor", moduleTitle: "Foundations of ESG" },
  { locale: "pl", learnerName: "Łucja Brzęgąlińska", moduleTitle: "Podstawy ESG i zrównoważonego rozwoju" },
  { locale: "de", learnerName: "Jürgen Weiß", moduleTitle: "Grundlagen von ESG" },
  { locale: "it", learnerName: "Gianluca D’Amico", moduleTitle: "Fondamenti dell'ESG" },
  { locale: "el", learnerName: "Γεώργιος Παπαδόπουλος", moduleTitle: "Βασικές αρχές ESG" },
  { locale: "bg", learnerName: "Иван Петров", moduleTitle: "Основи на ESG" },
];

describe("curriculum PDF certificates", () => {
  it.each(cases)("embeds fonts and renders the %s certificate", async ({ locale, learnerName, moduleTitle }) => {
    const pdf = await buildCurriculumCertificatePdf({
      locale,
      learnerName,
      moduleTitle,
      issuedAt: new Date("2026-10-22T12:00:00Z"),
      durationMinutes: 90,
      certificateId: "MODULE-12345678",
    });
    expect(Buffer.isBuffer(pdf)).toBe(true);
    expect(pdf.subarray(0, 5).toString("ascii")).toBe("%PDF-");
    expect(pdf.byteLength).toBeGreaterThan(10_000);
  });
});
