import { requireRole } from "@/features/auth/requireRole";
import {
  buildCsvExport,
  buildExcelHtmlExport,
  getPlatformResultsExportRows,
} from "@/lib/admin/platform-results-export";
import { APP_ROLES } from "@/lib/auth/roles";
import type { AppLocale } from "@/lib/i18n/locales";

type RouteContext = {
  params: Promise<{
    locale: AppLocale;
  }>;
};

export async function GET(request: Request, { params }: RouteContext) {
  const { locale } = await params;
  await requireRole(locale, APP_ROLES.admin);

  const url = new URL(request.url);
  const format = url.searchParams.get("format") === "xls" ? "xls" : "csv";

  const { headers, rows } = await getPlatformResultsExportRows(locale);

  if (format === "xls") {
    return new Response(buildExcelHtmlExport(headers, rows), {
      headers: {
        "Content-Type": "application/vnd.ms-excel; charset=utf-8",
        "Content-Disposition": `attachment; filename="platform-pilot-results.xls"`,
      },
    });
  }

  return new Response(buildCsvExport(headers, rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="platform-pilot-results.csv"`,
    },
  });
}
