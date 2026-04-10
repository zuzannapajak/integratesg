"use client";

import StatsChart from "@/components/dashboard/stats-chart";
import UserCurriculumAttemptsTable from "@/components/stats/user-curriculum-attempts-table";
import UserEportfolioProgressTable from "@/components/stats/user-eportfolio-progress-table";
import UserScenarioAttemptsTable from "@/components/stats/user-scenario-attempts-table";
import type {
  AdminCourseStat,
  AdminLanguageStat,
  AdminScenarioStat,
  BasicAdminStats,
} from "@/lib/admin/types";
import { ESG_colors } from "@/lib/constants";
import { motion, type Variants } from "framer-motion";
import {
  Activity,
  BookOpen,
  ChevronDown,
  Filter,
  FolderOpen,
  Globe2,
  GraduationCap,
  Languages,
  LayoutDashboard,
  PlayCircle,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  locale: string;
  stats: BasicAdminStats;
};

type Segment = "summary" | "languages" | "scenarios" | "courses" | "eportfolio";
type ActivityWindow = "24h" | "7d" | "30d";

const FADE_UP: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.42,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const STAGGER: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

function formatPercent(value: number) {
  const rounded = Number.isInteger(value) ? value : Math.round(value * 10) / 10;
  return `${rounded}%`;
}

function formatScore(value: number | null) {
  if (value === null) return "—";
  const rounded = Number.isInteger(value) ? value : Math.round(value * 10) / 10;
  return `${rounded}%`;
}

function formatArea(area: string, t: ReturnType<typeof useTranslations>) {
  switch (area) {
    case "environmental":
      return t("area.environmental");
    case "social":
      return t("area.social");
    case "governance":
      return t("area.governance");
    default:
      return t("area.crossCutting");
  }
}

function getAreaBadgeClass(area: string) {
  switch (area) {
    case "environmental":
      return "border-emerald-100 bg-emerald-50 text-emerald-700";
    case "social":
      return "border-violet-100 bg-violet-50 text-violet-700";
    case "governance":
      return "border-sky-100 bg-sky-50 text-sky-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
}

function averageFromSum(sum: number, count: number) {
  if (count === 0) return null;
  return sum / count;
}

function findMostActiveScenario(items: AdminScenarioStat[]) {
  let best: AdminScenarioStat | null = null;

  for (const item of items) {
    if (best === null || item.totalAttempts > best.totalAttempts) {
      best = item;
    }
  }

  return best;
}

function findBestCourse(items: AdminCourseStat[]) {
  let best: AdminCourseStat | null = null;

  for (const item of items) {
    if (
      best === null ||
      item.completionRate > best.completionRate ||
      (item.completionRate === best.completionRate && item.totalAttempts > best.totalAttempts)
    ) {
      best = item;
    }
  }

  return best;
}

function findLargestLanguage(items: AdminLanguageStat[]) {
  let best: AdminLanguageStat | null = null;

  for (const item of items) {
    if (best === null || item.users > best.users) {
      best = item;
    }
  }

  return best;
}

function summarizeScenarios(items: AdminScenarioStat[]) {
  let attempts = 0;
  let variants = 0;
  let completionSum = 0;
  let completionCount = 0;
  let scoreSum = 0;
  let scoreCount = 0;

  for (const item of items) {
    attempts += item.totalAttempts;
    variants += item.availableVariants;
    completionSum += item.completionRate;
    completionCount += 1;

    if (item.averageScore !== null) {
      scoreSum += item.averageScore;
      scoreCount += 1;
    }
  }

  return {
    attempts,
    variants,
    avgCompletion: averageFromSum(completionSum, completionCount),
    avgScore: averageFromSum(scoreSum, scoreCount),
  };
}

function summarizeCourses(items: AdminCourseStat[]) {
  let attempts = 0;
  let inProgress = 0;
  let completionSum = 0;
  let completionCount = 0;
  let postQuizSum = 0;
  let postQuizCount = 0;

  for (const item of items) {
    attempts += item.totalAttempts;
    inProgress += item.inProgress;
    completionSum += item.completionRate;
    completionCount += 1;

    if (item.averagePostQuizScore !== null) {
      postQuizSum += item.averagePostQuizScore;
      postQuizCount += 1;
    }
  }

  return {
    attempts,
    inProgress,
    avgCompletion: averageFromSum(completionSum, completionCount),
    avgPostQuiz: averageFromSum(postQuizSum, postQuizCount),
  };
}

function getScenarioSeries(stats: BasicAdminStats, window: ActivityWindow) {
  if (window === "24h") return stats.activity.scenarioSeries24h;
  if (window === "30d") return stats.activity.scenarioSeries30d;
  return stats.activity.scenarioSeries;
}

function getCurriculumSeries(stats: BasicAdminStats, window: ActivityWindow) {
  if (window === "24h") return stats.activity.curriculumSeries24h;
  if (window === "30d") return stats.activity.curriculumSeries30d;
  return stats.activity.curriculumSeries;
}

function getEportfolioSeries(stats: BasicAdminStats, window: ActivityWindow) {
  if (window === "24h") return stats.activity.eportfolioSeries24h;
  if (window === "30d") return stats.activity.eportfolioSeries30d;
  return stats.activity.eportfolioSeries;
}

function getScenarioEvents(stats: BasicAdminStats, window: ActivityWindow) {
  if (window === "24h") return stats.activity.recentScenarioAttempts24h;
  if (window === "30d") return stats.activity.recentScenarioAttempts30d;
  return stats.activity.recentScenarioAttempts;
}

function getCurriculumEvents(stats: BasicAdminStats, window: ActivityWindow) {
  if (window === "24h") return stats.activity.recentCourseAttempts24h;
  if (window === "30d") return stats.activity.recentCourseAttempts30d;
  return stats.activity.recentCourseAttempts;
}

function getEportfolioEvents(stats: BasicAdminStats, window: ActivityWindow) {
  if (window === "24h") return stats.activity.recentEportfolioEvents24h;
  if (window === "30d") return stats.activity.recentEportfolioEvents30d;
  return stats.activity.recentEportfolioEvents;
}

function getScenarioWindowStats(stats: BasicAdminStats, window: ActivityWindow) {
  if (window === "24h") return stats.activity.scenarioStats24h;
  if (window === "30d") return stats.activity.scenarioStats30d;
  return stats.activity.scenarioStats7d;
}

function getCurriculumWindowStats(stats: BasicAdminStats, window: ActivityWindow) {
  if (window === "24h") return stats.activity.curriculumStats24h;
  if (window === "30d") return stats.activity.curriculumStats30d;
  return stats.activity.curriculumStats7d;
}

function getEportfolioWindowStats(stats: BasicAdminStats, window: ActivityWindow) {
  if (window === "24h") return stats.activity.eportfolioStats24h;
  if (window === "30d") return stats.activity.eportfolioStats30d;
  return stats.activity.eportfolioStats7d;
}

function deriveInsights(stats: BasicAdminStats, t: ReturnType<typeof useTranslations>) {
  const scenarioLeader = findMostActiveScenario(stats.scenarioBreakdown);
  const courseLeader = findBestCourse(stats.courseBreakdown);
  const languageLeader = findLargestLanguage(stats.languageBreakdown);

  return [
    {
      title: t("highlights.mostActiveScenario"),
      value: scenarioLeader?.title ?? "—",
      detail: t("highlights.attemptsCompletion", {
        attempts: scenarioLeader?.totalAttempts ?? 0,
        completion: formatPercent(scenarioLeader?.completionRate ?? 0),
      }),
      tone: "green" as const,
    },
    {
      title: t("highlights.bestCompletionResult"),
      value: courseLeader?.title ?? "—",
      detail: t("highlights.completionPostQuiz", {
        completion: formatPercent(courseLeader?.completionRate ?? 0),
        score: formatScore(courseLeader?.averagePostQuizScore ?? null),
      }),
      tone: "orange" as const,
    },
    {
      title: t("highlights.largestLanguageCohort"),
      value: languageLeader?.label ?? "—",
      detail: t("highlights.usersVariants", {
        users: languageLeader?.users ?? 0,
        variants: languageLeader?.availableScenarioVariants ?? 0,
      }),
      tone: "blue" as const,
    },
  ];
}

function toneClass(tone: "green" | "blue" | "orange" | "neutral") {
  if (tone === "green") {
    return "border-emerald-100 bg-emerald-50/90 text-emerald-800";
  }

  if (tone === "blue") {
    return "border-sky-100 bg-sky-50/90 text-sky-800";
  }

  if (tone === "orange") {
    return "border-orange-100 bg-orange-50/90 text-orange-800";
  }

  return "border-slate-100 bg-slate-50/90 text-slate-800";
}

function Surface({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      variants={FADE_UP}
      className={`rounded-[28px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(251,251,249,0.92)_100%)] shadow-[0_16px_40px_rgba(35,45,62,0.08)] ${className}`}
    >
      {children}
    </motion.section>
  );
}

function SectionHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="text-lg font-bold tracking-tight text-slate-900 md:text-xl">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">{subtitle}</p>
      </div>
      {right}
    </div>
  );
}

function SegmentButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
        active
          ? "border border-slate-200 bg-white text-slate-900 shadow-sm"
          : "text-slate-500 hover:bg-white/70 hover:text-slate-700"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function WindowSelect({
  value,
  onChange,
}: {
  value: ActivityWindow;
  onChange: (value: ActivityWindow) => void;
}) {
  const t = useTranslations("Protected.AdminStatsShell");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const options: Array<{ value: ActivityWindow; label: string }> = [
    { value: "24h", label: t("window.24h") },
    { value: "7d", label: t("window.7d") },
    { value: "30d", label: t("window.30d") },
  ];

  const activeLabel = options.find((option) => option.value === value)?.label ?? t("window.7d");

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full sm:w-auto">
      <button
        type="button"
        onClick={() => {
          setOpen((current) => !current);
        }}
        className="inline-flex h-12 w-full min-w-0 items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 sm:w-auto sm:min-w-55"
      >
        <span className="flex items-center gap-3">
          <TrendingUp className="h-4 w-4 text-slate-400" />
          <span>{activeLabel}</span>
        </span>

        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open ? (
        <div className="absolute right-0 z-30 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_40px_rgba(35,45,62,0.16)]">
          <div className="space-y-1">
            {options.map((option) => {
              const active = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                    active ? "bg-slate-100 text-slate-900" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SortControl({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <div className="relative inline-flex h-12 w-full min-w-0 items-center rounded-2xl border border-slate-200 bg-white px-3 pr-10 text-sm shadow-sm transition hover:border-slate-300 sm:w-auto">
      <Filter className="mr-2 h-4 w-4 text-slate-400" />
      <select
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        className="w-full appearance-none bg-transparent pr-6 font-medium text-slate-700 outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-slate-400" />
    </div>
  );
}

function CompactHeroStat({
  label,
  value,
  hint,
  icon,
  accent,
}: {
  label: string;
  value: string | number;
  hint: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <motion.div
      variants={FADE_UP}
      className="group relative overflow-hidden rounded-3xl border border-white/80 bg-white/92 p-4 shadow-[0_14px_34px_rgba(35,45,62,0.07)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(35,45,62,0.09)] sm:p-5"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: accent }}
      />
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: accent }}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            {label}
          </p>
          <p className="mt-3 text-3xl font-black tracking-tight text-slate-900">{value}</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">{hint}</p>
        </div>

        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
          style={{ backgroundColor: `${accent}14`, color: accent }}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

function MiniKpi({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "green" | "blue" | "orange";
}) {
  const tones = {
    neutral: "border-slate-200 bg-slate-50 text-slate-700",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    blue: "border-sky-200 bg-sky-50 text-sky-700",
    orange: "border-orange-200 bg-orange-50 text-orange-700",
  };

  return (
    <div className={`rounded-2xl border px-4 py-3 ${tones[tone]}`}>
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] opacity-80">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

function QualityMetricTile({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "green" | "blue" | "orange";
}) {
  const tones = {
    neutral: "border-slate-200 bg-slate-50/90 text-slate-800",
    green: "border-emerald-200 bg-emerald-50/80 text-emerald-800",
    blue: "border-sky-200 bg-sky-50/80 text-sky-800",
    orange: "border-orange-200 bg-orange-50/80 text-orange-800",
  };

  return (
    <div
      className={`flex min-h-29.5 flex-col justify-between rounded-[22px] border px-5 py-4 ${tones[tone]}`}
    >
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] opacity-80">{label}</p>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-current">{value}</p>
    </div>
  );
}

function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-white/70 px-6 py-12 text-center">
      <p className="text-base font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}

function MetricPanel({
  title,
  subtitle,
  accent,
  icon,
  metrics,
}: {
  title: string;
  subtitle: string;
  accent: string;
  icon: React.ReactNode;
  metrics: Array<{ label: string; value: string; tone?: "neutral" | "green" | "blue" | "orange" }>;
}) {
  const primaryMetrics = metrics.slice(0, 4);
  const secondaryMetric = metrics.length > 4 ? metrics[4] : undefined;

  return (
    <div className="rounded-[26px] border border-slate-100 bg-white/85 p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px]"
          style={{ backgroundColor: `${accent}14`, color: accent }}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-[18px] font-semibold text-slate-900">{title}</p>
          <p className="mt-2 max-w-[34ch] text-sm leading-7 text-slate-500 sm:text-[15px]">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {primaryMetrics.map((metric) => (
          <QualityMetricTile
            key={metric.label}
            label={metric.label}
            value={metric.value}
            tone={metric.tone ?? "neutral"}
          />
        ))}
      </div>

      {secondaryMetric ? (
        <div className="mt-3">
          <QualityMetricTile
            label={secondaryMetric.label}
            value={secondaryMetric.value}
            tone={secondaryMetric.tone ?? "neutral"}
          />
        </div>
      ) : null}
    </div>
  );
}

function InsightCard({
  title,
  value,
  detail,
  tone,
}: {
  title: string;
  value: string;
  detail: string;
  tone: "green" | "blue" | "orange" | "neutral";
}) {
  return (
    <div className={`rounded-3xl border p-4 ${toneClass(tone)}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] opacity-80">{title}</p>
      <p className="mt-2 text-base font-bold tracking-tight">{value}</p>
      <p className="mt-1 text-sm leading-6 opacity-90">{detail}</p>
    </div>
  );
}

function LanguageCard({ item }: { item: AdminLanguageStat }) {
  const t = useTranslations("Protected.AdminStatsShell");

  return (
    <div className="rounded-3xl border border-slate-100 bg-white/80 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-[0_14px_34px_rgba(35,45,62,0.06)] sm:p-5">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
          <Globe2 className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <p className="text-base font-semibold tracking-tight text-slate-900">{item.label}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-400">{item.code}</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <MiniKpi label={t("languages.users")} value={String(item.users)} />
        <MiniKpi
          label={t("languages.publishedCourses")}
          value={String(item.publishedCourses)}
          tone="orange"
        />
        <MiniKpi
          label={t("languages.caseStudies")}
          value={String(item.publishedCaseStudies)}
          tone="blue"
        />
        <MiniKpi
          label={t("languages.scenarioVariants")}
          value={String(item.availableScenarioVariants)}
          tone="green"
        />
      </div>
    </div>
  );
}

function ScenarioRow({ item }: { item: AdminScenarioStat }) {
  const t = useTranslations("Protected.AdminStatsShell");

  return (
    <div className="relative rounded-3xl border border-slate-100 bg-white/80 p-4 pt-12 transition-all duration-300 hover:border-slate-200 hover:shadow-[0_14px_34px_rgba(35,45,62,0.06)] sm:p-5 sm:pt-12">
      <div className="absolute left-4 top-4">
        <span
          className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${getAreaBadgeClass(item.area)}`}
        >
          {formatArea(item.area, t)}
        </span>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="truncate text-base font-semibold tracking-tight text-slate-900">
            {item.title}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {item.languages.map((language) => (
              <span
                key={language}
                className="rounded-full border border-sky-100 bg-sky-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-sky-700"
              >
                {language}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:min-w-0 xl:grid-cols-4">
          <MiniKpi
            label={t("scenarioPerformance.row.attempts")}
            value={String(item.totalAttempts)}
          />
          <MiniKpi
            label={t("scenarioPerformance.row.completionRate")}
            value={formatPercent(item.completionRate)}
          />
          <MiniKpi
            label={t("scenarioPerformance.row.averageScore")}
            value={formatScore(item.averageScore)}
          />
          <MiniKpi
            label={t("scenarioPerformance.row.variants")}
            value={String(item.availableVariants)}
          />
        </div>
      </div>
    </div>
  );
}

function CourseRow({ item }: { item: AdminCourseStat }) {
  const t = useTranslations("Protected.AdminStatsShell");

  return (
    <div className="relative rounded-3xl border border-slate-100 bg-white/80 p-4 pt-12 transition-all duration-300 hover:border-slate-200 hover:shadow-[0_14px_34px_rgba(35,45,62,0.06)] sm:p-5 sm:pt-12">
      <div className="absolute left-4 top-4">
        <span
          className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${getAreaBadgeClass(item.area)}`}
        >
          {formatArea(item.area, t)}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_120px_140px_140px_140px_120px] lg:items-center">
        <div className="min-w-0">
          <p className="truncate text-base font-semibold tracking-tight text-slate-900">
            {item.title}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:contents">
          <div className="lg:min-w-30">
            <MiniKpi
              label={t("coursePerformance.row.attempts")}
              value={String(item.totalAttempts)}
            />
          </div>
          <div className="lg:min-w-35">
            <MiniKpi
              label={t("coursePerformance.row.completionRate")}
              value={formatPercent(item.completionRate)}
            />
          </div>
          <div className="lg:min-w-35">
            <MiniKpi
              label={t("coursePerformance.row.preQuiz")}
              value={formatScore(item.averagePreQuizScore)}
            />
          </div>
          <div className="lg:min-w-35">
            <MiniKpi
              label={t("coursePerformance.row.postQuiz")}
              value={formatScore(item.averagePostQuizScore)}
            />
          </div>
          <div className="lg:min-w-30">
            <MiniKpi
              label={t("coursePerformance.row.inProgress")}
              value={String(item.inProgress)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityChartSection({
  title,
  subtitle,
  accent,
  valueLabel,
  data,
  chips,
  window,
  onWindowChange,
}: {
  title: string;
  subtitle: string;
  accent: string;
  valueLabel: string;
  data: Array<{ label: string; value: number }>;
  chips: Array<{ label: string; value: string; tone?: "neutral" | "green" | "blue" | "orange" }>;
  window: ActivityWindow;
  onWindowChange: (window: ActivityWindow) => void;
}) {
  return (
    <Surface className="p-4 sm:p-6">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        right={<WindowSelect value={window} onChange={onWindowChange} />}
      />

      <div className="grid gap-4 xl:grid-cols-12">
        <div className="xl:col-span-8 rounded-[26px] border border-slate-100 bg-white/85 p-4">
          <StatsChart accentColor={accent} data={data} height={360} valueLabel={valueLabel} />
        </div>

        <div className="xl:col-span-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 xl:grid-rows-5">
          {chips.map((chip) => (
            <MiniKpi
              key={chip.label}
              label={chip.label}
              value={chip.value}
              tone={chip.tone ?? "neutral"}
            />
          ))}
        </div>
      </div>
    </Surface>
  );
}

export default function AdminStatsShell({ stats }: Props) {
  const t = useTranslations("Protected.AdminStatsShell");
  const [segment, setSegment] = useState<Segment>("summary");
  const [activityWindow, setActivityWindow] = useState<ActivityWindow>("7d");
  const [query, setQuery] = useState("");
  const [scenarioSort, setScenarioSort] = useState<"attempts" | "completion" | "score">("attempts");
  const [courseSort, setCourseSort] = useState<"attempts" | "completion" | "postQuiz">("attempts");

  const insights = useMemo(() => deriveInsights(stats, t), [stats, t]);

  const filteredLanguages = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return stats.languageBreakdown.filter((item) => {
      if (!normalized) return true;
      return (
        item.label.toLowerCase().includes(normalized) ||
        item.code.toLowerCase().includes(normalized)
      );
    });
  }, [query, stats.languageBreakdown]);

  const filteredScenarios = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    const filtered = stats.scenarioBreakdown.filter((item) => {
      if (!normalized) return true;

      return (
        item.title.toLowerCase().includes(normalized) ||
        item.slug.toLowerCase().includes(normalized) ||
        item.area.toLowerCase().includes(normalized) ||
        item.languages.some((language) => language.toLowerCase().includes(normalized))
      );
    });

    const sorted = [...filtered];

    if (scenarioSort === "completion") {
      sorted.sort(
        (a, b) => b.completionRate - a.completionRate || b.totalAttempts - a.totalAttempts,
      );
    } else if (scenarioSort === "score") {
      sorted.sort((a, b) => (b.averageScore ?? -1) - (a.averageScore ?? -1));
    } else {
      sorted.sort(
        (a, b) => b.totalAttempts - a.totalAttempts || b.completionRate - a.completionRate,
      );
    }

    return sorted;
  }, [query, scenarioSort, stats.scenarioBreakdown]);

  const filteredCourses = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    const filtered = stats.courseBreakdown.filter((item) => {
      if (!normalized) return true;

      return (
        item.title.toLowerCase().includes(normalized) ||
        item.slug.toLowerCase().includes(normalized) ||
        item.area.toLowerCase().includes(normalized)
      );
    });

    const sorted = [...filtered];

    if (courseSort === "completion") {
      sorted.sort(
        (a, b) => b.completionRate - a.completionRate || b.totalAttempts - a.totalAttempts,
      );
    } else if (courseSort === "postQuiz") {
      sorted.sort((a, b) => (b.averagePostQuizScore ?? -1) - (a.averagePostQuizScore ?? -1));
    } else {
      sorted.sort(
        (a, b) => b.totalAttempts - a.totalAttempts || b.completionRate - a.completionRate,
      );
    }

    return sorted;
  }, [courseSort, query, stats.courseBreakdown]);

  const scenarioSummary = useMemo(() => summarizeScenarios(filteredScenarios), [filteredScenarios]);

  const courseSummary = useMemo(() => summarizeCourses(filteredCourses), [filteredCourses]);

  const scenarioChart = useMemo(() => {
    const windowStats = getScenarioWindowStats(stats, activityWindow);

    return {
      title: t("scenarioActivity.title"),
      subtitle: t("scenarioActivity.subtitle"),
      accent: ESG_colors.GREEN,
      valueLabel: t("scenarioActivity.valueLabel"),
      data: getScenarioSeries(stats, activityWindow),
      chips: [
        {
          label: t("scenarioActivity.events"),
          value: String(getScenarioEvents(stats, activityWindow)),
          tone: "green" as const,
        },
        {
          label: t("scenarioActivity.completionRate"),
          value: formatPercent(windowStats.completionRate),
          tone: "green" as const,
        },
        {
          label: t("scenarioActivity.averageScore"),
          value: formatScore(windowStats.averageScore),
          tone: "green" as const,
        },
        {
          label: t("scenarioActivity.passedCompleted"),
          value: String(windowStats.completedLikeTotal),
          tone: "green" as const,
        },
        {
          label: t("scenarioActivity.failed"),
          value: String(windowStats.failed),
          tone: "green" as const,
        },
      ],
    };
  }, [activityWindow, stats, t]);

  const courseChart = useMemo(() => {
    const windowStats = getCurriculumWindowStats(stats, activityWindow);

    return {
      title: t("curriculumActivity.title"),
      subtitle: t("curriculumActivity.subtitle"),
      accent: ESG_colors.ORANGE,
      valueLabel: t("curriculumActivity.valueLabel"),
      data: getCurriculumSeries(stats, activityWindow),
      chips: [
        {
          label: t("curriculumActivity.events"),
          value: String(getCurriculumEvents(stats, activityWindow)),
          tone: "orange" as const,
        },
        {
          label: t("curriculumActivity.completionRate"),
          value: formatPercent(windowStats.completionRate),
          tone: "orange" as const,
        },
        {
          label: t("curriculumActivity.averagePreQuiz"),
          value: formatScore(windowStats.averagePreQuizScore),
          tone: "orange" as const,
        },
        {
          label: t("curriculumActivity.averagePostQuiz"),
          value: formatScore(windowStats.averagePostQuizScore),
          tone: "orange" as const,
        },
        {
          label: t("curriculumActivity.inProgress"),
          value: String(windowStats.inProgress),
          tone: "orange" as const,
        },
      ],
    };
  }, [activityWindow, stats, t]);

  const eportfolioChart = useMemo(() => {
    const windowStats = getEportfolioWindowStats(stats, activityWindow);

    return {
      title: t("eportfolioActivity.title"),
      subtitle: t("eportfolioActivity.subtitle"),
      accent: ESG_colors.BLUE,
      valueLabel: t("eportfolioActivity.valueLabel"),
      data: getEportfolioSeries(stats, activityWindow),
      chips: [
        {
          label: t("eportfolioActivity.events"),
          value: String(getEportfolioEvents(stats, activityWindow)),
          tone: "blue" as const,
        },
        {
          label: t("eportfolioActivity.completionRate"),
          value: formatPercent(windowStats.completionRate),
          tone: "blue" as const,
        },
        {
          label: t("eportfolioActivity.published"),
          value: String(windowStats.published),
          tone: "blue" as const,
        },
        {
          label: t("eportfolioActivity.activeUsers"),
          value: String(windowStats.activeUsers),
          tone: "blue" as const,
        },
      ],
    };
  }, [activityWindow, stats, t]);

  return (
    <main className="relative min-h-screen bg-[#f5f5f3] pb-20 transition-all duration-300">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(11,156,114,0.07),transparent_22%),radial-gradient(circle_at_84%_14%,rgba(13,127,194,0.07),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(245,245,243,1)_100%)]" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={STAGGER}
        className="relative mx-auto max-w-360 px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pt-10 transition-all duration-300"
      >
        <motion.header
          variants={FADE_UP}
          className="mb-6 flex flex-col gap-4 px-1 md:mb-8 md:flex-row md:items-center md:justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/60 bg-white text-[#31425a] shadow-sm">
              <LayoutDashboard className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#31425a] sm:text-3xl">
                {t("header.title")}
              </h1>
              <p className="text-[#667180]">{t("header.subtitle")}</p>
            </div>
          </div>
        </motion.header>

        <div className="flex gap-2 overflow-x-auto rounded-3xl border border-white/70 bg-[#f8fafc]/80 p-2 shadow-sm [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <SegmentButton
            active={segment === "summary"}
            icon={<TrendingUp className="h-4 w-4" />}
            label={t("segments.summary")}
            onClick={() => {
              setSegment("summary");
            }}
          />
          <SegmentButton
            active={segment === "languages"}
            icon={<Languages className="h-4 w-4" />}
            label={t("segments.languages")}
            onClick={() => {
              setSegment("languages");
            }}
          />
          <SegmentButton
            active={segment === "scenarios"}
            icon={<PlayCircle className="h-4 w-4" />}
            label={t("segments.scenarios")}
            onClick={() => {
              setSegment("scenarios");
            }}
          />
          <SegmentButton
            active={segment === "courses"}
            icon={<BookOpen className="h-4 w-4" />}
            label={t("segments.courses")}
            onClick={() => {
              setSegment("courses");
            }}
          />
          <SegmentButton
            active={segment === "eportfolio"}
            icon={<FolderOpen className="h-4 w-4" />}
            label={t("segments.eportfolio")}
            onClick={() => {
              setSegment("eportfolio");
            }}
          />
        </div>

        {segment === "summary" && (
          <>
            <Surface className="mt-8 p-4 sm:p-6">
              <SectionHeader title={t("glance.title")} subtitle={t("glance.subtitle")} />

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <CompactHeroStat
                  label={t("glance.allUsers.label")}
                  value={stats.users.total}
                  hint={t("glance.allUsers.hint")}
                  icon={<Users className="h-5 w-5" />}
                  accent="#31425a"
                />
                <CompactHeroStat
                  label={t("glance.activeUsers.label")}
                  value={stats.activity.activeUsersLast7Days}
                  hint={t("glance.activeUsers.hint")}
                  icon={<Activity className="h-5 w-5" />}
                  accent={ESG_colors.BLUE}
                />
                <CompactHeroStat
                  label={t("glance.scenarioCompletion.label")}
                  value={formatPercent(stats.scenarioAttempts.completionRate)}
                  hint={t("glance.scenarioCompletion.hint")}
                  icon={<PlayCircle className="h-5 w-5" />}
                  accent={ESG_colors.GREEN}
                />
                <CompactHeroStat
                  label={t("glance.curriculumCompletion.label")}
                  value={formatPercent(stats.curriculum.completionRate)}
                  hint={t("glance.curriculumCompletion.hint")}
                  icon={<GraduationCap className="h-5 w-5" />}
                  accent={ESG_colors.ORANGE}
                />
              </div>
            </Surface>

            <section className="mt-8 grid gap-4 xl:grid-cols-12">
              <Surface className="xl:col-span-6 p-6">
                <SectionHeader
                  title={t("platformStructure.title")}
                  subtitle={t("platformStructure.subtitle")}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-3xl border border-slate-100 bg-white/80 p-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {t("platformStructure.roleDistribution")}
                    </p>
                    <div className="mt-4 grid gap-3">
                      <MiniKpi
                        label={t("platformStructure.educators")}
                        value={String(stats.users.educators)}
                      />
                      <MiniKpi
                        label={t("platformStructure.students")}
                        value={String(stats.users.students)}
                      />
                      <MiniKpi
                        label={t("platformStructure.admins")}
                        value={String(stats.users.admins)}
                      />
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-100 bg-white/80 p-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {t("platformStructure.publishedResources")}
                    </p>
                    <div className="mt-4 grid gap-3">
                      <MiniKpi
                        label={t("platformStructure.courses")}
                        value={String(stats.content.publishedCourses)}
                      />
                      <MiniKpi
                        label={t("platformStructure.caseStudies")}
                        value={String(stats.content.publishedCaseStudies)}
                      />
                      <MiniKpi
                        label={t("platformStructure.scenarios")}
                        value={String(stats.content.publishedScenarios)}
                      />
                    </div>
                  </div>
                </div>
              </Surface>

              <Surface className="xl:col-span-6 p-6">
                <SectionHeader title={t("highlights.title")} subtitle={t("highlights.subtitle")} />

                <div className="space-y-3">
                  {insights.map((item) => (
                    <InsightCard
                      key={item.title}
                      title={item.title}
                      value={item.value}
                      detail={item.detail}
                      tone={item.tone}
                    />
                  ))}
                </div>
              </Surface>
            </section>

            <section className="mt-8">
              <Surface className="p-6">
                <SectionHeader
                  title={t("learningQuality.title")}
                  subtitle={t("learningQuality.subtitle")}
                />

                <div className="grid gap-4 xl:grid-cols-3">
                  <MetricPanel
                    title={t("learningQuality.scenarioSimulator.title")}
                    subtitle={t("learningQuality.scenarioSimulator.subtitle")}
                    accent={ESG_colors.GREEN}
                    icon={<PlayCircle className="h-5 w-5" />}
                    metrics={[
                      {
                        label: t("learningQuality.completionRate"),
                        value: formatPercent(stats.scenarioAttempts.completionRate),
                      },
                      {
                        label: t("learningQuality.averageScore"),
                        value: formatScore(stats.scenarioAttempts.averageScore),
                      },
                      {
                        label: t("learningQuality.passed"),
                        value: String(stats.scenarioAttempts.passed),
                      },
                      {
                        label: t("learningQuality.failed"),
                        value: String(stats.scenarioAttempts.failed),
                      },
                    ]}
                  />

                  <MetricPanel
                    title={t("learningQuality.curriculum.title")}
                    subtitle={t("learningQuality.curriculum.subtitle")}
                    accent={ESG_colors.ORANGE}
                    icon={<GraduationCap className="h-5 w-5" />}
                    metrics={[
                      {
                        label: t("learningQuality.completionRate"),
                        value: formatPercent(stats.curriculum.completionRate),
                      },
                      {
                        label: t("learningQuality.avgPreQuiz"),
                        value: formatScore(stats.curriculum.averagePreQuizScore),
                      },
                      {
                        label: t("learningQuality.avgPostQuiz"),
                        value: formatScore(stats.curriculum.averagePostQuizScore),
                      },
                      {
                        label: t("learningQuality.inProgress"),
                        value: String(stats.curriculum.inProgress),
                      },
                    ]}
                  />

                  <MetricPanel
                    title={t("learningQuality.eportfolio.title")}
                    subtitle={t("learningQuality.eportfolio.subtitle")}
                    accent={ESG_colors.BLUE}
                    icon={<FolderOpen className="h-5 w-5" />}
                    metrics={[
                      {
                        label: t("learningQuality.completionRate"),
                        value: formatPercent(stats.eportfolio.completionRate),
                      },
                      {
                        label: t("learningQuality.published"),
                        value: String(stats.content.publishedCaseStudies),
                      },
                      {
                        label: t("learningQuality.active7d"),
                        value: String(stats.activity.activeUsersLast7Days),
                      },
                    ]}
                  />
                </div>
              </Surface>
            </section>
          </>
        )}

        {segment === "languages" && (
          <Surface className="mt-8 p-4 sm:p-6">
            <SectionHeader title={t("languages.title")} subtitle={t("languages.subtitle")} />
            <div className="grid gap-4 xl:grid-cols-3">
              {filteredLanguages.map((item) => (
                <LanguageCard key={item.code} item={item} />
              ))}
            </div>
          </Surface>
        )}

        {segment === "scenarios" && (
          <>
            <section className="mt-8">
              <ActivityChartSection
                title={scenarioChart.title}
                subtitle={scenarioChart.subtitle}
                accent={scenarioChart.accent}
                valueLabel={scenarioChart.valueLabel}
                data={scenarioChart.data}
                chips={scenarioChart.chips}
                window={activityWindow}
                onWindowChange={setActivityWindow}
              />
            </section>

            <Surface className="mt-8 p-4 sm:p-6">
              <SectionHeader
                title={t("scenarioPerformance.title")}
                subtitle={t("scenarioPerformance.subtitle")}
                right={
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-sm">
                    {t("scenarioPerformance.results", { count: filteredScenarios.length })}
                  </div>
                }
              />

              <div className="mb-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_240px]">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                    }}
                    placeholder={t("scenarioPerformance.searchPlaceholder")}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
                  />
                </div>

                <SortControl
                  value={scenarioSort}
                  onChange={(value) => {
                    setScenarioSort(value as "attempts" | "completion" | "score");
                  }}
                  options={[
                    { value: "attempts", label: t("scenarioPerformance.sort.attempts") },
                    { value: "completion", label: t("scenarioPerformance.sort.completion") },
                    { value: "score", label: t("scenarioPerformance.sort.score") },
                  ]}
                />
              </div>

              <div className="mb-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <MiniKpi
                  label={t("scenarioPerformance.summary.results")}
                  value={String(filteredScenarios.length)}
                />
                <MiniKpi
                  label={t("scenarioPerformance.summary.attempts")}
                  value={String(scenarioSummary.attempts)}
                />
                <MiniKpi
                  label={t("scenarioPerformance.summary.averageCompletion")}
                  value={
                    scenarioSummary.avgCompletion === null
                      ? "—"
                      : formatPercent(scenarioSummary.avgCompletion)
                  }
                />
                <MiniKpi
                  label={t("scenarioPerformance.summary.averageScore")}
                  value={formatScore(scenarioSummary.avgScore)}
                />
              </div>

              {filteredScenarios.length === 0 ? (
                <EmptyState
                  title={t("scenarioPerformance.empty.title")}
                  subtitle={t("scenarioPerformance.empty.subtitle")}
                />
              ) : (
                <div className="space-y-3">
                  {filteredScenarios.map((item) => (
                    <ScenarioRow key={item.id} item={item} />
                  ))}
                </div>
              )}
            </Surface>

            <Surface className="mt-8 p-4 sm:p-6">
              <SectionHeader
                title={t("scenarioAttempts.title")}
                subtitle={t("scenarioAttempts.subtitle")}
                right={
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-sm">
                    {t("scenarioAttempts.records", { count: stats.scenarioAttemptRows.length })}
                  </div>
                }
              />

              <UserScenarioAttemptsTable rows={stats.scenarioAttemptRows} />
            </Surface>
          </>
        )}

        {segment === "courses" && (
          <>
            <section className="mt-8">
              <ActivityChartSection
                title={courseChart.title}
                subtitle={courseChart.subtitle}
                accent={courseChart.accent}
                valueLabel={courseChart.valueLabel}
                data={courseChart.data}
                chips={courseChart.chips}
                window={activityWindow}
                onWindowChange={setActivityWindow}
              />
            </section>

            <Surface className="mt-8 p-4 sm:p-6">
              <SectionHeader
                title={t("coursePerformance.title")}
                subtitle={t("coursePerformance.subtitle")}
                right={
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-sm">
                    {t("coursePerformance.results", { count: filteredCourses.length })}
                  </div>
                }
              />

              <div className="mb-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_240px]">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                    }}
                    placeholder={t("coursePerformance.searchPlaceholder")}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
                  />
                </div>

                <SortControl
                  value={courseSort}
                  onChange={(value) => {
                    setCourseSort(value as "attempts" | "completion" | "postQuiz");
                  }}
                  options={[
                    { value: "attempts", label: t("coursePerformance.sort.attempts") },
                    { value: "completion", label: t("coursePerformance.sort.completion") },
                    { value: "postQuiz", label: t("coursePerformance.sort.postQuiz") },
                  ]}
                />
              </div>

              <div className="mb-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <MiniKpi
                  label={t("coursePerformance.summary.results")}
                  value={String(filteredCourses.length)}
                />
                <MiniKpi
                  label={t("coursePerformance.summary.attempts")}
                  value={String(courseSummary.attempts)}
                />
                <MiniKpi
                  label={t("coursePerformance.summary.averageCompletion")}
                  value={
                    courseSummary.avgCompletion === null
                      ? "—"
                      : formatPercent(courseSummary.avgCompletion)
                  }
                />
                <MiniKpi
                  label={t("coursePerformance.summary.averagePostQuiz")}
                  value={formatScore(courseSummary.avgPostQuiz)}
                />
              </div>

              {filteredCourses.length === 0 ? (
                <EmptyState
                  title={t("coursePerformance.empty.title")}
                  subtitle={t("coursePerformance.empty.subtitle")}
                />
              ) : (
                <div className="space-y-3">
                  {filteredCourses.map((item) => (
                    <CourseRow key={item.id} item={item} />
                  ))}
                </div>
              )}
            </Surface>

            <Surface className="mt-8 p-4 sm:p-6">
              <SectionHeader
                title={t("curriculumAttempts.title")}
                subtitle={t("curriculumAttempts.subtitle")}
                right={
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-sm">
                    {t("curriculumAttempts.records", { count: stats.curriculumAttemptRows.length })}
                  </div>
                }
              />

              <UserCurriculumAttemptsTable rows={stats.curriculumAttemptRows} />
            </Surface>
          </>
        )}

        {segment === "eportfolio" && (
          <>
            <section className="mt-8">
              <ActivityChartSection
                title={eportfolioChart.title}
                subtitle={eportfolioChart.subtitle}
                accent={eportfolioChart.accent}
                valueLabel={eportfolioChart.valueLabel}
                data={eportfolioChart.data}
                chips={eportfolioChart.chips}
                window={activityWindow}
                onWindowChange={setActivityWindow}
              />
            </section>

            <Surface className="mt-8 p-4 sm:p-6">
              <SectionHeader
                title={t("eportfolioProgress.title")}
                subtitle={t("eportfolioProgress.subtitle")}
                right={
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-sm">
                    {t("eportfolioProgress.records", {
                      count: stats.eportfolioProgressRows.length,
                    })}
                  </div>
                }
              />

              <UserEportfolioProgressTable rows={stats.eportfolioProgressRows} />
            </Surface>
          </>
        )}
      </motion.div>
    </main>
  );
}
