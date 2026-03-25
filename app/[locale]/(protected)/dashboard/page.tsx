import LogoutButton from "@/components/auth/logout-button";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
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
    redirect(`/${locale}/auth/login`);
  }

  const role = profile.role;
  const displayName = profile.fullName ?? user.email?.split("@")[0] ?? "User";
  const avatarColor =
    role === "educator" ? "bg-[#0b9c72]" : role === "admin" ? "bg-[#31425a]" : "bg-[#ef6c23]";

  const quickLinks =
    role === "educator"
      ? [
          { href: `/${locale}/curriculum`, label: "Curriculum" },
          { href: `/${locale}/scenarios`, label: "Scenarios" },
          { href: `/${locale}/eportfolio`, label: "ePortfolio" },
          { href: `/${locale}/settings`, label: "Settings" },
        ]
      : role === "admin"
        ? [
            { href: `/${locale}/admin/stats`, label: "Program statistics" },
            { href: `/${locale}/settings`, label: "Settings" },
          ]
        : [
            { href: `/${locale}/scenarios`, label: "Scenarios" },
            { href: `/${locale}/eportfolio`, label: "ePortfolio" },
            { href: `/${locale}/settings`, label: "Settings" },
          ];

  return (
    <main className="mx-auto max-w-245 px-6 py-10">
      <section className="flex flex-col gap-8 md:flex-row md:items-start">
        <div className="text-[56px] text-[#8d8d8d]">⚙</div>

        <div
          className={`flex h-44 w-44 items-center justify-center rounded-full ${avatarColor} text-[72px] text-white`}
        >
          ○
        </div>

        <div className="flex-1 space-y-4 pt-3">
          <div className="flex items-center gap-4 text-[46px] text-[#8d8d8d]">
            <span>✎</span>
            <span className="text-[34px] text-[#31425a]">{displayName}</span>
          </div>

          <div className="flex items-center gap-4 text-[46px] text-[#8d8d8d]">
            <span>✉</span>
            <span className="text-[34px] text-[#31425a]">{user.email ?? "mail@mail.com"}</span>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl border border-[#31425a] px-4 py-2 text-sm text-[#31425a] transition hover:bg-[#31425a] hover:text-white"
              >
                {item.label}
              </Link>
            ))}

            <LogoutButton />
          </div>
        </div>
      </section>

      <div className="mock-divider mt-10" />

      {role === "educator" ? (
        <section className="mt-10">
          <div className="mb-12 flex items-center gap-3">
            <span className="text-[42px] text-[#0b9c72]">▼</span>
            <div className="border-b-[6px] border-[#0b9c72] pb-1 text-[30px] text-[#31425a]">
              Curriculum and educator resources
            </div>
          </div>

          <div className="grid gap-14 md:grid-cols-2">
            <div className="border-l-4 border-[#0b9c72] pl-6">
              <div className="space-y-11 text-[20px] text-[#31425a]">
                <div className="mock-list-underline">Pre-assessment quiz</div>
                <div className="mock-list-underline">Learning modules</div>
                <div className="mock-list-underline">Post-assessment quiz</div>
                <div className="mock-list-underline">Feedback and reflection</div>
              </div>
            </div>

            <div className="border-l-4 border-[#0b9c72] pl-6">
              <div className="space-y-11 text-[20px] text-[#31425a]">
                <div className="mock-list-underline">Scenarios</div>
                <div className="mock-list-underline">ePortfolio</div>
                <div className="mock-list-underline">Settings</div>
                <div className="mock-list-underline">Profile overview</div>
              </div>
            </div>
          </div>
        </section>
      ) : role === "admin" ? (
        <section className="mt-12">
          <div className="grid max-w-160 grid-cols-1 gap-8 md:grid-cols-2">
            <div className="mock-card-student">
              <div className="mock-card-student-inner">Basic program statistics</div>
            </div>
            <div className="mock-card-student">
              <div className="mock-card-student-inner">Account settings</div>
            </div>
          </div>
        </section>
      ) : (
        <section className="mt-12">
          <div className="grid max-w-130 grid-cols-2 gap-10">
            {["Scenarios", "ePortfolio", "Settings", "Profile"].map((item) => (
              <div key={item} className="mock-card-student">
                <div className="mock-card-student-inner">{item}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
