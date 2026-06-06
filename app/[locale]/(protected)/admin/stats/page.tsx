import AdminStatsShell from "@/components/stats/admin-stats-shell";
import { requireRole } from "@/features/auth/requireRole";
import { getCurriculumPilotAdminStats } from "@/lib/admin/curriculum-pilot";
import { getPlatformFeedbackAdminStats } from "@/lib/admin/platform-feedback";
import { getBasicAdminStats } from "@/lib/admin/queries";
import { APP_ROLES } from "@/lib/auth/roles";
import type { AppLocale } from "@/lib/i18n/locales";

type Props = {
  params: Promise<{ locale: AppLocale }>;
};

export default async function AdminStatsPage({ params }: Props) {
  const { locale } = await params;

  await requireRole(locale, APP_ROLES.admin);

  const [stats, pilotStats, feedbackStats] = await Promise.all([
    getBasicAdminStats(locale),
    getCurriculumPilotAdminStats(locale),
    getPlatformFeedbackAdminStats(),
  ]);

  return (
    <AdminStatsShell
      locale={locale}
      stats={stats}
      pilotStats={pilotStats}
      feedbackStats={feedbackStats}
    />
  );
}
