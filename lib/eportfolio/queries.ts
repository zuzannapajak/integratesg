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

type CaseStudyRecord = {
  slug: string;
  area: string;
  isFeatured: boolean;
  translations: CaseStudyTranslationRecord[];
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

  return translations.length > 0 ? translations[0] : null;
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

function mapCaseStudyToListItem(
  caseStudy: CaseStudyRecord,
  locale: string,
): CaseStudyListItemViewModel {
  const translation = pickTranslation(caseStudy.translations, locale);

  return {
    slug: caseStudy.slug,
    title: translation?.title ?? "Untitled case study",
    summary: buildSummary(translation),
    area: mapArea(caseStudy.area),
    organization: translation?.organization ?? null,
    industry: translation?.industry ?? null,
    isFeatured: caseStudy.isFeatured,
  };
}

function mapCaseStudyToDetail(
  caseStudy: CaseStudyRecord,
  locale: string,
): CaseStudyDetailViewModel {
  const translation = pickTranslation(caseStudy.translations, locale);

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
  };
}

export async function getAllCaseStudies(params: { locale: string }) {
  const caseStudies = await prisma.caseStudy.findMany({
    where: {
      status: "published",
    },
    select: {
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
    },
    orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return caseStudies.map((caseStudy) => mapCaseStudyToListItem(caseStudy, params.locale));
}

export async function getCaseStudyDetail(params: { locale: string; slug: string }) {
  const caseStudy = await prisma.caseStudy.findFirst({
    where: {
      slug: params.slug,
      status: "published",
    },
    select: {
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
    },
  });

  if (!caseStudy) {
    return null;
  }

  return mapCaseStudyToDetail(caseStudy, params.locale);
}
