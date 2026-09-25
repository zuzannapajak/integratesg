import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";

vi.mock("framer-motion", async () => {
  const React = await import("react");

  type MotionProps = React.HTMLAttributes<HTMLElement> & {
    children?: React.ReactNode;
    initial?: unknown;
    animate?: unknown;
    exit?: unknown;
    transition?: unknown;
    layout?: unknown;
    whileHover?: unknown;
    whileTap?: unknown;
  };

  const componentCache = new Map<string, React.ComponentType<MotionProps>>();

  const motion = new Proxy(
    {},
    {
      get(_target, tag: string) {
        const cached = componentCache.get(tag);

        if (cached) {
          return cached;
        }

        function MotionComponent(props: MotionProps) {
          const domProps = { ...props } as Record<string, unknown>;
          const children = domProps.children as React.ReactNode;

          delete domProps.children;
          delete domProps.initial;
          delete domProps.animate;
          delete domProps.exit;
          delete domProps.transition;
          delete domProps.layout;
          delete domProps.whileHover;
          delete domProps.whileTap;

          return React.createElement(tag, domProps, children);
        }

        componentCache.set(tag, MotionComponent);

        return MotionComponent;
      },
    },
  );

  return {
    motion,
    AnimatePresence: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
  };
});

import CourseDetailShell from "@/components/curriculum/course-detail-shell";
import CurriculumListShell from "@/components/curriculum/curriculum-list-shell";
import curriculumMessages from "@/messages/curriculum-shells/en.json";
import protectedListMessages from "@/messages/protected-list-shells/en.json";
import { createCurriculumListItem, createCurriculumModule } from "@/tests/unit/curriculum/fixtures";

const messages = {
  Protected: {
    ...curriculumMessages.Protected,
    ...protectedListMessages.Protected,
    CurriculumListShell: {
      ...curriculumMessages.Protected.CurriculumListShell,
      ...protectedListMessages.Protected.CurriculumListShell,
    },
  },
};

function renderWithMessages(ui: React.ReactNode) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

describe("curriculum list and course detail UI", () => {
  it("renders curriculum cards with persisted progress and correct course links", () => {
    renderWithMessages(
      <CurriculumListShell
        locale="en"
        items={[
          createCurriculumListItem({
            slug: "first-module",
            title: "First module",
            status: "in_progress",
            progress: 50,
          }),
          createCurriculumListItem({
            slug: "completed-module",
            title: "Completed module",
            status: "completed",
            progress: 100,
          }),
        ]}
      />,
    );

    expect(screen.getByRole("heading", { name: "First module" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Completed module" })).toBeVisible();
    expect(screen.getByText("50%")).toBeVisible();
    expect(screen.getByText("100%")).toBeVisible();

    expect(screen.getByRole("link", { name: "Continue" })).toHaveAttribute(
      "href",
      "/en/curriculum/first-module",
    );

    expect(screen.getByRole("link", { name: "Review module" })).toHaveAttribute(
      "href",
      "/en/curriculum/completed-module",
    );
  });

  it("shows the curriculum empty state", () => {
    renderWithMessages(<CurriculumListShell locale="en" items={[]} />);

    expect(screen.getByRole("heading", { name: "No modules found" })).toBeVisible();

    expect(
      screen.getByText("Adjust your filters or search terms to find what you’re looking for."),
    ).toBeVisible();
  });

  it("shows the zero-results state after searching", async () => {
    const user = userEvent.setup();

    renderWithMessages(
      <CurriculumListShell
        locale="en"
        items={[
          createCurriculumListItem({
            slug: "visible-module",
            title: "Visible module",
          }),
        ]}
      />,
    );

    await user.type(screen.getByPlaceholderText("Search curriculum..."), "does-not-exist");

    expect(screen.getByRole("heading", { name: "No modules found" })).toBeVisible();

    expect(screen.queryByRole("heading", { name: "Visible module" })).not.toBeInTheDocument();
  });

  it("renders the course detail view and exposes the learning workspace", async () => {
    const user = userEvent.setup();

    const courseModule = createCurriculumModule({
      title: "Detailed ESG module",
      progress: 50,
      progressState: {
        currentStage: "lessons",
        currentLessonIndex: 2,
        completedLessons: 1,
        totalLessons: 2,
        preQuizAttempts: [],
        postQuizAttempts: [],
        preQuizRemainingAttempts: 1,
        postQuizRemainingAttempts: 2,
        nextAction: {
          key: "progressState.nextAction.continueModule",
        },
        currentLocation: {
          key: "progressState.currentLocation.lessonProgress",
          values: {
            current: 2,
            total: 2,
          },
        },
        completedAt: null,
      },
    });

    renderWithMessages(<CourseDetailShell locale="en" module={courseModule} />);

    expect(screen.getByRole("heading", { name: "Detailed ESG module" })).toBeVisible();

    expect(screen.getByText("50%")).toBeVisible();

    expect(screen.getByRole("link", { name: "Continue module" })).toHaveAttribute(
      "href",
      "/en/curriculum/test-module/learn",
    );

    await user.click(screen.getByRole("button", { name: "Flow" }));

    expect(screen.getByText("First lesson")).toBeVisible();
    expect(screen.getByText("Last lesson")).toBeVisible();
  });
});
