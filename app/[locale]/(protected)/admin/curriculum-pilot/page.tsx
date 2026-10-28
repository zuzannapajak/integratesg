import { getTranslations } from "next-intl/server";
import Link from "next/link";
import CurriculumPilotAdminDashboard from "@/components/stats/curriculum-pilot-admin-dashboard";
import { requireRole } from "@/features/auth/requireRole";
import { getCurriculumPilotAdminStats } from "@/lib/admin/curriculum-pilot";
import { APP_ROLES } from "@/lib/auth/roles";
import type { AppLocale } from "@/lib/i18n/locales";

type Props = {
  params: Promise<{
    locale: AppLocale;
  }>;
};

export default async function AdminCurriculumPilotPage({ params }: Props) {
  const { locale } = await params;

  await requireRole(locale, APP_ROLES.admin);

  const [stats, t] = await Promise.all([
    getCurriculumPilotAdminStats(locale),
    getTranslations({ locale, namespace: "Protected.PilotSatisfaction" }),
  ]);

  return (
    <>
      <div className="mx-auto max-w-360 px-4 pt-6">
        <Link
          href={`/${locale}/admin/pilot-satisfaction`}
          className="inline-flex rounded-xl bg-[#31425a] px-5 py-3 text-sm font-semibold text-white"
        >
          {t("admin.title")}
        </Link>
      </div>
      <CurriculumPilotAdminDashboard locale={locale} stats={stats} />
    </>
  );
}
