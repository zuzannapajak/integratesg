"use client";

import LogoutButton from "@/components/auth/login/logout-button";
import StatsChart from "@/components/dashboard/stats-chart";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  FolderKanban,
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

type Props = {
  locale: string;
  role: DashboardRole;
  displayName: string;
  email: string;
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

export default function DashboardShell({ locale, role, displayName }: Props) {
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
        />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="space-y-8"
        >
          {role === "student" && <StudentDashboard locale={locale} roleConfig={roleConfig} />}
          {role === "educator" && <EducatorDashboard locale={locale} roleConfig={roleConfig} />}
          {role === "admin" && <AdminDashboard locale={locale} roleConfig={roleConfig} />}
        </motion.div>
      </div>
    </main>
  );
}

function DashboardHero({
  locale,
  role,
  roleConfig,
  displayName,
}: {
  locale: string;
  role: DashboardRole;
  roleConfig: RoleConfig;
  displayName: string;
}) {
  const stats =
    role === "educator"
      ? [
          { label: "Modules in progress", value: "2" },
          { label: "Completed", value: "5" },
          { label: "Weekly streak", value: "4 days" },
        ]
      : role === "admin"
        ? [
            { label: "Active users", value: "184" },
            { label: "Started modules", value: "72" },
            { label: "Completion rate", value: "68%" },
          ]
        : [
            { label: "In progress", value: "2" },
            { label: "Completed", value: "7" },
            { label: "Weekly streak", value: "4 days" },
          ];

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

function StudentDashboard({ locale, roleConfig }: { locale: string; roleConfig: RoleConfig }) {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
      <motion.div variants={FADE_UP} className={`xl:col-span-5 ${SURFACE} p-8`}>
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            <Clock className="h-4 w-4" />
            Last activity
          </div>

          <span className="rounded-full border border-orange-100 bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700">
            ePortfolio
          </span>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Introduction to sustainability
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Continue your latest ePortfolio lesson to stay on track and move closer to completion.
        </p>

        <div className="mt-6">
          <div className="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            <span>Progress</span>
            <span className="text-slate-900">64%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full"
              style={{ width: "64%", backgroundColor: roleConfig.accent }}
            />
          </div>
        </div>

        <div className="mt-7">
          <Link
            href={`/${locale}/eportfolio`}
            className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            style={{
              backgroundColor: roleConfig.accent,
              boxShadow: "0 10px 24px rgba(35,45,62,0.10)",
            }}
          >
            Continue module
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>

      <motion.div
        variants={FADE_UP}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:col-span-7"
      >
        <CoreAreaCard
          icon={<BookOpen className="h-5 w-5" />}
          title="ePortfolio"
          description="Explore structured lessons, case studies, and learning materials."
          meta="12 lessons"
          href={`/${locale}/eportfolio`}
          accentColor={roleConfig.accent}
          toneClass="bg-[linear-gradient(180deg,rgba(255,247,242,0.95)_0%,rgba(255,255,255,0.96)_100%)] border-orange-100/80"
          iconToneClass="bg-orange-100 text-orange-700"
          metaToneClass="border-orange-100 bg-orange-50 text-orange-700"
        />

        <CoreAreaCard
          icon={<PlayCircle className="h-5 w-5" />}
          title="Scenario Simulator"
          description="Practice decision-making through guided interactive scenarios."
          meta="3 scenarios"
          href={`/${locale}/scenarios`}
          accentColor={roleConfig.accent}
          toneClass="bg-[linear-gradient(180deg,rgba(245,249,255,0.96)_0%,rgba(255,255,255,0.96)_100%)] border-sky-100/80"
          iconToneClass="bg-sky-100 text-sky-700"
          metaToneClass="border-sky-100 bg-sky-50 text-sky-700"
        />
      </motion.div>

      <motion.div variants={FADE_UP} className={`xl:col-span-7 ${SURFACE} p-8`}>
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-slate-900">Your activity</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              A lightweight view of your recent learning rhythm.
            </p>
          </div>

          <span className="rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
            +8.2% vs last week
          </span>
        </div>

        <StatsChart accentColor={roleConfig.accent} data={studentChartData} height={240} />
      </motion.div>

      <motion.div variants={FADE_UP} className={`xl:col-span-5 ${SURFACE} p-8`}>
        <div className="mb-6">
          <h3 className="text-xl font-bold tracking-tight text-slate-900">Progress summary</h3>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Key indicators that help you stay motivated.
          </p>
        </div>

        <div className="space-y-3">
          <MetricRow label="Completed modules" value="7" />
          <MetricRow label="Finished scenarios" value="3" />
          <MetricRow label="Average test score" value="84%" />
        </div>
      </motion.div>
    </div>
  );
}

function EducatorDashboard({ locale, roleConfig }: { locale: string; roleConfig: RoleConfig }) {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
      <motion.div variants={FADE_UP} className={`xl:col-span-5 ${SURFACE} p-8`}>
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            <Clock className="h-4 w-4" />
            Continue learning
          </div>

          <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            Curriculum
          </span>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          ESG foundations for VET providers
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Resume your current curriculum module and continue your learning journey.
        </p>

        <div className="mt-6">
          <div className="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            <span>Progress</span>
            <span className="text-slate-900">58%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full"
              style={{ width: "58%", backgroundColor: roleConfig.accent }}
            />
          </div>
        </div>

        <div className="mt-7">
          <Link
            href={`/${locale}/curriculum`}
            className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            style={{
              backgroundColor: roleConfig.accent,
              boxShadow: "0 10px 24px rgba(35,45,62,0.10)",
            }}
          >
            Continue curriculum
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>

      <motion.div
        variants={FADE_UP}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:col-span-7"
      >
        <CoreAreaCard
          icon={<FolderKanban className="h-5 w-5" />}
          title="Curriculum"
          description="Access learning modules, quizzes, and structured course flow."
          meta="4 modules"
          href={`/${locale}/curriculum`}
          accentColor={roleConfig.accent}
          toneClass="bg-[linear-gradient(180deg,rgba(243,252,248,0.96)_0%,rgba(255,255,255,0.96)_100%)] border-emerald-100/80"
          iconToneClass="bg-emerald-100 text-emerald-700"
          metaToneClass="border-emerald-100 bg-emerald-50 text-emerald-700"
        />

        <CoreAreaCard
          icon={<BookOpen className="h-5 w-5" />}
          title="ePortfolio"
          description="Open case studies and supporting educational materials."
          meta="12 case studies"
          href={`/${locale}/eportfolio`}
          accentColor={roleConfig.accent}
          toneClass="bg-[linear-gradient(180deg,rgba(250,247,242,0.96)_0%,rgba(255,255,255,0.96)_100%)] border-amber-100/80"
          iconToneClass="bg-amber-100 text-amber-700"
          metaToneClass="border-amber-100 bg-amber-50 text-amber-700"
        />
      </motion.div>

      <motion.div variants={FADE_UP} className={`xl:col-span-7 ${SURFACE} p-8`}>
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-slate-900">Your activity</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              A simple view of your own learning activity over the last 7 days.
            </p>
          </div>

          <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            +6.4% vs last week
          </span>
        </div>

        <StatsChart accentColor={roleConfig.accent} data={educatorChartData} height={240} />
      </motion.div>

      <motion.div variants={FADE_UP} className={`xl:col-span-5 ${SURFACE} p-8`}>
        <div className="mb-6">
          <h3 className="text-xl font-bold tracking-tight text-slate-900">Progress summary</h3>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            A compact overview of your current learning progress.
          </p>
        </div>

        <div className="space-y-3">
          <MetricRow label="Completed curriculum modules" value="5" />
          <MetricRow label="Completed ePortfolio items" value="8" />
          <MetricRow label="Average score" value="81%" />
        </div>
      </motion.div>
    </div>
  );
}

function AdminDashboard({ locale, roleConfig }: { locale: string; roleConfig: RoleConfig }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Active users" value="184" hint="+12%" />
        <KpiCard label="Started modules" value="72" hint="+5%" />
        <KpiCard label="Course completion" value="68%" hint="Stable" />
        <KpiCard label="Scenario launches" value="49" hint="+8%" />
      </div>

      <motion.div variants={FADE_UP} className={`${SURFACE} p-8`}>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-slate-900">Platform activity</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              An overview of platform usage and engagement in the last 7 days.
            </p>
          </div>

          <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
            Last sync: 5 min ago
          </span>
        </div>

        <StatsChart
          accentColor={roleConfig.accent}
          data={adminChartData}
          height={260}
          valueLabel="Users"
        />
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-3">
        <HubCard
          icon={<LineChart className="h-5 w-5" />}
          title="Full report"
          meta="Indicators and trends"
          href={`/${locale}/admin/stats`}
          accentColor={roleConfig.accent}
        />
        <HubCard
          icon={<TrendingUp className="h-5 w-5" />}
          title="Participation"
          meta="Activity and engagement"
          href={`/${locale}/admin/stats`}
          accentColor={roleConfig.accent}
        />
        <HubCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          title="Completions"
          meta="Progress and outcomes"
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
  toneClass = "",
  iconToneClass = "",
  metaToneClass = "",
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  meta: string;
  href: string;
  accentColor: string;
  toneClass?: string;
  iconToneClass?: string;
  metaToneClass?: string;
}) {
  return (
    <Link
      href={href}
      className={`${SURFACE} ${toneClass} group flex h-full flex-col justify-between p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(35,45,62,0.06)]`}
    >
      <div>
        <div
          className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${iconToneClass}`}
          style={
            iconToneClass ? undefined : { backgroundColor: `${accentColor}12`, color: accentColor }
          }
        >
          <span className="flex h-5 w-5 items-center justify-center">{icon}</span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="text-lg font-bold tracking-tight text-slate-900">{title}</h4>
            <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
          </div>

          <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-300 transition-all duration-300 group-hover:translate-x-1" />
        </div>
      </div>

      <div className="mt-6">
        <span
          className={`rounded-full border px-3 py-1 text-xs font-medium ${metaToneClass || "border-slate-200 bg-slate-50 text-slate-600"}`}
        >
          {meta}
        </span>
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

const studentChartData = [
  { label: "Mon", value: 18 },
  { label: "Tue", value: 26 },
  { label: "Wed", value: 32 },
  { label: "Thu", value: 28 },
  { label: "Fri", value: 41 },
  { label: "Sat", value: 34 },
  { label: "Sun", value: 39 },
];

const educatorChartData = [
  { label: "Mon", value: 14 },
  { label: "Tue", value: 19 },
  { label: "Wed", value: 24 },
  { label: "Thu", value: 22 },
  { label: "Fri", value: 31 },
  { label: "Sat", value: 26 },
  { label: "Sun", value: 29 },
];

const adminChartData = [
  { label: "Mon", value: 42 },
  { label: "Tue", value: 57 },
  { label: "Wed", value: 64 },
  { label: "Thu", value: 61 },
  { label: "Fri", value: 79 },
  { label: "Sat", value: 48 },
  { label: "Sun", value: 53 },
];
