import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as {
  prisma?: PrismaClient;
};

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set.");
}

// A small pool can be configured per deployment (e.g. E2E on Supabase session mode).
// Keep the pg driver default (10) when the variable is not provided.
const poolMax = Number(process.env.PRISMA_PG_POOL_MAX ?? "10");
if (!Number.isSafeInteger(poolMax) || poolMax < 1) {
  throw new Error("PRISMA_PG_POOL_MAX must be a positive integer.");
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
  max: poolMax,
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
