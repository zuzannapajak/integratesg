import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  ScenarioBoard,
  type ScenarioBoardItem,
} from "@/components/scenarios/simulator/scenario-board";
import type { ResolvedChallenge } from "@/lib/scenarios/simulator/types";

const challenges = [
  {
    id: "scenario-02-challenge-01",
    order: 1,

    hotspot: {
      x: 18,
      y: 58,
      labelSide: "bottom",
    },

    title: "Defining strategic ESG priorities",

    shortTitle: "Define ESG priorities",

    context: "Test context for challenge one.",

    question: "Test question one?",

    choices: [],
  },

  {
    id: "scenario-02-challenge-02",
    order: 2,

    hotspot: {
      x: 50,
      y: 46,
      labelSide: "bottom",
    },

    title: "Managing ESG under financial pressure",

    shortTitle: "Manage financial pressure",

    context: "Test context for challenge two.",

    question: "Test question two?",

    choices: [],
  },

  {
    id: "scenario-02-challenge-03",
    order: 3,

    hotspot: {
      x: 82,
      y: 58,
      labelSide: "bottom",
    },

    title: "Creating organisational ownership",

    shortTitle: "Engage people and teams",

    context: "Test context for challenge three.",

    question: "Test question three?",

    choices: [],
  },
] satisfies readonly ResolvedChallenge[];

const boardItems = [
  {
    challenge: challenges[0],
    status: "completed",
  },

  {
    challenge: challenges[1],
    status: "available",
  },

  {
    challenge: challenges[2],
    status: "locked",
  },
] satisfies readonly ScenarioBoardItem[];

describe("ScenarioBoard", () => {
  it("uses the scenario pre-start background", () => {
    render(
      <ScenarioBoard
        backgroundImage="/scenarios/scenario-02/pre-start.png"
        boardAlt="A scenario illustration with three challenge areas."
        scenarioTitle="Strategy, Vision and Organisational Alignment"
        items={boardItems}
        onSelectChallenge={vi.fn()}
      />,
    );

    expect(screen.getByTestId("scenario-board")).toHaveAttribute(
      "data-background-image",
      "/scenarios/scenario-02/pre-start.png",
    );

    expect(
      screen.getByText("A scenario illustration with three challenge areas."),
    ).toBeInTheDocument();
  });

  it("renders all three challenge cards", () => {
    render(
      <ScenarioBoard
        backgroundImage="/scenarios/scenario-02/pre-start.png"
        boardAlt="Test board."
        scenarioTitle="Test scenario"
        items={boardItems}
        onSelectChallenge={vi.fn()}
      />,
    );

    expect(screen.getByTestId("scenario-board-card-scenario-02-challenge-01")).toBeInTheDocument();

    expect(screen.getByTestId("scenario-board-card-scenario-02-challenge-02")).toBeInTheDocument();

    expect(screen.getByTestId("scenario-board-card-scenario-02-challenge-03")).toBeInTheDocument();
  });

  it("allows opening an available challenge", async () => {
    const user = userEvent.setup();

    const onSelectChallenge = vi.fn();

    render(
      <ScenarioBoard
        backgroundImage="/scenarios/scenario-02/pre-start.png"
        boardAlt="Test board."
        scenarioTitle="Test scenario"
        items={boardItems}
        onSelectChallenge={onSelectChallenge}
      />,
    );

    await user.click(screen.getByTestId("scenario-board-card-scenario-02-challenge-02"));

    expect(onSelectChallenge).toHaveBeenCalledWith(challenges[1], 1);
  });

  it("does not allow opening a locked challenge", async () => {
    const user = userEvent.setup();

    const onSelectChallenge = vi.fn();

    render(
      <ScenarioBoard
        backgroundImage="/scenarios/scenario-02/pre-start.png"
        boardAlt="Test board."
        scenarioTitle="Test scenario"
        items={boardItems}
        onSelectChallenge={onSelectChallenge}
      />,
    );

    const lockedChallenge = screen.getByTestId("scenario-board-card-scenario-02-challenge-03");

    expect(lockedChallenge).toBeDisabled();

    await user.click(lockedChallenge);

    expect(onSelectChallenge).not.toHaveBeenCalled();
  });

  it("shows the current available objective", () => {
    render(
      <ScenarioBoard
        backgroundImage="/scenarios/scenario-02/pre-start.png"
        boardAlt="Test board."
        scenarioTitle="Test scenario"
        items={boardItems}
        onSelectChallenge={vi.fn()}
      />,
    );

    expect(
      screen.getAllByText(/Current objective: Manage financial pressure/i).length,
    ).toBeGreaterThan(0);
  });

  it("shows challenge statuses", () => {
    render(
      <ScenarioBoard
        backgroundImage="/scenarios/scenario-02/pre-start.png"
        boardAlt="Test board."
        scenarioTitle="Test scenario"
        items={boardItems}
        onSelectChallenge={vi.fn()}
      />,
    );

    expect(screen.getAllByText("Completed").length).toBeGreaterThan(0);

    expect(screen.getAllByText("Available").length).toBeGreaterThan(0);

    expect(screen.getAllByText("Locked").length).toBeGreaterThan(0);
  });
});

it("marks the current objective hotspot as active", () => {
  render(
    <ScenarioBoard
      backgroundImage="/scenarios/scenario-02/pre-start.png"
      boardAlt="Test board."
      scenarioTitle="Test scenario"
      items={boardItems}
      onSelectChallenge={vi.fn()}
    />,
  );

  expect(screen.getByTestId("scenario-hotspot-scenario-02-challenge-02")).toHaveAttribute(
    "data-hotspot-state",
    "active",
  );
});
