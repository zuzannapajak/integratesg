"use client";

export default function NotFoundPage() {
  return (
    <main className="relative flex min-h-[calc(100dvh-78px)] items-center justify-center overflow-hidden bg-[#ececec] px-6 py-10 md:px-10 lg:px-14">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(236,103,37,0.16),transparent_24%),radial-gradient(circle_at_86%_22%,rgba(13,127,194,0.20),transparent_28%),linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(249,250,251,0.98)_58%,rgba(255,255,255,0.96)_100%)]" />

      <div className="absolute left-[8%] top-[18%] h-44 w-44 rounded-full bg-[#ec6725]/20 blur-3xl" />
      <div className="absolute right-[10%] top-[20%] h-52 w-52 rounded-full bg-[#0d7fc2]/22 blur-3xl" />

      <section className="relative z-10 mx-auto w-full max-w-190 rounded-[36px] border border-white/70 bg-white/88 p-8 text-center shadow-[0_20px_55px_rgba(35,45,62,0.10)] backdrop-blur-xl md:p-12">
        <div className="mx-auto flex w-fit items-center gap-4 rounded-full border border-[#31425a]/10 bg-[#f8fafc] px-5 py-2 text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-[#0d7fc2]">
          <span className="inline-block animate-bounce">🚧</span>
          Page not found
        </div>

        <div className="mt-8">
          <div className="text-[5rem] leading-none md:text-[6.5rem]">404</div>

          <h1 className="mt-4 text-[2rem] font-black tracking-[-0.05em] text-[#31425a] md:text-[2.8rem]">
            Upsss! This page took a coffee break.
          </h1>

          <p className="mx-auto mt-5 max-w-[44ch] text-[1rem] leading-8 text-[#596170] md:text-[1.05rem]">
            We looked around and even checked behind the button… but this page is not here.
          </p>
        </div>

        <p className="mt-6 text-sm text-[#7a8594]">
          Error code: <span className="font-semibold text-[#31425a]">404</span> — page wandered off.
        </p>
      </section>
    </main>
  );
}
