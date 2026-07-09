import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ScenarioPlayer } from "@/components/scenarios/simulator/scenario-player";
import type { ResolvedScenario } from "@/lib/scenarios/simulator/types";

const testScenario = {
  id: "scenario-02",
  slug: "scenario-02",
  order: 2,

  curriculumModuleSlug: "module-2-strategy-vision-and-organisational-alignment",

  sourcePartner: "CleverMind",
  version: 1,
  estimatedDurationMinutes: 15,

  assets: {
    preStartBackground: "/scenarios/scenario-02/pre-start.png",
    inProgressBackground: "/scenarios/scenario-02/in-progress.png",
  },

  pathwayPosition: {
    x: 32,
    y: 27,
    labelSide: "bottom",
  },

  locale: "en",

  title: "Strategy, Vision and Organisational Alignment",
  shortTitle: "Strategy & Alignment",
  subtitle: "Test scenario subtitle",
  introduction: "This is the introduction to the test scenario.",
  organisation: "NordForm Components",
  role: "Strategy and Sustainability Manager",
  objectives: ["Understand strategic priorities."],
  boardAlt: "A test illustration showing a company strategy workshop.",

  challenges: [
    {
      id: "scenario-02-challenge-01",
      order: 1,

      hotspot: {
        x: 25,
        y: 50,
        labelSide: "bottom",
      },

      title: "Test challenge",
      shortTitle: "Test challenge",
      context: "This is the context of the test challenge.",
      question: "Which decision should be selected?",

      choices: [
        {
          id: "scenario-02-challenge-01-choice-01",
          order: 1,
          isOptimal: false,
          label: "Non-optimal choice",
          text: "This decision is not optimal.",
          feedback: {
            title: "Try another approach",
            body: "This choice does not complete the challenge.",
          },
        },
        {
          id: "scenario-02-challenge-01-choice-02",
          order: 2,
          isOptimal: true,
          label: "Optimal choice",
          text: "This decision is optimal.",
          feedback: {
            title: "Correct approach",
            body: "This choice completes the challenge.",
          },
        },
        {
          id: "scenario-02-challenge-01-choice-03",
          order: 3,
          isOptimal: false,
          label: "Alternative non-optimal choice",
          text: "This decision is also not optimal.",
          feedback: {
            title: "Consider the consequences",
            body: "This choice does not complete the challenge.",
          },
        },
      ],
    },
  ],

  summary: {
    title: "Test scenario summary",
    body: "The test scenario has been completed.",
    takeaways: ["This is the main test takeaway."],
  },
} satisfies ResolvedScenario;

function getAvailableChallengeButton() {
  return screen.getByTestId("scenario-board-card-scenario-02-challenge-01");
}

describe("ScenarioPlayer", () => {
  it("uses the pre-start background until the scenario is started", async () => {
    const user = userEvent.setup();

    render(<ScenarioPlayer scenario={testScenario} />);

    const player = screen.getByTestId("scenario-player");

    expect(player).toHaveAttribute("data-view", "intro");
    expect(player).toHaveAttribute("data-background-image", "/scenarios/scenario-02/pre-start.png");

    await user.click(
      screen.getByRole("button", {
        name: "Continue",
      }),
    );

    // Continue only changes the internal ScenarioIntro step.
    expect(player).toHaveAttribute("data-view", "intro");
    expect(player).toHaveAttribute("data-background-image", "/scenarios/scenario-02/pre-start.png");

    await user.click(
      screen.getByRole("button", {
        name: "Start scenario",
      }),
    );

    await waitFor(() => {
      expect(player).toHaveAttribute("data-view", "board");
    });

    expect(player).toHaveAttribute("data-background-image", "/scenarios/scenario-02/pre-start.png");
  });

  it("switches to the in-progress background after opening a challenge", async () => {
    const user = userEvent.setup();

    render(<ScenarioPlayer scenario={testScenario} initialView="board" />);

    const player = screen.getByTestId("scenario-player");

    await user.click(getAvailableChallengeButton());

    expect(player).toHaveAttribute("data-view", "challenge");
    expect(player).toHaveAttribute(
      "data-background-image",
      "/scenarios/scenario-02/in-progress.png",
    );

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Which decision should be selected?",
      }),
    ).toBeVisible();
  });

  it("shows feedback after confirming a decision", async () => {
    const user = userEvent.setup();

    render(<ScenarioPlayer scenario={testScenario} initialView="board" />);

    await user.click(getAvailableChallengeButton());

    await user.click(
      screen.getByRole("radio", {
        name: /^Optimal choice/,
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "Confirm decision",
      }),
    );

    expect(await screen.findByText("Correct approach")).toBeVisible();

    expect(screen.getByTestId("scenario-player")).toHaveAttribute("data-view", "feedback");
  });

  it("completes a challenge and moves to the scenario summary", async () => {
    const user = userEvent.setup();
    const onChoiceConfirmed = vi.fn();
    const onChallengeCompleted = vi.fn();

    render(
      <ScenarioPlayer
        scenario={testScenario}
        initialView="board"
        onChoiceConfirmed={onChoiceConfirmed}
        onChallengeCompleted={onChallengeCompleted}
      />,
    );

    await user.click(getAvailableChallengeButton());

    await user.click(
      screen.getByRole("radio", {
        name: /^Optimal choice/,
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "Confirm decision",
      }),
    );

    await screen.findByText("Correct approach");

    await user.click(
      screen.getByRole("button", {
        name: "Continue",
      }),
    );

    expect(await screen.findByText("Test scenario summary")).toBeVisible();

    await waitFor(() => {
      expect(onChoiceConfirmed).toHaveBeenCalledTimes(1);
      expect(onChallengeCompleted).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByTestId("scenario-player")).toHaveAttribute("data-view", "summary");
  });

  it("allows retrying after a non-optimal choice", async () => {
    const user = userEvent.setup();

    render(<ScenarioPlayer scenario={testScenario} initialView="board" />);

    await user.click(getAvailableChallengeButton());

    await user.click(
      screen.getByRole("radio", {
        name: /^Non-optimal choice/,
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "Confirm decision",
      }),
    );

    expect(await screen.findByText("Try another approach")).toBeVisible();

    await user.click(
      screen.getByRole("button", {
        name: "Try again",
      }),
    );

    await waitFor(() => {
      expect(screen.getByTestId("scenario-player")).toHaveAttribute("data-view", "challenge");
    });

    expect(
      screen.getByRole("button", {
        name: "Confirm decision",
      }),
    ).toBeDisabled();
  });

  it("reports that the scenario has been started after the second intro step", async () => {
    const user = userEvent.setup();
    const onScenarioStarted = vi.fn();

    render(<ScenarioPlayer scenario={testScenario} onScenarioStarted={onScenarioStarted} />);

    await user.click(
      screen.getByRole("button", {
        name: "Continue",
      }),
    );

    expect(onScenarioStarted).not.toHaveBeenCalled();

    await user.click(
      screen.getByRole("button", {
        name: "Start scenario",
      }),
    );

    await waitFor(() => {
      expect(onScenarioStarted).toHaveBeenCalledWith({
        scenarioId: "scenario-02",
        scenarioVersion: 1,
        locale: "en",
      });

      expect(screen.getByTestId("scenario-player")).toHaveAttribute("data-view", "board");
    });
  });
});
