import CaseStudyListShell from "@/components/eportfolio/case-study-list-shell";
import { getAllCaseStudies } from "@/lib/eportfolio/queries";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { FolderOpen } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function EportfolioPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Protected.EportfolioPage" });

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

  const items = await getAllCaseStudies({
    locale,
    userId: profile.id,
  });

  return (
    <main className="relative min-h-screen bg-[#f5f5f3] pb-20 transition-all duration-300">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(11,156,114,0.07),transparent_22%),radial-gradient(circle_at_84%_14%,rgba(13,127,194,0.07),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(245,245,243,1)_100%)]" />

      <div className="relative mx-auto max-w-360 px-4 pt-10 sm:px-6 lg:px-8 transition-all duration-300">
        <header className="mb-8 flex items-center gap-4 px-1">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/60 bg-white text-[#0b9c72] shadow-sm">
            <FolderOpen className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#31425a]">{t("title")}</h1>
            <p className="text-[#667180]">{t("subtitle")}</p>
          </div>
        </header>

        <CaseStudyListShell locale={locale} items={items} />
      </div>
    </main>
  );
}
