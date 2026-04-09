import { APP_ROLES } from "@/lib/auth/roles";
import { logMeasuredOperation } from "@/lib/observability/performance";
import { prisma } from "@/lib/prisma";
import { getRelatedScenarios } from "@/lib/scenarios/queries";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: Request, { params }: RouteContext) {
  const startedAt = Date.now();
  let records = 0;
  let status: "ok" | "error" = "ok";
  let slugForLog = "";

  try {
    const { slug } = await params;
    slugForLog = slug;

    const url = new URL(request.url);
    const locale = url.searchParams.get("locale")?.trim() ?? "en";

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      status = "error";
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        role: true,
      },
    });

    if (!profile || (profile.role !== APP_ROLES.student && profile.role !== APP_ROLES.educator)) {
      status = "error";
      return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }

    const items = await getRelatedScenarios({
      locale,
      userId: profile.id,
      slug,
    });

    records = items.length;

    return NextResponse.json({ ok: true, items });
  } catch (error) {
    status = "error";
    console.error(error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to load related scenarios.",
      },
      { status: 500 },
    );
  } finally {
    logMeasuredOperation({
      operation: "api.scenarios.related.GET",
      durationMs: Date.now() - startedAt,
      records,
      status,
      meta: {
        path: "/api/scenarios/[slug]/related",
        slug: slugForLog,
      },
    });
  }
}
