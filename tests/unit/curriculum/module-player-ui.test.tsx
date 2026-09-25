import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { beforeEach, describe, expect, it, vi } from "vitest";

const actionMocks = vi.hoisted(() => ({
  startCourseAction: vi.fn(),
  completeLessonAction: vi.fn(),
  submitQuizAttemptAction: vi.fn(),
  retakeCourseAction: vi.fn(),
}));

vi.mock("@/features/curriculum/actions", () => actionMocks);

import ModulePlayerShell from "@/components/curriculum/module-player-shell";
import curriculumMessages from "@/messages/curriculum-shells/en.json";
import modulePlayerMessages from "@/messages/module-player-shells/en.json";
import { createCurriculumModule } from "@/tests/unit/curriculum/fixtures";

const messages = {
  Protected: {
    ...curriculumMessages.Protected,
    ...modulePlayerMessages.Protected,
    ModulePlayerShell: {
      ...curriculumMessages.Protected.ModulePlayerShell,
      ...modulePlayerMessages.Protected.ModulePlayerShell,
    },
  },
};

function renderModule(module = createCurriculumModule()) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ModulePlayerShell locale="en" module={module} />
    </NextIntlClientProvider>,
  );
}

beforeEach(() => {
  actionMocks.startCourseAction.mockReset();
  actionMocks.completeLessonAction.mockReset();
  actionMocks.submitQuizAttemptAction.mockReset();
  actionMocks.retakeCourseAction.mockReset();
});

describe("ModulePlayerShell lesson navigation", () => {
  it("starts on the first page and supports previous / next navigation inside a lesson", async () => {
    const user = userEvent.setup();

    renderModule();

    expect(screen.getByRole("heading", { name: "First lesson" })).toBeVisible();
    expect(screen.getByText("Unit 1")).toBeVisible();
    expect(screen.getByText("Page 1 of 2")).toBeVisible();
    expect(screen.getByText("First lesson page one")).toBeVisible();
    expect(screen.queryByRole("button", { name: "Previous" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText("Page 2 of 2")).toBeVisible();
    expect(screen.getByText("First lesson page two")).toBeVisible();
    expect(screen.getByRole("button", { name: "Previous" })).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Previous" }));

    expect(screen.getByText("Page 1 of 2")).toBeVisible();
    expect(screen.getByText("First lesson page one")).toBeVisible();
  });

  it("moves from the first lesson to the next lesson after completion", async () => {
    const user = userEvent.setup();

    const firstLessonModule = createCurriculumModule({
      lessonsData: [
        {
          index: 1,
          slug: "first-lesson",
          title: "First lesson",
          summary: "First lesson summary",
          content: "First lesson content",
          estimatedMinutes: 10,
        },
        {
          index: 2,
          slug: "last-lesson",
          title: "Last lesson",
          summary: "Last lesson summary",
          content: "Last lesson content",
          estimatedMinutes: 10,
        },
      ],
    });

    const secondLessonModule = createCurriculumModule({
      progress: 50,
      lessonsData: firstLessonModule.lessonsData,
      progressState: {
        ...firstLessonModule.progressState,
        currentLessonIndex: 2,
        completedLessons: 1,
        currentLocation: {
          key: "progressState.currentLocation.lessonProgress",
          values: {
            current: 2,
            total: 2,
          },
        },
      },
    });

    actionMocks.completeLessonAction.mockResolvedValueOnce({
      module: secondLessonModule,
    });

    renderModule(firstLessonModule);

    await user.click(screen.getByRole("button", { name: "Complete lesson and continue" }));

    expect(actionMocks.completeLessonAction).toHaveBeenCalledWith({
      locale: "en",
      courseSlug: "test-module",
      lessonIndex: 1,
    });

    expect(await screen.findByRole("heading", { name: "Last lesson" })).toBeVisible();
    expect(screen.getByText("Unit 2")).toBeVisible();
  });

  it("handles the last lesson and renders the completed module state", async () => {
    const user = userEvent.setup();

    const lastLessonModule = createCurriculumModule({
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

    const completedModule = createCurriculumModule({
      status: "completed",
      progress: 100,
      progressState: {
        ...lastLessonModule.progressState,
        currentStage: "completed",
        completedLessons: 2,
        currentLessonIndex: 2,
        currentLocation: {
          key: "progressState.currentLocation.moduleCompleted",
        },
        nextAction: {
          key: "progressState.nextAction.reviewModule",
        },
        completedAt: "2026-09-24T12:00:00.000Z",
      },
    });

    actionMocks.completeLessonAction.mockResolvedValueOnce({
      module: completedModule,
    });

    renderModule(lastLessonModule);

    expect(screen.getByRole("heading", { name: "Last lesson" })).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Complete lesson and continue" }));

    expect(actionMocks.completeLessonAction).toHaveBeenCalledWith({
      locale: "en",
      courseSlug: "test-module",
      lessonIndex: 2,
    });

    expect(
      await screen.findByRole("heading", {
        name: "You’ve completed this learning module",
      }),
    ).toBeVisible();

    expect(screen.getByText("100%")).toBeVisible();
  });
});
