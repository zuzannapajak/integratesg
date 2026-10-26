/**
 * Narrow, create-only published PKO Bank Polski ePortfolio catalogue repair.
 * This module never updates, deletes or publishes Allegro.
 */
export const PKO_PUBLISHED_SLUG = "pko-bank-polski";
// Bulgarian can be added after initial publication without invalidating
// the original five-language publication guard.
export const PKO_REQUIRED_LOCALES = Object.freeze(["en", "pl", "de", "it", "el"]);
export const PKO_AVAILABLE_LOCALES = Object.freeze([...PKO_REQUIRED_LOCALES, "bg"]);

function assertPkoSource(source) {
  if (!source || source.slug !== PKO_PUBLISHED_SLUG || source.status !== "published") {
    throw new Error("PKO Bank Polski is missing or not marked published in source. Stop.");
  }
  if (
    source.area !== "cross_cutting" ||
    source.countryCode !== "PL" ||
    !Number.isInteger(source.sortOrder) ||
    typeof source.isFeatured !== "boolean" ||
    !source.sourcePartner
  ) {
    throw new Error("PKO source metadata is incomplete or unexpected.");
  }
  const translations = source.translations;
  if (!Array.isArray(translations)) {
    throw new Error("PKO source translations are missing.");
  }
  const languages = translations.map((translation) => translation.language);
  if (
    languages.length !== new Set(languages).size ||
    PKO_REQUIRED_LOCALES.some((locale) => !languages.includes(locale)) ||
    languages.some((locale) => !PKO_AVAILABLE_LOCALES.includes(locale))
  ) {
    throw new Error(`PKO translations must include ${PKO_REQUIRED_LOCALES.join(", ")}; optional bg is allowed.`);
  }
  for (const translation of translations) {
    if (
      !translation.title?.trim() ||
      !translation.summary?.trim() ||
      !translation.content?.trim() ||
      !translation.organization?.trim() ||
      !translation.industry?.trim() ||
      !Array.isArray(translation.keyTakeaways) ||
      translation.keyTakeaways.length === 0 ||
      translation.keyTakeaways.some((text) => !text?.trim())
    ) {
      throw new Error(`PKO translation ${translation.language}: missing required content.`);
    }
  }
  return source;
}

/**
 * For a source catalogue and the optional DB record, return a create-only plan.
 * Existing PKO rows must already be published and have all five languages.
 * An existing draft is never promoted automatically.
 */
export function planPkoPublishedOnly(caseStudies, dbParent) {
  const source = assertPkoSource(
    caseStudies.find((entry) => entry.slug === PKO_PUBLISHED_SLUG),
  );
  if (!dbParent) {
    return { action: "CREATE", source, present: false, missingLocales: [] };
  }
  if (dbParent.slug !== PKO_PUBLISHED_SLUG || dbParent.status !== "published") {
    throw new Error("Existing PKO row has an unexpected slug/status. No automatic changes allowed.");
  }
  const presentLanguages = new Set(
    (dbParent.translations ?? []).map((translation) => translation.language),
  );
  const missingLocales = PKO_REQUIRED_LOCALES.filter((lang) => !presentLanguages.has(lang));
  if (missingLocales.length > 0) {
    throw new Error(
      `Existing PKO is missing translations: ${missingLocales.join(", ")}. ` +
        "Repair translations separately; this tool never updates existing records.",
    );
  }
  return { action: "KEEP", source, present: true, missingLocales: [] };
}

export async function createPkoPublishedOnly(tx, source) {
  // A unique-slug collision aborts the transaction. No upsert/update/delete.
  const parent = await tx.caseStudy.create({
    data: {
      slug: source.slug,
      area: source.area,
      status: "published",
      sortOrder: source.sortOrder,
      isFeatured: source.isFeatured,
      countryCode: source.countryCode,
      reportingPeriod: source.reportingPeriod ?? null,
      sourcePartner: source.sourcePartner ?? null,
    },
    select: { id: true },
  });
  const rows = source.translations.map((translation) => ({
    caseStudyId: parent.id,
    language: translation.language,
    title: translation.title,
    summary: translation.summary ?? null,
    content: translation.content,
    organization: translation.organization ?? null,
    industry: translation.industry ?? null,
    keyTakeaways: translation.keyTakeaways,
  }));
  await tx.caseStudyTranslation.createMany({ data: rows });
  return { parentsCreated: 1, translationsCreated: rows.length };
}

/** A Supabase pooler hostname alone does not identify a specific project. */
export function supabaseProjectRefFromPkoUrl(connectionString) {
  const parsed = new URL(connectionString);
  const username = decodeURIComponent(parsed.username);
  const userMatch = /^postgres\.([a-z0-9]{8,})$/.exec(username);
  if (userMatch) return userMatch[1];
  const hostMatch = /^db\.([a-z0-9]{8,})\.supabase\.co$/.exec(parsed.hostname);
  return hostMatch?.[1] ?? null;
}
