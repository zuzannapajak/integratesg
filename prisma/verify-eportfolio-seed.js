import "dotenv/config";

import { randomUUID } from "node:crypto";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { EPORTFOLIO_LOCALES } from "../content/eportfolio/helpers.js";
import { caseStudies } from "../content/eportfolio/index.js";
import { seedEportfolio } from "./seed-data/eportfolio/seed.js";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing DIRECT_URL or DATABASE_URL environment variable.");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

const supportedLocaleSet = new Set(EPORTFOLIO_LOCALES);

function validateSourceTranslations() {
  for (const caseStudy of caseStudies) {
    const languages = caseStudy.translations.map((translation) => translation.language);

    const uniqueLanguages = new Set(languages);

    if (!uniqueLanguages.has("en")) {
      throw new Error(`Missing English translation for ${caseStudy.slug}.`);
    }

    if (uniqueLanguages.size !== languages.length) {
      throw new Error(`Duplicate translation language for ${caseStudy.slug}.`);
    }

    for (const language of uniqueLanguages) {
      if (!supportedLocaleSet.has(language)) {
        throw new Error(`Unsupported translation language ${language} for ${caseStudy.slug}.`);
      }
    }
  }
}

async function main() {
  validateSourceTranslations();

  await seedEportfolio(prisma);

  const expectedSlugs = caseStudies.map((caseStudy) => caseStudy.slug);

  const seeded = await prisma.caseStudy.findMany({
    where: {
      slug: {
        in: expectedSlugs,
      },
    },
    select: {
      id: true,
      slug: true,
      translations: {
        select: {
          language: true,
        },
      },
    },
  });

  if (seeded.length !== expectedSlugs.length) {
    throw new Error(`Expected ${expectedSlugs.length} ePortfolio cases, found ${seeded.length}.`);
  }

  for (const caseStudy of caseStudies) {
    const seededCaseStudy = seeded.find((item) => item.slug === caseStudy.slug);

    if (!seededCaseStudy) {
      throw new Error(`Missing seeded case study ${caseStudy.slug}.`);
    }

    const expectedLanguages = new Set(
      caseStudy.translations.map((translation) => translation.language),
    );

    const actualLanguages = new Set(
      seededCaseStudy.translations.map((translation) => translation.language),
    );

    for (const language of expectedLanguages) {
      if (!actualLanguages.has(language)) {
        throw new Error(`Missing ${language} translation in database for ${caseStudy.slug}.`);
      }
    }
  }

  const barilla = seeded.find((item) => item.slug === "barilla");

  if (!barilla) {
    throw new Error("Barilla case study was not created.");
  }

  const verificationUserId = `eportfolio-seed-${randomUUID()}`;

  const verificationEmail = `${verificationUserId}@example.test`;

  try {
    await prisma.profile.create({
      data: {
        id: verificationUserId,
        email: verificationEmail,
        role: "learner",
      },
    });

    const startedAt = new Date("2026-09-21T12:00:00.000Z");

    const lastOpenedAt = new Date("2026-09-21T12:30:00.000Z");

    const progress = await prisma.userCaseStudyProgress.create({
      data: {
        userId: verificationUserId,
        caseStudyId: barilla.id,
        status: "in_progress",
        startedAt,
        lastOpenedAt,
      },
    });

    await seedEportfolio(prisma);
    await seedEportfolio(prisma);

    const progressAfterReseed = await prisma.userCaseStudyProgress.findUnique({
      where: {
        userId_caseStudyId: {
          userId: verificationUserId,
          caseStudyId: barilla.id,
        },
      },
    });

    if (!progressAfterReseed || progressAfterReseed.id !== progress.id) {
      throw new Error("UserCaseStudyProgress was not preserved by reseeding.");
    }

    console.log("ePortfolio seed verification passed.");

    console.log(`Case studies verified: ${expectedSlugs.length}`);

    console.log("Source translation structure verified: yes");

    console.log("Seeded translations verified: yes");

    console.log("UserCaseStudyProgress preserved: yes");
  } finally {
    await prisma.profile.deleteMany({
      where: {
        id: verificationUserId,
      },
    });
  }
}

main()
  .catch((error) => {
    console.error("ePortfolio seed verification failed.");

    console.error(error);

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
