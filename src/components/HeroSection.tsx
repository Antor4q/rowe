import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative container mx-auto h-[900px] overflow-hidden">
      {/* Logo + banner ekshathe bottom e anchor kora */}
      <div className="absolute inset-x-0 -bottom-10">
        <Image
          src="/roweLogo.svg"
          alt="Rowe"
          width={1197}
          height={277}
          priority
          sizes="(min-width: 1440px) 1440px, 100vw"
          className="h-auto w-full"
        />

        {/* Banner: center e, logo r upore, niche er ongsho logo r upor overlap kore */}
        <div className="absolute bottom-[20%] left-1/2 z-10 h-[560px] w-[min(90%,1000px)] -translate-x-1/2 md:h-[800px]">
          <Image
            src="/images/neBann.png"
            alt="Banner"
            fill
            priority
            sizes="(min-width: 1024px) 1000px, 90vw"
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}