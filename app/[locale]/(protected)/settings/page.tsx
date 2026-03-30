import AccountSettingsForm from "@/components/settings/account-settings-form";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Settings as SettingsIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SettingsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Protected.SettingsPage" });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/${locale}/auth/login`);

  const profile = await prisma.profile.findUnique({ where: { id: user.id } });
  if (!profile) redirect(`/${locale}/auth/login`);

  return (
    <main className="relative min-h-screen bg-[#f5f5f3] px-4 pb-20 pt-8 text-[#31425a] sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(236,103,37,0.08),transparent_22%),radial-gradient(circle_at_84%_14%,rgba(13,127,194,0.08),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(245,245,243,1)_100%)]" />

      <div className="relative mx-auto max-w-360 px-4 pt-10 sm:px-6 lg:px-8 transition-all duration-300">
        <div className="mb-6 px-2">
          <Link
            href={`/${locale}/dashboard`}
            className="inline-flex items-center gap-2 text-[0.95rem] font-medium text-[#5f6977] transition hover:text-[#31425a]"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
            {t("back")}
          </Link>
        </div>

        <header className="mb-10 flex items-center gap-4 px-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/60 bg-white text-[#31425a] shadow-sm">
            <SettingsIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#31425a]">{t("title")}</h1>
            <p className="text-[#667180]">{t("subtitle")}</p>
          </div>
        </header>

        <AccountSettingsForm
          locale={locale}
          email={profile.email}
          fullName={profile.fullName}
          preferredLanguage={profile.preferredLanguage}
          createdAt={profile.createdAt.toISOString()}
        />
      </div>
    </main>
  );
}
