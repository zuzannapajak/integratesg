// @vitest-environment node

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { APP_LOCALES } from "@/lib/i18n/locales";

type RoleDescriptions = {
  learnerDescription: string;
  educatorDescription: string;
};

type ModuleDescriptions = {
  learners: { title: string; description: string };
  educators: { title: string; description: string };
};

type PublicRoleDescription = {
  hero: { description: string };
  cta: { description: string };
};

function loadMessages(bundle: string, locale: string): unknown {
  return JSON.parse(
    readFileSync(join(process.cwd(), "messages", bundle, `${locale}.json`), "utf8"),
  ) as unknown;
}

const scenarioTerms: Record<string, RegExp> = {
  en: /scenario simulator/i,
  pl: /symulator/i,
  de: /szenario-simulator/i,
  it: /simulatore di scenari/i,
  el: /προσομοιωτ/i,
  bg: /симулатор/i,
};

const curriculumTerms: Record<string, RegExp> = {
  en: /curriculum/i,
  pl: /curriculum/i,
  de: /curriculum/i,
  it: /curriculum/i,
  el: /πρόγραμμ|προγράμμ/i,
  bg: /учебн/i,
};

function expectModules(text: string, locale: string, educator: boolean) {
  expect(text).toContain("ePortfolio");
  expect(text).toMatch(scenarioTerms[locale]);

  if (educator) {
    expect(text).toMatch(curriculumTerms[locale]);
  }
}

describe("role descriptions in all supported languages", () => {
  for (const locale of APP_LOCALES) {
    const auth = loadMessages("auth-shells", locale) as {
      Auth: { CompleteProfile: RoleDescriptions };
      Register: { RoleStep: RoleDescriptions };
    };
    const home = loadMessages("home-shells", locale) as { Home: { cards: ModuleDescriptions } };
    const publicPages = loadMessages("public-content-shells", locale) as {
      PublicContent: { Educators: PublicRoleDescription; Learners: PublicRoleDescription };
    };

    it(`${locale}: shows educator access to curriculum, ePortfolio, and simulator`, () => {
      for (const description of [
        auth.Auth.CompleteProfile.educatorDescription,
        auth.Register.RoleStep.educatorDescription,
        home.Home.cards.educators.description,
        publicPages.PublicContent.Educators.hero.description,
        publicPages.PublicContent.Educators.cta.description,
      ]) {
        expectModules(description, locale, true);
      }
    });

    it(`${locale}: shows learner access to ePortfolio and simulator`, () => {
      for (const description of [
        auth.Auth.CompleteProfile.learnerDescription,
        auth.Register.RoleStep.learnerDescription,
        home.Home.cards.learners.description,
        publicPages.PublicContent.Learners.hero.description,
        publicPages.PublicContent.Learners.cta.description,
      ]) {
        expectModules(description, locale, false);
      }
      expect(home.Home.cards.learners.title).toContain("ePortfolio");
    });
  }
});
