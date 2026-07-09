import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ScenarioCorrectFeedback } from "@/components/scenarios/simulator/scenario-correct-feedback";
import type { ResolvedChallenge, ResolvedChoice } from "@/lib/scenarios/simulator/types";

const testChoice = {
  id: "scenario-02-challenge-01-choice-02",
  order: 2,
  isOptimal: true,

  label: "Material priorities",

  text: "Assess material impacts, risks and stakeholder expectations before defining strategic priorities.",

  feedback: {
    title: "A strong strategic foundation",

    body: "This decision creates a focused and evidence-based basis for the ESG strategy.",

    consequence:
      "The organisation can direct its resources towards the issues with the greatest business and sustainability significance.",

    takeaway:
      "Materiality should guide ESG priorities instead of visibility or the number of initiatives.",
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

  context: "The management board must define its ESG priorities.",

  question: "Which approach should be selected?",

  choices: [testChoice],
} satisfies ResolvedChallenge;

describe("ScenarioCorrectFeedback", () => {
  it("renders the correct feedback content", () => {
    render(
      <ScenarioCorrectFeedback
        challenge={testChallenge}
        choice={testChoice}
        onContinue={vi.fn()}
      />,
    );

    expect(screen.getByTestId("scenario-correct-feedback")).toHaveAttribute(
      "data-feedback-kind",
      "correct",
    );

    expect(
      screen.getByRole("heading", {
        name: "A strong strategic foundation",
      }),
    ).toBeVisible();

    expect(screen.getByText(/focused and evidence-based basis/i)).toBeVisible();
  });

  it("shows the decision selected by the learner", () => {
    render(
      <ScenarioCorrectFeedback
        challenge={testChallenge}
        choice={testChoice}
        onContinue={vi.fn()}
      />,
    );

    expect(screen.getByText("Material priorities")).toBeVisible();

    expect(screen.getByText(/Assess material impacts/i)).toBeVisible();
  });

  it("shows the expected impact and takeaway", () => {
    render(
      <ScenarioCorrectFeedback
        challenge={testChallenge}
        choice={testChoice}
        onContinue={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "Expected impact",
      }),
    ).toBeVisible();

    expect(screen.getByText(/direct its resources/i)).toBeVisible();

    expect(
      screen.getByRole("heading", {
        name: "Key takeaway",
      }),
    ).toBeVisible();

    expect(screen.getByText(/Materiality should guide ESG priorities/i)).toBeVisible();
  });

  it("continues after the feedback has been reviewed", async () => {
    const user = userEvent.setup();
    const onContinue = vi.fn();

    render(
      <ScenarioCorrectFeedback
        challenge={testChallenge}
        choice={testChoice}
        onContinue={onContinue}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Continue",
      }),
    );

    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it("disables continuation while progress is being saved", () => {
    render(
      <ScenarioCorrectFeedback
        challenge={testChallenge}
        choice={testChoice}
        isSubmitting
        onContinue={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Saving…",
      }),
    ).toBeDisabled();
  });

  it("displays an error returned while completing the challenge", () => {
    render(
      <ScenarioCorrectFeedback
        challenge={testChallenge}
        choice={testChoice}
        errorMessage="The challenge could not be completed."
        onContinue={vi.fn()}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("The challenge could not be completed.");
  });

  it("does not claim that the challenge is completed before Continue", () => {
    render(
      <ScenarioCorrectFeedback
        challenge={testChallenge}
        choice={testChoice}
        onContinue={vi.fn()}
      />,
    );

    expect(screen.getByText("Correct decision")).toBeVisible();

    expect(screen.queryByText("Challenge completed")).not.toBeInTheDocument();
  });
});
