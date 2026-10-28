/**
 * Safely CREATE only translations absent in Supabase for already PUBLISHED ePortfolio case studies.
 * NO parent creation, parent updates, status changes, translation updates or deletions.
 *
 * --check source-only, no DB connection
 * --dry-run inspect current DB and print exact create plan (no writes)
 * --apply --project-ref=... --confirm-create-only  guarded, transactional inserts only
 */
import { caseStudies } from "../content/eportfolio/index.js";
import {
  createOnlyMissingTranslations,
  EXPECTED_SOURCE_LOCALES,
  planMissingTranslations,
  supabaseProjectRefFromUrl,
  validatePublishedSources,
} from "./seed-data/eportfolio/missing-translation-sync.js";

const args = process.argv.slice(2);
const modes = args.filter((arg) => ["--check", "--dry-run", "--apply"].includes(arg));
const valid = args.every(
  (arg) =>
    ["--check", "--dry-run", "--apply", "--confirm-create-only"].includes(arg) ||
    /^--project-ref=[a-z0-9]+$/.test(arg),
);
if (
  !valid ||
  modes.length !== 1 ||
  args.filter((arg) => arg.startsWith("--project-ref=")).length > 1
) {
  throw new Error(
    "Usage: --check | --dry-run | --apply --project-ref=<SUPABASE_REF> --confirm-create-only",
  );
}
const mode = modes[0];
const projectRefArg = args.find((arg) => arg.startsWith("--project-ref="));
const userProjectRef = projectRefArg?.slice("--project-ref=".length) ?? null;
const confirmation = args.includes("--confirm-create-only");
if (mode !== "--apply" && (projectRefArg || confirmation)) {
  throw new Error("Confirmation flags are accepted only with --apply.");
}

const sourceStats = validatePublishedSources(caseStudies);
console.log(
  `Source validation passed: ${sourceStats.publishedCount} published / ${sourceStats.sourceCount} total case studies.`,
);
if (mode === "--check") {
  console.log("Sources only. No database connection or writes.");
} else {
  await import("dotenv/config");
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!connectionString) throw new Error("Missing DIRECT_URL / DATABASE_URL.");
  const dbRef = supabaseProjectRefFromUrl(connectionString);
  console.log(`Database host: ${new URL(connectionString).hostname}`);
  console.log(`Supabase project ref: ${dbRef ?? "NOT IDENTIFIABLE"}`);
  console.log(`Mode: ${mode}`);
  if (
    mode === "--apply" &&
    (!dbRef || !userProjectRef || userProjectRef !== dbRef || !confirmation)
  ) {
    throw new Error(
      "Apply blocked. Supply matching --project-ref and --confirm-create-only after backing up the target DB.",
    );
  }
  const [{ PrismaClient }, { PrismaPg }] = await Promise.all([
    import("@prisma/client"),
    import("@prisma/adapter-pg"),
  ]);
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

  async function readPlan(client) {
    const parents = await client.caseStudy.findMany({
      select: { id: true, slug: true, status: true },
    });
    const translations = await client.caseStudyTranslation.findMany({
      where: { caseStudyId: { in: parents.map((parent) => parent.id) } },
      select: { caseStudyId: true, language: true },
    });
    return planMissingTranslations(caseStudies, parents, translations);
  }
  function printPlan(plan) {
    for (const language of EXPECTED_SOURCE_LOCALES) {
      const creates = plan.missing.filter((item) => item.language === language).length;
      console.log(
        `${language.toUpperCase()}: ${plan.covered[language]}/${plan.publishedDbCount} present; ${creates} to CREATE`,
      );
    }
    const other = plan.missing.filter((item) => !EXPECTED_SOURCE_LOCALES.includes(item.language));
    if (other.length) console.log(`Other locales to CREATE: ${other.length}`);
    plan.missing.forEach((item) => console.log(`CREATE ${item.slug}/${item.language}`));
    for (const slug of plan.missingPublishedParents) {
      console.warn(`PARENT MISSING IN DB: ${slug} (no automatic parent creation)`);
    }
    console.log(
      `Plan: ${plan.missing.length} missing translations to CREATE; 0 to UPDATE; 0 parents to modify; ` +
        `${plan.missingPublishedParents.length} published source parents absent from DB.`,
    );
  }
  try {
    if (mode === "--dry-run") {
      const plan = await readPlan(prisma);
      printPlan(plan);
      console.log("Dry run finished: ZERO DATABASE WRITES.");
    } else {
      const result = await prisma.$transaction(
        async (tx) => {
          const plan = await readPlan(tx);
          printPlan(plan);
          return createOnlyMissingTranslations(tx, plan.missing);
        },
        { maxWait: 15000, timeout: 120000 },
      );
      console.log(`CREATED: ${result.count} missing translations. Existing entries untouched.`);
    }
  } finally {
    await prisma.$disconnect();
  }
}
