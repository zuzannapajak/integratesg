/**
 * Safe Allegro-only publication plan. Never changes other case studies or
 * overwrites existing translations or learner progress.
 */
export const ALLEGRO_SLUG = "allegro";
// The published archive has five original languages; Bulgarian is supplied
// by the independent, create-only translation synchronizer (Etap 10).
export const ALLEGRO_LOCALES = Object.freeze(["en", "pl", "de", "it", "el"]);
export const ALLEGRO_AVAILABLE_LOCALES = Object.freeze([...ALLEGRO_LOCALES, "bg"]);

export function validateAllegroSource(sources) {
  const source = sources.find((entry) => entry.slug === ALLEGRO_SLUG);
  if (!source || source.status !== "published") {
    throw new Error("Allegro source must exist and have status published.");
  }
  if (
    !source.area ||
    !source.countryCode ||
    !Number.isInteger(source.sortOrder) ||
    typeof source.isFeatured !== "boolean"
  ) {
    throw new Error("Allegro source metadata is incomplete.");
  }
  if (!Array.isArray(source.translations)) {
    throw new Error("Allegro translations are missing.");
  }
  const locales = source.translations.map((translation) => translation.language);
  if (
    new Set(locales).size !== locales.length ||
    ALLEGRO_LOCALES.some((locale) => !locales.includes(locale)) ||
    locales.some((locale) => !ALLEGRO_AVAILABLE_LOCALES.includes(locale))
  ) {
    throw new Error(`Allegro must include ${ALLEGRO_LOCALES.join(", ")}; optional bg is allowed.`);
  }
  for (const translation of source.translations) {
    if (
      !translation.title?.trim() ||
      !translation.summary?.trim() ||
      !translation.content?.trim() ||
      !translation.organization?.trim() ||
      !translation.industry?.trim() ||
      !Array.isArray(translation.keyTakeaways) ||
      translation.keyTakeaways.length === 0 ||
      translation.keyTakeaways.some((item) => !item?.trim())
    ) {
      throw new Error(`Allegro ${translation.language}: translation content is incomplete.`);
    }
  }
  return source;
}

export function planAllegroPublication(sources, parent) {
  const source = validateAllegroSource(sources);
  if (!parent) {
    return { action: "CREATE", source, missingLocales: [...ALLEGRO_LOCALES] };
  }
  if (parent.slug !== ALLEGRO_SLUG || !["draft", "published"].includes(parent.status)) {
    throw new Error("Unexpected Allegro database record; no changes allowed.");
  }
  const translations = parent.translations ?? [];
  const existing = translations.map((item) => item.language);
  if (new Set(existing).size !== existing.length) {
    throw new Error("Duplicate language rows in Allegro database record.");
  }
  return {
    action: parent.status === "draft" ? "PUBLISH" : "KEEP",
    source,
    missingLocales: ALLEGRO_LOCALES.filter((locale) => !existing.includes(locale)),
  };
}

export function supabaseProjectRefFromAllegroUrl(connectionString) {
  const url = new URL(connectionString);
  const user = decodeURIComponent(url.username);
  const userMatch = /^postgres\.([a-z0-9]{8,})$/.exec(user);
  if (userMatch) return userMatch[1];
  const hostMatch = /^db\.([a-z0-9]{8,})\.supabase\.co$/.exec(url.hostname);
  return hostMatch?.[1] ?? null;
}

export async function applyAllegroPublication(tx, plan, parent) {
  let caseStudyId = parent?.id;
  let created = 0;
  let promoted = 0;
  if (plan.action === "CREATE") {
    const source = plan.source;
    const row = await tx.caseStudy.create({
      data: {
        slug: ALLEGRO_SLUG,
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
    caseStudyId = row.id;
    created = 1;
  } else if (plan.action === "PUBLISH") {
    const result = await tx.caseStudy.updateMany({
      where: { id: caseStudyId, slug: ALLEGRO_SLUG, status: "draft" },
      data: { status: "published" },
    });
    if (result.count !== 1) {
      throw new Error("Allegro status changed during publication; transaction rolled back.");
    }
    promoted = 1;
  }
  if (!caseStudyId) throw new Error("Allegro record ID is missing.");

  const missing = new Set(plan.missingLocales);
  const rows = plan.source.translations
    .filter((translation) => missing.has(translation.language))
    .map((translation) => ({
      caseStudyId,
      language: translation.language,
      title: translation.title,
      summary: translation.summary ?? null,
      content: translation.content,
      organization: translation.organization ?? null,
      industry: translation.industry ?? null,
      keyTakeaways: translation.keyTakeaways,
    }));
  if (rows.length !== missing.size) {
    throw new Error("The planned Allegro translations could not be matched to sources.");
  }
  if (rows.length) {
    // The unique (caseStudyId, language) constraint aborts the transaction on
    // a race rather than overwriting an existing partner translation.
    await tx.caseStudyTranslation.createMany({ data: rows });
  }
  return { created, promoted, translationsCreated: rows.length };
}
