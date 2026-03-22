"use client";

import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export default function LogoutButton() {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/en/auth/login");
    router.refresh();
  };

  return (
    <button onClick={handleLogout} className="rounded bg-red-600 px-4 py-2 text-white">
      Logout
    </button>
  );
}
