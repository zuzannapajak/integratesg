import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";

import PilotSatisfactionResult from "@/components/pilot-satisfaction/pilot-satisfaction-result";
import messages from "@/messages/pilot-satisfaction-shells/en.json";

function renderResult(
  scope: "curriculum" | "eportfolio",
  state: "submitted" | "already-submitted" | "unavailable",
) {
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <PilotSatisfactionResult locale="en" scope={scope} state={state} />
    </NextIntlClientProvider>,
  );
}

describe("Survey completion states", () => {
  it("thanks respondents and lets them return to Curriculum", () => {
    renderResult("curriculum", "submitted");
    expect(screen.getByRole("heading", { name: "Thank you for your feedback!" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Explore more modules" })).toHaveAttribute(
      "href",
      "/en/curriculum",
    );
  });

  it("keeps already-submitted respondents away from duplicate forms", () => {
    renderResult("eportfolio", "already-submitted");
    expect(screen.getByText("You have already submitted this survey.")).toBeVisible();
    expect(screen.getByRole("link", { name: "Back to ePortfolio" })).toHaveAttribute(
      "href",
      "/en/eportfolio",
    );
  });

  it("explains an unavailable survey and provides a recovery path", () => {
    renderResult("eportfolio", "unavailable");
    expect(screen.getByRole("heading", { name: "Survey is not available yet" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Back to ePortfolio" })).toBeVisible();
  });
});
