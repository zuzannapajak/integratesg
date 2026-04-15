import ModulePlayerShell from "@/components/curriculum/module-player-shell";
import { requireRole } from "@/features/auth/requireRole";
import { APP_ROLES } from "@/lib/auth/roles";
import { getCurriculumModule } from "@/lib/curriculum/queries";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function CourseLearnPage({ params }: Props) {
  const { locale, slug } = await params;
  const { user } = await requireRole(locale, APP_ROLES.educator);

  const courseModuleResult = await getCurriculumModule({
    userId: user.id,
    locale,
    slug,
  });

  if (!courseModuleResult) {
    notFound();
  }

  return (
    <main className="relative min-h-screen bg-[#f5f5f3] pb-20 transition-all duration-300">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(11,156,114,0.07),transparent_22%),radial-gradient(circle_at_84%_14%,rgba(13,127,194,0.07),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(245,245,243,1)_100%)]" />

      <div className="relative mx-auto max-w-360 px-4 pt-10 sm:px-6 lg:px-8 transition-all duration-300">
        <ModulePlayerShell locale={locale} module={courseModuleResult.module} />
      </div>
    </main>
  );
}
