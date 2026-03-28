"use client";

import {
  ScenarioArea,
  ScenarioListItemViewModel,
  ScenarioProgressStatus,
} from "@/lib/scenarios/types";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Leaf,
  PlayCircle,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import { ChangeEvent, useMemo, useState } from "react";

type Props = {
  items: ScenarioListItemViewModel[];
};

const SURFACE =
  "rounded-[28px] border border-white/70 bg-white/88 shadow-[0_12px_34px_rgba(35,45,62,0.06)] backdrop-blur-xl";

const ITEMS_PER_PAGE = 9;

function getAreaMeta(area: ScenarioArea) {
  switch (area) {
    case "environmental":
      return {
        label: "Environmental",
        icon: <Leaf className="h-4 w-4" />,
        badgeClass: "border-emerald-100 bg-emerald-50 text-emerald-700",
        glowClass: "bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_45%)]",
      };
    case "social":
      return {
        label: "Social",
        icon: <Users className="h-4 w-4" />,
        badgeClass: "border-sky-100 bg-sky-50 text-sky-700",
        glowClass: "bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.14),transparent_45%)]",
      };
    case "governance":
      return {
        label: "Governance",
        icon: <ShieldCheck className="h-4 w-4" />,
        badgeClass: "border-violet-100 bg-violet-50 text-violet-700",
        glowClass: "bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.14),transparent_45%)]",
      };
    default:
      return {
        label: "Cross-cutting",
        icon: <Sparkles className="h-4 w-4" />,
        badgeClass: "border-amber-100 bg-amber-50 text-amber-700",
        glowClass: "bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.16),transparent_45%)]",
      };
  }
}

function formatDuration(minutes: number | null) {
  if (!minutes || minutes <= 0) {
    return "Self-paced";
  }

  return `${minutes} min`;
}

function getTrackingMeta(status?: ScenarioProgressStatus | null) {
  switch (status) {
    case "completed":
      return {
        label: "Completed",
        className: "text-emerald-700",
      };
    case "in_progress":
      return {
        label: "In progress",
        className: "text-amber-700",
      };
    default:
      return {
        label: "Not started",
        className: "text-[#31425a]",
      };
  }
}

export default function ScenarioLibraryShell({ items }: Props) {
  const [search, setSearch] = useState("");
  const [selectedArea, setSelectedArea] = useState<ScenarioArea | "all">("all");
  const [sortBy, setSortBy] = useState<"title" | "duration">("title");
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
        item.description.toLowerCase().includes(normalized) ||
        item.packagePath.toLowerCase().includes(normalized);

      const matchesArea = selectedArea === "all" || item.area === selectedArea;

      return matchesSearch && matchesArea;
    });

    return [...next].sort((a, b) => {
      if (sortBy === "duration") {
        const aDuration = a.estimatedDurationMinutes ?? Number.MAX_SAFE_INTEGER;
        const bDuration = b.estimatedDurationMinutes ?? Number.MAX_SAFE_INTEGER;

        return aDuration - bDuration || a.title.localeCompare(b.title);
      }

      return a.title.localeCompare(b.title);
    });
  }, [items, search, selectedArea, sortBy]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-8">
      <section className={`${SURFACE} p-5 md:p-6`}>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-2 text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-[#7b8794]">
            <SlidersHorizontal className="h-4 w-4" />
            Refine scenario view
          </div>

          <div className="text-sm text-[#667180]">
            Showing <span className="font-semibold text-[#31425a]">{filteredItems.length}</span>{" "}
            scenarios
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_repeat(2,minmax(0,1fr))]">
          <label className="group flex items-center gap-3 rounded-2xl border border-[#e8edf3] bg-white px-4 py-3.5 transition focus-within:border-[#0b9c72]/30 focus-within:shadow-[0_8px_24px_rgba(35,45,62,0.05)]">
            <Search className="h-4.5 w-4.5 text-[#98a2b3]" />
            <input
              value={search}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setSearch(e.target.value);
                handleFilterChange();
              }}
              placeholder="Search scenarios..."
              className="w-full border-none bg-transparent text-[0.95rem] text-[#31425a] outline-none"
            />
          </label>

          <select
            value={selectedArea}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setSelectedArea(e.target.value as ScenarioArea | "all");
              handleFilterChange();
            }}
            className="rounded-2xl border border-[#e8edf3] bg-white px-4 py-3.5 text-[0.95rem] text-[#31425a] outline-none focus:border-[#0b9c72]/30"
          >
            <option value="all">All ESG areas</option>
            <option value="environmental">Environmental</option>
            <option value="social">Social</option>
            <option value="governance">Governance</option>
            <option value="cross-cutting">Cross-cutting</option>
          </select>

          <select
            value={sortBy}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setSortBy(e.target.value as "title" | "duration");
              handleFilterChange();
            }}
            className="rounded-2xl border border-[#e8edf3] bg-white px-4 py-3.5 text-[0.95rem] text-[#31425a] outline-none focus:border-[#0b9c72]/30"
          >
            <option value="title">Sort: Title</option>
            <option value="duration">Sort: Duration</option>
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
                {area.replace("-", " ")}
              </button>
            ),
          )}
        </div>
      </section>

      {paginatedItems.length > 0 ? (
        <div className="space-y-8">
          <div className="grid gap-6 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {paginatedItems.map((item) => {
                const areaMeta = getAreaMeta(item.area);
                const trackingMeta = getTrackingMeta(item.status);

                return (
                  <motion.article
                    key={`${item.slug}-${item.language}`}
                    layout
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    className={`${SURFACE} group relative flex h-full flex-col overflow-hidden p-6`}
                  >
                    <div
                      className={`pointer-events-none absolute inset-0 opacity-90 ${areaMeta.glowClass}`}
                    />

                    <div className="relative flex h-full flex-1 flex-col">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wider ${areaMeta.badgeClass}`}
                        >
                          {areaMeta.icon}
                          {areaMeta.label}
                        </span>
                      </div>

                      <div className="mt-5">
                        <h2 className="text-xl font-semibold tracking-tight text-[#1f2a37]">
                          {item.title}
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-[#5f6c7b]">{item.description}</p>
                      </div>

                      <div className="mt-auto grid gap-3 pt-5 sm:grid-cols-2">
                        <div className="flex h-full min-h-23 flex-col rounded-2xl border border-[#edf1f5] bg-white px-4 py-3.5">
                          <div className="flex items-center gap-2 text-[#7b8794]">
                            <PlayCircle className="h-4 w-4" />
                            <span className="text-[0.72rem] font-semibold uppercase tracking-[0.12em]">
                              Duration
                            </span>
                          </div>
                          <p className="mt-auto pt-2 font-medium text-[#31425a]">
                            {formatDuration(item.estimatedDurationMinutes)}
                          </p>
                        </div>

                        <div className="flex h-full min-h-23 flex-col rounded-2xl border border-[#edf1f5] bg-white px-4 py-3.5">
                          <div className="flex items-center gap-2 text-[#7b8794]">
                            <ShieldCheck className="h-4 w-4" />
                            <span className="text-[0.72rem] font-semibold uppercase tracking-[0.12em]">
                              Tracking
                            </span>
                          </div>
                          <p className={`mt-auto pt-2 font-medium ${trackingMeta.className}`}>
                            {trackingMeta.label}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6">
                        <Link
                          href={item.packagePath}
                          className="inline-flex items-center gap-2 rounded-full bg-[#31425a] px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#263548]"
                        >
                          Open scenario
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
                Showing {startIndex + 1}–
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredItems.length)} of{" "}
                {filteredItems.length}
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setCurrentPage((page) => Math.max(1, page - 1));
                  }}
                  disabled={currentPage === 1}
                  className="rounded-full border border-[#d9e1ea] px-4 py-2 font-medium text-[#31425a] transition hover:bg-[#f7fafc] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
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
                  Next
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
            <h2 className="mt-5 text-xl font-semibold text-[#1f2a37]">No scenarios found</h2>
            <p className="mt-3 text-sm leading-6 text-[#5f6c7b]">
              Try adjusting the ESG area filter or search phrase to explore scenario metadata.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
