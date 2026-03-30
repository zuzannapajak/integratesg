"use client";

import StatsChart from "@/components/dashboard/stats-chart";
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

function formatArea(area: string) {
  switch (area) {
    case "environmental":
      return "Environmental";
    case "social":
      return "Social";
    case "governance":
      return "Governance";
    default:
      return "Cross-cutting";
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

function average(values: number[]) {
  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
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

function deriveInsights(stats: BasicAdminStats) {
  const scenarioLeader = [...stats.scenarioBreakdown].sort(
    (a, b) => b.totalAttempts - a.totalAttempts,
  )[0];

  const courseLeader = [...stats.courseBreakdown].sort(
    (a, b) => b.completionRate - a.completionRate,
  )[0];

  const languageLeader = [...stats.languageBreakdown].sort((a, b) => b.users - a.users)[0];

  return [
    {
      title: "Most active scenario",
      value: scenarioLeader.title,
      detail: `${scenarioLeader.totalAttempts} attempts · ${formatPercent(
        scenarioLeader.completionRate,
      )} completion`,
      tone: "green" as const,
    },
    {
      title: "Best completion result",
      value: courseLeader.title,
      detail: `${formatPercent(courseLeader.completionRate)} completion · ${formatScore(
        courseLeader.averagePostQuizScore,
      )} average post-quiz score`,
      tone: "orange" as const,
    },
    {
      title: "Largest language cohort",
      value: languageLeader.label,
      detail: `${languageLeader.users} users · ${languageLeader.availableScenarioVariants} scenario variants`,
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
      className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
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
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const options: Array<{ value: ActivityWindow; label: string }> = [
    { value: "24h", label: "Last 24 hours" },
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
  ];

  const activeLabel = options.find((option) => option.value === value)?.label ?? "Last 7 days";

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
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((current) => !current);
        }}
        className="inline-flex h-12 min-w-55 items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
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
    <div className="relative inline-flex h-12 items-center rounded-2xl border border-slate-200 bg-white px-3 pr-10 text-sm shadow-sm transition hover:border-slate-300">
      <Filter className="mr-2 h-4 w-4 text-slate-400" />
      <select
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        className="appearance-none bg-transparent pr-6 font-medium text-slate-700 outline-none"
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
      className="group relative overflow-hidden rounded-3xl border border-white/80 bg-white/92 p-4 shadow-[0_14px_34px_rgba(35,45,62,0.07)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(35,45,62,0.09)]"
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
    <div className="rounded-[26px] border border-slate-100 bg-white/85 p-6">
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
  return (
    <div className="rounded-3xl border border-slate-100 bg-white/80 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-[0_14px_34px_rgba(35,45,62,0.06)]">
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
        <MiniKpi label="Users" value={String(item.users)} />
        <MiniKpi label="Published courses" value={String(item.publishedCourses)} tone="orange" />
        <MiniKpi label="Case studies" value={String(item.publishedCaseStudies)} tone="blue" />
        <MiniKpi
          label="Scenario variants"
          value={String(item.availableScenarioVariants)}
          tone="green"
        />
      </div>
    </div>
  );
}

function ScenarioRow({ item }: { item: AdminScenarioStat }) {
  return (
    <div className="relative rounded-3xl border border-slate-100 bg-white/80 p-4 pt-12 transition-all duration-300 hover:border-slate-200 hover:shadow-[0_14px_34px_rgba(35,45,62,0.06)]">
      <div className="absolute left-4 top-4">
        <span
          className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${getAreaBadgeClass(item.area)}`}
        >
          {formatArea(item.area)}
        </span>
      </div>

      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
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

        <div className="grid gap-3 sm:grid-cols-2 xl:min-w-105 xl:grid-cols-4">
          <MiniKpi label="Attempts" value={String(item.totalAttempts)} />
          <MiniKpi label="Completion rate" value={formatPercent(item.completionRate)} />
          <MiniKpi label="Average score" value={formatScore(item.averageScore)} />
          <MiniKpi label="Variants" value={String(item.availableVariants)} />
        </div>
      </div>
    </div>
  );
}

function CourseRow({ item }: { item: AdminCourseStat }) {
  return (
    <div className="relative rounded-3xl border border-slate-100 bg-white/80 p-4 pt-12 transition-all duration-300 hover:border-slate-200 hover:shadow-[0_14px_34px_rgba(35,45,62,0.06)]">
      <div className="absolute left-4 top-4">
        <span
          className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${getAreaBadgeClass(item.area)}`}
        >
          {formatArea(item.area)}
        </span>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_120px_140px_140px_140px_120px] xl:items-center">
        <div className="min-w-0">
          <p className="truncate text-base font-semibold tracking-tight text-slate-900">
            {item.title}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 xl:contents">
          <div className="xl:min-w-30">
            <MiniKpi label="Attempts" value={String(item.totalAttempts)} />
          </div>
          <div className="xl:min-w-35">
            <MiniKpi label="Completion rate" value={formatPercent(item.completionRate)} />
          </div>
          <div className="xl:min-w-35">
            <MiniKpi label="Pre-quiz" value={formatScore(item.averagePreQuizScore)} />
          </div>
          <div className="xl:min-w-35">
            <MiniKpi label="Post-quiz" value={formatScore(item.averagePostQuizScore)} />
          </div>
          <div className="xl:min-w-30">
            <MiniKpi label="In progress" value={String(item.inProgress)} />
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
    <Surface className="p-6">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        right={<WindowSelect value={window} onChange={onWindowChange} />}
      />

      <div className="grid gap-4 xl:grid-cols-12">
        <div className="xl:col-span-8 rounded-[26px] border border-slate-100 bg-white/85 p-4">
          <StatsChart accentColor={accent} data={data} height={420} valueLabel={valueLabel} />
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
  const [segment, setSegment] = useState<Segment>("summary");
  const [activityWindow, setActivityWindow] = useState<ActivityWindow>("7d");
  const [query, setQuery] = useState("");
  const [scenarioSort, setScenarioSort] = useState<"attempts" | "completion" | "score">("attempts");
  const [courseSort, setCourseSort] = useState<"attempts" | "completion" | "postQuiz">("attempts");

  const insights = useMemo(() => deriveInsights(stats), [stats]);

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

  const scenarioSummary = useMemo(() => {
    const avgCompletion = average(filteredScenarios.map((item) => item.completionRate));
    const avgScore = average(
      filteredScenarios
        .map((item) => item.averageScore)
        .filter((value): value is number => value !== null),
    );

    return {
      attempts: filteredScenarios.reduce((sum, item) => sum + item.totalAttempts, 0),
      variants: filteredScenarios.reduce((sum, item) => sum + item.availableVariants, 0),
      avgCompletion,
      avgScore,
    };
  }, [filteredScenarios]);

  const courseSummary = useMemo(() => {
    const avgCompletion = average(filteredCourses.map((item) => item.completionRate));
    const avgPostQuiz = average(
      filteredCourses
        .map((item) => item.averagePostQuizScore)
        .filter((value): value is number => value !== null),
    );

    return {
      attempts: filteredCourses.reduce((sum, item) => sum + item.totalAttempts, 0),
      inProgress: filteredCourses.reduce((sum, item) => sum + item.inProgress, 0),
      avgCompletion,
      avgPostQuiz,
    };
  }, [filteredCourses]);

  const scenarioChart = useMemo(() => {
    const windowStats = getScenarioWindowStats(stats, activityWindow);

    return {
      title: "Scenario simulator activity",
      subtitle: "Track simulation usage, completion quality, and outcome patterns in one view.",
      accent: ESG_colors.GREEN,
      valueLabel: "Scenario events",
      data: getScenarioSeries(stats, activityWindow),
      chips: [
        {
          label: "Events",
          value: String(getScenarioEvents(stats, activityWindow)),
          tone: "green" as const,
        },
        {
          label: "Completion rate",
          value: formatPercent(windowStats.completionRate),
          tone: "green" as const,
        },
        {
          label: "Average score",
          value: formatScore(windowStats.averageScore),
          tone: "green" as const,
        },
        {
          label: "Passed / completed",
          value: String(windowStats.completedLikeTotal),
          tone: "green" as const,
        },
        {
          label: "Failed",
          value: String(windowStats.failed),
          tone: "green" as const,
        },
      ],
    };
  }, [activityWindow, stats]);

  const courseChart = useMemo(() => {
    const windowStats = getCurriculumWindowStats(stats, activityWindow);

    return {
      title: "Curriculum activity",
      subtitle:
        "Monitor module engagement, completion progression, and learning assessment trends.",
      accent: ESG_colors.ORANGE,
      valueLabel: "Curriculum events",
      data: getCurriculumSeries(stats, activityWindow),
      chips: [
        {
          label: "Events",
          value: String(getCurriculumEvents(stats, activityWindow)),
          tone: "orange" as const,
        },
        {
          label: "Completion rate",
          value: formatPercent(windowStats.completionRate),
          tone: "orange" as const,
        },
        {
          label: "Average pre-quiz",
          value: formatScore(windowStats.averagePreQuizScore),
          tone: "orange" as const,
        },
        {
          label: "Average post-quiz",
          value: formatScore(windowStats.averagePostQuizScore),
          tone: "orange" as const,
        },
        {
          label: "In progress",
          value: String(windowStats.inProgress),
          tone: "orange" as const,
        },
      ],
    };
  }, [activityWindow, stats]);

  const eportfolioChart = useMemo(() => {
    const windowStats = getEportfolioWindowStats(stats, activityWindow);

    return {
      title: "ePortfolio activity",
      subtitle:
        "See case-study engagement, completions, and participation across the portfolio experience.",
      accent: ESG_colors.BLUE,
      valueLabel: "ePortfolio events",
      data: getEportfolioSeries(stats, activityWindow),
      chips: [
        {
          label: "Events",
          value: String(getEportfolioEvents(stats, activityWindow)),
          tone: "blue" as const,
        },
        {
          label: "Completion rate",
          value: formatPercent(windowStats.completionRate),
          tone: "blue" as const,
        },
        {
          label: "Published",
          value: String(windowStats.published),
          tone: "blue" as const,
        },
        {
          label: "Active users",
          value: String(windowStats.activeUsers),
          tone: "blue" as const,
        },
      ],
    };
  }, [activityWindow, stats]);

  return (
    <main className="relative min-h-screen bg-[#f5f5f3] pb-20 transition-all duration-300">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(11,156,114,0.07),transparent_22%),radial-gradient(circle_at_84%_14%,rgba(13,127,194,0.07),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(245,245,243,1)_100%)]" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={STAGGER}
        className="relative mx-auto max-w-360 px-4 pt-10 sm:px-6 lg:px-8 transition-all duration-300"
      >
        <motion.header
          variants={FADE_UP}
          className="mb-8 flex flex-col gap-4 px-1 md:flex-row md:items-center md:justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/60 bg-white text-[#31425a] shadow-sm">
              <LayoutDashboard className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#31425a]">Statistics</h1>
              <p className="text-[#667180]">
                A clear overview of platform adoption, learning progress, and content performance
              </p>
            </div>
          </div>
        </motion.header>

        <div className="flex flex-wrap items-center gap-2 rounded-3xl border border-white/70 bg-[#f8fafc]/80 p-2 shadow-sm">
          <SegmentButton
            active={segment === "summary"}
            icon={<TrendingUp className="h-4 w-4" />}
            label="Summary"
            onClick={() => {
              setSegment("summary");
            }}
          />
          <SegmentButton
            active={segment === "languages"}
            icon={<Languages className="h-4 w-4" />}
            label="Languages"
            onClick={() => {
              setSegment("languages");
            }}
          />
          <SegmentButton
            active={segment === "scenarios"}
            icon={<PlayCircle className="h-4 w-4" />}
            label="Scenarios"
            onClick={() => {
              setSegment("scenarios");
            }}
          />
          <SegmentButton
            active={segment === "courses"}
            icon={<BookOpen className="h-4 w-4" />}
            label="Courses"
            onClick={() => {
              setSegment("courses");
            }}
          />
          <SegmentButton
            active={segment === "eportfolio"}
            icon={<FolderOpen className="h-4 w-4" />}
            label="ePortfolio"
            onClick={() => {
              setSegment("eportfolio");
            }}
          />
        </div>

        {segment === "summary" && (
          <>
            <Surface className="mt-8 p-6">
              <SectionHeader
                title="At a glance"
                subtitle="Your core platform indicators at a glance, designed for fast executive review."
              />

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <CompactHeroStat
                  label="All users"
                  value={stats.users.total}
                  hint="Registered accounts across students, educators, and administrators."
                  icon={<Users className="h-5 w-5" />}
                  accent="#31425a"
                />
                <CompactHeroStat
                  label="Active users"
                  value={stats.activity.activeUsersLast7Days}
                  hint="Users with tracked activity in the last 7 days."
                  icon={<Activity className="h-5 w-5" />}
                  accent={ESG_colors.BLUE}
                />
                <CompactHeroStat
                  label="Scenario completion"
                  value={formatPercent(stats.scenarioAttempts.completionRate)}
                  hint="Share of scenario attempts that reached a successful completed state."
                  icon={<PlayCircle className="h-5 w-5" />}
                  accent={ESG_colors.GREEN}
                />
                <CompactHeroStat
                  label="Curriculum completion"
                  value={formatPercent(stats.curriculum.completionRate)}
                  hint="Share of curriculum attempts completed by learners."
                  icon={<GraduationCap className="h-5 w-5" />}
                  accent={ESG_colors.ORANGE}
                />
              </div>
            </Surface>

            <section className="mt-8 grid gap-4 xl:grid-cols-12">
              <Surface className="xl:col-span-6 p-6">
                <SectionHeader
                  title="Platform structure"
                  subtitle="A compact view of role distribution and published learning resources."
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-3xl border border-slate-100 bg-white/80 p-4">
                    <p className="text-sm font-semibold text-slate-900">Role distribution</p>
                    <div className="mt-4 grid gap-3">
                      <MiniKpi label="Educators" value={String(stats.users.educators)} />
                      <MiniKpi label="Students" value={String(stats.users.students)} />
                      <MiniKpi label="Admins" value={String(stats.users.admins)} />
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-100 bg-white/80 p-4">
                    <p className="text-sm font-semibold text-slate-900">Published resources</p>
                    <div className="mt-4 grid gap-3">
                      <MiniKpi label="Courses" value={String(stats.content.publishedCourses)} />
                      <MiniKpi
                        label="Case studies"
                        value={String(stats.content.publishedCaseStudies)}
                      />
                      <MiniKpi label="Scenarios" value={String(stats.content.publishedScenarios)} />
                    </div>
                  </div>
                </div>
              </Surface>

              <Surface className="xl:col-span-6 p-6">
                <SectionHeader
                  title="Highlights"
                  subtitle="Key signals that help identify the strongest areas of learner activity and adoption."
                />

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
                  title="Learning quality"
                  subtitle="Completion and assessment quality grouped by experience type."
                />

                <div className="grid gap-4 xl:grid-cols-3">
                  <MetricPanel
                    title="Scenario simulator"
                    subtitle="High-level outcome and completion quality across all attempts."
                    accent={ESG_colors.GREEN}
                    icon={<PlayCircle className="h-5 w-5" />}
                    metrics={[
                      {
                        label: "Completion rate",
                        value: formatPercent(stats.scenarioAttempts.completionRate),
                      },
                      {
                        label: "Average score",
                        value: formatScore(stats.scenarioAttempts.averageScore),
                      },
                      {
                        label: "Passed",
                        value: String(stats.scenarioAttempts.passed),
                      },
                      {
                        label: "Failed",
                        value: String(stats.scenarioAttempts.failed),
                      },
                    ]}
                  />

                  <MetricPanel
                    title="Curriculum"
                    subtitle="Progression and assessment quality across all curriculum modules."
                    accent={ESG_colors.ORANGE}
                    icon={<GraduationCap className="h-5 w-5" />}
                    metrics={[
                      {
                        label: "Completion rate",
                        value: formatPercent(stats.curriculum.completionRate),
                      },
                      {
                        label: "Avg pre-quiz",
                        value: formatScore(stats.curriculum.averagePreQuizScore),
                      },
                      {
                        label: "Avg post-quiz",
                        value: formatScore(stats.curriculum.averagePostQuizScore),
                      },
                      {
                        label: "In progress",
                        value: String(stats.curriculum.inProgress),
                      },
                    ]}
                  />

                  <MetricPanel
                    title="ePortfolio"
                    subtitle="Case-study completion and participation signals."
                    accent={ESG_colors.BLUE}
                    icon={<FolderOpen className="h-5 w-5" />}
                    metrics={[
                      {
                        label: "Completion rate",
                        value: formatPercent(stats.eportfolio.completionRate),
                      },
                      {
                        label: "Published",
                        value: String(stats.content.publishedCaseStudies),
                      },
                      {
                        label: "Active / 7 days",
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
          <Surface className="mt-8 p-6">
            <SectionHeader
              title="Language coverage"
              subtitle="Review adoption and content availability across supported language groups."
            />
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

            <Surface className="mt-8 p-6">
              <SectionHeader
                title="Scenario performance"
                subtitle="Search, compare, and sort scenarios by adoption, completion, and score."
                right={
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-sm">
                    {filteredScenarios.length} results
                  </div>
                }
              />

              <div className="mb-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_260px]">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                    }}
                    placeholder="Search by scenario title, slug, language, or ESG area..."
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
                  />
                </div>

                <SortControl
                  value={scenarioSort}
                  onChange={(value) => {
                    setScenarioSort(value as "attempts" | "completion" | "score");
                  }}
                  options={[
                    { value: "attempts", label: "Sort by attempts" },
                    { value: "completion", label: "Sort by completion rate" },
                    { value: "score", label: "Sort by average score" },
                  ]}
                />
              </div>

              <div className="mb-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <MiniKpi label="Results" value={String(filteredScenarios.length)} />
                <MiniKpi label="Attempts" value={String(scenarioSummary.attempts)} />
                <MiniKpi
                  label="Average completion"
                  value={
                    scenarioSummary.avgCompletion === null
                      ? "—"
                      : formatPercent(scenarioSummary.avgCompletion)
                  }
                />
                <MiniKpi label="Average score" value={formatScore(scenarioSummary.avgScore)} />
              </div>

              {filteredScenarios.length === 0 ? (
                <EmptyState
                  title="No scenarios matched your search"
                  subtitle="Try a different title, slug, language, or ESG area."
                />
              ) : (
                <div className="space-y-3">
                  {filteredScenarios.map((item) => (
                    <ScenarioRow key={item.id} item={item} />
                  ))}
                </div>
              )}
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

            <Surface className="mt-8 p-6">
              <SectionHeader
                title="Course performance"
                subtitle="Search, compare, and sort curriculum modules by engagement and learning outcomes."
                right={
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-sm">
                    {filteredCourses.length} results
                  </div>
                }
              />

              <div className="mb-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_260px]">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                    }}
                    placeholder="Search by course title, slug, or ESG area..."
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
                  />
                </div>

                <SortControl
                  value={courseSort}
                  onChange={(value) => {
                    setCourseSort(value as "attempts" | "completion" | "postQuiz");
                  }}
                  options={[
                    { value: "attempts", label: "Sort by attempts" },
                    { value: "completion", label: "Sort by completion rate" },
                    { value: "postQuiz", label: "Sort by post-quiz score" },
                  ]}
                />
              </div>

              <div className="mb-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <MiniKpi label="Results" value={String(filteredCourses.length)} />
                <MiniKpi label="Attempts" value={String(courseSummary.attempts)} />
                <MiniKpi
                  label="Average completion"
                  value={
                    courseSummary.avgCompletion === null
                      ? "—"
                      : formatPercent(courseSummary.avgCompletion)
                  }
                />
                <MiniKpi label="Average post-quiz" value={formatScore(courseSummary.avgPostQuiz)} />
              </div>

              {filteredCourses.length === 0 ? (
                <EmptyState
                  title="No courses matched your search"
                  subtitle="Try a different title, slug, or ESG area."
                />
              ) : (
                <div className="space-y-3">
                  {filteredCourses.map((item) => (
                    <CourseRow key={item.id} item={item} />
                  ))}
                </div>
              )}
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
          </>
        )}
      </motion.div>
    </main>
  );
}
