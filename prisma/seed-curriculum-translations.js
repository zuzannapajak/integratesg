import { courses } from "./seed-data/curriculum/index.js";
import { CURRICULUM_TRANSLATION_LANGUAGES } from "./seed-data/curriculum/localizations.js";

/**
 * Safe, non-destructive curriculum localization importer.
 * - --check: offline content and structural checks (NO database connection)
 * - --dry-run: read-only verification against the actual database (default)
 * - --apply: upsert ONLY translation tables, after DB structure preflight
 * NEVER call prisma/seed.js on a piloting database to import translations.
 */
const mode = process.argv[2] ?? "--dry-run";
if (!["--check", "--dry-run", "--apply"].includes(mode) || process.argv.length > 3) {
  console.error("Usage: node prisma/seed-curriculum-translations.js [--check|--dry-run|--apply]");
  process.exit(2);
}

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

function offlineCheck() {
  let questions = 0;
  let answers = 0;
  let translations = 0;
  const languages = ["en", ...CURRICULUM_TRANSLATION_LANGUAGES];
  const checkLanguages = (records, context) => {
    invariant(
      records.length === languages.length,
      `${context}: expected ${languages.length} locales`,
    );
    invariant(
      languages.every((language) => records.some((row) => row.language === language)),
      `${context}: missing locale`,
    );
    translations += CURRICULUM_TRANSLATION_LANGUAGES.length;
  };
  invariant(courses.length === 6, "Expected exactly six curriculum modules");
  for (const course of courses) {
    checkLanguages(course.translations, `${course.slug} course`);
    invariant(
      course.sections.length === 4 && course.quizzes.length === 4,
      `${course.slug} structural mismatch`,
    );
    course.translations.forEach((r) =>
      invariant(
        r.title && r.content?.length > 150,
        `${course.slug}/${r.language}: missing module text`,
      ),
    );
    for (const section of course.sections) {
      checkLanguages(section.translations, `${course.slug}/${section.slug} section`);
      section.translations.forEach((r) =>
        invariant(
          r.title && r.content?.length > 150,
          `${course.slug}/${section.slug}/${r.language}: missing unit text`,
        ),
      );
    }
    for (const quiz of course.quizzes) {
      checkLanguages(quiz.translations, `${course.slug}/${quiz.sortOrder} quiz`);
      for (const question of quiz.questions) {
        questions++;
        checkLanguages(
          question.translations,
          `${course.slug}/${quiz.sortOrder}/${question.sortOrder} question`,
        );
        invariant(
          question.answers.filter((answer) => answer.isCorrect).length === 1,
          `${course.slug}: invalid English answer key`,
        );
        for (const answer of question.answers) {
          answers++;
          checkLanguages(
            answer.translations,
            `${course.slug}/${quiz.sortOrder}/${question.sortOrder}/${answer.sortOrder} answer`,
          );
          answer.translations.forEach((r) =>
            invariant(
              r.text?.trim() && r.feedbackText?.trim(),
              `${course.slug}/${r.language}: missing answer/feedback`,
            ),
          );
        }
      }
    }
  }
  invariant(
    questions === 108 && answers === 332,
    "Question/answer count differs from the checked English seed",
  );
  console.log(
    `OK (offline): 6 courses, 24 sections, 24 quizzes, ${questions} questions, ${answers} answers; ${translations} localized translation rows across 5 new languages.`,
  );
}

function preflight(dbCourses) {
  const bySlug = new Map(dbCourses.map((course) => [course.slug, course]));
  invariant(bySlug.size === courses.length, `DB has ${bySlug.size}/6 curriculum courses`);
  const ordered = [];
  for (const source of courses) {
    const db = bySlug.get(source.slug);
    invariant(db, `DB missing course ${source.slug}`);
    invariant(
      db.sections.length === source.sections.length,
      `${source.slug}: DB section count differs; do not import`,
    );
    invariant(
      db.quizzes.length === source.quizzes.length,
      `${source.slug}: DB quiz count differs; do not import`,
    );
    const dbSections = new Map(db.sections.map((section) => [section.slug, section]));
    for (const section of source.sections) {
      const row = dbSections.get(section.slug);
      invariant(
        row?.sortOrder === section.sortOrder,
        `${source.slug}: section ${section.slug} does not match source`,
      );
    }
    for (let qi = 0; qi < source.quizzes.length; qi++) {
      const srcQuiz = source.quizzes[qi];
      const dbQuiz = db.quizzes[qi];
      invariant(
        dbQuiz.type === srcQuiz.type && dbQuiz.sortOrder === srcQuiz.sortOrder,
        `${source.slug}: quiz ${qi + 1} ID/order differs`,
      );
      invariant(
        dbQuiz.questions.length === srcQuiz.questions.length,
        `${source.slug}: quiz ${qi + 1} question count differs`,
      );
      for (let i = 0; i < srcQuiz.questions.length; i++) {
        const sq = srcQuiz.questions[i];
        const dq = dbQuiz.questions[i];
        invariant(
          dq.sortOrder === sq.sortOrder && dq.prompt === sq.prompt,
          `${source.slug} quiz ${qi + 1} question ${i + 1}: canonical English prompt differs; STOP`,
        );
        invariant(
          dq.answers.length === sq.answers.length,
          `${source.slug} quiz ${qi + 1} question ${i + 1}: DB answer count differs`,
        );
        for (let ai = 0; ai < sq.answers.length; ai++) {
          const sa = sq.answers[ai];
          const da = dq.answers[ai];
          invariant(
            da.sortOrder === sa.sortOrder && da.text === sa.text && da.isCorrect === sa.isCorrect,
            `${source.slug} quiz ${qi + 1} question ${i + 1} answer ${ai + 1}: canonical English answer differs; STOP`,
          );
        }
      }
    }
    ordered.push({ source, db });
  }
  return ordered;
}

function pickLanguage(records, language) {
  const result = records.find((record) => record.language === language);
  invariant(result, `Missing prepared translation: ${language}`);
  return result;
}

async function applyCourse(prisma, source, db) {
  const dbSections = new Map(db.sections.map((section) => [section.slug, section]));
  // One atomic transaction per module; safe to repeat if connection fails after some modules.
  await prisma.$transaction(
    async (tx) => {
      for (const language of CURRICULUM_TRANSLATION_LANGUAGES) {
        const t = pickLanguage(source.translations, language);
        const courseData = {
          title: t.title,
          subtitle: t.subtitle ?? null,
          description: t.description ?? null,
          content: t.content,
          details: t.details ?? undefined,
        };
        await tx.courseTranslation.upsert({
          where: { courseId_language: { courseId: db.id, language } },
          create: { courseId: db.id, language, ...courseData },
          update: courseData,
        });
        for (const section of source.sections) {
          const dbSection = dbSections.get(section.slug);
          const st = pickLanguage(section.translations, language);
          const data = { title: st.title, summary: st.summary ?? null, content: st.content };
          await tx.courseSectionTranslation.upsert({
            where: { courseSectionId_language: { courseSectionId: dbSection.id, language } },
            create: { courseSectionId: dbSection.id, language, ...data },
            update: data,
          });
        }
        for (let quizIndex = 0; quizIndex < source.quizzes.length; quizIndex++) {
          const srcQuiz = source.quizzes[quizIndex];
          const dbQuiz = db.quizzes[quizIndex];
          const qt = pickLanguage(srcQuiz.translations, language);
          const quizData = { title: qt.title ?? null, description: qt.description ?? null };
          await tx.quizTranslation.upsert({
            where: { quizId_language: { quizId: dbQuiz.id, language } },
            create: { quizId: dbQuiz.id, language, ...quizData },
            update: quizData,
          });
          for (let i = 0; i < srcQuiz.questions.length; i++) {
            const sq = srcQuiz.questions[i];
            const dq = dbQuiz.questions[i];
            const q = pickLanguage(sq.translations, language);
            const questionData = { prompt: q.prompt, explanation: q.explanation ?? null };
            await tx.questionTranslation.upsert({
              where: { questionId_language: { questionId: dq.id, language } },
              create: { questionId: dq.id, language, ...questionData },
              update: questionData,
            });
            for (let ai = 0; ai < sq.answers.length; ai++) {
              const at = pickLanguage(sq.answers[ai].translations, language);
              const a = dbQuiz.questions[i].answers[ai];
              const answerData = { text: at.text, feedbackText: at.feedbackText ?? null };
              await tx.answerTranslation.upsert({
                where: { answerId_language: { answerId: a.id, language } },
                create: { answerId: a.id, language, ...answerData },
                update: answerData,
              });
            }
          }
        }
      }
    },
    { maxWait: 30000, timeout: 240000 },
  );
}

async function main() {
  offlineCheck();
  if (mode === "--check") return;
  await import("dotenv/config");
  if (!process.env.DIRECT_URL) {
    throw new Error(
      "Missing DIRECT_URL. Provide the URL to the intended Supabase database; check carefully it is not E2E.",
    );
  }
  const [{ PrismaClient }, { PrismaPg }] = await Promise.all([
    import("@prisma/client"),
    import("@prisma/adapter-pg"),
  ]);
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DIRECT_URL }),
  });
  try {
    const stored = await prisma.course.findMany({
      where: { slug: { in: courses.map((c) => c.slug) } },
      include: {
        sections: { orderBy: { sortOrder: "asc" } },
        quizzes: {
          where: { type: "post" },
          orderBy: { sortOrder: "asc" },
          include: {
            questions: {
              orderBy: { sortOrder: "asc" },
              include: { answers: { orderBy: { sortOrder: "asc" } } },
            },
          },
        },
      },
    });
    const entries = preflight(stored);
    console.log(
      `Database preflight OK: matching original 6 courses, 24 quizzes, 108 English questions and 332 answer keys.`,
    );
    if (mode === "--dry-run") {
      console.log("DRY RUN ONLY: no changes have been made. To write localized records: --apply");
      return;
    }
    for (const { source, db } of entries) {
      await applyCourse(prisma, source, db);
      console.log(`Translations updated (without touching user data): ${source.slug}`);
    }
    console.log(
      "DONE: localized curriculum and quizzes updated. English records and pilot progress unchanged.",
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Curriculum translation import failed:", error.message);
  process.exitCode = 1;
});
