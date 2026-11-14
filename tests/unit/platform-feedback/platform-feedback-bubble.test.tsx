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

describe("general platform feedback bubble", () => {
  beforeEach(() => {
    state.pathname = "/en/dashboard";
  });

  it.each(["educator", "learner"] as const)(
    "offers voluntary feedback to %s outside the pilot",
    (role) => {
      render(<PlatformFeedbackBubble locale="en" role={role} />);
      expect(screen.getByRole("link", { name: "label" })).toHaveAttribute("href", "/en/feedback");
    },
  );

  it("is available on Scenarios pages and does not lead to a pilot questionnaire", () => {
    state.pathname = "/pl/scenarios/sample/play";
    render(<PlatformFeedbackBubble locale="pl" role="learner" />);
    expect(screen.getByRole("link", { name: "label" })).toHaveAttribute("href", "/pl/feedback");
  });

  it("does not offer general feedback to administrators", () => {
    render(<PlatformFeedbackBubble locale="en" role="admin" />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("does not duplicate the floating link on its own form", () => {
    state.pathname = "/en/feedback";
    render(<PlatformFeedbackBubble locale="en" role="educator" />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
