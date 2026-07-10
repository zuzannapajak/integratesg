import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ScenarioPlayer } from "@/components/scenarios/simulator/scenario-player";
import type { ChoiceId, ResolvedScenario } from "@/lib/scenarios/simulator/types";

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

const secondTestChallenge = {
  id: "scenario-02-challenge-02",
  order: 2,

  hotspot: {
    x: 70,
    y: 50,
    labelSide: "bottom",
  },

  title: "Second test challenge",
  shortTitle: "Second challenge",
  context: "This is the context of the second test challenge.",
  question: "Which second decision should be selected?",

  choices: [
    {
      id: "scenario-02-challenge-02-choice-01",
      order: 1,
      isOptimal: false,
      label: "Second non-optimal choice",
      text: "This second decision is not optimal.",
      feedback: {
        title: "Try another second approach",
        body: "This choice does not complete the second challenge.",
      },
    },
    {
      id: "scenario-02-challenge-02-choice-02",
      order: 2,
      isOptimal: true,
      label: "Second optimal choice",
      text: "This second decision is optimal.",
      feedback: {
        title: "Correct second approach",
        body: "This choice completes the second challenge.",
      },
    },
    {
      id: "scenario-02-challenge-02-choice-03",
      order: 3,
      isOptimal: false,
      label: "Second alternative choice",
      text: "This second alternative is not optimal.",
      feedback: {
        title: "Consider another consequence",
        body: "This choice does not complete the second challenge.",
      },
    },
  ],
} satisfies ResolvedScenario["challenges"][number];

const twoChallengeTestScenario = {
  ...testScenario,
  challenges: [testScenario.challenges[0], secondTestChallenge],
} satisfies ResolvedScenario;

type TestUser = ReturnType<typeof userEvent.setup>;

function getAvailableChallengeButton() {
  return screen.getByTestId("scenario-board-hotspot-scenario-02-challenge-01");
}

async function openChallengeContext(user: TestUser) {
  await user.click(getAvailableChallengeButton());

  await waitFor(() => {
    expect(screen.getByTestId("scenario-player")).toHaveAttribute("data-view", "challenge");

    expect(screen.getByTestId("scenario-challenge")).toHaveAttribute(
      "data-challenge-step",
      "context",
    );
  });
}

async function continueToDecision(user: TestUser) {
  await user.click(
    screen.getByRole("button", {
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

async function openChallengeDecision(user: TestUser) {
  await openChallengeContext(user);
  await continueToDecision(user);
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

    await openChallengeContext(user);

    expect(player).toHaveAttribute(
      "data-background-image",
      "/scenarios/scenario-02/in-progress.png",
    );

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Challenge context",
      }),
    ).toBeVisible();

    expect(
      screen.queryByRole("radio", {
        name: /^Optimal choice/,
      }),
    ).not.toBeInTheDocument();

    await continueToDecision(user);

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Which decision should be selected?",
      }),
    ).toBeVisible();

    expect(
      screen.getByRole("radio", {
        name: /^Optimal choice/,
      }),
    ).toBeVisible();
  });

  it("shows feedback after confirming a decision", async () => {
    const user = userEvent.setup();

    render(<ScenarioPlayer scenario={testScenario} initialView="board" />);

    await openChallengeDecision(user);

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

    await openChallengeDecision(user);

    const progress = screen.getByTestId("scenario-progress");

    expect(progress).toHaveAttribute("data-completed-count", "0");

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

    expect(await screen.findByTestId("scenario-correct-feedback")).toBeVisible();

    expect(progress).toHaveAttribute("data-completed-count", "0");

    expect(onChallengeCompleted).not.toHaveBeenCalled();

    await user.click(
      screen.getByRole("button", {
        name: "Continue",
      }),
    );

    expect(await screen.findByTestId("scenario-summary")).toHaveAttribute(
      "data-all-completed",
      "true",
    );

    expect(screen.getByTestId("scenario-player")).toHaveAttribute("data-view", "summary");

    expect(
      screen.getByRole("button", {
        name: "Complete scenario",
      }),
    ).toBeEnabled();

    expect(await screen.findByText("Test scenario summary")).toBeVisible();

    await waitFor(() => {
      expect(progress).toHaveAttribute("data-completed-count", "1");

      expect(progress).toHaveAttribute("data-percentage", "100");

      expect(progress).toHaveAttribute("data-complete", "true");
    });

    expect(screen.getByTestId("scenario-player")).toHaveAttribute("data-view", "summary");
  });

  it("shows incorrect feedback and allows retrying the decision", async () => {
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

    await openChallengeDecision(user);

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

    expect(
      await screen.findByRole("heading", {
        level: 2,
        name: "Try another approach",
      }),
    ).toBeVisible();

    expect(screen.getByTestId("scenario-incorrect-feedback")).toHaveAttribute(
      "data-feedback-kind",
      "incorrect",
    );

    expect(onChoiceConfirmed).toHaveBeenCalledWith({
      scenarioId: "scenario-02",
      scenarioVersion: 1,
      challengeId: "scenario-02-challenge-01",
      choiceId: "scenario-02-challenge-01-choice-01",
      isOptimal: false,
      attemptNumber: 1,
    });

    expect(onChallengeCompleted).not.toHaveBeenCalled();

    await user.click(
      screen.getByRole("button", {
        name: "Try again",
      }),
    );

    await waitFor(() => {
      expect(screen.getByTestId("scenario-player")).toHaveAttribute("data-view", "challenge");
    });

    expect(screen.getByTestId("scenario-challenge")).toHaveAttribute(
      "data-challenge-step",
      "decision",
    );

    expect(screen.getByText("Attempt 2")).toBeVisible();

    expect(
      screen.getByTestId("scenario-decision-choice-scenario-02-challenge-01-choice-01"),
    ).toHaveAttribute("data-previously-tried", "true");

    expect(
      screen.getByTestId("scenario-decision-choice-scenario-02-challenge-01-choice-02"),
    ).toHaveAttribute("data-previously-tried", "false");

    expect(
      screen.getByRole("button", {
        name: "Confirm decision",
      }),
    ).toBeDisabled();

    expect(screen.getAllByRole("radio")).toHaveLength(3);

    expect(
      screen.getByRole("radio", {
        name: /^Non-optimal choice/,
      }),
    ).not.toBeChecked();
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

it("increments the attempt number after retrying", async () => {
  const user = userEvent.setup();
  const onChoiceConfirmed = vi.fn();

  render(
    <ScenarioPlayer
      scenario={testScenario}
      initialView="board"
      onChoiceConfirmed={onChoiceConfirmed}
    />,
  );

  await openChallengeDecision(user);

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

  await screen.findByTestId("scenario-incorrect-feedback");

  await user.click(
    screen.getByRole("button", {
      name: "Try again",
    }),
  );

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

  await screen.findByTestId("scenario-correct-feedback");

  expect(onChoiceConfirmed).toHaveBeenNthCalledWith(1, {
    scenarioId: "scenario-02",
    scenarioVersion: 1,
    challengeId: "scenario-02-challenge-01",
    choiceId: "scenario-02-challenge-01-choice-01",
    isOptimal: false,
    attemptNumber: 1,
  });

  expect(onChoiceConfirmed).toHaveBeenNthCalledWith(2, {
    scenarioId: "scenario-02",
    scenarioVersion: 1,
    challengeId: "scenario-02-challenge-01",
    choiceId: "scenario-02-challenge-01-choice-02",
    isOptimal: true,
    attemptNumber: 2,
  });
});

it("supports multiple retries without completing the challenge", async () => {
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

  await openChallengeDecision(user);

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

  await screen.findByTestId("scenario-incorrect-feedback");

  await user.click(
    screen.getByRole("button", {
      name: "Try again",
    }),
  );

  expect(screen.getByText("Attempt 2")).toBeVisible();

  await user.click(
    screen.getByRole("radio", {
      name: /^Alternative non-optimal choice/,
    }),
  );

  await user.click(
    screen.getByRole("button", {
      name: "Confirm decision",
    }),
  );

  await screen.findByTestId("scenario-incorrect-feedback");

  await user.click(
    screen.getByRole("button", {
      name: "Try again",
    }),
  );

  expect(screen.getByText("Attempt 3")).toBeVisible();

  expect(onChoiceConfirmed).toHaveBeenCalledTimes(2);

  expect(onChallengeCompleted).not.toHaveBeenCalled();

  expect(
    screen.getByTestId("scenario-decision-choice-scenario-02-challenge-01-choice-01"),
  ).toHaveAttribute("data-previously-tried", "true");

  expect(
    screen.getByTestId("scenario-decision-choice-scenario-02-challenge-01-choice-03"),
  ).toHaveAttribute("data-previously-tried", "true");
});

it("restores completed challenges from the initial state", () => {
  render(
    <ScenarioPlayer
      scenario={testScenario}
      initialView="board"
      initialCompletedChallengeIds={["scenario-02-challenge-01"]}
    />,
  );

  const player = screen.getByTestId("scenario-player");
  const progress = screen.getByTestId("scenario-progress");

  expect(player).toHaveAttribute("data-completed-count", "1");

  expect(screen.getByTestId("scenario-board-hotspot-scenario-02-challenge-01")).toBeDisabled();

  expect(screen.getByTestId("scenario-hotspot-scenario-02-challenge-01")).toHaveAttribute(
    "data-hotspot-state",
    "completed",
  );

  expect(progress).toHaveAttribute("data-completed-count", "1");

  expect(progress).toHaveAttribute("data-total-count", "1");

  expect(progress).toHaveAttribute("data-percentage", "100");

  expect(progress).toHaveAttribute("data-complete", "true");
});

it("does not mark the challenge as completed when completion persistence fails", async () => {
  const user = userEvent.setup();

  const onChallengeCompleted = vi
    .fn()
    .mockRejectedValue(new Error("The challenge could not be saved."));

  render(
    <ScenarioPlayer
      scenario={testScenario}
      initialView="board"
      onChallengeCompleted={onChallengeCompleted}
    />,
  );

  await openChallengeDecision(user);

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

  await screen.findByTestId("scenario-correct-feedback");

  await user.click(
    screen.getByRole("button", {
      name: "Continue",
    }),
  );

  expect(await screen.findByRole("alert")).toHaveTextContent("The challenge could not be saved.");

  expect(screen.getByTestId("scenario-player")).toHaveAttribute("data-completed-count", "0");

  expect(screen.getByTestId("scenario-player")).toHaveAttribute("data-view", "feedback");
});

it("completes the scenario only after confirming the summary", async () => {
  const user = userEvent.setup();

  const onScenarioCompleted = vi.fn();

  render(
    <ScenarioPlayer
      scenario={testScenario}
      initialView="board"
      onScenarioCompleted={onScenarioCompleted}
    />,
  );

  await openChallengeDecision(user);

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

  await screen.findByTestId("scenario-correct-feedback");

  await user.click(
    screen.getByRole("button", {
      name: "Continue",
    }),
  );

  expect(await screen.findByTestId("scenario-summary")).toBeVisible();

  expect(onScenarioCompleted).not.toHaveBeenCalled();

  await user.click(
    screen.getByRole("button", {
      name: "Complete scenario",
    }),
  );

  await waitFor(() => {
    expect(onScenarioCompleted).toHaveBeenCalledWith({
      scenarioId: "scenario-02",
      scenarioVersion: 1,
    });
  });

  expect(screen.getByTestId("scenario-player")).toHaveAttribute("data-view", "completion");

  expect(
    screen.getByRole("heading", {
      name: "Scenario completed",
    }),
  ).toBeVisible();
});

it("stays on the summary when scenario completion fails", async () => {
  const user = userEvent.setup();

  const onScenarioCompleted = vi
    .fn()
    .mockRejectedValue(new Error("The scenario could not be saved."));

  render(
    <ScenarioPlayer
      scenario={testScenario}
      initialView="board"
      onScenarioCompleted={onScenarioCompleted}
    />,
  );

  await openChallengeDecision(user);

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

  await screen.findByTestId("scenario-correct-feedback");

  await user.click(
    screen.getByRole("button", {
      name: "Continue",
    }),
  );

  await screen.findByTestId("scenario-summary");

  await user.click(
    screen.getByRole("button", {
      name: "Complete scenario",
    }),
  );

  expect(await screen.findByRole("alert")).toHaveTextContent("The scenario could not be saved.");

  expect(screen.getByTestId("scenario-player")).toHaveAttribute("data-view", "summary");

  expect(
    screen.getByRole("button", {
      name: "Complete scenario",
    }),
  ).toBeEnabled();
});

it("uses a forward transition when opening a challenge", async () => {
  const user = userEvent.setup();

  render(<ScenarioPlayer scenario={testScenario} initialView="board" />);

  await user.click(getAvailableChallengeButton());

  await waitFor(() => {
    expect(screen.getByTestId("scenario-view-transition")).toHaveAttribute(
      "data-transition-direction",
      "forward",
    );
  });

  expect(screen.getByTestId("scenario-player")).toHaveAttribute("data-view", "challenge");
});

it("uses a backward transition when returning to the board", async () => {
  const user = userEvent.setup();

  render(<ScenarioPlayer scenario={testScenario} initialView="board" />);

  await user.click(getAvailableChallengeButton());

  await user.click(
    screen.getByRole("button", {
      name: "Back to challenges",
    }),
  );

  await waitFor(() => {
    expect(screen.getByTestId("scenario-view-transition")).toHaveAttribute(
      "data-transition-direction",
      "backward",
    );
  });

  expect(screen.getByTestId("scenario-player")).toHaveAttribute("data-view", "board");
});

it("restores completed challenges and retry history", async () => {
  const user = userEvent.setup();

  const [firstChallenge, secondChallenge] = twoChallengeTestScenario.challenges;

  const rejectedChoice = secondChallenge.choices[0];

  render(
    <ScenarioPlayer
      scenario={twoChallengeTestScenario}
      initialView="board"
      initialCompletedChallengeIds={[firstChallenge.id]}
      initialAttemptCounts={{
        [secondChallenge.id]: 1,
      }}
      initialRejectedChoiceIdsByChallenge={{
        [secondChallenge.id]: [rejectedChoice.id],
      }}
    />,
  );

  expect(screen.getByTestId("scenario-progress")).toHaveAttribute("data-completed-count", "1");

  expect(screen.getByTestId(`scenario-board-hotspot-${firstChallenge.id}`)).toBeDisabled();

  await user.click(screen.getByTestId(`scenario-board-hotspot-${secondChallenge.id}`));

  await user.click(
    screen.getByRole("button", {
      name: "Continue to decision",
    }),
  );

  expect(screen.getByText("Attempt 2")).toBeVisible();

  expect(screen.getByText("Previously tried")).toBeVisible();

  expect(screen.getByTestId(`scenario-decision-choice-${rejectedChoice.id}`)).toHaveAttribute(
    "data-previously-tried",
    "true",
  );
});

it("resumes from the decision step after a previously rejected choice", () => {
  const challenge = testScenario.challenges[0];

  const incorrectChoice = challenge.choices.find((choice) => !choice.isOptimal);

  if (!incorrectChoice) {
    throw new Error("The test requires an incorrect choice.");
  }

  render(
    <ScenarioPlayer
      scenario={testScenario}
      initialView="challenge"
      initialChallengeId={challenge.id}
      initialChallengeStep="decision"
      initialAttemptCounts={{
        [challenge.id]: 1,
      }}
      initialRejectedChoiceIdsByChallenge={{
        [challenge.id]: [incorrectChoice.id],
      }}
    />,
  );

  expect(screen.getByText("Attempt 2")).toBeVisible();

  expect(screen.getByText("Previously tried")).toBeVisible();

  expect(
    screen.queryByRole("button", {
      name: "Continue to decision",
    }),
  ).not.toBeInTheDocument();

  expect(
    screen.getByRole("button", {
      name: "Confirm decision",
    }),
  ).toBeDisabled();
});

it("restores correct feedback after an optimal choice was saved", () => {
  const challenge = testScenario.challenges[0];

  const optimalChoice = challenge.choices.find((choice) => choice.isOptimal);

  if (!optimalChoice) {
    throw new Error("The test requires an optimal choice.");
  }

  render(
    <ScenarioPlayer
      scenario={testScenario}
      initialView="feedback"
      initialChallengeId={challenge.id}
      initialChallengeStep="decision"
      initialSelectedChoiceId={optimalChoice.id}
      initialAttemptCounts={{
        [challenge.id]: 1,
      }}
    />,
  );

  expect(screen.getByTestId("scenario-correct-feedback")).toBeVisible();

  expect(
    screen.getByRole("button", {
      name: "Continue",
    }),
  ).toBeEnabled();
});

it("ignores an invalid initial selected choice", () => {
  const challenge = testScenario.challenges[0];

  render(
    <ScenarioPlayer
      scenario={testScenario}
      initialView="feedback"
      initialChallengeId={challenge.id}
      initialSelectedChoiceId={"invalid-choice" as ChoiceId}
    />,
  );

  expect(screen.queryByTestId("scenario-correct-feedback")).not.toBeInTheDocument();

  expect(screen.queryByTestId("scenario-incorrect-feedback")).not.toBeInTheDocument();
});
