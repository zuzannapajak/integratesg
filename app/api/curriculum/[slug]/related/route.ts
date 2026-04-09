import { getRelatedCourseModules } from "@/lib/curriculum/queries";
import { logMeasuredOperation } from "@/lib/observability/performance";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const startedAt = Date.now();
  let records = 0;
  let status: "ok" | "error" = "ok";

  try {
    const { slug } = await context.params;
    const locale = request.nextUrl.searchParams.get("locale") ?? "en";

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
      select: { role: true },
    });

    if (profile?.role !== "educator") {
      status = "error";
      return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }

    const relatedModules = await getRelatedCourseModules({
      userId: user.id,
      locale,
      slug,
    });

    records = relatedModules.length;

    return NextResponse.json({
      ok: true,
      relatedModules,
    });
  } catch (error) {
    status = "error";
    console.error(error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to load related modules.",
      },
      { status: 500 },
    );
  } finally {
    logMeasuredOperation({
      operation: "api.curriculum.related.GET",
      durationMs: Date.now() - startedAt,
      records,
      status,
    });
  }
}
