export const APP_LOCALES = ["en", "it", "de", "el", "pl", "bg"] as const;

export type AppLocale = (typeof APP_LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = "en";

export const LOCALE_META: Record<
  AppLocale,
  {
    label: string;
    flagCode: string;
  }
> = {
  en: {
    label: "English",
    flagCode: "gb",
  },
  it: {
    label: "Italiano",
    flagCode: "it",
  },
  de: {
    label: "Deutsch",
    flagCode: "de",
  },
  el: {
    label: "Ελληνικά",
    flagCode: "gr",
  },
  pl: {
    label: "Polski",
    flagCode: "pl",
  },
  bg: {
    label: "Български",
    flagCode: "bg",
  },
};

export function isAppLocale(value: string): value is AppLocale {
  return APP_LOCALES.includes(value as AppLocale);
}
