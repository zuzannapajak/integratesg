import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import CurriculumError from "@/app/[locale]/(protected)/curriculum/error";
import CurriculumLoading from "@/app/[locale]/(protected)/curriculum/loading";
import englishMessages from "@/messages/curriculum-state-shells/en.json";
import polishMessages from "@/messages/curriculum-state-shells/pl.json";

function renderWithLocale(ui: React.ReactNode, locale: "en" | "pl") {
  const messages = locale === "pl" ? polishMessages : englishMessages;

  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

describe("curriculum route states", () => {
  it("renders a localized loading state", () => {
    renderWithLocale(<CurriculumLoading />, "pl");

    expect(screen.getByRole("status")).toBeVisible();
    expect(screen.getByRole("heading", { name: "Ładowanie programu" })).toBeVisible();
    expect(screen.getByText("Przygotowujemy moduły edukacyjne i Twój postęp.")).toBeVisible();
  });

  it("renders an error state and retries through the Next.js reset callback", async () => {
    const user = userEvent.setup();
    const reset = vi.fn();

    renderWithLocale(
      <CurriculumError error={new Error("Database unavailable")} reset={reset} />,
      "en",
    );

    expect(screen.getByRole("alert")).toBeVisible();

    expect(
      screen.getByRole("heading", {
        name: "The curriculum could not be loaded",
      }),
    ).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(reset).toHaveBeenCalledTimes(1);
  });
});
