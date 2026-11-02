import { requireRole } from "@/features/auth/requireRole";
import { buildScenarioParticipantSummaryCsv } from "@/lib/admin/scenario-participant-summary";
import {
  buildScenarioResultsCsv,
  buildScenarioResultsExcelHtml,
  getScenarioParticipantSummaryRows,
  getScenarioResultsExportRows,
} from "@/lib/admin/scenario-results-export";
import { APP_ROLES } from "@/lib/auth/roles";
import { isAppLocale } from "@/lib/i18n/locales";
import type { NextRequest } from "next/server";

type RouteContext = {
  params: Promise<{
    locale: string;
  }>;
};

export async function GET(request: NextRequest, { params }: RouteContext): Promise<Response> {
  const { locale: localeParam } = await params;

  if (!isAppLocale(localeParam)) {
    return new Response("Not Found", {
      status: 404,
    });
  }

  const locale = localeParam;

  await requireRole(locale, APP_ROLES.admin);

  if (request.nextUrl.searchParams.get("report") === "participants") {
    const summary = await getScenarioParticipantSummaryRows();

    return new Response(buildScenarioParticipantSummaryCsv(summary), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="scenario-participant-summary.csv"',
      },
    });
  }

  const format = request.nextUrl.searchParams.get("format") === "xls" ? "xls" : "csv";

  const { rows } = await getScenarioResultsExportRows(locale);

  if (format === "xls") {
    return new Response(buildScenarioResultsExcelHtml(rows), {
      headers: {
        "Content-Type": "application/vnd.ms-excel; charset=utf-8",
        "Content-Disposition": 'attachment; filename="scenario-results.xls"',
      },
    });
  }

  return new Response(buildScenarioResultsCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="scenario-results.csv"',
    },
  });
}
