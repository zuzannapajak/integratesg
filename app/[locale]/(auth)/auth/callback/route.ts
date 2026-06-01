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

function createCleanRedirect(url: URL) {
  const response = NextResponse.redirect(url, 303);

  response.headers.delete("link");
  response.headers.set("Cache-Control", "no-store, max-age=0");

  return response;
}

function escapeHtmlAttribute(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function createHtmlRedirect(url: URL) {
  const href = url.toString();
  const escapedHref = escapeHtmlAttribute(href);

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="refresh" content="0;url=${escapedHref}" />
  <title>Redirecting...</title>
</head>
<body>
  <p>Redirecting...</p>
  <script>
    window.location.replace(${JSON.stringify(href)});
  </script>
</body>
</html>`;

  const response = new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
    },
  });

  response.headers.delete("link");

  return response;
}

function redirectToLogin(locale: string, publicOrigin: string) {
  return createCleanRedirect(new URL(`/${locale}/auth/login`, publicOrigin));
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const publicOrigin = getPublicOrigin(request);

  const code = requestUrl.searchParams.get("code");
  const localeFromPath = requestUrl.pathname.split("/")[1] || "en";
  const locale = isAppLocale(localeFromPath) ? localeFromPath : "en";
  const next = getSafeNextPath(requestUrl.searchParams.get("next"));

  console.warn("[auth/callback] Callback request received", {
    pathname: requestUrl.pathname,
    hasCode: Boolean(code),
    locale,
    next,
    publicOrigin,
  });

  if (!code) {
    console.warn("[auth/callback] Missing OAuth code");
    return redirectToLogin(locale, publicOrigin);
  }

  try {
    const supabase = await createClient();

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error("[auth/callback] exchangeCodeForSession failed", {
        name: exchangeError.name,
        message: exchangeError.message,
        status: "status" in exchangeError ? exchangeError.status : undefined,
      });

      return redirectToLogin(locale, publicOrigin);
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("[auth/callback] getUser failed", {
        name: userError.name,
        message: userError.message,
        status: "status" in userError ? userError.status : undefined,
      });

      return redirectToLogin(locale, publicOrigin);
    }

    if (!user) {
      console.warn("[auth/callback] No user returned after OAuth callback");
      return redirectToLogin(locale, publicOrigin);
    }

    console.warn("[auth/callback] Supabase user received", {
      userId: user.id,
      email: user.email,
    });

    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
    });

    if (!profile) {
      console.warn("[auth/callback] Profile not found, redirecting to complete profile", {
        userId: user.id,
      });

      return createCleanRedirect(new URL(`/${locale}/auth/complete-profile`, publicOrigin));
    }

    const preferredLocale =
      profile.preferredLanguage && isAppLocale(profile.preferredLanguage)
        ? profile.preferredLanguage
        : locale;

    const target = next ?? getDefaultProtectedRoute(preferredLocale, profile.role);
    const redirectUrl = new URL(target, publicOrigin);

    console.warn("[auth/callback] Login completed", {
      userId: user.id,
      role: profile.role,
      target,
    });

    console.warn("[auth/callback] Returning HTML redirect", {
      redirectUrl: redirectUrl.toString(),
    });

    return createHtmlRedirect(redirectUrl);
  } catch (error) {
    console.error("[auth/callback] Unexpected callback error", error);

    return redirectToLogin(locale, publicOrigin);
  }
}
