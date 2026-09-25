import type { AnchorHTMLAttributes, ReactNode } from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const navigationState = vi.hoisted(() => ({
  pathname: "/pl/eportfolio/example-case",
  search: "progress=in_progress&search=water",
}));

vi.mock("next/navigation", () => ({
  usePathname: () => navigationState.pathname,
  useSearchParams: () => new URLSearchParams(navigationState.search),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, values?: Record<string, string>) => {
    if (key === "open") {
      return "Open language menu";
    }

    if (key === "switchTo") {
      return `Switch to ${values?.language ?? ""}`;
    }

    return key;
  },
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

import LanguageSwitcher from "@/components/layout/language-switcher";

describe("LanguageSwitcher locale navigation", () => {
  beforeEach(() => {
    navigationState.pathname = "/pl/eportfolio/example-case";
    navigationState.search = "progress=in_progress&search=water";
  });

  it("preserves the current page, slug and query parameters when switching locale", async () => {
    const user = userEvent.setup();

    render(<LanguageSwitcher locale="pl" />);

    await user.click(
      screen.getByRole("button", {
        name: "Open language menu",
      }),
    );

    expect(
      screen.getByRole("link", {
        name: "Switch to Deutsch",
      }),
    ).toHaveAttribute("href", "/de/eportfolio/example-case?progress=in_progress&search=water");

    expect(
      screen.getByRole("link", {
        name: "Switch to English",
      }),
    ).toHaveAttribute("href", "/en/eportfolio/example-case?progress=in_progress&search=water");
  });

  it("adds the next locale without dropping a route that has no locale prefix", async () => {
    const user = userEvent.setup();

    navigationState.pathname = "/curriculum/module-slug/learn";
    navigationState.search = "lesson=2";

    render(<LanguageSwitcher locale="en" align="left" />);

    await user.click(
      screen.getByRole("button", {
        name: "Open language menu",
      }),
    );

    expect(
      screen.getByRole("link", {
        name: "Switch to Polski",
      }),
    ).toHaveAttribute("href", "/pl/curriculum/module-slug/learn?lesson=2");
  });
});
