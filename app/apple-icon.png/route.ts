import { createBrandedIconResponse } from "@/lib/branding/app-icon";

export const runtime = "edge";

export function GET() {
  return createBrandedIconResponse({ size: 180 });
}
