import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ScenarioHotspot } from "@/components/scenarios/simulator/scenario-hotspot";
import type { ResolvedChallenge } from "@/lib/scenarios/simulator/types";

const testChallenge = {
  id: "scenario-02-challenge-01",
  order: 1,

  hotspot: {
    x: 18,
    y: 58,
    labelSide: "bottom",
  },

  title: "Defining strategic ESG priorities",

  shortTitle: "Define ESG priorities",

  context: "Test challenge context.",

  question: "Which approach should be selected?",

  choices: [],
} satisfies ResolvedChallenge;

describe("ScenarioHotspot", () => {
  it("uses percentage coordinates from the challenge definition", () => {
    render(
      <ScenarioHotspot
        challenge={testChallenge}
        status="available"
        isCurrentObjective
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByTestId("scenario-hotspot-scenario-02-challenge-01")).toHaveStyle({
      left: "18%",
      top: "58%",
    });
  });

  it("marks the current available challenge as active", () => {
    render(
      <ScenarioHotspot
        challenge={testChallenge}
        status="available"
        isCurrentObjective
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByTestId("scenario-hotspot-scenario-02-challenge-01")).toHaveAttribute(
      "data-hotspot-state",
      "active",
    );

    expect(screen.getByTestId("scenario-board-hotspot-scenario-02-challenge-01")).toHaveAttribute(
      "aria-current",
      "step",
    );
  });

  it("renders the completed state", () => {
    render(<ScenarioHotspot challenge={testChallenge} status="completed" onSelect={vi.fn()} />);

    const hotspot = screen.getByTestId("scenario-hotspot-scenario-02-challenge-01");

    expect(hotspot).toHaveAttribute("data-hotspot-state", "completed");

    expect(hotspot).toHaveAttribute("data-challenge-status", "completed");
  });

  it("renders the locked state and disables interaction", () => {
    render(<ScenarioHotspot challenge={testChallenge} status="locked" onSelect={vi.fn()} />);

    expect(screen.getByTestId("scenario-hotspot-scenario-02-challenge-01")).toHaveAttribute(
      "data-hotspot-state",
      "locked",
    );

    expect(screen.getByTestId("scenario-board-hotspot-scenario-02-challenge-01")).toBeDisabled();
  });

  it("opens an active challenge", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <ScenarioHotspot
        challenge={testChallenge}
        status="available"
        isCurrentObjective
        onSelect={onSelect}
      />,
    );

    await user.click(screen.getByTestId("scenario-board-hotspot-scenario-02-challenge-01"));

    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("does not open a locked challenge", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(<ScenarioHotspot challenge={testChallenge} status="locked" onSelect={onSelect} />);

    await user.click(screen.getByTestId("scenario-board-hotspot-scenario-02-challenge-01"));

    expect(onSelect).not.toHaveBeenCalled();
  });

  it("uses an accessible challenge label", () => {
    render(
      <ScenarioHotspot
        challenge={testChallenge}
        status="available"
        isCurrentObjective
        onSelect={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Challenge point: Define ESG priorities. Available.",
      }),
    ).toBeVisible();
  });
});
