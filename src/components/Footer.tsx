"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cormorant_Garamond } from "next/font/google";

gsap.registerPlugin(ScrollTrigger);

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "Living Room", href: "/shop?category=living-room" },
      { label: "Dining Room", href: "/shop?category=dining-room" },
      { label: "Bedroom", href: "/shop?category=bedroom" },
      { label: "Outdoor", href: "/shop?category=outdoor" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Delivery", href: "/delivery" },
      { label: "Returns", href: "/returns" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Follow",
    links: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "Pinterest", href: "https://pinterest.com" },
    ],
  },
];

// How much of the logo (from the bottom) is cropped off, in %.
const CROP = 14;

const linkClass =
  "relative inline-block font-sans text-base font-medium transition-opacity duration-300 hover:opacity-60";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = footerRef.current;
    if (!root) return;

    const mm = gsap.matchMedia(root);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from("[data-reveal]", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "opacity,transform,visibility",
        scrollTrigger: { trigger: root, start: "top 80%" },
      });

      gsap.fromTo(
        logoRef.current,
        { yPercent: 100 },
        {
          yPercent: CROP,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: logoRef.current?.parentElement,
            start: "top 95%",
          },
        }
      );
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(logoRef.current, { yPercent: CROP });
    });

    return () => mm.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="overflow-hidden bg-[#f0eee8] pt-20 text-[#222628] md:pt-28"
    >
      <div className="container mx-auto px-4">
        {/* Top: statement + links */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-12 md:gap-8">
          <div data-reveal className="col-span-2 md:col-span-5">
            <p
              className={`${serif.className} text-4xl font-semibold leading-[1.05] md:text-5xl lg:text-6xl`}
            >
              Furniture made
              <br />
              to be lived in.
            </p>

          </div>

          {COLUMNS.map((col, i) => (
            <nav
              key={col.title}
              data-reveal
              aria-label={col.title}
              className={`md:col-span-2 ${i === 0 ? "md:col-start-7" : ""}`}
            >
              <h3 className="font-sans text-sm font-medium text-[#222628]/50">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {col.links.map((l) => {
                  const external = l.href.startsWith("http");

                  return (
                    <li key={l.label}>
                      {external ? (
                        <a
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={linkClass}
                        >
                          {l.label}
                        </a>
                      ) : (
                        <Link href={l.href} className={linkClass}>
                          {l.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}
        </div>

        {/* Legal row */}
        <div
          data-reveal
          className="mt-16 flex flex-col gap-3 border-t border-[#222628]/15 pt-6 font-sans text-sm font-medium text-[#222628]/60 md:mt-24 md:flex-row md:items-center md:justify-between"
        >
          <p>&copy; {new Date().getFullYear()} Rowe</p>

          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="transition-colors duration-300 hover:text-[#222628]"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="transition-colors duration-300 hover:text-[#222628]"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>

      {/* Big wordmark (public/roweLogo.svg), cropped at the bottom */}
      <div className="container mx-auto mt-10 overflow-hidden px-4 md:mt-14">
        <div
          ref={logoRef}
          role="img"
          aria-label="Rowe"
          style={{
            backgroundColor: "#222628",
            WebkitMaskImage: "url(/roweLogo.svg)",
            maskImage: "url(/roweLogo.svg)",
            WebkitMaskSize: "100% 100%",
            maskSize: "100% 100%",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
          }}
        >
          {/* Invisible img only gives the box the logo's real aspect ratio */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/roweLogo.svg"
            alt=""
            aria-hidden="true"
            className="invisible block h-auto w-full"
          />
        </div>
      </div>
    </footer>
  );
}