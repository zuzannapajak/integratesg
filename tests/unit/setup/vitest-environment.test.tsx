import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

function ExampleComponent() {
  return (
    <section>
      <h1>Scenario simulator</h1>

      <button type="button">Open challenge</button>
    </section>
  );
}

describe("Vitest environment", () => {
  it("renders and supports user interactions", async () => {
    const user = userEvent.setup();

    render(<ExampleComponent />);

    expect(
      screen.getByRole("heading", {
        name: "Scenario simulator",
      }),
    ).toBeVisible();

    const button = screen.getByRole("button", {
      name: "Open challenge",
    });

    expect(button).toBeEnabled();

    await user.click(button);
  });

  it("provides browser APIs required by the simulator", () => {
    expect(window.matchMedia).toBeDefined();
    expect(globalThis.ResizeObserver).toBeDefined();
  });
});
