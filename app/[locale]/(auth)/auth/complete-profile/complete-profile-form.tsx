"use client";

import { completeCurrentUserProfile } from "@/features/auth/actions";
import { APP_ROLES, SelfServiceRole, getDefaultProtectedRoute } from "@/lib/auth/roles";
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
    <main className="mx-auto max-w-md space-y-6 p-8">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p className="text-sm text-gray-600">{email}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <p className="font-medium">{t("chooseRole")}</p>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setRole(APP_ROLES.student);
              }}
              className={`rounded border p-4 text-left ${
                role === APP_ROLES.student ? "border-black bg-gray-50" : ""
              }`}
            >
              <p className="font-medium">{roles("student")}</p>
              <p className="text-sm text-gray-600">{t("studentDescription")}</p>
            </button>

            <button
              type="button"
              onClick={() => {
                setRole(APP_ROLES.educator);
              }}
              className={`rounded border p-4 text-left ${
                role === APP_ROLES.educator ? "border-black bg-gray-50" : ""
              }`}
            >
              <p className="font-medium">{roles("educator")}</p>
              <p className="text-sm text-gray-600">{t("educatorDescription")}</p>
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {isPending ? t("submitting") : t("submit")}
        </button>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </main>
  );
}
