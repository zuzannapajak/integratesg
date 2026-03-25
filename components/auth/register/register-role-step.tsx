"use client";

import { APP_ROLES, SelfServiceRole } from "@/lib/auth/roles";
import { BookOpen, GraduationCap } from "lucide-react";

type Props = {
  role: SelfServiceRole;
  onRoleChange: (role: SelfServiceRole) => void;
  onContinue: () => void;
};

export default function RegisterRoleStep({ role, onRoleChange, onContinue }: Props) {
  return (
    <div className="mx-auto w-full max-w-[880px]">
      <div className="mb-6 text-left">
        <p className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[#7a8594]">
          Create your account
        </p>
        <h1 className="mt-3 text-[1.9rem] font-semibold tracking-[-0.03em] text-[#31425a]">
          Choose your role
        </h1>
        <p className="mt-3 max-w-[42ch] text-[0.98rem] leading-7 text-[#5f6977]">
          Select how you will use the platform.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={() => {
            onRoleChange(APP_ROLES.student);
          }}
          aria-pressed={role === APP_ROLES.student}
          className={`rounded-[1.5rem] border p-5 text-left transition-all duration-200 ${
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
                <p className="text-[1rem] font-semibold text-[#31425a]">Student</p>
                {role === APP_ROLES.student ? (
                  <span className="rounded-full bg-[#31425a] px-2.5 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-white">
                    Selected
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-[0.92rem] leading-6 text-[#667180]">
                Case studies, scenarios, and self-assessment.
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
          className={`rounded-[1.5rem] border p-5 text-left transition-all duration-200 ${
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
                <p className="text-[1rem] font-semibold text-[#31425a]">Educator</p>
                {role === APP_ROLES.educator ? (
                  <span className="rounded-full bg-[#31425a] px-2.5 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-white">
                    Selected
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-[0.92rem] leading-6 text-[#667180]">
                Curriculum tools and teaching resources.
              </p>
            </div>
          </div>
        </button>
      </div>

      <div className="mt-6 flex items-center justify-end">
        <button
          type="button"
          onClick={onContinue}
          className="inline-flex min-h-[3.25rem] items-center justify-center rounded-full bg-[#31425a] px-7 font-semibold text-white transition hover:bg-[#243246]"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
