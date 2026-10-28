import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { PilotSurveyScope } from "@/lib/pilot-satisfaction/validation";

export default async function PilotSatisfactionCallout({
  locale,
  scope,
  submitted,
}: {
  locale: string;
  scope: PilotSurveyScope;
  submitted: boolean;
}) {
  const t = await getTranslations({ locale, namespace: "Protected.PilotSatisfaction" });
  return (
    <section className="my-6 rounded-[28px] border border-[#dbe8e6] bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#31425a]">{t(`scope.${scope}.title`)}</h2>
          <p className="mt-1 text-sm text-[#536174]">{submitted ? t("saved") : t("callout")}</p>
        </div>
        {!submitted && (
          <Link
            href={`/${locale}/pilot-satisfaction/${scope}`}
            className="rounded-xl bg-[#31425a] px-5 py-3 text-sm font-semibold text-white"
          >
            {t("open")}
          </Link>
        )}
      </div>
    </section>
  );
}
