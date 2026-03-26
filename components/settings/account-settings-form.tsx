"use client";

import { updateCurrentUserSettings } from "@/features/settings/actions";
import { createClient } from "@/lib/supabase/client";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Languages,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

type Props = {
  locale: string;
  email: string;
  fullName: string | null;
  preferredLanguage: string;
  createdAt: string;
};

export default function AccountSettingsForm({
  locale,
  email,
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

        setProfileSuccess("Changes saved.");
        setTimeout(() => {
          setProfileSuccess(null);
        }, 3000);
        router.refresh();
      } catch {
        setProfileError("Failed to save.");
      }
    });
  };

  const handlePasswordSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (passwordValue.length < 8) {
      setPasswordError("Min. 8 characters.");
      return;
    }

    if (passwordValue !== passwordConfirmValue) {
      setPasswordError("Passwords mismatch.");
      return;
    }

    startPasswordTransition(async () => {
      const { error } = await supabase.auth.updateUser({ password: passwordValue });

      if (error) {
        setPasswordError(error.message);
        return;
      }

      setPasswordSuccess("Password updated.");
      setPasswordValue("");
      setPasswordConfirmValue("");

      setTimeout(() => {
        setPasswordSuccess(null);
      }, 3000);
    });
  };

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-[#31425a]">Personal Details</h3>
          <p className="mt-1 text-sm text-[#667180]">
            Update your name and preferred language for the interface.
          </p>
        </div>

        <form
          onSubmit={handleProfileSubmit}
          className="space-y-6 rounded-4xl border border-white/70 bg-white/80 p-6 shadow-[0_8px_30px_rgba(35,45,62,0.04)] backdrop-blur-md md:p-10 lg:col-span-2"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-[#31425a]">
                <User className="h-4 w-4 text-[#8793a2]" /> Full Name
              </label>
              <input
                type="text"
                value={nameValue}
                onChange={(e) => {
                  setNameValue(e.target.value);
                }}
                className="w-full rounded-2xl border border-[#e2e7ee] bg-white/50 px-4 py-3 text-[#31425a] outline-none transition focus:border-[#0d7fc2] focus:ring-4 focus:ring-[#0d7fc2]/5"
                placeholder="e.g. John Doe"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-[#31425a]">
                <Mail className="h-4 w-4 text-[#8793a2]" /> Email Address
              </label>
              <div className="group relative">
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full cursor-not-allowed rounded-2xl border border-[#e2e7ee] bg-[#f8fafc] px-4 py-3 text-neutral-500"
                />
                <div className="absolute inset-y-0 right-3 flex items-center">
                  <ShieldCheck className="h-4 w-4 text-green-500" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-[#31425a]">
                <Languages className="h-4 w-4 text-[#8793a2]" /> Language
              </label>
              <select
                value={languageValue}
                onChange={(e) => {
                  setLanguageValue(e.target.value);
                }}
                className="w-full appearance-none rounded-2xl border border-[#e2e7ee] bg-white/50 px-4 py-3 text-[#31425a] outline-none transition focus:border-[#0d7fc2] focus:ring-4 focus:ring-[#0d7fc2]/5"
              >
                <option value="en">English (US)</option>
                <option value="pl">Polski (PL)</option>
                <option value="es">Español (ES)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#f1f5f9] pt-6">
            <div className="flex items-center gap-2">
              {profileSuccess && (
                <span className="animate-in fade-in slide-in-from-left-2 flex items-center gap-1.5 text-sm font-medium text-green-600">
                  <CheckCircle2 className="h-4 w-4" /> {profileSuccess}
                </span>
              )}
              {profileError && (
                <span className="flex items-center gap-1.5 text-sm font-medium text-red-600">
                  <AlertCircle className="h-4 w-4" /> {profileError}
                </span>
              )}
            </div>

            <button
              disabled={isProfilePending}
              className="flex items-center gap-2 rounded-xl bg-[#31425a] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#243347] active:scale-95 disabled:opacity-50"
            >
              {isProfilePending && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>

      <hr className="border-white/40" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-[#31425a]">Security</h3>
          <p className="mt-1 text-sm text-[#667180]">
            Ensure your account is using a long, random password to stay secure.
          </p>

          <div className="mt-6 hidden rounded-2xl border border-[#e2e7ee] bg-[#f8fafc]/50 p-4 lg:block">
            <div className="flex items-center gap-3 text-[#667180]">
              <Calendar className="h-4 w-4" />
              <div className="text-xs">
                <p>Member since</p>
                <p className="font-semibold text-[#31425a]">
                  {new Date(createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handlePasswordSubmit}
          className="space-y-6 rounded-4xl border border-white/70 bg-white/80 p-6 shadow-[0_8px_30px_rgba(35,45,62,0.04)] backdrop-blur-md md:p-10 lg:col-span-2"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-[#31425a]">
                <Lock className="h-4 w-4 text-[#8793a2]" /> New Password
              </label>
              <input
                type="password"
                value={passwordValue}
                onChange={(e) => {
                  setPasswordValue(e.target.value);
                }}
                className="w-full rounded-2xl border border-[#e2e7ee] bg-white/50 px-4 py-3 text-[#31425a] outline-none transition focus:border-[#0d7fc2] focus:ring-4 focus:ring-[#0d7fc2]/5"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-[#31425a]">
                Confirm Password
              </label>
              <input
                type="password"
                value={passwordConfirmValue}
                onChange={(e) => {
                  setPasswordConfirmValue(e.target.value);
                }}
                className="w-full rounded-2xl border border-[#e2e7ee] bg-white/50 px-4 py-3 text-[#31425a] outline-none transition focus:border-[#0d7fc2] focus:ring-4 focus:ring-[#0d7fc2]/5"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#f1f5f9] pt-6">
            <div className="flex items-center gap-2">
              {passwordSuccess && (
                <span className="animate-in fade-in flex items-center gap-1.5 text-sm font-medium text-green-600">
                  <CheckCircle2 className="h-4 w-4" /> {passwordSuccess}
                </span>
              )}
              {passwordError && (
                <span className="flex items-center gap-1.5 text-sm font-medium text-red-600">
                  <AlertCircle className="h-4 w-4" /> {passwordError}
                </span>
              )}
            </div>

            <button
              disabled={isPasswordPending}
              className="rounded-xl bg-[#0d7fc2] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#0b6ca5] active:scale-95"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
