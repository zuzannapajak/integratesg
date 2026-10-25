import "server-only";

import { prisma } from "@/lib/prisma";
import type { PilotSurveyScope } from "@/lib/pilot-satisfaction/validation";

export async function getPilotSatisfactionAvailability(userId: string, scope: PilotSurveyScope, locale: string) {
  const submission = await prisma.pilotSatisfactionSubmission.findUnique({
    where: { userId_scope: { userId, scope } },
    select: { submittedAt: true },
  });

  if (scope === "curriculum") {
    const pilot = await prisma.curriculumPilot.findUnique({
      where: { userId },
      select: { postAssessmentCompletedAt: true },
    });
    return { submittedAt: submission?.submittedAt.toISOString() ?? null,
      eligible: Boolean(pilot?.postAssessmentCompletedAt), caseStudies: [] };
  }

  const completed = await prisma.userCaseStudyProgress.findMany({
    where: { userId, status: "completed", caseStudy: { status: "published" } },
    select: { caseStudy: { select: {
      id: true, slug: true,
      translations: { where: { language: { in: [locale, "en"] } }, select: { language: true, title: true } },
    } } },
  });
  const caseStudies = completed.map(({ caseStudy }) => ({
    id: caseStudy.id,
    slug: caseStudy.slug,
    title: caseStudy.translations.find((t) => t.language === locale)?.title ??
      caseStudy.translations.find((t) => t.language === "en")?.title ?? caseStudy.slug,
  }));
  return { submittedAt: submission?.submittedAt.toISOString() ?? null,
    eligible: caseStudies.length > 0, caseStudies };
}
