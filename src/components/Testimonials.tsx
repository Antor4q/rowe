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
  style: ["normal", "italic"],
});

type Part = { t: string; img?: never } | { img: string; t?: never };

// Big statement, with image pills between sentences
const PARTS: Part[] = [
  { t: "Quality you can feel the moment you sit down." },
  { img: "/images/coll1.jpg" },
  { t: "Three months on, it still looks brand new." },
  { img: "/images/coll3.jpg" },
  { t: "The only sofa we would ever buy again." },
  { img: "/images/coll5.jpg" },
];

type Review = { name: string; product: string; quote: string };

// Replace with your real reviews
const REVIEWS: Review[] = [
  {
    name: "Amelia Hart",
    product: "Orla Sofa",
    quote: "My living room finally feels like somewhere I never want to leave.",
  },
  {
    name: "Daniel Okafor",
    product: "Noir Sectional",
    quote: "Friends keep asking where it is from. I keep sending them to Rowe.",
  },
  {
    name: "Priya Nair",
    product: "Sela Lounge Chair",
    quote: "The best built chair I own, and my favourite corner for reading.",
  },
  {
    name: "Tomas Berg",
    product: "Mira Loveseat",
    quote: "Delivery was effortless and the fabric feels even better in person.",
  },
  {
    name: "Layla Rahman",
    product: "Kaya Armchair",
    quote: "Quiet, considered design. It disappears into the room beautifully.",
  },
  {
    name: "Noah Fischer",
    product: "Orla Sofa",
    quote: "Solid, soft and genuinely comfortable. Worth every penny.",
  },
];

const STATS = [
  { value: 4.9, decimals: 1, suffix: "/5", label: "Verified reviews" },
  { value: 20, decimals: 0, suffix: "K+", label: "Homes furnished" },
  { value: 96.7, decimals: 1, suffix: "%", label: "Would recommend" },
  { value: 10, decimals: 0, suffix: "+", label: "Years of craft" },
];

function Stars() {
  return (
    <div className="flex gap-1" aria-label="Rated 5 out of 5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="h-4 w-4 fill-current"
          aria-hidden
        >
          <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 20.9l1.6-7L2 9.2l7.1-.6z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ r }: { r: Review }) {
  return (
    <article className="flex w-[78vw] shrink-0 flex-col justify-between gap-8 border border-[#f2f0eb]/15 p-6 sm:w-[24rem] lg:w-[28rem] lg:p-8">
      <div className="flex flex-col gap-5">
        <Stars />
        <p className="font-sans text-base font-medium leading-snug lg:text-lg">
          {"\u201C"}
          {r.quote}
          {"\u201D"}
        </p>
      </div>

      <div className="font-sans">
        <p className="text-sm font-medium">{r.name}</p>
        <p className="text-sm font-medium opacity-50">{r.product}</p>
      </div>
    </article>
  );
}

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = sectionRef.current;

    if (!root) return;

    const mm = gsap.matchMedia(root);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // header reveal
      gsap.from("[data-t-head]", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "opacity,transform,visibility",
        scrollTrigger: {
          trigger: root,
          start: "top 75%",
        },
      });

      // words light up while scrolling
      gsap.fromTo(
        "[data-w]",
        { opacity: 0.18 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.12,
          scrollTrigger: {
            trigger: "[data-statement]",
            start: "top 80%",
            end: "bottom 55%",
            scrub: true,
          },
        }
      );

      // pills grow in
      gsap.from("[data-pill]", {
        width: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-statement]",
          start: "top 70%",
        },
      });

      // marquee rows
      const cleanups: Array<() => void> = [];

      gsap.utils.toArray<HTMLElement>("[data-track]", root).forEach((track, i) => {
        const left = i % 2 === 0;
        const wrap = track.parentElement as HTMLElement;

        const tween = gsap.fromTo(
          track,
          { xPercent: left ? 0 : -50 },
          {
            xPercent: left ? -50 : 0,
            duration: 55,
            ease: "none",
            repeat: -1,
          }
        );

        const pause = () => tween.pause();
        const play = () => tween.resume();

        wrap.addEventListener("mouseenter", pause);
        wrap.addEventListener("mouseleave", play);

        cleanups.push(() => {
          wrap.removeEventListener("mouseenter", pause);
          wrap.removeEventListener("mouseleave", play);
        });
      });

      // stats
      gsap.from("[data-t-stat]", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        clearProps: "opacity,transform,visibility",
        scrollTrigger: {
          trigger: "[data-t-stats]",
          start: "top 88%",
        },
      });

      root.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
        const target = Number(el.dataset.count);
        const decimals = Number(el.dataset.decimals ?? 0);
        const suffix = el.dataset.suffix ?? "";
        const obj = { v: 0 };

        el.textContent = `${(0).toFixed(decimals)}${suffix}`;

        gsap.to(obj, {
          v: target,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
          },
          onUpdate: () => {
            el.textContent = `${obj.v.toFixed(decimals)}${suffix}`;
          },
        });
      });

      return () => cleanups.forEach((fn) => fn());
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-[#222628] py-24 text-[#f2f0eb]"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-8">
          <h2
            data-t-head
            className={`${serif.className} text-5xl font-semibold leading-[0.95] md:text-7xl lg:text-8xl`}
          >
            Lived In,
            <br />
            <span className="font-medium italic">Loved</span>
          </h2>

          <div
            data-t-head
            className="hidden flex-col items-start gap-3 font-sans md:flex md:w-[31.8%]"
          >
            <Stars />
            <p className="text-[18px] font-medium leading-snug">
              4.9 out of 5, from thousands of verified Rowe owners.
            </p>
          </div>
        </div>

        {/* Statement with image pills */}
        <div data-statement className="mt-16 md:mt-24">
          <p
            className={`${serif.className} text-4xl font-medium leading-[1.12] md:text-6xl lg:text-7xl`}
          >
            {PARTS.map((p, i) =>
              p.img ? (
                <span
                  key={i}
                  data-w
                  data-pill
                  className="relative mx-1 inline-block h-[0.72em] w-[1.5em] translate-y-[0.06em] overflow-hidden rounded-full align-baseline"
                >
                  <Image
                    src={p.img}
                    alt=""
                    fill
                    sizes="12rem"
                    className="object-cover"
                  />
                </span>
              ) : (
                p.t.split(" ").map((w, j) => (
                  <span key={`${i}-${j}`}>
                    <span data-w className="inline-block">
                      {w}
                    </span>{" "}
                  </span>
                ))
              )
            )}
          </p>

          <p className="mt-8 font-sans text-sm font-medium opacity-60">
            Amelia, Daniel and Priya, verified Rowe owners
          </p>
        </div>
      </div>

      {/* Marquee rows (full width) */}
      <div className="mt-20 flex flex-col gap-4 md:mt-28">
        {[0, 1].map((row) => (
          <div key={row} className="overflow-hidden">
            <div data-track className="flex w-max">
              {[0, 1].map((copy) => (
                <div key={copy} className="flex shrink-0 gap-4 pr-4">
                  {(row === 0 ? REVIEWS : [...REVIEWS].reverse()).map((r) => (
                    <ReviewCard key={`${copy}-${r.name}`} r={r} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4">
        {/* Stats */}
        <div
          data-t-stats
          className="mt-20 grid grid-cols-2 gap-x-4 gap-y-10 border-t border-[#f2f0eb]/15 pt-10 md:mt-28 lg:grid-cols-4 lg:gap-x-0"
        >
          {STATS.map((s, i) => (
            <div
              key={s.label}
              data-t-stat
              className={i > 0 ? "lg:border-l lg:border-[#f2f0eb]/15 lg:pl-8" : ""}
            >
              <div
                data-count={s.value}
                data-decimals={s.decimals}
                data-suffix={s.suffix}
                className={`${serif.className} text-5xl font-semibold leading-none md:text-6xl lg:text-7xl`}
              >
                {s.value.toFixed(s.decimals)}
                {s.suffix}
              </div>

              <div className="mt-3 font-sans text-sm font-medium opacity-60">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}