"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  CircleDashed,
  Clock3,
  Layers3,
  Leaf,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type ModuleArea = "environmental" | "social" | "governance" | "cross-cutting";
type ModuleStatus = "not_started" | "in_progress" | "completed";

type CurriculumModule = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  area: ModuleArea;
  status: ModuleStatus;
  progress: number;
  duration: string;
  lessons: number;
  quizzes: number;
  lastOpened: string;
  difficulty: "Foundation" | "Intermediate";
  outcomes: string[];
  structure: string[];
};

type Props = {
  locale: string;
  slug: string;
};

const SURFACE =
  "rounded-[28px] border border-white/70 bg-white/88 shadow-[0_12px_34px_rgba(35,45,62,0.06)] backdrop-blur-xl";

const modules: CurriculumModule[] = [
  {
    slug: "esg-foundations-for-vet",
    title: "ESG foundations for VET providers",
    subtitle: "Start here",
    description:
      "Build a shared understanding of ESG integration, material topics, and practical decision-making in educational and organisational contexts.",
    area: "cross-cutting",
    status: "in_progress",
    progress: 58,
    duration: "40 min",
    lessons: 4,
    quizzes: 2,
    lastOpened: "Today",
    difficulty: "Foundation",
    outcomes: ["Understand ESG integration", "Recognise interactions", "Prepare for scenarios"],
    structure: ["Introduction", "Pre-test", "Core content", "Post-test"],
  },
  {
    slug: "environmental-decision-making",
    title: "Environmental decision-making",
    subtitle: "Environmental pillar",
    description:
      "Explore trade-offs around environmental impact, resource efficiency, and sustainability-related decisions using realistic learning contexts.",
    area: "environmental",
    status: "not_started",
    progress: 0,
    duration: "35 min",
    lessons: 3,
    quizzes: 2,
    lastOpened: "Not started yet",
    difficulty: "Foundation",
    outcomes: ["Identify decision points", "Interpret implications", "Build confidence"],
    structure: ["Introduction", "Pre-test", "Content", "Post-test"],
  },
  {
    slug: "social-impact-in-practice",
    title: "Social impact in practice",
    subtitle: "Social pillar",
    description:
      "Examine inclusion, stakeholder sensitivity, wellbeing, and responsibility through applied examples aligned with the social dimension of ESG.",
    area: "social",
    status: "completed",
    progress: 100,
    duration: "30 min",
    lessons: 3,
    quizzes: 2,
    lastOpened: "2 days ago",
    difficulty: "Foundation",
    outcomes: [
      "Recognise social risks",
      "Apply people-centred thinking",
      "Evaluate responsibility",
    ],
    structure: ["Introduction", "Pre-test", "Content", "Post-test"],
  },
  {
    slug: "governance-in-practice",
    title: "Governance in practice",
    subtitle: "Governance pillar",
    description:
      "Focus on accountability, transparency, and decision structures that support credible ESG integration across teams and institutions.",
    area: "governance",
    status: "in_progress",
    progress: 26,
    duration: "45 min",
    lessons: 5,
    quizzes: 2,
    lastOpened: "Yesterday",
    difficulty: "Intermediate",
    outcomes: ["Understand credibility", "Relate policies", "Translate concepts"],
    structure: ["Introduction", "Pre-test", "Case-based", "Post-test"],
  },
];

function getAreaMeta(area: ModuleArea) {
  switch (area) {
    case "environmental":
      return {
        label: "Environmental",
        icon: <Leaf className="h-4 w-4" />,
        badgeClass: "border-emerald-100 bg-emerald-50 text-emerald-700",
        glowClass: "bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_46%)]",
      };
    case "social":
      return {
        label: "Social",
        icon: <Users className="h-4 w-4" />,
        badgeClass: "border-sky-100 bg-sky-50 text-sky-700",
        glowClass: "bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.15),transparent_46%)]",
      };
    case "governance":
      return {
        label: "Governance",
        icon: <ShieldCheck className="h-4 w-4" />,
        badgeClass: "border-violet-100 bg-violet-50 text-violet-700",
        glowClass: "bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.15),transparent_46%)]",
      };
    default:
      return {
        label: "Cross-cutting",
        icon: <Layers3 className="h-4 w-4" />,
        badgeClass: "border-amber-100 bg-amber-50 text-amber-700",
        glowClass: "bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.18),transparent_46%)]",
      };
  }
}

function getStatusMeta(status: ModuleStatus) {
  switch (status) {
    case "completed":
      return {
        label: "Completed",
        icon: <CheckCircle2 className="h-4 w-4" />,
        badgeClass: "border-emerald-100 bg-emerald-50 text-emerald-700",
        ctaLabel: "Review module",
      };
    case "in_progress":
      return {
        label: "In progress",
        icon: <CircleDashed className="h-4 w-4" />,
        badgeClass: "border-orange-100 bg-orange-50 text-orange-700",
        ctaLabel: "Continue module",
      };
    default:
      return {
        label: "Not started",
        icon: <BookOpen className="h-4 w-4" />,
        badgeClass: "border-slate-200 bg-slate-50 text-slate-600",
        ctaLabel: "Start module",
      };
  }
}

function getRelatedModules(currentSlug: string) {
  return modules.filter((item) => item.slug !== currentSlug).slice(0, 3);
}

export default function CourseDetailShell({ locale, slug }: Props) {
  const course = useMemo(() => modules.find((item) => item.slug === slug), [slug]);
  const [openPanel, setOpenPanel] = useState<"overview" | "outcomes" | "flow">("overview");

  if (!course) {
    return (
      <section className={`${SURFACE} p-12 text-center`}>
        <div className="mx-auto max-w-lg space-y-4">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f4f7fa] text-[#98a2b3]">
            <BookOpen className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#31425a]">Course not found</h2>
          <p className="text-sm leading-6 text-[#667180]">
            The requested curriculum module could not be found in the current data source.
          </p>
          <Link
            href={`/${locale}/curriculum`}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#31425a] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#253347]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to curriculum
          </Link>
        </div>
      </section>
    );
  }

  const areaMeta = getAreaMeta(course.area);
  const statusMeta = getStatusMeta(course.status);
  const relatedModules = getRelatedModules(course.slug);

  return (
    <div className="space-y-8">
      <div className="px-1">
        <Link
          href={`/${locale}/curriculum`}
          className="inline-flex items-center gap-2 text-[0.95rem] font-medium text-[#5f6977] transition hover:text-[#31425a]"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
          Back to curriculum
        </Link>
      </div>

      <section className={`${SURFACE} relative overflow-hidden p-6 md:p-8`}>
        <div className={`pointer-events-none absolute inset-0 opacity-95 ${areaMeta.glowClass}`} />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.64)_0%,rgba(255,255,255,0.92)_100%)]" />

        <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1.4fr)_360px] xl:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${areaMeta.badgeClass}`}
              >
                {areaMeta.icon}
                {areaMeta.label}
              </span>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${statusMeta.badgeClass}`}
              >
                {statusMeta.icon}
                {statusMeta.label}
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e8edf3] bg-white/70 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#5f6f82]">
                <Trophy className="h-3.5 w-3.5" />
                {course.difficulty}
              </span>
            </div>

            <div className="mt-6">
              <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[#8a97a6]">
                {course.subtitle}
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-[-0.03em] text-[#31425a] md:text-4xl">
                {course.title}
              </h1>
              <p className="mt-5 max-w-3xl text-[1rem] leading-8 text-[#667180]">
                {course.description}
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:max-w-3xl xl:grid-cols-4">
              <MetricCard
                icon={<Clock3 className="h-4 w-4" />}
                label="Duration"
                value={course.duration}
              />
              <MetricCard
                icon={<Target className="h-4 w-4" />}
                label="Lessons"
                value={`${course.lessons}`}
              />
              <MetricCard
                icon={<BookOpen className="h-4 w-4" />}
                label="Quizzes"
                value={`${course.quizzes}`}
              />
              <MetricCard
                icon={<CircleDashed className="h-4 w-4" />}
                label="Last opened"
                value={course.lastOpened}
              />
            </div>

            <div className="mt-8 max-w-3xl">
              <div className="mb-2 flex items-center justify-between text-[0.74rem] font-bold uppercase tracking-[0.12em] text-[#8a97a6]">
                <span>Overall progress</span>
                <span className="text-[#31425a]">{course.progress}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-[#edf2f7]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${course.progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="h-full rounded-full bg-[#0b9c72]"
                />
              </div>
            </div>
          </div>

          <aside className="rounded-[26px] border border-white/70 bg-white/82 p-5 shadow-[0_10px_30px_rgba(35,45,62,0.05)] backdrop-blur-xl">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#8a97a6]">
              Quick actions
            </p>

            <div className="mt-4 grid gap-3">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#31425a] px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#253347]"
              >
                <PlayCircle className="h-4.5 w-4.5" />
                {statusMeta.ctaLabel}
              </button>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#d9e2ec] bg-white px-4 py-3.5 text-sm font-semibold text-[#31425a] transition hover:bg-[#f8fafc]"
              >
                <Layers3 className="h-4.5 w-4.5" />
                View learning flow
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-[#e8edf3] bg-[#fafcfd] p-4">
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#8a97a6]">
                Current state
              </p>

              <div className="mt-3 space-y-3">
                <SummaryRow label="Status" value={statusMeta.label} />
                <SummaryRow label="Progress" value={`${course.progress}%`} />
                <SummaryRow label="Difficulty" value={course.difficulty} />
                <SummaryRow label="Last opened" value={course.lastOpened} />
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_380px]">
        <div className="space-y-6">
          <div className={`${SURFACE} p-3`}>
            <div className="flex flex-wrap gap-2">
              <ToggleButton
                active={openPanel === "overview"}
                onClick={() => {
                  setOpenPanel("overview");
                }}
                icon={<Sparkles className="h-4 w-4" />}
                label="Overview"
              />
              <ToggleButton
                active={openPanel === "outcomes"}
                onClick={() => {
                  setOpenPanel("outcomes");
                }}
                icon={<CheckCircle2 className="h-4 w-4" />}
                label="Outcomes"
              />
              <ToggleButton
                active={openPanel === "flow"}
                onClick={() => {
                  setOpenPanel("flow");
                }}
                icon={<Layers3 className="h-4 w-4" />}
                label="Learning flow"
              />
            </div>
          </div>

          <div className={`${SURFACE} overflow-hidden`}>
            <AnimatePresence mode="wait">
              {openPanel === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="p-6 md:p-7"
                >
                  <SectionTitle
                    eyebrow="Module overview"
                    title="What this course is designed to do"
                  />
                  <p className="mt-4 text-[0.98rem] leading-8 text-[#667180]">
                    This module is structured to support guided educator learning with a clear,
                    low-friction progression model. It combines foundational content, knowledge
                    checks, and a coherent sequence of steps so the learner always understands what
                    comes next.
                  </p>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <InsightCard
                      title="Practical orientation"
                      text="The learning path is built to connect theory with decision-making and applied ESG understanding."
                    />
                    <InsightCard
                      title="Clear progression"
                      text="The module uses a predictable flow that makes it easy to resume and complete without cognitive overload."
                    />
                  </div>
                </motion.div>
              )}

              {openPanel === "outcomes" && (
                <motion.div
                  key="outcomes"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="p-6 md:p-7"
                >
                  <SectionTitle eyebrow="Learning outcomes" title="What the educator should gain" />

                  <div className="mt-5 space-y-3">
                    {course.outcomes.map((outcome, index) => (
                      <div
                        key={outcome}
                        className="flex items-start gap-3 rounded-2xl border border-[#e8edf3] bg-white/70 px-4 py-4"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0b9c72] text-sm font-bold text-white">
                          {index + 1}
                        </span>
                        <p className="pt-1 text-sm leading-6 text-[#556274]">{outcome}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {openPanel === "flow" && (
                <motion.div
                  key="flow"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="p-6 md:p-7"
                >
                  <SectionTitle eyebrow="Learning flow" title="How the module unfolds" />

                  <div className="mt-5 space-y-3">
                    {course.structure.map((step, index) => (
                      <div
                        key={step}
                        className="flex items-center gap-4 rounded-2xl border border-[#e8edf3] bg-white/70 px-4 py-4"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d9e2ec] bg-white text-sm font-bold text-[#31425a]">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-[#31425a]">{step}</p>
                          <p className="mt-1 text-sm text-[#667180]">
                            A clearly defined stage in the learning journey.
                          </p>
                        </div>
                        <ChevronDown className="h-4.5 w-4.5 text-[#98a2b3]" />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <aside className="space-y-6">
          <div className={`${SURFACE} p-6`}>
            <SectionTitle eyebrow="Continue learning" title="Related modules" />

            <div className="mt-5 space-y-3">
              {relatedModules.map((item) => {
                const itemArea = getAreaMeta(item.area);

                return (
                  <Link
                    key={item.slug}
                    href={`/${locale}/curriculum/${item.slug}`}
                    className="group block rounded-2xl border border-[#e8edf3] bg-white/72 p-4 transition hover:-translate-y-0.5 hover:bg-white"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wider ${itemArea.badgeClass}`}
                        >
                          {itemArea.icon}
                          {itemArea.label}
                        </span>

                        <h3 className="mt-3 text-sm font-bold text-[#31425a]">{item.title}</h3>
                        <p className="mt-1 text-sm text-[#667180]">{item.subtitle}</p>
                      </div>

                      <ArrowRight className="mt-1 h-4.5 w-4.5 text-[#98a2b3] transition group-hover:text-[#31425a]" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className={`${SURFACE} p-6`}>
            <SectionTitle eyebrow="Engagement" title="Suggested next move" />
            <p className="mt-4 text-sm leading-6 text-[#667180]">
              Resume the current module to preserve momentum. The page is designed around quick
              re-entry, visible progress, and low-friction orientation.
            </p>

            <button
              type="button"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0b9c72] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#098966]"
            >
              Continue from last point
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[22px] border border-white/70 bg-white/82 px-4 py-4 shadow-[0_8px_24px_rgba(35,45,62,0.04)]">
      <div className="flex items-center gap-2 text-[#0b9c72]">{icon}</div>
      <div className="mt-3 text-lg font-bold text-[#31425a]">{value}</div>
      <div className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#8a97a6]">
        {label}
      </div>
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
        active ? "bg-[#31425a] text-white shadow-sm" : "text-[#5f6f82] hover:bg-[#f4f7fa]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#8a97a6]">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#31425a]">{title}</h2>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-[#667180]">{label}</span>
      <span className="text-sm font-semibold text-[#31425a]">{value}</span>
    </div>
  );
}

function InsightCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-[#e8edf3] bg-white/72 p-5">
      <h3 className="text-base font-bold text-[#31425a]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#667180]">{text}</p>
    </div>
  );
}
