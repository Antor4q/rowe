"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cormorant_Garamond } from "next/font/google";

gsap.registerPlugin(ScrollTrigger);

// Shudhu title er jonno serif. Category lines e serif chaile `serif.className` ta oikhane o dao.
const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600", "700"] });

// placeholder image path, nijer image dao
// pos = object-position (x y). Furniture upor/nich kete gele ei value tune koro.
const CATEGORIES = [
  { name: "Living Room", count: 20, description: "Sofas, lounge chairs and side tables made to be lived in.", href: "/shop?room=living", src: "/images/coll1.jpg", pos: "50% 60%" },
  { name: "Outdoor", count: 12, description: "Weather-resistant seating and tables for terraces, balconies and gardens.", href: "/shop?room=outdoor", src: "/images/coll2.jpg", pos: "50% 60%" },
  { name: "Dining Room", count: 12, description: "Tables and chairs built for long meals and slow evenings.", href: "/shop?room=dining", src: "/images/coll3.jpg", pos: "50% 60%" },
  { name: "Bedroom", count: 11, description: "Beds, benches and bedside pieces in soft, natural materials.", href: "/shop?room=bedroom", src: "/images/coll4.jpg", pos: "50% 60%" },
  { name: "Office", count: 8, description: "Quiet, considered pieces for focused work at home.", href: "/shop?room=office", src: "/images/coll5.jpg", pos: "50% 60%" },
];

export default function CollectionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const textRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const descRefs = useRef<(HTMLDivElement | null)[]>([]);
  const placedRef = useRef(false);

  /* ---------- Scroll reveal ---------- */
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

      gsap
        .timeline({ scrollTrigger: { trigger: listRef.current, start: "top 80%" } })
        .from("[data-line]", { yPercent: 110, duration: 1.1, stagger: 0.1, ease: "power4.out", clearProps: "transform" })
        .from("[data-count]", { opacity: 0, duration: 0.8, stagger: 0.1, clearProps: "opacity" }, "<0.3");
    });

    return () => mm.revert();
  }, []);

  /* ---------- Hover: item + description + image pura group ta center e thake ---------- */
  const onEnter = (i: number) => {
    if (!window.matchMedia("(min-width: 768px)").matches) return;
    const list = listRef.current;
    const row = rowRefs.current[i];
    const text = textRefs.current[i];
    const pv = previewRef.current;
    if (!list || !row || !text || !pv) return;

    const GAP = 32;
    const lr = list.getBoundingClientRect();
    const rr = row.getBoundingClientRect();
    const tw = text.offsetWidth; // transform er upor depend kore na, tai fast hover e o thik thake
    const cw = pv.offsetWidth;

    // text normally center e thake
    const baseLeft = (lr.width - tw) / 2;
    const baseRight = baseLeft + tw;

    // pura group (text + gap + preview) center e ante text ke bame shorano lagbe (gap + preview) / 2
    const idealShift = (GAP + cw) / 2;
    // boro text hole screen er baire na jay, ar count ta jeno kete na jay
    const shift = Math.min(idealShift, Math.max(0, baseLeft - 56));

    const x = baseRight - shift + GAP;
    // pv.offsetHeight automatic image er height follow kore, tai ratio change korleo y thik thake
    const y = rr.top - lr.top + rr.height / 2 - pv.offsetHeight / 2;

    if (!placedRef.current) {
      gsap.set(pv, { x, y });
      placedRef.current = true;
    } else {
      gsap.to(pv, { x, y, duration: 0.6, ease: "power3.out", overwrite: true });
    }
    gsap.to(pv, { opacity: 1, duration: 0.3 });
    textRefs.current.forEach((el, k) => gsap.to(el, { x: k === i ? -shift : 0, duration: 0.6, ease: "power3.out", overwrite: true }));
    imgRefs.current.forEach((el, k) => gsap.to(el, { opacity: k === i ? 1 : 0, duration: 0.4, overwrite: true }));
    descRefs.current.forEach((el, k) => gsap.to(el, { opacity: k === i ? 1 : 0, duration: 0.4, overwrite: true }));
    rowRefs.current.forEach((el, k) => gsap.to(el, { opacity: k === i ? 1 : 0.25, duration: 0.3, overwrite: true }));
  };

  const onLeave = () => {
    gsap.to(previewRef.current, { opacity: 0, duration: 0.3 });
    gsap.to(textRefs.current, { x: 0, duration: 0.6, ease: "power3.out", overwrite: true });
    gsap.to(rowRefs.current, { opacity: 1, duration: 0.3, overwrite: true });
    placedRef.current = false;
  };

  return (
    <section ref={sectionRef} className="bg-[#f3f1ec] py-20 text-[#222628] md:py-28">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-8">
          <h2 data-head className={`${serif.className} text-5xl font-semibold leading-none md:text-7xl lg:text-8xl xl:text-[110px]`}>
            Our Collection
          </h2>
          <p data-head className="hidden max-w-[320px] font-sans text-[18px] font-medium leading-snug md:block">
            Considered furniture for modern homes, made slowly from solid ash and natural fabrics.
          </p>
        </div>

        {/* Category lines */}
        <div ref={listRef} className="relative mt-12 md:mt-16" onMouseLeave={onLeave}>
          {CATEGORIES.map((c, i) => (
            <Link
              key={c.name}
              href={c.href}
              ref={(el) => {
                rowRefs.current[i] = el;
              }}
              onMouseEnter={() => onEnter(i)}
              className="flex justify-center py-[0.8vw]"
            >
              {/* Text ekdom center e thake. Count ar mobile thumbnail text er pashe jhule thake, tai centering nosto kore na */}
              <span
                ref={(el) => {
                  textRefs.current[i] = el;
                }}
                className="relative inline-block text-center"
              >
                <span
                  data-count
                  className="absolute right-full top-1 mr-3 font-sans text-xs text-[#222628]/35 md:top-[0.8vw] md:text-base"
                >
                  ({c.count})
                </span>

                <span className="block overflow-hidden">
                  <span
                    data-line
                    className="block font-sans text-[clamp(2rem,7vw,7rem)] font-medium uppercase leading-[1.02] tracking-tight"
                  >
                    {c.name}
                  </span>
                </span>

                {/* Mobile thumbnail (hover nai) */}
                <span className="absolute left-full top-1/2 ml-3 h-10 w-12 -translate-y-1/2 overflow-hidden bg-[#e6e2d9] md:hidden">
                  <Image
                    src={c.src}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover"
                    style={{ objectPosition: c.pos }}
                  />
                </span>
              </span>
            </Link>
          ))}

          {/* Desktop hover: [description] [image], item er thik dane */}
          <div
            ref={previewRef}
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 z-10 hidden w-max items-stretch gap-5 opacity-0 md:flex"
          >
            {/* Description column: height image er shathe stretch kore, nijer kono fixed height nai */}
            <div className="relative w-[clamp(140px,14vw,300px)]">
              {CATEGORIES.map((c, i) => (
                <div
                  key={c.name}
                  ref={(el) => {
                    descRefs.current[i] = el;
                  }}
                  className="absolute inset-0 flex flex-col justify-center font-sans opacity-0"
                >
                  <p className="text-[15px] font-medium leading-snug text-[#222628]/70">{c.description}</p>
                </div>
              ))}
            </div>

            {/* Image: width ager moto (16vw / 240px), height ratio diye barano */}
            <div className="relative aspect-square w-[min(16vw,280px)] overflow-hidden bg-[#e6e2d9]">
              {CATEGORIES.map((c, i) => (
                <div
                  key={c.name}
                  ref={(el) => {
                    imgRefs.current[i] = el;
                  }}
                  className="absolute inset-0 opacity-0"
                >
                  <Image
                    src={c.src}
                    alt=""
                    fill
                    sizes="240px"
                    className="object-cover"
                    style={{ objectPosition: c.pos }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}