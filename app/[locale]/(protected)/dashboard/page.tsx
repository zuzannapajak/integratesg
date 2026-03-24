import LogoutButton from "@/components/auth/logout-button";
import { APP_ROLES, AppRole, ROLE_LABELS, canAccessCurriculum } from "@/lib/auth/roles";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

const roleColors: Record<AppRole, string> = {
  [APP_ROLES.student]: "bg-[#ef6c23]",
  [APP_ROLES.educator]: "bg-[#0b9c72]",
  [APP_ROLES.admin]: "bg-[#31425a]",
};

export default async function DashboardPage({ params }: Props) {
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
    redirect(`/${locale}/auth/complete-profile`);
  }

  const quickLinks =
    profile.role === APP_ROLES.admin
      ? [
          {
            href: `/${locale}/stats`,
            label: "View statistics",
            description: "Open the read-only analytics dashboard.",
          },
        ]
      : [
          {
            href: `/${locale}/eportfolio`,
            label: "Browse ePortfolio",
            description: "Access structured ESG case studies.",
          },
          {
            href: `/${locale}/scenarios`,
            label: "Open scenarios",
            description: "Launch interactive ESG simulations.",
          },
          ...(canAccessCurriculum(profile.role)
            ? [
                {
                  href: `/${locale}/curriculum`,
                  label: "Go to curriculum",
                  description: "Access educator learning modules and quizzes.",
                },
              ]
            : []),
        ];

  return (
    <main className="mx-auto max-w-245 px-6 py-10">
      <section className="flex flex-col gap-8 md:flex-row md:items-start">
        <div className="text-[56px] text-[#8d8d8d]">⚙</div>

        <div
          className={`flex h-44 w-44 items-center justify-center rounded-full ${roleColors[profile.role]} text-[72px] text-white`}
        >
          ○
        </div>

        <div className="flex-1 space-y-4 pt-3">
          <div className="flex items-center gap-4 text-[46px] text-[#8d8d8d]">
            <span>✎</span>
            <span className="text-[34px] text-[#31425a]">
              {profile.fullName ?? ROLE_LABELS[profile.role]}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[46px] text-[#8d8d8d]">
            <span>✉</span>
            <span className="text-[34px] text-[#31425a]">{user.email ?? profile.email}</span>
          </div>

          <div className="flex items-center gap-4 text-[46px] text-[#8d8d8d]">
            <span>☰</span>
            <span className="text-[34px] text-[#31425a]">{ROLE_LABELS[profile.role]}</span>
          </div>

          <div className="pt-2">
            <LogoutButton />
          </div>
        </div>
      </section>

      <div className="mock-divider mt-10" />

      <section className="mt-12">
        <div className="mb-8 flex items-center gap-3">
          <span className="text-[42px] text-[#0b9c72]">▼</span>
          <div className="min-w-90 border-b-[6px] border-[#0b9c72] pb-1 text-[30px] text-[#31425a]">
            Role-based access overview
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-3xl border border-[#d8dee7] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="space-y-3">
                <p className="text-[24px] text-[#31425a]">{item.label}</p>
                <p className="text-[16px] leading-7 text-[#667085]">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
