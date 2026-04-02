"use client";

import { CurriculumModuleViewModel } from "@/lib/curriculum/types";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  CircleDashed,
  Clock3,
  Compass,
  Layers3,
  Leaf,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRef, useState } from "react";

type ModuleArea = "environmental" | "social" | "governance" | "cross-cutting";
type ModuleStatus = "not_started" | "in_progress" | "completed" | "failed";

type Props = {
  locale: string;
  module: CurriculumModuleViewModel;
  relatedModules: CurriculumModuleViewModel[];
};

const SURFACE =
  "rounded-[30px] border border-white/70 bg-white/88 shadow-[0_12px_34px_rgba(35,45,62,0.06)] backdrop-blur-xl";

function formatDurationLabel(minutes: number | null, t: ReturnType<typeof useTranslations>) {
  if (!minutes || minutes <= 0) {
    return t("generated.duration.selfPaced");
  }

  return t("generated.duration.minutes", { minutes });
}

function renderToken(
  token: { key: string; values?: Record<string, string | number> },
  t: ReturnType<typeof useTranslations>,
) {
  return t(token.key, token.values ?? {});
}

function getAreaMeta(area: ModuleArea, t: ReturnType<typeof useTranslations>) {
  switch (area) {
    case "environmental":
      return {
        label: t("area.environmental"),
        icon: <Leaf className="h-4 w-4" />,
        badgeClass: "border-emerald-100 bg-emerald-50 text-emerald-700",
        glowClass: "bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_46%)]",
        accentClass: "from-emerald-100/90 via-white to-emerald-50/80",
        orbitClass: "border-emerald-200/70 bg-emerald-100/55 text-emerald-700",
      };
    case "social":
      return {
        label: t("area.social"),
        icon: <Users className="h-4 w-4" />,
        badgeClass: "border-sky-100 bg-sky-50 text-sky-700",
        glowClass: "bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.15),transparent_46%)]",
        accentClass: "from-sky-100/90 via-white to-sky-50/80",
        orbitClass: "border-sky-200/70 bg-sky-100/55 text-sky-700",
      };
    case "governance":
      return {
        label: t("area.governance"),
        icon: <ShieldCheck className="h-4 w-4" />,
        badgeClass: "border-violet-100 bg-violet-50 text-violet-700",
        glowClass: "bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.15),transparent_46%)]",
        accentClass: "from-violet-100/90 via-white to-violet-50/80",
        orbitClass: "border-violet-200/70 bg-violet-100/55 text-violet-700",
      };
    default:
      return {
        label: t("area.crossCutting"),
        icon: <Layers3 className="h-4 w-4" />,
        badgeClass: "border-amber-100 bg-amber-50 text-amber-700",
        glowClass: "bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.18),transparent_46%)]",
        accentClass: "from-amber-100/90 via-white to-amber-50/80",
        orbitClass: "border-amber-200/70 bg-amber-100/55 text-amber-700",
      };
  }
}

function getStatusMeta(status: ModuleStatus, t: ReturnType<typeof useTranslations>) {
  switch (status) {
    case "completed":
      return {
        label: t("status.completed"),
        icon: <CheckCircle2 className="h-4 w-4" />,
        badgeClass: "border-emerald-100 bg-emerald-50 text-emerald-700",
      };
    case "in_progress":
      return {
        label: t("status.inProgress"),
        icon: <CircleDashed className="h-4 w-4" />,
        badgeClass: "border-orange-100 bg-orange-50 text-orange-700",
      };
    case "failed":
      return {
        label: t("status.failed"),
        icon: <CircleDashed className="h-4 w-4" />,
        badgeClass: "border-rose-100 bg-rose-50 text-rose-700",
      };
    default:
      return {
        label: t("status.readyToStart"),
        icon: <BookOpen className="h-4 w-4" />,
        badgeClass: "border-slate-200 bg-slate-50 text-slate-600",
      };
  }
}

function getOverviewCopy(module: CurriculumModuleViewModel, t: ReturnType<typeof useTranslations>) {
  if (module.content?.trim()) {
    return module.content;
  }

  if (module.area === "environmental") {
    return t("overviewCopy.environmental");
  }

  if (module.area === "social") {
    return t("overviewCopy.social");
  }

  if (module.area === "governance") {
    return t("overviewCopy.governance");
  }

  return t("overviewCopy.crossCutting");
}

function getHeroIntro(module: CurriculumModuleViewModel, t: ReturnType<typeof useTranslations>) {
  switch (module.progressState.currentStage) {
    case "pre_quiz":
      return t("heroIntro.preQuiz");
    case "lessons":
      return t("heroIntro.lessons");
    case "post_quiz":
      return t("heroIntro.postQuiz");
    case "completed":
      return t("heroIntro.completed");
    default:
      return t("heroIntro.default");
  }
}

function getProgressSummary(
  module: CurriculumModuleViewModel,
  t: ReturnType<typeof useTranslations>,
) {
  switch (module.progressState.currentStage) {
    case "pre_quiz":
      return t("progressSummary.preQuiz");
    case "lessons":
      return t("progressSummary.lessonInProgress", {
        index: module.progressState.currentLessonIndex,
      });
    case "post_quiz":
      return t("progressSummary.postQuiz");
    case "completed":
      return t("progressSummary.completed");
    default:
      return t("progressSummary.default");
  }
}

export default function CourseDetailShell({ locale, module, relatedModules }: Props) {
  const t = useTranslations("Protected.CourseDetailShell");
  const [openPanel, setOpenPanel] = useState<"overview" | "outcomes" | "flow" | "progress">(
    "overview",
  );
  const contentSectionRef = useRef<HTMLDivElement | null>(null);

  const areaMeta = getAreaMeta(module.area, t);
  const statusMeta = getStatusMeta(module.status, t);

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
          {t("back")}
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

                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e8edf3] bg-white/70 px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#5f6f82]">
                  <Trophy className="h-3.5 w-3.5" />
                  {t(`difficulty.${module.difficulty}`)}
                </span>
              </div>

              <div className="max-w-4xl">
                <p className="text-[0.76rem] font-bold uppercase tracking-[0.18em] text-[#8a97a6]">
                  {module.subtitle ?? t("fallbacks.subtitle")}
                </p>

                <h1 className="mt-3 max-w-4xl text-3xl font-bold tracking-[-0.035em] text-[#31425a] md:text-4xl xl:text-[3.05rem] xl:leading-[1.03]">
                  {module.title}
                </h1>

                <p className="mt-5 max-w-3xl text-[1rem] leading-8 text-[#667180] md:text-[1.04rem]">
                  {module.description ?? t("fallbacks.description")}
                </p>

                <div className="mt-6 inline-flex items-start gap-2 rounded-2xl border border-[#e8edf3] bg-white/86 px-4 py-3 text-sm text-[#556274] shadow-[0_8px_24px_rgba(35,45,62,0.04)]">
                  <Sparkles className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#0b9c72]" />
                  <span>{getHeroIntro(module, t)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:mt-auto xl:max-w-4xl xl:grid-cols-4">
              <MetricCard
                icon={<Clock3 className="h-4 w-4" />}
                label={t("metrics.duration")}
                value={formatDurationLabel(module.durationMinutes, t)}
              />
              <MetricCard
                icon={<Layers3 className="h-4 w-4" />}
                label={t("metrics.lessons")}
                value={`${module.lessons}`}
              />
              <MetricCard
                icon={<BookOpen className="h-4 w-4" />}
                label={t("metrics.checkpoints")}
                value={`${module.quizzes}`}
              />
              <MetricCard
                icon={<Compass className="h-4 w-4" />}
                label={t("metrics.currentStep")}
                value={renderToken(module.progressState.currentLocation, t)}
              />
            </div>
          </div>

          <aside className="flex h-full flex-col gap-4">
            <div
              className={`relative overflow-hidden rounded-[28px] border border-white/70 bg-linear-to-br ${areaMeta.accentClass} p-5 shadow-[0_12px_30px_rgba(35,45,62,0.06)]`}
            >
              <div className="mt-3 flex items-baseline gap-2">
                <div className="text-[1.9rem] font-bold leading-none tracking-tight text-[#31425a]">
                  {module.progress}%
                </div>
                <div className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#8a97a6]">
                  {t("metrics.completed")}
                </div>
              </div>

              <p className="mt-2 text-sm leading-6 text-[#667180]">
                {getProgressSummary(module, t)}
              </p>

              <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-[#edf2f7]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${module.progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="h-full rounded-full bg-[#31425a]"
                />
              </div>
            </div>

            <div className="rounded-[28px] border border-white/70 bg-white/86 px-5 py-6 shadow-[0_10px_30px_rgba(35,45,62,0.05)] backdrop-blur-xl">
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#8a97a6]">
                {t("nextAction.title")}
              </p>

              <p className="mt-3 text-sm leading-6 text-[#667180]">
                {module.progressState.currentStage === "completed"
                  ? t("nextAction.completedDescription")
                  : t("nextAction.defaultDescription")}
              </p>

              <div className="mt-5 grid gap-3">
                <Link
                  href={`/${locale}/curriculum/${module.slug}/learn`}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#31425a] px-4 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#253347]"
                >
                  <PlayCircle className="h-4.5 w-4.5" />
                  {module.progressState.currentStage === "completed"
                    ? t("nextAction.reviewWorkspace")
                    : renderToken(module.progressState.nextAction, t)}
                </Link>

                <button
                  type="button"
                  onClick={handleScrollToFlow}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#d9e2ec] bg-white px-4 py-4 text-sm font-semibold text-[#31425a] transition hover:bg-[#f8fafc]"
                >
                  <Layers3 className="h-4.5 w-4.5" />
                  {t("nextAction.viewFlow")}
                </button>
              </div>
            </div>

            {relatedModules.length > 0 && (
              <div className="rounded-[28px] border border-white/70 bg-white/86 p-5 shadow-[0_10px_30px_rgba(35,45,62,0.05)] backdrop-blur-xl">
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#8a97a6]">
                  {t("relatedModules")}
                </p>

                <div className="mt-4 space-y-3">
                  {relatedModules.slice(0, 3).map((item) => {
                    const relatedArea = getAreaMeta(item.area, t);

                    return (
                      <Link
                        key={item.slug}
                        href={`/${locale}/curriculum/${item.slug}`}
                        className="group block rounded-2xl border border-[#e8edf3] bg-white/76 p-4 transition hover:-translate-y-0.5 hover:bg-white"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.66rem] font-bold uppercase tracking-[0.14em] ${relatedArea.badgeClass}`}
                            >
                              {relatedArea.icon}
                              {relatedArea.label}
                            </span>

                            <h3 className="mt-3 text-sm font-bold text-[#31425a]">{item.title}</h3>
                            <p className="mt-1 text-sm text-[#667180]">{item.subtitle}</p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
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
              label={t("tabs.overview")}
            />
            <ToggleButton
              active={openPanel === "outcomes"}
              onClick={() => {
                setOpenPanel("outcomes");
              }}
              icon={<CheckCircle2 className="h-4 w-4" />}
              label={t("tabs.outcomes")}
            />
            <ToggleButton
              active={openPanel === "flow"}
              onClick={() => {
                setOpenPanel("flow");
              }}
              icon={<Layers3 className="h-4 w-4" />}
              label={t("tabs.flow")}
            />
            <ToggleButton
              active={openPanel === "progress"}
              onClick={() => {
                setOpenPanel("progress");
              }}
              icon={<CircleDashed className="h-4 w-4" />}
              label={t("tabs.progress")}
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
              <SectionTitle
                eyebrow={t("sections.overviewEyebrow")}
                title={t("sections.overviewTitle")}
              />

              <div className="mt-5 max-w-4xl">
                <p className="text-[0.98rem] leading-8 text-[#667180]">
                  {getOverviewCopy(module, t)}
                </p>
              </div>

              <div className="mt-7 grid gap-4 md:grid-cols-2">
                <InsightCard
                  title={t("insights.practicalTitle")}
                  text={t("insights.practicalText")}
                />
                <InsightCard
                  title={t("insights.progressionTitle")}
                  text={t("insights.progressionText")}
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
              <SectionTitle
                eyebrow={t("sections.outcomesEyebrow")}
                title={t("sections.outcomesTitle")}
              />

              <div className="mt-5 grid gap-3">
                {module.outcomes.map((outcome, index) => (
                  <div
                    key={`${module.slug}-outcome-${index}`}
                    className="flex items-start gap-3 rounded-2xl border border-[#e8edf3] bg-white/72 px-4 py-4"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0b9c72] text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <p className="pt-1 text-sm leading-6 text-[#556274]">
                      {renderToken(outcome, t)}
                    </p>
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
              <SectionTitle eyebrow={t("sections.flowEyebrow")} title={t("sections.flowTitle")} />

              <div className="mt-5 space-y-3">
                {module.structure.map((step, index) => {
                  const isActiveOrPast = index < module.progressState.completedLessons + 1;

                  return (
                    <div
                      key={renderToken(step, t)}
                      className={`flex items-center gap-4 rounded-2xl border px-4 py-4 ${
                        isActiveOrPast
                          ? "border-emerald-200 bg-emerald-50/60"
                          : "border-[#e8edf3] bg-white/72"
                      }`}
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d9e2ec] bg-white text-sm font-bold text-[#31425a]">
                        {index + 1}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[#31425a]">
                          {renderToken(step, t)}
                        </p>
                        <p className="mt-1 text-sm text-[#667180]">
                          {index === 0
                            ? t("flowDescriptions.opening")
                            : index === module.structure.length - 1
                              ? t("flowDescriptions.closing")
                              : t("flowDescriptions.lessons", {
                                  completed: module.progressState.completedLessons,
                                  total: module.progressState.totalLessons,
                                })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {openPanel === "progress" && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
              className="p-5 md:p-7"
            >
              <SectionTitle
                eyebrow={t("sections.progressEyebrow")}
                title={t("sections.progressTitle")}
              />

              <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(280px,360px)]">
                <div className="space-y-5">
                  <div className="rounded-2xl border border-[#e8edf3] bg-white/72 p-5">
                    <p className="text-sm font-semibold text-[#31425a]">
                      {t("progress.currentLocation")}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#667180]">
                      renderToken(module.progressState.currentLocation, t)
                    </p>

                    <div className="mt-5">
                      <div className="mb-2 flex items-center justify-between text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#8a97a6]">
                        <span>{t("progress.lessonsCompleted")}</span>
                        <span>
                          {module.progressState.completedLessons}/
                          {module.progressState.totalLessons}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[#edf2f7]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${
                              (module.progressState.completedLessons /
                                Math.max(module.progressState.totalLessons, 1)) *
                              100
                            }%`,
                          }}
                          transition={{ duration: 0.4 }}
                          className="h-full rounded-full bg-[#0b9c72]"
                        />
                      </div>
                    </div>
                  </div>

                  <AttemptBlock
                    title={t("progress.openingCheckpointHistory")}
                    attempts={module.progressState.preQuizAttempts}
                    emptyText={t("progress.openingCheckpointEmpty")}
                    t={t}
                  />

                  <AttemptBlock
                    title={t("progress.finalCheckpointHistory")}
                    attempts={module.progressState.postQuizAttempts}
                    emptyText={t("progress.finalCheckpointEmpty")}
                    t={t}
                  />
                </div>

                <div className="rounded-2xl border border-[#e8edf3] bg-white/72 p-5">
                  <p className="text-sm font-semibold text-[#31425a]">
                    {t("progress.lessonStatus")}
                  </p>

                  <div className="mt-4 space-y-3">
                    {module.lessonsData.map((lesson) => {
                      const isCompleted = lesson.index <= module.progressState.completedLessons;
                      const isCurrent =
                        module.progressState.currentStage === "lessons" &&
                        lesson.index === module.progressState.currentLessonIndex;

                      return (
                        <div
                          key={lesson.slug}
                          className={`rounded-2xl border px-4 py-4 ${
                            isCompleted
                              ? "border-emerald-200 bg-emerald-50/70"
                              : isCurrent
                                ? "border-[#31425a] bg-[#f8fafc]"
                                : "border-[#e8edf3] bg-white"
                          }`}
                        >
                          <div className="text-sm font-semibold text-[#31425a]">{lesson.title}</div>
                          <div className="mt-1 text-sm text-[#667180]">{lesson.summary}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
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

function AttemptBlock({
  title,
  attempts,
  emptyText,
  t,
}: {
  title: string;
  attempts: CurriculumModuleViewModel["progressState"]["preQuizAttempts"];
  emptyText: string;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="rounded-2xl border border-[#e8edf3] bg-white/72 p-5">
      <p className="text-sm font-semibold text-[#31425a]">{title}</p>

      {attempts.length === 0 ? (
        <p className="mt-3 text-sm leading-6 text-[#667180]">{emptyText}</p>
      ) : (
        <div className="mt-4 space-y-3">
          {attempts.map((attempt) => (
            <div
              key={`${title}-${attempt.attemptNumber}`}
              className="rounded-2xl border border-[#e8edf3] bg-white px-4 py-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm font-semibold text-[#31425a]">
                  {t("attempt.attemptLabel", { number: attempt.attemptNumber })}
                </div>
                <div className="text-sm font-semibold text-[#31425a]">{attempt.score}%</div>
              </div>
              <p className="mt-1 text-sm text-[#667180]">
                {t("attempt.correctSummary", {
                  correct: attempt.correctCount,
                  total: attempt.totalQuestions,
                  submittedAt: attempt.submittedAt,
                })}
              </p>
              {attempt.flaggedQuestionIds.length > 0 ? (
                <p className="mt-1 text-sm text-[#8a97a6]">
                  {t("attempt.flaggedQuestions", {
                    count: attempt.flaggedQuestionIds.length,
                  })}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
