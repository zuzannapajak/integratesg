import CurriculumSwitcher from "@/components/curriculum/curriculum-switcher";
import { requireRole } from "@/features/auth/requireRole";
import { APP_ROLES } from "@/lib/auth/roles";
import { getCurriculumModules } from "@/lib/curriculum/queries";
import { logMeasuredOperation } from "@/lib/observability/performance";
import { BookOpen } from "lucide-react";
import { getTranslations } from "next-intl/server";

type ViewMode = "my-courses" | "all-courses";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<unknown>;
};

function getSingleSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getViewParam(searchParams: unknown): string | string[] | undefined {
  if (typeof searchParams !== "object" || searchParams === null) {
    return undefined;
  }

  const candidate = (searchParams as Record<string, unknown>).view;

  if (typeof candidate === "string") {
    return candidate;
  }

  if (Array.isArray(candidate) && candidate.every((item) => typeof item === "string")) {
    return candidate;
  }

  return undefined;
}

function resolveViewMode(view: string | string[] | undefined): ViewMode {
  const resolvedView = getSingleSearchParam(view);
  return resolvedView === "all-courses" ? "all-courses" : "my-courses";
}

export default async function CurriculumPage({ params, searchParams }: Props) {
  const startedAt = Date.now();
  let records = 0;
  let status: "ok" | "error" = "ok";
  let myCoursesCount = 0;
  let allCoursesCount = 0;
  let activeView: ViewMode = "my-courses";

  try {
    const [{ locale }, resolvedSearchParams] = await Promise.all([
      params,
      searchParams ?? Promise.resolve(undefined),
    ]);

    activeView = resolveViewMode(getViewParam(resolvedSearchParams));

    const [t, { user }] = await Promise.all([
      getTranslations({ locale, namespace: "Protected.CurriculumPage" }),
      requireRole(locale, APP_ROLES.educator),
    ]);

    const allModules = await getCurriculumModules({ userId: user.id, locale });
    const myCourses =
      activeView === "my-courses" ? allModules.filter((item) => item.status !== "not_started") : [];
    const allCourses = activeView === "all-courses" ? allModules : [];

    myCoursesCount = myCourses.length;
    allCoursesCount = allCourses.length;
    records = myCourses.length + allCourses.length;

    return (
      <main className="relative min-h-screen bg-[#f5f5f3] pb-20 transition-all duration-300">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(11,156,114,0.07),transparent_22%),radial-gradient(circle_at_84%_14%,rgba(13,127,194,0.07),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(245,245,243,1)_100%)]" />

        <div className="relative mx-auto max-w-360 px-4 pt-10 sm:px-6 lg:px-8 transition-all duration-300">
          <header className="mb-8 flex items-center gap-4 px-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/60 bg-white text-[#0b9c72] shadow-sm">
              <BookOpen className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#31425a]">{t("title")}</h1>
              <p className="text-[#667180]">{t("subtitle")}</p>
            </div>
          </header>

          <CurriculumSwitcher
            locale={locale}
            activeView={activeView}
            myCourses={myCourses}
            allCourses={allCourses}
          />
        </div>
      </main>
    );
  } catch (error) {
    status = "error";
    throw error;
  } finally {
    logMeasuredOperation({
      operation: "page.curriculum.GET",
      durationMs: Date.now() - startedAt,
      records,
      status,
      meta: {
        path: "/[locale]/curriculum",
        activeView,
        loadingMode: "active-tab-only",
        myCourses: myCoursesCount,
        allCourses: allCoursesCount,
      },
    });
  }
}
