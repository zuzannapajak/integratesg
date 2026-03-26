"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Props = {
  className?: string;
  redirectTo?: string;
  children?: React.ReactNode;
};

export default function LogoutButton({
  className,
  redirectTo = "/en/auth/login",
  children = "Logout",
}: Props) {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push(redirectTo);
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={className ?? "rounded bg-red-600 px-4 py-2 text-white"}
    >
      {children}
    </button>
  );
}
