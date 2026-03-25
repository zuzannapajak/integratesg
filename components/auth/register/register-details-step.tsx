"use client";

import SocialLoginButtons from "@/components/auth/login/social-login-buttons";
import { createProfile } from "@/features/auth/actions";
import { APP_ROLES, SelfServiceRole } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Props = {
  locale: string;
  role: SelfServiceRole;
  fullName: string;
  email: string;
  password: string;
  onFullNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onBack: () => void;
};

export default function RegisterDetailsStep({
  locale,
  role,
  fullName,
  email,
  password,
  onFullNameChange,
  onEmailChange,
  onPasswordChange,
  onBack,
}: Props) {
  const supabase = createClient();

  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roleLabel = role === APP_ROLES.educator ? "Educator" : "Student";

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          full_name: fullName,
        },
      },
    });

    if (error) {
      setMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    if (data.user?.id && data.user.email) {
      try {
        await createProfile({
          userId: data.user.id,
          email: data.user.email,
          role,
          fullName: fullName || null,
        });
      } catch {
        setMessage("Account created, but the profile could not be saved.");
        setIsSubmitting(false);
        return;
      }
    }

    setMessage("Account created successfully. Check your email to continue.");
    setIsSubmitting(false);
  };

  return (
    <div className="mx-auto w-full max-w-220">
      <button
        type="button"
        onClick={onBack}
        className="mb-3 inline-flex items-center gap-2 text-[0.92rem] font-medium text-[#5f6977] transition hover:text-[#31425a]"
      >
        <ArrowLeft className="h-[1.15rem] w-[1.15rem]" />
      </button>

      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[1.9rem] font-semibold tracking-[-0.03em] text-[#31425a]">
            Account details
          </h1>
          <p className="mt-1 max-w-[40ch] text-[0.98rem] leading-7 text-[#5f6977]">
            Create your account using Google or email.
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-[#eef3f8] px-3 py-1.5 text-[0.76rem] font-semibold uppercase tracking-[0.12em] text-[#31425a]">
          {roleLabel}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="order-2 min-w-0 lg:order-1">
          <div className="flex h-full min-h-90-col roundrounded-3xler border-[#e7edf3] bg-white px-6 py-6">
            <div className="mb-4">
              <p className="text-[1rem] font-semibold text-[#31425a]">Continue with email</p>
              <p className="mt-2 text-[0.9rem] leading-6 text-[#667180]">
                Fill in your details to create the account manually.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-[0.93rem] font-medium text-[#31425a]">
                    Full name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    className="min-h-[3.15rem] w-full rounded-2xl border border-[#d7dee8] bg-white px-4 text-[#31425a] outline-none transition focus:border-[#9fb4ca] focus:ring-4 focus:ring-[#dfeaf5]"
                    value={fullName}
                    onChange={(event) => {
                      onFullNameChange(event.target.value);
                    }}
                    autoComplete="name"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-[0.93rem] font-medium text-[#31425a]">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="min-h-[3.15rem] w-full rounded-2xl border border-[#d7dee8] bg-white px-4 text-[#31425a] outline-none transition focus:border-[#9fb4ca] focus:ring-4 focus:ring-[#dfeaf5]"
                    value={email}
                    onChange={(event) => {
                      onEmailChange(event.target.value);
                    }}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-[0.93rem] font-medium text-[#31425a]">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    className="min-h-[3.15rem] w-full rounded-2xl border border-[#d7dee8] bg-white px-4 text-[#31425a] outline-none transition focus:border-[#9fb4ca] focus:ring-4 focus:ring-[#dfeaf5]"
                    value={password}
                    onChange={(event) => {
                      onPasswordChange(event.target.value);
                    }}
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div className="mt-auto pt-5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex min-h-[3.15rem] w-full items-center justify-center rounded-full bg-[#31425a] px-6 font-semibold text-white transition hover:bg-[#243246] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Creating..." : "Create account"}
                </button>

                {message ? (
                  <p className="mt-4 text-sm leading-6 text-[#5f6c7b]">{message}</p>
                ) : null}
              </div>
            </form>
          </div>
        </div>

        <div className="order-1 min-w-0 lg:order-2">
          <div className="flex h-full min-h-90 flex-col rounded-3xl border border-[#e7edf3] bg-[linear-gradient(180deg,rgba(247,249,252,0.92)_0%,rgba(255,255,255,0.88)_100%)] px-6 py-6">
            <div className="mx-auto flex h-full w-full max-w-[320px] flex-col justify-center text-center">
              <div>
                <p className="text-[1rem] font-semibold text-[#31425a]">Continue with Google</p>
                <p className="mt-2 text-[0.92rem] leading-6 text-[#667180]">
                  Recommended for faster setup.
                </p>
              </div>

              <div className="mt-6">
                <SocialLoginButtons locale={locale} nextPath={`/${locale}/auth/complete-profile`} />
              </div>

              <p className="mt-6 text-[0.88rem] leading-6 text-[#7a8594]">
                Use your Google account to continue with your selected role and finish setup with
                fewer steps.
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-5 text-left text-[0.92rem] text-[#5e6776]">
        Already have an account?{" "}
        <Link
          href={`/${locale}/auth/login`}
          className="font-semibold text-[#31425a] transition hover:text-[#0d7fc2]"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
