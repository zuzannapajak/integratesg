import { requireRole } from "@/features/auth/requireRole";
import { getBasicAdminStats } from "@/lib/admin/queries";
import { APP_ROLES } from "@/lib/auth/roles";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireRole("en", APP_ROLES.admin);

    const stats = await getBasicAdminStats("en");

    return NextResponse.json({
      ok: true,
      stats,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to load admin statistics.",
      },
      { status: 500 },
    );
  }
}
