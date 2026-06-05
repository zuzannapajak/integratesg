import PlatformFeedbackAdminDashboard from "@/components/stats/platform-feedback-admin-dashboard";
import { requireRole } from "@/features/auth/requireRole";
import { getPlatformFeedbackAdminStats } from "@/lib/admin/platform-feedback";
import { APP_ROLES } from "@/lib/auth/roles";
import type { AppLocale } from "@/lib/i18n/locales";

type Props = {
  params: Promise<{
    locale: AppLocale;
  }>;
};

export default async function AdminPlatformFeedbackPage({ params }: Props) {
  const { locale } = await params;

  await requireRole(locale, APP_ROLES.admin);

  const stats = await getPlatformFeedbackAdminStats();

  return <PlatformFeedbackAdminDashboard locale={locale} stats={stats} />;
}
