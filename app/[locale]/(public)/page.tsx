import BackgroundMasks from "@/components/ui/background-masks";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="mock-hero-bg">
      <BackgroundMasks />

      <div className="mock-hero-orange" />
      <div className="mock-hero-blue" />

      <div className="relative z-30 mx-auto grid max-w-7xl grid-cols-1 items-center gap-4 px-8 md:grid-cols-2 w-full">
        <div className="flex justify-center md:justify-end items-center">
          <div className="image-blob-container">
            <Image
              src="/images/writer_flat_composition.jpg"
              alt="Writer"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="z-40">
          <h1 className="text-[40px] md:text-[60px] font-black text-[#3a3a3a] leading-[1.1] tracking-tight">
            Lorem ipsum dolor <br />
            sit amet, consecte- <br />
            tur adipiscing elit.
          </h1>
        </div>
      </div>
    </main>
  );
}
