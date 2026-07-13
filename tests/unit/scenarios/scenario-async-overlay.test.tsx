import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ScenarioAsyncOverlay } from "@/components/scenarios/simulator/scenario-async-overlay";

describe("ScenarioAsyncOverlay", () => {
  it("does not render when no asynchronous operation is active", () => {
    render(<ScenarioAsyncOverlay visible={false} message="Saving progress…" />);

    expect(screen.queryByTestId("scenario-async-overlay")).not.toBeInTheDocument();
  });

  it("announces the active save operation", () => {
    render(<ScenarioAsyncOverlay visible message="Saving your decision…" />);

    const status = screen.getByRole("status");

    expect(status).toHaveAttribute("aria-live", "polite");

    expect(status).toHaveAttribute("aria-atomic", "true");

    expect(status).toHaveTextContent("Saving your decision…");
  });
});
