/**
 * Strictly scoped repair for WP4 ePortfolio parents known to be absent in the pilot DB.
 * No existing parent or translation is modified by this helper.
 */
export const WP4_MISSING_PUBLISHED_SLUGS = Object.freeze([
  "grupa-azoty",
  "bank-of-cyprus",
  "eurobank-cyprus",
  "hermes-airports",
  "vassiliko-cement-works",
  "kpmg-cyprus",
]);

const SUPPORTED_LOCALES = new Set(["en", "pl", "de", "it", "el", "bg"]);

export function prepareMissingPublishedParents(sources, parents) {
  const sourceBySlug = new Map(sources.map((item) => [item.slug, item]));
  const parentBySlug = new Map(parents.map((item) => [item.slug, item]));
  const missing = [];
  const present = [];

  for (const slug of WP4_MISSING_PUBLISHED_SLUGS) {
    const source = sourceBySlug.get(slug);
    if (!source || source.status !== "published") {
      throw new Error(`Source ${slug} is missing or is no longer published. Stop and review.`);
    }
    if (!source.countryCode || !source.area || !Number.isInteger(source.sortOrder)) {
      throw new Error(`Incomplete metadata for ${slug}.`);
    }
    const translations = source.translations ?? [];
    const languages = translations.map((item) => item.language);
    if (!languages.includes("en") || languages.length !== new Set(languages).size) {
      throw new Error(`English translation absent or duplicate language for ${slug}.`);
    }
    for (const translation of translations) {
      if (
        !SUPPORTED_LOCALES.has(translation.language) ||
        !translation.title?.trim() ||
        !translation.content?.trim()
      ) {
        throw new Error(`Invalid translation ${slug}/${translation.language}.`);
      }
    }

    const parent = parentBySlug.get(slug);
    if (parent) {
      if (parent.status !== "published") {
        throw new Error(`Existing ${slug} is ${parent.status}; will not change publication status.`);
      }
      present.push({ slug, parentId: parent.id });
    } else {
      missing.push(source);
    }
  }

  return { missing, present };
}

export async function insertMissingPublishedParents(prisma, missing) {
  let translationsCreated = 0;
  for (const source of missing) {
    // Create-only: if slug was created concurrently, the unique constraint aborts
    // the transaction. We never upsert or overwrite existing rows.
    const parent = await prisma.caseStudy.create({
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
      keyTakeaways: translation.keyTakeaways ?? undefined,
    }));
    if (rows.length) {
      await prisma.caseStudyTranslation.createMany({ data: rows });
      translationsCreated += rows.length;
    }
  }
  return { parentsCreated: missing.length, translationsCreated };
}

export function supabaseProjectRefFromUrl(connectionString) {
  const parsed = new URL(connectionString);
  const username = decodeURIComponent(parsed.username);
  const usernameMatch = /^postgres\.([a-z0-9]{8,})$/.exec(username);
  if (usernameMatch) {
    return usernameMatch[1];
  }
  const hostMatch = /^db\.([a-z0-9]{8,})\.supabase\.co$/.exec(parsed.hostname);
  return hostMatch?.[1] ?? null;
}
