import { ArrowRight, Clock3, Compass, Sparkles } from "lucide-react";
import Link from "next/link";

type Props = {
  locale: string;
  title: string;
  description: string;
  badge?: string;
};

export default function ComingSoonPage({ locale, title, description, badge }: Props) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f5f3] pb-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(11,156,114,0.10),transparent_26%),radial-gradient(circle_at_82%_18%,rgba(49,66,90,0.08),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.80)_0%,rgba(245,245,243,1)_70%)]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-360 items-center px-4 py-12 sm:px-6 lg:px-8">
        <section className="w-full overflow-hidden rounded-[34px] border border-white/70 bg-white/88 shadow-[0_18px_50px_rgba(35,45,62,0.08)] backdrop-blur-xl">
          <div className="relative grid gap-0 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
            <div className="relative p-7 md:p-10 lg:p-12">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_0%,rgba(11,156,114,0.12),transparent_34%)]" />

              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-emerald-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  {badge ?? "Coming soon"}
                </span>

                <h1 className="mt-6 max-w-4xl text-3xl font-bold tracking-tight text-[#31425a] md:text-[2.9rem] md:leading-tight">
                  {title}
                </h1>

                <p className="mt-5 max-w-3xl text-sm leading-7 text-[#667180] md:text-base md:leading-8">
                  {description}
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl border border-[#e8edf3] bg-white/80 p-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#31425a]">
                      <Clock3 className="h-4 w-4 text-emerald-600" />
                      We are preparing this section
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#667180]">
                      This module is being refined and will be available soon.
                    </p>
                  </div>

                  <div className="rounded-3xl border border-[#e8edf3] bg-white/80 p-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#31425a]">
                      <Compass className="h-4 w-4 text-emerald-600" />
                      Continue learning now
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#667180]">
                      The curriculum module is already available and ready to use.
                    </p>
                  </div>
                </div>

                <Link
                  href={`/${locale}/curriculum`}
                  className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#31425a] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#253347]"
                >
                  Go to curriculum
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <aside className="relative border-t border-[#e8edf3] bg-[#f8fafc]/80 p-7 md:p-10 lg:border-l lg:border-t-0 lg:p-12">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(11,156,114,0.16),transparent_34%)]" />

              <div className="relative flex h-full min-h-72 flex-col justify-center">
                <div className="rounded-[32px] border border-white/80 bg-white/86 p-5 shadow-[0_14px_34px_rgba(35,45,62,0.07)]">
                  <div className="space-y-3">
                    <div className="h-3 w-24 rounded-full bg-emerald-100" />
                    <div className="h-3 w-full rounded-full bg-[#e8edf3]" />
                    <div className="h-3 w-5/6 rounded-full bg-[#e8edf3]" />
                    <div className="h-3 w-2/3 rounded-full bg-[#e8edf3]" />
                  </div>

                  <div className="mt-6 grid gap-3">
                    <div className="rounded-2xl border border-[#e8edf3] bg-[#f8fafc] p-4">
                      <div className="h-2.5 w-28 rounded-full bg-[#d9e2ec]" />
                      <div className="mt-3 h-2.5 w-4/5 rounded-full bg-[#edf2f7]" />
                    </div>

                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                      <div className="h-2.5 w-32 rounded-full bg-emerald-200" />
                      <div className="mt-3 h-2.5 w-3/4 rounded-full bg-emerald-100" />
                    </div>
                  </div>
                </div>

                <p className="mt-5 text-center text-sm leading-6 text-[#667180]">
                  New tools are being prepared carefully to keep the learning experience consistent
                  and reliable.
                </p>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
