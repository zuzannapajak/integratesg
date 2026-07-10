import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ScenarioScreenTransition } from "@/components/scenarios/common/scenario-screen-transition";

describe("ScenarioScreenTransition", () => {
  it("renders the screen content", () => {
    render(
      <ScenarioScreenTransition>
        <p>Animated content</p>
      </ScenarioScreenTransition>,
    );

    expect(screen.getByText("Animated content")).toBeVisible();
  });

  it("exposes the forward transition direction", () => {
    render(
      <ScenarioScreenTransition direction="forward" testId="test-transition">
        <p>Forward content</p>
      </ScenarioScreenTransition>,
    );

    expect(screen.getByTestId("test-transition")).toHaveAttribute(
      "data-transition-direction",
      "forward",
    );
  });

  it("exposes the backward transition direction", () => {
    render(
      <ScenarioScreenTransition direction="backward" testId="test-transition">
        <p>Backward content</p>
      </ScenarioScreenTransition>,
    );

    expect(screen.getByTestId("test-transition")).toHaveAttribute(
      "data-transition-direction",
      "backward",
    );
  });

  it("uses a custom class name", () => {
    render(
      <ScenarioScreenTransition className="absolute inset-0" testId="test-transition">
        <p>Test content</p>
      </ScenarioScreenTransition>,
    );

    expect(screen.getByTestId("test-transition")).toHaveClass("absolute", "inset-0");
  });
});
