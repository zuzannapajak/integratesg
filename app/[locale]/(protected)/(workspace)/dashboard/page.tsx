import DashboardShell, { type DashboardRole } from "@/components/dashboard/dashboard-shell";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
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

  const role = profile.role as DashboardRole;
  const displayName = profile.fullName ?? user.email?.split("@")[0] ?? "User";
  const email = user.email ?? "";

  return <DashboardShell locale={locale} role={role} displayName={displayName} email={email} />;
}
