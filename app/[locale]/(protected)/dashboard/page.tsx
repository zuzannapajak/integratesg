import DashboardShell, {
  type DashboardChartPoint,
  type DashboardContinueItem,
  type DashboardKpi,
  type DashboardMetric,
  type DashboardRole,
  type DashboardStat,
} from "@/components/dashboard/dashboard-shell";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

type TranslationRecord = {
  language: string;
  title: string;
  description: string | null;
};

type AttemptWithCourse = {
  id: string;
  userId: string;
  status: string;
  progressPercent: number;
  preQuizScore: number | null;
  postQuizScore: number | null;
  startedAt: Date | null;
  lastOpenedAt: Date | null;
  completedAt: Date | null;
  course: {
    slug: string;
    translations: TranslationRecord[];
  };
};

function pickTranslation(translations: TranslationRecord[], locale: string) {
  const localeMatch = translations.find((translation) => translation.language === locale);
  if (localeMatch) return localeMatch;

  const englishMatch = translations.find((translation) => translation.language === "en");
  if (englishMatch) return englishMatch;

  return translations.at(0);
}

function formatRelativeDate(date: Date | null) {
  if (!date) return "No activity yet";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
  }).format(date);
}

function formatAverageScore(attempts: AttemptWithCourse[]) {
  const scores = attempts
    .flatMap((attempt) => [attempt.preQuizScore, attempt.postQuizScore])
    .filter((value): value is number => typeof value === "number");

  if (scores.length === 0) return "—";

  const average = scores.reduce((sum, value) => sum + value, 0) / scores.length;
  return `${Math.round(average)}%`;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function isSameDay(a: Date | null, b: Date) {
  if (!a) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildUserActivityData(attempts: AttemptWithCourse[]): DashboardChartPoint[] {
  const today = startOfDay(new Date());
  const formatter = new Intl.DateTimeFormat("en", { weekday: "short" });

  return Array.from({ length: 7 }, (_, index) => {
    const day = addDays(today, index - 6);

    const value = attempts.reduce((sum, attempt) => {
      let dayEvents = 0;

      if (isSameDay(attempt.startedAt, day)) dayEvents += 1;
      if (isSameDay(attempt.lastOpenedAt, day)) dayEvents += 1;
      if (isSameDay(attempt.completedAt, day)) dayEvents += 1;

      return sum + dayEvents;
    }, 0);

    return {
      label: formatter.format(day),
      value,
    };
  });
}

function buildAdminActivityData(attempts: AttemptWithCourse[]): DashboardChartPoint[] {
  const today = startOfDay(new Date());
  const formatter = new Intl.DateTimeFormat("en", { weekday: "short" });

  return Array.from({ length: 7 }, (_, index) => {
    const day = addDays(today, index - 6);

    const activeUsers = new Set(
      attempts
        .filter((attempt) => isSameDay(attempt.lastOpenedAt, day))
        .map((attempt) => attempt.userId),
    );

    return {
      label: formatter.format(day),
      value: activeUsers.size,
    };
  });
}

function buildTrendLabel(current: DashboardChartPoint[], previousTotal: number) {
  const currentTotal = current.reduce((sum, point) => sum + point.value, 0);

  if (currentTotal === 0 && previousTotal === 0) {
    return "No change vs previous week";
  }

  if (previousTotal === 0) {
    return `+${currentTotal} vs previous week`;
  }

  const diff = ((currentTotal - previousTotal) / previousTotal) * 100;
  const rounded = Math.round(diff * 10) / 10;

  if (rounded === 0) return "No change vs previous week";
  return `${rounded > 0 ? "+" : ""}${rounded}% vs previous week`;
}

function buildPreviousWeekTotal(attempts: AttemptWithCourse[]) {
  const today = startOfDay(new Date());
  const prevStart = addDays(today, -13);
  const prevEnd = addDays(today, -7);

  let total = 0;

  for (const attempt of attempts) {
    for (const date of [attempt.startedAt, attempt.lastOpenedAt, attempt.completedAt]) {
      if (!date) continue;
      const day = startOfDay(date);

      if (day >= prevStart && day <= prevEnd) {
        total += 1;
      }
    }
  }

  return total;
}

function buildContinueLearningItem(
  attempts: AttemptWithCourse[],
  locale: string,
): DashboardContinueItem | null {
  const latest = [...attempts]
    .sort((a, b) => {
      const left = a.lastOpenedAt?.getTime() ?? 0;
      const right = b.lastOpenedAt?.getTime() ?? 0;
      return right - left;
    })
    .at(0);

  if (!latest) return null;

  const translation = pickTranslation(latest.course.translations, locale);
  const isCompleted = latest.status === "completed";

  return {
    title: translation?.title ?? "Untitled module",
    description:
      translation?.description ??
      "Continue your latest learning module and pick up from your current progress.",
    progress: latest.progressPercent,
    href: isCompleted
      ? `/${locale}/curriculum/${latest.course.slug}`
      : `/${locale}/curriculum/${latest.course.slug}/learn`,
    badge: "Curriculum",
    ctaLabel: isCompleted ? "Review module" : "Continue module",
    kindLabel: isCompleted ? "Last completed" : "Last opened",
  };
}

function buildLearnerHeroStats(attempts: AttemptWithCourse[]): DashboardStat[] {
  const inProgress = attempts.filter((attempt) => attempt.status === "in_progress").length;
  const completed = attempts.filter((attempt) => attempt.status === "completed").length;

  const latest = [...attempts]
    .sort((a, b) => {
      const left = a.lastOpenedAt?.getTime() ?? 0;
      const right = b.lastOpenedAt?.getTime() ?? 0;
      return right - left;
    })
    .at(0);

  return [
    { label: "In progress", value: `${inProgress}` },
    { label: "Completed", value: `${completed}` },
    { label: "Last active", value: formatRelativeDate(latest?.lastOpenedAt ?? null) },
  ];
}

function buildLearnerSummaryMetrics(attempts: AttemptWithCourse[]): DashboardMetric[] {
  const completed = attempts.filter((attempt) => attempt.status === "completed").length;
  const inProgress = attempts.filter((attempt) => attempt.status === "in_progress").length;

  return [
    { label: "Completed modules", value: `${completed}` },
    { label: "Modules in progress", value: `${inProgress}` },
    { label: "Average score", value: formatAverageScore(attempts) },
  ];
}

function buildAdminHeroStats(allAttempts: AttemptWithCourse[]): DashboardStat[] {
  const sevenDaysAgo = addDays(startOfDay(new Date()), -6);

  const activeUsers = new Set(
    allAttempts
      .filter((attempt) => attempt.lastOpenedAt !== null && attempt.lastOpenedAt >= sevenDaysAgo)
      .map((attempt) => attempt.userId),
  ).size;

  const startedModules = allAttempts.filter(
    (attempt) => attempt.startedAt !== null && attempt.startedAt >= sevenDaysAgo,
  ).length;

  const completionRate =
    allAttempts.length > 0
      ? Math.round(
          (allAttempts.filter((attempt) => attempt.status === "completed").length /
            allAttempts.length) *
            100,
        )
      : 0;

  return [
    { label: "Active users", value: `${activeUsers}` },
    { label: "Started modules", value: `${startedModules}` },
    { label: "Completion rate", value: `${completionRate}%` },
  ];
}

function buildAdminKpis(allAttempts: AttemptWithCourse[]): DashboardKpi[] {
  const activeUsers = new Set(allAttempts.map((attempt) => attempt.userId)).size;
  const startedModules = allAttempts.length;
  const completedModules = allAttempts.filter((attempt) => attempt.status === "completed").length;
  const avgScore = formatAverageScore(allAttempts);

  return [
    { label: "Active users", value: `${activeUsers}`, hint: "Users with curriculum activity" },
    { label: "Started modules", value: `${startedModules}`, hint: "All learning attempts" },
    { label: "Completed modules", value: `${completedModules}`, hint: "Finished attempts" },
    { label: "Average score", value: avgScore, hint: "Across stored quiz scores" },
  ];
}

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
  });

  if (!profile) {
    redirect(`/${locale}/auth/login`);
  }

  const role = profile.role as DashboardRole;
  const displayName = profile.fullName ?? user.email?.split("@")[0] ?? "User";

  const [myAttempts, allAttempts, publishedCoursesCount] = await Promise.all([
    prisma.userCourseAttempt.findMany({
      where: { userId: user.id },
      include: {
        course: {
          select: {
            slug: true,
            translations: {
              where: { language: { in: [locale, "en"] } },
              select: {
                language: true,
                title: true,
                description: true,
              },
            },
          },
        },
      },
      orderBy: [{ lastOpenedAt: "desc" }],
    }),
    role === "admin"
      ? prisma.userCourseAttempt.findMany({
          include: {
            course: {
              select: {
                slug: true,
                translations: {
                  where: { language: { in: [locale, "en"] } },
                  select: {
                    language: true,
                    title: true,
                    description: true,
                  },
                },
              },
            },
          },
        })
      : Promise.resolve([]),
    prisma.course.count({
      where: { status: "published" },
    }),
  ]);

  const continueLearning = buildContinueLearningItem(myAttempts, locale);
  const learnerActivityData = buildUserActivityData(myAttempts);
  const learnerTrendLabel = buildTrendLabel(
    learnerActivityData,
    buildPreviousWeekTotal(myAttempts),
  );

  const adminActivityData = buildAdminActivityData(allAttempts);
  const adminTrendLabel = buildTrendLabel(adminActivityData, 0);

  return (
    <DashboardShell
      locale={locale}
      role={role}
      displayName={displayName}
      heroStats={
        role === "admin" ? buildAdminHeroStats(allAttempts) : buildLearnerHeroStats(myAttempts)
      }
      continueLearning={continueLearning}
      publishedCoursesCount={publishedCoursesCount}
      learnerSummaryMetrics={buildLearnerSummaryMetrics(myAttempts)}
      learnerActivityData={learnerActivityData}
      learnerTrendLabel={learnerTrendLabel}
      adminActivityData={adminActivityData}
      adminTrendLabel={adminTrendLabel}
      adminKpis={buildAdminKpis(allAttempts)}
    />
  );
}
