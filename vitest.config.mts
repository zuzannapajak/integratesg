import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],

  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],

    include: ["tests/unit/**/*.{test,spec}.{js,jsx,ts,tsx}"],

    exclude: [
      "tests/e2e/**",
      "node_modules/**",
      ".next/**",
      "playwright-report/**",
      "test-results/**",
    ],

    clearMocks: true,
    restoreMocks: true,

    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "html"],
      reportsDirectory: "coverage",
      reportOnFailure: true,

      /*
       * These large UI orchestration shells are covered by dedicated
       * component tests and stateful Playwright flows. Keeping them in the
       * global logic-oriented branch threshold makes the metric depend on
       * which UI component happened to be imported by a test.
       */
      exclude: [
        "components/curriculum/certificate-download-button.tsx",
        "components/curriculum/course-detail-shell.tsx",
        "components/curriculum/curriculum-list-shell.tsx",
        "components/curriculum/module-player-shell.tsx",
      ],

      thresholds: {
        lines: 75,
        statements: 75,
        functions: 75,
        branches: 70,
      },
    },
  },
});
