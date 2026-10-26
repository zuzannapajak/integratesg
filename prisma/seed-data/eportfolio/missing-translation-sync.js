/**
 * Pure, create-only planning for missing ePortfolio translations.
 * Existing translations, case-study records and publication statuses are immutable.
 */
export const EXPECTED_SOURCE_LOCALES = Object.freeze(["en", "pl", "de", "it", "el"]);
const ALLOWED_LOCALES = new Set([...EXPECTED_SOURCE_LOCALES, "bg"]);

export function supabaseProjectRefFromUrl(connectionString) {
  const parsed = new URL(connectionString);
  const username = decodeURIComponent(parsed.username);
  const match = /^postgres\.([a-z0-9]{8,})$/.exec(username);
  if (match) return match[1];
  const host = /^db\.([a-z0-9]{8,})\.supabase\.co$/.exec(parsed.hostname);
  return host?.[1] ?? null;
}

export function validatePublishedSources(sources) {
  const seenSlugs = new Set();
  let publishedCount = 0;
  for (const source of sources) {
    if (!source.slug || seenSlugs.has(source.slug)) {
      throw new Error(`Duplicate/empty source case-study slug: ${source.slug}`);
    }
    seenSlugs.add(source.slug);
    if (!(["published", "draft"].includes(source.status))) {
      throw new Error(`Unknown source publication status: ${source.slug}/${source.status}`);
    }
    if (source.status !== "published") continue;
    publishedCount += 1;
    const langs = new Set();
    for (const translation of source.translations ?? []) {
      if (!ALLOWED_LOCALES.has(translation.language) || langs.has(translation.language)) {
        throw new Error(`Invalid/duplicate translation language: ${source.slug}/${translation.language}`);
      }
      langs.add(translation.language);
      if (!translation.title?.trim() || !translation.content?.trim()) {
        throw new Error(`Missing content: ${source.slug}/${translation.language}`);
      }
    }
    if (!langs.has("en")) throw new Error(`Missing English source: ${source.slug}`);
  }
  return { publishedCount, sourceCount: sources.length };
}

export function planMissingTranslations(sources, dbParents, dbTranslations) {
  validatePublishedSources(sources);
  const bySlug = new Map(sources.map((source) => [source.slug, source]));
  const knownIds = new Set(dbParents.map((parent) => parent.id));
  if (knownIds.size !== dbParents.length) throw new Error("Duplicate database parent IDs");
  const seenKeys = new Set();
  for (const row of dbTranslations) {
    if (!knownIds.has(row.caseStudyId)) throw new Error("Translation belongs to unknown parent");
    const key = `${row.caseStudyId}/${row.language}`;
    if (seenKeys.has(key)) throw new Error(`Duplicate translation row: ${key}`);
    seenKeys.add(key);
  }
  const missingPublishedParents = [];
  const draftsSkipped = [];
  const missing = [];
  const covered = Object.fromEntries(EXPECTED_SOURCE_LOCALES.map((language) => [language, 0]));
  const publishedParentIds = new Set();
  for (const parent of dbParents) {
    const source = bySlug.get(parent.slug);
    if (parent.status === "published" && !source) {
      throw new Error(`Published database study is absent from source: ${parent.slug}`);
    }
    if (parent.status !== "published" || source?.status !== "published") {
      draftsSkipped.push(parent.slug);
      continue;
    }
    publishedParentIds.add(parent.id);
    for (const translation of source.translations) {
      const key = `${parent.id}/${translation.language}`;
      if (!seenKeys.has(key)) {
        missing.push({
          slug: parent.slug,
          caseStudyId: parent.id,
          language: translation.language,
          translation,
        });
      } else if (Object.hasOwn(covered, translation.language)) {
        covered[translation.language] += 1;
      }
    }
  }
  for (const source of sources) {
    if (source.status === "published" && !dbParents.some((parent) => parent.slug === source.slug)) {
      missingPublishedParents.push(source.slug);
    }
  }
  missing.sort((a, b) => a.slug.localeCompare(b.slug) || a.language.localeCompare(b.language));
  return {
    missing,
    covered,
    publishedDbCount: publishedParentIds.size,
    missingPublishedParents: missingPublishedParents.sort(),
    draftsSkipped: [...new Set(draftsSkipped)].sort(),
  };
}

export async function createOnlyMissingTranslations(tx, missing) {
  if (missing.length === 0) return { count: 0 };
  const data = missing.map(({ caseStudyId, language, translation }) => ({
    caseStudyId,
    language,
    title: translation.title,
    summary: translation.summary ?? null,
    content: translation.content,
    keyTakeaways: translation.keyTakeaways ?? undefined,
    organization: translation.organization ?? null,
    industry: translation.industry ?? null,
  }));
  // Database unique constraint (caseStudyId, language) is enforced; skipDuplicates
  // handles concurrent inserts WITHOUT changing any pre-existing translation.
  return tx.caseStudyTranslation.createMany({ data, skipDuplicates: true });
}
