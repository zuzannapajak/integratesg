import { logMeasuredOperation } from "@/lib/observability/performance";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  const startedAt = Date.now();

  try {
    return NextResponse.json(
      {
        ok: false,
        error: "Related curriculum modules endpoint is temporarily unavailable.",
      },
      { status: 501 },
    );
  } finally {
    logMeasuredOperation({
      operation: "api.curriculum.related.GET",
      durationMs: Date.now() - startedAt,
      records: 0,
      status: "ok",
    });
  }
}
