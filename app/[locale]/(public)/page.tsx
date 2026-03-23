import Image from "next/image";

export default function HomePage() {
  return (
    <main className="mock-hero-bg flex items-center justify-center">
      {/* Background Decorations */}
      <div className="mock-hero-orange" />
      <div className="mock-hero-blue" />

      {/* Content Container */}
      <div className="relative z-20 mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-8 py-20 md:grid-cols-2">
        {/* Left Side: The Image with Blob Mask */}
        <div className="flex justify-center md:justify-end">
          <div className="image-blob-container">
            <Image
              src="/images/writer_flat_composition.jpg"
              alt="Writer Illustration"
              width={400}
              height={400}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </div>

        {/* Right Side: Typography */}
        <div className="text-left">
          <h1 className="max-w-md text-[40px] font-extrabold leading-[1.1] text-[#3a3a3a] md:text-[58px]">
            Lorem ipsum dolor <br />
            sit amet, consecte- <br />
            tur adipiscing elit.
          </h1>
        </div>
      </div>
    </main>
  );
}
