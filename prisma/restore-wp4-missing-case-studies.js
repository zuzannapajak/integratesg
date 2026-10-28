/**
 * Safely CREATE ONLY missing, published WP4 ePortfolio case studies.
 * Scope: six known slugs, no Allegro, no deletions, no updates to existing rows.
 *
 * Usage:
 *  node prisma/restore-wp4-missing-case-studies.js --check
 *  node prisma/restore-wp4-missing-case-studies.js --dry-run
 *  node prisma/restore-wp4-missing-case-studies.js --apply --project-ref=<SUPABASE_PROJECT_REF> --confirm-published
 *
 * The apply operation is an atomic DB transaction, and fails closed if the
 * database/project cannot be identified, existing status differs, or a unique
 * constraint changes between preflight and write.
 */
import { caseStudies } from "../content/eportfolio/index.js";
import {
  WP4_MISSING_PUBLISHED_SLUGS,
  insertMissingPublishedParents,
  prepareMissingPublishedParents,
  supabaseProjectRefFromUrl,
} from "./seed-data/eportfolio/restore-missing-published.js";

const args = process.argv.slice(2);
const mode = args.find((arg) => ["--check", "--dry-run", "--apply"].includes(arg));
const projectFlag = args.find((arg) => arg.startsWith("--project-ref="));
const projectRef = projectFlag?.slice("--project-ref=".length) ?? null;
const confirmPublished = args.includes("--confirm-published");
const allowedArgs = (arg) =>
  ["--check", "--dry-run", "--apply", "--confirm-published"].includes(arg) ||
  arg.startsWith("--project-ref=");

if (
  !args.every(allowedArgs) ||
  args.filter((arg) => ["--check", "--dry-run", "--apply"].includes(arg)).length !== 1 ||
  (mode !== "--apply" && (projectFlag || confirmPublished))
) {
  throw new Error(
    "Usage: --check | --dry-run | --apply --project-ref=<SUPABASE_PROJECT_REF> --confirm-published",
  );
}

// Validate the sources even for --check; no network or DB connection here.
const plan = prepareMissingPublishedParents(caseStudies, []);
console.log(
  `WP4 published parent sources verified: ${plan.missing.length} slugs (${WP4_MISSING_PUBLISHED_SLUGS.join(", ")}).`,
);

if (mode === "--check") {
  console.log("Source-only check completed; no database connection or writes.");
} else {
  await import("dotenv/config");
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("Missing DIRECT_URL / DATABASE_URL; cannot identify target database.");
  }
  const dbRef = supabaseProjectRefFromUrl(connectionString);
  const host = new URL(connectionString).hostname;
  console.log(`Database host: ${host}`);
  console.log(`Supabase project ref (from connection string): ${dbRef ?? "NOT IDENTIFIABLE"}`);
  console.log(`Mode: ${mode}`);

  if (mode === "--apply") {
    if (!dbRef || !confirmPublished || !projectRef || dbRef !== projectRef) {
      throw new Error(
        "Apply blocked: supply --confirm-published and --project-ref=PROJECT_REF matching " +
          "Supabase project settings and the connection string.",
      );
    }
  }

  const [{ PrismaClient }, { PrismaPg }] = await Promise.all([
    import("@prisma/client"),
    import("@prisma/adapter-pg"),
  ]);
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  try {
    const [allCount, parents] = await Promise.all([
      prisma.caseStudy.count(),
      prisma.caseStudy.findMany({
        where: { slug: { in: [...WP4_MISSING_PUBLISHED_SLUGS] } },
        select: { id: true, slug: true, status: true },
      }),
    ]);
    const { missing, present } = prepareMissingPublishedParents(caseStudies, parents);
    console.log(`CaseStudy rows currently in database: ${allCount}`);
    present.forEach(({ slug }) => console.log(`KEEP ${slug} (already present; no changes)`));
    missing.forEach(({ slug, translations }) =>
      console.log(`CREATE ${slug} + ${translations.length} source translations`),
    );
    const totalTranslations = missing.reduce((sum, item) => sum + item.translations.length, 0);
    console.log(
      `Plan: ${missing.length} case studies and ${totalTranslations} translations to CREATE; ` +
        `${present.length} existing case studies untouched. Allegro excluded.`,
    );
    if (mode === "--apply" && missing.length) {
      const result = await prisma.$transaction(
        async (transaction) => {
          // Guard against any status or existence change after preflight.
          const latestParents = await transaction.caseStudy.findMany({
            where: { slug: { in: [...WP4_MISSING_PUBLISHED_SLUGS] } },
            select: { id: true, slug: true, status: true },
          });
          const latest = prepareMissingPublishedParents(caseStudies, latestParents);
          if (
            latest.missing.map((entry) => entry.slug).join("|") !==
            missing.map((entry) => entry.slug).join("|")
          ) {
            throw new Error("Case study catalogue changed after preflight. Nothing was committed.");
          }
          return insertMissingPublishedParents(transaction, missing);
        },
        { maxWait: 15000, timeout: 120000 },
      );
      console.log(
        `RESTORED: ${result.parentsCreated} case studies, ${result.translationsCreated} translations.`,
      );
    } else if (mode === "--apply") {
      console.log("Nothing to create. Existing case studies were not modified.");
    } else {
      console.log("Dry run completed: ZERO DATABASE WRITES.");
    }
  } finally {
    await prisma.$disconnect();
  }
}
