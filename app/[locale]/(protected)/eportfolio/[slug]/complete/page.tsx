import EportfolioProgressActions from "@/components/eportfolio/eportfolio-progress-actions";
import { requireRole } from "@/features/auth/requireRole";
import { APP_ROLES } from "@/lib/auth/roles";
import { getEportfolioCaseStudyDetail } from "@/lib/eportfolio/detail";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export default async function EportfolioCompletionPage({ params }: Props) {
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
    <main className="min-h-screen bg-[#f5f5f3] pb-20">
      <div className="mx-auto max-w-360 px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8">
        <div className="space-y-6">
          <div className="px-1">
            <Link
              href={`/${locale}/eportfolio`}
              className="inline-flex items-center gap-2 text-[0.95rem] font-medium text-[#5f6977] transition hover:text-[#31425a]"
            >
              <ArrowLeft className="h-4.5 w-4.5" />
              Back to ePortfolio
            </Link>
          </div>

          <EportfolioProgressActions
            locale={locale}
            slug={caseStudy.slug}
            caseStudyTitle={caseStudy.title}
            initialProgress={caseStudy.progress}
            nextCaseStudy={caseStudy.nextCaseStudy}
          />
        </div>
      </div>
    </main>
  );
}
