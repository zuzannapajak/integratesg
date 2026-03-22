import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { updateSession } from "./lib/supabase/middleware";

const handleI18nRouting = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const response = handleI18nRouting(request);
  const authResponse = await updateSession(request);

  authResponse.headers.forEach((value, key) => {
    response.headers.set(key, value);
  });

  authResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie);
  });

  return response;
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
