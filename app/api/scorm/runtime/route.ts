import { logMeasuredOperation, measureSyncOperation } from "@/lib/observability/performance";
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
  forceWrite?: boolean;
  commitReason?: string;
  changedKeys?: string[];
  clientSetValueCount?: number;
  clientCommitCount?: number;
  clientRequestCount?: number;
  clientWriteMode?: string;
  lastFlushAgeMs?: number | null;
};

const runtimeRequestIntervals = new Map<string, number>();

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
  let payloadBytes = 0;
  let intervalMs: number | null = null;
  let saved = false;
  let changedKeysCount = 0;
  let rawTrackingKeysCount = 0;
  let clientWriteMode: string | null = null;
  let commitReason: string | null = null;
  let clientSetValueCount: number | null = null;
  let clientCommitCount: number | null = null;
  let clientRequestCount: number | null = null;
  let lastFlushAgeMs: number | null = null;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      status = "error";
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rawBody = await request.text();
    payloadBytes = new TextEncoder().encode(rawBody).length;

    let json: unknown = null;

    try {
      json = rawBody.length > 0 ? JSON.parse(rawBody) : null;
    } catch {
      status = "error";
      return NextResponse.json({ error: "Invalid runtime payload" }, { status: 400 });
    }

    if (!isRuntimeRequestBody(json)) {
      status = "error";
      return NextResponse.json({ error: "Invalid runtime payload" }, { status: 400 });
    }

    const body = json;
    clientWriteMode = typeof body.clientWriteMode === "string" ? body.clientWriteMode : null;
    commitReason = typeof body.commitReason === "string" ? body.commitReason : null;
    changedKeysCount = Array.isArray(body.changedKeys) ? body.changedKeys.length : 0;
    rawTrackingKeysCount =
      body.rawTrackingData && typeof body.rawTrackingData === "object"
        ? Object.keys(body.rawTrackingData).length
        : 0;
    clientSetValueCount =
      typeof body.clientSetValueCount === "number" ? body.clientSetValueCount : null;
    clientCommitCount = typeof body.clientCommitCount === "number" ? body.clientCommitCount : null;
    clientRequestCount =
      typeof body.clientRequestCount === "number" ? body.clientRequestCount : null;
    lastFlushAgeMs = typeof body.lastFlushAgeMs === "number" ? body.lastFlushAgeMs : null;

    if (
      typeof body.locale !== "string" ||
      body.locale.trim().length === 0 ||
      typeof body.scenarioSlug !== "string" ||
      body.scenarioSlug.trim().length === 0
    ) {
      status = "error";
      return NextResponse.json({ error: "Invalid runtime payload" }, { status: 400 });
    }

    const requestKey = `${user.id}:${body.scenarioSlug}`;
    const now = Date.now();
    const lastRequestAt = runtimeRequestIntervals.get(requestKey);
    intervalMs = lastRequestAt ? now - lastRequestAt : null;
    runtimeRequestIntervals.set(requestKey, now);

    const result = await updateScenarioRuntimeProgress({
      locale: body.locale,
      userId: user.id,
      slug: body.scenarioSlug,
      lessonStatus: body.lessonStatus ?? null,
      scoreRaw: body.scoreRaw ?? null,
      sessionTime: body.sessionTime ?? null,
      suspendData: body.suspendData ?? null,
      lessonLocation: body.lessonLocation ?? null,
      rawTrackingData: body.rawTrackingData ?? null,
      forceWrite: body.forceWrite === true,
    });

    if (!result) {
      status = "error";
      return NextResponse.json({ error: "Scenario not found" }, { status: 404 });
    }

    records = 1;
    saved = result.saved;

    return measureSyncOperation({
      operation: "api.scorm.runtime.POST.response",
      records: 1,
      meta: {
        payloadBytes,
        responseBytes: 0,
        intervalMs,
        saved,
        changedKeysCount,
        rawTrackingKeysCount,
        clientWriteMode,
        commitReason,
        clientSetValueCount,
        clientCommitCount,
        clientRequestCount,
        lastFlushAgeMs,
      },
      execute: () => new Response(null, { status: 204 }),
    });
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
      meta: {
        payloadBytes,
        responseBytes: status === "ok" ? 0 : undefined,
        intervalMs,
        saved,
        changedKeysCount,
        rawTrackingKeysCount,
        clientWriteMode,
        commitReason,
        clientSetValueCount,
        clientCommitCount,
        clientRequestCount,
        lastFlushAgeMs,
      },
    });
  }
}
