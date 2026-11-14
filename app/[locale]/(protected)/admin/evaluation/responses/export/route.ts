import { requireRole } from "@/features/auth/requireRole";
import { loadEvaluationResponseData } from "@/lib/admin/evaluation";
import {
  buildIndividualResponses,
  buildIndividualResponsesCsv,
  filteredIndividualResponses,
  parseIndividualFilters,
} from "@/lib/admin/individual-evaluation";
import { APP_ROLES } from "@/lib/auth/roles";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
type Context = { params: Promise<{ locale: string }> };

export async function GET(request: NextRequest, { params }: Context) {
  const { locale } = await params;
  await requireRole(locale, APP_ROLES.admin);
  const filters = parseIndividualFilters(request.nextUrl.searchParams);
  const filtered = filteredIndividualResponses(
    buildIndividualResponses(await loadEvaluationResponseData()),
    filters,
  );
  const includeText = request.nextUrl.searchParams.get("includeText") === "1";
  const csv = buildIndividualResponsesCsv(filtered, includeText);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="integratesg-evaluation-filtered${includeText ? "-qualitative" : ""}.csv"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
