/**
 * Publish ONLY Allegro with its five existing source translations.
 *   node prisma/publish-allegro.js --check
 *   node prisma/publish-allegro.js --dry-run
 *   node prisma/publish-allegro.js --apply --project-ref=<SUPABASE_REF> --confirm-published
 *
 * --check does not connect to the database. --dry-run reads only.
 * --apply is transactional, adds only missing rows and never updates existing
 * translation content, other case studies or user progress.
 */
import { caseStudies } from "../content/eportfolio/index.js";
import {
  ALLEGRO_SLUG,
  applyAllegroPublication,
  planAllegroPublication,
  supabaseProjectRefFromAllegroUrl,
  validateAllegroSource,
} from "./seed-data/eportfolio/allegro-published-only.js";

const args = process.argv.slice(2);
const modes = args.filter((arg) => ["--check", "--dry-run", "--apply"].includes(arg));
const projectRefs = args.filter((arg) => arg.startsWith("--project-ref="));
const valid = args.every(
  (arg) =>
    ["--check", "--dry-run", "--apply", "--confirm-published"].includes(arg) ||
    /^--project-ref=[a-z0-9]+$/.test(arg),
);
if (!valid || modes.length !== 1 || projectRefs.length > 1) {
  throw new Error("Usage: --check | --dry-run | --apply --project-ref=<REF> --confirm-published");
}
const mode = modes[0];
const confirmed = args.includes("--confirm-published");
const expectedRef = projectRefs[0]?.slice("--project-ref=".length);
if (mode !== "--apply" && (confirmed || expectedRef)) {
  throw new Error("Project confirmation flags are only accepted with --apply.");
}

const source = validateAllegroSource(caseStudies);
console.log(`Allegro source: ${source.status}, ${source.translations.length} translations (${source.translations.map((t) => t.language).join(", ")}).`);
if (mode === "--check") {
  console.log("Source-only check passed. No database connection or writes.");
} else {
  await import("dotenv/config");
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DIRECT_URL/DATABASE_URL not configured.");
  const dbRef = supabaseProjectRefFromAllegroUrl(connectionString);
  console.log(`Database host: ${new URL(connectionString).hostname}`);
  console.log(`Supabase project ref: ${dbRef ?? "NOT IDENTIFIABLE"}`);
  console.log(`Mode: ${mode}`);
  if (mode === "--apply" && (!confirmed || !expectedRef || !dbRef || dbRef !== expectedRef)) {
    throw new Error("Apply blocked: verify backup and project, then provide matching --project-ref and --confirm-published.");
  }

  const [{ PrismaClient }, { PrismaPg }] = await Promise.all([
    import("@prisma/client"),
    import("@prisma/adapter-pg"),
  ]);
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  async function readParent(client) {
    return client.caseStudy.findUnique({
      where: { slug: ALLEGRO_SLUG },
      select: { id: true, slug: true, status: true, translations: { select: { language: true } } },
    });
  }
  function planDescription(plan) {
    const action = { CREATE: "CREATE Allegro published", PUBLISH: "PUBLISH existing Allegro draft", KEEP: "KEEP existing published Allegro" }[plan.action];
    console.log(action);
    plan.missingLocales.forEach((locale) => console.log(`CREATE allegro/${locale}`));
    console.log(`Plan: ${plan.action === "CREATE" ? 1 : 0} parent CREATE, ${plan.action === "PUBLISH" ? 1 : 0} parent status UPDATE, ${plan.missingLocales.length} translations CREATE, 0 translation UPDATE, 0 DELETE.`);
  }
  try {
    const original = await readParent(prisma);
    const plan = planAllegroPublication(caseStudies, original);
    planDescription(plan);
    if (mode === "--dry-run") {
      console.log("Dry run completed: ZERO DATABASE WRITES.");
    } else {
      const result = await prisma.$transaction(async (tx) => {
        const latest = await readParent(tx);
        const latestPlan = planAllegroPublication(caseStudies, latest);
        const signature = (item) => `${item.action}:${item.missingLocales.join(",")}`;
        if (signature(plan) !== signature(latestPlan)) {
          throw new Error("Allegro changed since the read-only plan. Nothing was written.");
        }
        return applyAllegroPublication(tx, latestPlan, latest);
      }, { maxWait: 15000, timeout: 120000 });
      console.log(`DONE: ${result.created} parent created, ${result.promoted} existing draft published, ${result.translationsCreated} translations created.`);
    }
  } finally {
    await prisma.$disconnect();
  }
}
