import AppSidebar from "@/components/layout/app-sidebar";
import AppTopbar from "@/components/layout/app-topbar";
import ProtectedNavbar from "@/components/layout/protected-navbar";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function ProtectedLayout({ children, params }: Props) {
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
    <div className="min-h-screen">
      <ProtectedNavbar locale={locale} role={profile.role} email={profile.email} />

      <div className="mock-page lg:flex">
        <AppSidebar locale={locale} role={profile.role} email={profile.email} />

        <div className="min-w-0 flex-1">
          <AppTopbar email={profile.email} role={profile.role} />
          <div className="px-6 py-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
