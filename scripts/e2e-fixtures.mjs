/**
 * Bootstrap educational fixture data in a VERIFIED, disposable E2E Supabase project.
 * Never run the project's general prisma/seed.js; it may remove/recreate records.
 *
 *   node scripts/e2e-fixtures.mjs --plan
 *   node scripts/e2e-fixtures.mjs --apply --project-ref=<E2E_REF> --confirm-disposable
 *
 * Reuses the project's narrowly scoped, already tested importers. All child
 * processes receive DATABASE_URL and DIRECT_URL set from .env.test, so neither
 * .env nor .env.local can accidentally direct writes to the pilot database.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'dotenv';

const FORBIDDEN_REFS = new Set(['ysctjfuiytpxmgyapgqj']);
const root = process.cwd();
const envPath = resolve(root, '.env.test');
const [mode, ...flags] = process.argv.slice(2);
const expectedFlags = ['--confirm-disposable'];

function fail(message) {
  console.error(`E2E fixtures: ${message}`);
  process.exit(1);
}

if (!['--plan', '--apply'].includes(mode)) {
  fail('Usage: --plan | --apply --project-ref=<isolated-E2E-ref> --confirm-disposable');
}
if (!existsSync(envPath)) fail('Missing .env.test. Configure the disposable test database first.');
const testEnv = parse(readFileSync(envPath));
const dbString = (testEnv.PLAYWRIGHT_DATABASE_URL || testEnv.TEST_DATABASE_URL || '').trim();
const apiString = (testEnv.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const expectedRef = (testEnv.PLAYWRIGHT_TEST_PROJECT_REF || '').trim();
if (!dbString || !apiString || !expectedRef) {
  fail('Missing PLAYWRIGHT_DATABASE_URL, NEXT_PUBLIC_SUPABASE_URL or PLAYWRIGHT_TEST_PROJECT_REF.');
}
if (testEnv.PLAYWRIGHT_ALLOW_DATABASE_RESET !== 'true' ||
    testEnv.PLAYWRIGHT_ISOLATED_DB_ACK !== 'DISPOSABLE_TEST_DATABASE') {
  fail('Disposable E2E acknowledgement missing. Do not bypass this check.');
}

let db;
let api;
try {
  db = new URL(dbString);
  api = new URL(apiString);
} catch {
  fail('Invalid E2E database or API URL.');
}
if (!['postgres:', 'postgresql:'].includes(db.protocol) || api.protocol !== 'https:') {
  fail('Remote E2E URLs must use PostgreSQL and HTTPS.');
}
const userRef = decodeURIComponent(db.username).match(/^postgres\.([a-z0-9]{12,})$/i)?.[1];
const hostRef = db.hostname.match(/^db\.([a-z0-9]{12,})\.supabase\.co$/i)?.[1];
const dbRef = userRef || hostRef;
const apiRef = api.hostname.match(/^([a-z0-9]{12,})\.supabase\.co$/i)?.[1];
if (!dbRef || !apiRef || dbRef !== apiRef || apiRef !== expectedRef ||
    FORBIDDEN_REFS.has(dbRef) || FORBIDDEN_REFS.has(expectedRef)) {
  fail('E2E DB/API project refs mismatch or target a forbidden pilot project. STOP.');
}
if (mode === '--plan' && flags.length !== 0) {
  fail('--plan is read-only and takes no additional arguments.');
}
if (mode === '--apply' && (flags.length !== 2 ||
    !flags.includes('--confirm-disposable') ||
    !flags.includes(`--project-ref=${expectedRef}`))) {
  fail(`--apply requires --project-ref=${expectedRef} and --confirm-disposable.`);
}

console.log(`Verified disposable E2E project: ${expectedRef}.`);
console.log(`Database host: ${db.hostname}. API host: ${api.hostname}.`);
console.log(mode === '--plan' ? 'Read-only inspection: no database writes.' : 'CREATE missing E2E fixtures; only the Curriculum translations importer uses upsert.');

const childEnv = {
  ...process.env,
  ...testEnv,
  // Explicit overrides have precedence over .env/.env.local loaded by Next or dotenv/config.
  DATABASE_URL: dbString,
  DIRECT_URL: dbString,
  PLAYWRIGHT_DATABASE_URL: dbString,
  NEXT_PUBLIC_SUPABASE_URL: apiString,
  PLAYWRIGHT_TEST_PROJECT_REF: expectedRef,
};

function invoke(file, args = []) {
  const script = resolve(root, file);
  if (!existsSync(script)) fail(`Missing required existing project script: ${file}`);
  console.log(`\n=== ${file} ${args.join(' ')} ===`);
  const result = spawnSync(process.execPath, [script, ...args], {
    cwd: root,
    env: childEnv,
    stdio: 'inherit',
    windowsHide: true,
  });
  if (result.error) fail(`Could not run ${file}: ${result.error.message}`);
  if (result.status !== 0) fail(`${file} failed (exit ${result.status}). No subsequent steps were executed.`);
}

// All read-only preflight checks happen before the first write. This is
// especially important because the Curriculum base course/quiz structure must
// already match the six canonical English source modules.
console.log('\n--- Mandatory read-only preflight ---');
invoke('scripts/e2e-prisma.mjs', ['--status']);
invoke('prisma/seed-curriculum-translations.js', ['--dry-run']);
invoke('prisma/restore-wp4-missing-case-studies.js', ['--dry-run']);
invoke('prisma/restore-pko-bank-polski.js', ['--dry-run']);
invoke('prisma/publish-allegro.js', ['--dry-run']);
invoke('prisma/seed-eportfolio-missing-locales.js', ['--dry-run']);

if (mode === '--plan') {
  console.log('\nPLAN COMPLETE: ZERO DATABASE WRITES.');
  console.log('Note: the translation plan will expand after missing parent cases are created.');
  console.log('Run --apply only if all preflight checks passed and this is a disposable E2E project.');
  process.exit(0);
}

console.log('\n--- Apply targeted E2E fixtures (no generic seed.js) ---');
const targetFlags = [`--project-ref=${expectedRef}`, '--confirm-published'];
invoke('prisma/restore-wp4-missing-case-studies.js', ['--apply', ...targetFlags]);
invoke('prisma/restore-pko-bank-polski.js', ['--apply', ...targetFlags]);
invoke('prisma/publish-allegro.js', ['--apply', ...targetFlags]);
invoke('prisma/seed-eportfolio-missing-locales.js', [
  '--apply', `--project-ref=${expectedRef}`, '--confirm-create-only',
]);
invoke('prisma/seed-curriculum-translations.js', ['--apply']);

console.log('\n--- Read-only post-import verification ---');
invoke('prisma/seed-eportfolio-missing-locales.js', ['--dry-run']);
invoke('prisma/seed-curriculum-translations.js', ['--dry-run']);
console.log('\nE2E fixture synchronization completed. No user account data or progress were intentionally altered by these importers.');
console.log('Next: npm run test:e2e:i18n and npm run test:e2e:journeys.');
