"use client";

import { useLayoutEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cormorant_Garamond } from "next/font/google";

gsap.registerPlugin(ScrollTrigger);

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
});

const SESSION_KEY = "rowe-loaded";
const EVENT = "loader:done";

/**
 * Hero (ba onno section) er entrance animation loader shesh howar por
 * shuru korte chaile eta use koro:
 *
 *   useLayoutEffect(() => onLoaderDone(() => { ...gsap animation... }), []);
 */
export function onLoaderDone(cb: () => void) {
  if (document.documentElement.dataset.loaded === "true") {
    cb();
    return () => {};
  }
  window.addEventListener(EVENT, cb, { once: true });
  return () => window.removeEventListener(EVENT, cb);
}

const maskStyle = (color: string): CSSProperties => ({
  backgroundColor: color,
  WebkitMaskImage: "url(/roweLogo.svg)",
  maskImage: "url(/roweLogo.svg)",
  WebkitMaskSize: "100% 100%",
  maskSize: "100% 100%",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
});

export default function Loader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const html = document.documentElement;

    // State na, direct DOM hide (effect e setState korle React warning dey)
    const hide = () => {
      if (rootRef.current) rootRef.current.style.display = "none";
    };

    const finish = () => {
      html.style.overflow = "";
      html.dataset.loaded = "true";
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {}
      hide();
      ScrollTrigger.refresh();
      window.dispatchEvent(new Event(EVENT));
    };

    // Ei session e already dekha hoyeche: loader skip
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {}

    if (seen) {
      html.dataset.loaded = "true";
      hide();
      return;
    }

    html.style.overflow = "hidden"; // scroll lock

    const root = rootRef.current;
    const fill = fillRef.current;
    const num = numRef.current;
    if (!root || !fill || !num) {
      finish();
      return;
    }

    let cancelled = false;
    const counter = { v: 0 };

    const render = () => {
      num.textContent = String(Math.round(counter.v));
      gsap.set(fill, { clipPath: `inset(${100 - counter.v}% 0% 0% 0%)` });
    };

    // Real load er sathe tie: fonts + window load
    const ready = Promise.all([
      document.fonts.ready,
      new Promise<void>((res) => {
        if (document.readyState === "complete") res();
        else window.addEventListener("load", () => res(), { once: true });
      }),
    ]);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // Reduced motion: shudhu simple fade
      if (reduce) {
        ready.then(() => {
          if (cancelled) return;
          ctx.add(() => {
            gsap.to(root, {
              opacity: 0,
              duration: 0.4,
              onComplete: finish,
            });
          });
        });
        return;
      }

      const exit = () => {
        gsap
          .timeline({ onComplete: finish })
          .to(num, { opacity: 0, duration: 0.3, ease: "power2.in" })
          .to(
            logoRef.current,
            { y: -30, opacity: 0, duration: 0.5, ease: "power2.in" },
            "<"
          )
          .to(root, { yPercent: -100, duration: 1, ease: "power4.inOut" }, "-=0.1");
      };

      // 0 -> 85 (minimum time), tarpor real load er jonno wait, tarpor 100
      gsap.to(counter, {
        v: 85,
        duration: 1.3,
        ease: "power2.out",
        onUpdate: render,
        onComplete: () => {
          ready.then(() => {
            if (cancelled) return;
            ctx.add(() => {
              gsap.to(counter, {
                v: 100,
                duration: 0.5,
                ease: "power1.out",
                onUpdate: render,
                onComplete: exit,
              });
            });
          });
        },
      });
    }, root);

    return () => {
      cancelled = true;
      ctx.revert();
      html.style.overflow = "";
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#f0eee8]"
    >
      {/* Logo: halka base + dark fill niche theke uthe */}
      <div ref={logoRef} className="relative w-[min(78vw,880px)]">
        <div style={maskStyle("rgba(34,38,40,0.12)")}>
          {/* Invisible img shudhu logo er real aspect ratio er jonno */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/roweLogo.svg"
            alt=""
            className="invisible block h-auto w-full"
          />
        </div>

        <div
          ref={fillRef}
          className="absolute inset-0"
          style={{
            ...maskStyle("#222628"),
            clipPath: "inset(100% 0% 0% 0%)",
          }}
        />
      </div>

      {/* Counter */}
      <span
        ref={numRef}
        className={`${serif.className} absolute bottom-6 right-4 text-6xl font-medium leading-none text-[#222628] [font-variant-numeric:lining-nums] md:bottom-10 md:right-10 md:text-8xl`}
      >
        0
      </span>
    </div>
  );
}