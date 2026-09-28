import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const localeState = vi.hoisted(() => ({
  value: "en",
}));

vi.mock("next-intl", () => ({
  useLocale: () => localeState.value,
}));

import LocalizedError from "@/app/[locale]/error";
import DashboardLoading from "@/app/[locale]/(protected)/dashboard/loading";
import EportfolioError from "@/app/[locale]/(protected)/eportfolio/error";

describe("route states", () => {
  beforeEach(() => {
    localeState.value = "en";
  });

  it("renders the dashboard loading state", () => {
    render(<DashboardLoading />);

    expect(screen.getByRole("status")).toHaveTextContent("Loading dashboard");
    expect(screen.getByTestId("dashboard-loading-state")).toBeInTheDocument();
  });

  it("renders a localized ePortfolio error and retries", async () => {
    const user = userEvent.setup();
    const reset = vi.fn();

    localeState.value = "pl";

    render(<EportfolioError error={new Error("test")} reset={reset} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Nie udało się załadować ePortfolio");

    await user.click(
      screen.getByRole("button", {
        name: "Spróbuj ponownie",
      }),
    );

    expect(reset).toHaveBeenCalledTimes(1);
  });

  it("provides a shared localized error boundary with a retry action", async () => {
    const user = userEvent.setup();
    const reset = vi.fn();

    render(<LocalizedError error={new Error("test")} reset={reset} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Something went wrong");

    await user.click(
      screen.getByRole("button", {
        name: "Try again",
      }),
    );

    expect(reset).toHaveBeenCalledTimes(1);
  });
});
