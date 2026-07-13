import { requireRole } from "@/features/auth/requireRole";
import {
  buildScenarioResultsCsv,
  buildScenarioResultsExcelHtml,
  getScenarioResultsExportRows,
} from "@/lib/admin/scenario-results-export";
import { APP_ROLES } from "@/lib/auth/roles";
import type { AppLocale } from "@/lib/i18n/locales";
import { NextRequest } from "next/server";

type RouteContext = {
  params: Promise<{
    locale: AppLocale;
  }>;
};

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { locale } = await params;

  await requireRole(locale, APP_ROLES.admin);

  const format = request.nextUrl.searchParams.get("format") === "xls" ? "xls" : "csv";
  const { rows } = await getScenarioResultsExportRows(locale);

  if (format === "xls") {
    return new Response(buildScenarioResultsExcelHtml(rows), {
      headers: {
        "Content-Type": "application/vnd.ms-excel; charset=utf-8",
        "Content-Disposition": `attachment; filename="scenario-results.xls"`,
      },
    });
  }

  return new Response(buildScenarioResultsCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="scenario-results.csv"`,
    },
  });
}
