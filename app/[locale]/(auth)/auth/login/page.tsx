import LoginForm from "@/components/auth/login-form";
import SocialLoginButtons from "@/components/auth/social-login-buttons";
import Link from "next/link";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function LoginPage({ params }: Props) {
  const { locale } = await params;

  return (
    <main className="flex h-full min-h-0 overflow-hidden bg-[#ececec]">
      <section className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-white px-6 md:px-8 lg:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(236,103,37,0.16),transparent_24%),radial-gradient(circle_at_86%_22%,rgba(13,127,194,0.20),transparent_28%),linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(249,250,251,0.98)_58%,rgba(255,255,255,0.96)_100%)]" />

        <div className="relative z-20 mx-auto flex w-full max-w-130 items-center justify-center">
          <div className="w-full rounded-4xl border border-white/70 bg-white/88 p-6 shadow-[0_20px_55px_rgba(35,45,62,0.10)] backdrop-blur-xl md:p-8">
            <div className="max-w-105">
              <h1 className="text-[1.9rem] font-semibold tracking-[-0.03em] text-[#31425a]">
                Access your account
              </h1>
              <p className="mt-3 text-[0.98rem] leading-7 text-[#596170]">
                Sign in with your email or continue with Google.
              </p>
            </div>

            <div className="mt-8 space-y-6">
              <LoginForm />

              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-[#d9e1ea]" />
                <span className="text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-[#7a8594]">
                  Or
                </span>
                <div className="h-px flex-1 bg-[#d9e1ea]" />
              </div>

              <SocialLoginButtons locale={locale} />

              <p className="text-center text-[0.95rem] text-[#5e6776]">
                Don&apos;t have an account?{" "}
                <Link
                  href={`/${locale}/auth/register`}
                  className="font-semibold text-[#31425a] hover:text-[#0d7fc2]"
                >
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
