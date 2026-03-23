import BackgroundMasks from "@/components/ui/background-masks";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="mock-hero-bg">
      <BackgroundMasks />

      <div className="mock-hero-orange" />
      <div className="mock-hero-blue" />

      <div className="relative z-30 mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-2 items-center gap-8 px-8 w-full pt-12 md:pt-0">
        {/* Left: Image Container */}
        <div className="flex justify-center md:justify-end items-center">
          <div className="image-blob-container">
            <Image
              src="/images/writer_flat_composition.jpg"
              alt="Writer"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 280px, 400px"
            />
          </div>
        </div>

        {/* Right: Typography */}
        <div className="z-40 md:pl-12 -mt-15 md:-mt-47.5 -ml-5 md:-ml-20 text-center md:text-left">
          <h1 className="hero-title text-[38px] sm:text-[46px] md:text-[50px]">
            Lorem ipsum dolor <br className="hidden md:block" />
            sit amet, consecte- <br className="hidden md:block" />
            tur adipiscing elit.
          </h1>
        </div>
      </div>
    </main>
  );
}
