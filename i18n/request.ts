import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

type Messages = Record<string, unknown>;

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

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as "en" | "pl")) {
    locale = routing.defaultLocale;
  }

  const baseMessagesModule = (await import(`../messages/${locale}.json`)) as {
    default: Messages;
  };

  const adminStatsModule = (await import(`../messages/admin-stats/${locale}.json`)) as {
    default: Messages;
  };

  const authModule = (await import(`../messages/auth/${locale}.json`)) as {
    default: Messages;
  };

  const curriculumModule = (await import(`../messages/curriculum/${locale}.json`)) as {
    default: Messages;
  };

  const dashboardModule = (await import(`../messages/dashboard/${locale}.json`)) as {
    default: Messages;
  };

  const eportfolioModule = (await import(`../messages/eportfolio/${locale}.json`)) as {
    default: Messages;
  };

  const homeModule = (await import(`../messages/home/${locale}.json`)) as {
    default: Messages;
  };

  const modulePlayerModule = (await import(`../messages/module-player/${locale}.json`)) as {
    default: Messages;
  };

  const protectedListModule = (await import(`../messages/protected-list/${locale}.json`)) as {
    default: Messages;
  };

  const publicContentModule = (await import(`../messages/public-content/${locale}.json`)) as {
    default: Messages;
  };

  const scenarioModule = (await import(`../messages/scenario/${locale}.json`)) as {
    default: Messages;
  };

  const settingsModule = (await import(`../messages/settings/${locale}.json`)) as {
    default: Messages;
  };

  return {
    locale,
    messages: deepMerge(
      deepMerge(
        deepMerge(
          deepMerge(
            deepMerge(
              deepMerge(
                deepMerge(
                  deepMerge(
                    deepMerge(
                      deepMerge(baseMessagesModule.default, adminStatsModule.default),
                      authModule.default,
                    ),
                    curriculumModule.default,
                  ),
                  dashboardModule.default,
                ),
                eportfolioModule.default,
              ),
              homeModule.default,
            ),
            modulePlayerModule.default,
          ),
          protectedListModule.default,
        ),
        publicContentModule.default,
      ),
      deepMerge(scenarioModule.default, settingsModule.default),
    ),
  };
});
