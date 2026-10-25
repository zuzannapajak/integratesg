import PilotSatisfactionForm from "@/components/pilot-satisfaction/pilot-satisfaction-form";
import PilotSatisfactionResult from "@/components/pilot-satisfaction/pilot-satisfaction-result";
import { requireRole } from "@/features/auth/requireRole";
import { APP_ROLES } from "@/lib/auth/roles";
import { getPilotSatisfactionAvailability } from "@/lib/pilot-satisfaction/queries";
import { isPilotSurveyScope } from "@/lib/pilot-satisfaction/validation";
import { notFound } from "next/navigation";

export default async function PilotSatisfactionPage({ params }:
  { params: Promise<{ locale: string; scope: string }> }) {
  const { locale, scope } = await params;
  if (!isPilotSurveyScope(scope)) notFound();
  const { user } = await requireRole(locale,
    scope === "curriculum" ? APP_ROLES.educator : [APP_ROLES.educator, APP_ROLES.learner]);
  const availability = await getPilotSatisfactionAvailability(user.id, scope, locale);
  return (
    <main className="min-h-screen bg-[#f5f5f3] px-4 py-10">
      <div className="mx-auto max-w-3xl">
        {availability.submittedAt ? (
          <PilotSatisfactionResult locale={locale} scope={scope} state="already-submitted" />
        ) : availability.eligible ? (
          <PilotSatisfactionForm locale={locale} scope={scope} caseStudies={availability.caseStudies} />
        ) : (
          <PilotSatisfactionResult locale={locale} scope={scope} state="unavailable" />
        )}
      </div>
    </main>
  );
}
