"use client";

import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cormorant_Garamond } from "next/font/google";

gsap.registerPlugin(ScrollTrigger);

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

type Feature = {
  index: string;
  title: string;
  text: string;
  tone: string;
  icon: ReactNode;
};

const iconProps = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-full w-full",
  "aria-hidden": true,
};

const FEATURES: Feature[] = [
  {
    index: "01",
    title: "Free Delivery",
    text: "Complimentary white-glove delivery on every order, right into your room.",
    tone: "bg-[#f2f0eb] text-[#222628]",
    icon: (
      <svg {...iconProps}>
        <path d="M4 12h26v22H4z" />
        <path d="M30 20h8l6 7v7H30z" />
        <circle cx="13" cy="36" r="3.5" />
        <circle cx="37" cy="36" r="3.5" />
      </svg>
    ),
  },
  {
    index: "02",
    title: "10-Year Guarantee",
    text: "Solid ash frames built to last, and covered for a full decade.",
    tone: "bg-[#e6e2d9] text-[#222628]",
    icon: (
      <svg {...iconProps}>
        <path d="M24 4l16 6v12c0 10-7 18-16 22C15 40 8 32 8 22V10z" />
        <path d="M17 24l5 5 9-10" />
      </svg>
    ),
  },
  {
    index: "03",
    title: "Easy Returns",
    text: "Not the right fit? Send it back within 30 days, no questions asked.",
    tone: "bg-[#222628] text-white",
    icon: (
      <svg {...iconProps}>
        <path d="M10 18h22a10 10 0 010 20H18" />
        <path d="M18 10l-8 8 8 8" />
      </svg>
    ),
  },
  {
    index: "04",
    title: "Made to Order",
    text: "Handcrafted slowly from natural fabrics and sustainably sourced ash.",
    tone: "border border-[#222628]/15 bg-white text-[#222628]",
    icon: (
      <svg {...iconProps}>
        <path d="M8 24c0-10 8-16 18-16h14v14c0 10-8 18-18 18-8 0-14-6-14-16z" />
        <path d="M8 40c8-10 16-16 28-24" />
      </svg>
    ),
  },
];

/*
  Layout (left title sticky, 2 column) shudhu tokhon-i on hobe jokhon
  screen >=768px WIDE ebong >=560px TALL.

  Card stacking (sticky + scale) ekhon mobile e o cholbe, shudhu height >=560px hole.
  Landscape phone (choto height) e sticky card viewport er baire kete jay,
  tai oi case e normal stacked flow use hoy.
  Same condition niche gsap.matchMedia e-o ache (CARD_MQ).
*/
const STICKY_MQ = "(min-width: 768px) and (min-height: 560px)";
const CARD_MQ = "(min-height: 560px)";

export default function WhyRowe() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = sectionRef.current;

    if (!root) return;

    const mm = gsap.matchMedia(root);

    // Reveal
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from("[data-why-head]", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "opacity,transform,visibility",
        scrollTrigger: {
          trigger: root,
          start: "top 80%",
        },
      });

      // Prottek card nijer scroll position e reveal hoy
      gsap.utils.toArray<HTMLElement>("[data-why-card]", root).forEach((card) => {
        gsap.from(card.querySelectorAll("[data-why-inner]"), {
          y: 40,
          opacity: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: "opacity,transform,visibility",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          },
        });
      });
    });

    // Mobile + tablet + desktop: stacking cards
    mm.add(`${CARD_MQ} and (prefers-reduced-motion: no-preference)`, () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-why-card]", root);

      // each card shrinks a little as the next one slides over it
      cards.forEach((card, i) => {
        const next = cards[i + 1];

        if (next) {
          gsap.to(card, {
            scale: 0.94 - (cards.length - i) * 0.005,
            transformOrigin: "center top",
            ease: "none",
            scrollTrigger: {
              trigger: next,
              start: "top 90%",
              end: () =>
                `top ${parseFloat(getComputedStyle(next).top) + 10}px`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        }
      });
    });

    // Left text starts at the top, then sticks vertically centered (shudhu wide screen e)
    mm.add(STICKY_MQ, () => {
      const box = root.querySelector<HTMLElement>("[data-why-sticky]");

      if (!box) return;

      const setTop = () => {
        const top = Math.max(96, (window.innerHeight - box.offsetHeight) / 2);

        box.style.top = `${top}px`;
      };

      setTop();
      ScrollTrigger.addEventListener("refreshInit", setTop);

      return () => {
        ScrollTrigger.removeEventListener("refreshInit", setTop);
        box.style.top = "";
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-white py-16 text-[#222628] sm:py-20 md:py-24 lg:py-28"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:gap-12 md:grid-cols-12 md:gap-8">
          {/* Left: sticky title (mobile e normal flow, card er upore) */}
          <div
            data-why-sticky
            className="md:col-span-5 md:self-start [@media(min-width:768px)_and_(min-height:560px)]:sticky [@media(min-width:768px)_and_(min-height:560px)]:top-24"
          >
            <div className="flex flex-col gap-8">
              <div>
                <h2
                  data-why-head
                  className={`${serif.className} text-[2.75rem] font-semibold leading-[0.95] sm:text-6xl md:text-7xl lg:text-8xl`}
                >
                  Why
                  <br />
                  <span className="font-medium italic">Rowe</span>
                </h2>

                <p
                  data-why-head
                  className="mt-5 max-w-md font-sans text-base font-medium leading-snug sm:mt-6 md:w-[80%] md:max-w-none md:text-[18px]"
                >
                  Furniture you can trust, backed by promises we actually keep.
                </p>

                <Link
                  href="/about"
                  className="mt-4 flex w-fit items-center gap-2 rounded-none bg-[#222628] px-5 py-3 text-[13px] font-medium text-white transition-all duration-300 hover:gap-4 hover:bg-[#372310] sm:mt-5 sm:text-sm md:mt-7 md:px-7 md:py-3.5"
                >
                  Shop Collection <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right: stacking cards */}
          <div
            data-why-cards
            className="flex flex-col gap-5 sm:gap-6 md:col-span-7 [@media(min-height:560px)]:gap-[18vh]"
          >
            {FEATURES.map((f, i) => (
              <article
                key={f.title}
                data-why-card
                className={`group flex min-h-[20rem] flex-col justify-between p-6 sm:min-h-[24rem] sm:p-8 md:min-h-[26rem] lg:min-h-[30rem] lg:p-10 [@media(min-height:560px)]:sticky ${f.tone}`}
                style={
                  {
                    // sticky na hole (landscape phone) top er kono effect nei
                    top: `calc(6rem + ${i} * 1.25rem)`,
                  } as CSSProperties
                }
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    data-why-inner
                    className={`${serif.className} text-7xl font-semibold leading-none opacity-30 md:text-8xl lg:text-9xl`}
                  >
                    {f.index}
                  </span>

                  <div
                    data-why-inner
                    className="h-9 w-9 shrink-0 transition-transform duration-700 sm:h-12 sm:w-12 lg:h-14 lg:w-14 [@media(hover:hover)]:group-hover:rotate-[12deg] [@media(hover:hover)]:group-hover:scale-110"
                  >
                    {f.icon}
                  </div>
                </div>

                <div data-why-inner>
                  <h3
                    className={`${serif.className} text-3xl font-semibold leading-none min-[390px]:text-4xl sm:text-5xl md:text-[2.5rem] lg:text-6xl`}
                  >
                    {f.title}
                  </h3>

                  <p className="mt-4 max-w-[28rem] font-sans text-sm font-medium leading-snug opacity-70 sm:text-base">
                    {f.text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}