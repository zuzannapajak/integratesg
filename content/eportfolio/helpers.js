import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

export const EPORTFOLIO_LOCALES = ["en", "pl", "de", "it", "bg", "el"];

export const EPORTFOLIO_FALLBACK_LOCALE = "en";

const PARTNER_TRANSLATION_LOCALES = EPORTFOLIO_LOCALES.filter(
  (locale) => locale !== EPORTFOLIO_FALLBACK_LOCALE,
);

export function loadMarkdown(url) {
  return readFileSync(url, "utf8").trim();
}

function loadTranslationMetadata(filePath, locale, slug) {
  let parsed;

  try {
    parsed = JSON.parse(readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(`Could not read ${locale} translation metadata for ${slug}: ${error.message}`);
  }

  const requiredTextFields = ["title", "summary", "organization", "industry"];

  for (const field of requiredTextFields) {
    if (typeof parsed[field] !== "string" || parsed[field].trim().length === 0) {
      throw new Error(`Missing or empty ${field} in ${locale} translation metadata for ${slug}.`);
    }
  }

  if (
    !Array.isArray(parsed.keyTakeaways) ||
    parsed.keyTakeaways.length === 0 ||
    parsed.keyTakeaways.some((item) => typeof item !== "string" || item.trim().length === 0)
  ) {
    throw new Error(
      `keyTakeaways must be a non-empty string array in ${locale} translation metadata for ${slug}.`,
    );
  }

  return {
    title: parsed.title.trim(),
    summary: parsed.summary.trim(),
    organization: parsed.organization.trim(),
    industry: parsed.industry.trim(),
    keyTakeaways: parsed.keyTakeaways.map((item) => item.trim()),
  };
}

function isEnglishCopy(translation, englishTranslation) {
  return (
    translation.summary === englishTranslation.summary &&
    translation.content === englishTranslation.content &&
    JSON.stringify(translation.keyTakeaways) === JSON.stringify(englishTranslation.keyTakeaways)
  );
}

export function addAvailableTranslations(caseStudy, caseDirectoryUrl) {
  const englishTranslation = caseStudy.translations.find(
    (translation) => translation.language === EPORTFOLIO_FALLBACK_LOCALE,
  );

  if (!englishTranslation) {
    throw new Error(`Missing English translation for ${caseStudy.slug}.`);
  }

  const inlineNonEnglishTranslations = caseStudy.translations.filter(
    (translation) => translation.language !== EPORTFOLIO_FALLBACK_LOCALE,
  );

  if (inlineNonEnglishTranslations.length > 0) {
    throw new Error(
      `Non-English translations for ${caseStudy.slug} must be stored as locale files.`,
    );
  }

  const caseDirectory = fileURLToPath(caseDirectoryUrl);

  const partnerTranslations = PARTNER_TRANSLATION_LOCALES.flatMap((locale) => {
    const metadataPath = join(caseDirectory, "locales", `${locale}.json`);

    const contentPath = join(caseDirectory, "locales", `${locale}.md`);

    const hasMetadata = existsSync(metadataPath);

    const hasContent = existsSync(contentPath);

    if (!hasMetadata && !hasContent) {
      return [];
    }

    if (hasMetadata !== hasContent) {
      throw new Error(
        `Incomplete ${locale} translation for ${caseStudy.slug}. Both ${locale}.json and ${locale}.md are required.`,
      );
    }

    const metadata = loadTranslationMetadata(metadataPath, locale, caseStudy.slug);

    const translation = {
      language: locale,
      ...metadata,
      content: readFileSync(contentPath, "utf8").trim(),
    };

    if (translation.content.length === 0) {
      throw new Error(`Empty ${locale} Markdown content for ${caseStudy.slug}.`);
    }

    if (isEnglishCopy(translation, englishTranslation)) {
      throw new Error(
        `${locale} translation for ${caseStudy.slug} is identical to English content. Do not seed English text as a translation placeholder.`,
      );
    }

    return [translation];
  });

  return {
    ...caseStudy,
    translations: [englishTranslation, ...partnerTranslations],
  };
}
