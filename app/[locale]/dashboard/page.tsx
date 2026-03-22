import { redirect } from "next/navigation";
import LogoutButton from "../../../components/auth/logout-button";
import { createClient } from "../../../lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/en/auth/login");
  }

  const email = user.email ?? "brak adresu e-mail";

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-4">Zalogowano jako: {email}</p>
      <div className="mt-6">
        <LogoutButton />
      </div>
    </main>
  );
}
