import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AdminStatsPage({ params }: Props) {
  const { locale } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
  });

  if (!profile) {
    redirect(`/${locale}/auth/login`);
  }

  if (profile.role !== "admin") {
    redirect(`/${locale}/dashboard`);
  }

  const totalProfiles = await prisma.profile.count();
  const totalStudents = await prisma.profile.count({
    where: { role: "student" },
  });
  const totalEducators = await prisma.profile.count({
    where: { role: "educator" },
  });
  const totalAdmins = await prisma.profile.count({
    where: { role: "admin" },
  });

  const stats = [
    { label: "All users", value: totalProfiles },
    { label: "Students", value: totalStudents },
    { label: "Educators", value: totalEducators },
    { label: "Admins", value: totalAdmins },
  ];

  return (
    <main className="mx-auto max-w-6xl">
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-[#31425a]">Program statistics</h1>
        <p className="mt-4 max-w-3xl text-neutral-600">
          This basic admin view can be used later for IntegratESG reporting.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border bg-neutral-50 p-5">
              <p className="text-sm text-neutral-500">{stat.label}</p>
              <p className="mt-3 text-3xl font-bold text-[#31425a]">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
