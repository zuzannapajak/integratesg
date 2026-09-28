import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const localeState = vi.hoisted(() => ({
  value: "en",
}));

const copy: Record<string, Record<string, string>> = {
  en: {
    "dashboard.loading.title": "Loading dashboard",
    "dashboard.loading.description": "Preparing your progress, activity and learning summary.",
    "dashboard.error.title": "The dashboard could not be loaded",
    "dashboard.error.description":
      "Something went wrong while preparing your dashboard. Please try again.",
    "dashboard.error.retry": "Try again",
    "eportfolio.error.title": "The ePortfolio could not be loaded",
    "eportfolio.error.description":
      "Something went wrong while preparing the case-study library. Please try again.",
    "eportfolio.error.retry": "Try again",
    "application.error.title": "Something went wrong",
    "application.error.description": "The page could not be displayed correctly. Please try again.",
    "application.error.retry": "Try again",
  },
  pl: {
    "dashboard.loading.title": "Ładowanie panelu",
    "dashboard.loading.description": "Przygotowujemy Twój postęp, aktywność i podsumowanie nauki.",
    "dashboard.error.title": "Nie udało się załadować panelu",
    "dashboard.error.description":
      "Wystąpił błąd podczas przygotowywania panelu. Spróbuj ponownie.",
    "dashboard.error.retry": "Spróbuj ponownie",
    "eportfolio.error.title": "Nie udało się załadować ePortfolio",
    "eportfolio.error.description":
      "Wystąpił błąd podczas przygotowywania biblioteki studiów przypadków. Spróbuj ponownie.",
    "eportfolio.error.retry": "Spróbuj ponownie",
    "application.error.title": "Coś poszło nie tak",
    "application.error.description": "Nie udało się poprawnie wyświetlić strony. Spróbuj ponownie.",
    "application.error.retry": "Spróbuj ponownie",
  },
};

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const localeCopy = copy[localeState.value];

    return Object.prototype.hasOwnProperty.call(localeCopy, key) ? localeCopy[key] : key;
  },
}));

import DashboardLoading from "@/app/[locale]/(protected)/dashboard/loading";
import EportfolioError from "@/app/[locale]/(protected)/eportfolio/error";
import LocalizedError from "@/app/[locale]/error";

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
