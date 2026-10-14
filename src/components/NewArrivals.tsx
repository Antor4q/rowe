"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import { Cormorant_Garamond } from "next/font/google";

gsap.registerPlugin(ScrollTrigger, Draggable);

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const NEW_ITEMS = [
  { slug: "noor-bench", name: "Noor Bench", src: "/images/ne1.jpg" },
  { slug: "tano-armchair", name: "Tano Armchair", src: "/images/ne2.jpg" },
  { slug: "vale-bed-frame", name: "Vale Bed Frame", src: "/images/ne3.jpg" },
  { slug: "ora-desk", name: "Ora Desk", src: "/images/ne4.jpg" },
  { slug: "luma-side-table", name: "Luma Side Table", src: "/images/ne5.jpg" },
  { slug: "sori-lounge-sofa", name: "Sori Lounge Sofa", src: "/images/ne6.jpg" },
];

const COPIES = 4;
const SPEED = 90; // desktop hover speed (px/s)
const DRIFT = 35; // touch device e slow auto drift (px/s)

const LOOP_ITEMS = Array.from({ length: COPIES }).flatMap((_, copy) =>
  NEW_ITEMS.map((p) => ({ ...p, copy })),
);

export default function NewArrivals() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const draggedRef = useRef(false);

  useLayoutEffect(() => {
    const root = sectionRef.current;
    const track = trackRef.current;

    if (!root || !track) return;

    const mm = gsap.matchMedia(root);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from("[data-head]", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "opacity,transform,visibility",
        scrollTrigger: {
          trigger: root,
          start: "top 85%",
        },
      });

      gsap.from("[data-slide]", {
        y: 35,
        opacity: 0,
        duration: 0.8,
        stagger: 0.035,
        ease: "power3.out",
        clearProps: "opacity,transform,visibility",
        scrollTrigger: {
          trigger: root,
          start: "top 85%",
        },
      });
    });

    /* ---------- Infinite loop ---------- */

    const items = Array.from(
      track.querySelectorAll<HTMLElement>("[data-slide]"),
    );

    // live media queries: device/setting change hole auto update hoy
    const mqHover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    let period = 0;

    const measure = () => {
      const first = items[0];
      const next = items[NEW_ITEMS.length];

      period = first && next ? next.offsetLeft - first.offsetLeft : 0;
    };

    measure();

    let x = 0;
    let v = 0;
    let accum = 0;
    let moved = 0;
    let hovering = false;
    let dragging = false;
    let active = true;

    const setX = gsap.quickSetter(track, "x", "px");

    const wrapX = (value: number) =>
      period ? gsap.utils.wrap(-period, 0, value) : value;

    const tick = (_time: number, deltaTime: number) => {
      if (!active) return;

      const dt = Math.min(deltaTime, 50) / 1000;

      if (dragging) {
        v = v * 0.6 + (dt ? accum / dt : 0) * 0.4;
        accum = 0;
      } else {
        // desktop: hover e scroll | touch: slow drift | reduced motion: shudhu drag
        let target = 0;

        if (!mqReduce.matches) {
          target = mqHover.matches ? (hovering ? -SPEED : 0) : -DRIFT;
        }

        v += (target - v) * (1 - Math.exp(-dt * 3));
        x += v * dt;
      }

      x = wrapX(x);
      setX(x);
    };

    gsap.ticker.add(tick);

    /* ---------- Drag ---------- */

    const proxy = document.createElement("div");

    const [drag] = Draggable.create(proxy, {
      trigger: track,
      type: "x",
      minimumMovement: 4,
      // vertical page scroll touch e jate kaj kore
      allowNativeTouchScrolling: true,

      onPress() {
        dragging = true;
        accum = 0;
        v = 0;
        moved = 0;
      },

      onDrag(this: Draggable) {
        x += this.deltaX;
        accum += this.deltaX;
        moved += Math.abs(this.deltaX);

        if (moved > 4) {
          draggedRef.current = true;
        }
      },

      onRelease() {
        dragging = false;

        window.setTimeout(() => {
          draggedRef.current = false;
        }, 100);
      },
    });

    /* ---------- Hover: mouse only ---------- */

    const onEnter = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!dragging) hovering = true;
    };

    const onLeave = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      hovering = false;
    };

    items.forEach((item) => {
      item.addEventListener("pointerenter", onEnter);
      item.addEventListener("pointerleave", onLeave);
    });

    /* ---------- Pause outside viewport ---------- */

    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
    });

    observer.observe(root);

    /* ---------- Resize / rotate ---------- */

    const onResize = () => {
      const oldPeriod = period;

      measure();

      if (oldPeriod && period) {
        x = (x / oldPeriod) * period;
      }
    };

    window.addEventListener("resize", onResize);

    return () => {
      gsap.ticker.remove(tick);
      drag.kill();
      observer.disconnect();

      items.forEach((item) => {
        item.removeEventListener("pointerenter", onEnter);
        item.removeEventListener("pointerleave", onLeave);
      });

      window.removeEventListener("resize", onResize);
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-[#f3f1ec] py-12 text-[#222628] sm:py-16 md:py-24 lg:py-28"
    >
      {/* Header: mobile e stack, md+ e side by side */}
      <div className="container mx-auto mb-8 flex flex-col gap-5 px-4 sm:mb-10 sm:px-6 md:mb-14 md:flex-row md:items-start md:justify-between md:gap-8 lg:px-8">
        <h2
          data-head
          className={`${serif.className} text-[2.75rem] font-semibold leading-[0.95] sm:text-6xl md:text-7xl lg:text-8xl xl:text-[110px]`}
        >
          New Arrivals
        </h2>

        <p
          data-head
          className="max-w-md font-sans text-base font-medium leading-snug sm:text-[17px] md:w-[31.8%] md:max-w-none md:shrink-0 lg:text-[18px]"
        >
          Upholstered furniture designed and made to be lived in, from
          solid ash and natural fabrics.
        </p>
      </div>

      {/* Slider */}
      <div className="relative">
        <div
          ref={trackRef}
          className="relative flex w-max shrink-0 touch-pan-y select-none items-center gap-4 will-change-transform sm:gap-6 md:gap-10 lg:gap-14"
        >
          {LOOP_ITEMS.map((p) => (
            <article
              key={`${p.slug}-${p.copy}`}
              data-slide
              aria-hidden={p.copy > 0}
              // fixed height er bodole aspect ratio: width onujayi height auto adjust hoy
              className="aspect-[5/4] w-[min(280px,78vw)] shrink-0 transition-transform duration-500 ease-out sm:aspect-[4/3] sm:w-[340px] md:aspect-[7/5] md:w-[420px] [@media(hover:hover)]:hover:z-10 [@media(hover:hover)]:hover:scale-[1.06] md:[@media(hover:hover)]:hover:scale-[1.1]"
            >
              <Link
                href={`/shop/${p.slug}`}
                aria-label={p.name}
                tabIndex={p.copy > 0 ? -1 : undefined}
                draggable={false}
                onClick={(event) => {
                  if (draggedRef.current) event.preventDefault();
                }}
                className="relative block h-full w-full cursor-grab overflow-hidden bg-[#e6e2d9] active:cursor-grabbing focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#222628]"
              >
                <Image
                  src={p.src}
                  alt={p.copy === 0 ? p.name : ""}
                  fill
                  draggable={false}
                  sizes="(min-width: 768px) 420px, (min-width: 640px) 340px, 280px"
                  className="object-cover"
                />

                <span className="absolute left-2 top-2 bg-white px-2.5 py-1 font-sans text-[11px] font-medium uppercase tracking-wide sm:left-3 sm:top-3 sm:px-3">
                  New
                </span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}