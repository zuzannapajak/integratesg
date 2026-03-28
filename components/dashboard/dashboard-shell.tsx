"use client";

import LogoutButton from "@/components/auth/login/logout-button";
import StatsChart from "@/components/dashboard/stats-chart";
import { ESG_colors } from "@/lib/constants";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  FolderOpen,
  LineChart,
  LogOut,
  PlayCircle,
  Settings,
  TrendingUp,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import React from "react";

export type DashboardRole = "educator" | "student" | "admin";

export type DashboardStat = {
  label: string;
  value: string;
};

export type DashboardChartPoint = {
  label: string;
  value: number;
};

export type DashboardMetric = {
  label: string;
  value: string;
};

export type DashboardKpi = {
  label: string;
  value: string;
  hint: string;
};

export type DashboardContinueItem = {
  title: string;
  description: string;
  progress: number;
  href: string;
  badge: string;
  ctaLabel: string;
  kindLabel: string;
};

type Props = {
  locale: string;
  role: DashboardRole;
  displayName: string;
  heroStats: DashboardStat[];
  continueLearning: DashboardContinueItem | null;
  publishedCoursesCount: number;
  learnerSummaryMetrics: DashboardMetric[];
  learnerActivityData: DashboardChartPoint[];
  learnerTrendLabel: string;
  adminActivityData: DashboardChartPoint[];
  adminTrendLabel: string;
  adminKpis: DashboardKpi[];
};

type RoleConfig = {
  accent: string;
  avatar: string;
  welcome: string;
  intro: string;
};

const roleConfigs: Record<DashboardRole, RoleConfig> = {
  educator: {
    accent: "#0b9c72",
    avatar: "bg-emerald-600",
    welcome: "Welcome back",
    intro: "Continue your learning path and access your teaching resources.",
  },
  student: {
    accent: "#ef6c23",
    avatar: "bg-orange-600",
    welcome: "Welcome back",
    intro: "Continue learning where you left off and keep your momentum going.",
  },
  admin: {
    accent: "#31425a",
    avatar: "bg-slate-700",
    welcome: "Welcome back",
    intro: "Monitor platform health, participation, and overall usage trends.",
  },
};

const FADE_UP: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const STAGGER_CONTAINER: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const SURFACE =
  "rounded-[28px] border border-white/70 bg-white/88 shadow-[0_10px_30px_rgba(35,45,62,0.05)] backdrop-blur-xl";

const SOFT_INNER_BORDER = "border border-[#edf1f5]";

export default function DashboardShell({
  locale,
  role,
  displayName,
  heroStats,
  continueLearning,
  publishedCoursesCount,
  learnerSummaryMetrics,
  learnerActivityData,
  learnerTrendLabel,
  adminActivityData,
  adminTrendLabel,
  adminKpis,
}: Props) {
  const roleConfig = roleConfigs[role];

  return (
    <main className="relative min-h-screen bg-[#f5f5f3] pb-20 text-[#31425a]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(236,103,37,0.05),transparent_22%),radial-gradient(circle_at_84%_14%,rgba(13,127,194,0.05),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(245,245,243,1)_100%)]" />

      <div className="relative mx-auto max-w-7xl px-4 pt-8 sm:px-6 md:pt-10 lg:px-8">
        <DashboardHero
          locale={locale}
          role={role}
          roleConfig={roleConfig}
          displayName={displayName}
          stats={heroStats}
        />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="space-y-8"
        >
          {(role === "student" || role === "educator") && (
            <LearnerDashboard
              locale={locale}
              role={role}
              roleConfig={roleConfig}
              continueLearning={continueLearning}
              publishedCoursesCount={publishedCoursesCount}
              summaryMetrics={learnerSummaryMetrics}
              activityData={learnerActivityData}
              activityTrendLabel={learnerTrendLabel}
            />
          )}

          {role === "admin" && (
            <AdminDashboard
              locale={locale}
              roleConfig={roleConfig}
              kpis={adminKpis}
              activityData={adminActivityData}
              activityTrendLabel={adminTrendLabel}
            />
          )}
        </motion.div>
      </div>
    </main>
  );
}

function DashboardHero({
  locale,
  roleConfig,
  displayName,
  stats,
}: {
  locale: string;
  role: DashboardRole;
  roleConfig: RoleConfig;
  displayName: string;
  stats: DashboardStat[];
}) {
  return (
    <header className={`${SURFACE} mb-10 p-6 md:p-8`}>
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
        <div className="flex items-start gap-5">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl ${roleConfig.avatar} text-white shadow-[0_12px_24px_rgba(35,45,62,0.10)]`}
          >
            <UserRound className="h-8 w-8" />
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              {roleConfig.welcome}, {displayName}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{roleConfig.intro}</p>

            <div className="mt-5 flex flex-wrap gap-3">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-[#edf1f5] bg-white px-4 py-3 shadow-[0_4px_16px_rgba(35,45,62,0.03)]"
                >
                  <div className="text-base font-bold text-slate-900">{s.value}</div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/settings`}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:-translate-y-0.5 hover:bg-slate-50 hover:text-slate-700"
            title="Settings"
          >
            <Settings className="h-5 w-5" />
          </Link>

          <LogoutButton
            redirectTo={`/${locale}/auth/login`}
            className="flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </LogoutButton>
        </div>
      </div>
    </header>
  );
}

function LearnerDashboard({
  locale,
  role,
  roleConfig,
  continueLearning,
  publishedCoursesCount,
  summaryMetrics,
  activityData,
  activityTrendLabel,
}: {
  locale: string;
  role: DashboardRole;
  roleConfig: RoleConfig;
  continueLearning: DashboardContinueItem | null;
  publishedCoursesCount: number;
  summaryMetrics: DashboardMetric[];
  activityData: DashboardChartPoint[];
  activityTrendLabel: string;
}) {
  const primaryCard =
    role === "educator"
      ? {
          icon: <BookOpen className="h-5 w-5" />,
          title: "Curriculum",
          description: "Open structured modules, checkpoints, and guided learning flow.",
          meta: `${publishedCoursesCount} published modules`,
          href: `/${locale}/curriculum`,
          accentColor: ESG_colors.BLUE,
          backgroundStyle: {
            background:
              "linear-gradient(180deg, rgba(244,248,255,0.98) 0%, rgba(255,255,255,0.96) 100%)",
            borderColor: "rgba(68,127,193,0.20)",
          },
          iconStyle: {
            backgroundColor: "rgba(68,127,193,0.14)",
            color: ESG_colors.BLUE,
          },
          metaStyle: {
            borderColor: "rgba(68,127,193,0.22)",
            backgroundColor: "rgba(68,127,193,0.10)",
            color: ESG_colors.BLUE,
          },
        }
      : {
          icon: <PlayCircle className="h-5 w-5" />,
          title: "Scenario simulator",
          description:
            "Launch interactive scenarios and practice decision-making in realistic contexts.",
          meta: "Interactive scenario flows",
          href: `/${locale}/scenarios`,
          accentColor: ESG_colors.GREEN,
          backgroundStyle: {
            background:
              "linear-gradient(180deg, rgba(243,251,247,0.98) 0%, rgba(255,255,255,0.96) 100%)",
            borderColor: "rgba(30,155,115,0.20)",
          },
          iconStyle: {
            backgroundColor: "rgba(30,155,115,0.14)",
            color: ESG_colors.GREEN,
          },
          metaStyle: {
            borderColor: "rgba(30,155,115,0.22)",
            backgroundColor: "rgba(30,155,115,0.10)",
            color: ESG_colors.GREEN,
          },
        };

  const secondaryCard =
    role === "educator"
      ? {
          icon: <FolderOpen className="h-5 w-5" />,
          title: "ePortfolio",
          description:
            "Browse case studies and practical ESG examples prepared for applied learning.",
          meta: "Case studies and examples",
          href: `/${locale}/eportfolio`,
          accentColor: ESG_colors.ORANGE,
          backgroundStyle: {
            background:
              "linear-gradient(180deg, rgba(255,248,243,0.98) 0%, rgba(255,255,255,0.96) 100%)",
            borderColor: "rgba(213,111,45,0.20)",
          },
          iconStyle: {
            backgroundColor: "rgba(213,111,45,0.14)",
            color: ESG_colors.ORANGE,
          },
          metaStyle: {
            borderColor: "rgba(213,111,45,0.22)",
            backgroundColor: "rgba(213,111,45,0.10)",
            color: ESG_colors.ORANGE,
          },
        }
      : {
          icon: <FolderOpen className="h-5 w-5" />,
          title: "ePortfolio",
          description:
            "Browse case studies and practical ESG examples to support your learning journey.",
          meta: "Case studies and examples",
          href: `/${locale}/eportfolio`,
          accentColor: ESG_colors.BLUE,
          backgroundStyle: {
            background:
              "linear-gradient(180deg, rgba(244,248,255,0.98) 0%, rgba(255,255,255,0.96) 100%)",
            borderColor: "rgba(68,127,193,0.20)",
          },
          iconStyle: {
            backgroundColor: "rgba(68,127,193,0.14)",
            color: ESG_colors.BLUE,
          },
          metaStyle: {
            borderColor: "rgba(68,127,193,0.22)",
            backgroundColor: "rgba(68,127,193,0.10)",
            color: ESG_colors.BLUE,
          },
        };

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
      <motion.div variants={FADE_UP} className={`xl:col-span-5 ${SURFACE} p-8`}>
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            <Clock className="h-4 w-4" />
            Continue learning
          </div>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {continueLearning?.title ?? "No module opened yet"}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {continueLearning?.description ??
            "Recently accessed modules will appear here, once you start it."}
        </p>

        <div className="mt-6">
          <div className="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            <span>Progress</span>
            <span className="text-slate-900">{continueLearning?.progress ?? 0}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full"
              style={{
                width: `${continueLearning?.progress ?? 0}%`,
                backgroundColor: roleConfig.accent,
              }}
            />
          </div>
        </div>

        <div className="mt-7">
          <Link
            href={continueLearning?.href ?? `/${locale}/curriculum`}
            className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            style={{
              backgroundColor: roleConfig.accent,
              boxShadow: "0 10px 24px rgba(35,45,62,0.10)",
            }}
          >
            {continueLearning?.ctaLabel ?? "Browse curriculum"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>

      <motion.div
        variants={FADE_UP}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:col-span-7"
      >
        <CoreAreaCard
          icon={primaryCard.icon}
          title={primaryCard.title}
          description={primaryCard.description}
          meta={primaryCard.meta}
          href={primaryCard.href}
          accentColor={primaryCard.accentColor}
          backgroundStyle={primaryCard.backgroundStyle}
          iconStyle={primaryCard.iconStyle}
          metaStyle={primaryCard.metaStyle}
        />

        <CoreAreaCard
          icon={secondaryCard.icon}
          title={secondaryCard.title}
          description={secondaryCard.description}
          meta={secondaryCard.meta}
          href={secondaryCard.href}
          accentColor={secondaryCard.accentColor}
          backgroundStyle={secondaryCard.backgroundStyle}
          iconStyle={secondaryCard.iconStyle}
          metaStyle={secondaryCard.metaStyle}
        />
      </motion.div>

      <motion.div variants={FADE_UP} className={`xl:col-span-7 ${SURFACE} p-8`}>
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-slate-900">Your activity</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Real events from your curriculum activity over the last 7 days.
            </p>
          </div>

          <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {activityTrendLabel}
          </span>
        </div>

        <StatsChart
          accentColor={roleConfig.accent}
          data={activityData}
          height={240}
          valueLabel="Events"
        />
      </motion.div>

      <motion.div variants={FADE_UP} className={`xl:col-span-5 ${SURFACE} p-8`}>
        <div className="mb-6">
          <h3 className="text-xl font-bold tracking-tight text-slate-900">Progress summary</h3>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            A compact overview built from your real curriculum data.
          </p>
        </div>

        <div className="space-y-3">
          {summaryMetrics.map((metric) => (
            <MetricRow key={metric.label} label={metric.label} value={metric.value} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function AdminDashboard({
  locale,
  roleConfig,
  kpis,
  activityData,
  activityTrendLabel,
}: {
  locale: string;
  roleConfig: RoleConfig;
  kpis: DashboardKpi[];
  activityData: DashboardChartPoint[];
  activityTrendLabel: string;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} label={kpi.label} value={kpi.value} hint={kpi.hint} />
        ))}
      </div>

      <motion.div variants={FADE_UP} className={`${SURFACE} p-8`}>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-slate-900">Platform activity</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Distinct active users per day based on real curriculum activity.
            </p>
          </div>

          <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
            {activityTrendLabel}
          </span>
        </div>

        <StatsChart
          accentColor={roleConfig.accent}
          data={activityData}
          height={260}
          valueLabel="Active users"
        />
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-3">
        <HubCard
          icon={<LineChart className="h-5 w-5" />}
          title="Full report"
          meta="Curriculum platform overview"
          href={`/${locale}/admin/stats`}
          accentColor={roleConfig.accent}
        />
        <HubCard
          icon={<TrendingUp className="h-5 w-5" />}
          title="Participation"
          meta="User activity and launches"
          href={`/${locale}/admin/stats`}
          accentColor={roleConfig.accent}
        />
        <HubCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          title="Completions"
          meta="Finished modules and results"
          href={`/${locale}/admin/stats`}
          accentColor={roleConfig.accent}
        />
      </div>
    </div>
  );
}

function CoreAreaCard({
  icon,
  title,
  description,
  meta,
  href,
  accentColor,
  backgroundStyle,
  iconStyle,
  metaStyle,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  meta: string;
  href: string;
  accentColor: string;
  backgroundStyle?: React.CSSProperties;
  iconStyle?: React.CSSProperties;
  metaStyle?: React.CSSProperties;
}) {
  const buttonLabel =
    title === "Curriculum"
      ? "Open module"
      : title === "Scenario simulator"
        ? "Open scenarios"
        : "Open ePortfolio";

  return (
    <Link
      href={href}
      className={`${SURFACE} group flex h-full flex-col justify-between p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(35,45,62,0.06)]`}
      style={backgroundStyle}
    >
      <div>
        <div className="mb-5 flex items-start justify-between gap-4">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl"
            style={iconStyle ?? { backgroundColor: `${accentColor}12`, color: accentColor }}
          >
            <span className="flex h-5 w-5 items-center justify-center">{icon}</span>
          </div>

          <span
            className="shrink-0 rounded-full border px-3 py-1 text-xs font-medium"
            style={
              metaStyle ?? {
                borderColor: `${accentColor}33`,
                backgroundColor: `${accentColor}14`,
                color: accentColor,
              }
            }
          >
            {meta}
          </span>
        </div>

        <div>
          <h4 className="text-lg font-bold tracking-tight text-slate-900">{title}</h4>
          <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
        </div>
      </div>

      <div className="mt-6">
        <div
          className="inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 group-hover:-translate-y-0.5"
          style={{
            backgroundColor: accentColor,
            boxShadow: "0 10px 24px rgba(35,45,62,0.10)",
          }}
        >
          <span>{buttonLabel}</span>
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}

function HubCard({
  icon,
  title,
  meta,
  href,
  accentColor,
}: {
  icon: React.ReactNode;
  title: string;
  meta: string;
  href: string;
  accentColor: string;
}) {
  return (
    <Link
      href={href}
      className={`${SURFACE} group flex items-center justify-between p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(35,45,62,0.06)]`}
    >
      <div className="flex items-center gap-4">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-2xl"
          style={{ backgroundColor: `${accentColor}12`, color: accentColor }}
        >
          <span className="flex h-5 w-5 items-center justify-center">{icon}</span>
        </div>

        <div>
          <h4 className="text-sm font-bold text-slate-900">{title}</h4>
          <p className="mt-1 text-xs font-medium text-slate-500">{meta}</p>
        </div>
      </div>

      <ArrowRight className="h-4 w-4 text-slate-300 transition-all duration-300 group-hover:translate-x-1" />
    </Link>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      className={`flex items-center justify-between rounded-2xl bg-white px-4 py-4 ${SOFT_INNER_BORDER}`}
    >
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <span className="text-base font-bold text-slate-900">{value}</span>
    </div>
  );
}

function KpiCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <motion.div variants={FADE_UP} className={`${SURFACE} p-6`}>
      <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </div>
      <div className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</div>
      <div className="mt-3 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        {hint}
      </div>
    </motion.div>
  );
}
