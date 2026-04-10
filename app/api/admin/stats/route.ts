import { requireRole } from "@/features/auth/requireRole";
import { getBasicAdminStats } from "@/lib/admin/queries";
import { APP_ROLES } from "@/lib/auth/roles";
import { logMeasuredOperation, measureSyncOperation } from "@/lib/observability/performance";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const startedAt = Date.now();
  let records = 0;
  let status: "ok" | "error" = "ok";

  try {
    await requireRole("en", APP_ROLES.admin);

    const stats = await getBasicAdminStats("en");
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
