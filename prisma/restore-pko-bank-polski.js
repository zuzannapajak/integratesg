/**
 * Create ONLY the missing, published PKO Bank Polski ePortfolio case study
 * and its EN/PL/DE/IT/EL translations. Allegro is never touched.
 *
 *  node prisma/restore-pko-bank-polski.js --check
 *  node prisma/restore-pko-bank-polski.js --dry-run
 *  node prisma/restore-pko-bank-polski.js --apply --project-ref=<ref> --confirm-published
 */
import { caseStudies } from "../content/eportfolio/index.js";
import {
  PKO_PUBLISHED_SLUG,
  PKO_REQUIRED_LOCALES,
  createPkoPublishedOnly,
  planPkoPublishedOnly,
  supabaseProjectRefFromPkoUrl,
} from "./seed-data/eportfolio/pko-published-only.js";

const args = process.argv.slice(2);
const modes = args.filter((arg) => ["--check", "--dry-run", "--apply"].includes(arg));
const mode = modes[0];
const projectFlags = args.filter((arg) => arg.startsWith("--project-ref="));
const confirmed = args.includes("--confirm-published");
if (
  modes.length !== 1 ||
  projectFlags.length > 1 ||
  args.some(
    (arg) =>
      !["--check", "--dry-run", "--apply", "--confirm-published"].includes(arg) &&
      !arg.startsWith("--project-ref="),
  ) ||
  (mode !== "--apply" && (projectFlags.length > 0 || confirmed))
) {
  throw new Error(
    "Usage: --check | --dry-run | --apply --project-ref=<SUPABASE_PROJECT_REF> --confirm-published",
  );
}

// Source validation for all modes. No database connection for --check.
const sourcePlan = planPkoPublishedOnly(caseStudies, null);
console.log(
  `PKO published source verified: ${PKO_PUBLISHED_SLUG}; ` +
    `locales: ${PKO_REQUIRED_LOCALES.join(", ")}; Allegro excluded.`,
);

if (mode === "--check") {
  console.log("Source-only check passed; no database connection or writes.");
} else {
  await import("dotenv/config");
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DIRECT_URL/DATABASE_URL missing. Cannot identify target database.");
  }
  const parsed = new URL(connectionString);
  const dbRef = supabaseProjectRefFromPkoUrl(connectionString);
  console.log(`Database host: ${parsed.hostname}`);
  console.log(`Supabase project ref: ${dbRef ?? "NOT IDENTIFIABLE"}`);
  console.log(`Mode: ${mode}`);
  if (mode === "--apply") {
    const expectedRef = projectFlags[0]?.slice("--project-ref=".length);
    if (!confirmed || !dbRef || !expectedRef || expectedRef !== dbRef) {
      throw new Error(
        "Apply blocked. Verify Supabase backup/project, then pass --confirm-published " +
          "and a matching --project-ref=PROJECT_REF.",
      );
    }
  }

  const [{ PrismaClient }, { PrismaPg }] = await Promise.all([
    import("@prisma/client"),
    import("@prisma/adapter-pg"),
  ]);
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  try {
    const parent = await prisma.caseStudy.findUnique({
      where: { slug: PKO_PUBLISHED_SLUG },
      select: {
        id: true,
        slug: true,
        status: true,
        translations: { select: { language: true } },
      },
    });
    const plan = planPkoPublishedOnly(caseStudies, parent);
    if (plan.action === "CREATE") {
      console.log(`CREATE ${PKO_PUBLISHED_SLUG} + ${plan.source.translations.length} translations`);
    } else {
      console.log(`KEEP ${PKO_PUBLISHED_SLUG}: already published with all five translations`);
    }
    console.log(
      `Plan: ${plan.action === "CREATE" ? 1 : 0} case study; ` +
        `${plan.action === "CREATE" ? plan.source.translations.length : 0} translations to CREATE; ` +
        "0 UPDATE; 0 DELETE; Allegro excluded.",
    );
    if (mode === "--apply" && plan.action === "CREATE") {
      const result = await prisma.$transaction(
        async (transaction) => {
          const latestParent = await transaction.caseStudy.findUnique({
            where: { slug: PKO_PUBLISHED_SLUG },
            select: {
              id: true,
              slug: true,
              status: true,
              translations: { select: { language: true } },
            },
          });
          const latestPlan = planPkoPublishedOnly(caseStudies, latestParent);
          if (latestPlan.action !== "CREATE") {
            throw new Error("PKO catalogue changed after preflight. No writes committed.");
          }
          return createPkoPublishedOnly(transaction, sourcePlan.source);
        },
        { maxWait: 15000, timeout: 120000 },
      );
      console.log(
        `RESTORED: ${result.parentsCreated} case study, ` +
          `${result.translationsCreated} translations. Allegro untouched.`,
      );
    } else if (mode === "--apply") {
      console.log("No writes needed. PKO already published with all five translations.");
    } else {
      console.log("Dry run completed: ZERO DATABASE WRITES.");
    }
  } finally {
    await prisma.$disconnect();
  }
}
