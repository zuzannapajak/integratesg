import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],

  test: {
    environment: "node",

    setupFiles: ["./tests/integration/setup/database.ts"],

    include: ["tests/integration/**/*.{test,spec}.ts"],

    exclude: [
      "tests/unit/**",
      "tests/e2e/**",
      "node_modules/**",
      ".next/**",
      "playwright-report/**",
      "test-results/**",
    ],

    clearMocks: true,
    restoreMocks: true,
    fileParallelism: false,

    sequence: {
      concurrent: false,
    },

    hookTimeout: 30_000,
    testTimeout: 30_000,
  },
});
