"use client";

import { completeCurrentUserProfile } from "@/features/auth/actions";
import { APP_ROLES, SelfServiceRole, getDefaultProtectedRoute } from "@/lib/auth/roles";
import { BookOpen, GraduationCap } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type Props = {
  locale: string;
  email: string;
};

export default function CompleteProfileForm({ locale, email }: Props) {
  const t = useTranslations("Auth.CompleteProfile");
  const roles = useTranslations("Roles");
  const common = useTranslations("Common");
  const router = useRouter();

  const [role, setRole] = useState<SelfServiceRole>(APP_ROLES.student);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        await completeCurrentUserProfile({ role, preferredLanguage: locale });
        router.replace(getDefaultProtectedRoute(locale, role));
      } catch {
        setError(t("error"));
      }
    });
  };

  return (
    <main className="min-h-full bg-white">
      <section className="relative flex w-full justify-center px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(236,103,37,0.12),transparent_24%),radial-gradient(circle_at_86%_22%,rgba(13,127,194,0.14),transparent_28%),linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(249,250,251,0.98)_58%,rgba(255,255,255,0.96)_100%)]" />

        <div className="relative z-20 mx-auto w-full max-w-xl">
          <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/88 shadow-[0_20px_55px_rgba(35,45,62,0.10)] backdrop-blur-xl">
            <div className="px-5 pb-5 pt-6 text-left sm:px-6 md:px-7">
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[#7a8594]">
                {t("eyebrow")}
              </p>

              <h1 className="mt-3 text-[1.7rem] font-semibold tracking-[-0.03em] text-[#31425a] sm:text-[1.9rem]">
                {t("title")}
              </h1>

              <p className="mt-3 text-sm text-[#667180]">{t("chooseRole")}</p>
              <p className="mt-1 break-all text-sm text-[#31425a]">{email}</p>
            </div>

            <div className="border-t border-[#e8edf3] px-5 py-5 sm:px-6 md:px-7">
              <form onSubmit={handleSubmit} className="space-y-3">
                <button
                  type="button"
                  onClick={() => { setRole(APP_ROLES.student); }}
                  aria-pressed={role === APP_ROLES.student}
                  className={`w-full rounded-[1.5rem] border p-4 text-left transition-all duration-200 ${
                    role === APP_ROLES.student
                      ? "border-[#31425a] bg-[#f4f8fc] shadow-[0_10px_24px_rgba(49,66,90,0.08)]"
                      : "border-[#d9e1ea] bg-white hover:border-[#bcc9d7] hover:bg-[#fbfcfd]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[1rem] ${
                        role === APP_ROLES.student
                          ? "bg-[#31425a] text-white"
                          : "bg-[#eef3f8] text-[#31425a]"
                      }`}
                    >
                      <BookOpen className="h-4.5 w-4.5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[0.98rem] font-semibold text-[#31425a]">
                          {roles("student")}
                        </p>
                        {role === APP_ROLES.student ? (
                          <span className="rounded-full bg-[#31425a] px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-white">
                            {common("selected")}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-[0.88rem] leading-6 text-[#667180]">
                        {t("studentDescription")}
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => { setRole(APP_ROLES.educator); }}
                  aria-pressed={role === APP_ROLES.educator}
                  className={`w-full rounded-[1.5rem] border p-4 text-left transition-all duration-200 ${
                    role === APP_ROLES.educator
                      ? "border-[#31425a] bg-[#f4f8fc] shadow-[0_10px_24px_rgba(49,66,90,0.08)]"
                      : "border-[#d9e1ea] bg-white hover:border-[#bcc9d7] hover:bg-[#fbfcfd]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[1rem] ${
                        role === APP_ROLES.educator
                          ? "bg-[#31425a] text-white"
                          : "bg-[#eef3f8] text-[#31425a]"
                      }`}
                    >
                      <GraduationCap className="h-4.5 w-4.5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[0.98rem] font-semibold text-[#31425a]">
                          {roles("educator")}
                        </p>
                        {role === APP_ROLES.educator ? (
                          <span className="rounded-full bg-[#31425a] px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-white">
                            {common("selected")}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-[0.88rem] leading-6 text-[#667180]">
                        {t("educatorDescription")}
                      </p>
                    </div>
                  </div>
                </button>

                {error ? (
                  <div className="rounded-[1.25rem] border border-[#f1c9c9] bg-[#fff6f6] px-4 py-3 text-sm leading-6 text-[#9f3c3c]">
                    {error}
                  </div>
                ) : null}

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#31425a] px-6 text-sm font-semibold text-white transition hover:bg-[#243246] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isPending ? t("submitting") : t("submit")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
