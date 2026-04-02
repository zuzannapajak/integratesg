import { APP_LOCALES } from "@/lib/i18n/locales";
import { prisma } from "@/lib/prisma";

export type PlatformStats = {
  caseStudies: number;
  scenarioAreas: number;
  partnerLanguages: number;
};

const FALLBACK_STATS: PlatformStats = {
  caseStudies: 6,
  scenarioAreas: 3,
  partnerLanguages: APP_LOCALES.length,
};

export async function getPlatformStats(): Promise<PlatformStats> {
  try {
    const [caseStudiesCount, distinctScenarioAreas] = await Promise.all([
      prisma.caseStudy.count({
        where: {
          status: "published",
        },
      }),
      prisma.scenario.findMany({
        where: {
          status: "published",
        },
        select: {
          area: true,
        },
        distinct: ["area"],
      }),
    ]);

    return {
      caseStudies: caseStudiesCount > 0 ? caseStudiesCount : FALLBACK_STATS.caseStudies,
      scenarioAreas:
        distinctScenarioAreas.length > 0
          ? distinctScenarioAreas.length
          : FALLBACK_STATS.scenarioAreas,
      partnerLanguages: APP_LOCALES.length,
    };
  } catch {
    return FALLBACK_STATS;
  }
}
