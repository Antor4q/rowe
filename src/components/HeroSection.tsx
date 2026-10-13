"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PRODUCT = { slug: "lune-chair", name: "Lune Chair", fabric: "Belgian linen" };

type Variant = { name: string; src: string; filter?: string };

// Slide korle chair er color change hoy. Real color image thakle protita `src` e dao,
// tokhon `filter` muche felo. Ekhon shob placeholder + CSS filter diye color dekhano hocche.
const VARIANTS: Variant[] = [
  { name: "Oat", src: "/images/neBann.png" },
  { name: "Sand", src: "/images/neBann.png", filter: "sepia(.55) saturate(1.3) brightness(.92)" },
  { name: "Sage", src: "/images/neBann.png", filter: "sepia(.35) hue-rotate(40deg) saturate(.9) brightness(.92)" },
];

const AUTOPLAY_MS = 3500; // koto millisecond por por color change hobe

const pad = (n: number) => String(n).padStart(2, "0");

export default function HeroSection() {
  const rootRef = useRef<HTMLElement>(null);
  const enterRef = useRef<HTMLDivElement>(null); // load + slide swap
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);

  const [index, setIndex] = useState(0);

  const total = VARIANTS.length;
  const variant = VARIANTS[index];

  const hotspots = [
    { x: "56%", y: "22%", label: "Fabric", value: PRODUCT.fabric },
    { x: "47%", y: "56%", label: "Piping", value: "Hand-stitched" },
    { x: "20%", y: "70%", label: "Legs", value: "Solid ash" },
  ];

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia(root);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      /* ---------- Load animation ---------- */
      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .from(logoRef.current, { yPercent: 100, duration: 1.3 })
        .from("[data-chair-a]", { y: -320, opacity: 0, rotation: -5, duration: 1.2, ease: "power3.out" }, "-=0.7")
        .from("[data-shadow]", { scale: 0.5, opacity: 0, duration: 0.9 }, "-=0.5")
        // description + button ekta block hishebe ekshathe reveal hoy
        .from("[data-reveal]", { y: 30, opacity: 0, duration: 1, clearProps: "opacity,transform,visibility" }, "-=0.6")
        .from("[data-pager-in]", { y: 20, opacity: 0, duration: 0.8, clearProps: "opacity,transform,visibility" }, "<0.1")
        .from("[data-hotspot]", { scale: 0, stagger: 0.12, duration: 0.7, ease: "elastic.out(1,.5)", clearProps: "scale,transform" }, "-=0.4");

      gsap.fromTo(
        "[data-scroll-line]",
        { scaleY: 0, transformOrigin: "top" },
        { scaleY: 1, duration: 1.1, repeat: -1, yoyo: true, ease: "power1.inOut" }
      );

      /* ---------- Scroll animation ---------- */
      const st = { trigger: root, start: "top top", end: "bottom top", scrub: true };
      gsap.to("[data-chair-b]", { yPercent: -6, rotation: 4, scale: 1.05, ease: "none", scrollTrigger: st });
      gsap.to(logoWrapRef.current, { scale: 1.06, transformOrigin: "50% 100%", ease: "none", scrollTrigger: st });
      gsap.to(["[data-ui-wrap]", "[data-pager]"], {
        opacity: 0,
        y: -30,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "35% top", scrub: true },
      });
    });

    return () => mm.revert();
  }, []);

  /* ---------- Chair slide kore, color change hoy ---------- */
  const step = useCallback(
    (dir: 1 | -1) => {
      if (busyRef.current || !enterRef.current) return;
      busyRef.current = true;
      const next = (index + dir + total) % total;

      gsap
        .timeline({ onComplete: () => (busyRef.current = false) })
        .to(enterRef.current, { x: -90 * dir, opacity: 0, duration: 0.35, ease: "power2.in" })
        .add(() => setIndex(next))
        .fromTo(enterRef.current, { x: 90 * dir }, { x: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, "+=0.05");
    },
    [index, total]
  );

  /* ---------- Autoplay: kichhukkhon por por chair er color change hoy ---------- */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => {
      if (!document.hidden) step(1);
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [index, step]);

  return (
    <section ref={rootRef} className="relative container mx-auto h-[900px] overflow-hidden">
      {/* ===== Left: about Rowe + button ===== */}
      <div data-ui-wrap className="pointer-events-none absolute inset-0 z-20">
        <div
          data-reveal
          className="pointer-events-auto absolute left-4 top-[22%] hidden max-w-[460px] font-sans md:block"
        >
          <p className="text-xl font-medium leading-snug text-[#222628]">
            Rowe makes considered furniture for modern homes. Sculpted forms, natural materials and quiet
            craftsmanship, designed to be lived in for years.
          </p>
          <Link
            href="/about"
            className="mt-7 flex w-fit items-center gap-2 rounded-none bg-[#222628] px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:gap-4 hover:bg-[#372310]"
          >
            Collection <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      {/* ===== Logo + chair ===== */}
      <div className="absolute inset-x-0 -bottom-10">
        {/* Pagination: logo er thik opore */}
        <div data-pager className="absolute bottom-full right-4 z-20 mb-8">
          <p data-pager-in className="text-sm tabular-nums text-[#222628]">
            <span className="text-2xl font-medium">{pad(index + 1)}</span>
            <span className="text-[#222628]/50"> / {pad(total)}</span>
          </p>
        </div>

        <div ref={logoWrapRef}>
          <div className="overflow-hidden">
            <div ref={logoRef}>
              <Image
                src="/roweLogo.svg"
                alt="Rowe"
                width={1197}
                height={277}
                priority
                sizes="(min-width: 1440px) 1440px, 100vw"
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>

        {/* Banner wrapper: Tailwind positioning only, GSAP inner layers e kaj kore */}
        <div className="absolute bottom-[18%] left-1/2 z-10 h-[560px] w-[min(90%,1000px)] -translate-x-1/2 md:h-[800px]">
          {/* soft ground shadow */}
          <div className="absolute bottom-[1%] left-1/2 h-8 w-[55%] -translate-x-1/2">
            <div data-shadow className="h-full w-full rounded-full bg-black/30 blur-xl" />
          </div>

          <div ref={enterRef} data-chair-a className="absolute inset-0">
            <div data-chair-b className="absolute inset-0">
              <div className="absolute inset-0">
                <Link href={`/shop/${PRODUCT.slug}`} aria-label={PRODUCT.name} className="absolute inset-0">
                  <Image
                    src={variant.src}
                    alt={`${PRODUCT.name} in ${variant.name}`}
                    fill
                    priority
                    sizes="(min-width: 1024px) 1000px, 90vw"
                    style={{ filter: variant.filter ?? "none" }}
                    className="object-contain"
                  />
                </Link>

                {/* Hotspots */}
                {hotspots.map((h) => (
                  <button
                    key={h.label}
                    type="button"
                    data-hotspot
                    style={{ left: h.x, top: h.y }}
                    className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
                    aria-label={`${h.label}: ${h.value}`}
                  >
                    <span className="absolute inset-0 animate-ping rounded-full bg-white/70" />
                    <span className="relative block h-4 w-4 rounded-full border-2 border-[#222628] bg-white" />
                    <span className="pointer-events-none absolute left-7 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-white px-3 py-2 text-left text-[14px] text-[#222628] opacity-0 transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                      <span className="block text-[15px] uppercase font-medium tracking-widest text-[#222628]">{h.label}</span>
                      {h.value}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-white mix-blend-difference">
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <span data-scroll-line className="block h-8 w-px bg-white" />
      </div>
    </section>
  );
}