"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
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

type Story = {
  period: string; // tab label
  quote: string;
  name: string;
  city: string;
  product: string;
  image: string;
};

const STORIES: Story[] = [
  {
    period: "Day 1",
    quote:
      "I did not expect the fabric to feel this soft out of the box. It looked even better in my living room than it did online.",
    name: "Amelia Hart",
    city: "Manchester",
    product: "Orla Sofa",
    image: "/images/ne5.jpg",
  },
  {
    period: "Month 6",
    quote:
      "Two kids, one dog and a lot of Sunday afternoons later, it still looks the way it did when it arrived.",
    name: "Daniel Okafor",
    city: "Bristol",
    product: "Mira Loveseat",
    image: "/images/ne2.jpg",
  },
  {
    period: "Year 1",
    quote:
      "A year in, friends still ask where we found it. It is the one piece I would buy again without thinking twice.",
    name: "Priya Nair",
    city: "Edinburgh",
    product: "Kaya Armchair",
    image: "/images/ne5.jpg",
  },
];

const AUTOPLAY_MS = 8000;

function Stars() {
  return (
    <div className="flex gap-1" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="#222628"
          aria-hidden="true"
        >
          <path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7-6.3-3.8-6.3 3.8 1.7-7L2 9.5l7.1-.6L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Scroll reveal
  useLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const mm = gsap.matchMedia(root);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from("[data-head]", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "opacity,transform,visibility",
        scrollTrigger: { trigger: root, start: "top 75%" },
      });

      gsap.from("[data-stage]", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        clearProps: "opacity,transform,visibility",
        scrollTrigger: { trigger: "[data-stage]", start: "top 85%" },
      });
    });

    return () => mm.revert();
  }, []);

  // Quote swap animation (skip first render)
  useLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const root = sectionRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-q]",
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: "transform,opacity",
        }
      );
    }, root);

    return () => ctx.revert();
  }, [active]);

  // Autoplay (pauses on hover/focus)
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      setActive((a) => (a + 1) % STORIES.length);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(id);
  }, [paused, active]);

  const story = STORIES[active];

  return (
    <section
      ref={sectionRef}
      className="bg-[#f0eee8] py-24 text-[#222628]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-8">
          <h2
            data-head
            className={`${serif.className} text-5xl font-semibold leading-none md:text-7xl lg:text-8xl xl:text-[110px]`}
          >
            In Their
           
            Words
          </h2>

          <div
            data-head
            className="hidden md:block md:w-[31.8%]"
          >
            <p className="font-sans text-[18px] font-medium leading-snug">
              Real owners, real living rooms. See how Rowe holds up from the
              first day to the first year.
            </p>
            <p className="mt-4 font-sans text-sm font-medium text-[#222628]/60">
              4.9 out of 5 from 20,000+ verified owners
            </p>
          </div>
        </div>

        {/* Stage */}
        <div className="mt-12 grid grid-cols-1 gap-10 md:mt-16 md:grid-cols-12 md:gap-8">
          {/* Image */}
          <div data-stage className="md:col-span-5">
            <div className="relative aspect-[4/3] overflow-hidden bg-[#e6e2d9]">
              {STORIES.map((s, i) => (
                <Image
                  key={s.product}
                  src={s.image}
                  alt={s.product}
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className={`object-cover transition-opacity duration-700 ${
                    i === active ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}

              <div className="absolute bottom-0 left-0 bg-white px-4 py-3 font-sans">
                <p className="text-xs font-medium text-[#222628]/60">
                  Owned by {story.name.split(" ")[0]}
                </p>
                <p className="text-sm font-medium md:text-base">
                  {story.product}
                </p>
              </div>
            </div>
          </div>

          {/* Quote */}
          <div
            data-stage
            className="flex flex-col justify-center md:col-span-6 md:col-start-7"
          >
            <div aria-live="polite">
              <div data-q>
                <Stars />
              </div>

              <blockquote
                data-q
                className={`${serif.className} mt-6 text-3xl font-medium italic leading-[1.15] md:min-h-[260px] md:text-5xl lg:text-6xl`}
              >
                &ldquo;{story.quote}&rdquo;
              </blockquote>

              <div data-q className="mt-8 font-sans">
                <p className="text-base font-medium md:text-lg">
                  {story.name}
                </p>
                <p className="text-sm font-medium text-[#222628]/60">
                  {story.city} &middot; Verified owner
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}