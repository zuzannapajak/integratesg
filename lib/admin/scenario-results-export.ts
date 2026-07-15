import { scenarioPathwayItems } from "@/content/scenarios/pathway";
import type { AppLocale } from "@/lib/i18n/locales";
import { prisma } from "@/lib/prisma";
import { resolveScenarioBySlug } from "@/lib/scenarios/simulator/resolve-scenario";

type ScenarioExportCell = string | number | boolean | null | undefined;
type ScenarioExportRow = Record<string, ScenarioExportCell>;

type ChoiceLookup = {
  challengeTitle: string;
  choiceLabel: string;
};

const scenarioExportHeaders = [
  "user_email",
  "user_name",
  "scenario_id",
  "scenario_title",
  "scenario_version",
  "language",
  "attempt_number",
  "attempt_status",
  "score_percent",
  "started_at",
  "last_opened_at",
  "completed_at",
  "challenge_id",
  "challenge_title",
  "choice_id",
  "choice_label",
  "choice_attempt_number",
  "is_optimal",
  "confirmed_at",
] as const;

function scenarioExportCellToString(value: ScenarioExportCell) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

function csvEscape(value: ScenarioExportCell) {
  const text = scenarioExportCellToString(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function htmlEscape(value: ScenarioExportCell) {
  const text = scenarioExportCellToString(value);

  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function toIsoString(value: Date | null | undefined) {
  return value?.toISOString() ?? "";
}

function calculateScorePercent(choices: ReadonlyArray<{ isOptimal: boolean }>) {
  if (choices.length === 0) {
    return "";
  }

  const optimalChoices = choices.reduce((sum, choice) => sum + (choice.isOptimal ? 1 : 0), 0);

  return Math.round((optimalChoices / choices.length) * 100);
}

function getScenarioSlug(scenarioId: string) {
  return scenarioPathwayItems.find((item) => item.id === scenarioId)?.slug ?? scenarioId;
}

function buildChoiceLookup(locale: AppLocale) {
  const lookup = new Map<string, ChoiceLookup>();
  const scenarioTitles = new Map<string, string>();

  for (const pathwayItem of scenarioPathwayItems) {
    const scenario = resolveScenarioBySlug(pathwayItem.slug, locale);

    if (!scenario) {
      continue;
    }

    scenarioTitles.set(pathwayItem.id, scenario.title);

    for (const challenge of scenario.challenges) {
      for (const choice of challenge.choices) {
        lookup.set(`${pathwayItem.id}:${challenge.id}:${choice.id}`, {
          challengeTitle: challenge.title,
          choiceLabel: choice.label ?? choice.text,
        });
      }
    }
  }

  return { lookup, scenarioTitles };
}

export async function getScenarioResultsExportRows(locale: AppLocale) {
  const { lookup, scenarioTitles } = buildChoiceLookup(locale);

  const attempts = await prisma.userScenarioAttempt.findMany({
    orderBy: [{ lastOpenedAt: "desc" }, { startedAt: "desc" }],
    select: {
      scenarioId: true,
      scenarioVersion: true,
      locale: true,
      attemptNumber: true,
      status: true,
      startedAt: true,
      lastOpenedAt: true,
      completedAt: true,
      user: {
        select: {
          email: true,
          fullName: true,
        },
      },
      choiceAttempts: {
        orderBy: [{ confirmedAt: "asc" }, { attemptNumber: "asc" }],
        select: {
          challengeId: true,
          choiceId: true,
          attemptNumber: true,
          isOptimal: true,
          confirmedAt: true,
        },
      },
    },
  });

  const rows: ScenarioExportRow[] = [];

  for (const attempt of attempts) {
    const scenarioSlug = getScenarioSlug(attempt.scenarioId);
    const scenarioTitle = scenarioTitles.get(attempt.scenarioId) ?? scenarioSlug;
    const scorePercent = calculateScorePercent(attempt.choiceAttempts);

    const baseRow = {
      user_email: attempt.user.email,
      user_name: attempt.user.fullName ?? "",
      scenario_id: attempt.scenarioId,
      scenario_title: scenarioTitle,
      scenario_version: attempt.scenarioVersion,
      language: attempt.locale,
      attempt_number: attempt.attemptNumber,
      attempt_status: attempt.status,
      score_percent: scorePercent,
      started_at: toIsoString(attempt.startedAt),
      last_opened_at: toIsoString(attempt.lastOpenedAt),
      completed_at: toIsoString(attempt.completedAt),
    } satisfies ScenarioExportRow;

    if (attempt.choiceAttempts.length === 0) {
      rows.push({
        ...baseRow,
        challenge_id: "",
        challenge_title: "",
        choice_id: "",
        choice_label: "",
        choice_attempt_number: "",
        is_optimal: "",
        confirmed_at: "",
      });

      continue;
    }

    for (const choiceAttempt of attempt.choiceAttempts) {
      const choiceLookup = lookup.get(
        `${attempt.scenarioId}:${choiceAttempt.challengeId}:${choiceAttempt.choiceId}`,
      );

      rows.push({
        ...baseRow,
        challenge_id: choiceAttempt.challengeId,
        challenge_title: choiceLookup?.challengeTitle ?? choiceAttempt.challengeId,
        choice_id: choiceAttempt.choiceId,
        choice_label: choiceLookup?.choiceLabel ?? choiceAttempt.choiceId,
        choice_attempt_number: choiceAttempt.attemptNumber,
        is_optimal: choiceAttempt.isOptimal,
        confirmed_at: toIsoString(choiceAttempt.confirmedAt),
      });
    }
  }

  return {
    headers: [...scenarioExportHeaders],
    rows,
  };
}

export function buildScenarioResultsCsv(rows: ScenarioExportRow[]) {
  return [
    scenarioExportHeaders.map(csvEscape).join(","),
    ...rows.map((row) => scenarioExportHeaders.map((header) => csvEscape(row[header])).join(",")),
  ].join("\n");
}

export function buildScenarioResultsExcelHtml(rows: ScenarioExportRow[]) {
  return `<!doctype html>
<html>
<head><meta charset="utf-8" /></head>
<body>
<table>
<thead>
<tr>${scenarioExportHeaders.map((header) => `<th>${htmlEscape(header)}</th>`).join("")}</tr>
</thead>
<tbody>
${rows
  .map(
    (row) =>
      `<tr>${scenarioExportHeaders.map((header) => `<td>${htmlEscape(row[header])}</td>`).join("")}</tr>`,
  )
  .join("\n")}
</tbody>
</table>
</body>
</html>`;
}
