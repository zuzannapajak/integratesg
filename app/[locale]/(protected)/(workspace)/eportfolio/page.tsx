import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function EportfolioPage({ params }: Props) {
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

  return (
    <main className="mx-auto max-w-6xl">
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-[#31425a]">ePortfolio</h1>
        <p className="mt-4 max-w-3xl text-neutral-600">
          This section will present structured ESG case studies using a shared template.
        </p>
      </section>
    </main>
  );
}
