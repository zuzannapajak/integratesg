import { prisma } from "@/lib/prisma";

import type { EportfolioProgress } from "./library";

export type EportfolioCaseStudyDetail = {
  slug: string;
  title: string;
  organization: string | null;
  summary: string | null;
  industry: string | null;
  countryCode: string;
  reportingPeriod: string | null;
  sourcePartner: string | null;
  isFeatured: boolean;
  content: string;
  keyTakeaways: string[];
  progress: EportfolioProgress;
  nextCaseStudy: {
    slug: string;
    title: string;
  } | null;
};

function getRequestedLanguages(locale: string) {
  return locale === "en" ? ["en"] : [locale, "en"];
}

function pickTranslation<
  T extends {
    language: string;
  },
>(translations: T[], locale: string): T | null {
  return (
    translations.find((translation) => translation.language === locale) ??
    translations.find((translation) => translation.language === "en") ??
    translations.at(0) ??
    null
  );
}

function parseKeyTakeaways(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function normaliseProgress(status: string | undefined): EportfolioProgress {
  if (status === "completed") {
    return "completed";
  }

  if (status === "in_progress") {
    return "in_progress";
  }

  return "not_started";
}

export async function getEportfolioCaseStudyDetail(params: {
  locale: string;
  userId: string;
  slug: string;
}): Promise<EportfolioCaseStudyDetail | null> {
  const requestedLanguages = getRequestedLanguages(params.locale);

  const caseStudies = await prisma.caseStudy.findMany({
    where: {
      status: "published",
    },
    select: {
      slug: true,
      sortOrder: true,
      countryCode: true,
      reportingPeriod: true,
      sourcePartner: true,
      isFeatured: true,
      translations: {
        where: {
          language: {
            in: requestedLanguages,
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
          lastOpenedAt: true,
        },
        orderBy: [
          {
            lastOpenedAt: "desc",
          },
          {
            updatedAt: "desc",
          },
        ],
        take: 1,
      },
    },
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        createdAt: "asc",
      },
    ],
  });

  const currentIndex = caseStudies.findIndex((caseStudy) => caseStudy.slug === params.slug);

  if (currentIndex === -1) {
    return null;
  }

  const caseStudy = caseStudies.at(currentIndex);

  if (!caseStudy) {
    return null;
  }

  const translation = pickTranslation(caseStudy.translations, params.locale);

  if (!translation) {
    return null;
  }

  const nextRecord = caseStudies.at(currentIndex + 1) ?? null;

  const nextTranslation = nextRecord
    ? pickTranslation(nextRecord.translations, params.locale)
    : null;

  return {
    slug: caseStudy.slug,
    title: translation.title,
    organization: translation.organization,
    summary: translation.summary,
    industry: translation.industry,
    countryCode: caseStudy.countryCode,
    reportingPeriod: caseStudy.reportingPeriod,
    sourcePartner: caseStudy.sourcePartner,
    isFeatured: caseStudy.isFeatured,
    content: translation.content,
    keyTakeaways: parseKeyTakeaways(translation.keyTakeaways),
    progress: normaliseProgress(caseStudy.userProgress.at(0)?.status),
    nextCaseStudy:
      nextRecord && nextTranslation
        ? {
            slug: nextRecord.slug,
            title: nextTranslation.title,
          }
        : null,
  };
}
