"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cormorant_Garamond } from "next/font/google";

gsap.registerPlugin(ScrollTrigger);

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

// value = count-up target, suffix = number er pashe ja thakbe
const STATS = [
  { value: 400, suffix: "+", label: "Pieces crafted from responsibly sourced solid ash." },
  { value: 98, suffix: "%", label: "Of our packaging is recycled or reused." },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const mm = gsap.matchMedia(root);

    // Reveal + count-up
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from("[data-head]", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        clearProps: "opacity,transform,visibility",
        scrollTrigger: { trigger: root, start: "top 75%" },
      });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: gridRef.current, start: "top 80%" },
      });

      tl.fromTo(
        "[data-img]",
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.2,
          ease: "power4.out",
          clearProps: "clipPath",
        }
      )
        .from(
          "[data-img-inner]",
          { scale: 1.25, duration: 1.4, ease: "power3.out", clearProps: "transform" },
          "<"
        )
        .from(
          "[data-stat]",
          {
            y: 60,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
            clearProps: "opacity,transform,visibility",
          },
          "<0.3"
        );

      const counters = root.querySelectorAll<HTMLElement>("[data-count-to]");

      counters.forEach((el) => {
        const target = Number(el.dataset.countTo);
        const suffix = el.dataset.suffix ?? "";
        const obj = { v: 0 };

        el.textContent = `0${suffix}`; // paint er age 0, jate final value flash na kore

        gsap.to(obj, {
          v: target,
          duration: 2.2,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = `${Math.round(obj.v)}${suffix}`;
          },
          scrollTrigger: { trigger: gridRef.current, start: "top 75%" },
        });
      });

      // revert hole final value fire ashbe
      return () => {
        counters.forEach((el) => {
          el.textContent = `${el.dataset.countTo}${el.dataset.suffix ?? ""}`;
        });
      };
    });

    // Desktop parallax (numbers move in opposite directions)
    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        gsap.utils.toArray<HTMLElement>("[data-par]", root).forEach((el) => {
          const from = Number(el.dataset.from ?? 60);
          const to = Number(el.dataset.to ?? -60);

          gsap.fromTo(
            el,
            { y: from },
            {
              y: to,
              ease: "none",
              scrollTrigger: {
                trigger: gridRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        });
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="overflow-hidden bg-white py-20 text-[#222628] md:py-28"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-12">
          <h2
            data-head
            className={`${serif.className} text-5xl font-semibold leading-none md:text-7xl lg:text-8xl xl:text-[110px]`}
          >
            Eco Rowe
          </h2>

          <p
            data-head
            className="hidden max-w-[520px] font-sans text-[18px] font-medium leading-snug md:block"
          >
            You&apos;re not only investing in beautiful and comfortable
            furniture but also reducing negative impacts on the environment.
            It&apos;s a step towards a greener future.
          </p>
        </div>

        {/* Image + giant numbers */}
        <div
          ref={gridRef}
          className="relative mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:mt-20 md:block"
        >
          {/* Image (opaque photo, numbers image er dui pashe thake) */}
          <div
            data-img
            className="relative z-10 col-span-2 mx-auto aspect-[9/10] w-full max-w-[360px] overflow-hidden bg-[#e6e2d9] md:w-[min(34vw,480px)] md:max-w-none lg:w-[min(40vw,600px)]"
          >
            <div data-img-inner className="absolute inset-0">
              <Image
                src="/images/ecoChair.jpg"
                alt="Rowe armchair in solid ash and natural boucle"
                fill
                sizes="(min-width: 1024px) 600px, (min-width: 768px) 480px, 90vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Stat 1: desktop e upor-bame */}
          <Stat
            stat={STATS[0]}
            className="md:absolute md:left-0 md:top-[2%] md:z-0"
            from={70}
            to={-70}
          />

          {/* Stat 2: desktop e niche-dane */}
          <Stat
            stat={STATS[1]}
            className="md:absolute md:bottom-[2%] md:right-0 md:z-0 md:items-end md:text-right"
            from={-70}
            to={70}
            right
          />
        </div>
      </div>
    </section>
  );
}

function Stat({
  stat,
  className = "",
  from,
  to,
  right = false,
}: {
  stat: (typeof STATS)[number];
  className?: string;
  from: number;
  to: number;
  right?: boolean;
}) {
  return (
    <div data-stat className={`flex flex-col ${className}`}>
      <div data-par data-from={from} data-to={to} className="flex flex-col">
        <span
          data-count-to={stat.value}
          data-suffix={stat.suffix}
          className={`${serif.className} block text-[17vw] font-semibold leading-[0.85] [font-variant-numeric:lining-nums] md:text-[clamp(96px,14.5vw,260px)]`}
        >
          {stat.value}
          {stat.suffix}
        </span>

        <p className={`mt-3 max-w-[220px] font-sans text-sm font-medium leading-snug md:mt-4 md:text-base md:max-w-[260px] ${right ? "md:ml-auto" : ""}`}>
          {stat.label}
        </p>
      </div>
    </div>
  );
}