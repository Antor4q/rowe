"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cormorant_Garamond, Playfair_Display } from "next/font/google";

gsap.registerPlugin(ScrollTrigger);

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600", "700"] });
const display = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600"] });

// value = count-up er target, suffix = number er pashe ja thakbe
const STATS = [
  { value: 400, suffix: "+", label: "Products we have completed build." },
  { value: 98, suffix: "%", label: "Products we have completed build." },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const mm = gsap.matchMedia(root);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Header reveal
      gsap.from("[data-head]", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        clearProps: "opacity,transform,visibility",
        scrollTrigger: { trigger: root, start: "top 75%" },
      });

      // Image reveal (clip + inner zoom) ar card reveal
      const tl = gsap.timeline({ scrollTrigger: { trigger: gridRef.current, start: "top 80%" } });
      tl.fromTo(
        "[data-img]",
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power4.out", clearProps: "clipPath" }
      )
        .from("[data-img-inner]", { scale: 1.25, duration: 1.4, ease: "power3.out", clearProps: "transform" }, "<")
        .from(
          "[data-stat]",
          { y: 40, opacity: 0, duration: 0.9, stagger: 0.15, ease: "power3.out", clearProps: "opacity,transform,visibility" },
          "<0.3"
        );

      // Count-up
      const counters = root.querySelectorAll<HTMLElement>("[data-count-to]");
      counters.forEach((el) => {
        const target = Number(el.dataset.countTo);
        const suffix = el.dataset.suffix ?? "";
        const obj = { v: 0 };
        el.textContent = `0${suffix}`; // paint er age 0, jate final value flash na kore

        gsap.to(obj, {
          v: target,
          duration: 2,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = `${Math.round(obj.v)}${suffix}`;
          },
          scrollTrigger: { trigger: gridRef.current, start: "top 75%" },
        });
      });

      // Cleanup: revert hole final value fire ashbe
      return () => {
        counters.forEach((el) => {
          el.textContent = `${el.dataset.countTo}${el.dataset.suffix ?? ""}`;
        });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="bg-white py-20 text-[#222628] md:py-28">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-12">
          <h2 data-head className={`${serif.className} text-5xl font-semibold leading-none md:text-7xl lg:text-8xl xl:text-[110px]`}>
            Eco Rowe
          </h2>
          <p data-head className="hidden max-w-[520px] font-sans text-[18px] font-medium leading-snug md:block">
            You&apos;re not only investing in beautiful and comfortable furniture but also reducing negative impacts
            on the environment. It&apos;s a step towards a greener future.
          </p>
        </div>

        {/* Stats + image */}
        <div
          ref={gridRef}
          className="mt-12 grid grid-cols-2 gap-4 md:mt-20 md:grid-cols-[1fr_auto_1fr] md:gap-8"
        >
          {/* Stat 1: desktop e upor-bame */}
          <StatCard stat={STATS[0]} className="order-2 md:order-1 md:self-start md:justify-self-start" />

          {/* Image: majhkhane. md:max-w-none diye 360px cap tule deya hoyeche */}
          <div
            data-img
            className="relative order-1 col-span-2 mx-auto aspect-[9/10] w-full max-w-[360px] overflow-hidden md:order-2 md:col-span-1 md:w-[min(34vw,480px)] md:max-w-none lg:w-[min(40vw,600px)]"
          >
            <div data-img-inner className="absolute inset-0">
              {/* placeholder image path, nijer image dao */}
              <Image
                src="/images/neBann.png"
                alt="Rowe lounge chair"
                fill
                sizes="(min-width: 1024px) 600px, (min-width: 768px) 480px, 90vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Stat 2: desktop e niche-dane */}
          <StatCard stat={STATS[1]} className="order-3 md:self-end md:justify-self-end" />
        </div>
      </div>
    </section>
  );
}

function StatCard({ stat, className = "" }: { stat: (typeof STATS)[number]; className?: string }) {
  return (
    <div
      data-stat
      className={`flex w-full flex-col items-center bg-[#f4f0e8] px-6 py-6 text-center md:w-[clamp(200px,17vw,260px)] ${className}`}
    >
      <span
        data-count-to={stat.value}
        data-suffix={stat.suffix}
        className={`${display.className} text-5xl font-medium leading-none md:text-6xl lg:text-7xl`}
      >
        {stat.value}
        {stat.suffix}
      </span>
      <p className="mt-3 max-w-[170px] font-sans text-sm font-medium leading-snug">{stat.label}</p>
    </div>
  );
}