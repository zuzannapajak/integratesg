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

  const protectedListShellsModule = (await import(
    `../messages/protected-list-shells/${locale}.json`
  )) as {
    default: Messages;
  };

  const curriculumShellsModule = (await import(`../messages/curriculum-shells/${locale}.json`)) as {
    default: Messages;
  };

  const modulePlayerShellsModule = (await import(
    `../messages/module-player-shells/${locale}.json`
  )) as {
    default: Messages;
  };

  const scenarioShellsModule = (await import(`../messages/scenario-shells/${locale}.json`)) as {
    default: Messages;
  };

  const eportfolioShellsModule = (await import(`../messages/eportfolio-shells/${locale}.json`)) as {
    default: Messages;
  };

  const adminStatsShellsModule = (await import(
    `../messages/admin-stats-shells/${locale}.json`
  )) as {
    default: Messages;
  };

  return {
    locale,
    messages: deepMerge(
      deepMerge(
        deepMerge(
          deepMerge(
            deepMerge(
              deepMerge(baseMessagesModule.default, protectedListShellsModule.default),
              curriculumShellsModule.default,
            ),
            modulePlayerShellsModule.default,
          ),
          scenarioShellsModule.default,
        ),
        eportfolioShellsModule.default,
      ),
      adminStatsShellsModule.default,
    ),
  };
});
