import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { ScenarioBoard } from "@/components/scenarios/simulator/scenario-board";
import { ScenarioChallenge } from "@/components/scenarios/simulator/scenario-challenge";
import { ScenarioPlayer } from "@/components/scenarios/simulator/scenario-player";
import { resolveScenarioBySlug } from "@/lib/scenarios/simulator/resolve-scenario";
import type {
  ChoiceId,
  ResolvedChallenge,
  ResolvedScenario,
} from "@/lib/scenarios/simulator/types";

function getScenarioFixture(): ResolvedScenario {
  const resolvedScenario = resolveScenarioBySlug("scenario-02", "en");

  if (!resolvedScenario) {
    throw new Error("Scenario 02 fixture is unavailable.");
  }

  return resolvedScenario;
}

function getFirstChallenge(resolvedScenario: ResolvedScenario): ResolvedChallenge {
  const challenge = resolvedScenario.challenges.at(0);

  if (!challenge) {
    throw new Error("Scenario 02 must contain at least one challenge.");
  }

  return challenge;
}

const scenario = getScenarioFixture();
const firstChallenge = getFirstChallenge(scenario);

function ChallengeHarness({ onConfirm }: { readonly onConfirm: () => void }) {
  const [selectedChoiceId, setSelectedChoiceId] = useState<ChoiceId | null>(null);

  return (
    <ScenarioChallenge
      challenge={firstChallenge}
      selectedChoiceId={selectedChoiceId}
      initialStep="decision"
      onSelectChoice={setSelectedChoiceId}
      onConfirm={onConfirm}
      onBackToBoard={vi.fn()}
    />
  );
}

describe("scenario keyboard accessibility", () => {
  it("moves between available hotspots with arrows, Home and End", async () => {
    const user = userEvent.setup();

    render(
      <ScenarioBoard
        backgroundImage={scenario.assets.preStartBackground}
        boardAlt={scenario.boardAlt}
        scenarioTitle={scenario.title}
        items={scenario.challenges.map((challenge: ResolvedChallenge) => ({
          challenge,
          status: "available" as const,
        }))}
        onSelectChallenge={vi.fn()}
      />,
    );

    const hotspots = scenario.challenges.map((challenge) =>
      screen.getByTestId(`scenario-board-hotspot-${challenge.id}`),
    );

    const first = hotspots.at(0);
    const second = hotspots.at(1);
    const last = hotspots.at(-1);

    if (!first || !second || !last) {
      throw new Error("Scenario 02 must contain at least two keyboard hotspots.");
    }

    first.focus();

    await user.keyboard("{ArrowRight}");

    expect(second).toHaveFocus();

    await user.keyboard("{End}");

    expect(last).toHaveFocus();

    await user.keyboard("{Home}");

    expect(first).toHaveFocus();

    await user.keyboard("{ArrowLeft}");

    expect(last).toHaveFocus();
  });

  it("focuses the first decision and supports arrow selection and Enter confirmation", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    render(<ChallengeHarness onConfirm={onConfirm} />);

    const choices = screen.getAllByRole("radio");

    const first = choices.at(0);
    const second = choices.at(1);

    if (!first || !second) {
      throw new Error("The challenge must contain at least two choices.");
    }

    await waitFor(() => {
      expect(first).toHaveFocus();
    });

    await user.keyboard("{ArrowDown}");

    expect(second).toHaveFocus();
    expect(second).toBeChecked();

    await user.keyboard("{Enter}");

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("moves focus to the primary action after changing the intro step", async () => {
    const user = userEvent.setup();

    render(<ScenarioPlayer scenario={scenario} />);

    await user.click(
      screen.getByRole("button", {
        name: "Continue",
      }),
    );

    const startButton = screen.getByRole("button", {
      name: "Start scenario",
    });

    await waitFor(() => {
      expect(startButton).toHaveFocus();
    });
  });

  it("exposes challenge screens as modal dialogs and closes them with Escape", async () => {
    const user = userEvent.setup();

    render(
      <ScenarioPlayer
        scenario={scenario}
        initialView="challenge"
        initialChallengeId={firstChallenge.id}
      />,
    );

    const dialog = screen.getByRole("dialog", {
      name: new RegExp(firstChallenge.title, "i"),
    });

    await waitFor(() => {
      expect(dialog).toHaveFocus();
    });

    expect(dialog).toHaveAttribute("aria-modal", "true");

    await user.keyboard("{Escape}");

    expect(screen.getByTestId("scenario-player")).toHaveAttribute("data-view", "board");
  });
});
