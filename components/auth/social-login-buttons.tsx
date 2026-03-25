"use client";

import { createClient } from "@/lib/supabase/client";

type Props = {
  locale: string;
  nextPath?: string;
};

export default function SocialLoginButtons({ locale, nextPath = `/${locale}/dashboard` }: Props) {
  const supabase = createClient();

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/${locale}/auth/callback?next=${encodeURIComponent(nextPath)}`,
      },
    });
  };

  return (
    <div className="space-y-3">
      <button type="button" onClick={signInWithGoogle} className="auth-google-button">
        <svg className="auth-google-button__icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M21.805 10.023H12.24v3.955h5.467c-.236 1.273-.959 2.352-2.045 3.077v2.558h3.307c1.936-1.782 3.056-4.408 3.056-7.535 0-.684-.062-1.341-.22-2.055Z"
          />
          <path
            fill="#34A853"
            d="M12.24 22c2.768 0 5.09-.913 6.785-2.387l-3.307-2.558c-.92.618-2.093.99-3.478.99-2.671 0-4.935-1.803-5.744-4.227H3.08v2.639A10.24 10.24 0 0 0 12.24 22Z"
          />
          <path
            fill="#FBBC05"
            d="M6.496 13.818A6.157 6.157 0 0 1 6.175 12c0-.632.11-1.245.321-1.818V7.543H3.08A10.237 10.237 0 0 0 2 12c0 1.654.394 3.22 1.08 4.457l3.416-2.639Z"
          />
          <path
            fill="#EA4335"
            d="M12.24 5.955c1.504 0 2.853.517 3.915 1.535l2.92-2.92C17.326 2.941 15.004 2 12.24 2A10.24 10.24 0 0 0 3.08 7.543l3.416 2.639c.809-2.424 3.073-4.227 5.744-4.227Z"
          />
        </svg>

        <span>Continue with Google</span>
      </button>
    </div>
  );
}
