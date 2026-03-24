"use client";

import { createClient } from "@/lib/supabase/client";

type Props = {
  locale: string;
};

export default function SocialLoginButtons({ locale }: Props) {
  const supabase = createClient();

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/${locale}/auth/callback?next=/${locale}/dashboard`,
      },
    });
  };

  return (
    <div className="space-y-3">
      <button type="button" onClick={signInWithGoogle} className="w-full rounded border px-4 py-2">
        Continue with Google
      </button>
    </div>
  );
}
