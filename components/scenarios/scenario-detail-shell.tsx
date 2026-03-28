"use client";

import {
  ScenarioArea,
  ScenarioDetailViewModel,
  ScenarioListItemViewModel,
  ScenarioProgressStatus,
} from "@/lib/scenarios/types";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  CircleDashed,
  Clock3,
  Compass,
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
import { useMemo, useRef, useState } from "react";

type Props = {
  locale: string;
  scenario: ScenarioDetailViewModel;
  relatedScenarios: ScenarioListItemViewModel[];
};

type PanelKey = "overview" | "practice" | "prepare" | "related";

const SURFACE =
  "rounded-[30px] border border-white/70 bg-white/88 shadow-[0_12px_34px_rgba(35,45,62,0.06)] backdrop-blur-xl";

function getAreaMeta(area: ScenarioArea) {
  switch (area) {
    case "environmental":
      return {
        label: "Environmental",
        icon: <Leaf className="h-4 w-4" />,
        badgeClass: "border-emerald-100 bg-emerald-50 text-emerald-700",
        glowClass: "bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_46%)]",
        accentClass: "from-emerald-100/90 via-white to-emerald-50/80",
        orbitClass: "border-emerald-200/70 bg-emerald-100/55 text-emerald-700",
      };
    case "social":
      return {
        label: "Social",
        icon: <Users className="h-4 w-4" />,
        badgeClass: "border-sky-100 bg-sky-50 text-sky-700",
        glowClass: "bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.15),transparent_46%)]",
        accentClass: "from-sky-100/90 via-white to-sky-50/80",
        orbitClass: "border-sky-200/70 bg-sky-100/55 text-sky-700",
      };
    case "governance":
      return {
        label: "Governance",
        icon: <ShieldCheck className="h-4 w-4" />,
        badgeClass: "border-violet-100 bg-violet-50 text-violet-700",
        glowClass: "bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.15),transparent_46%)]",
        accentClass: "from-violet-100/90 via-white to-violet-50/80",
        orbitClass: "border-violet-200/70 bg-violet-100/55 text-violet-700",
      };
    default:
      return {
        label: "Cross-cutting",
        icon: <Layers3 className="h-4 w-4" />,
        badgeClass: "border-amber-100 bg-amber-50 text-amber-700",
        glowClass: "bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.18),transparent_46%)]",
        accentClass: "from-amber-100/90 via-white to-amber-50/80",
        orbitClass: "border-amber-200/70 bg-amber-100/55 text-amber-700",
      };
  }
}

function getStatusMeta(status: ScenarioProgressStatus) {
  switch (status) {
    case "completed":
      return {
        label: "Completed",
        icon: <CheckCircle2 className="h-4 w-4" />,
        badgeClass: "border-emerald-100 bg-emerald-50 text-emerald-700",
      };
    case "in_progress":
      return {
        label: "In progress",
        icon: <CircleDashed className="h-4 w-4" />,
        badgeClass: "border-orange-100 bg-orange-50 text-orange-700",
      };
    default:
      return {
        label: "Ready to start",
        icon: <PlayCircle className="h-4 w-4" />,
        badgeClass: "border-slate-200 bg-slate-50 text-slate-600",
      };
  }
}

function formatDuration(minutes: number | null) {
  if (!minutes || minutes <= 0) {
    return "Self-paced";
  }

  return `${minutes} min`;
}

function formatDate(date: string | null) {
  if (!date) {
    return null;
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function getHeroIntro(scenario: ScenarioDetailViewModel) {
  switch (scenario.status) {
    case "completed":
      return "You have already completed this scenario. Reopen it to review your decisions or take another run.";
    case "in_progress":
      return scenario.lessonLocation
        ? "Your last session can be resumed from the point where you paused."
        : "You have already started this scenario. Continue with the next decision point.";
    default:
      return "Explore the context, understand the challenge, and launch the experience when you are ready.";
  }
}

function getProgressSummary(scenario: ScenarioDetailViewModel) {
  if (scenario.status === "completed") {
    return scenario.score !== null
      ? `Finished with a score of ${scenario.score}%`
      : "Scenario completed successfully";
  }

  if (scenario.status === "in_progress") {
    return scenario.lessonLocation
      ? `Resume from ${scenario.lessonLocation.replace(/[-_]/g, " ")}`
      : "Continue from your latest checkpoint";
  }

  return "Ready for a first attempt";
}

function getProgressValue(scenario: ScenarioDetailViewModel) {
  if (scenario.status === "completed") return 100;
  if (scenario.status === "in_progress") return 58;
  return 8;
}

function getPrimaryActionLabel(scenario: ScenarioDetailViewModel) {
  if (scenario.status === "completed") return "Review scenario";
  if (scenario.status === "in_progress") return "Resume scenario";
  return "Launch scenario";
}

function getPracticePoints(area: ScenarioArea) {
  switch (area) {
    case "environmental":
      return [
        "Balance sustainability goals with operational trade-offs.",
        "Interpret signals related to efficiency, risk, and impact.",
        "Choose actions that improve long-term environmental outcomes.",
      ];
    case "social":
      return [
        "Respond to stakeholder tension with empathy and clarity.",
        "Assess people-focused consequences across competing priorities.",
        "Practice inclusive decision-making under real-world pressure.",
      ];
    case "governance":
      return [
        "Evaluate accountability pathways and escalation choices.",
        "Strengthen judgment around transparency and policy alignment.",
        "Understand how governance design shapes implementation quality.",
      ];
    default:
      return [
        "Connect ESG dimensions through one coherent decision flow.",
        "Recognise interdependencies between people, process, and impact.",
        "Apply structured thinking in complex practical situations.",
      ];
  }
}

function getPreparationChecklist(scenario: ScenarioDetailViewModel) {
  return [
    `Set aside around ${formatDuration(scenario.estimatedDurationMinutes).toLowerCase()} for a focused run.`,
    "Expect staged choices, immediate feedback, and practical trade-offs.",
    "Revisit the scenario later to compare how different decisions may shape the outcome.",
  ];
}

function ToggleButton({
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
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
        active
          ? "border-[#31425a] bg-[#31425a] text-white shadow-sm"
          : "border-[#dbe3eb] bg-white text-[#516071] hover:border-[#cdd8e3] hover:bg-[#f8fafc]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

export default function ScenarioDetailShell({ locale, scenario, relatedScenarios }: Props) {
  const [openPanel, setOpenPanel] = useState<PanelKey>("overview");
  const contentSectionRef = useRef<HTMLDivElement | null>(null);

  const areaMeta = getAreaMeta(scenario.area);
  const statusMeta = getStatusMeta(scenario.status);
  const progressValue = getProgressValue(scenario);

  const practicePoints = useMemo(() => getPracticePoints(scenario.area), [scenario.area]);
  const preparationChecklist = useMemo(() => getPreparationChecklist(scenario), [scenario]);

  const handleScrollToPanel = (panel: PanelKey) => {
    setOpenPanel(panel);
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
          href={`/${locale}/scenarios`}
          className="inline-flex items-center gap-2 text-[0.95rem] font-medium text-[#5f6977] transition hover:text-[#31425a]"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
          Back to scenarios
        </Link>
      </div>

      <section className={`${SURFACE} relative overflow-hidden px-6 py-6 md:px-8 md:py-8`}>
        <div className={`pointer-events-none absolute inset-0 opacity-95 ${areaMeta.glowClass}`} />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.62)_0%,rgba(255,255,255,0.94)_100%)]" />

        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1.62fr)_340px] xl:items-start">
          <div className="flex h-full flex-col">
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

                {scenario.isFeatured && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-100 bg-amber-50 px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-amber-700">
                    <Sparkles className="h-3.5 w-3.5" />
                    Featured
                  </span>
                )}
              </div>

              <div className="max-w-4xl">
                <p className="text-[0.76rem] font-bold uppercase tracking-[0.18em] text-[#8a97a6]">
                  Scenario launcher
                </p>

                <h1 className="mt-3 max-w-4xl text-3xl font-bold tracking-[-0.035em] text-[#31425a] md:text-4xl xl:text-[3.05rem] xl:leading-[1.03]">
                  {scenario.title}
                </h1>

                <p className="mt-5 max-w-3xl text-[1rem] leading-8 text-[#667180] md:text-[1.04rem]">
                  {scenario.description}
                </p>

                <div className="mt-6 inline-flex items-start gap-2 rounded-2xl border border-[#e8edf3] bg-white/86 px-4 py-3 text-sm text-[#556274] shadow-[0_8px_24px_rgba(35,45,62,0.04)]">
                  <Sparkles className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#0b9c72]" />
                  <span>{getHeroIntro(scenario)}</span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:max-w-4xl xl:grid-cols-4">
                <MetricCard
                  icon={<Clock3 className="h-4 w-4" />}
                  label="Duration"
                  value={formatDuration(scenario.estimatedDurationMinutes)}
                />
                <MetricCard
                  icon={<Target className="h-4 w-4" />}
                  label="Focus"
                  value="Decision-making"
                />
                <MetricCard
                  icon={<Trophy className="h-4 w-4" />}
                  label="Latest score"
                  value={scenario.score !== null ? `${scenario.score}%` : "—"}
                />
                <MetricCard
                  icon={<Calendar className="h-4 w-4" />}
                  label="Last opened"
                  value={formatDate(scenario.lastOpenedAt) ?? "Not yet"}
                />
              </div>
            </div>
          </div>

          <aside className="flex h-full flex-col gap-4">
            {/* <div className="rounded-[28px] border border-[#e7edf3] bg-white/84 px-5 py-6 shadow-[0_10px_30px_rgba(35,45,62,0.05)] backdrop-blur-xl"> */}
            <div
              className={`relative overflow-hidden rounded-[28px] border border-white/70 bg-linear-to-br ${areaMeta.accentClass} p-5 shadow-[0_12px_30px_rgba(35,45,62,0.06)]`}
            >
              <div className="mt-3 flex items-baseline gap-2">
                <div className="text-[1.9rem] font-bold leading-none tracking-tight text-[#31425a]">
                  {progressValue}%
                </div>
                <div className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#8a97a6]">
                  Completed
                </div>
              </div>

              <p className="mt-2 text-sm leading-6 text-[#667180]">
                {getProgressSummary(scenario)}
              </p>

              <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-[#edf2f7]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressValue}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="h-full rounded-full bg-[#31425a]"
                />
              </div>
            </div>

            <div className="rounded-[28px] border border-[#e7edf3] bg-white/84 px-5 py-6 shadow-[0_10px_30px_rgba(35,45,62,0.05)] backdrop-blur-xl">
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#8a97a6]">
                Next action
              </p>

              <p className="mt-3 text-sm leading-6 text-[#667180]">
                {scenario.status === "completed"
                  ? "Open the scenario again to review how the full experience unfolded."
                  : scenario.status === "in_progress"
                    ? "Continue from your latest checkpoint and keep building momentum."
                    : "Launch the scenario to begin the guided experience."}
              </p>

              <div className="mt-5 grid gap-3">
                <Link
                  href={scenario.launchUrl}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#31425a] px-4 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#253347]"
                >
                  <PlayCircle className="h-4.5 w-4.5" />
                  {getPrimaryActionLabel(scenario)}
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    handleScrollToPanel("practice");
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#d9e2ec] bg-white px-4 py-4 text-sm font-semibold text-[#31425a] transition hover:bg-[#f8fafc]"
                >
                  <Layers3 className="h-4.5 w-4.5" />
                  Explore journey
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
              active={openPanel === "practice"}
              onClick={() => {
                setOpenPanel("practice");
              }}
              icon={<Target className="h-4 w-4" />}
              label="What you will practice"
            />
            <ToggleButton
              active={openPanel === "prepare"}
              onClick={() => {
                setOpenPanel("prepare");
              }}
              icon={<Compass className="h-4 w-4" />}
              label="Before you start"
            />
            <ToggleButton
              active={openPanel === "related"}
              onClick={() => {
                setOpenPanel("related");
              }}
              icon={<ArrowRight className="h-4 w-4" />}
              label="Related"
            />
          </div>
        </div>

        <div className="min-h-80 px-5 pb-6 pt-5 md:px-7 md:pb-7 md:pt-6">
          <AnimatePresence mode="wait">
            {openPanel === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]"
              >
                <div className="rounded-[26px] border border-[#edf2f7] bg-white/85 p-5 shadow-[0_10px_26px_rgba(35,45,62,0.04)]">
                  <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#8a97a6]">
                    Scenario overview
                  </p>
                  <p className="mt-4 text-[0.98rem] leading-8 text-[#5d6978]">
                    {scenario.description}
                  </p>
                  <p className="mt-4 text-[0.98rem] leading-8 text-[#5d6978]">
                    {scenario.instruction}
                  </p>
                </div>

                <div className="rounded-[26px] border border-[#edf2f7] bg-[#fbfcfd] p-5 shadow-[0_10px_26px_rgba(35,45,62,0.04)]">
                  <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#8a97a6]">
                    Experience highlights
                  </p>
                  <div className="mt-4 space-y-3">
                    {[
                      "A guided flow that unfolds step by step.",
                      "Feedback after key choices to keep the learning loop active.",
                      "A clear structure designed for focused practice rather than passive reading.",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-3 rounded-2xl border border-white/80 bg-white px-4 py-3"
                      >
                        <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#0b9c72]" />
                        <span className="text-sm leading-6 text-[#667180]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {openPanel === "practice" && (
              <motion.div
                key="practice"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="grid gap-4 lg:grid-cols-3"
              >
                {practicePoints.map((point, index) => (
                  <div
                    key={point}
                    className="rounded-[26px] border border-[#edf2f7] bg-white/86 p-5 shadow-[0_10px_26px_rgba(35,45,62,0.04)]"
                  >
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#e5ecf3] bg-[#f8fafc] text-[#31425a]">
                      <span className="text-sm font-bold">0{index + 1}</span>
                    </div>
                    <h3 className="mt-4 text-base font-bold text-[#31425a]">Applied practice</h3>
                    <p className="mt-3 text-sm leading-7 text-[#667180]">{point}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {openPanel === "prepare" && (
              <motion.div
                key="prepare"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]"
              >
                <div className="rounded-[26px] border border-[#edf2f7] bg-white/86 p-5 shadow-[0_10px_26px_rgba(35,45,62,0.04)]">
                  <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#8a97a6]">
                    Before you launch
                  </p>

                  <div className="mt-4 space-y-3">
                    {preparationChecklist.map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-3 rounded-2xl border border-[#edf2f7] bg-[#fbfcfd] px-4 py-3.5"
                      >
                        <Trophy className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#31425a]" />
                        <span className="text-sm leading-6 text-[#667180]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[26px] border border-[#edf2f7] bg-[#fbfcfd] p-5 shadow-[0_10px_26px_rgba(35,45,62,0.04)]">
                  <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#8a97a6]">
                    Quick tip
                  </p>
                  <p className="mt-4 text-sm leading-7 text-[#667180]">
                    This page is a calm staging point before the interactive experience. Review the
                    context, then launch when you are ready for a focused run.
                  </p>
                </div>
              </motion.div>
            )}

            {openPanel === "related" && (
              <motion.div
                key="related"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="space-y-4"
              >
                {relatedScenarios.length > 0 ? (
                  <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                    {relatedScenarios.map((item) => {
                      const relatedArea = getAreaMeta(item.area);
                      const relatedStatus = getStatusMeta(item.status);

                      return (
                        <Link
                          key={item.slug}
                          href={`/${locale}/scenarios/${item.slug}`}
                          className="group rounded-[26px] border border-[#edf2f7] bg-white/86 p-5 shadow-[0_10px_26px_rgba(35,45,62,0.04)] transition hover:-translate-y-1 hover:bg-white"
                        >
                          <div className="flex flex-wrap gap-2">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.66rem] font-bold uppercase tracking-[0.14em] ${relatedArea.badgeClass}`}
                            >
                              {relatedArea.icon}
                              {relatedArea.label}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.66rem] font-bold uppercase tracking-[0.14em] ${relatedStatus.badgeClass}`}
                            >
                              {relatedStatus.icon}
                              {relatedStatus.label}
                            </span>
                          </div>

                          <h3 className="mt-4 text-base font-bold text-[#31425a]">{item.title}</h3>
                          <p className="mt-2 text-sm leading-7 text-[#667180]">
                            {item.description}
                          </p>

                          <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#31425a]">
                            Open launcher
                            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-[26px] border border-dashed border-[#dbe3eb] bg-[#fbfcfd] px-6 py-8 text-center">
                    <p className="text-sm font-semibold text-[#31425a]">No related scenarios yet</p>
                    <p className="mt-2 text-sm leading-6 text-[#667180]">
                      Additional recommendations will appear here as the scenario library grows.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
    <div className="rounded-2xl border border-white/70 bg-white/84 p-4 shadow-[0_10px_28px_rgba(35,45,62,0.05)]">
      <div className="flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#8a97a6]">
        {icon}
        {label}
      </div>
      <p className="mt-3 text-lg font-bold text-[#31425a]">{value}</p>
    </div>
  );
}
