"use client";

import { MessageSquareHeart } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  locale: string;
};

function isScenarioModulePath(pathname: string): boolean {
  return /^\/[^/]+\/scenarios(?:\/|$)/.test(pathname);
}

export default function PlatformFeedbackBubble({ locale }: Props) {
  const pathname = usePathname();
  const t = useTranslations("Protected.PlatformFeedbackBubble");

  if (isScenarioModulePath(pathname)) {
    return null;
  }

  return (
    <Link
      href={`/${locale}/platform-feedback`}
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full border border-white/70 bg-[#31425a] px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(35,45,62,0.22)] transition hover:-translate-y-0.5 hover:bg-[#253347] focus:outline-none focus:ring-4 focus:ring-emerald-100"
    >
      <MessageSquareHeart className="h-4 w-4" />
      <span className="hidden sm:inline">{t("label")}</span>
    </Link>
  );
}
