import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import LogoutButton from "../../../components/auth/logout-button";
import { createClient } from "../../../lib/supabase/server";

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
    redirect(`/${locale}/auth/complete-profile`);
  }

  const email = user.email ?? "brak adresu e-mail";

  return (
    <main className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <p>Zalogowano jako: {email}</p>
      <p>
        Rola: <strong>{profile.role}</strong>
      </p>

      {profile.role === "educator" && (
        <div className="rounded border p-4">
          <p className="font-medium">Educator panel</p>
          <p>Access to scenarios, analytics, etc.</p>
        </div>
      )}

      {profile.role === "student" && (
        <div className="rounded border p-4">
          <p className="font-medium">Student panel</p>
          <p>Access to learning scenarios</p>
        </div>
      )}

      <div className="mt-6">
        <LogoutButton />
      </div>
    </main>
  );
}
