import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

type Messages = Record<string, unknown>;

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as "en" | "pl")) {
    locale = routing.defaultLocale;
  }

  const messagesModule = (await import(`../messages/${locale}.json`)) as {
    default: Messages;
  };

  return {
    locale,
    messages: messagesModule.default,
  };
});
