import { APP_LOCALES, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: [...APP_LOCALES],
  defaultLocale: DEFAULT_LOCALE,
});
