import { existsSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";

// Run from the repository root before Playwright starts its managed Next.js
// development server. Do not delete .next itself: only generated dev cache.
const projectRoot = resolve(process.cwd());
const devCachePath = join(projectRoot, ".next", "dev");

if (existsSync(devCachePath)) {
  rmSync(devCachePath, {
    recursive: true,
    force: true,
    maxRetries: 5,
    retryDelay: 200,
  });
  console.info("[E2E] Cleared stale .next/dev cache before starting Next.js.");
} else {
  console.info("[E2E] No previous .next/dev cache; starting clean.");
}
