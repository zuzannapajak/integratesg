// @vitest-environment node

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const schema = readFileSync(resolve(process.cwd(), "prisma/schema.prisma"), "utf8");

function getBlock(kind, name) {
  const pattern = new RegExp(`${kind}\\s+${name}\\s*\\{([\\s\\S]*?)^\\}`, "m");

  const match = schema.match(pattern);

  if (!match) {
    throw new Error(`Missing ${kind} ${name} in prisma/schema.prisma`);
  }

  return match[1];
}

describe("ePortfolio Prisma data model", () => {
  it("defines the CaseStudy metadata required by the library", () => {
    const model = getBlock("model", "CaseStudy");

    expect(model).toMatch(/\bslug\s+String\s+@unique\b/);

    expect(model).toMatch(/\barea\s+CourseArea\b/);

    expect(model).toMatch(/\bstatus\s+PublicationStatus\b/);

    expect(model).toMatch(/\bsortOrder\s+Int\b/);

    expect(model).toMatch(/\bisFeatured\s+Boolean\b/);

    expect(model).toMatch(/\bcountryCode\s+String\b/);

    expect(model).toMatch(/\breportingPeriod\s+String\?/);

    expect(model).toMatch(/\bsourcePartner\s+String\?/);

    expect(model).toMatch(/\btranslations\s+CaseStudyTranslation\[\]/);

    expect(model).toMatch(/\buserProgress\s+UserCaseStudyProgress\[\]/);
  });

  it("defines localized ePortfolio content with one row per language", () => {
    const model = getBlock("model", "CaseStudyTranslation");

    expect(model).toMatch(/\blanguage\s+String\b/);

    expect(model).toMatch(/\btitle\s+String\b/);

    expect(model).toMatch(/\bsummary\s+String\?/);

    expect(model).toMatch(/\bcontent\s+String\b/);

    expect(model).toMatch(/\bkeyTakeaways\s+Json\?/);

    expect(model).toMatch(/\borganization\s+String\?/);

    expect(model).toMatch(/\bindustry\s+String\?/);

    expect(model).toContain("@@unique([caseStudyId, language])");
  });

  it("defines isolated per-user case study progress", () => {
    const model = getBlock("model", "UserCaseStudyProgress");

    expect(model).toMatch(/\buserId\s+String\b/);

    expect(model).toMatch(/\bcaseStudyId\s+String\b/);

    expect(model).toMatch(/\bstatus\s+CaseStudyProgressStatus\b/);

    expect(model).toMatch(/\bstartedAt\s+DateTime\?/);

    expect(model).toMatch(/\blastOpenedAt\s+DateTime\?/);

    expect(model).toMatch(/\bcompletedAt\s+DateTime\?/);

    expect(model).toContain("@@unique([userId, caseStudyId])");
  });

  it("supports not started, in progress and completed states", () => {
    const enumBlock = getBlock("enum", "CaseStudyProgressStatus");

    expect(enumBlock).toMatch(/\bnot_started\b/);

    expect(enumBlock).toMatch(/\bin_progress\b/);

    expect(enumBlock).toMatch(/\bcompleted\b/);
  });
});
