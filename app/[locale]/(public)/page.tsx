export default function HomePage() {
  return (
    <main className="mock-page mock-hero-bg">
      <div className="mock-hero-orange" />
      <div className="mock-hero-blue" />

      <div className="relative mx-auto grid min-h-[calc(100vh-78px)] max-w-295 grid-cols-1 items-center gap-10 px-6 py-16 md:grid-cols-[360px_1fr]">
        <div className="flex items-center justify-center">
          <div className="h-62.5 w-62.5 rounded-[36px] bg-[#d9e4ec] shadow-sm" />
        </div>

        <div className="max-w-140">
          <h1 className="text-[44px] font-bold leading-[1.15] text-[#2f3542] md:text-[58px]">
            Lorem ipsum dolor
            <br />
            sit amet, consecte-
            <br />
            tur adipiscing elit.
          </h1>
        </div>
      </div>
    </main>
  );
}
