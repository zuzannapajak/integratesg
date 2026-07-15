import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],

  test: {
    environment: "jsdom",

    setupFiles: ["./vitest.setup.ts"],

    include: ["tests/unit/**/*.{test,spec}.{ts,tsx}"],

    exclude: [
      "tests/e2e/**",
      "node_modules/**",
      ".next/**",
      "playwright-report/**",
      "test-results/**",
    ],

    clearMocks: true,
    restoreMocks: true,
  },
});
