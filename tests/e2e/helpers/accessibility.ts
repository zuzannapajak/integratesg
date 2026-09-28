import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

const defaultSettleMs = 600;

type AccessibilityScanOptions = {
  settleMs?: number;
};

export async function expectNoSeriousAccessibilityViolations(
  page: Page,
  options: AccessibilityScanOptions = {},
): Promise<void> {
  const settleMs = options.settleMs ?? defaultSettleMs;

  if (settleMs > 0) {
    await page.waitForTimeout(settleMs);
  }

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  const seriousViolations = results.violations.filter(
    (violation) => violation.impact === "serious" || violation.impact === "critical",
  );

  expect(
    seriousViolations,
    seriousViolations
      .map(
        (violation) =>
          `${violation.id}: ${violation.help}\n${violation.nodes
            .map((node) => `  ${node.target.join(" ")} — ${node.failureSummary ?? ""}`)
            .join("\n")}`,
      )
      .join("\n\n"),
  ).toEqual([]);
}
