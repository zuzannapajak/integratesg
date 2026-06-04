import { prisma } from "@/lib/prisma";

function exportValueToText(value: unknown) {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString();

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "bigint"
  ) {
    return value.toString();
  }

  if (typeof value === "symbol") {
    return value.description ?? "";
  }

  if (typeof value === "function") return "";

  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
}

function csvEscape(value: unknown) {
  const text = exportValueToText(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function htmlEscape(value: unknown) {
  const text = exportValueToText(value);

  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function avg(values: number[]) {
  if (values.length === 0) return "";
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2));
}

type ParsedQuizAttempt = {
  quizId?: string;
  quizType?: string;
  score: number;
  passed?: boolean;
  submittedAt?: string;
};

function parseAttempts(value: unknown): ParsedQuizAttempt[] {
  if (!Array.isArray(value)) return [];

  return value.filter((item): item is ParsedQuizAttempt => {
    if (typeof item !== "object" || item === null) return false;

    const attempt = item as Record<string, unknown>;

    return typeof attempt.score === "number";
  });
}

export async function getPlatformResultsExportRows(locale: string) {
  const [courses, pilots, courseAttempts] = await Promise.all([
    prisma.course.findMany({
      where: { status: "published" },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        slug: true,
        sortOrder: true,
        translations: {
          where: { language: { in: [locale, "en"] } },
          select: { language: true, title: true },
        },
        quizzes: {
          where: { type: "post" },
          select: { id: true },
        },
      },
    }),

    prisma.curriculumPilot.findMany({
      include: {
        user: { select: { id: true, email: true, fullName: true } },
        submissions: {
          include: {
            answers: {
              include: {
                question: {
                  select: {
                    key: true,
                    sortOrder: true,
                    inputType: true,
                    translations: {
                      where: { language: { in: [locale, "en"] } },
                      select: { language: true, prompt: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }),

    prisma.userCourseAttempt.findMany({
      include: {
        user: { select: { id: true, email: true, fullName: true } },
      },
    }),
  ]);

  const users = new Map<string, { id: string; email: string; fullName: string | null }>();

  for (const pilot of pilots) users.set(pilot.user.id, pilot.user);
  for (const attempt of courseAttempts) users.set(attempt.user.id, attempt.user);

  const attemptsByUserCourse = new Map<string, (typeof courseAttempts)[number]>();
  for (const attempt of courseAttempts) {
    attemptsByUserCourse.set(`${attempt.userId}:${attempt.courseId}`, attempt);
  }

  const pilotByUser = new Map(pilots.map((pilot) => [pilot.userId, pilot]));

  const questionKeys = Array.from(
    new Set(
      pilots.flatMap((pilot) =>
        pilot.submissions.flatMap((submission) =>
          submission.answers.map((answer) => answer.question.key),
        ),
      ),
    ),
  ).sort();

  const headers = [
    "user_email",
    "user_name",
    "pilot_status",
    "pre_completed_at",
    "post_completed_at",
    "pre_average",
    "post_average",
    "delta",
    "modules_completed_before_post",
    ...questionKeys.map((key) => `pre_${key}`),
    ...questionKeys.map((key) => `post_${key}`),
    ...courses.flatMap((course) => [
      `${course.slug}_status`,
      `${course.slug}_progress`,
      `${course.slug}_completed_at`,
      `${course.slug}_post_quizzes_passed`,
      `${course.slug}_post_quizzes_required`,
      `${course.slug}_best_post_score`,
    ]),
  ];

  const rows = Array.from(users.values()).map((user) => {
    const pilot = pilotByUser.get(user.id);
    const preSubmission = pilot?.submissions.find((submission) => submission.type === "pre");
    const postSubmission = pilot?.submissions.find((submission) => submission.type === "post");

    const row: Record<string, unknown> = {
      user_email: user.email,
      user_name: user.fullName ?? "",
      pilot_status: pilot?.status ?? "",
      pre_completed_at: pilot?.preAssessmentCompletedAt?.toISOString() ?? "",
      post_completed_at: pilot?.postAssessmentCompletedAt?.toISOString() ?? "",
      pre_average: pilot?.preAssessmentAverageScore ?? "",
      post_average: pilot?.postAssessmentAverageScore ?? "",
      delta: pilot?.assessmentAverageScoreDelta ?? "",
      modules_completed_before_post: postSubmission?.modulesCompletedBeforeSubmission ?? "",
    };

    for (const key of questionKeys) {
      const preAnswer = preSubmission?.answers.find((answer) => answer.question.key === key);
      const postAnswer = postSubmission?.answers.find((answer) => answer.question.key === key);

      row[`pre_${key}`] = preAnswer?.valueInt ?? preAnswer?.valueText ?? "";
      row[`post_${key}`] = postAnswer?.valueInt ?? postAnswer?.valueText ?? "";
    }

    for (const course of courses) {
      const attempt = attemptsByUserCourse.get(`${user.id}:${course.id}`);
      const postAttempts = parseAttempts(attempt?.postQuizAttempts);
      const passedQuizIds = new Set(
        postAttempts
          .filter((quizAttempt) => quizAttempt.quizType === "post" && quizAttempt.passed)
          .map((quizAttempt) => quizAttempt.quizId)
          .filter(Boolean),
      );

      row[`${course.slug}_status`] = attempt?.status ?? "";
      row[`${course.slug}_progress`] = attempt?.progressPercent ?? "";
      row[`${course.slug}_completed_at`] = attempt?.completedAt?.toISOString() ?? "";
      row[`${course.slug}_post_quizzes_passed`] = passedQuizIds.size;
      row[`${course.slug}_post_quizzes_required`] = course.quizzes.length;
      row[`${course.slug}_best_post_score`] = avg(
        postAttempts
          .filter((quizAttempt) => quizAttempt.quizType === "post")
          .map((quizAttempt) => quizAttempt.score),
      );
    }

    return row;
  });

  return { headers, rows };
}

export function buildCsvExport(headers: string[], rows: Record<string, unknown>[]) {
  return [
    headers.map(csvEscape).join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(",")),
  ].join("\n");
}

export function buildExcelHtmlExport(headers: string[], rows: Record<string, unknown>[]) {
  return `<!doctype html>
<html>
<head><meta charset="utf-8" /></head>
<body>
<table>
<thead>
<tr>${headers.map((header) => `<th>${htmlEscape(header)}</th>`).join("")}</tr>
</thead>
<tbody>
${rows
  .map(
    (row) => `<tr>${headers.map((header) => `<td>${htmlEscape(row[header])}</td>`).join("")}</tr>`,
  )
  .join("\n")}
</tbody>
</table>
</body>
</html>`;
}
