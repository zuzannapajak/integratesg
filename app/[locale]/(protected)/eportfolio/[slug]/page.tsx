import EportfolioDetail from "@/components/eportfolio/eportfolio-detail";
import { requireRole } from "@/features/auth/requireRole";
import { APP_ROLES } from "@/lib/auth/roles";
import { getEportfolioCaseStudyDetail } from "@/lib/eportfolio/detail";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export default async function EportfolioCaseStudyPage({ params }: Props) {
  const { locale, slug } = await params;

  const { user } = await requireRole(locale, [APP_ROLES.learner, APP_ROLES.educator]);

  const caseStudy = await getEportfolioCaseStudyDetail({
    locale,
    userId: user.id,
    slug,
  });

  if (!caseStudy) {
    notFound();
  }

  return (
    <main className="relative min-h-screen bg-[#f5f5f3] pb-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_8%,rgba(11,156,114,0.07),transparent_22%),radial-gradient(circle_at_84%_10%,rgba(13,127,194,0.06),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(245,245,243,1)_100%)]" />

      <div className="relative mx-auto max-w-360 px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8">
        <EportfolioDetail locale={locale} caseStudy={caseStudy} />
      </div>
    </main>
  );
}
