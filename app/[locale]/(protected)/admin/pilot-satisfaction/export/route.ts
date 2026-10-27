import { requireRole } from "@/features/auth/requireRole";
import { APP_ROLES } from "@/lib/auth/roles";
import { getPilotSatisfactionStats } from "@/lib/pilot-satisfaction/stats";

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  await requireRole(locale, APP_ROLES.admin);
  const stats = await getPilotSatisfactionStats();
  const header =
    "scope,country,unique_respondents,internal_target,remaining,average_overall_satisfaction";
  const rows = stats.flatMap((item) =>
    item.byCountry.map((row) =>
      [
        item.scope,
        row.countryCode,
        row.respondents,
        row.target,
        row.remaining,
        row.averageSatisfaction ?? "",
      ].join(","),
    ),
  );
  // BOM makes accented spreadsheet headers safe in Excel; no personal data included.
  const csv = `\uFEFF${[header, ...rows].join("\r\n")}\r\n`;
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="integratesg-internal-pilot-satisfaction.csv"',
      "Cache-Control": "private, no-store",
    },
  });
}
