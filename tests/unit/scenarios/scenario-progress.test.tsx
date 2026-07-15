import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ScenarioProgress } from "@/components/scenarios/common/scenario-progress";

describe("ScenarioProgress", () => {
  it("renders the current challenge progress", () => {
    render(<ScenarioProgress completedCount={1} totalCount={3} />);

    const progress = screen.getByTestId("scenario-progress");

    expect(progress).toHaveAttribute("data-completed-count", "1");

    expect(progress).toHaveAttribute("data-total-count", "3");

    expect(progress).toHaveAttribute("data-percentage", "33");

    expect(progress).toHaveAttribute("data-complete", "false");

    expect(progress).toHaveTextContent("Progress");

    expect(progress).toHaveTextContent("1 / 3 completed");
  });

  it("provides an accessible progressbar", () => {
    render(<ScenarioProgress completedCount={2} totalCount={3} />);

    const progressbar = screen.getByRole("progressbar", {
      name: "Progress: 2 / 3",
    });

    expect(progressbar).toHaveAttribute("aria-valuemin", "0");

    expect(progressbar).toHaveAttribute("aria-valuemax", "3");

    expect(progressbar).toHaveAttribute("aria-valuenow", "2");

    expect(progressbar).toHaveAttribute("aria-valuetext", "2 / 3 Completed");
  });

  it("does not display the numeric value inside the progress ring", () => {
    render(<ScenarioProgress completedCount={1} totalCount={3} />);

    const progressbar = screen.getByRole("progressbar", {
      name: "Progress: 1 / 3",
    });

    expect(progressbar).not.toHaveTextContent("1 / 3");
  });

  it("marks the progress as complete when all challenges are completed", () => {
    render(<ScenarioProgress completedCount={3} totalCount={3} />);

    const progress = screen.getByTestId("scenario-progress");

    expect(progress).toHaveAttribute("data-percentage", "100");

    expect(progress).toHaveAttribute("data-complete", "true");

    expect(progress).toHaveTextContent("3 / 3 completed");
  });

  it("does not allow the completed count to exceed the total", () => {
    render(<ScenarioProgress completedCount={8} totalCount={3} />);

    const progress = screen.getByTestId("scenario-progress");

    expect(progress).toHaveAttribute("data-completed-count", "3");

    expect(progress).toHaveAttribute("data-percentage", "100");

    expect(progress).toHaveTextContent("3 / 3 completed");
  });

  it("handles an empty challenge collection", () => {
    render(<ScenarioProgress completedCount={0} totalCount={0} />);

    const progress = screen.getByTestId("scenario-progress");

    expect(progress).toHaveAttribute("data-completed-count", "0");

    expect(progress).toHaveAttribute("data-total-count", "0");

    expect(progress).toHaveAttribute("data-percentage", "0");

    expect(progress).toHaveAttribute("data-complete", "false");

    expect(progress).toHaveTextContent("0 / 0 completed");
  });

  it("uses custom labels", () => {
    render(
      <ScenarioProgress
        completedCount={1}
        totalCount={3}
        labels={{
          progress: "Scenario progress",
          completed: "Finished",
        }}
      />,
    );

    const progress = screen.getByTestId("scenario-progress");

    expect(
      screen.getByRole("progressbar", {
        name: "Scenario progress: 1 / 3",
      }),
    ).toHaveAttribute("aria-valuetext", "1 / 3 Finished");

    expect(progress).toHaveTextContent("Scenario progress");

    expect(progress).toHaveTextContent("1 / 3 finished");
  });
});
