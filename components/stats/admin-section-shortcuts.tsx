"use client";

import { BarChart3, ClipboardCheck, MessageSquareHeart } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

export default function AdminSectionShortcuts() {
  const locale = useLocale();
  const t = useTranslations("Protected.AdminSectionShortcuts");

  const cards = [
    {
      href: `/${locale}/admin/stats`,
      title: t("cards.stats.title"),
      description: t("cards.stats.description"),
      icon: BarChart3,
      accent: "#0d7fc2",
    },
    {
      href: `/${locale}/admin/curriculum-pilot`,
      title: t("cards.pilot.title"),
      description: t("cards.pilot.description"),
      icon: ClipboardCheck,
      accent: "#d97b16",
    },
    {
      href: `/${locale}/admin/platform-feedback`,
      title: t("cards.feedback.title"),
      description: t("cards.feedback.description"),
      icon: MessageSquareHeart,
      accent: "#0b9c72",
    },
  ];

  return (
    <section
      aria-label={t("ariaLabel")}
      className="relative bg-[#f5f5f3] px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pt-10"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(11,156,114,0.07),transparent_22%),radial-gradient(circle_at_84%_14%,rgba(13,127,194,0.07),transparent_24%)]" />

      <div className="relative mx-auto max-w-360">
        <div className="grid gap-3 lg:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.href}
                href={card.href}
                className="group rounded-3xl border border-white/80 bg-white/90 p-4 shadow-[0_12px_30px_rgba(35,45,62,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-[0_16px_38px_rgba(35,45,62,0.09)] sm:p-5"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: `${card.accent}14`, color: card.accent }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-base font-semibold tracking-tight text-slate-900">
                        {card.title}
                      </p>

                      <span className="shrink-0 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 transition group-hover:border-slate-300 group-hover:text-slate-800">
                        {t("open")}
                      </span>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-500">{card.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
