/**
 * Runs as a native Node ESM process, not inside Playwright's CommonJS
 * transform. ePortfolio source index.js uses import.meta.url.
 * Outputs only an EN source snapshot, never credentials or database data.
 */
import { caseStudies } from "../../../content/eportfolio/index.js";

const published = caseStudies
  .filter((entry) => entry.status === "published")
  .map((entry) => {
    const english = entry.translations.find((translation) => translation.language === "en");
    if (!english?.title || !english?.summary) {
      throw new Error(`Missing complete EN source for ${entry.slug}`);
    }
    return { slug: entry.slug, title: english.title, summary: english.summary };
  });

if (new Set(published.map((entry) => entry.slug)).size !== published.length) {
  throw new Error("Duplicate published case-study slugs in source");
}

process.stdout.write(JSON.stringify(published));
