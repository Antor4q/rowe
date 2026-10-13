
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
  { slug: "noor-bench", name: "Noor Bench", src: "/images/coll1.jpg" },
  { slug: "tano-armchair", name: "Tano Armchair", src: "/images/coll2.jpg" },
  { slug: "vale-bed-frame", name: "Vale Bed Frame", src: "/images/coll3.jpg" },
  { slug: "ora-desk", name: "Ora Desk", src: "/images/coll4.jpg" },
  { slug: "luma-side-table", name: "Luma Side Table", src: "/images/coll5.jpg" },
  { slug: "sori-lounge-sofa", name: "Sori Lounge Sofa", src: "/images/coll1.jpg" },
];

const COPIES = 4;
const SPEED = 90;

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
          start: "top 80%",
        },
      });
    });

    /* ---------- Infinite loop ---------- */

    const items = Array.from(
      track.querySelectorAll<HTMLElement>("[data-slide]"),
    );

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
        const target = hovering ? -SPEED : 0;

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

    /* ---------- Hover: product cards only ---------- */

    const onEnter = () => {
      if (!dragging) hovering = true;
    };

    const onLeave = () => {
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

    /* ---------- Resize ---------- */

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
      className="overflow-hidden bg-[#f3f1ec] py-10 text-[#222628] sm:py-12 md:py-24"
    >
       {/* Header */}
        <div className="flex items-start justify-between gap-8 container mx-auto mb-14">
          <h2
            data-head
            className={`${serif.className} text-5xl font-semibold leading-none md:text-7xl lg:text-8xl xl:text-[110px]`}
          >
           New Arrivals
          </h2>

          <p
            data-head
            className="hidden font-sans text-[18px] font-medium leading-snug md:block md:w-[31.8%]"
          >
            Upholstered furniture designed and made to be lived in, from
            solid ash and natural fabrics.
          </p>
        </div>

      {/* Slider: no full-height wrapper or excess vertical spacing */}
      <div className="relative mt-6 sm:mt-8">
        <div
          ref={trackRef}
          className="relative flex h-[220px] w-max shrink-0 select-none items-center gap-4 will-change-transform sm:h-[260px] sm:gap-6 md:h-[300px] md:gap-10 lg:gap-14"
        >
          {LOOP_ITEMS.map((p) => (
            <article
              key={`${p.slug}-${p.copy}`}
              data-slide
              aria-hidden={p.copy > 0}
              className="h-full w-[280px] shrink-0 transition-transform duration-500 ease-out hover:z-10 hover:scale-[1.06] sm:w-[340px] md:w-[420px] md:hover:scale-[1.1]"
            >
              <Link
                href={`/shop/${p.slug}`}
                aria-label={p.name}
                tabIndex={p.copy > 0 ? -1 : undefined}
                draggable={false}
                onClick={(event) => {
                  if (draggedRef.current) event.preventDefault();
                }}
                className="relative block h-full w-full cursor-grab overflow-hidden bg-[#e6e2d9] active:cursor-grabbing"
              >
                <Image
                  src={p.src}
                  alt={p.copy === 0 ? p.name : ""}
                  fill
                  draggable={false}
                  sizes="(min-width: 768px) 420px, (min-width: 640px) 340px, 280px"
                  className="object-cover"
                />

                <span className="absolute left-3 top-3 bg-white px-3 py-1 font-sans text-[11px] font-medium uppercase tracking-wide">
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
