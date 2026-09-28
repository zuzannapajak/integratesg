import type { AnchorHTMLAttributes, ReactNode } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

type MockLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

type MotionDivProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  variants?: unknown;
  initial?: unknown;
  animate?: unknown;
  whileHover?: unknown;
};

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: MockLinkProps) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: MotionDivProps) => <div>{children}</div>,
  },
}));

vi.mock("@/components/dashboard/stats-chart", () => ({
  default: ({ data }: { data: Array<{ label: string; value: number }> }) => (
    <div data-testid="stats-chart" data-values={data.map((point) => point.value).join(",")} />
  ),
}));

import DashboardShell from "@/components/dashboard/dashboard-shell";

const zeroActivity = [
  { label: "Mon", value: 0 },
  { label: "Tue", value: 0 },
  { label: "Wed", value: 0 },
  { label: "Thu", value: 0 },
  { label: "Fri", value: 0 },
  { label: "Sat", value: 0 },
  { label: "Sun", value: 0 },
];

describe("DashboardShell empty states", () => {
  it("renders a stable zero-state dashboard for a new learner without a resume card", () => {
    render(
      <DashboardShell
        locale="en"
        role="learner"
        displayName="New Learner"
        heroStats={[]}
        continueLearning={null}
        gamificationStats={[
          {
            label: "gamification.learningStreak",
            value: "0",
          },
        ]}
        publishedCoursesCount={0}
        learnerSummaryMetrics={[
          {
            label: "metrics.completionRate",
            value: "0%",
          },
          {
            label: "metrics.averageScore",
            value: "0%",
          },
        ]}
        learnerActivityData={zeroActivity}
        learnerTrendLabel="No activity yet"
        adminActivityData={[]}
        adminTrendLabel=""
        adminKpis={[]}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "roleConfig.learner.welcome, New Learner",
      }),
    ).toBeInTheDocument();

    expect(screen.queryByText("continueLearning.badge")).not.toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: /coreArea\.buttons\.openScenarios/,
      }),
    ).toHaveAttribute("href", "/en/scenarios");

    expect(
      screen.getByRole("link", {
        name: /coreArea\.buttons\.openEportfolio/,
      }),
    ).toHaveAttribute("href", "/en/eportfolio");

    expect(screen.getByText("metrics.completionRate")).toBeInTheDocument();
    expect(screen.getByText("metrics.averageScore")).toBeInTheDocument();
    expect(screen.getAllByText("0%")).toHaveLength(2);

    expect(screen.getByText("gamification.learningStreak")).toBeInTheDocument();
    expect(screen.getByTestId("stats-chart")).toHaveAttribute("data-values", "0,0,0,0,0,0,0");
  });

  it("renders the educator zero state without a resume card", () => {
    render(
      <DashboardShell
        locale="pl"
        role="educator"
        displayName="New Educator"
        heroStats={[]}
        continueLearning={null}
        gamificationStats={[
          {
            label: "gamification.learningStreak",
            value: "0",
          },
        ]}
        publishedCoursesCount={0}
        learnerSummaryMetrics={[
          {
            label: "metrics.averagePostQuiz",
            value: "0%",
          },
          {
            label: "metrics.modulesInProgress",
            value: "0",
          },
        ]}
        learnerActivityData={zeroActivity}
        learnerTrendLabel="No activity yet"
        adminActivityData={[]}
        adminTrendLabel=""
        adminKpis={[]}
      />,
    );

    expect(screen.queryByText("continueLearning.badge")).not.toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: /coreArea\.buttons\.openModule/,
      }),
    ).toHaveAttribute("href", "/pl/curriculum");

    expect(
      screen.getByRole("link", {
        name: /coreArea\.buttons\.openEportfolio/,
      }),
    ).toHaveAttribute("href", "/pl/eportfolio");

    expect(screen.getByText("metrics.averagePostQuiz")).toBeInTheDocument();
    expect(screen.getByText("metrics.modulesInProgress")).toBeInTheDocument();
    expect(screen.getByText("0%")).toBeInTheDocument();

    expect(screen.getByTestId("stats-chart")).toHaveAttribute("data-values", "0,0,0,0,0,0,0");
  });
});
