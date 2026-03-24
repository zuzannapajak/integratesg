import { requireRole } from "@/features/auth/requireRole";
import { APP_ROLES } from "@/lib/auth/roles";

type Props = {
  params: Promise<{ locale: string }>;
};

const stats = [
  { label: "Registered users", value: "—", helper: "Placeholder for total platform users" },
  { label: "Scenario launches", value: "—", helper: "Placeholder for total scenario starts" },
  { label: "Completion rate", value: "—", helper: "Placeholder for aggregated completion" },
  { label: "Average score", value: "—", helper: "Placeholder for aggregated quiz/scenario score" },
];

export default async function StatsPage({ params }: Props) {
  const { locale } = await params;
  await requireRole(locale, APP_ROLES.admin);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#31425a]">
          Read-only analytics
        </p>
        <h1 className="text-4xl text-[#31425a]">Basic platform statistics</h1>
        <p className="max-w-3xl text-base leading-7 text-[#667085]">
          The admin role has access to a basic, read-only overview of platform activity. This page
          is intended for MVP analytics and reporting exports.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <section
            key={item.label}
            className="rounded-3xl border border-[#d8dee7] bg-white p-6 shadow-sm"
          >
            <p className="text-sm uppercase tracking-[0.16em] text-[#98a2b3]">{item.label}</p>
            <p className="mt-4 text-5xl text-[#31425a]">{item.value}</p>
            <p className="mt-4 text-sm leading-6 text-[#667085]">{item.helper}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
