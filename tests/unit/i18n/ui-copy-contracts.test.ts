// @vitest-environment node

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function readRepoFile(relativePath: string) {
  return readFileSync(resolve(process.cwd(), relativePath), "utf8");
}

describe("localized UI copy contracts", () => {
  it("keeps login fallback errors translation-backed", () => {
    const source = readRepoFile("components/auth/login/login-form.tsx");

    expect(source).toContain('t("fallbackError")');
    expect(source).not.toContain('"Sign in failed. Please try again."');
  });

  it("keeps certificate controls and errors translation-backed", () => {
    const source = readRepoFile("components/curriculum/certificate-download-button.tsx");

    expect(source).toContain('useTranslations("Protected.CertificateDownload")');
    expect(source).toContain('t("download")');
    expect(source).toContain('t("generating")');
    expect(source).toContain('t("errors.timeout")');
    expect(source).toContain('t("errors.unavailable")');
    expect(source).not.toContain('"Download certificate"');
    expect(source).not.toContain('"Generating PDF..."');
  });

  it("keeps pilot assessment interface copy in messages", () => {
    const source = readRepoFile("components/curriculum/curriculum-pilot-assessment-form.tsx");

    expect(source).toContain('useTranslations("Protected.CurriculumPilotAssessment")');
    expect(source).not.toContain('"Pilot pre-assessment"');
    expect(source).not.toContain('"Pre-assessment pilotażowy"');
    expect(source).not.toContain('"Self-assessment before starting the IntegratESG modules"');
  });

  it("keeps curriculum route states translation-backed without component fallbacks", () => {
    const source = readRepoFile("components/curriculum/curriculum-route-state.tsx");

    expect(source).toContain('useTranslations("Protected.CurriculumRouteState")');
    expect(source).not.toContain("fallbackMessages");
    expect(source).not.toContain('"Loading curriculum"');
    expect(source).not.toContain('"Ładowanie programu"');
  });
});
