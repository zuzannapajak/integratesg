import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ScenarioPlayer } from "@/components/scenarios/simulator/scenario-player";
import type { ResolvedScenario } from "@/lib/scenarios/simulator/types";

const playerScenario = {
  id: "scenario-01",
  slug: "scenario-01",
  order: 1,
  curriculumModuleSlug: "module-1-introduction-to-esg-and-sustainable-development",
  sourcePartner: "IoD",
  version: 3,
  estimatedDurationMinutes: 12,
  assets: {
    preStartBackground: "/scenarios/scenario-01/pre-start.png",
    inProgressBackground: "/scenarios/scenario-01/in-progress.png",
  },
  pathwayPosition: {
    x: 20,
    y: 45,
    labelSide: "bottom",
  },
  locale: "en",
  title: "Player logic test scenario",
  shortTitle: "Player logic",
  subtitle: "Scenario used to verify player state transitions.",
  introduction: "Test introduction.",
  organisation: "Test organisation",
  role: "Test manager",
  objectives: ["Verify player behaviour."],
  boardAlt: "A test board with two challenges.",
  challenges: [
    {
      id: "scenario-01-challenge-01",
      order: 1,
      hotspot: {
        x: 30,
        y: 50,
        labelSide: "bottom",
      },
      title: "First challenge",
      shortTitle: "First challenge",
      context: "First challenge context.",
      question: "Choose the first decision.",
      choices: [
        {
          id: "scenario-01-challenge-01-choice-01",
          order: 1,
          isOptimal: false,
          label: "First incorrect choice",
          text: "An incorrect first choice.",
          feedback: {
            title: "First choice is incorrect",
            body: "Try the first challenge again.",
          },
        },
        {
          id: "scenario-01-challenge-01-choice-02",
          order: 2,
          isOptimal: true,
          label: "First optimal choice",
          text: "The optimal first choice.",
          feedback: {
            title: "First choice is correct",
            body: "The first challenge can be completed.",
          },
        },
        {
          id: "scenario-01-challenge-01-choice-03",
          order: 3,
          isOptimal: false,
          label: "First alternative choice",
          text: "Another incorrect first choice.",
          feedback: {
            title: "First alternative is incorrect",
            body: "Try the first challenge again.",
          },
        },
      ],
    },
    {
      id: "scenario-01-challenge-02",
      order: 2,
      hotspot: {
        x: 70,
        y: 50,
        labelSide: "bottom",
      },
      title: "Second challenge",
      shortTitle: "Second challenge",
      context: "Second challenge context.",
      question: "Choose the second decision.",
      choices: [
        {
          id: "scenario-01-challenge-02-choice-01",
          order: 1,
          isOptimal: false,
          label: "Second incorrect choice",
          text: "An incorrect second choice.",
          feedback: {
            title: "Second choice is incorrect",
            body: "Try the second challenge again.",
          },
        },
        {
          id: "scenario-01-challenge-02-choice-02",
          order: 2,
          isOptimal: true,
          label: "Second optimal choice",
          text: "The optimal second choice.",
          feedback: {
            title: "Second choice is correct",
            body: "The second challenge can be completed.",
          },
        },
        {
          id: "scenario-01-challenge-02-choice-03",
          order: 3,
          isOptimal: false,
          label: "Second alternative choice",
          text: "Another incorrect second choice.",
          feedback: {
            title: "Second alternative is incorrect",
            body: "Try the second challenge again.",
          },
        },
      ],
    },
  ],
  summary: {
    title: "Player logic summary",
    body: "Both challenges were completed.",
    takeaways: ["The player preserves consistent state."],
  },
} satisfies ResolvedScenario;

type TestUser = ReturnType<typeof userEvent.setup>;

function createDeferred<T = void>() {
  let resolve!: (value: T | PromiseLike<T>) => void;

  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise;
  });

  return {
    promise,
    resolve,
  };
}

function getChallengeHotspot(challengeNumber: "01" | "02") {
  return screen.getByTestId(
    `scenario-board-hotspot-scenario-01-challenge-${challengeNumber}`,
  );
}

async function openChallengeDecision(
  user: TestUser,
  challengeNumber: "01" | "02" = "01",
) {
  await user.click(getChallengeHotspot(challengeNumber));

  await user.click(
    await screen.findByRole("button", {
      name: "Continue to decision",
    }),
  );

  await waitFor(() => {
    expect(screen.getByTestId("scenario-challenge")).toHaveAttribute(
      "data-challenge-step",
      "decision",
    );
  });
}

describe("ScenarioPlayer state and persistence logic", () => {
  it("keeps the intro state after a failed start and allows a safe retry", async () => {
    const user = userEvent.setup();

    const onScenarioStarted = vi
      .fn()
      .mockRejectedValueOnce(new Error("Start persistence failed."))
      .mockResolvedValueOnce(undefined);

    render(
      <ScenarioPlayer
        scenario={playerScenario}
        onScenarioStarted={onScenarioStarted}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Continue",
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "Start scenario",
      }),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Start persistence failed.",
    );

    expect(screen.getByTestId("scenario-player")).toHaveAttribute(
      "data-view",
      "intro",
    );

    const retryButton = screen.getByRole("button", {
      name: "Start scenario",
    });

    expect(retryButton).toBeEnabled();

    await user.click(retryButton);

    await waitFor(() => {
      expect(screen.getByTestId("scenario-player")).toHaveAttribute(
        "data-view",
        "board",
      );
    });

    expect(onScenarioStarted).toHaveBeenCalledTimes(2);
  });

  it("does not increment attempts or record a rejected choice when decision persistence fails", async () => {
    const user = userEvent.setup();

    const onChoiceConfirmed = vi
      .fn()
      .mockRejectedValueOnce(new Error("Decision persistence failed."))
      .mockResolvedValueOnce(undefined);

    render(
      <ScenarioPlayer
        scenario={playerScenario}
        initialView="board"
        onChoiceConfirmed={onChoiceConfirmed}
      />,
    );

    await openChallengeDecision(user);

    await user.click(
      screen.getByRole("radio", {
        name: /^First incorrect choice/,
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "Confirm decision",
      }),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Decision persistence failed.",
    );

    expect(screen.getByTestId("scenario-player")).toHaveAttribute(
      "data-view",
      "challenge",
    );

    expect(screen.getByText("Attempt 1")).toBeVisible();

    expect(
      screen.getByTestId(
        "scenario-decision-choice-scenario-01-challenge-01-choice-01",
      ),
    ).toHaveAttribute("data-previously-tried", "false");

    await user.click(
      screen.getByRole("button", {
        name: "Confirm decision",
      }),
    );

    expect(
      await screen.findByTestId("scenario-incorrect-feedback"),
    ).toBeVisible();

    expect(onChoiceConfirmed).toHaveBeenNthCalledWith(1, {
      scenarioId: "scenario-01",
      scenarioVersion: 3,
      challengeId: "scenario-01-challenge-01",
      choiceId: "scenario-01-challenge-01-choice-01",
      isOptimal: false,
      attemptNumber: 1,
    });

    expect(onChoiceConfirmed).toHaveBeenNthCalledWith(2, {
      scenarioId: "scenario-01",
      scenarioVersion: 3,
      challengeId: "scenario-01-challenge-01",
      choiceId: "scenario-01-challenge-01-choice-01",
      isOptimal: false,
      attemptNumber: 1,
    });
  });

  it("prevents duplicate start persistence while the first request is pending", async () => {
    const user = userEvent.setup();
    const deferredStart = createDeferred();

    const onScenarioStarted = vi.fn(() => deferredStart.promise);

    render(
      <ScenarioPlayer
        scenario={playerScenario}
        onScenarioStarted={onScenarioStarted}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Continue",
      }),
    );

    const startButton = screen.getByRole("button", {
      name: "Start scenario",
    });

    await user.click(startButton);

    expect(onScenarioStarted).toHaveBeenCalledTimes(1);
    expect(startButton).toBeDisabled();

    await user.click(startButton);

    expect(onScenarioStarted).toHaveBeenCalledTimes(1);

    await act(async () => {
      deferredStart.resolve();
      await deferredStart.promise;
    });

    await waitFor(() => {
      expect(screen.getByTestId("scenario-player")).toHaveAttribute(
        "data-view",
        "board",
      );
    });
  });

  it("unlocks the next challenge only after the previous challenge is completed", async () => {
    const user = userEvent.setup();

    render(
      <ScenarioPlayer
        scenario={playerScenario}
        initialView="board"
      />,
    );

    const firstHotspot = getChallengeHotspot("01");
    const secondHotspot = getChallengeHotspot("02");

    expect(firstHotspot).toBeEnabled();
    expect(secondHotspot).toBeDisabled();

    await openChallengeDecision(user, "01");

    await user.click(
      screen.getByRole("radio", {
        name: /^First optimal choice/,
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "Confirm decision",
      }),
    );

    await user.click(
      await screen.findByRole("button", {
        name: "Continue",
      }),
    );

    await waitFor(() => {
      expect(screen.getByTestId("scenario-player")).toHaveAttribute(
        "data-view",
        "board",
      );
    });

    expect(getChallengeHotspot("01")).toBeDisabled();
    expect(getChallengeHotspot("02")).toBeEnabled();

    expect(screen.getByTestId("scenario-progress")).toHaveAttribute(
      "data-completed-count",
      "1",
    );
  });

  it("runs the complete review flow without calling persistence callbacks", async () => {
    const user = userEvent.setup();
    const onScenarioStarted = vi.fn();
    const onChoiceConfirmed = vi.fn();
    const onChallengeCompleted = vi.fn();
    const onScenarioCompleted = vi.fn();

    render(
      <ScenarioPlayer
        scenario={playerScenario}
        mode="review"
        onScenarioStarted={onScenarioStarted}
        onChoiceConfirmed={onChoiceConfirmed}
        onChallengeCompleted={onChallengeCompleted}
        onScenarioCompleted={onScenarioCompleted}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Continue",
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "Start scenario",
      }),
    );

    await waitFor(() => {
      expect(screen.getByTestId("scenario-player")).toHaveAttribute(
        "data-view",
        "board",
      );
    });

    expect(onScenarioStarted).not.toHaveBeenCalled();
    expect(getChallengeHotspot("01")).toBeEnabled();
    expect(getChallengeHotspot("02")).toBeEnabled();

    await openChallengeDecision(user, "01");

    await user.click(
      screen.getByRole("radio", {
        name: /^First optimal choice/,
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "Confirm decision",
      }),
    );

    await user.click(
      await screen.findByRole("button", {
        name: "Continue",
      }),
    );

    await waitFor(() => {
      expect(screen.getByTestId("scenario-player")).toHaveAttribute(
        "data-view",
        "board",
      );
    });

    await openChallengeDecision(user, "02");

    await user.click(
      screen.getByRole("radio", {
        name: /^Second optimal choice/,
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "Confirm decision",
      }),
    );

    await user.click(
      await screen.findByRole("button", {
        name: "Continue",
      }),
    );

    expect(await screen.findByTestId("scenario-summary")).toBeVisible();

    await user.click(
      screen.getByRole("button", {
        name: "Complete scenario",
      }),
    );

    await waitFor(() => {
      expect(screen.getByTestId("scenario-player")).toHaveAttribute(
        "data-view",
        "completion",
      );
    });

    expect(onChoiceConfirmed).not.toHaveBeenCalled();
    expect(onChallengeCompleted).not.toHaveBeenCalled();
    expect(onScenarioCompleted).not.toHaveBeenCalled();

    expect(screen.getByTestId("scenario-progress")).toHaveAttribute(
      "data-completed-count",
      "2",
    );
  });
});
