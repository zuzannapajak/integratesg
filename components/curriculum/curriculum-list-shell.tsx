"use client";

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
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { ChangeEvent, useMemo, useState } from "react";

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

const SURFACE =
  "rounded-[28px] border border-white/70 bg-white/88 shadow-[0_12px_34px_rgba(35,45,62,0.06)] backdrop-blur-xl";

const ITEMS_PER_PAGE = 12;

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
        icon: <Layers3 className="h-4 w-4" />,
        badgeClass: "border-amber-100 bg-amber-50 text-amber-700",
        glowClass: "bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.16),transparent_45%)]",
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
      };
    case "in_progress":
      return {
        label: "In progress",
        icon: <CircleDashed className="h-4 w-4" />,
        badgeClass: "border-orange-100 bg-orange-50 text-orange-700",
      };
    default:
      return {
        label: "Not started",
        icon: <BookOpen className="h-4 w-4" />,
        badgeClass: "border-slate-200 bg-slate-50 text-slate-600",
      };
  }
}

export default function CurriculumListShell() {
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
    const next = modules.filter((module) => {
      const matchesSearch =
        normalized.length === 0 ||
        module.title.toLowerCase().includes(normalized) ||
        module.description.toLowerCase().includes(normalized);
      const matchesArea = selectedArea === "all" || module.area === selectedArea;
      const matchesStatus = selectedStatus === "all" || module.status === selectedStatus;
      return matchesSearch && matchesArea && matchesStatus;
    });

    return [...next].sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "progress") return b.progress - a.progress;
      const weight = (m: CurriculumModule) =>
        m.status === "in_progress" ? 3 : m.status === "not_started" ? 2 : 1;
      return weight(b) - weight(a);
    });
  }, [search, selectedArea, selectedStatus, sortBy]);

  const totalPages = Math.ceil(filteredModules.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedModules = filteredModules.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const rangeStart = filteredModules.length === 0 ? 0 : startIndex + 1;
  const rangeEnd = Math.min(startIndex + ITEMS_PER_PAGE, filteredModules.length);

  const recommendedSlug = useMemo(() => {
    return (
      modules.find((m) => m.status === "in_progress")?.slug ??
      modules.find((m) => m.status === "not_started")?.slug
    );
  }, []);

  return (
    <div className="space-y-8">
      <section className={`${SURFACE} p-5 md:p-6`}>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-2 text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-[#7b8794]">
            <SlidersHorizontal className="h-4 w-4" />
            Refine curriculum view
          </div>
          <div className="text-sm text-[#667180]">
            Showing <span className="font-semibold text-[#31425a]">{filteredModules.length}</span>{" "}
            modules
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
              placeholder="Search curriculum..."
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
            <option value="all">All progress states</option>
            <option value="not_started">Not started</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={sortBy}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setSortBy(e.target.value as "recommended" | "progress" | "title");
              handleFilterChange();
            }}
            className="rounded-2xl border border-[#e8edf3] bg-white px-4 py-3.5 text-[0.95rem] text-[#31425a] outline-none focus:border-[#0b9c72]/30"
          >
            <option value="recommended">Sort: Recommended</option>
            <option value="progress">Sort: Progress</option>
            <option value="title">Sort: Title</option>
          </select>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {(["all", "cross-cutting", "environmental", "social", "governance"] as const).map(
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

      {paginatedModules.length > 0 ? (
        <div className="space-y-10">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {paginatedModules.map((module) => {
                const areaMeta = getAreaMeta(module.area);
                const statusMeta = getStatusMeta(module.status);
                const isRecommended = module.slug === recommendedSlug;

                return (
                  <motion.article
                    key={module.slug}
                    layout
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    className={`${SURFACE} group relative flex flex-col overflow-hidden p-6`}
                  >
                    <div
                      className={`pointer-events-none absolute inset-0 opacity-90 ${areaMeta.glowClass}`}
                    />

                    <div className="relative flex flex-1 flex-col">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wider ${areaMeta.badgeClass}`}
                        >
                          {areaMeta.icon} {areaMeta.label}
                        </span>
                        {isRecommended && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0b9c72] px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-white shadow-sm">
                            <Sparkles className="h-3 w-3" /> Recommended
                          </span>
                        )}
                      </div>

                      <div className="mt-5">
                        <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#8a97a6]">
                          {module.subtitle}
                        </p>
                        <h2 className="mt-1 text-xl font-bold tracking-tight text-[#31425a]">
                          {module.title}
                        </h2>
                      </div>

                      <p className="mt-4 flex-1 text-sm leading-6 text-[#667180] line-clamp-3">
                        {module.description}
                      </p>

                      <div className="mt-6 grid grid-cols-2 gap-2">
                        <InfoPill
                          icon={<Clock3 className="h-3.5 w-3.5" />}
                          label={module.duration}
                        />
                        <InfoPill
                          icon={<Target className="h-3.5 w-3.5" />}
                          label={`${module.lessons} lessons`}
                        />
                      </div>

                      <div className="mt-6">
                        <div className="mb-2 flex items-center justify-between text-[0.7rem] font-bold uppercase tracking-wider text-[#8a97a6]">
                          <span>Progress</span>
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

                      <div className="mt-6 flex items-center justify-between gap-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-bold ${statusMeta.badgeClass.split(" ")[2]}`}
                        >
                          {statusMeta.icon} {statusMeta.label}
                        </span>
                        <button className="inline-flex items-center gap-2 rounded-xl bg-[#31425a] px-4 py-2.5 text-xs font-bold text-white transition shadow-sm hover:bg-[#253347]">
                          {module.status === "completed" ? "Review" : "Continue"}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col items-center justify-center gap-4 border-t border-[#e8edf3] pt-8">
              <div className="text-sm text-[#7b8794]">
                Showing{" "}
                <span className="font-bold text-[#31425a]">
                  {rangeStart}-{rangeEnd}
                </span>{" "}
                of <span className="font-bold text-[#31425a]">{filteredModules.length}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                  }}
                  disabled={currentPage === 1}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d9e2ec] bg-white transition disabled:opacity-30 hover:bg-[#f8fafc]"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      type="button"
                      onClick={() => {
                        setCurrentPage(i + 1);
                      }}
                      className={`h-10 min-w-10 rounded-xl text-xs font-bold transition ${
                        currentPage === i + 1
                          ? "bg-[#31425a] text-white shadow-md"
                          : "text-[#667180] hover:bg-[#edf2f7]"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                  }}
                  disabled={currentPage === totalPages}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d9e2ec] bg-white transition disabled:opacity-30 hover:bg-[#f8fafc]"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={`${SURFACE} p-12 text-center`}>
          <div className="mx-auto max-w-xs space-y-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f4f7fa] text-[#98a2b3]">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-[#31425a]">No modules found</h3>
            <p className="text-sm text-[#667180]">
              Adjust your filters or search terms to find what you&apos;re looking for.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-[#e8edf3] bg-white/50 px-3 py-2 text-[0.75rem] font-medium text-[#556274]">
      <span className="text-[#0b9c72]">{icon}</span>
      <span className="truncate">{label}</span>
    </div>
  );
}
