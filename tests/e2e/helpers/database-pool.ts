/**
 * Each Playwright fixture creates its own PrismaPg adapter. Cap its pg pool so
 * it can coexist with the Next.js application's pool on a small test DB.
 * This is not a total number of sessions across processes.
 */
export const E2E_PG_POOL_MAX = 2;
