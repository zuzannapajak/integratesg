import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ScenarioSummary } from "@/components/scenarios/simulator/scenario-summary";
import type { ResolvedScenario } from "@/lib/scenarios/simulator/types";

const testSummary = {
  title: "You have built an aligned ESG strategy",

  body: "The organisation now has a focused approach connecting ESG priorities with business value.",

  takeaways: [
    "Use materiality to define strategic priorities.",
    "Connect ESG investment with measurable business value.",
    "Build cross-functional responsibility for implementation.",
  ],
} satisfies ResolvedScenario["summary"];

describe("ScenarioSummary", () => {
  it("renders the scenario summary", () => {
    render(
      <ScenarioSummary
        scenarioTitle="Strategy, Vision and Organisational Alignment"
        summary={testSummary}
        completedCount={3}
        totalCount={3}
        onComplete={vi.fn()}
      />,
    );

    expect(screen.getByTestId("scenario-summary")).toHaveAttribute("data-all-completed", "true");

    expect(
      screen.getByRole("heading", {
        name: "You have built an aligned ESG strategy",
      }),
    ).toBeVisible();

    expect(screen.getByText(/focused approach connecting ESG priorities/i)).toBeVisible();
  });

  it("shows the completed challenge count", () => {
    render(
      <ScenarioSummary
        scenarioTitle="Test scenario"
        summary={testSummary}
        completedCount={3}
        totalCount={3}
        onComplete={vi.fn()}
      />,
    );

    const summary = screen.getByTestId("scenario-summary");

    expect(summary).toHaveAttribute("data-completed-count", "3");

    expect(summary).toHaveAttribute("data-total-count", "3");

    expect(screen.getByLabelText("3 / 3 Challenges completed")).toBeVisible();
  });

  it("renders all key takeaways", () => {
    render(
      <ScenarioSummary
        scenarioTitle="Test scenario"
        summary={testSummary}
        completedCount={3}
        totalCount={3}
        onComplete={vi.fn()}
      />,
    );

    expect(screen.getByText("Use materiality to define strategic priorities.")).toBeVisible();

    expect(
      screen.getByText("Connect ESG investment with measurable business value."),
    ).toBeVisible();

    expect(
      screen.getByText("Build cross-functional responsibility for implementation."),
    ).toBeVisible();
  });

  it("completes the scenario after confirmation", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();

    render(
      <ScenarioSummary
        scenarioTitle="Test scenario"
        summary={testSummary}
        completedCount={3}
        totalCount={3}
        onComplete={onComplete}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Complete scenario",
      }),
    );

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("disables completion while progress is being saved", () => {
    render(
      <ScenarioSummary
        scenarioTitle="Test scenario"
        summary={testSummary}
        completedCount={3}
        totalCount={3}
        isSubmitting
        onComplete={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Saving…",
      }),
    ).toBeDisabled();
  });

  it("prevents completion when challenges are still incomplete", () => {
    render(
      <ScenarioSummary
        scenarioTitle="Test scenario"
        summary={testSummary}
        completedCount={2}
        totalCount={3}
        onComplete={vi.fn()}
      />,
    );

    expect(screen.getByTestId("scenario-summary")).toHaveAttribute("data-all-completed", "false");

    expect(
      screen.getByRole("button", {
        name: "Complete scenario",
      }),
    ).toBeDisabled();
  });

  it("displays a scenario completion error", () => {
    render(
      <ScenarioSummary
        scenarioTitle="Test scenario"
        summary={testSummary}
        completedCount={3}
        totalCount={3}
        errorMessage="The scenario could not be completed."
        onComplete={vi.fn()}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("The scenario could not be completed.");
  });
});
