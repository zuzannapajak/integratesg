import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/curriculum/certificate-download-button", () => ({
  default: () => <button type="button">Download certificate</button>,
}));

import CurriculumModuleCompletion, {
  type CurriculumCompletionStep,
} from "@/components/curriculum/curriculum-module-completion";
import messages from "@/messages/module-player-shells/en.json";

function renderPanel(completionStep: CurriculumCompletionStep, certificateAvailable = false) {
  const onRetake = vi.fn();
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <CurriculumModuleCompletion
        locale="en"
        slug="test-module"
        completionStep={completionStep}
        certificateAvailable={certificateAvailable}
        isPending={false}
        onRetake={onRetake}
      />
    </NextIntlClientProvider>,
  );
  return onRetake;
}

describe("Curriculum completion journey", () => {
  it("prompts the pilot post-assessment before requesting feedback", () => {
    renderPanel("assessment");
    expect(screen.getByRole("link", { name: "Finish pilot participation" })).toHaveAttribute(
      "href",
      "/en/curriculum/pilot/post-assessment?next=%2Fen%2Fcurriculum",
    );
    expect(screen.queryByRole("link", { name: "Fill out survey" })).not.toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  });

  it("makes feedback the primary action when post-assessment is complete", () => {
    renderPanel("feedback", true);
    expect(screen.getByRole("link", { name: "Fill out survey" })).toHaveAttribute(
      "href",
      "/en/pilot-satisfaction/curriculum",
    );
    expect(screen.getByRole("button", { name: "Download certificate" })).toBeInTheDocument();
  });

  it("allows browsing and keeps retake secondary", async () => {
    const user = userEvent.setup();
    const onRetake = renderPanel("explore");
    expect(screen.getByRole("link", { name: "Explore more modules" })).toHaveAttribute(
      "href",
      "/en/curriculum",
    );
    await user.click(screen.getByRole("button", { name: "Retake module" }));
    expect(onRetake).toHaveBeenCalledOnce();
  });
});
