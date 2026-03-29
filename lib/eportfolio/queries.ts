import {
  CaseStudyArea,
  CaseStudyDetailViewModel,
  CaseStudyListItemViewModel,
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

function getCompletionState(progress: CaseStudyProgressRecord[]) {
  const latestProgress = progress.at(0);
  const completedAt = latestProgress?.completedAt ?? null;

  return {
    isCompleted: completedAt !== null,
    completedAt: completedAt?.toISOString() ?? null,
  };
}

function mapCaseStudyToListItem(
  caseStudy: CaseStudyRecord,
  locale: string,
): CaseStudyListItemViewModel {
  const translation = pickTranslation(caseStudy.translations, locale);
  const completion = getCompletionState(caseStudy.userProgress);

  return {
    slug: caseStudy.slug,
    title: translation?.title ?? "Untitled case study",
    summary: buildSummary(translation),
    area: mapArea(caseStudy.area),
    organization: translation?.organization ?? null,
    industry: translation?.industry ?? null,
    isFeatured: caseStudy.isFeatured,
    isCompleted: completion.isCompleted,
    completedAt: completion.completedAt,
  };
}

function mapCaseStudyToDetail(
  caseStudy: CaseStudyRecord,
  locale: string,
): CaseStudyDetailViewModel {
  const translation = pickTranslation(caseStudy.translations, locale);
  const completion = getCompletionState(caseStudy.userProgress);

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
    isCompleted: completion.isCompleted,
    completedAt: completion.completedAt,
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

  const now = new Date();

  await prisma.userCaseStudyProgress.upsert({
    where: {
      userId_caseStudyId: {
        userId: params.userId,
        caseStudyId: caseStudy.id,
      },
    },
    update: {
      completedAt: now,
    },
    create: {
      userId: params.userId,
      caseStudyId: caseStudy.id,
      completedAt: now,
    },
  });

  return { completedAt: now.toISOString() };
}
