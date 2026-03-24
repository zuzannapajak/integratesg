import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

type Role = "educator" | "student" | "admin";

type QuickLink = {
  title: string;
  description: string;
  href: string;
};

function getDashboardContent(locale: string, role: Role): QuickLink[] {
  if (role === "educator") {
    return [
      {
        title: "Courses",
        description: "Open course modules and access educator learning resources.",
        href: `/${locale}/curriculum`,
      },
      {
        title: "Curriculum",
        description: "Continue with pre-quiz, post-quiz, and self-assessment flows.",
        href: `/${locale}/curriculum`,
      },
      {
        title: "ePortfolio",
        description: "Review ESG case studies and structured examples.",
        href: `/${locale}/eportfolio`,
      },
      {
        title: "Scenarios",
        description: "Launch interactive Storyline scenarios.",
        href: `/${locale}/scenarios`,
      },
    ];
  }

  if (role === "admin") {
    return [
      {
        title: "Program statistics",
        description: "View basic reporting indicators for platform activity.",
        href: `/${locale}/admin/stats`,
      },
    ];
  }

  return [
    {
      title: "Scenarios",
      description: "Continue interactive ESG learning scenarios.",
      href: `/${locale}/scenarios`,
    },
    {
      title: "ePortfolio",
      description: "Browse case studies and practical ESG examples.",
      href: `/${locale}/eportfolio`,
    },
  ];
}

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

  const role = profile.role as Role;
  const displayName = profile.fullName || profile.email || "User";

  const intro =
    role === "educator"
      ? "Welcome back. You can continue with courses, curriculum, scenarios, and case studies."
      : role === "admin"
        ? "Welcome back. Here you can access the basic reporting and activity overview."
        : "Welcome back. You can continue with scenarios and explore the ePortfolio resources.";

  const quickLinks = getDashboardContent(locale, role);

  return (
    <main className="mx-auto max-w-6xl">
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div
            className={`flex h-24 w-24 items-center justify-center rounded-full text-4xl text-white ${
              role === "educator"
                ? "bg-[#0b9c72]"
                : role === "admin"
                  ? "bg-[#31425a]"
                  : "bg-[#ef6c23]"
            }`}
          >
            ○
          </div>

          <div className="flex-1">
            <p className="text-sm uppercase tracking-[0.18em] text-neutral-500">{role}</p>
            <h1 className="mt-2 text-3xl font-bold text-[#31425a]">{displayName}</h1>
            <p className="mt-3 max-w-3xl text-base text-neutral-600">{intro}</p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-2xl font-semibold text-[#31425a]">Quick access</h2>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {quickLinks.map((item) => (
            <Link
              key={item.href + item.title}
              href={item.href}
              className="rounded-3xl border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h3 className="text-xl font-semibold text-[#31425a]">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-neutral-600">{item.description}</p>
              <span className="mt-5 inline-block text-sm font-semibold text-[#0d7fc2]">Open →</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
