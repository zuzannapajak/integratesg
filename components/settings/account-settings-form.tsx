"use client";

import { updateCurrentUserSettings } from "@/features/settings/actions";
import { createClient } from "@/lib/supabase/client";
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Languages,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type SyntheticEvent, useEffect, useMemo, useRef, useState, useTransition } from "react";

type Props = {
  locale: string;
  email: string;
  fullName: string | null;
  preferredLanguage: string;
  createdAt: string;
};

function replaceLocaleInPath(pathname: string, nextLocale: string) {
  const segments = pathname.split("/");

  if (segments[1]) {
    segments[1] = nextLocale;
  } else {
    segments.push(nextLocale);
  }

  return segments.join("/") || `/${nextLocale}`;
}

export default function AccountSettingsForm({
  locale,
  email,
  fullName,
  preferredLanguage,
  createdAt,
}: Props) {
  const t = useTranslations("Protected.SettingsForm");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
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

  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const languageDropdownRef = useRef<HTMLDivElement | null>(null);

  const languageOptions = [
    { value: "en", label: t("profile.languageOptions.en"), flagCode: "gb" },
    { value: "it", label: t("profile.languageOptions.it"), flagCode: "it" },
    { value: "de", label: t("profile.languageOptions.de"), flagCode: "de" },
    { value: "el", label: t("profile.languageOptions.el"), flagCode: "gr" },
    { value: "pl", label: t("profile.languageOptions.pl"), flagCode: "pl" },
    { value: "bg", label: t("profile.languageOptions.bg"), flagCode: "bg" },
  ] as const;

  const selectedLanguage =
    languageOptions.find((option) => option.value === languageValue) ?? languageOptions[0];

  useEffect(() => {
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!languageDropdownRef.current) return;
      const target = event.target as Node;

      if (!languageDropdownRef.current.contains(target)) {
        setIsLanguageOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown, { passive: true });
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const handleProfileSubmit = (e: SyntheticEvent) => {
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

        const nextPath = replaceLocaleInPath(pathname || `/${locale}/settings`, languageValue);
        const query = searchParams.toString();
        const nextHref = query ? `${nextPath}?${query}` : nextPath;

        setProfileSuccess(t("profile.saved"));

        router.replace(nextHref);
        router.refresh();
      } catch {
        setProfileError(t("profile.failed"));
      }
    });
  };

  const handlePasswordSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (passwordValue.length < 8) {
      setPasswordError(t("security.minLength"));
      return;
    }

    if (passwordValue !== passwordConfirmValue) {
      setPasswordError(t("security.mismatch"));
      return;
    }

    startPasswordTransition(async () => {
      const { error } = await supabase.auth.updateUser({ password: passwordValue });

      if (error) {
        setPasswordError(error.message);
        return;
      }

      setPasswordSuccess(t("security.passwordUpdated"));
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
          <h3 className="text-lg font-semibold text-[#31425a]">{t("profile.title")}</h3>
          <p className="mt-1 text-sm text-[#667180]">{t("profile.subtitle")}</p>
        </div>

        <form
          onSubmit={handleProfileSubmit}
          className="relative z-20 space-y-6 rounded-4xl border border-white/70 bg-white/80 p-6 shadow-[0_8px_30px_rgba(35,45,62,0.04)] backdrop-blur-md md:p-10 lg:col-span-2"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-[#31425a]">
                <User className="h-4 w-4 text-[#8793a2]" /> {t("profile.fullName")}
              </label>
              <input
                type="text"
                value={nameValue}
                onChange={(e) => {
                  setNameValue(e.target.value);
                }}
                className="w-full rounded-2xl border border-[#e2e7ee] bg-white/50 px-4 py-3 text-[#31425a] outline-none transition focus:border-[#0d7fc2] focus:ring-4 focus:ring-[#0d7fc2]/5"
                placeholder={t("profile.fullNamePlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-[#31425a]">
                <Mail className="h-4 w-4 text-[#8793a2]" /> {t("profile.email")}
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
                <Languages className="h-4 w-4 text-[#8793a2]" /> {t("profile.language")}
              </label>

              <div ref={languageDropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsLanguageOpen((prev) => !prev);
                  }}
                  aria-haspopup="listbox"
                  aria-expanded={isLanguageOpen}
                  className={`flex h-12 w-full items-center justify-between rounded-2xl border bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(246,248,251,0.98)_100%)] px-4 text-left shadow-[0_8px_24px_rgba(49,66,90,0.05)] outline-none transition ${
                    isLanguageOpen
                      ? "border-[#0d7fc2] ring-4 ring-[#0d7fc2]/10"
                      : "border-[#dbe3ec] hover:border-[#c8d3df]"
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span
                      className={`fi fi-${selectedLanguage.flagCode} block rounded-[0.16rem] shadow-sm`}
                      style={{ width: "1.35rem", height: "1rem" }}
                      aria-hidden="true"
                    />
                    <span className="truncate text-[0.95rem] font-medium text-[#31425a]">
                      {selectedLanguage.label}
                    </span>
                  </span>

                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-[#8793a2] transition-transform duration-200 ${
                      isLanguageOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 origin-top transition-all duration-200 ${
                    isLanguageOpen
                      ? "pointer-events-auto translate-y-0 opacity-100"
                      : "pointer-events-none -translate-y-1.5 opacity-0"
                  }`}
                >
                  <div className="overflow-hidden rounded-2xl border border-[#dbe3ec] bg-white p-2 shadow-[0_18px_50px_rgba(49,66,90,0.14)]">
                    <div role="listbox" aria-label={t("profile.language")} className="space-y-1">
                      {languageOptions.map((option) => {
                        const isActive = option.value === languageValue;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setLanguageValue(option.value);
                              setIsLanguageOpen(false);
                            }}
                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition ${
                              isActive
                                ? "bg-[#eef6fd] text-[#0d7fc2]"
                                : "text-[#31425a] hover:bg-[#f6f9fc]"
                            }`}
                          >
                            <span className="flex min-w-0 items-center gap-3">
                              <span
                                className={`fi fi-${option.flagCode} block rounded-[0.16rem] shadow-sm`}
                                style={{ width: "1.35rem", height: "1rem" }}
                                aria-hidden="true"
                              />
                              <span className="truncate text-[0.95rem] font-medium">
                                {option.label}
                              </span>
                            </span>

                            {isActive ? <Check className="h-4 w-4 shrink-0" /> : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
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
              {t("profile.save")}
            </button>
          </div>
        </form>
      </div>

      <hr className="border-white/40" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-[#31425a]">{t("security.title")}</h3>
          <p className="mt-1 text-sm text-[#667180]">{t("security.subtitle")}</p>

          <div className="mt-6 hidden rounded-2xl border border-[#e2e7ee] bg-[#f8fafc]/50 p-4 lg:block">
            <div className="flex items-center gap-3 text-[#667180]">
              <Calendar className="h-4 w-4" />
              <div className="text-xs">
                <p>{t("security.memberSince")}</p>
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
                <Lock className="h-4 w-4 text-[#8793a2]" /> {t("security.newPassword")}
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
                {t("security.confirmPassword")}
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
              className="flex items-center gap-2 rounded-xl bg-[#31425a] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#243347] active:scale-95 disabled:opacity-50"
            >
              {isPasswordPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {t("security.updatePassword")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
