import { prisma } from "@/lib/prisma";

export type EportfolioProgress = "not_started" | "in_progress" | "completed";

export type EportfolioLibraryItem = {
  slug: string;
  title: string;
  organization: string | null;
  summary: string | null;
  industry: string | null;
  countryCode: string;
  reportingPeriod: string | null;
  isFeatured: boolean;
  progress: EportfolioProgress;
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

export async function getEportfolioLibrary(params: {
  locale: string;
  userId: string;
}): Promise<EportfolioLibraryItem[]> {
  const requestedLanguages = getRequestedLanguages(params.locale);

  const caseStudies = await prisma.caseStudy.findMany({
    where: {
      status: "published",
    },
    select: {
      slug: true,
      countryCode: true,
      reportingPeriod: true,
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
        orderBy: [{ lastOpenedAt: "desc" }, { updatedAt: "desc" }],
        take: 1,
      },
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return caseStudies.map((caseStudy) => {
    const translation = pickTranslation(caseStudy.translations, params.locale);
    const progress = caseStudy.userProgress[0]?.status ?? "not_started";

    return {
      slug: caseStudy.slug,
      title: translation?.title ?? caseStudy.slug,
      organization: translation?.organization ?? null,
      summary: translation?.summary ?? null,
      industry: translation?.industry ?? null,
      countryCode: caseStudy.countryCode,
      reportingPeriod: caseStudy.reportingPeriod,
      isFeatured: caseStudy.isFeatured,
      progress,
    };
  });
}
