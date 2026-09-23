import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import EportfolioLibrary from "@/components/eportfolio/eportfolio-library";
import type { EportfolioLibraryItem } from "@/lib/eportfolio/library";

const items: EportfolioLibraryItem[] = [
  {
    slug: "barilla",
    title: "Barilla S.p.A.",
    organization: "Barilla G. e R. Fratelli S.p.A.",
    summary: "Food-sector sustainability and agricultural sourcing.",
    industry: "Food and Beverage Manufacturing",
    countryCode: "IT",
    reportingPeriod: "2024",
    isFeatured: false,
    progress: "completed",
  },
  {
    slug: "pzu",
    title: "PZU S.A.",
    organization: "PZU S.A.",
    summary: "Insurance, governance and responsible investment practices.",
    industry: "Insurance and Financial Services",
    countryCode: "PL",
    reportingPeriod: "2023",
    isFeatured: false,
    progress: "in_progress",
  },
  {
    slug: "sofiyska-voda",
    title: "Sofiyska Voda AD",
    organization: "Sofiyska Voda AD",
    summary: "Water supply and wastewater services in Sofia.",
    industry: "Water supply and wastewater services",
    countryCode: "BG",
    reportingPeriod: "2023–2024",
    isFeatured: false,
    progress: "not_started",
  },
];

function getArticleForHeading(name: string) {
  const heading = screen.getByRole("heading", {
    name,
  });

  const article = heading.closest("article");

  if (!article) {
    throw new Error(`Missing article for ${name}`);
  }

  return article;
}

describe("ePortfolio library UI", () => {
  it("searches across case-study text", async () => {
    const user = userEvent.setup();

    render(<EportfolioLibrary locale="en" items={items} />);

    await user.type(
      screen.getByRole("textbox", {
        name: "Search case studies",
      }),
      "wastewater",
    );

    expect(
      screen.getByRole("heading", {
        name: "Sofiyska Voda AD",
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", {
        name: "Barilla S.p.A.",
      }),
    ).not.toBeInTheDocument();

    expect(screen.getByText("1 of 3 case studies")).toBeInTheDocument();
  });

  it("filters by country and progress", async () => {
    const user = userEvent.setup();

    render(<EportfolioLibrary locale="en" items={items} />);

    await user.selectOptions(
      screen.getByRole("combobox", {
        name: "Filter by country",
      }),
      "PL",
    );

    expect(
      screen.getByRole("heading", {
        name: "PZU S.A.",
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", {
        name: "Barilla S.p.A.",
      }),
    ).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "Clear filters",
      }),
    );

    await user.selectOptions(
      screen.getByRole("combobox", {
        name: "Filter by progress",
      }),
      "completed",
    );

    expect(
      screen.getByRole("heading", {
        name: "Barilla S.p.A.",
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", {
        name: "PZU S.A.",
      }),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("heading", {
        name: "Sofiyska Voda AD",
      }),
    ).not.toBeInTheDocument();
  });

  it("shows the persisted status on each case-study card", () => {
    render(<EportfolioLibrary locale="en" items={items} />);

    expect(
      within(getArticleForHeading("Barilla S.p.A.")).getByText("Completed"),
    ).toBeInTheDocument();

    expect(within(getArticleForHeading("PZU S.A.")).getByText("In progress")).toBeInTheDocument();

    expect(
      within(getArticleForHeading("Sofiyska Voda AD")).getByText("Not started"),
    ).toBeInTheDocument();
  });

  it("keeps the simplified filter controls keyboard-addressable and labelled", () => {
    render(<EportfolioLibrary locale="en" items={items} />);

    expect(
      screen.getByRole("textbox", {
        name: "Search case studies",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("combobox", {
        name: "Filter by country",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("combobox", {
        name: "Filter by progress",
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("combobox", {
        name: "Filter by industry",
      }),
    ).not.toBeInTheDocument();

    const links = screen.getAllByRole("link");

    expect(links.length).toBe(items.length);

    for (const link of links) {
      expect(link).toHaveAttribute("href");

      expect(link.textContent.trim().length).toBeGreaterThan(0);
    }
  });
});
