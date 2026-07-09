import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ScenarioIntro } from "@/components/scenarios/simulator/scenario-intro";
import type { ResolvedScenario } from "@/lib/scenarios/simulator/types";

const testScenario = {
  id: "scenario-02",
  slug: "scenario-02",
  order: 2,

  curriculumModuleSlug: "module-2-strategy-vision-and-organisational-alignment",

  sourcePartner: "CleverMind",
  version: 1,
  estimatedDurationMinutes: 15,

  assets: {
    preStartBackground: "/scenarios/scenario-02/pre-start.png",
    inProgressBackground: "/scenarios/scenario-02/in-progress.png",
  },

  pathwayPosition: {
    x: 32,
    y: 27,
    labelSide: "bottom",
  },

  locale: "en",

  title: "Strategy, Vision and Organisational Alignment",
  shortTitle: "Strategy & Alignment",
  subtitle: "Embedding ESG priorities in organisational practice",

  introduction:
    "NordForm Components needs to connect its sustainability activities with one coherent ESG strategy.",

  organisation: "NordForm Components",
  role: "Strategy and Sustainability Manager",

  objectives: [
    "Identify material ESG priorities.",
    "Connect ESG decisions with business value.",
    "Build cross-functional ownership.",
  ],

  boardAlt: "A company strategy workshop divided into three connected areas.",

  challenges: [
    {
      id: "scenario-02-challenge-01",
      order: 1,
      hotspot: {
        x: 18,
        y: 58,
      },
      title: "Challenge 1",
      shortTitle: "Challenge 1",
      context: "Context 1",
      question: "Question 1",
      choices: [],
    },
    {
      id: "scenario-02-challenge-02",
      order: 2,
      hotspot: {
        x: 50,
        y: 46,
      },
      title: "Challenge 2",
      shortTitle: "Challenge 2",
      context: "Context 2",
      question: "Question 2",
      choices: [],
    },
    {
      id: "scenario-02-challenge-03",
      order: 3,
      hotspot: {
        x: 82,
        y: 58,
      },
      title: "Challenge 3",
      shortTitle: "Challenge 3",
      context: "Context 3",
      question: "Question 3",
      choices: [],
    },
  ],

  summary: {
    title: "Scenario completed",
    body: "Scenario summary.",
    takeaways: ["Test takeaway."],
  },
} satisfies ResolvedScenario;

describe("ScenarioIntro", () => {
  it("shows context, organisation and role on the first step", () => {
    render(<ScenarioIntro scenario={testScenario} onStart={vi.fn()} />);

    const intro = screen.getByTestId("scenario-intro");

    expect(intro).toHaveAttribute("data-intro-step", "1");

    expect(
      screen.getByRole("heading", {
        name: "Strategy, Vision and Organisational Alignment",
      }),
    ).toBeVisible();

    expect(screen.getByText(/needs to connect its sustainability activities/i)).toBeVisible();

    expect(screen.getByText("Strategy and Sustainability Manager")).toBeVisible();

    expect(
      screen.getByRole("button", {
        name: "Continue",
      }),
    ).toBeVisible();

    expect(
      screen.queryByRole("button", {
        name: "Start scenario",
      }),
    ).not.toBeInTheDocument();
  });

  it("shows objectives on the second step", async () => {
    const user = userEvent.setup();

    render(<ScenarioIntro scenario={testScenario} onStart={vi.fn()} />);

    await user.click(
      screen.getByRole("button", {
        name: "Continue",
      }),
    );

    expect(screen.getByTestId("scenario-intro")).toHaveAttribute("data-intro-step", "2");

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Your objectives",
      }),
    ).toBeVisible();

    expect(screen.getByText("Identify material ESG priorities.")).toBeVisible();

    expect(screen.getByText("Connect ESG decisions with business value.")).toBeVisible();

    expect(screen.getByText("Build cross-functional ownership.")).toBeVisible();

    expect(
      screen.getByRole("button", {
        name: "Start scenario",
      }),
    ).toBeVisible();
  });

  it("does not start the scenario after clicking Continue", async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();

    render(<ScenarioIntro scenario={testScenario} onStart={onStart} />);

    await user.click(
      screen.getByRole("button", {
        name: "Continue",
      }),
    );

    expect(onStart).not.toHaveBeenCalled();
  });

  it("starts the scenario from the second step", async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();

    render(<ScenarioIntro scenario={testScenario} onStart={onStart} />);

    await user.click(
      screen.getByRole("button", {
        name: "Continue",
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "Start scenario",
      }),
    );

    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it("returns from objectives to the context step", async () => {
    const user = userEvent.setup();

    render(<ScenarioIntro scenario={testScenario} onStart={vi.fn()} />);

    await user.click(
      screen.getByRole("button", {
        name: "Continue",
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "Back",
      }),
    );

    expect(screen.getByTestId("scenario-intro")).toHaveAttribute("data-intro-step", "1");

    expect(
      screen.getByRole("button", {
        name: "Continue",
      }),
    ).toBeVisible();
  });

  it("allows returning to the scenario pathway from the first step", async () => {
    const user = userEvent.setup();
    const onExit = vi.fn();

    render(<ScenarioIntro scenario={testScenario} onStart={vi.fn()} onExit={onExit} />);

    await user.click(
      screen.getByRole("button", {
        name: "Back to scenarios",
      }),
    );

    expect(onExit).toHaveBeenCalledTimes(1);
  });

  it("renders duration and challenge count on the second step", async () => {
    const user = userEvent.setup();

    render(<ScenarioIntro scenario={testScenario} onStart={vi.fn()} />);

    await user.click(
      screen.getByRole("button", {
        name: "Continue",
      }),
    );

    const scenarioInformation = screen.getByRole("region", {
      name: "Scenario information",
    });

    expect(within(scenarioInformation).getByText(/15 minutes/i)).toBeVisible();

    expect(within(scenarioInformation).getByText("3")).toBeVisible();

    expect(within(scenarioInformation).getByText("challenges")).toBeVisible();
  });

  it("disables second-step actions while the scenario is starting", async () => {
    const user = userEvent.setup();

    render(<ScenarioIntro scenario={testScenario} isStarting onStart={vi.fn()} />);

    await user.click(
      screen.getByRole("button", {
        name: "Continue",
      }),
    );

    expect(
      screen.getByRole("button", {
        name: "Starting…",
      }),
    ).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: "Back",
      }),
    ).toBeDisabled();
  });

  it("displays a start error on the second step", async () => {
    const user = userEvent.setup();

    render(
      <ScenarioIntro
        scenario={testScenario}
        errorMessage="The scenario could not be started."
        onStart={vi.fn()}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Continue",
      }),
    );

    expect(screen.getByRole("alert")).toHaveTextContent("The scenario could not be started.");
  });
});
