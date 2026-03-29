import {
  CaseStudyArea,
  CaseStudyDetailViewModel,
  CaseStudyListItemViewModel,
  CaseStudyProgressStatus,
} from "@/lib/eportfolio/types";
import { prisma } from "@/lib/prisma";

type CaseStudyTranslationRecord = {
  language: string;
  title: string;
  summary: string | null;
  content: string;
  keyTakeaways: unknown;
  organization: string | null;
  industry: string | null;
};

type CaseStudyProgressRecord = {
  status: string;
  startedAt: Date | null;
  lastOpenedAt: Date | null;
  completedAt: Date | null;
};

type CaseStudyRecord = {
  id: string;
  slug: string;
  area: string;
  isFeatured: boolean;
  translations: CaseStudyTranslationRecord[];
  userProgress: CaseStudyProgressRecord[];
};

const supportedLanguages: string[] = ["en", "pl", "es"];

function pickTranslation(
  translations: CaseStudyTranslationRecord[],
  locale: string,
): CaseStudyTranslationRecord | null {
  const localeTranslation = translations.find((translation) => translation.language === locale);
  if (localeTranslation) {
    return localeTranslation;
  }

  const englishTranslation = translations.find((translation) => translation.language === "en");
  if (englishTranslation) {
    return englishTranslation;
  }

  return translations[0] ?? null;
}

function mapArea(area: string): CaseStudyArea {
  switch (area) {
    case "environmental":
      return "environmental";
    case "social":
      return "social";
    case "governance":
      return "governance";
    default:
      return "cross-cutting";
  }
}

function parseKeyTakeaways(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function buildSummary(translation: CaseStudyTranslationRecord | null): string {
  if (translation?.summary?.trim()) {
    return translation.summary.trim();
  }

  if (translation?.content.trim()) {
    return translation.content.trim().slice(0, 180);
  }

  return "No summary available yet.";
}

function mapProgressStatus(status?: string | null): CaseStudyProgressStatus {
  if (status === "completed") {
    return "completed";
  }

  if (status === "in_progress") {
    return "in_progress";
  }

  return "not_started";
}

function getProgressState(progress: CaseStudyProgressRecord[]) {
  const latestProgress = progress.at(0);
  const status = mapProgressStatus(latestProgress?.status);

  return {
    status,
    isCompleted: status === "completed",
    startedAt: latestProgress?.startedAt?.toISOString() ?? null,
    lastOpenedAt: latestProgress?.lastOpenedAt?.toISOString() ?? null,
    completedAt: latestProgress?.completedAt?.toISOString() ?? null,
  };
}

function mapCaseStudyToListItem(
  caseStudy: CaseStudyRecord,
  locale: string,
): CaseStudyListItemViewModel {
  const translation = pickTranslation(caseStudy.translations, locale);
  const progress = getProgressState(caseStudy.userProgress);

  return {
    slug: caseStudy.slug,
    title: translation?.title ?? "Untitled case study",
    summary: buildSummary(translation),
    area: mapArea(caseStudy.area),
    organization: translation?.organization ?? null,
    industry: translation?.industry ?? null,
    isFeatured: caseStudy.isFeatured,
    status: progress.status,
    isCompleted: progress.isCompleted,
    startedAt: progress.startedAt,
    lastOpenedAt: progress.lastOpenedAt,
    completedAt: progress.completedAt,
  };
}

function mapCaseStudyToDetail(
  caseStudy: CaseStudyRecord,
  locale: string,
): CaseStudyDetailViewModel {
  const translation = pickTranslation(caseStudy.translations, locale);
  const progress = getProgressState(caseStudy.userProgress);

  return {
    slug: caseStudy.slug,
    title: translation?.title ?? "Untitled case study",
    summary: buildSummary(translation),
    content: translation
      ? translation.content.trim() || "This case study content has not been added yet."
      : "This case study content has not been added yet.",
    area: mapArea(caseStudy.area),
    organization: translation?.organization ?? null,
    industry: translation?.industry ?? null,
    isFeatured: caseStudy.isFeatured,
    keyTakeaways: parseKeyTakeaways(translation?.keyTakeaways),
    status: progress.status,
    isCompleted: progress.isCompleted,
    startedAt: progress.startedAt,
    lastOpenedAt: progress.lastOpenedAt,
    completedAt: progress.completedAt,
  };
}

export async function getAllCaseStudies(params: { locale: string; userId: string }) {
  const caseStudies = await prisma.caseStudy.findMany({
    where: {
      status: "published",
    },
    select: {
      id: true,
      slug: true,
      area: true,
      isFeatured: true,
      translations: {
        where: {
          language: {
            in: supportedLanguages,
          },
        },
        select: {
          language: true,
          title: true,
          summary: true,
          content: true,
          keyTakeaways: true,
          organization: true,
          industry: true,
        },
      },
      userProgress: {
        where: {
          userId: params.userId,
        },
        select: {
          status: true,
          startedAt: true,
          lastOpenedAt: true,
          completedAt: true,
        },
        orderBy: [{ updatedAt: "desc" }],
        take: 1,
      },
    },
    orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return caseStudies.map((caseStudy) => mapCaseStudyToListItem(caseStudy, params.locale));
}

export async function getCaseStudyDetail(params: { locale: string; userId: string; slug: string }) {
  const caseStudy = await prisma.caseStudy.findFirst({
    where: {
      slug: params.slug,
      status: "published",
    },
    select: {
      id: true,
      slug: true,
      area: true,
      isFeatured: true,
      translations: {
        where: {
          language: {
            in: [params.locale, "en"],
          },
        },
        select: {
          language: true,
          title: true,
          summary: true,
          content: true,
          keyTakeaways: true,
          organization: true,
          industry: true,
        },
      },
      userProgress: {
        where: {
          userId: params.userId,
        },
        select: {
          status: true,
          startedAt: true,
          lastOpenedAt: true,
          completedAt: true,
        },
        orderBy: [{ updatedAt: "desc" }],
        take: 1,
      },
    },
  });

  if (!caseStudy) {
    return null;
  }

  return mapCaseStudyToDetail(caseStudy, params.locale);
}

export async function touchCaseStudyProgress(params: { userId: string; slug: string }) {
  const caseStudy = await prisma.caseStudy.findUnique({
    where: {
      slug: params.slug,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (caseStudy?.status !== "published") {
    return null;
  }

  const now = new Date();
  const existing = await prisma.userCaseStudyProgress.findUnique({
    where: {
      userId_caseStudyId: {
        userId: params.userId,
        caseStudyId: caseStudy.id,
      },
    },
    select: {
      status: true,
      startedAt: true,
      completedAt: true,
    },
  });

  if (!existing) {
    await prisma.userCaseStudyProgress.create({
      data: {
        userId: params.userId,
        caseStudyId: caseStudy.id,
        status: "in_progress",
        startedAt: now,
        lastOpenedAt: now,
      },
    });
  } else {
    await prisma.userCaseStudyProgress.update({
      where: {
        userId_caseStudyId: {
          userId: params.userId,
          caseStudyId: caseStudy.id,
        },
      },
      data: {
        status: existing.status === "completed" ? "completed" : "in_progress",
        startedAt: existing.startedAt ?? now,
        lastOpenedAt: now,
      },
    });
  }

  return { lastOpenedAt: now.toISOString() };
}

export async function markCaseStudyCompleted(params: { userId: string; slug: string }) {
  const caseStudy = await prisma.caseStudy.findUnique({
    where: {
      slug: params.slug,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (caseStudy?.status !== "published") {
    return null;
  }

  const existing = await prisma.userCaseStudyProgress.findUnique({
    where: {
      userId_caseStudyId: {
        userId: params.userId,
        caseStudyId: caseStudy.id,
      },
    },
    select: {
      startedAt: true,
    },
  });

  const now = new Date();

  await prisma.userCaseStudyProgress.upsert({
    where: {
      userId_caseStudyId: {
        userId: params.userId,
        caseStudyId: caseStudy.id,
      },
    },
    update: {
      status: "completed",
      startedAt: existing?.startedAt ?? now,
      lastOpenedAt: now,
      completedAt: now,
    },
    create: {
      userId: params.userId,
      caseStudyId: caseStudy.id,
      status: "completed",
      startedAt: now,
      lastOpenedAt: now,
      completedAt: now,
    },
  });

  return {
    status: "completed" as const,
    completedAt: now.toISOString(),
    lastOpenedAt: now.toISOString(),
  };
}
