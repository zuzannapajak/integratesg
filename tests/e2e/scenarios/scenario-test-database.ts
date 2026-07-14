import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const SCENARIO_ID = "scenario-02";
const SCENARIO_VERSION = 1;

let prisma: PrismaClient | null = null;

function requireEnvironmentVariable(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(
      `Missing ${name}. Configure the Playwright scenario test environment before running E2E tests.`,
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
      "Missing PLAYWRIGHT_DATABASE_URL or TEST_DATABASE_URL for the scenario E2E test.",
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

export function getScenarioTestCredentials() {
  return {
    email: requireEnvironmentVariable("PLAYWRIGHT_TEST_EMAIL"),
    password: requireEnvironmentVariable("PLAYWRIGHT_TEST_PASSWORD"),
  };
}

export async function resetScenarioTestProgress(): Promise<string> {
  const database = getDatabaseClient();
  const { email } = getScenarioTestCredentials();

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

  await database.userScenarioAttempt.deleteMany({
    where: {
      userId: profile.id,
      scenarioId: SCENARIO_ID,
      scenarioVersion: SCENARIO_VERSION,
    },
  });

  return profile.id;
}

export async function readCompletedScenarioAttempt(userId: string) {
  const database = getDatabaseClient();

  return database.userScenarioAttempt.findFirst({
    where: {
      userId,
      scenarioId: SCENARIO_ID,
      scenarioVersion: SCENARIO_VERSION,
      status: "completed",
    },
    orderBy: {
      attemptNumber: "desc",
    },
    include: {
      choiceAttempts: {
        orderBy: [
          {
            confirmedAt: "asc",
          },
          {
            attemptNumber: "asc",
          },
        ],
      },
      challengeCompletions: {
        orderBy: {
          completedAt: "asc",
        },
      },
    },
  });
}

export async function disconnectScenarioTestDatabase(): Promise<void> {
  if (!prisma) {
    return;
  }

  await prisma.$disconnect();
  prisma = null;
}
