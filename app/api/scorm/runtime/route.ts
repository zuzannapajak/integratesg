import { logMeasuredOperation } from "@/lib/observability/performance";
import { updateScenarioRuntimeProgress } from "@/lib/scenarios/queries";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

type RuntimeRequestBody = {
  locale?: string;
  scenarioSlug?: string;
  lessonStatus?: string | null;
  scoreRaw?: string | null;
  sessionTime?: string | null;
  suspendData?: string | null;
  lessonLocation?: string | null;
  rawTrackingData?: Record<string, string> | null;
};

function isRuntimeRequestBody(value: unknown): value is RuntimeRequestBody {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  return true;
}

export async function POST(request: Request) {
  const startedAt = Date.now();
  let records = 0;
  let status: "ok" | "error" = "ok";

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      status = "error";
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json: unknown = await request.json();

    if (!isRuntimeRequestBody(json)) {
      status = "error";
      return NextResponse.json({ error: "Invalid runtime payload" }, { status: 400 });
    }

    const body = json;

    if (
      typeof body.locale !== "string" ||
      body.locale.trim().length === 0 ||
      typeof body.scenarioSlug !== "string" ||
      body.scenarioSlug.trim().length === 0
    ) {
      status = "error";
      return NextResponse.json({ error: "Invalid runtime payload" }, { status: 400 });
    }

    const scenario = await updateScenarioRuntimeProgress({
      locale: body.locale,
      userId: user.id,
      slug: body.scenarioSlug,
      lessonStatus: body.lessonStatus ?? null,
      scoreRaw: body.scoreRaw ?? null,
      sessionTime: body.sessionTime ?? null,
      suspendData: body.suspendData ?? null,
      lessonLocation: body.lessonLocation ?? null,
      rawTrackingData: body.rawTrackingData ?? null,
    });

    if (!scenario) {
      status = "error";
      return NextResponse.json({ error: "Scenario not found" }, { status: 404 });
    }

    records = 1;

    return NextResponse.json({ ok: true, scenario });
  } catch (error) {
    status = "error";
    console.error(error);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  } finally {
    logMeasuredOperation({
      operation: "api.scorm.runtime.POST",
      durationMs: Date.now() - startedAt,
      records,
      status,
    });
  }
}
