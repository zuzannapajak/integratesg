import type {
  CurriculumListItemViewModel,
  CurriculumModuleViewModel,
} from "@/lib/curriculum/types";

export function createCurriculumListItem(
  overrides: Partial<CurriculumListItemViewModel> = {},
): CurriculumListItemViewModel {
  return {
    slug: "test-module",
    title: "Test module",
    subtitle: "Test subtitle",
    description: "Test module description",
    area: "social",
    status: "not_started",
    progress: 0,
    durationMinutes: 30,
    lessons: 2,
    quizzes: 0,
    lastOpenedAt: null,
    difficulty: "foundation",
    ...overrides,
  };
}

export function createCurriculumModule(
  overrides: Partial<CurriculumModuleViewModel> = {},
): CurriculumModuleViewModel {
  const base: CurriculumModuleViewModel = {
    slug: "test-module",
    title: "Test module",
    subtitle: "Test subtitle",
    description: "Test module description",
    content: null,
    details: null,
    area: "social",
    status: "in_progress",
    progress: 0,
    durationMinutes: 30,
    lessons: 2,
    quizzes: 0,
    lastOpenedAt: null,
    difficulty: "foundation",
    outcomes: [],
    structure: [],
    quizItems: [],
    lessonsData: [
      {
        index: 1,
        slug: "first-lesson",
        title: "First lesson",
        summary: "First lesson summary",
        content: "First lesson page one\n\n<!-- page -->\n\nFirst lesson page two",
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
    progressState: {
      currentStage: "lessons",
      currentLessonIndex: 1,
      completedLessons: 0,
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
          current: 1,
          total: 2,
        },
      },
      completedAt: null,
    },
    certificate: {
      isAvailable: false,
      downloadUrl: null,
    },
  };

  return {
    ...base,
    ...overrides,
    progressState: {
      ...base.progressState,
      ...(overrides.progressState ?? {}),
    },
    certificate: {
      ...base.certificate,
      ...(overrides.certificate ?? {}),
    },
  };
}
