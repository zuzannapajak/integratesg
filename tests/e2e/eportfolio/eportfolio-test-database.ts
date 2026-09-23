import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

export const EPORTFOLIO_SLUGS = [
  "barilla",
  "davines",
  "pzu",
  "pkn-orlen",
  "sofiyska-voda",
  "harmonica",
  "sonnentor",
  "verbund",
] as const;

let prisma: PrismaClient | null = null;

function requireEnvironmentVariable(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(
      `Missing ${name}. Configure the Playwright ePortfolio test environment before running E2E tests.`,
    );
  }

  return value;
}

function getDatabaseClient(): PrismaClient {
  if (prisma) {
    return prisma;
  }

  if (process.env.PLAYWRIGHT_ALLOW_DATABASE_RESET !== "true") {
    throw new Error(
      [
        "Database cleanup is disabled.",
        "Set PLAYWRIGHT_ALLOW_DATABASE_RESET=true only for a dedicated test database.",
      ].join(" "),
    );
  }

  const databaseUrl =
    process.env.PLAYWRIGHT_DATABASE_URL?.trim() ?? process.env.TEST_DATABASE_URL?.trim();

  if (!databaseUrl) {
    throw new Error(
      "Missing PLAYWRIGHT_DATABASE_URL or TEST_DATABASE_URL for the ePortfolio E2E test.",
    );
  }

  const adapter = new PrismaPg({
    connectionString: databaseUrl,
  });

  prisma = new PrismaClient({
    adapter,
    log: ["error"],
  });

  return prisma;
}

export function getEportfolioTestCredentials() {
  return {
    email: requireEnvironmentVariable("PLAYWRIGHT_TEST_EMAIL"),
    password: requireEnvironmentVariable("PLAYWRIGHT_TEST_PASSWORD"),
  };
}

async function getTestProfileId(): Promise<string> {
  const database = getDatabaseClient();
  const { email } = getEportfolioTestCredentials();

  const profile = await database.profile.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  if (!profile) {
    throw new Error(
      [
        `No Profile record exists for the Playwright account ${email}.`,
        "Create the Supabase test user and its matching Profile record in the dedicated test database.",
      ].join(" "),
    );
  }

  return profile.id;
}

async function verifyEportfolioSeed(): Promise<void> {
  const database = getDatabaseClient();

  const caseStudies = await database.caseStudy.findMany({
    where: {
      slug: {
        in: [...EPORTFOLIO_SLUGS],
      },
    },
    select: {
      slug: true,
      status: true,
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

  const bySlug = new Map(caseStudies.map((caseStudy) => [caseStudy.slug, caseStudy]));

  const missing = EPORTFOLIO_SLUGS.filter((slug) => !bySlug.has(slug));

  const unpublished = EPORTFOLIO_SLUGS.filter((slug) => {
    const caseStudy = bySlug.get(slug);

    return caseStudy ? caseStudy.status !== "published" : false;
  });

  const missingEnglish = EPORTFOLIO_SLUGS.filter((slug) => {
    const caseStudy = bySlug.get(slug);

    return caseStudy ? caseStudy.translations.length === 0 : false;
  });

  const problems: string[] = [];

  if (missing.length > 0) {
    problems.push(`missing case studies: ${missing.join(", ")}`);
  }

  if (unpublished.length > 0) {
    problems.push(`not published: ${unpublished.join(", ")}`);
  }

  if (missingEnglish.length > 0) {
    problems.push(`missing English translation: ${missingEnglish.join(", ")}`);
  }

  if (problems.length > 0) {
    throw new Error(
      [
        "The dedicated Playwright database is not ready for ePortfolio E2E tests.",
        ...problems,
        "Apply the current migrations and seed the 8 ready ePortfolio case studies in the test database.",
      ].join(" "),
    );
  }
}

export async function resetEportfolioTestProgress(): Promise<string> {
  const database = getDatabaseClient();

  await verifyEportfolioSeed();

  const userId = await getTestProfileId();

  await database.userCaseStudyProgress.deleteMany({
    where: {
      userId,
    },
  });

  return userId;
}

export async function readEportfolioProgress(userId: string, slug: string) {
  const database = getDatabaseClient();

  const caseStudy = await database.caseStudy.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
    },
  });

  if (!caseStudy) {
    throw new Error(`Cannot read ePortfolio progress: unknown case study slug ${slug}.`);
  }

  return database.userCaseStudyProgress.findUnique({
    where: {
      userId_caseStudyId: {
        userId,
        caseStudyId: caseStudy.id,
      },
    },
    select: {
      status: true,
      startedAt: true,
      lastOpenedAt: true,
      completedAt: true,
    },
  });
}

export async function disconnectEportfolioTestDatabase(): Promise<void> {
  if (!prisma) {
    return;
  }

  await prisma.$disconnect();
  prisma = null;
}
