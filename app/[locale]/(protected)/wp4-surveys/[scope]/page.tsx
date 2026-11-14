import Wp4SurveyForm from "@/components/wp4-surveys/wp4-survey-form";
import Wp4SurveyResult from "@/components/wp4-surveys/wp4-survey-result";
import { requireRole } from "@/features/auth/requireRole";
import { APP_ROLES } from "@/lib/auth/roles";
import { isAppLocale } from "@/lib/i18n/locales";
import { getWp4PlatformFeedbackEligibility } from "@/lib/platform-feedback/wp4-eligibility";
import { isWp4SurveyScope } from "@/lib/wp4-surveys/definition";
import { getWp4SurveyAvailability } from "@/lib/wp4-surveys/queries";
import { notFound } from "next/navigation";

export default async function Wp4SurveyPage({
  params,
}: {
  params: Promise<{ locale: string; scope: string }>;
}) {
  const { locale, scope } = await params;
  if (!isAppLocale(locale)) notFound();
  if (!isWp4SurveyScope(scope)) notFound();
  const { user } = await requireRole(locale, [APP_ROLES.learner, APP_ROLES.educator]);
  const availability = await getWp4SurveyAvailability(user.id, scope);

  if (availability.submittedAt) {
    const platform = await getWp4PlatformFeedbackEligibility(user.id);
    return (
      <main className="min-h-screen bg-[#f5f5f3] px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <Wp4SurveyResult
            locale={locale}
            scope={scope}
            state="submitted"
            platformEligible={platform.eligible}
          />
        </div>
      </main>
    );
  }
  if (!availability.eligible) {
    return (
      <main className="min-h-screen bg-[#f5f5f3] px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <Wp4SurveyResult
            locale={locale}
            scope={scope}
            state="unavailable"
            platformEligible={false}
          />
        </div>
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-[#f5f5f3] px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <Wp4SurveyForm
          locale={locale}
          scope={scope}
          completedCount={
            scope === "case-studies"
              ? availability.activity.caseStudiesCompleted
              : availability.activity.scenariosCompleted
          }
        />
      </div>
    </main>
  );
}
