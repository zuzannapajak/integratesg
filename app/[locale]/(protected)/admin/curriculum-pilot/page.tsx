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

  const stats = await getCurriculumPilotAdminStats(locale);

  return <CurriculumPilotAdminDashboard locale={locale} stats={stats} />;
}
