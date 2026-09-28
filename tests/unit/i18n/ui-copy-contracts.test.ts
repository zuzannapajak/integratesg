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

  it("keeps auth callback redirect copy translation-backed", () => {
    const source = readRepoFile("app/[locale]/(auth)/auth/callback/route.ts");

    expect(source).toContain('namespace: "Auth.ClientCallback"');
    expect(source).toContain('t("redirecting")');
    expect(source).not.toContain("<title>Redirecting...</title>");
    expect(source).not.toContain("<p>Redirecting...</p>");
  });

  it("keeps locale metadata translation-backed", () => {
    const source = readRepoFile("app/[locale]/layout.tsx");

    expect(source).toContain("export async function generateMetadata");
    expect(source).toContain('namespace: "Metadata"');
    expect(source).toContain('default: t("title")');
    expect(source).toContain('description: t("description")');
    expect(source).not.toContain(
      'description: "IntegratESG e-learning platform for ESG education."',
    );
  });

  it("requires localized labels for the scenario pathway and board", () => {
    const pathwaySource = readRepoFile("components/scenarios/pathway/scenario-pathway-map.tsx");
    const boardSource = readRepoFile("components/scenarios/simulator/scenario-board.tsx");
    const pathwayClientSource = readRepoFile(
      "app/[locale]/(protected)/scenarios/scenario-map-client.tsx",
    );
    const playClientSource = readRepoFile(
      "app/[locale]/(protected)/scenarios/[slug]/play/scenario-play-client.tsx",
    );

    expect(pathwaySource).toContain("readonly labels: ScenarioPathwayMapLabels;");
    expect(pathwaySource).not.toContain("DEFAULT_SCENARIO_PATHWAY_MAP_LABELS");
    expect(pathwaySource).not.toContain(
      '"Explore the full learning pathway across your organisation."',
    );

    expect(boardSource).toContain("readonly labels: ScenarioBoardLabels;");
    expect(boardSource).not.toContain("DEFAULT_SCENARIO_BOARD_LABELS");
    expect(boardSource).not.toContain('"Choose a challenge"');
    expect(boardSource).not.toContain('"Complete the three challenges in order."');

    expect(pathwayClientSource).toContain('title: t("title")');
    expect(pathwayClientSource).toContain('subtitle: t("subtitle")');
    expect(playClientSource).toContain('viewChallenges: t("board.title")');
    expect(playClientSource).toContain('boardDescription: t("board.description")');
    expect(playClientSource).toContain('boardAllCompleted: t("board.allCompleted")');
  });
});
