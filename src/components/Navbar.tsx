"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";

/* ===== FONT + COLOR ekhane change koro (shob jaygay apply hobe) =====
   fontWeight: 500 medium, 600 semibold, 700 bold, 800 extrabold
   NAV_COLOR: pure black er bodole soft charcoal. Onno color chaile ekhane bodlao.
   Inline style, tai globals.css ba onno kono CSS override korte parbe na */
const NAV_COLOR = "#3a3a3a";
const NAV_COLOR_MUTED = "rgba(58, 58, 58, 0.12)"; /* hairline er jnno */

const NAV_FONT: React.CSSProperties = {
  fontFamily:
    'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontWeight: 500,
  color: NAV_COLOR,
};

const LEFT_LINKS = [
  { label: "Collection", href: "/collection" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Faq", href: "/faq" },
];

const RIGHT_LINKS = [
  { label: "Search", href: "/search" },
  { label: "Cart (0)", href: "/cart" },
  { label: "Sign in", href: "/signin" },
];

/* Hover e text upor dike roll kore, nicher copy shamne ashe */
function RollLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const roll = (to: number) => {
    if (!ref.current) return;
    gsap.to(ref.current.querySelectorAll("[data-roll]"), {
      yPercent: to,
      duration: 0.55,
      ease: "power4.out",
      overwrite: true,
    });
  };

  return (
    <Link
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseEnter={() => roll(-100)}
      onMouseLeave={() => roll(0)}
      onFocus={() => roll(-100)}
      onBlur={() => roll(0)}
      style={NAV_FONT}
      className="relative inline-block overflow-hidden whitespace-nowrap text-[13px] leading-[1.25] tracking-tight outline-none sm:text-sm lg:text-[15px]"
    >
      <span data-roll className="block">
        {children}
      </span>
      <span data-roll aria-hidden className="absolute left-0 top-full block">
        {children}
      </span>
    </Link>
  );
}

export default function Navbar() {
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* Page load: ekta orchestrated entrance */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from("[data-logo]", {
        clipPath: "inset(0 0 100% 0)",
        yPercent: 30,
        duration: 1.1,
      })
        .from(
          "[data-item]",
          { yPercent: 120, duration: 0.9, stagger: 0.06 },
          "-=0.8"
        )
        .from("[data-line]", { scaleX: 0, duration: 1.2 }, "-=0.9");
    }, headerRef);
    return () => ctx.revert();
  }, []);

  /* Scroll: niche gele hide, upore gele show (menu khola thakle hide hobe na) */
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      if (!headerRef.current) return;
      if (open) return;
      if (y > lastY && y > 120) {
        gsap.to(headerRef.current, { yPercent: -100, duration: 0.6, ease: "power3.out" });
      } else {
        gsap.to(headerRef.current, { yPercent: 0, duration: 0.6, ease: "power3.out" });
      }
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  /* Mobile menu timeline */
  useEffect(() => {
    const ctx = gsap.context(() => {
      tlRef.current = gsap
        .timeline({ paused: true })
        .set(menuRef.current, { display: "flex" })
        .fromTo(
          menuRef.current,
          { clipPath: "inset(0 0 100% 0)" },
          { clipPath: "inset(0 0 0% 0)", duration: 0.8, ease: "power4.inOut" }
        )
        .from(
          "[data-m-item]",
          { yPercent: 110, duration: 0.8, stagger: 0.06, ease: "power4.out" },
          "-=0.35"
        );
    }, menuRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!tlRef.current) return;
    if (open) {
      document.body.style.overflow = "hidden";
      tlRef.current.timeScale(1).play();
    } else {
      document.body.style.overflow = "";
      tlRef.current.timeScale(1.6).reverse();
    }
  }, [open]);

  /* Desktop size e gele mobile menu auto close + body scroll unlock */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => {
      mq.removeEventListener("change", onChange);
      document.body.style.overflow = "";
    };
  }, []);

  /* Escape dile menu close */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        style={NAV_FONT}
        className={`fixed inset-x-0 top-0 z-50 text-[15px] tracking-tight transition-colors duration-500 ${
          scrolled || open ? "bg-white/85 backdrop-blur-md" : "bg-white"
        }`}
      >
        {/* Mobile: 2 col (logo left, Cart/Menu right) | lg+: 3 col (links, logo center, links) */}
        <nav
          aria-label="Main"
          className="mx-auto grid h-16 w-full max-w-[1600px] grid-cols-[1fr_auto] items-center gap-3 px-4 sm:h-[72px] sm:px-6 lg:h-20 lg:grid-cols-[1fr_auto_1fr] lg:px-10 xl:px-14"
        >
          {/* Left (lg+ e dekhabe) */}
          <ul className="hidden items-center gap-6 lg:flex xl:gap-8">
            {LEFT_LINKS.map((l) => (
              <li key={l.label} className="overflow-hidden">
                <div data-item>
                  <RollLink href={l.href}>{l.label}</RollLink>
                </div>
              </li>
            ))}
          </ul>

          {/* Logo: mobile e left, desktop e center */}
          <Link
            href="/"
            aria-label="Home"
            className="relative block justify-self-start lg:justify-self-center"
          >
            <div data-logo>
              {/* Logo: /public/roweLogo.svg */}
              <Image
                src="/roweLogo.svg"
                alt="Logo"
                width={100}
                height={40}
                priority
                className="h-6 w-auto object-contain sm:h-7 lg:h-8"
              />
            </div>
          </Link>

          {/* Right */}
          <ul className="flex items-center justify-end gap-4 sm:gap-5 lg:gap-6 xl:gap-8">
            {RIGHT_LINKS.map((l, i) => (
              <li
                key={l.label}
                className={`overflow-hidden ${i === 0 || i === 2 ? "hidden lg:block" : ""}`}
              >
                <div data-item>
                  <RollLink href={l.href}>{l.label}</RollLink>
                </div>
              </li>
            ))}
            <li className="overflow-hidden lg:hidden">
              <div data-item>
                <button
                  type="button"
                  onClick={() => setOpen((v) => !v)}
                  aria-expanded={open}
                  aria-controls="mobile-menu"
                  style={NAV_FONT}
                  className="py-2 text-[13px] leading-[1.25] tracking-tight sm:text-sm"
                >
                  {open ? "Close" : "Menu"}
                </button>
              </div>
            </li>
          </ul>
        </nav>

        {/* Bottom hairline */}
        <div
          data-line
          style={{ backgroundColor: NAV_COLOR_MUTED }}
          className={`h-px origin-left transition-opacity duration-500 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
        />
      </header>

      {/* Mobile / tablet menu */}
      <div
        id="mobile-menu"
        ref={menuRef}
        style={{ color: NAV_COLOR }}
        className="fixed inset-0 z-40 hidden flex-col justify-between overflow-y-auto bg-white px-4 pb-10 pt-24 sm:px-6 sm:pt-28 lg:hidden"
      >
        <ul className="flex flex-col gap-1 sm:gap-2">
          {[...LEFT_LINKS, ...RIGHT_LINKS.filter((l) => l.label !== "Cart (0)")].map(
            (l) => (
              <li key={l.label} className="overflow-hidden">
                <div data-m-item>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    style={NAV_FONT}
                    className="block py-1 text-[clamp(2.25rem,11vw,4.5rem)] leading-[1.1] tracking-tighter"
                  >
                    {l.label}
                  </Link>
                </div>
              </li>
            )
          )}
        </ul>
      </div>
    </>
  );
}