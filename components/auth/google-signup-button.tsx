"use client";

import { createClient } from "@/lib/supabase/client";

type GoogleSignupButtonProps = {
  locale: string;
};

export default function GoogleSignupButton({ locale }: GoogleSignupButtonProps) {
  const supabase = createClient();

  const handleGoogleSignup = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/${locale}/auth/callback?next=/${locale}/auth/complete-profile`,
      },
    });
  };

  return (
    <button type="button" onClick={handleGoogleSignup} className="w-full rounded border px-4 py-2">
      Continue with Google
    </button>
  );
}
