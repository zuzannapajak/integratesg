import Logo from "@/components/layout/logo";
import Image from "next/image";
import Link from "next/link";

type Props = {
  locale: string;
};

export default function PublicFooter({ locale }: Props) {
  return (
    <footer className="landing-footer px-6 py-12 md:px-10 lg:px-14">
      <div className="mx-auto max-w-340">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div>
            <div className="flex items-center gap-4">
              <Image
                src="/images/cofunder-eu.png"
                alt="Co-funded by the European Union"
                width={220}
                height={54}
                className="h-auto w-auto object-contain"
              />
            </div>

            <p className="mt-5 max-w-180 text-[0.78rem] leading-6 text-white/85">
              Co-Funded by the European Union. Views and opinions expressed are however those of the
              author(s) only and do not necessarily reflect those of the European Union or the
              Foundation for the Development of the Education System (FRSE). Neither the European
              Union nor FRSE can be held responsible for them.
              <br />
              Agreement number: 2024-1-PL01-KA220-VET-000253738.
            </p>
          </div>

          <div className="flex flex-col items-start lg:items-end">
            <Logo locale={locale} className="w-55" />

            <div className="mt-4 text-[0.82rem] leading-6 text-white/90 lg:text-right">
              <p>© 2026 INTEGRAT-ESG PROJECT – All Rights Reserved</p>

              <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 lg:justify-end">
                <Link href={`/${locale}/privacy`} className="hover:underline">
                  Privacy Policy
                </Link>
                <span>–</span>
                <Link href={`/${locale}/accessibility`} className="hover:underline">
                  Accessibility statement
                </Link>
                <span>–</span>
                <Link href={`/${locale}/terms`} className="hover:underline">
                  Terms of Use
                </Link>
                <span>–</span>
                <Link href={`/${locale}/legal-notice`} className="hover:underline">
                  Legal Notice
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-4">
          <a href="#" aria-label="Facebook" className="footer-social-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
              <path d="M22 12.07C22 6.5 17.52 2 12 2S2 6.5 2 12.07c0 5.03 3.66 9.2 8.44 9.93v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.92 3.78-3.92 1.1 0 2.25.2 2.25.2v2.47H15.2c-1.25 0-1.64.78-1.64 1.58v1.89h2.79l-.45 2.9h-2.34V22c4.78-.73 8.44-4.9 8.44-9.93Z" />
            </svg>
          </a>

          <a href="#" aria-label="LinkedIn" className="footer-social-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
              <path d="M6.94 8.5A1.56 1.56 0 1 1 6.94 5.38a1.56 1.56 0 0 1 0 3.12ZM5.6 9.74h2.67V18.4H5.6V9.74Zm4.35 0h2.56v1.18h.04c.36-.67 1.22-1.38 2.5-1.38 2.67 0 3.16 1.76 3.16 4.04v4.82h-2.67v-4.27c0-1.02-.02-2.33-1.42-2.33-1.43 0-1.65 1.12-1.65 2.26v4.34H9.95V9.74Z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
