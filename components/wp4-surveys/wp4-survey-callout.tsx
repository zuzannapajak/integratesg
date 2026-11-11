import { wp4SurveyHref, type Wp4SurveyScope } from "@/lib/wp4-surveys/definition";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function Wp4SurveyCallout({
  locale,
  scope,
  canCompleteSurvey,
  canGivePlatformFeedback,
}: {
  locale: string;
  scope: Wp4SurveyScope;
  canCompleteSurvey: boolean;
  canGivePlatformFeedback: boolean;
}) {
  if (!canCompleteSurvey && !canGivePlatformFeedback) return null;
  const t = await getTranslations({ locale, namespace: "Protected.Wp4Survey" });
  const platform = !canCompleteSurvey && canGivePlatformFeedback;
  return (
    <aside
      className="my-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-white px-5 py-4 shadow-sm"
      aria-label={t("reminder")}
    >
      <div>
        <p className="text-base font-bold text-[#31425a]">
          {platform ? t("platformTitle") : t(`scope.${scope}.title`)}
        </p>
        <p className="mt-1 text-sm text-[#667180]">
          {platform ? t("platformReminder") : t("reminder")}
        </p>
      </div>
      <Link
        href={platform ? `/${locale}/platform-feedback?context=wp4` : wp4SurveyHref(locale, scope)}
        className="inline-flex min-h-11 items-center rounded-xl bg-[#31425a] px-5 py-2 text-sm font-semibold text-white"
      >
        {platform ? t("platformFeedback") : t("open")}
      </Link>
    </aside>
  );
}
