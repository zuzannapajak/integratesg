import { APP_LOCALES, DEFAULT_LOCALE, type AppLocale } from "@/lib/i18n/locales";

export type CertificateCopy = {
  title: string;
  subtitle: string;
  recipientLead: string;
  moduleLead: string;
  dateLabel: string;
  certificateIdLabel: string;
  issuedBy: string;
  footerFirstLine: string;
  footerSecondLine: string;
};

export const CERTIFICATE_COPY: Record<AppLocale, CertificateCopy> = {
  en: {
    title: "CERTIFICATE",
    subtitle: "OF COMPLETION",
    recipientLead: "This certificate is awarded to",
    moduleLead: "for successfully completing the learning module",
    dateLabel: "Completed on",
    certificateIdLabel: "Certificate ID",
    issuedBy: "Issued by IntegratESG",
    footerFirstLine: "Empowering educators and learners",
    footerSecondLine: "with practical ESG knowledge for a sustainable future.",
  },
  pl: {
    title: "CERTYFIKAT",
    subtitle: "UKOŃCZENIA",
    recipientLead: "Niniejszy certyfikat otrzymuje",
    moduleLead: "za pomyślne ukończenie modułu edukacyjnego",
    dateLabel: "Data ukończenia",
    certificateIdLabel: "Identyfikator certyfikatu",
    issuedBy: "Wystawca: IntegratESG",
    footerFirstLine: "Wspieramy edukatorów i uczestników",
    footerSecondLine: "w praktycznym wykorzystywaniu ESG.",
  },
  de: {
    title: "ZERTIFIKAT",
    subtitle: "ÜBER DEN ABSCHLUSS",
    recipientLead: "Dieses Zertifikat wird verliehen an",
    moduleLead: "für den erfolgreichen Abschluss des Lernmoduls",
    dateLabel: "Abgeschlossen am",
    certificateIdLabel: "Zertifikats-ID",
    issuedBy: "Ausgestellt von IntegratESG",
    footerFirstLine: "Wir stärken Lehrende und Lernende",
    footerSecondLine: "mit praxisnahem ESG-Wissen für eine nachhaltige Zukunft.",
  },
  it: {
    title: "CERTIFICATO",
    subtitle: "DI COMPLETAMENTO",
    recipientLead: "Il presente certificato viene conferito a",
    moduleLead: "per aver completato con successo il modulo formativo",
    dateLabel: "Data di completamento",
    certificateIdLabel: "ID certificato",
    issuedBy: "Rilasciato da IntegratESG",
    footerFirstLine: "Sosteniamo docenti e partecipanti",
    footerSecondLine: "con competenze ESG per un futuro sostenibile.",
  },
  el: {
    title: "ΠΙΣΤΟΠΟΙΗΤΙΚΟ",
    subtitle: "ΟΛΟΚΛΗΡΩΣΗΣ",
    recipientLead: "Το παρόν πιστοποιητικό απονέμεται στο ακόλουθο άτομο",
    moduleLead: "για την επιτυχή ολοκλήρωση της εκπαιδευτικής ενότητας",
    dateLabel: "Ημερομηνία ολοκλήρωσης",
    certificateIdLabel: "Αριθμός πιστοποιητικού",
    issuedBy: "Εκδόθηκε από την IntegratESG",
    footerFirstLine: "Ενδυναμώνουμε εκπαιδευτές και εκπαιδευόμενους",
    footerSecondLine: "με πρακτικές γνώσεις ESG για ένα βιώσιμο μέλλον.",
  },
  bg: {
    title: "СЕРТИФИКАТ",
    subtitle: "ЗА ЗАВЪРШВАНЕ",
    recipientLead: "Този сертификат се връчва на",
    moduleLead: "за успешно завършване на учебния модул",
    dateLabel: "Дата на завършване",
    certificateIdLabel: "Идентификатор на сертификата",
    issuedBy: "Издаден от IntegratESG",
    footerFirstLine: "Подкрепяме преподаватели и обучаеми",
    footerSecondLine: "с практически ESG знания за устойчиво бъдеще.",
  },
};

export function resolveCertificateLocale(value: string | null | undefined): AppLocale {
  return APP_LOCALES.find((locale) => locale === value) ?? DEFAULT_LOCALE;
}

const DATE_LOCALES: Record<AppLocale, string> = {
  en: "en-US",
  it: "it-IT",
  de: "de-DE",
  el: "el-GR",
  pl: "pl-PL",
  bg: "bg-BG",
};

export function formatCertificateDate(value: Date, locale: AppLocale): string {
  return new Intl.DateTimeFormat(DATE_LOCALES[locale], {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(value);
}

export function pickCertificateModuleTitle(
  translations: ReadonlyArray<{ language: string; title: string }>,
  slug: string,
  locale: AppLocale,
): string {
  const selected = translations.find((entry) => entry.language === locale)?.title.trim();
  const english = translations.find((entry) => entry.language === "en")?.title.trim();
  return selected || english || slug;
}
