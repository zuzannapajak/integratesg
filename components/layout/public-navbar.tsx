import Logo from "@/components/layout/logo";
import Link from "next/link";

type Props = {
  locale: string;
};

export default function PublicNavbar({ locale }: Props) {
  return (
    <header className="mock-topbar">
      <div className="mx-auto flex h-19.5 max-w-295 items-center justify-between px-6">
        <Logo locale={locale} />

        <div className="flex items-center gap-8 text-[17px] text-white">
          <nav className="flex items-center gap-8">
            <Link className="mock-topbar-link" href={`/${locale}`}>
              About
            </Link>
            <Link className="mock-topbar-link" href={`/${locale}/auth/login`}>
              Educators
            </Link>
            <Link className="mock-topbar-link" href={`/${locale}/auth/login`}>
              Students
            </Link>
          </nav>

          <div className="h-12 w-px bg-white/70" />

          <Link
            href={`/${locale}/auth/login`}
            className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white text-2xl"
          >
            ○
          </Link>
        </div>
      </div>
    </header>
  );
}
