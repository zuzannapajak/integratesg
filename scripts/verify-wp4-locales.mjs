#!/usr/bin/env node

// Offline, read-only verification. Does not require Prisma or database access.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { caseStudies } from "../content/eportfolio/index.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const issues = [];

for (const caseStudy of caseStudies) {
  const locales = new Set(caseStudy.translations.map((entry) => entry.language));
  for (const language of ["de", "it"]) {
    if (!locales.has(language)) {
      issues.push(`ePortfolio: missing ${language} locale for ${caseStudy.slug}`);
    }
  }
}

for (let i = 1; i <= 6; i += 1) {
  const code = String(i).padStart(2, "0");
  const base = join(root, "content", "scenarios", `scenario-${code}`);
  const en = readFileSync(join(base, "locales", "en.ts"), "utf8");
  const it = readFileSync(join(base, "locales", "it.ts"), "utf8");
  const index = readFileSync(join(base, "index.ts"), "utf8");

  const keys = (contents, expression) =>
    [...contents.matchAll(expression)].map((match) => match[1]).sort();
  const enChallenges = keys(en, /\[challenges\.([^\]]+)\]:\s*\{/g);
  const itChallenges = keys(it, /\[challenges\.([^\]]+)\]:\s*\{/g);
  const enChoices = keys(en, /\[choices\.([^\]]+)\]:\s*\{/g);
  const itChoices = keys(it, /\[choices\.([^\]]+)\]:\s*\{/g);

  if (JSON.stringify(enChallenges) !== JSON.stringify(itChallenges)) {
    issues.push(`scenario-${code}: Italian challenge IDs differ from English`);
  }
  if (JSON.stringify(enChoices) !== JSON.stringify(itChoices)) {
    issues.push(`scenario-${code}: Italian choice IDs differ from English`);
  }
  if (!index.includes(`scenario${code}It`) || !index.includes('locale: "it" as const')) {
    issues.push(`scenario-${code}: Italian module not registered`);
  }
  if (itChallenges.length !== 3 || itChoices.length !== 9) {
    issues.push(`scenario-${code}: expected 3 challenges and 9 choices`);
  }
  if (!it.includes('locale: "it"')) {
    issues.push(`scenario-${code}: missing Italian locale metadata`);
  }
}

if (issues.length > 0) {
  console.error("WP4 translations validation failed:\n" + issues.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`WP4 locale validation passed: ${caseStudies.length}/16 ePortfolio DE+IT; 6/6 scenarios IT with 3 challenges and 9 stable choice IDs each.`);
  console.log("This validates source files only. Run Vitest, typecheck, build and the database seed separately.");
}
