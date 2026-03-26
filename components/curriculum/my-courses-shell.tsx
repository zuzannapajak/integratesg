"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CircleDashed,
  Clock3,
  Layers3,
  Leaf,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import { useMemo } from "react";

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
        badgeClass: "text-emerald-700",
      };
    case "in_progress":
      return {
        label: "In progress",
        badgeClass: "text-orange-700",
      };
    default:
      return {
        label: "Not started",
        badgeClass: "text-slate-600",
      };
  }
}

export default function MyCoursesShell() {
  const inProgressModules = useMemo(() => {
    return modules.filter((module) => module.status === "in_progress");
  }, []);

  return (
    <section className="space-y-6">
      {inProgressModules.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {inProgressModules.map((module) => {
            const areaMeta = getAreaMeta(module.area);
            const statusMeta = getStatusMeta(module.status);

            return (
              <motion.article
                key={module.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
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
                      {areaMeta.icon}
                      {areaMeta.label}
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0b9c72] px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-white shadow-sm">
                      <CircleDashed className="h-3 w-3" />
                      In progress
                    </span>
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
                    <InfoPill icon={<Clock3 className="h-3.5 w-3.5" />} label={module.duration} />
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
                      className={`inline-flex items-center gap-1.5 text-xs font-bold ${statusMeta.badgeClass}`}
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      {statusMeta.label}
                    </span>

                    <button className="inline-flex items-center gap-2 rounded-xl bg-[#31425a] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#253347]">
                      Continue
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      ) : (
        <div className={`${SURFACE} p-12 text-center`}>
          <div className="mx-auto max-w-md space-y-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f4f7fa] text-[#98a2b3]">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-[#31425a]">No active courses yet</h3>
            <p className="text-sm text-[#667180]">
              Once you start a curriculum module, it will appear here so you can quickly continue.
            </p>
          </div>
        </div>
      )}
    </section>
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
