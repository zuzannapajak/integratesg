export const APP_LOCALES = ["en", "it", "de", "el", "pl", "bg"] as const;

export type AppLocale = (typeof APP_LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = "en";

export const LOCALE_META: Record<
  AppLocale,
  {
    label: string;
    switchLabel: string;
    flagCode: string;
  }
> = {
  en: {
    label: "English",
    switchLabel: "Switch to English",
    flagCode: "gb",
  },
  it: {
    label: "Italiano",
    switchLabel: "Switch to italian",
    flagCode: "it",
  },
  de: {
    label: "Deutsch",
    switchLabel: "Switch to german",
    flagCode: "de",
  },
  el: {
    label: "Ελληνικά",
    switchLabel: "Switch to Greek",
    flagCode: "gr",
  },
  pl: {
    label: "Polski",
    switchLabel: "Switch to polish",
    flagCode: "pl",
  },
  bg: {
    label: "Български",
    switchLabel: "Switch to bulgarian",
    flagCode: "bg",
  },
};

export function isAppLocale(value: string): value is AppLocale {
  return APP_LOCALES.includes(value as AppLocale);
}
