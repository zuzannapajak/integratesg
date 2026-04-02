"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

type Props = {
  locale: string;
  className?: string;
  variant?: "light" | "dark";
  href?: string;
};

export default function Logo({ locale, className = "", variant = "light", href }: Props) {
  const t = useTranslations("Logo");
  const src = variant === "dark" ? "/branding/logo.png" : "/branding/logo-white.png";

  return (
    <Link href={href ?? `/${locale}`} className={`flex items-center ${className}`}>
      <Image src={src} alt={t("alt")} width={210} height={50} priority className="h-auto w-full" />
    </Link>
  );
}
