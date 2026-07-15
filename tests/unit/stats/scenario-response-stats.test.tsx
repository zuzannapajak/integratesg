import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";

import ScenarioResponseStats from "@/components/stats/scenario-response-stats";
import type { AdminScenarioResponseStat } from "@/lib/admin/types";
import messages from "@/messages/admin-stats-shells/en.json";

const rows: AdminScenarioResponseStat[] = [
  {
    scenarioId: "scenario-01",
    scenarioTitle: "ESG foundations",
    challengeId: "challenge-01",
    challengeTitle: "Select the best first action",
    challengeRuns: 4,
    totalDecisions: 6,
    runsWithRetry: 2,
    retryDecisions: 2,
    retryRate: 50,
    averageRetriesPerRun: 0.5,
    choices: [
      {
        choiceId: "choice-a",
        choiceLabel: "Start with a materiality assessment",
        isOptimal: true,
        selections: 4,
        sharePercent: 67,
      },
      {
        choiceId: "choice-b",
        choiceLabel: "Publish targets immediately",
        isOptimal: false,
        selections: 2,
        sharePercent: 33,
      },
    ],
  },
];

function renderComponent(query = "") {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ScenarioResponseStats rows={rows} query={query} />
    </NextIntlClientProvider>,
  );
}

describe("ScenarioResponseStats", () => {
  it("renders response shares and retry metrics", () => {
    renderComponent();

    expect(screen.getByRole("heading", { name: "ESG foundations" })).toBeVisible();
    expect(screen.getByText("Select the best first action")).toBeVisible();
    expect(screen.getByText("Start with a materiality assessment")).toBeVisible();
    expect(screen.getByText("Optimal choice")).toBeVisible();
    expect(screen.getByText("Selections: 4")).toBeVisible();
    expect(screen.getByText("67%")).toBeVisible();
    expect(screen.getAllByText("50%").length).toBeGreaterThan(0);
  });

  it("filters rows by choice label", () => {
    renderComponent("materiality");

    expect(screen.getByRole("heading", { name: "ESG foundations" })).toBeVisible();
  });

  it("shows an empty state when the current search does not match", () => {
    renderComponent("unmatched phrase");

    expect(screen.getByText("No response statistics available")).toBeVisible();
  });
});
