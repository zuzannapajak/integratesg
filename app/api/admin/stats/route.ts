import { requireRole } from "@/features/auth/requireRole";
import { getBasicAdminStats } from "@/lib/admin/queries";
import { APP_ROLES } from "@/lib/auth/roles";
import { DEFAULT_LOCALE, isAppLocale } from "@/lib/i18n/locales";
import { logMeasuredOperation, measureSyncOperation } from "@/lib/observability/performance";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const startedAt = Date.now();
  let records = 0;
  let status: "ok" | "error" = "ok";

  try {
    const { searchParams } = new URL(request.url);
    const detail = searchParams.get("detail");
    const rawLocale = searchParams.get("locale");
    const locale = rawLocale && isAppLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
    const includeBreakdowns = detail === "full";
    const includeRows = detail === "full";

    await requireRole(locale, APP_ROLES.admin);

    const stats = await getBasicAdminStats(locale, {
      includeBreakdowns,
      includeRows,
    });
    records = 1;

    return measureSyncOperation({
      operation: "api.admin.stats.GET.response",
      records: 1,
      execute: () => NextResponse.json(stats),
    });
  } catch (error) {
    status = "error";
    console.error(error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to load admin statistics.",
      },
      { status: 500 },
    );
  } finally {
    logMeasuredOperation({
      operation: "api.admin.stats.GET",
      durationMs: Date.now() - startedAt,
      records,
      status,
    });
  }
}
