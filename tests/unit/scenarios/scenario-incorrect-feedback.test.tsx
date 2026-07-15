import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ScenarioIncorrectFeedback } from "@/components/scenarios/simulator/scenario-incorrect-feedback";
import type { ResolvedChallenge, ResolvedChoice } from "@/lib/scenarios/simulator/types";

const testChoice = {
  id: "scenario-02-challenge-01-choice-01",
  order: 1,
  isOptimal: false,

  label: "Visible short-term actions",

  text: "Choose several highly visible sustainability initiatives without first identifying material ESG priorities.",

  feedback: {
    title: "Visibility is not a strategy",

    body: "This approach focuses on actions that are easy to communicate rather than the issues that are most important to the organisation and its stakeholders.",

    consequence:
      "Resources may be directed towards low-impact initiatives while material risks and opportunities remain unaddressed.",

    takeaway: "Start by identifying material impacts, risks and stakeholder expectations.",
  },
} satisfies ResolvedChoice;

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

  context: "The organisation must define its ESG priorities.",

  question: "Which approach should be selected?",

  choices: [testChoice],
} satisfies ResolvedChallenge;

describe("ScenarioIncorrectFeedback", () => {
  it("renders the incorrect feedback content", () => {
    render(
      <ScenarioIncorrectFeedback
        challenge={testChallenge}
        choice={testChoice}
        onTryAgain={vi.fn()}
      />,
    );

    expect(screen.getByTestId("scenario-incorrect-feedback")).toHaveAttribute(
      "data-feedback-kind",
      "incorrect",
    );

    expect(
      screen.getByRole("heading", {
        name: "Visibility is not a strategy",
      }),
    ).toBeVisible();

    expect(screen.getByText(/focuses on actions that are easy to communicate/i)).toBeVisible();
  });

  it("shows the decision selected by the learner", () => {
    render(
      <ScenarioIncorrectFeedback
        challenge={testChallenge}
        choice={testChoice}
        onTryAgain={vi.fn()}
      />,
    );

    expect(screen.getByText("Visible short-term actions")).toBeVisible();

    expect(screen.getByText(/Choose several highly visible/i)).toBeVisible();
  });

  it("shows why the choice falls short", () => {
    render(
      <ScenarioIncorrectFeedback
        challenge={testChallenge}
        choice={testChoice}
        onTryAgain={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "Why this approach falls short",
      }),
    ).toBeVisible();
  });

  it("shows the likely consequence and key takeaway", () => {
    render(
      <ScenarioIncorrectFeedback
        challenge={testChallenge}
        choice={testChoice}
        onTryAgain={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "Likely consequence",
      }),
    ).toBeVisible();

    expect(screen.getByText(/Resources may be directed/i)).toBeVisible();

    expect(
      screen.getByRole("heading", {
        name: "Key takeaway",
      }),
    ).toBeVisible();

    expect(screen.getByText(/Start by identifying material impacts/i)).toBeVisible();
  });

  it("allows the learner to try again", async () => {
    const user = userEvent.setup();
    const onTryAgain = vi.fn();

    render(
      <ScenarioIncorrectFeedback
        challenge={testChallenge}
        choice={testChoice}
        onTryAgain={onTryAgain}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Try again",
      }),
    );

    expect(onTryAgain).toHaveBeenCalledTimes(1);
  });

  it("disables retry while the component is busy", () => {
    render(
      <ScenarioIncorrectFeedback
        challenge={testChallenge}
        choice={testChoice}
        isSubmitting
        onTryAgain={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Loading…",
      }),
    ).toBeDisabled();
  });

  it("displays an error message", () => {
    render(
      <ScenarioIncorrectFeedback
        challenge={testChallenge}
        choice={testChoice}
        errorMessage="The feedback could not be loaded."
        onTryAgain={vi.fn()}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("The feedback could not be loaded.");
  });

  it("does not reveal the optimal answer", () => {
    render(
      <ScenarioIncorrectFeedback
        challenge={testChallenge}
        choice={testChoice}
        onTryAgain={vi.fn()}
      />,
    );

    expect(screen.queryByText("Material priorities")).not.toBeInTheDocument();

    expect(screen.queryByText(/correct answer/i)).not.toBeInTheDocument();
  });
});
