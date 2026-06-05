"use client";

import {
  dismissPlatformFeedbackReminderAction,
  remindPlatformFeedbackLaterAction,
} from "@/features/platform-feedback/reminder-actions";
import { ArrowRight, Loader2, MessageSquareHeart, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type Props = {
  locale: string;
};

export default function PlatformFeedbackDashboardCard({ locale }: Props) {
  const t = useTranslations("Protected.PlatformFeedbackDashboardCard");
  const router = useRouter();
  const [isHidden, setIsHidden] = useState(false);
  const [pendingAction, setPendingAction] = useState<"remind" | "dismiss" | null>(null);
  const [isPending, startTransition] = useTransition();

  if (isHidden) {
    return null;
  }

  const handleRemindLater = () => {
    setPendingAction("remind");

    startTransition(async () => {
      try {
        await remindPlatformFeedbackLaterAction();
        setIsHidden(true);
        router.refresh();
      } finally {
        setPendingAction(null);
      }
    });
  };

  const handleDismiss = () => {
    setPendingAction("dismiss");

    startTransition(async () => {
      try {
        await dismissPlatformFeedbackReminderAction();
        setIsHidden(true);
        router.refresh();
      } finally {
        setPendingAction(null);
      }
    });
  };

  return (
    <section className="mb-6 overflow-hidden rounded-[28px] border border-white/70 bg-white/88 shadow-[0_12px_34px_rgba(35,45,62,0.06)] backdrop-blur-xl">
      <div className="relative p-5 md:p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(11,156,114,0.13),transparent_28%),radial-gradient(circle_at_88%_12%,rgba(49,66,90,0.08),transparent_28%)]" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#31425a] text-white">
              <MessageSquareHeart className="h-6 w-6" />
            </span>

            <div>
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-emerald-700">
                {t("eyebrow")}
              </p>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-[#31425a]">{t("title")}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#667180]">{t("description")}</p>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
            <Link
              href={`/${locale}/platform-feedback`}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#31425a] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#253347]"
            >
              {t("actions.giveFeedback")}
              <ArrowRight className="h-4 w-4" />
            </Link>

            <button
              type="button"
              onClick={handleRemindLater}
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#d9e2ec] bg-white px-5 py-3 text-sm font-semibold text-[#31425a] transition hover:bg-[#f8fafc] disabled:opacity-60"
            >
              {pendingAction === "remind" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {t("actions.remindLater")}
            </button>

            <button
              type="button"
              onClick={handleDismiss}
              disabled={isPending}
              aria-label={t("actions.dismiss")}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d9e2ec] bg-white text-[#667180] transition hover:bg-[#f8fafc] hover:text-[#31425a] disabled:opacity-60"
            >
              {pendingAction === "dismiss" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
