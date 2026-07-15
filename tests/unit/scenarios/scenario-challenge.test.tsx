import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import {
  ScenarioChallenge,
  type ScenarioChallengeStep,
} from "@/components/scenarios/simulator/scenario-challenge";
import type { ChoiceId, ResolvedChallenge } from "@/lib/scenarios/simulator/types";

const testChallenge = {
  id: "scenario-02-challenge-01",
  order: 1,

  hotspot: {
    x: 25,
    y: 50,
    labelSide: "bottom",
  },

  title: "Defining strategic ESG priorities",

  shortTitle: "Define ESG priorities",

  context:
    "The management board needs a clear method for deciding which ESG topics should be addressed first.",

  question: "Which approach should the organisation use?",

  choices: [
    {
      id: "scenario-02-challenge-01-choice-01",
      order: 1,
      isOptimal: false,
      label: "Visible actions",
      text: "Choose several highly visible short-term sustainability actions.",
      feedback: {
        body: "Visible actions do not provide a reliable strategic foundation.",
      },
    },
    {
      id: "scenario-02-challenge-01-choice-02",
      order: 2,
      isOptimal: true,
      label: "Material priorities",
      text: "Assess material impacts, risks and stakeholder expectations.",
      feedback: {
        body: "This creates an evidence-based strategic foundation.",
      },
    },
    {
      id: "scenario-02-challenge-01-choice-03",
      order: 3,
      isOptimal: false,
      label: "Every ESG topic",
      text: "Include every possible ESG topic in the strategy immediately.",
      feedback: {
        body: "The proposed scope is too broad to implement effectively.",
      },
    },
  ],
} satisfies ResolvedChallenge;

type ChallengeHarnessProps = {
  readonly initialStep?: ScenarioChallengeStep;

  readonly attemptNumber?: number;

  readonly previouslyTriedChoiceIds?: readonly ChoiceId[];

  readonly onConfirm?: () => void;

  readonly onBackToBoard?: () => void;
};

function ChallengeHarness({
  initialStep = "context",
  attemptNumber = 1,
  previouslyTriedChoiceIds = [],
  onConfirm = vi.fn(),
  onBackToBoard = vi.fn(),
}: ChallengeHarnessProps) {
  const [selectedChoiceId, setSelectedChoiceId] = useState<ChoiceId | null>(null);

  return (
    <ScenarioChallenge
      challenge={testChallenge}
      selectedChoiceId={selectedChoiceId}
      initialStep={initialStep}
      onSelectChoice={setSelectedChoiceId}
      onConfirm={onConfirm}
      onBackToBoard={onBackToBoard}
      attemptNumber={attemptNumber}
      previouslyTriedChoiceIds={previouslyTriedChoiceIds}
    />
  );
}

describe("ScenarioChallenge", () => {
  it("shows the challenge context first", () => {
    render(<ChallengeHarness />);

    const challenge = screen.getByTestId("scenario-challenge");

    expect(challenge).toHaveAttribute("data-challenge-step", "context");

    expect(
      screen.getByRole("heading", {
        name: "Defining strategic ESG priorities",
      }),
    ).toBeVisible();

    expect(screen.getByText(/management board needs a clear method/i)).toBeVisible();

    expect(screen.queryByRole("radio")).not.toBeInTheDocument();
  });

  it("moves from context to the decision step", async () => {
    const user = userEvent.setup();

    render(<ChallengeHarness />);

    await user.click(
      screen.getByRole("button", {
        name: "Continue to decision",
      }),
    );

    expect(screen.getByTestId("scenario-challenge")).toHaveAttribute(
      "data-challenge-step",
      "decision",
    );

    expect(
      screen.getByRole("heading", {
        name: "Which approach should the organisation use?",
      }),
    ).toBeVisible();

    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });

  it("keeps confirmation disabled until an option is selected", async () => {
    const user = userEvent.setup();

    render(<ChallengeHarness initialStep="decision" />);

    const confirmButton = screen.getByRole("button", {
      name: "Confirm decision",
    });

    expect(confirmButton).toBeDisabled();

    await user.click(
      screen.getByRole("radio", {
        name: /Material priorities/i,
      }),
    );

    expect(confirmButton).toBeEnabled();
  });

  it("confirms the selected decision", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    render(<ChallengeHarness initialStep="decision" onConfirm={onConfirm} />);

    await user.click(
      screen.getByRole("radio", {
        name: /Material priorities/i,
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "Confirm decision",
      }),
    );

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("returns from the decision to the context", async () => {
    const user = userEvent.setup();

    render(<ChallengeHarness initialStep="decision" />);

    await user.click(
      screen.getByRole("button", {
        name: "Back",
      }),
    );

    expect(screen.getByTestId("scenario-challenge")).toHaveAttribute(
      "data-challenge-step",
      "context",
    );
  });

  it("returns to the scenario board", async () => {
    const user = userEvent.setup();
    const onBackToBoard = vi.fn();

    render(<ChallengeHarness onBackToBoard={onBackToBoard} />);

    await user.click(
      screen.getByRole("button", {
        name: "Back to challenges",
      }),
    );

    expect(onBackToBoard).toHaveBeenCalledTimes(1);
  });

  it("can start directly on the decision step for a retry", () => {
    render(<ChallengeHarness initialStep="decision" />);

    expect(screen.getByTestId("scenario-challenge")).toHaveAttribute(
      "data-challenge-step",
      "decision",
    );

    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });
});

it("marks the selected decision card", async () => {
  const user = userEvent.setup();

  render(<ChallengeHarness initialStep="decision" />);

  await user.click(
    screen.getByRole("radio", {
      name: /Material priorities/i,
    }),
  );

  expect(
    screen.getByTestId("scenario-decision-choice-scenario-02-challenge-01-choice-02"),
  ).toHaveAttribute("data-selected", "true");
});

it("shows the next attempt and previously tried decision", () => {
  render(
    <ChallengeHarness
      initialStep="decision"
      attemptNumber={2}
      previouslyTriedChoiceIds={["scenario-02-challenge-01-choice-01"]}
    />,
  );

  expect(screen.getByText("Attempt 2")).toBeVisible();

  expect(
    screen.getByTestId("scenario-decision-choice-scenario-02-challenge-01-choice-01"),
  ).toHaveAttribute("data-previously-tried", "true");

  expect(
    screen.getByTestId("scenario-decision-choice-scenario-02-challenge-01-choice-02"),
  ).toHaveAttribute("data-previously-tried", "false");
});
