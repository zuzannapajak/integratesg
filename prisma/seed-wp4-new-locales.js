/**
 * Targeted, idempotent WP4 ePortfolio translation import.
 *
 * --check   Validate source translations; no DB connection.
 * --dry-run Read database, report every eligible change and missing parent; no writes.
 * --apply   Upsert translations only for case studies already present in DB.
 *
 * Missing source drafts (e.g. Allegro) are explicitly SKIPPED, not created or
 * published. Missing published case studies are a blocking error. The entire
 * plan is validated BEFORE any write to avoid partially importing a broken set.
 *
 * This script never changes case studies, their publication status, progress,
 * user data, or translations outside the fixed 15-entry whitelist.
 */
import { caseStudies } from "../content/eportfolio/index.js";

const NEW_TRANSLATIONS = [
  ["allegro", "de"],
  ["grupa-azoty", "de"],
  ["davines", "de"],
  ["barilla", "de"],
  ["bank-of-cyprus", "de"],
  ["eurobank-cyprus", "de"],
  ["sonnentor", "de"],
  ["verbund", "de"],
  ["bank-of-cyprus", "it"],
  ["eurobank-cyprus", "it"],
  ["hermes-airports", "it"],
  ["vassiliko-cement-works", "it"],
  ["kpmg-cyprus", "it"],
  ["pzu", "it"],
  ["pkn-orlen", "it"],
];

const args = process.argv.slice(2);
if (args.length > 1 || (args[0] && !["--check", "--dry-run", "--apply"].includes(args[0]))) {
  console.error("Usage: node prisma/seed-wp4-new-locales.js [--check|--dry-run|--apply]");
  process.exit(1);
}

const mode = args[0] ?? "--check";
const imported = NEW_TRANSLATIONS.map(([slug, language]) => {
  const source = caseStudies.find((entry) => entry.slug === slug);
  if (!source) {
    throw new Error(`Missing case study in source: ${slug}`);
  }

  const translation = source.translations.find((entry) => entry.language === language);
  if (!translation) {
    throw new Error(`Missing translation in source: ${slug}/${language}`);
  }

  return { slug, language, translation, sourceStatus: source.status };
});

if (new Set(imported.map(({ slug, language }) => `${slug}/${language}`)).size !== imported.length) {
  throw new Error("Duplicate slug/language in WP4 translation whitelist.");
}

console.log(`WP4 translation sources verified: ${imported.length} (8 DE + 7 IT).`);

if (mode === "--check") {
  console.log("Source-only check completed; no database connection or modifications.");
} else {
  await import("dotenv/config");

  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("Missing DIRECT_URL or DATABASE_URL in the selected environment.");
  }

  // A pooler hostname alone does NOT identify the Supabase project.
  console.log(`Database host: ${new URL(connectionString).hostname}`);
  console.log(`Mode: ${mode}`);

  const [{ PrismaClient }, { PrismaPg }] = await Promise.all([
    import("@prisma/client"),
    import("@prisma/adapter-pg"),
  ]);

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  try {
    const slugs = [...new Set(imported.map(({ slug }) => slug))];
    const parents = await prisma.caseStudy.findMany({
      where: { slug: { in: slugs } },
      select: { id: true, slug: true },
    });
    const parentBySlug = new Map(parents.map((entry) => [entry.slug, entry]));

    const skippedDrafts = [];
    const missingPublished = [];
    const available = [];

    for (const item of imported) {
      const parent = parentBySlug.get(item.slug);
      if (parent) {
        available.push({ ...item, caseStudyId: parent.id });
      } else if (item.sourceStatus === "draft") {
        skippedDrafts.push(item);
        console.log(`SKIP  ${item.slug}/${item.language} (draft case study not present in DB)`);
      } else {
        missingPublished.push(item);
        console.error(
          `MISSING ${item.slug}/${item.language} (published case study not present in DB)`,
        );
      }
    }

    // Preflight checks happen before ANY mutation in --apply mode.
    if (missingPublished.length > 0) {
      const missingSlugs = [...new Set(missingPublished.map(({ slug }) => slug))];
      throw new Error(
        `Found ${missingSlugs.length} missing published case study record(s): ${missingSlugs.join(", ")}. ` +
          "Import stopped before writing. Check whether this is the correct Supabase project " +
          "and repair the missing catalogue entries separately; do not run the general seed blindly.",
      );
    }

    const existingTranslations = available.length
      ? await prisma.caseStudyTranslation.findMany({
          where: {
            caseStudyId: { in: [...new Set(available.map(({ caseStudyId }) => caseStudyId))] },
            language: { in: ["de", "it"] },
          },
          select: { caseStudyId: true, language: true },
        })
      : [];
    const existingKeys = new Set(
      existingTranslations.map(({ caseStudyId, language }) => `${caseStudyId}/${language}`),
    );

    let creates = 0;
    let updates = 0;
    for (const item of available) {
      const exists = existingKeys.has(`${item.caseStudyId}/${item.language}`);
      if (exists) {
        updates++;
      } else {
        creates++;
      }
      console.log(`${exists ? "UPDATE" : "CREATE"} ${item.slug}/${item.language}`);
    }

    console.log(
      `Plan: ${available.length} translation(s) (${creates} create, ${updates} update); ` +
        `${skippedDrafts.length} missing draft translation(s) skipped; ` +
        "0 published parents missing.",
    );

    if (mode === "--apply") {
      for (const { caseStudyId, language, translation } of available) {
        const data = {
          title: translation.title,
          summary: translation.summary ?? null,
          content: translation.content,
          organization: translation.organization ?? null,
          industry: translation.industry ?? null,
          keyTakeaways: translation.keyTakeaways ?? undefined,
        };
        await prisma.caseStudyTranslation.upsert({
          where: { caseStudyId_language: { caseStudyId, language } },
          update: data,
          create: { caseStudyId, language, ...data },
        });
      }
      console.log(
        `Import completed: ${available.length} translation(s) upserted; ` +
          `${skippedDrafts.length} missing draft translation(s) skipped.`,
      );
    } else {
      console.log("Dry run completed; no data written.");
    }
  } finally {
    await prisma.$disconnect();
  }
}
