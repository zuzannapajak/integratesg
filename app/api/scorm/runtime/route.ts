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
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json: unknown = await request.json();

    if (!isRuntimeRequestBody(json)) {
      return NextResponse.json({ error: "Invalid runtime payload" }, { status: 400 });
    }

    const body = json;

    if (
      typeof body.locale !== "string" ||
      body.locale.trim().length === 0 ||
      typeof body.scenarioSlug !== "string" ||
      body.scenarioSlug.trim().length === 0
    ) {
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
      return NextResponse.json({ error: "Scenario not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, scenario });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
