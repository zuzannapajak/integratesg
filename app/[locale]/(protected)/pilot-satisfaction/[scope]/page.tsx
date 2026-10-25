import PilotSatisfactionForm from "@/components/pilot-satisfaction/pilot-satisfaction-form";
import { requireRole } from "@/features/auth/requireRole";
import { APP_ROLES } from "@/lib/auth/roles";
import { getPilotSatisfactionAvailability } from "@/lib/pilot-satisfaction/queries";
import { isPilotSurveyScope } from "@/lib/pilot-satisfaction/validation";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

export default async function PilotSatisfactionPage({ params }:
  { params: Promise<{ locale: string; scope: string }> }) {
  const { locale, scope } = await params;
  if (!isPilotSurveyScope(scope)) notFound();
  const { user } = await requireRole(locale,
    scope === "curriculum" ? APP_ROLES.educator : [APP_ROLES.educator, APP_ROLES.learner]);
  const t = await getTranslations({ locale, namespace: "Protected.PilotSatisfaction" });
  const availability = await getPilotSatisfactionAvailability(user.id, scope, locale);
  return (
    <main className="min-h-screen bg-[#f5f5f3] px-4 py-10">
      <div className="mx-auto max-w-3xl">
        {availability.submittedAt ? (
          <section className="rounded-3xl bg-white p-8">
            <h1 className="text-2xl font-bold text-[#31425a]">{t("success")}</h1>
            <p className="mt-3 text-[#536174]">{t("alreadySubmitted")}</p>
          </section>
        ) : availability.eligible ? (
          <PilotSatisfactionForm locale={locale} scope={scope} caseStudies={availability.caseStudies} />
        ) : (
          <section className="rounded-3xl bg-white p-8">
            <h1 className="text-2xl font-bold text-[#31425a]">{t("notAvailable")}</h1>
            <p className="mt-3 text-[#536174]">{t(`scope.${scope}.eligibility`)}</p>
          </section>
        )}
      </div>
    </main>
  );
}
