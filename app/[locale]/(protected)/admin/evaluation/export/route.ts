import { requireRole } from "@/features/auth/requireRole";
import {
  buildEvaluationResponsesCsv,
  buildEvaluationSummaryCsv,
} from "@/lib/admin/evaluation-export";
import { buildEvaluationReport, loadEvaluationData } from "@/lib/admin/evaluation";
import { APP_ROLES } from "@/lib/auth/roles";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ locale: string }> };

export async function GET(request: NextRequest, { params }: Context) {
  const { locale } = await params;
  await requireRole(locale, APP_ROLES.admin);

  const kind = request.nextUrl.searchParams.get("kind") === "responses" ? "responses" : "summary";
  const includeText =
    kind === "responses" && request.nextUrl.searchParams.get("includeText") === "1";
  const data = await loadEvaluationData();
  const csv =
    kind === "summary"
      ? buildEvaluationSummaryCsv(buildEvaluationReport(data))
      : buildEvaluationResponsesCsv(data, { includeText });
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="integratesg-evaluation-${kind}${includeText ? "-qualitative" : ""}.csv"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
