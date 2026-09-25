import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import EportfolioLibrary from "@/components/eportfolio/eportfolio-library";
import type { EportfolioLibraryItem } from "@/lib/eportfolio/library";

const ITEMS: EportfolioLibraryItem[] = [
  {
    slug: "alpha-energy",
    title: "Alpha Energy",
    organization: "Alpha Energy Group",
    summary: "Wastewater efficiency and renewable energy programme.",
    industry: "Energy",
    countryCode: "PL",
    reportingPeriod: "2026",
    isFeatured: false,
    progress: "completed",
  },
  {
    slug: "beta-water",
    title: "Beta Water",
    organization: "Beta Utilities",
    summary: "Water infrastructure and community engagement.",
    industry: "Utilities",
    countryCode: "BG",
    reportingPeriod: "2025",
    isFeatured: false,
    progress: "in_progress",
  },
  {
    slug: "gamma-tech",
    title: "Gamma Tech",
    organization: "Gamma Polska",
    summary: "Responsible technology and supply-chain programme.",
    industry: "Technology",
    countryCode: "PL",
    reportingPeriod: "2026",
    isFeatured: false,
    progress: "in_progress",
  },
  {
    slug: "delta-tech",
    title: "Delta Tech",
    organization: null,
    summary: null,
    industry: "Technology",
    countryCode: "DE",
    reportingPeriod: null,
    isFeatured: false,
    progress: "not_started",
  },
];

function renderLibrary(items: EportfolioLibraryItem[] = ITEMS) {
  return render(<EportfolioLibrary locale="en" items={items} />);
}

function expectVisibleCaseStudy(title: string) {
  expect(
    screen.getByRole("heading", {
      name: title,
    }),
  ).toBeVisible();
}

function expectMissingCaseStudy(title: string) {
  expect(
    screen.queryByRole("heading", {
      name: title,
    }),
  ).not.toBeInTheDocument();
}

describe("ePortfolio library UI", () => {
  it("searches across case-study text case-insensitively and trims whitespace", async () => {
    const user = userEvent.setup();

    renderLibrary();

    const search = screen.getByRole("textbox", {
      name: "Search case studies",
    });

    await user.type(search, "   WASTEWATER   ");

    expectVisibleCaseStudy("Alpha Energy");
    expectMissingCaseStudy("Beta Water");
    expectMissingCaseStudy("Gamma Tech");
    expectMissingCaseStudy("Delta Tech");

    expect(screen.getByText("1 of 4 case studies", { exact: true })).toBeVisible();
  });

  it("searches by industry as part of the free-text search", async () => {
    const user = userEvent.setup();

    renderLibrary();

    await user.type(
      screen.getByRole("textbox", {
        name: "Search case studies",
      }),
      "technology",
    );

    expectVisibleCaseStudy("Gamma Tech");
    expectVisibleCaseStudy("Delta Tech");
    expectMissingCaseStudy("Alpha Energy");
    expectMissingCaseStudy("Beta Water");

    expect(screen.getByText("2 of 4 case studies", { exact: true })).toBeVisible();
  });

  it("filters by industry", async () => {
    const user = userEvent.setup();

    renderLibrary();

    const industryFilter = screen.getByRole("combobox", {
      name: "Filter by industry",
    });

    expect(industryFilter).toHaveValue("all");

    await user.selectOptions(industryFilter, "Technology");

    expectVisibleCaseStudy("Gamma Tech");
    expectVisibleCaseStudy("Delta Tech");
    expectMissingCaseStudy("Alpha Energy");
    expectMissingCaseStudy("Beta Water");

    expect(screen.getByText("2 of 4 case studies", { exact: true })).toBeVisible();
  });

  it("combines country, industry and progress filters", async () => {
    const user = userEvent.setup();

    renderLibrary();

    await user.selectOptions(
      screen.getByRole("combobox", {
        name: "Filter by country",
      }),
      "PL",
    );

    await user.selectOptions(
      screen.getByRole("combobox", {
        name: "Filter by industry",
      }),
      "Technology",
    );

    await user.selectOptions(
      screen.getByRole("combobox", {
        name: "Filter by progress",
      }),
      "in_progress",
    );

    expectVisibleCaseStudy("Gamma Tech");
    expectMissingCaseStudy("Alpha Energy");
    expectMissingCaseStudy("Beta Water");
    expectMissingCaseStudy("Delta Tech");

    expect(screen.getByText("1 of 4 case studies", { exact: true })).toBeVisible();
  });

  it("shows the zero-results state and clear filters restores the library", async () => {
    const user = userEvent.setup();

    renderLibrary();

    await user.selectOptions(
      screen.getByRole("combobox", {
        name: "Filter by country",
      }),
      "BG",
    );

    await user.selectOptions(
      screen.getByRole("combobox", {
        name: "Filter by industry",
      }),
      "Technology",
    );

    expect(
      screen.getByRole("heading", {
        name: "No case studies match your filters",
      }),
    ).toBeVisible();

    expect(screen.getByText("0 of 4 case studies", { exact: true })).toBeVisible();

    await user.click(
      screen.getByRole("button", {
        name: "Clear filters",
      }),
    );

    expectVisibleCaseStudy("Alpha Energy");
    expectVisibleCaseStudy("Beta Water");
    expectVisibleCaseStudy("Gamma Tech");
    expectVisibleCaseStudy("Delta Tech");

    expect(
      screen.queryByRole("heading", {
        name: "No case studies match your filters",
      }),
    ).not.toBeInTheDocument();

    expect(screen.getByText("4 of 4 case studies", { exact: true })).toBeVisible();
  });

  it("shows the persisted progress status on every case-study card", () => {
    renderLibrary();

    const cardByTitle = (title: string) => {
      const heading = screen.getByRole("heading", {
        name: title,
      });

      const card = heading.closest("article");

      if (!card) {
        throw new Error(`Missing case-study card for ${title}.`);
      }

      return card;
    };

    expect(
      within(cardByTitle("Alpha Energy")).getByText("Completed", {
        exact: true,
      }),
    ).toBeVisible();

    expect(
      within(cardByTitle("Beta Water")).getByText("In progress", {
        exact: true,
      }),
    ).toBeVisible();

    expect(
      within(cardByTitle("Gamma Tech")).getByText("In progress", {
        exact: true,
      }),
    ).toBeVisible();

    expect(
      within(cardByTitle("Delta Tech")).getByText("Not started", {
        exact: true,
      }),
    ).toBeVisible();

    expect(
      within(cardByTitle("Alpha Energy")).getByRole("link", {
        name: "Review case study",
      }),
    ).toHaveAttribute("href", "/en/eportfolio/alpha-energy");

    expect(screen.getAllByRole("article")).toHaveLength(4);
  });

  it("keeps all search and filter controls accessible by label", () => {
    renderLibrary();

    expect(
      screen.getByRole("textbox", {
        name: "Search case studies",
      }),
    ).toBeVisible();

    expect(
      screen.getByRole("combobox", {
        name: "Filter by country",
      }),
    ).toBeVisible();

    expect(
      screen.getByRole("combobox", {
        name: "Filter by industry",
      }),
    ).toBeVisible();

    expect(
      screen.getByRole("combobox", {
        name: "Filter by progress",
      }),
    ).toBeVisible();
  });

  it("does not create an empty industry option for missing industry metadata", () => {
    renderLibrary([
      ...ITEMS,
      {
        slug: "missing-industry",
        title: "Missing Industry",
        organization: "Metadata Test",
        summary: "Case study without industry metadata.",
        industry: null,
        countryCode: "FR",
        reportingPeriod: "2026",
        isFeatured: false,
        progress: "not_started",
      },
    ]);

    const industryFilter = screen.getByRole("combobox", {
      name: "Filter by industry",
    });

    const options = Array.from(industryFilter.querySelectorAll("option")).map((option) => ({
      value: option.value,
      label: option.textContent,
    }));

    expect(options).toEqual([
      {
        value: "all",
        label: "All industries",
      },
      {
        value: "Energy",
        label: "Energy",
      },
      {
        value: "Technology",
        label: "Technology",
      },
      {
        value: "Utilities",
        label: "Utilities",
      },
    ]);
  });
});
