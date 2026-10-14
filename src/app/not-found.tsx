"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Cormorant_Garamond } from "next/font/google";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export default function NotFound() {
  const rootRef = useRef<HTMLElement>(null);
  const topRef = useRef<HTMLSpanElement>(null);
  const bottomRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia(root);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from("[data-reveal]", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        clearProps: "opacity,transform,visibility",
      });
    });

    return () => mm.revert();
  }, []);

  const flip = (active: boolean) => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !topRef.current ||
      !bottomRef.current
    ) {
      return;
    }

    gsap.to([topRef.current, bottomRef.current], {
      yPercent: active ? -100 : 0,
      duration: 0.45,
      ease: "power3.inOut",
      overwrite: true,
    });
  };

  return (
    <main
      ref={rootRef}
      className="flex min-h-screen items-center justify-center bg-[#f0eee8] text-[#222628]"
    >
      <div className="container mx-auto flex flex-col items-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <p
          data-reveal
          className="font-sans text-sm font-medium text-[#222628]/50"
        >
          404 &mdash; Coming soon
        </p>

        <h1
          data-reveal
          className={`${serif.className} mt-4 text-5xl font-semibold leading-[1.05] sm:text-6xl md:text-7xl lg:text-8xl`}
        >
          This page is
          <br />
          still being made.
        </h1>

        <p
          data-reveal
          className="mx-auto mt-6 max-w-md font-sans text-base font-medium text-[#222628]/60 sm:text-lg"
        >
          We&apos;re still arranging the furniture here. Please check back
          soon, or head back to the homepage.
        </p>

        <div data-reveal className="mt-10 flex justify-center">
        <Link
            href="/"
            className="mt-4 flex w-fit items-center gap-2 rounded-none bg-[#222628] px-5 py-3 text-[13px] font-medium text-white transition-all duration-300 hover:gap-4 hover:bg-[#372310] sm:mt-5 sm:text-sm md:mt-7 md:px-7 md:py-3.5"
          >
            Back to Home <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </main>
  );
}