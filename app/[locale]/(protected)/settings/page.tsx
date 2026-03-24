import AccountSettingsForm from "@/components/settings/account-settings-form";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SettingsPage({ params }: Props) {
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
      <section className="mb-8 rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.18em] text-neutral-500">Settings</p>
        <h1 className="mt-2 text-3xl font-bold text-[#31425a]">Account settings</h1>
        <p className="mt-3 max-w-3xl text-neutral-600">
          Manage your personal information, language preferences, and account security.
        </p>
      </section>

      <AccountSettingsForm
        locale={locale}
        email={profile.email}
        role={profile.role}
        fullName={profile.fullName}
        preferredLanguage={profile.preferredLanguage}
        createdAt={profile.createdAt.toISOString()}
      />
    </main>
  );
}
