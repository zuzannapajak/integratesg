import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it, vi } from "vitest";

import { APP_LOCALES, DEFAULT_LOCALE } from "@/lib/i18n/locales";
import { routing } from "@/i18n/routing";

vi.mock("next-intl/server", () => ({
  getRequestConfig: (factory: unknown) => factory,
}));

import requestConfig from "@/i18n/request";

type MessageObject = Record<string, unknown>;

type RequestConfigFactory = (params: { requestLocale: Promise<string | undefined> }) => Promise<{
  locale: string;
  messages: MessageObject;
}>;

const loadRequestConfig = requestConfig as unknown as RequestConfigFactory;
const messagesDirectory = join(process.cwd(), "messages");

function readMessageFile(filePath: string): MessageObject {
  return JSON.parse(readFileSync(filePath, "utf8")) as MessageObject;
}

function getLeafKeyPaths(value: unknown, prefix = ""): string[] {
  if (Array.isArray(value) || value === null || typeof value !== "object") {
    return prefix ? [prefix] : [];
  }

  const entries = Object.entries(value as MessageObject);

  if (entries.length === 0) {
    return prefix ? [prefix] : [];
  }

  return entries.flatMap(([key, nestedValue]) => {
    const path = prefix ? `${prefix}.${key}` : key;

    return getLeafKeyPaths(nestedValue, path);
  });
}

function getMissingKeys(referenceKeys: string[], candidateKeys: string[]) {
  const candidateSet = new Set(candidateKeys);

  return referenceKeys.filter((key) => !candidateSet.has(key));
}

function getMessageBundleDirectories() {
  const scopedDirectories = readdirSync(messagesDirectory, {
    withFileTypes: true,
  })
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      label: entry.name,
      directory: join(messagesDirectory, entry.name),
    }))
    .sort((first, second) => first.label.localeCompare(second.label));

  return [
    {
      label: "root",
      directory: messagesDirectory,
    },
    ...scopedDirectories,
  ];
}

describe("i18n message contracts", () => {
  it("keeps routing locales aligned with the application locale registry", () => {
    expect([...routing.locales]).toEqual([...APP_LOCALES]);
    expect(routing.defaultLocale).toBe(DEFAULT_LOCALE);
  });

  it("contains one translation file for every supported locale in every message bundle", () => {
    const expectedFiles = APP_LOCALES.map((locale) => `${locale}.json`).sort();
    const mismatches: Array<{
      bundle: string;
      expected: string[];
      actual: string[];
    }> = [];

    for (const bundle of getMessageBundleDirectories()) {
      const actualFiles = readdirSync(bundle.directory, {
        withFileTypes: true,
      })
        .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
        .map((entry) => entry.name)
        .sort();

      if (JSON.stringify(actualFiles) !== JSON.stringify(expectedFiles)) {
        mismatches.push({
          bundle: bundle.label,
          expected: expectedFiles,
          actual: actualFiles,
        });
      }
    }

    expect(mismatches).toEqual([]);
  });

  it("keeps the same nested translation-key set as English in every locale", () => {
    const mismatches: Array<{
      file: string;
      missing: string[];
      extra: string[];
    }> = [];

    for (const bundle of getMessageBundleDirectories()) {
      const englishMessages = readMessageFile(join(bundle.directory, "en.json"));
      const englishKeys = getLeafKeyPaths(englishMessages).sort();

      for (const locale of APP_LOCALES) {
        if (locale === "en") {
          continue;
        }

        const localizedMessages = readMessageFile(join(bundle.directory, `${locale}.json`));
        const localizedKeys = getLeafKeyPaths(localizedMessages).sort();

        const missing = getMissingKeys(englishKeys, localizedKeys);
        const extra = getMissingKeys(localizedKeys, englishKeys);

        if (missing.length > 0 || extra.length > 0) {
          mismatches.push({
            file:
              bundle.label === "root"
                ? `messages/${locale}.json`
                : `messages/${bundle.label}/${locale}.json`,
            missing,
            extra,
          });
        }
      }
    }

    expect(mismatches).toEqual([]);
  });

  it("detects a nested missing translation key", () => {
    const englishKeys = getLeafKeyPaths({
      page: {
        title: "Title",
        actions: {
          continue: "Continue",
          back: "Back",
        },
      },
    });

    const localizedKeys = getLeafKeyPaths({
      page: {
        title: "Tytuł",
        actions: {
          continue: "Kontynuuj",
        },
      },
    });

    expect(getMissingKeys(englishKeys, localizedKeys)).toEqual(["page.actions.back"]);
  });

  it("falls back to the default locale for an unsupported request locale", async () => {
    const config = await loadRequestConfig({
      requestLocale: Promise.resolve("fr"),
    });

    expect(config.locale).toBe(DEFAULT_LOCALE);
    expect(Object.keys(config.messages).length).toBeGreaterThan(0);
  });

  it("keeps a supported request locale", async () => {
    const config = await loadRequestConfig({
      requestLocale: Promise.resolve("pl"),
    });

    expect(config.locale).toBe("pl");
    expect(Object.keys(config.messages).length).toBeGreaterThan(0);
  });

  it("uses the default locale when the request locale is missing", async () => {
    const config = await loadRequestConfig({
      requestLocale: Promise.resolve(undefined),
    });

    expect(config.locale).toBe(DEFAULT_LOCALE);
  });
});
