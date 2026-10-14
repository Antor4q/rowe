"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cormorant_Garamond } from "next/font/google";

gsap.registerPlugin(ScrollTrigger);

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

// Shob link homepage e jabe
const HOME = "/";

const COLUMNS = [
  {
    title: "Shop",
    links: ["Living Room", "Dining Room", "Bedroom", "Outdoor"],
  },
  {
    title: "Help",
    links: ["Delivery", "Returns", "Contact"],
  },
  {
    title: "Follow",
    links: ["Instagram", "Pinterest"],
  },
];

// How much of the logo (from the bottom) is cropped off, in %.
const CROP = 14;

const linkClass =
  "inline-block py-1.5 font-sans text-base font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#222628] sm:py-1";

const legalLinkClass =
  "inline-block py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#222628]";

/**
 * Text flip hover: text ta upore uthe jay, ekoi text niche theke ashe.
 * Color / opacity change kichu nai.
 */
function FlipLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: string;
  className?: string;
}) {
  const topRef = useRef<HTMLSpanElement>(null);
  const bottomRef = useRef<HTMLSpanElement>(null);

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

  // Touch e hover emulate hoye atke jete pare, tai shudhu real hover device e
  const onEnter = () => {
    if (window.matchMedia("(hover: hover)").matches) flip(true);
  };

  return (
    <Link
      href={href}
      className={className}
      onMouseEnter={onEnter}
      onMouseLeave={() => flip(false)}
      onFocus={() => flip(true)}
      onBlur={() => flip(false)}
    >
      <span className="relative block overflow-hidden leading-normal">
        <span ref={topRef} className="block">
          {children}
        </span>
        <span
          ref={bottomRef}
          aria-hidden="true"
          className="absolute left-0 top-full block"
        >
          {children}
        </span>
      </span>
    </Link>
  );
}

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = footerRef.current;
    if (!root) return;

    const mm = gsap.matchMedia(root);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Footer mobile e onek lomba, tai shob item ek shathe na kore
      // prottek item (ba ek row er item gulo) scroll e ashle reveal hoy.
      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", root);

      gsap.set(items, { y: 40, opacity: 0 });

      ScrollTrigger.batch(items, {
        start: "top 92%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.08,
            ease: "power3.out",
            overwrite: true,
            clearProps: "opacity,transform,visibility",
          }),
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
      className="overflow-hidden bg-[#f0eee8] pt-14 text-[#222628] sm:pt-20 md:pt-28"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top: statement + links
            mobile: 2 col | sm: 3 col | md+: 12-col grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-12 md:grid-cols-12 md:gap-8">
          <div
            data-reveal
            className="col-span-2 sm:col-span-3 md:col-span-5"
          >
            <p
              className={`${serif.className} text-[2rem] font-semibold leading-[1.05] min-[390px]:text-4xl md:text-4xl lg:text-5xl xl:text-6xl`}
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
              <ul className="mt-3 space-y-0.5 sm:mt-4 sm:space-y-1.5">
                {col.links.map((label) => (
                  <li key={label}>
                    <FlipLink href={HOME} className={linkClass}>
                      {label}
                    </FlipLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Legal row */}
        <div
          data-reveal
          className="mt-12 flex flex-col gap-3 border-t border-[#222628]/15 pt-6 font-sans text-sm font-medium text-[#222628]/60 sm:mt-16 md:mt-24 md:flex-row md:items-center md:justify-between"
        >
          <p>&copy; {new Date().getFullYear()} Rowe</p>

          <div className="flex gap-6">
            <FlipLink href={HOME} className={legalLinkClass}>
              Privacy
            </FlipLink>
            <FlipLink href={HOME} className={legalLinkClass}>
              Terms
            </FlipLink>
          </div>
        </div>
      </div>

      {/* Big wordmark (public/roweLogo.svg), cropped at the bottom */}
      <div className="container mx-auto mt-8 overflow-hidden px-4 sm:mt-10 sm:px-6 md:mt-14 lg:px-8">
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