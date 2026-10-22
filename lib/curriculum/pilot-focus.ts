import { buildPilotModuleCoverage, startedAfterPreAssessment } from '@/lib/curriculum/pilot-coverage';
import { prisma } from '@/lib/prisma';

export type CurriculumPilotFocus = {
  modules: Array<{ slug: string; title: string; completed: boolean }>;
  completedFocusCount: number;
};

export async function getCurriculumPilotFocus(params: {
  userId: string;
  locale: string;
}): Promise<CurriculumPilotFocus | null> {
  const [courses, pilots, attempts] = await Promise.all([
    prisma.course.findMany({
      where: { status: 'published' },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      select: {
        id: true,
        slug: true,
        translations: {
          where: { language: { in: [params.locale, 'en'] } },
          select: { language: true, title: true },
        },
      },
    }),
    prisma.curriculumPilot.findMany({
      where: { preAssessmentCompletedAt: { not: null } },
      select: { userId: true, preAssessmentCompletedAt: true },
    }),
    prisma.userCourseAttempt.findMany({
      where: { userId: params.userId },
      select: { userId: true, courseId: true, status: true, startedAt: true, completedAt: true },
    }),
  ]);

  if (!pilots.some((pilot) => pilot.userId === params.userId)) return null;

  const coverage = buildPilotModuleCoverage({
    courses: courses.map((course) => ({ id: course.id, slug: course.slug, title: course.slug })),
    pilots,
    attempts,
  });
  const ids = coverage.focusCourseIdsByUser.get(params.userId) ?? [];
  if (ids.length === 0) return null;

  const preCompletedAt = pilots.find((pilot) => pilot.userId === params.userId)?.preAssessmentCompletedAt ?? null;
  const modules = ids.flatMap((id) => {
    const course = courses.find((candidate) => candidate.id === id);
    if (!course) return [];
    const title = course.translations.find((translation) => translation.language === params.locale)?.title
      ?? course.translations.find((translation) => translation.language === 'en')?.title
      ?? course.slug;
    const attempt = attempts.find((candidate) => candidate.courseId === id);
    return [{ slug: course.slug, title, completed: !!attempt && startedAfterPreAssessment(attempt, preCompletedAt)
      && (attempt.status === 'completed' || attempt.completedAt !== null) }];
  });

  return { modules, completedFocusCount: modules.filter((module) => module.completed).length };
}
