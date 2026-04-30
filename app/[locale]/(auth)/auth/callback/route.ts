import { getDefaultProtectedRoute } from "@/lib/auth/roles";
import { isAppLocale } from "@/lib/i18n/locales";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

function getPublicOrigin(request: Request) {
  const configuredOrigin = process.env.APP_BASE_URL ?? process.env.NEXT_PUBLIC_SITE_URL;

  if (configuredOrigin) {
    return configuredOrigin.replace(/\/$/, "");
  }

  const forwardedHost = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";

  if (forwardedHost) {
    const host = forwardedHost.split(",")[0]?.trim();
    const proto = forwardedProto.split(",")[0]?.trim() || "https";

    if (host) {
      return `${proto}://${host}`;
    }
  }

  return new URL(request.url).origin;
}

function getSafeNextPath(next: string | null) {
  if (!next) {
    return null;
  }

  if (!next.startsWith("/") || next.startsWith("//")) {
    return null;
  }

  return next;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const publicOrigin = getPublicOrigin(request);

  const code = requestUrl.searchParams.get("code");
  const localeFromPath = requestUrl.pathname.split("/")[1] || "en";
  const locale = isAppLocale(localeFromPath) ? localeFromPath : "en";
  const next = getSafeNextPath(requestUrl.searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(new URL(`/${locale}/auth/login`, publicOrigin));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL(`/${locale}/auth/login`, publicOrigin));
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL(`/${locale}/auth/login`, publicOrigin));
  }

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
  });

  if (!profile) {
    return NextResponse.redirect(new URL(`/${locale}/auth/complete-profile`, publicOrigin));
  }

  const preferredLocale =
    profile.preferredLanguage && isAppLocale(profile.preferredLanguage)
      ? profile.preferredLanguage
      : locale;

  const target = next ?? getDefaultProtectedRoute(preferredLocale, profile.role);

  return NextResponse.redirect(new URL(target, publicOrigin));
}
