import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ScenarioDecisionChoice } from "@/components/scenarios/simulator/scenario-decision-choice";
import type { ResolvedChoice } from "@/lib/scenarios/simulator/types";

const testChoice = {
  id: "scenario-02-challenge-01-choice-02",
  order: 2,
  isOptimal: true,

  label: "Material priorities",

  text: "Assess material impacts, risks and stakeholder expectations before defining strategic priorities.",

  feedback: {
    title: "Correct approach",

    body: "This creates an evidence-based strategic foundation.",
  },
} satisfies ResolvedChoice;

describe("ScenarioDecisionChoice", () => {
  it("renders the decision label and text", () => {
    render(
      <ScenarioDecisionChoice
        choice={testChoice}
        groupName="test-decision"
        isSelected={false}
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByText("Material priorities")).toBeVisible();

    expect(screen.getByText(/Assess material impacts/i)).toBeVisible();
  });

  it("renders an accessible radio input", () => {
    render(
      <ScenarioDecisionChoice
        choice={testChoice}
        groupName="test-decision"
        isSelected={false}
        onSelect={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("radio", {
        name: /Material priorities/i,
      }),
    ).toBeInTheDocument();
  });

  it("reports the selected choice", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <ScenarioDecisionChoice
        choice={testChoice}
        groupName="test-decision"
        isSelected={false}
        onSelect={onSelect}
      />,
    );

    await user.click(
      screen.getByRole("radio", {
        name: /Material priorities/i,
      }),
    );

    expect(onSelect).toHaveBeenCalledWith("scenario-02-challenge-01-choice-02");

    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("shows the selected state", () => {
    render(
      <ScenarioDecisionChoice
        choice={testChoice}
        groupName="test-decision"
        isSelected
        onSelect={vi.fn()}
      />,
    );

    expect(
      screen.getByTestId("scenario-decision-choice-scenario-02-challenge-01-choice-02"),
    ).toHaveAttribute("data-selected", "true");

    expect(
      screen.getByRole("radio", {
        name: /Material priorities/i,
      }),
    ).toBeChecked();
  });

  it("disables the decision during submission", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <ScenarioDecisionChoice
        choice={testChoice}
        groupName="test-decision"
        isSelected={false}
        disabled
        onSelect={onSelect}
      />,
    );

    const radio = screen.getByRole("radio", {
      name: /Material priorities/i,
    });

    expect(radio).toBeDisabled();

    await user.click(radio);

    expect(onSelect).not.toHaveBeenCalled();
  });

  it("does not reveal whether the choice is optimal", () => {
    render(
      <ScenarioDecisionChoice
        choice={testChoice}
        groupName="test-decision"
        isSelected={false}
        onSelect={vi.fn()}
      />,
    );

    expect(screen.queryByText(/correct/i)).not.toBeInTheDocument();

    expect(screen.queryByText(/optimal/i)).not.toBeInTheDocument();
  });
});
