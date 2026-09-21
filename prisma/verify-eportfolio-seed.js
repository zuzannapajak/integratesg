import "dotenv/config";

import { randomUUID } from "node:crypto";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

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

async function main() {
  await seedEportfolio(prisma);

  const initialCaseStudy = await prisma.caseStudy.findUnique({
    where: {
      slug: "barilla",
    },
    select: {
      id: true,
    },
  });

  if (!initialCaseStudy) {
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
        caseStudyId: initialCaseStudy.id,
        status: "in_progress",
        startedAt,
        lastOpenedAt,
      },
      select: {
        id: true,
        caseStudyId: true,
        status: true,
        startedAt: true,
        lastOpenedAt: true,
        completedAt: true,
      },
    });

    await seedEportfolio(prisma);
    await seedEportfolio(prisma);

    const caseStudies = await prisma.caseStudy.findMany({
      where: {
        slug: "barilla",
      },
      select: {
        id: true,
        translations: {
          where: {
            language: "en",
          },
          select: {
            id: true,
          },
        },
      },
    });

    if (caseStudies.length !== 1) {
      throw new Error(`Expected exactly one Barilla case study, found ${caseStudies.length}.`);
    }

    if (caseStudies[0].id !== initialCaseStudy.id) {
      throw new Error("Barilla CaseStudy id changed after reseeding.");
    }

    if (caseStudies[0].translations.length !== 1) {
      throw new Error(
        `Expected exactly one English Barilla translation, found ${caseStudies[0].translations.length}.`,
      );
    }

    const progressAfterReseed = await prisma.userCaseStudyProgress.findUnique({
      where: {
        userId_caseStudyId: {
          userId: verificationUserId,
          caseStudyId: initialCaseStudy.id,
        },
      },
      select: {
        id: true,
        caseStudyId: true,
        status: true,
        startedAt: true,
        lastOpenedAt: true,
        completedAt: true,
      },
    });

    if (!progressAfterReseed) {
      throw new Error("UserCaseStudyProgress was deleted by the ePortfolio seed.");
    }

    if (progressAfterReseed.id !== progress.id) {
      throw new Error("UserCaseStudyProgress id changed after reseeding.");
    }

    if (
      progressAfterReseed.caseStudyId !== progress.caseStudyId ||
      progressAfterReseed.status !== progress.status ||
      progressAfterReseed.startedAt?.getTime() !== progress.startedAt?.getTime() ||
      progressAfterReseed.lastOpenedAt?.getTime() !== progress.lastOpenedAt?.getTime() ||
      progressAfterReseed.completedAt?.getTime() !== progress.completedAt?.getTime()
    ) {
      throw new Error("UserCaseStudyProgress content changed after reseeding.");
    }

    console.log("ePortfolio seed verification passed.");
    console.log("Barilla records: 1");
    console.log("English translations: 1");
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
