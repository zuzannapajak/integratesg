import { isAppLocale } from "@/lib/i18n/locales";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

type Messages = Record<string, unknown>;

const messageScopes = [
  "admin-stats-shells",
  "auth-shells",
  "curriculum-shells",
  "dashboard-shells",
  "eportfolio-shells",
  "home-shells",
  "module-player-shells",
  "protected-list-shells",
  "public-content-shells",
  "scenario-shells",
  "settings-shells",
] as const;

function deepMerge(base: Messages, override: Messages): Messages {
  const result: Messages = { ...base };

  for (const [key, value] of Object.entries(override)) {
    const existing = result[key];

    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      existing &&
      typeof existing === "object" &&
      !Array.isArray(existing)
    ) {
      result[key] = deepMerge(existing as Messages, value as Messages);
    } else {
      result[key] = value;
    }
  }

  return result;
}

async function loadRootMessages(locale: string): Promise<Messages> {
  try {
    const messagesModule = (await import(`../messages/${locale}.json`)) as {
      default: Messages;
    };
    return messagesModule.default;
  } catch {
    const fallback = (await import(`../messages/en.json`)) as {
      default: Messages;
    };
    return fallback.default;
  }
}

async function loadScopedMessages(scope: string, locale: string): Promise<Messages> {
  try {
    const messagesModule = (await import(`../messages/${scope}/${locale}.json`)) as {
      default: Messages;
    };
    return messagesModule.default;
  } catch {
    const fallback = (await import(`../messages/${scope}/en.json`)) as {
      default: Messages;
    };
    return fallback.default;
  }
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = requested && isAppLocale(requested) ? requested : routing.defaultLocale;

  const [baseMessages, ...scopedMessages] = await Promise.all([
    loadRootMessages(locale),
    ...messageScopes.map((scope) => loadScopedMessages(scope, locale)),
  ]);

  const messages = scopedMessages.reduce<Messages>(
    (accumulator, current) => deepMerge(accumulator, current),
    baseMessages,
  );

  return {
    locale,
    messages,
  };
});
