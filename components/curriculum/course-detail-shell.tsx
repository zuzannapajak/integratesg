"use client";

import { CurriculumModuleViewModel } from "@/lib/curriculum/types";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  CircleDashed,
  Clock3,
  Layers3,
  Leaf,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

type ModuleArea = "environmental" | "social" | "governance" | "cross-cutting";
type ModuleStatus = "not_started" | "in_progress" | "completed";

type Props = {
  locale: string;
  module: CurriculumModuleViewModel;
};

const SURFACE =
  "rounded-[30px] border border-white/70 bg-white/88 shadow-[0_12px_34px_rgba(35,45,62,0.06)] backdrop-blur-xl";

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

export default function CourseDetailShell({ locale, module }: Props) {
  const [openPanel, setOpenPanel] = useState<"overview" | "outcomes" | "flow">("overview");
  const contentSectionRef = useRef<HTMLDivElement | null>(null);

  const areaMeta = getAreaMeta(module.area);
  const statusMeta = getStatusMeta(module.status);

  const handleScrollToFlow = () => {
    setOpenPanel("flow");
    requestAnimationFrame(() => {
      contentSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  return (
    <div className="space-y-6">
      <div className="px-1">
        <Link
          href={`/${locale}/curriculum`}
          className="inline-flex items-center gap-2 text-[0.95rem] font-medium text-[#5f6977] transition hover:text-[#31425a]"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
          Back to curriculum
        </Link>
      </div>

      <section className={`${SURFACE} relative overflow-hidden px-6 py-6 md:px-8 md:py-8`}>
        <div className={`pointer-events-none absolute inset-0 opacity-95 ${areaMeta.glowClass}`} />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.62)_0%,rgba(255,255,255,0.93)_100%)]" />

        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1.58fr)_320px]">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.14em] ${areaMeta.badgeClass}`}
              >
                {areaMeta.icon}
                {areaMeta.label}
              </span>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.14em] ${statusMeta.badgeClass}`}
              >
                {statusMeta.icon}
                {statusMeta.label}
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e8edf3] bg-white/70 px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#5f6f82]">
                <Trophy className="h-3.5 w-3.5" />
                {module.difficulty}
              </span>
            </div>

            <div className="max-w-4xl">
              <p className="text-[0.76rem] font-bold uppercase tracking-[0.18em] text-[#8a97a6]">
                {module.subtitle}
              </p>
              <h1 className="mt-3 max-w-4xl text-3xl font-bold tracking-[-0.035em] text-[#31425a] md:text-4xl xl:text-[3.05rem] xl:leading-[1.03]">
                {module.title}
              </h1>
              <p className="mt-5 max-w-3xl text-[1rem] leading-8 text-[#667180] md:text-[1.04rem]">
                {module.description}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:max-w-4xl xl:grid-cols-4">
              <MetricCard
                icon={<Clock3 className="h-4 w-4" />}
                label="Duration"
                value={module.duration}
              />
              <MetricCard
                icon={<Layers3 className="h-4 w-4" />}
                label="Lessons"
                value={`${module.lessons}`}
              />
              <MetricCard
                icon={<BookOpen className="h-4 w-4" />}
                label="Quizzes"
                value={`${module.quizzes}`}
              />
              <MetricCard
                icon={<CircleDashed className="h-4 w-4" />}
                label="Last opened"
                value={module.lastOpened}
              />
            </div>
          </div>

          <aside className="flex h-full flex-col gap-4">
            <div className="rounded-[28px] border border-[#e7edf3] bg-white/82 px-5 py-6 shadow-[0_10px_30px_rgba(35,45,62,0.05)] backdrop-blur-xl">
              <div className="mb-4 flex items-baseline gap-2">
                <div className="text-[1.7rem] font-bold leading-none tracking-tight text-[#31425a]">
                  {module.progress}%
                </div>
                <div className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#8a97a6]">
                  Completed
                </div>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-[#edf2f7]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${module.progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="h-full rounded-full bg-[#0b9c72]"
                />
              </div>
            </div>

            <div className="mt-auto rounded-[28px] border border-white/70 bg-white/86 px-5 py-6 shadow-[0_10px_30px_rgba(35,45,62,0.05)] backdrop-blur-xl">
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#8a97a6]">
                Quick actions
              </p>

              <div className="mt-5 grid gap-3">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#31425a] px-4 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#253347]"
                >
                  <PlayCircle className="h-4.5 w-4.5" />
                  {statusMeta.ctaLabel}
                </button>

                <button
                  type="button"
                  onClick={handleScrollToFlow}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#d9e2ec] bg-white px-4 py-4 text-sm font-semibold text-[#31425a] transition hover:bg-[#f8fafc]"
                >
                  <Layers3 className="h-4.5 w-4.5" />
                  View learning flow
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section ref={contentSectionRef} className={`${SURFACE} overflow-hidden`}>
        <div className="px-5 pt-4 md:px-7 md:pt-5">
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

          <div className="mt-4 h-px w-full bg-[#e8edf3]" />
        </div>

        <AnimatePresence mode="wait">
          {openPanel === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
              className="p-5 md:p-7"
            >
              <SectionTitle eyebrow="Module overview" title="What this course is designed to do" />

              <div className="mt-5 max-w-4xl">
                <p className="text-[0.98rem] leading-8 text-[#667180]">
                  {module.content?.trim()
                    ? module.content
                    : "This module is structured to support guided educator learning with a clear, low-friction progression model. It combines foundational content, knowledge checks, and a coherent sequence of steps so the learner always understands what comes next."}
                </p>
              </div>

              <div className="mt-7 grid gap-4 md:grid-cols-2">
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
              className="p-5 md:p-7"
            >
              <SectionTitle eyebrow="Learning outcomes" title="What the educator should gain" />

              <div className="mt-5 grid gap-3">
                {module.outcomes.map((outcome, index) => (
                  <div
                    key={outcome}
                    className="flex items-start gap-3 rounded-2xl border border-[#e8edf3] bg-white/72 px-4 py-4"
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
              className="p-5 md:p-7"
            >
              <SectionTitle eyebrow="Learning flow" title="How the module unfolds" />

              <div className="mt-5 space-y-3">
                {module.structure.map((step, index) => (
                  <div
                    key={step}
                    className="flex items-center gap-4 rounded-2xl border border-[#e8edf3] bg-white/72 px-4 py-4"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d9e2ec] bg-white text-sm font-bold text-[#31425a]">
                      {index + 1}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[#31425a]">{step}</p>
                      <p className="mt-1 text-sm text-[#667180]">
                        A clearly defined stage in the learning journey.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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

function InsightCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-[#e8edf3] bg-white/72 p-5">
      <h3 className="text-base font-bold text-[#31425a]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#667180]">{text}</p>
    </div>
  );
}
