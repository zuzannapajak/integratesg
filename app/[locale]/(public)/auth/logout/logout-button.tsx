"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/en/auth/login");
    router.refresh();
  };

  return (
    <button onClick={handleLogout} className="rounded bg-[#3a3a3a] px-4 py-2 text-sm text-white">
      Logout
    </button>
  );
}
