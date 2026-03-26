import { requireRole } from "@/features/auth/requireRole";
import { APP_ROLES } from "@/lib/auth/roles";

type Props = {
  params: Promise<{ locale: string }>;
};

const curriculumModules = [
  {
    title: "Introduction to ESG Integration",
    structure: ["Intro", "Pre-test", "Content", "Post-test"],
  },
  {
    title: "Environmental decision-making",
    structure: ["Intro", "Pre-test", "Scenario-based content", "Post-test"],
  },
  {
    title: "Governance in practice",
    structure: ["Intro", "Pre-test", "Case-based learning", "Post-test"],
  },
];

export default async function CurriculumPage({ params }: Props) {
  const { locale } = await params;
  await requireRole(locale, APP_ROLES.educator);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0b9c72]">
          Curriculum
        </p>
        <h1 className="text-4xl text-[#31425a]">Educator learning modules</h1>
        <p className="max-w-3xl text-base leading-7 text-[#667085]">
          This module is reserved for educators. It organizes course flow into intro, pre-test,
          content, and post-test sections, with room for feedback, attempts, and progress tracking.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {curriculumModules.map((module) => (
          <section
            key={module.title}
            className="rounded-3xl border border-[#d8dee7] bg-white p-6 shadow-sm"
          >
            <h2 className="text-2xl text-[#31425a]">{module.title}</h2>
            <ul className="mt-5 space-y-3 text-[#667085]">
              {module.structure.map((item) => (
                <li key={item} className="rounded-2xl bg-[#f8fafc] px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
