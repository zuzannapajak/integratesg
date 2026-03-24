"use client";

import { updateCurrentUserSettings } from "@/features/settings/actions";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

type Role = "educator" | "student" | "admin";

type Props = {
  locale: string;
  email: string;
  role: Role;
  fullName: string | null;
  preferredLanguage: string;
  createdAt: string;
};

function getRoleLabel(role: Role) {
  if (role === "educator") return "Educator";
  if (role === "admin") return "Admin";
  return "Student";
}

function getLanguageLabel(language: string) {
  if (language === "pl") return "Polski";
  if (language === "es") return "Español";
  return "English";
}

export default function AccountSettingsForm({
  locale,
  email,
  role,
  fullName,
  preferredLanguage,
  createdAt,
}: Props) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [nameValue, setNameValue] = useState(fullName ?? "");
  const [languageValue, setLanguageValue] = useState(preferredLanguage || locale || "en");

  const [passwordValue, setPasswordValue] = useState("");
  const [passwordConfirmValue, setPasswordConfirmValue] = useState("");

  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const [isProfilePending, startProfileTransition] = useTransition();
  const [isPasswordPending, startPasswordTransition] = useTransition();

  const roleLabel = getRoleLabel(role);
  const languageLabel = getLanguageLabel(languageValue);
  const memberSince = new Date(createdAt).toLocaleDateString();

  const handleProfileSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);

    startProfileTransition(async () => {
      try {
        await updateCurrentUserSettings({
          fullName: nameValue,
          preferredLanguage: languageValue,
          locale,
        });

        setProfileSuccess("Settings saved successfully.");
        router.refresh();
      } catch {
        setProfileError("Failed to save settings.");
      }
    });
  };

  const handlePasswordSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (passwordValue.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      return;
    }

    if (passwordValue !== passwordConfirmValue) {
      setPasswordError("Passwords do not match.");
      return;
    }

    startPasswordTransition(async () => {
      const { error } = await supabase.auth.updateUser({
        password: passwordValue,
      });

      if (error) {
        setPasswordError(error.message);
        return;
      }

      setPasswordSuccess("Password updated successfully.");
      setPasswordValue("");
      setPasswordConfirmValue("");
      router.refresh();
    });
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-neutral-500">
              Account overview
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#31425a] md:text-3xl">
              {nameValue.trim().length > 0 ? nameValue : "Your account"}
            </h2>
            <p className="mt-2 max-w-2xl text-base leading-7 text-neutral-600">
              Review your account details, update your profile information, and manage security
              settings from one place.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#31425a]/15 bg-[#31425a]/5 px-3 py-1.5 text-sm font-medium text-[#31425a]">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#0d7fc2]" />
            {roleLabel}
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-4">
            <p className="text-sm text-neutral-500">Email</p>
            <p className="mt-2 break-all text-base font-medium text-[#31425a]">{email}</p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-4">
            <p className="text-sm text-neutral-500">Role</p>
            <p className="mt-2 text-base font-medium text-[#31425a]">{roleLabel}</p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-4">
            <p className="text-sm text-neutral-500">Preferred language</p>
            <p className="mt-2 text-base font-medium text-[#31425a]">{languageLabel}</p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-4">
            <p className="text-sm text-neutral-500">Member since</p>
            <p className="mt-2 text-base font-medium text-[#31425a]">{memberSince}</p>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-neutral-500">
            Profile
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#31425a]">
            Account settings
          </h2>
          <p className="mt-2 max-w-2xl text-base leading-7 text-neutral-600">
            Update the information shown on your account and choose your preferred interface
            language.
          </p>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-2 lg:col-span-2">
              <label htmlFor="fullName" className="text-sm font-medium text-[#31425a]">
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                value={nameValue}
                onChange={(e) => {
                  setNameValue(e.target.value);
                }}
                placeholder="Enter your full name"
                className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3.5 text-base outline-none transition placeholder:text-neutral-400 focus:border-[#0d7fc2] focus:ring-4 focus:ring-[#0d7fc2]/10"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-[#31425a]">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                disabled
                className="w-full cursor-not-allowed rounded-2xl border border-neutral-200 bg-neutral-100 px-4 py-3.5 text-base text-neutral-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium text-[#31425a]">
                Role
              </label>
              <input
                id="role"
                type="text"
                value={roleLabel}
                disabled
                className="w-full cursor-not-allowed rounded-2xl border border-neutral-200 bg-neutral-100 px-4 py-3.5 text-base text-neutral-500"
              />
            </div>

            <div className="space-y-2 lg:max-w-md">
              <label htmlFor="preferredLanguage" className="text-sm font-medium text-[#31425a]">
                Preferred interface language
              </label>
              <select
                id="preferredLanguage"
                value={languageValue}
                onChange={(e) => {
                  setLanguageValue(e.target.value);
                }}
                className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3.5 text-base outline-none transition focus:border-[#0d7fc2] focus:ring-4 focus:ring-[#0d7fc2]/10"
              >
                <option value="en">English</option>
                <option value="pl">Polski</option>
                <option value="es">Español</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={isProfilePending}
              className="inline-flex items-center justify-center rounded-2xl bg-[#31425a] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#243347] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isProfilePending ? "Saving..." : "Save changes"}
            </button>

            {profileSuccess && <p className="text-sm text-green-700">{profileSuccess}</p>}
            {profileError && <p className="text-sm text-red-600">{profileError}</p>}
          </div>
        </form>
      </section>

      <section className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-neutral-500">
              Security
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#31425a]">
              Change password
            </h2>
            <p className="mt-2 max-w-2xl text-base leading-7 text-neutral-600">
              Choose a strong password with at least 8 characters. Avoid reusing passwords from
              other services.
            </p>
          </div>

          <div className="inline-flex w-fit items-center rounded-full bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700">
            Sensitive action
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="newPassword" className="text-sm font-medium text-[#31425a]">
                New password
              </label>
              <input
                id="newPassword"
                type="password"
                value={passwordValue}
                onChange={(e) => {
                  setPasswordValue(e.target.value);
                }}
                placeholder="Minimum 8 characters"
                className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3.5 text-base outline-none transition placeholder:text-neutral-400 focus:border-[#0d7fc2] focus:ring-4 focus:ring-[#0d7fc2]/10"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-[#31425a]">
                Confirm new password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={passwordConfirmValue}
                onChange={(e) => {
                  setPasswordConfirmValue(e.target.value);
                }}
                placeholder="Repeat your new password"
                className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3.5 text-base outline-none transition placeholder:text-neutral-400 focus:border-[#0d7fc2] focus:ring-4 focus:ring-[#0d7fc2]/10"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={isPasswordPending}
              className="inline-flex items-center justify-center rounded-2xl bg-[#0d7fc2] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#0b6ca5] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPasswordPending ? "Updating..." : "Update password"}
            </button>

            {passwordSuccess && <p className="text-sm text-green-700">{passwordSuccess}</p>}
            {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
          </div>
        </form>
      </section>
    </div>
  );
}
