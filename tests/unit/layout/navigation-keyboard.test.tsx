import type { AnchorHTMLAttributes, ReactNode } from "react";

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const navigationState = vi.hoisted(() => ({
  pathname: "/de/dashboard",
}));

vi.mock("next/navigation", () => ({
  usePathname: () => navigationState.pathname,
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

vi.mock("@/components/layout/logo", () => ({
  default: ({ href }: { href: string }) => <a href={href}>Logo</a>,
}));

vi.mock("@/components/layout/language-switcher", () => ({
  default: () => <button type="button">Language</button>,
}));

vi.mock("@/components/auth/login/logout-button", () => ({
  default: ({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
    redirectTo: string;
  }) => (
    <button type="button" className={className}>
      {children}
    </button>
  ),
}));

import AppSidebar from "@/components/layout/app-sidebar";
import ProtectedNavbar from "@/components/layout/protected-navbar";
import PublicNavbar from "@/components/layout/public-navbar";

describe("global navigation keyboard access", () => {
  beforeEach(() => {
    navigationState.pathname = "/de/dashboard";
    window.localStorage.clear();
  });

  it("opens and closes the public mobile menu from the keyboard", async () => {
    const user = userEvent.setup();

    render(<PublicNavbar locale="pl" forceCompact />);

    const trigger = screen.getByRole("button", {
      name: "openAccountMenu",
    });

    trigger.focus();
    expect(trigger).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    const menu = trigger.parentElement;

    if (!menu) {
      throw new Error("Expected the public navigation menu container.");
    }

    const aboutLink = within(menu).getByRole("link", {
      name: "about",
    });

    expect(aboutLink).toHaveAttribute("href", "/pl/about");

    await user.tab();
    expect(aboutLink).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("opens and closes the protected account menu from the keyboard", async () => {
    const user = userEvent.setup();

    render(
      <>
        <div data-protected-scroll-container />
        <ProtectedNavbar locale="en" role="learner" email="learner@example.test" />
      </>,
    );

    const trigger = screen.getByRole("button", {
      name: "openAccountMenu",
    });

    trigger.focus();
    expect(trigger).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    const menu = trigger.parentElement;

    if (!menu) {
      throw new Error("Expected the protected navigation menu container.");
    }

    expect(
      within(menu).getByRole("link", {
        name: "settings",
      }),
    ).toHaveAttribute("href", "/en/settings");

    await user.keyboard("{Escape}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps protected sidebar links reachable with Tab and locale-aware", async () => {
    const user = userEvent.setup();

    render(<AppSidebar locale="de" role="learner" />);

    const dashboardLink = screen.getByRole("link", {
      name: "dashboard",
    });

    expect(dashboardLink).toHaveAttribute("href", "/de/dashboard");

    await user.tab();

    expect(dashboardLink).toHaveFocus();
  });
});
