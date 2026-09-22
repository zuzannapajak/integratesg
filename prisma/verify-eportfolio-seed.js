import "dotenv/config";

import { randomUUID } from "node:crypto";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { caseStudies } from "../content/eportfolio/index.js";
import { seedEportfolio } from "./seed-data/eportfolio/seed.js";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing DIRECT_URL or DATABASE_URL environment variable.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  await seedEportfolio(prisma);

  const expectedSlugs = caseStudies.map((caseStudy) => caseStudy.slug);
  const seeded = await prisma.caseStudy.findMany({
    where: { slug: { in: expectedSlugs } },
    select: {
      id: true,
      slug: true,
      translations: {
        where: { language: "en" },
        select: { id: true },
      },
    },
  });

  if (seeded.length !== expectedSlugs.length) {
    throw new Error(`Expected ${expectedSlugs.length} ePortfolio cases, found ${seeded.length}.`);
  }

  for (const item of seeded) {
    if (item.translations.length !== 1) {
      throw new Error(`Expected exactly one English translation for ${item.slug}.`);
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
    console.log("English translations verified: yes");
    console.log("UserCaseStudyProgress preserved: yes");
  } finally {
    await prisma.profile.deleteMany({
      where: { id: verificationUserId },
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
