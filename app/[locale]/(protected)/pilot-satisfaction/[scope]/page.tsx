import { isPilotSurveyScope } from "@/lib/pilot-satisfaction/validation";
import { notFound, redirect } from "next/navigation";

/** Retired questionnaire: preserve existing URLs without collecting obsolete answers. */
export default async function LegacyPilotSatisfactionPage({
  params,
}: {
  params: Promise<{ locale: string; scope: string }>;
}) {
  const { locale, scope } = await params;
  if (!isPilotSurveyScope(scope)) notFound();
  redirect(
    scope === "eportfolio" ? `/${locale}/wp4-surveys/case-studies` : `/${locale}/curriculum`,
  );
}
