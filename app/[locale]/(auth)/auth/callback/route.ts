import { getDefaultProtectedRoute } from "@/lib/auth/roles";
import { isAppLocale } from "@/lib/i18n/locales";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const localeFromPath = requestUrl.pathname.split("/")[1] || "en";
  const locale = isAppLocale(localeFromPath) ? localeFromPath : "en";
  const next = requestUrl.searchParams.get("next");

  if (!code) {
    return NextResponse.redirect(new URL(`/${locale}/auth/login`, requestUrl.origin));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL(`/${locale}/auth/login`, requestUrl.origin));
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL(`/${locale}/auth/login`, requestUrl.origin));
  }

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
  });

  if (!profile) {
    return NextResponse.redirect(new URL(`/${locale}/auth/complete-profile`, requestUrl.origin));
  }

  const preferredLocale =
    profile.preferredLanguage && isAppLocale(profile.preferredLanguage)
      ? profile.preferredLanguage
      : locale;

  const target = next ?? getDefaultProtectedRoute(preferredLocale, profile.role);

  return NextResponse.redirect(new URL(target, requestUrl.origin));
}
