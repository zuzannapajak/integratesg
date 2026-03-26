import AppSidebar from "@/components/layout/app-sidebar";
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

  if (!user) redirect(`/${locale}/auth/login`);

  const profile = await prisma.profile.findUnique({ where: { id: user.id } });
  if (!profile) redirect(`/${locale}/auth/login`);

  return (
    <div className="flex h-dvh flex-col bg-[#f5f5f3]">
      <div className="z-50 shrink-0">
        <ProtectedNavbar locale={locale} role={profile.role} email={user.email ?? ""} />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <AppSidebar locale={locale} role={profile.role} />

        <main className="flex-1 overflow-y-auto transition-all duration-500 cubic-bezier(0.4,0,0.2,1) min-w-0 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
