import CourseDetailShell from "@/components/curriculum/course-detail-shell";
import CurriculumPilotEntryGate from "@/components/curriculum/curriculum-pilot-entry-gate";
import { requireRole } from "@/features/auth/requireRole";
import { APP_ROLES } from "@/lib/auth/roles";
import { getCurriculumPilotEntryGateState } from "@/lib/curriculum/pilot";
import { getCurriculumModule } from "@/lib/curriculum/queries";
import { logMeasuredOperation } from "@/lib/observability/performance";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

async function getCourseDetailPageData({ params }: Props) {
  const startedAt = Date.now();
  let records = 0;
  let status: "ok" | "error" = "ok";
  let slugForLog = "";

  try {
    const { locale, slug } = await params;
    slugForLog = slug;

    const { user } = await requireRole(locale, APP_ROLES.educator);

    const data = await getCurriculumModule({
      userId: user.id,
      locale,
      slug,
    });

    if (!data) {
      notFound();
    }

    const pilotGate = await getCurriculumPilotEntryGateState({
      userId: user.id,
    });

    records = 1;

    return {
      locale,
      module: data.module,
      pilotGate,
    };
  } catch (error) {
    status = "error";
    throw error;
  } finally {
    logMeasuredOperation({
      operation: "page.curriculum.detail.GET",
      durationMs: Date.now() - startedAt,
      records,
      status,
      meta: {
        path: "/[locale]/curriculum/[slug]",
        slug: slugForLog,
      },
    });
  }
}

export default async function CourseDetailPage(props: Props) {
  const { locale, module, pilotGate } = await getCourseDetailPageData(props);
  const returnPath = `/${locale}/curriculum/${module.slug}`;

  return (
    <main className="relative min-h-screen bg-[#f5f5f3] pb-20 transition-all duration-300">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(11,156,114,0.07),transparent_22%),radial-gradient(circle_at_84%_14%,rgba(13,127,194,0.07),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(245,245,243,1)_100%)]" />

      <div className="relative mx-auto max-w-360 px-4 pt-10 sm:px-6 lg:px-8 transition-all duration-300">
        {pilotGate.shouldShowGate ? (
          <CurriculumPilotEntryGate
            locale={locale}
            moduleSlug={module.slug}
            moduleTitle={module.title}
            returnPath={returnPath}
          />
        ) : (
          <CourseDetailShell locale={locale} module={module} />
        )}
      </div>
    </main>
  );
}
