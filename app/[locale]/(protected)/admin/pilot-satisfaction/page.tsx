import { requireRole } from "@/features/auth/requireRole";
import { APP_ROLES } from "@/lib/auth/roles";
import { getPilotSatisfactionStats } from "@/lib/pilot-satisfaction/stats";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function AdminPilotSatisfactionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await requireRole(locale, APP_ROLES.admin);
  const [stats, t] = await Promise.all([
    getPilotSatisfactionStats(),
    getTranslations({ locale, namespace: "Protected.PilotSatisfaction" }),
  ]);
  return (
    <main className="min-h-screen bg-[#f5f5f3] px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <Link
          href={`/${locale}/admin/curriculum-pilot`}
          className="text-sm text-[#536174] hover:underline"
        >
          ← {t("back")}
        </Link>
        <h1 className="text-3xl font-bold text-[#31425a]">{t("admin.title")}</h1>
        <p className="text-sm leading-7 text-[#536174]">{t("admin.disclaimer")}</p>
        <Link
          href={`/${locale}/admin/pilot-satisfaction/export`}
          className="inline-flex rounded-xl border border-[#d9e2ec] bg-white px-4 py-2 text-sm font-semibold text-[#31425a]"
        >
          {t("admin.export")}
        </Link>
        {stats.map((survey) => {
          const pl = survey.byCountry.find((row) => row.countryCode === "PL");
          if (!pl) {
            throw new Error("Missing satisfaction metrics for Poland");
          }
          return (
            <section key={survey.scope} className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#31425a]">
                {t(`scope.${survey.scope}.title`)}
              </h2>
              <p className="mt-3 text-lg font-semibold text-[#31425a]">
                {t("admin.poland")}: {pl.respondents}/{pl.target}
              </p>
              <p className="text-sm text-[#536174]">
                {t("admin.remaining")}: {pl.remaining}
              </p>
              <div className="mt-5 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b text-[#31425a]">
                      <th className="p-3">{t("country")}</th>
                      <th className="p-3">{t("admin.responses")}</th>
                      <th className="p-3">{t("admin.average")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {survey.byCountry.map((row) => (
                      <tr key={row.countryCode} className="border-b border-[#edf1f5]">
                        <td className="p-3">{t(`countries.${row.countryCode}`)}</td>
                        <td className="p-3">{row.respondents}</td>
                        <td className="p-3">{row.averageSatisfaction?.toFixed(2) ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
