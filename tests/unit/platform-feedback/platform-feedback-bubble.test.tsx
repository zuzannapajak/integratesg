import type { AnchorHTMLAttributes, ReactNode } from "react";

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ pathname: "/en/dashboard" }));

vi.mock("next/navigation", () => ({
  usePathname: () => state.pathname,
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

type MockLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: MockLinkProps) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

import PlatformFeedbackBubble from "@/components/platform-feedback/platform-feedback-bubble";

describe("platform feedback bubble", () => {
  beforeEach(() => {
    state.pathname = "/en/dashboard";
  });

  it("routes educators to the educator-only platform feedback form", () => {
    render(<PlatformFeedbackBubble locale="en" role="educator" canGiveWp3Feedback />);

    expect(screen.getByRole("link", { name: "label" })).toHaveAttribute(
      "href",
      "/en/platform-feedback",
    );
  });

  it("hides the platform survey from regular educators", () => {
    render(<PlatformFeedbackBubble locale="en" role="educator" />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("does not offer WP4 learners the unrelated WP3 platform survey", () => {
    render(<PlatformFeedbackBubble locale="pl" role="learner" />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("does not advertise the educator-only form to admins", () => {
    render(<PlatformFeedbackBubble locale="en" role="admin" />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("stays hidden on scenario module pages", () => {
    state.pathname = "/en/scenarios/sample/play";
    render(<PlatformFeedbackBubble locale="en" role="learner" />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("stays hidden on the learner survey itself", () => {
    state.pathname = "/en/pilot-satisfaction/eportfolio";
    render(<PlatformFeedbackBubble locale="en" role="learner" />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("stays hidden on the educator feedback form itself", () => {
    state.pathname = "/en/platform-feedback";
    render(<PlatformFeedbackBubble locale="en" role="educator" canGiveWp3Feedback />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
