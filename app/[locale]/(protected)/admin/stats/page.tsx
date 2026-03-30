import AdminStatsShell from "@/components/stats/admin-stats-shell";
import { requireRole } from "@/features/auth/requireRole";
import { getBasicAdminStats } from "@/lib/admin/queries";
import { APP_ROLES } from "@/lib/auth/roles";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AdminStatsPage({ params }: Props) {
  const { locale } = await params;

  await requireRole(locale, APP_ROLES.admin);

  const stats = await getBasicAdminStats(locale);

  return <AdminStatsShell locale={locale} stats={stats} />;
}
