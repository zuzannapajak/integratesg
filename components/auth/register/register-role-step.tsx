"use client";

import { APP_ROLES, SelfServiceRole } from "@/lib/auth/roles";
import { BookOpen, GraduationCap } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  role: SelfServiceRole;
  onRoleChange: (role: SelfServiceRole) => void;
  onContinue: () => void;
};

export default function RegisterRoleStep({ role, onRoleChange, onContinue }: Props) {
  const t = useTranslations("Register.RoleStep");
  const roles = useTranslations("Roles");
  const common = useTranslations("Common");

  return (
    <div className="mx-auto w-full max-w-220">
      <div className="mb-6 text-left">
        <p className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[#7a8594]">
          {t("eyebrow")}
        </p>
        <h1 className="mt-3 text-[1.9rem] font-semibold tracking-[-0.03em] text-[#31425a]">
          {t("title")}
        </h1>
        <p className="mt-3 max-w-[42ch] text-[0.98rem] leading-7 text-[#5f6977]">{t("subtitle")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={() => {
            onRoleChange(APP_ROLES.student);
          }}
          aria-pressed={role === APP_ROLES.student}
          className={`rounded-3xl border p-5 text-left transition-all duration-200 ${
            role === APP_ROLES.student
              ? "border-[#31425a] bg-[#f4f8fc] shadow-[0_12px_28px_rgba(49,66,90,0.08)]"
              : "border-[#d9e1ea] bg-white hover:border-[#bcc9d7] hover:bg-[#fbfcfd]"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                role === APP_ROLES.student
                  ? "bg-[#31425a] text-white"
                  : "bg-[#eef3f8] text-[#31425a]"
              }`}
            >
              <BookOpen className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1 pr-1">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[1rem] font-semibold text-[#31425a]">{roles("student")}</p>
                {role === APP_ROLES.student ? (
                  <span className="rounded-full bg-[#31425a] px-2.5 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-white">
                    {common("selected")}
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-[0.92rem] leading-6 text-[#667180]">
                {t("studentDescription")}
              </p>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            onRoleChange(APP_ROLES.educator);
          }}
          aria-pressed={role === APP_ROLES.educator}
          className={`rounded-3xl border p-5 text-left transition-all duration-200 ${
            role === APP_ROLES.educator
              ? "border-[#31425a] bg-[#f4f8fc] shadow-[0_12px_28px_rgba(49,66,90,0.08)]"
              : "border-[#d9e1ea] bg-white hover:border-[#bcc9d7] hover:bg-[#fbfcfd]"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                role === APP_ROLES.educator
                  ? "bg-[#31425a] text-white"
                  : "bg-[#eef3f8] text-[#31425a]"
              }`}
            >
              <GraduationCap className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1 pr-1">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[1rem] font-semibold text-[#31425a]">{roles("educator")}</p>
                {role === APP_ROLES.educator ? (
                  <span className="rounded-full bg-[#31425a] px-2.5 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-white">
                    {common("selected")}
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-[0.92rem] leading-6 text-[#667180]">
                {t("educatorDescription")}
              </p>
            </div>
          </div>
        </button>
      </div>

      <div className="mt-6 flex items-center justify-end">
        <button
          type="button"
          onClick={onContinue}
          className="inline-flex min-h-13 items-center justify-center rounded-full bg-[#31425a] px-7 font-semibold text-white transition hover:bg-[#243246]"
        >
          {t("continue")}
        </button>
      </div>
    </div>
  );
}
