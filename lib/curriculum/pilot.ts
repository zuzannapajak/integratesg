import { prisma } from "@/lib/prisma";

type CurriculumPilotStatusValue =
  | "pre_prompt_shown"
  | "pre_skipped"
  | "pilot_active"
  | "pilot_completed";

type CurriculumPilotRecord = {
  status: CurriculumPilotStatusValue;
  preAssessmentSeenAt: Date | null;
  preAssessmentSkippedAt: Date | null;
  preAssessmentCompletedAt: Date | null;
  postAssessmentCompletedAt: Date | null;
};

export type CurriculumPilotEntryGateState = {
  shouldShowGate: boolean;
  status: CurriculumPilotStatusValue;
  preAssessmentSeenAt: string | null;
  preAssessmentSkippedAt: string | null;
  preAssessmentCompletedAt: string | null;
  postAssessmentCompletedAt: string | null;
};

export type CurriculumPilotQuestionInputType = "likert" | "single_choice" | "open_text";

export type CurriculumPilotAssessmentQuestionViewModel = {
  id: string;
  key: string;
  inputType: CurriculumPilotQuestionInputType;
  prompt: string;
  helpText: string | null;
  minValue: number | null;
  maxValue: number | null;
  isRequired: boolean;
  scaleOptions: Array<{
    value: number;
    label: string;
  }>;
};

export type CurriculumPilotLikertQuestionViewModel = CurriculumPilotAssessmentQuestionViewModel & {
  inputType: "likert";
  minValue: number;
  maxValue: number;
};

export type CurriculumPilotPreAssessmentViewModel =
  | {
      status: "available";
      questions: CurriculumPilotLikertQuestionViewModel[];
    }
  | {
      status: "unavailable";
      reason: "pre_skipped" | "pre_completed" | "pilot_already_started_or_completed";
    };

export type CurriculumPilotPostAssessmentViewModel =
  | {
      status: "available";
      completedModulesCount: number;
      questions: CurriculumPilotAssessmentQuestionViewModel[];
    }
  | {
      status: "unavailable";
      reason:
        | "no_pilot"
        | "pre_skipped"
        | "pre_missing"
        | "post_completed"
        | "no_completed_module"
        | "pilot_not_active";
      completedModulesCount: number;
    };

export type CurriculumPilotPostAssessmentCalloutViewModel = {
  shouldShow: boolean;
  isAvailable: boolean;
  isCompleted: boolean;
  completedModulesCount: number;
  postAssessmentCompletedAt: string | null;
};

const DEFAULT_SCALE_LABELS: Record<number, string> = {
  1: "Not confident at all",
  2: "Slightly confident",
  3: "Moderately confident",
  4: "Confident",
  5: "Very confident",
};

function getRequestedLanguages(locale: string) {
  return locale === "en" ? ["en"] : [locale, "en"];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseScaleLabels(raw: unknown): Record<number, string> {
  if (!isRecord(raw)) {
    return DEFAULT_SCALE_LABELS;
  }

  const parsed: Record<number, string> = { ...DEFAULT_SCALE_LABELS };

  for (const optionValue of [1, 2, 3, 4, 5]) {
    const label = raw[String(optionValue)];

    if (typeof label === "string" && label.trim().length > 0) {
      parsed[optionValue] = label.trim();
    }
  }

  return parsed;
}

function mapScaleOptions(params: {
  minValue: number;
  maxValue: number;
  labels: Record<number, string>;
}) {
  const options: Array<{ value: number; label: string }> = [];

  for (let value = params.minValue; value <= params.maxValue; value += 1) {
    options.push({
      value,
      label: params.labels[value] ?? String(value),
    });
  }

  return options;
}

function pickLocalizedRecord<T extends { language: string }>(
  records: T[],
  locale: string,
): T | null {
  let englishRecord: T | null = null;
  let firstRecord: T | null = null;

  for (const record of records) {
    firstRecord ??= record;

    if (record.language === locale) {
      return record;
    }

    if (englishRecord === null && record.language === "en") {
      englishRecord = record;
    }
  }

  return englishRecord ?? firstRecord;
}

function mapGateState(pilot: CurriculumPilotRecord): CurriculumPilotEntryGateState {
  const preDecisionMade = Boolean(pilot.preAssessmentSkippedAt ?? pilot.preAssessmentCompletedAt);

  return {
    shouldShowGate: pilot.status === "pre_prompt_shown" && !preDecisionMade,
    status: pilot.status,
    preAssessmentSeenAt: pilot.preAssessmentSeenAt?.toISOString() ?? null,
    preAssessmentSkippedAt: pilot.preAssessmentSkippedAt?.toISOString() ?? null,
    preAssessmentCompletedAt: pilot.preAssessmentCompletedAt?.toISOString() ?? null,
    postAssessmentCompletedAt: pilot.postAssessmentCompletedAt?.toISOString() ?? null,
  };
}

async function ensureCurriculumPilotPromptForUser(userId: string): Promise<CurriculumPilotRecord> {
  const existingPilot = await prisma.curriculumPilot.findUnique({
    where: {
      userId,
    },
    select: {
      status: true,
      preAssessmentSeenAt: true,
      preAssessmentSkippedAt: true,
      preAssessmentCompletedAt: true,
      postAssessmentCompletedAt: true,
    },
  });

  if (!existingPilot) {
    const now = new Date();

    return prisma.curriculumPilot.create({
      data: {
        userId,
        status: "pre_prompt_shown",
        preAssessmentSeenAt: now,
      },
      select: {
        status: true,
        preAssessmentSeenAt: true,
        preAssessmentSkippedAt: true,
        preAssessmentCompletedAt: true,
        postAssessmentCompletedAt: true,
      },
    });
  }

  if (existingPilot.status === "pre_prompt_shown" && !existingPilot.preAssessmentSeenAt) {
    return prisma.curriculumPilot.update({
      where: {
        userId,
      },
      data: {
        preAssessmentSeenAt: new Date(),
      },
      select: {
        status: true,
        preAssessmentSeenAt: true,
        preAssessmentSkippedAt: true,
        preAssessmentCompletedAt: true,
        postAssessmentCompletedAt: true,
      },
    });
  }

  return existingPilot;
}

async function getCompletedCurriculumModulesCount(userId: string) {
  return prisma.userCourseAttempt.count({
    where: {
      userId,
      OR: [
        {
          status: "completed",
        },
        {
          completedAt: {
            not: null,
          },
        },
      ],
    },
  });
}

export function getSafeCurriculumNextPath(locale: string, rawPath: string | null | undefined) {
  const fallbackPath = `/${locale}/curriculum`;

  if (!rawPath) {
    return fallbackPath;
  }

  if (rawPath === fallbackPath) {
    return fallbackPath;
  }

  if (!rawPath.startsWith(`/${locale}/curriculum/`)) {
    return fallbackPath;
  }

  if (rawPath.includes("\\") || rawPath.includes("//")) {
    return fallbackPath;
  }

  if (rawPath.includes("/curriculum/pilot/")) {
    return fallbackPath;
  }

  return rawPath;
}

export async function getCurriculumPilotEntryGateState(params: {
  userId: string;
}): Promise<CurriculumPilotEntryGateState> {
  const pilot = await ensureCurriculumPilotPromptForUser(params.userId);

  return mapGateState(pilot);
}

export async function getCurriculumPilotPreAssessmentViewModel(params: {
  userId: string;
  locale: string;
}): Promise<CurriculumPilotPreAssessmentViewModel> {
  const pilot = await ensureCurriculumPilotPromptForUser(params.userId);

  if (pilot.preAssessmentSkippedAt || pilot.status === "pre_skipped") {
    return {
      status: "unavailable",
      reason: "pre_skipped",
    };
  }

  if (pilot.preAssessmentCompletedAt) {
    return {
      status: "unavailable",
      reason: "pre_completed",
    };
  }

  if (pilot.status !== "pre_prompt_shown") {
    return {
      status: "unavailable",
      reason: "pilot_already_started_or_completed",
    };
  }

  const questions = await prisma.curriculumPilotQuestion.findMany({
    where: {
      isActive: true,
      inputType: "likert",
    },
    orderBy: {
      sortOrder: "asc",
    },
    include: {
      translations: {
        where: {
          language: {
            in: getRequestedLanguages(params.locale),
          },
        },
      },
    },
  });

  return {
    status: "available",
    questions: questions.map((question) => {
      const translation = pickLocalizedRecord(question.translations, params.locale);
      const minValue = question.minValue ?? 1;
      const maxValue = question.maxValue ?? 5;
      const scaleLabels = parseScaleLabels(translation?.labels);

      return {
        id: question.id,
        key: question.key,
        inputType: "likert",
        prompt: translation?.prompt ?? question.key,
        helpText: translation?.helpText ?? null,
        minValue,
        maxValue,
        isRequired: question.isRequired,
        scaleOptions: mapScaleOptions({
          minValue,
          maxValue,
          labels: scaleLabels,
        }),
      };
    }),
  };
}

export async function getCurriculumPilotPostAssessmentViewModel(params: {
  userId: string;
  locale: string;
}): Promise<CurriculumPilotPostAssessmentViewModel> {
  const [pilot, completedModulesCount] = await Promise.all([
    prisma.curriculumPilot.findUnique({
      where: {
        userId: params.userId,
      },
      select: {
        status: true,
        preAssessmentSkippedAt: true,
        preAssessmentCompletedAt: true,
        postAssessmentCompletedAt: true,
      },
    }),
    getCompletedCurriculumModulesCount(params.userId),
  ]);

  if (!pilot) {
    return {
      status: "unavailable",
      reason: "no_pilot",
      completedModulesCount,
    };
  }

  if (pilot.preAssessmentSkippedAt || pilot.status === "pre_skipped") {
    return {
      status: "unavailable",
      reason: "pre_skipped",
      completedModulesCount,
    };
  }

  if (!pilot.preAssessmentCompletedAt) {
    return {
      status: "unavailable",
      reason: "pre_missing",
      completedModulesCount,
    };
  }

  if (pilot.postAssessmentCompletedAt || pilot.status === "pilot_completed") {
    return {
      status: "unavailable",
      reason: "post_completed",
      completedModulesCount,
    };
  }

  if (pilot.status !== "pilot_active") {
    return {
      status: "unavailable",
      reason: "pilot_not_active",
      completedModulesCount,
    };
  }

  if (completedModulesCount < 1) {
    return {
      status: "unavailable",
      reason: "no_completed_module",
      completedModulesCount,
    };
  }

  const questions = await prisma.curriculumPilotQuestion.findMany({
    where: {
      isActive: true,
      inputType: {
        in: ["likert", "open_text"],
      },
    },
    orderBy: {
      sortOrder: "asc",
    },
    include: {
      translations: {
        where: {
          language: {
            in: getRequestedLanguages(params.locale),
          },
        },
      },
    },
  });

  return {
    status: "available",
    completedModulesCount,
    questions: questions.map((question) => {
      const translation = pickLocalizedRecord(question.translations, params.locale);
      const minValue = question.inputType === "likert" ? (question.minValue ?? 1) : null;
      const maxValue = question.inputType === "likert" ? (question.maxValue ?? 5) : null;
      const scaleLabels = parseScaleLabels(translation?.labels);

      return {
        id: question.id,
        key: question.key,
        inputType: question.inputType,
        prompt: translation?.prompt ?? question.key,
        helpText: translation?.helpText ?? null,
        minValue,
        maxValue,
        isRequired: question.isRequired,
        scaleOptions:
          question.inputType === "likert" && minValue !== null && maxValue !== null
            ? mapScaleOptions({
                minValue,
                maxValue,
                labels: scaleLabels,
              })
            : [],
      };
    }),
  };
}

export async function getCurriculumPilotPostAssessmentCalloutViewModel(params: {
  userId: string;
}): Promise<CurriculumPilotPostAssessmentCalloutViewModel> {
  const [pilot, completedModulesCount] = await Promise.all([
    prisma.curriculumPilot.findUnique({
      where: {
        userId: params.userId,
      },
      select: {
        status: true,
        preAssessmentCompletedAt: true,
        postAssessmentCompletedAt: true,
      },
    }),
    getCompletedCurriculumModulesCount(params.userId),
  ]);

  if (!pilot?.preAssessmentCompletedAt) {
    return {
      shouldShow: false,
      isAvailable: false,
      isCompleted: false,
      completedModulesCount,
      postAssessmentCompletedAt: null,
    };
  }

  const isCompleted =
    pilot.status === "pilot_completed" || Boolean(pilot.postAssessmentCompletedAt);
  const isAvailable = pilot.status === "pilot_active" && !isCompleted && completedModulesCount >= 1;

  return {
    shouldShow: pilot.status === "pilot_active" || isCompleted,
    isAvailable,
    isCompleted,
    completedModulesCount,
    postAssessmentCompletedAt: pilot.postAssessmentCompletedAt?.toISOString() ?? null,
  };
}
