"use client";

import { CaseStudyArea, CaseStudyListItemViewModel } from "@/lib/eportfolio/types";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  FolderOpen,
  Layers3,
  Leaf,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ChangeEvent, useMemo, useState } from "react";

type Props = {
  locale: string;
  items: CaseStudyListItemViewModel[];
};

const SURFACE =
  "rounded-[28px] border border-white/70 bg-white/88 shadow-[0_12px_34px_rgba(35,45,62,0.06)] backdrop-blur-xl";

const ITEMS_PER_PAGE = 9;

function getAreaMeta(area: CaseStudyArea, t: ReturnType<typeof useTranslations>) {
  switch (area) {
    case "environmental":
      return {
        label: t("area.environmental"),
        icon: <Leaf className="h-4 w-4" />,
        badgeClass: "border-emerald-100 bg-emerald-50 text-emerald-700",
        glowClass: "bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.15),transparent_46%)]",
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

export default function CaseStudyListShell({ locale, items }: Props) {
  const t = useTranslations("Protected.CaseStudyListShell");
  const [search, setSearch] = useState("");
  const [selectedArea, setSelectedArea] = useState<CaseStudyArea | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "todo" | "completed">("all");
  const [sortBy, setSortBy] = useState<"recommended" | "title">("recommended");
  const [currentPage, setCurrentPage] = useState(1);

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const filteredItems = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    const next = items.filter((item) => {
      const matchesSearch =
        normalized.length === 0 ||
        item.title.toLowerCase().includes(normalized) ||
        item.summary.toLowerCase().includes(normalized) ||
        (item.organization?.toLowerCase().includes(normalized) ?? false) ||
        (item.industry?.toLowerCase().includes(normalized) ?? false);

      const matchesArea = selectedArea === "all" || item.area === selectedArea;
      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "completed" && item.isCompleted) ||
        (selectedStatus === "todo" && !item.isCompleted);

      return matchesSearch && matchesArea && matchesStatus;
    });

    return [...next].sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }

      const weight = (item: CaseStudyListItemViewModel) => {
        const featuredWeight = item.isFeatured ? 3 : 0;
        const todoWeight = item.isCompleted ? 0 : 1;
        return featuredWeight + todoWeight;
      };

      return weight(b) - weight(a) || a.title.localeCompare(b.title);
    });
  }, [items, search, selectedArea, selectedStatus, sortBy]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const featuredSlug = useMemo(() => {
    return items.find((item) => item.isFeatured)?.slug ?? null;
  }, [items]);

  return (
    <div className="space-y-8">
      <section className={`${SURFACE} p-5 md:p-6`}>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-2 text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-[#7b8794]">
            <SlidersHorizontal className="h-4 w-4" />
            {t("refineTitle")}
          </div>
          <div className="text-sm text-[#667180]">
            {t("showingCount", { count: filteredItems.length })}
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))]">
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
            value={selectedArea}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setSelectedArea(e.target.value as CaseStudyArea | "all");
              handleFilterChange();
            }}
            className="rounded-2xl border border-[#e8edf3] bg-white px-4 py-3.5 text-[0.95rem] text-[#31425a] outline-none focus:border-[#0b9c72]/30"
          >
            <option value="all">{t("area.all")}</option>
            <option value="environmental">{t("area.environmental")}</option>
            <option value="social">{t("area.social")}</option>
            <option value="governance">{t("area.governance")}</option>
            <option value="cross-cutting">{t("area.crossCutting")}</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setSelectedStatus(e.target.value as "all" | "todo" | "completed");
              handleFilterChange();
            }}
            className="rounded-2xl border border-[#e8edf3] bg-white px-4 py-3.5 text-[0.95rem] text-[#31425a] outline-none focus:border-[#0b9c72]/30"
          >
            <option value="all">{t("filters.status.all")}</option>
            <option value="todo">{t("filters.status.todo")}</option>
            <option value="completed">{t("filters.status.completed")}</option>
          </select>

          <select
            value={sortBy}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setSortBy(e.target.value as "recommended" | "title");
              handleFilterChange();
            }}
            className="rounded-2xl border border-[#e8edf3] bg-white px-4 py-3.5 text-[0.95rem] text-[#31425a] outline-none focus:border-[#0b9c72]/30"
          >
            <option value="recommended">{t("filters.sort.recommended")}</option>
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

      {paginatedItems.length > 0 ? (
        <div className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {paginatedItems.map((item) => {
                const areaMeta = getAreaMeta(item.area, t);
                const isFeatured = item.slug === featuredSlug;

                return (
                  <motion.article
                    key={item.slug}
                    layout
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    className={`${SURFACE} group relative flex flex-col overflow-hidden p-6`}
                  >
                    <div
                      className={`pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100 ${areaMeta.glowClass}`}
                    />

                    <div className="relative flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wider ${areaMeta.badgeClass}`}
                        >
                          {areaMeta.icon} {areaMeta.label}
                        </span>

                        <div className="flex shrink-0 flex-col items-end gap-2">
                          {isFeatured && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0b9c72] px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-white shadow-sm">
                              <Sparkles className="h-3 w-3" />
                              {t("featured")}
                            </span>
                          )}

                          {item.isCompleted && (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-emerald-700">
                              <CheckCircle2 className="h-3 w-3" />
                              {t("completed")}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-5 space-y-4">
                        <div>
                          <h2 className="text-xl font-semibold tracking-tight text-[#1f2a37]">
                            {item.title}
                          </h2>
                          <p className="mt-3 text-sm leading-6 text-[#5f6c7b]">{item.summary}</p>
                        </div>

                        <div className="space-y-2 text-sm text-[#516071]">
                          {item.organization && (
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-[#7b8794]" />
                              <span>{item.organization}</span>
                            </div>
                          )}

                          {item.industry && (
                            <div className="flex items-center gap-2">
                              <FolderOpen className="h-4 w-4 text-[#7b8794]" />
                              <span>{item.industry}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end">
                        <Link
                          href={`/${locale}/eportfolio/${item.slug}`}
                          className="inline-flex items-center gap-2 rounded-full bg-[#31425a] px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#263548]"
                        >
                          {t("actions.open")} <ArrowRight className="h-4 w-4" />
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
                  start: startIndex + 1,
                  end: Math.min(startIndex + ITEMS_PER_PAGE, filteredItems.length),
                  total: filteredItems.length,
                })}
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setCurrentPage((page) => Math.max(1, page - 1));
                  }}
                  disabled={currentPage === 1}
                  className="rounded-full border border-[#d9e1ea] px-4 py-2 font-medium text-[#31425a] transition hover:bg-[#f7fafc] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t("pagination.previous")}
                </button>
                <span className="px-2 font-semibold text-[#31425a]">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => {
                    setCurrentPage((page) => Math.min(totalPages, page + 1));
                  }}
                  disabled={currentPage === totalPages}
                  className="rounded-full border border-[#d9e1ea] px-4 py-2 font-medium text-[#31425a] transition hover:bg-[#f7fafc] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t("pagination.next")}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <section className={`${SURFACE} p-8 text-center`}>
          <div className="mx-auto max-w-xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f4f7fa] text-[#607086]">
              <Search className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-xl font-semibold text-[#1f2a37]">{t("empty.title")}</h2>
            <p className="mt-3 text-sm leading-6 text-[#5f6c7b]">{t("empty.description")}</p>
          </div>
        </section>
      )}
    </div>
  );
}
