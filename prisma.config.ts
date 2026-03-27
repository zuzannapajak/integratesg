import "dotenv/config";
import { defineConfig } from "prisma/config";

const directUrl = process.env.DIRECT_URL;

if (!directUrl) {
  throw new Error("Missing DIRECT_URL environment variable.");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: directUrl,
  },
  migrations: {
    path: "prisma/migrations",
    seed: "node prisma/seed.js",
  },
});
