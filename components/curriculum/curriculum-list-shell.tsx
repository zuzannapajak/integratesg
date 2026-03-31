"use client";

import { CurriculumModuleViewModel } from "@/lib/curriculum/types";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CircleDashed,
  Clock3,
  Layers3,
  Leaf,
  Library,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Users,
  XCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ChangeEvent, useMemo, useState } from "react";

type ModuleArea = "environmental" | "social" | "governance" | "cross-cutting";
type ModuleStatus = "not_started" | "in_progress" | "completed" | "failed";

type Props = {
  locale: string;
  items: CurriculumModuleViewModel[];
  emptyTitle?: string;
  emptyDescription?: string;
  showRefineControls?: boolean;
};

const SURFACE =
  "rounded-[28px] border border-white/70 bg-white/88 shadow-[0_12px_34px_rgba(35,45,62,0.06)] backdrop-blur-xl";

const ITEMS_PER_PAGE = 12;

function getAreaMeta(area: ModuleArea, t: ReturnType<typeof useTranslations>) {
  switch (area) {
    case "environmental":
      return {
        label: t("area.environmental"),
        icon: <Leaf className="h-4 w-4" />,
        badgeClass: "border-emerald-100 bg-emerald-50 text-emerald-700",
        glowClass: "bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_45%)]",
      };
    case "social":
      return {
        label: t("area.social"),
        icon: <Users className="h-4 w-4" />,
        badgeClass: "border-sky-100 bg-sky-50 text-sky-700",
        glowClass: "bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.14),transparent_45%)]",
      };
    case "governance":
      return {
        label: t("area.governance"),
        icon: <ShieldCheck className="h-4 w-4" />,
        badgeClass: "border-violet-100 bg-violet-50 text-violet-700",
        glowClass: "bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.14),transparent_45%)]",
      };
    default:
      return {
        label: t("area.crossCutting"),
        icon: <Layers3 className="h-4 w-4" />,
        badgeClass: "border-amber-100 bg-amber-50 text-amber-700",
        glowClass: "bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.16),transparent_45%)]",
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
        textClassName: "text-emerald-700",
      };
    case "in_progress":
      return {
        label: t("status.inProgress"),
        icon: <CircleDashed className="h-4 w-4" />,
        badgeClass: "border-orange-100 bg-orange-50 text-orange-700",
        textClassName: "text-amber-700",
      };
    case "failed":
      return {
        label: t("status.failed"),
        icon: <XCircle className="h-4 w-4" />,
        badgeClass: "border-red-100 bg-red-50 text-red-700",
        textClassName: "text-red-700",
      };
    default:
      return {
        label: t("status.notStarted"),
        icon: <BookOpen className="h-4 w-4" />,
        badgeClass: "border-slate-200 bg-slate-50 text-slate-600",
        textClassName: "text-[#31425a]",
      };
  }
}

export default function CurriculumListShell({
  locale,
  items,
  emptyTitle,
  emptyDescription,
  showRefineControls = true,
}: Props) {
  const t = useTranslations("Protected.CurriculumListShell");
  const [search, setSearch] = useState("");
  const [selectedArea, setSelectedArea] = useState<ModuleArea | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<ModuleStatus | "all">("all");
  const [sortBy, setSortBy] = useState<"recommended" | "progress" | "title">("recommended");
  const [currentPage, setCurrentPage] = useState(1);

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const filteredModules = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    const next = items.filter((module) => {
      const matchesSearch =
        !showRefineControls ||
        normalized.length === 0 ||
        module.title.toLowerCase().includes(normalized) ||
        module.description.toLowerCase().includes(normalized) ||
        module.subtitle.toLowerCase().includes(normalized);

      const matchesArea =
        !showRefineControls || selectedArea === "all" || module.area === selectedArea;

      const matchesStatus =
        !showRefineControls || selectedStatus === "all" || module.status === selectedStatus;

      return matchesSearch && matchesArea && matchesStatus;
    });

    return [...next].sort((a, b) => {
      if (showRefineControls && sortBy === "title") {
        return a.title.localeCompare(b.title);
      }

      if (showRefineControls && sortBy === "progress") {
        return b.progress - a.progress || a.title.localeCompare(b.title);
      }

      const weight = (module: CurriculumModuleViewModel) =>
        module.status === "in_progress"
          ? 3
          : module.status === "not_started"
            ? 2
            : module.status === "completed"
              ? 1
              : 0;

      return weight(b) - weight(a) || a.title.localeCompare(b.title);
    });
  }, [items, search, selectedArea, selectedStatus, sortBy, showRefineControls]);

  const totalPages = Math.ceil(filteredModules.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedModules = filteredModules.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const rangeStart = filteredModules.length === 0 ? 0 : startIndex + 1;
  const rangeEnd = Math.min(startIndex + ITEMS_PER_PAGE, filteredModules.length);

  const recommendedSlug = useMemo(() => {
    return (
      items.find((module) => module.status === "in_progress")?.slug ??
      items.find((module) => module.status === "not_started")?.slug
    );
  }, [items]);

  return (
    <div className="space-y-8">
      {showRefineControls && (
        <section className={`${SURFACE} p-5 md:p-6`}>
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-2 text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-[#7b8794]">
              <SlidersHorizontal className="h-4 w-4" />
              {t("refineTitle")}
            </div>

            <div className="text-sm text-[#667180]">
              {t("showingCount", { count: filteredModules.length })}
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_repeat(2,minmax(0,1fr))]">
            <label className="group flex items-center gap-3 rounded-2xl border border-[#e8edf3] bg-white px-4 py-3.5 transition focus-within:border-[#0b9c72]/30 focus-within:shadow-[0_8px_24px_rgba(35,45,62,0.05)]">
              <Search className="h-4.5 w-4.5 text-[#98a2b3]" />
              <input
                value={search}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setSearch(e.target.value);
                  handleFilterChange();
                }}
                placeholder={t("searchPlaceholder")}
                className="w-full border-none bg-transparent text-[0.95rem] text-[#31425a] outline-none"
              />
            </label>

            <select
              value={selectedStatus}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setSelectedStatus(e.target.value as ModuleStatus | "all");
                handleFilterChange();
              }}
              className="rounded-2xl border border-[#e8edf3] bg-white px-4 py-3.5 text-[0.95rem] text-[#31425a] outline-none focus:border-[#0b9c72]/30"
            >
              <option value="all">{t("filters.status.all")}</option>
              <option value="not_started">{t("status.notStarted")}</option>
              <option value="in_progress">{t("status.inProgress")}</option>
              <option value="completed">{t("status.completed")}</option>
              <option value="failed">{t("status.failed")}</option>
            </select>

            <select
              value={sortBy}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setSortBy(e.target.value as "recommended" | "progress" | "title");
                handleFilterChange();
              }}
              className="rounded-2xl border border-[#e8edf3] bg-white px-4 py-3.5 text-[0.95rem] text-[#31425a] outline-none focus:border-[#0b9c72]/30"
            >
              <option value="recommended">{t("filters.sort.recommended")}</option>
              <option value="progress">{t("filters.sort.progress")}</option>
              <option value="title">{t("filters.sort.title")}</option>
            </select>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {(["all", "environmental", "social", "governance", "cross-cutting"] as const).map(
              (area) => (
                <button
                  key={area}
                  onClick={() => {
                    setSelectedArea(area);
                    handleFilterChange();
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition ${
                    selectedArea === area
                      ? "bg-[#31425a] text-white shadow-md"
                      : "bg-[#f4f7fa] text-[#516071] hover:bg-[#eaf0f5]"
                  }`}
                >
                  {area === "all" ? t("area.all") : getAreaMeta(area, t).label}
                </button>
              ),
            )}
          </div>
        </section>
      )}

      {paginatedModules.length > 0 ? (
        <div className="space-y-4">
          {!showRefineControls && (
            <div className="flex justify-end">
              <div className="px-3 py-1.5 text-sm text-[#667180]">
                {t("showingCount", { count: filteredModules.length })}
              </div>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {paginatedModules.map((module, index) => {
                const areaMeta = getAreaMeta(module.area, t);
                const statusMeta = getStatusMeta(module.status, t);
                const isRecommended = module.slug === recommendedSlug;

                return (
                  <motion.article
                    key={module.slug}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.22, delay: index * 0.02 }}
                    className={`${SURFACE} group relative flex flex-col overflow-hidden p-5 md:p-6`}
                  >
                    <div
                      className={`pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100 ${areaMeta.glowClass}`}
                    />

                    <div className="relative flex flex-1 flex-col">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.14em] ${areaMeta.badgeClass}`}
                        >
                          {areaMeta.icon}
                          {areaMeta.label}
                        </span>

                        {isRecommended && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0b9c72] px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white shadow-sm">
                            <Sparkles className="h-3.5 w-3.5" />
                            {t("recommended")}
                          </span>
                        )}
                      </div>

                      <div className="mt-5">
                        {module.subtitle ? (
                          <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#8a97a6]">
                            {module.subtitle}
                          </p>
                        ) : null}

                        <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#1f2a37]">
                          {module.title}
                        </h2>
                      </div>

                      <p className="mt-4 flex-1 text-sm leading-6 text-[#5f6c7b] line-clamp-3">
                        {module.description}
                      </p>

                      <div className="grid gap-3 pt-5 sm:grid-cols-2">
                        <InfoPill
                          heading={t("info.duration")}
                          icon={<Clock3 />}
                          label={module.duration}
                        />

                        <InfoPill
                          heading={t("info.lessons")}
                          icon={<Library />}
                          label={`${module.lessons}`}
                        />
                      </div>

                      <div className="mt-6">
                        <div className="mb-2 flex items-center justify-between text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#7b8794]">
                          <span>{statusMeta.label}</span>
                          <span className="text-[#31425a]">{module.progress}%</span>
                        </div>

                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#edf2f7]">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${module.progress}%` }}
                            className="h-full bg-[#0b9c72]"
                          />
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end">
                        <Link
                          href={`/${locale}/curriculum/${module.slug}`}
                          className="inline-flex items-center gap-2 rounded-full bg-[#31425a] px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#263548]"
                        >
                          {module.status === "completed"
                            ? t("actions.review")
                            : t("actions.continue")}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between rounded-2xl border border-[#e8edf3] bg-white px-5 py-4 text-sm text-[#5f6c7b]">
              <p>
                {t("pagination.showingRange", {
                  start: rangeStart,
                  end: rangeEnd,
                  total: filteredModules.length,
                })}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage((page) => Math.max(1, page - 1));
                  }}
                  disabled={currentPage === 1}
                  className="rounded-full border border-[#d9e1ea] px-4 py-2 font-medium text-[#31425a] transition hover:bg-[#f7fafc] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="inline-flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    {t("pagination.previous")}
                  </span>
                </button>

                <span className="px-2 font-semibold text-[#31425a]">
                  {currentPage} / {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage((page) => Math.min(totalPages, page + 1));
                  }}
                  disabled={currentPage === totalPages}
                  className="rounded-full border border-[#d9e1ea] px-4 py-2 font-medium text-[#31425a] transition hover:bg-[#f7fafc] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="inline-flex items-center gap-2">
                    {t("pagination.next")}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={`${SURFACE} p-8 text-center`}>
          <h3 className="text-lg font-semibold text-[#31425a]">{emptyTitle ?? t("empty.title")}</h3>
          <p className="mt-2 text-[#667180]">{emptyDescription ?? t("empty.description")}</p>
        </div>
      )}
    </div>
  );
}

function InfoPill({
  heading,
  icon,
  label,
  labelClassName,
}: {
  heading: string;
  icon: React.ReactNode;
  label: string;
  labelClassName?: string;
}) {
  return (
    <div className="flex min-h-23 flex-col rounded-2xl border border-[#edf1f5] bg-white px-4 py-3.5 text-[#556274] [&_svg]:h-4.5 [&_svg]:w-4.5">
      <div className="flex items-center gap-2 text-[#7b8794]">
        <span className="text-[#0b9c72]">{icon}</span>
        <span className="text-[0.72rem] font-semibold uppercase tracking-[0.12em]">{heading}</span>
      </div>

      <p className={`mt-auto pt-2 text-sm font-medium ${labelClassName ?? "text-[#31425a]"}`}>
        {label}
      </p>
    </div>
  );
}
