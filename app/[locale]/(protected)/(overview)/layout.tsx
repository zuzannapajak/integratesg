import ProtectedNavbar from "@/components/layout/protected-navbar";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function ProtectedOverviewLayout({ children, params }: Props) {
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
    <div className="min-h-dvh bg-[#f5f5f3]">
      <ProtectedNavbar locale={locale} role={profile.role} email={user.email ?? ""} />
      {children}
    </div>
  );
}
