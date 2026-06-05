import { getPlatformFeedbackAdminStats } from "@/lib/admin/platform-feedback";

const headers = [
  "created_at",
  "user_email",
  "user_name",
  "ease_of_use",
  "module_clarity",
  "navigation",
  "tests_experience",
  "technical_problems",
  "overall_satisfaction",
  "suggestions",
  "technical_notes",
] as const;

type PlatformFeedbackExportHeader = (typeof headers)[number];
type ExportCell = string | number | boolean | null | undefined;
type PlatformFeedbackExportRow = Record<PlatformFeedbackExportHeader, ExportCell>;

function exportCellToString(value: ExportCell) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

function csvEscape(value: ExportCell) {
  const text = exportCellToString(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function htmlEscape(value: ExportCell) {
  const text = exportCellToString(value);

  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function buildPlatformFeedbackExportRows(): Promise<PlatformFeedbackExportRow[]> {
  const stats = await getPlatformFeedbackAdminStats();

  return stats.rows.map((row) => ({
    created_at: row.createdAt,
    user_email: row.userEmail,
    user_name: row.userName,
    ease_of_use: row.easeOfUse,
    module_clarity: row.moduleClarity,
    navigation: row.navigation,
    tests_experience: row.testsExperience,
    technical_problems: row.technicalProblems,
    overall_satisfaction: row.overallSatisfaction,
    suggestions: row.suggestions,
    technical_notes: row.technicalNotes,
  }));
}

export function buildPlatformFeedbackCsv(rows: PlatformFeedbackExportRow[]) {
  return [
    headers.map(csvEscape).join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(",")),
  ].join("\n");
}

export function buildPlatformFeedbackExcelHtml(rows: PlatformFeedbackExportRow[]) {
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
