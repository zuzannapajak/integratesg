import CurriculumPilotAssessmentForm from "@/components/curriculum/curriculum-pilot-assessment-form";
import { requireRole } from "@/features/auth/requireRole";
import { APP_ROLES } from "@/lib/auth/roles";
import {
  getCurriculumPilotPostAssessmentViewModel,
  getSafeCurriculumNextPath,
} from "@/lib/curriculum/pilot";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    next?: string | string[];
  }>;
};

function getSingleSearchParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value.at(0);
  }

  return value;
}

export default async function CurriculumPilotPostAssessmentPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const nextPath = getSafeCurriculumNextPath(
    locale,
    getSingleSearchParam(resolvedSearchParams.next),
  );

  const { user } = await requireRole(locale, APP_ROLES.educator);

  const assessment = await getCurriculumPilotPostAssessmentViewModel({
    userId: user.id,
    locale,
  });

  if (assessment.status !== "available") {
    redirect(nextPath);
  }

  return (
    <main className="relative min-h-screen bg-[#f5f5f3] pb-20 transition-all duration-300">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(11,156,114,0.07),transparent_22%),radial-gradient(circle_at_84%_14%,rgba(13,127,194,0.07),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(245,245,243,1)_100%)]" />

      <div className="relative mx-auto max-w-360 px-4 pt-10 sm:px-6 lg:px-8 transition-all duration-300">
        <CurriculumPilotAssessmentForm
          locale={locale}
          nextPath={nextPath}
          assessmentType="post"
          questions={assessment.questions}
        />
      </div>
    </main>
  );
}
