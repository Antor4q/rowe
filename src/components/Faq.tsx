"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cormorant_Garamond } from "next/font/google";

gsap.registerPlugin(ScrollTrigger);

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

type Faq = {
  topic: string;
  q: string;
  a: string;
};

const FAQS: Faq[] = [
  {
    topic: "Delivery",
    q: "How long does delivery take?",
    a: "In-stock pieces arrive within 7 to 14 days. Made-to-order pieces are built after you order, so allow a little longer. You will get a tracking link as soon as your piece leaves our workshop.",
  },
  {
    topic: "Delivery",
    q: "What does white-glove delivery include?",
    a: "Our team brings your furniture into the room of your choice, assembles it, and takes the packaging away with them. There is nothing for you to lift or unbox.",
  },
  {
    topic: "Materials & care",
    q: "What are the frames made from?",
    a: "Every frame is built from solid ash, never particle board. It is sourced responsibly and finished by hand, which is why a Rowe piece is made to last for years.",
  },
  {
    topic: "Materials & care",
    q: "How do I clean the fabric?",
    a: "Vacuum gently once a week and blot spills straight away with a clean, dry cloth. For deeper marks, use a mild upholstery cleaner and test a hidden spot first.",
  },
  {
    topic: "Returns & guarantee",
    q: "What is your return policy?",
    a: "Not the right fit? Send it back within 30 days, no questions asked. We will collect it and refund you once it arrives back with us.",
  },
  {
    topic: "Returns & guarantee",
    q: "What does the 10-year guarantee cover?",
    a: "It covers the solid ash frame against structural faults for a full decade. If something fails under normal use, we will repair or replace it.",
  },
  {
    topic: "Made to order",
    q: "Can I choose a different fabric or size?",
    a: "Yes. Most pieces can be made in a choice of natural fabrics, and many in custom dimensions. Get in touch and we will talk you through the options.",
  },
  {
    topic: "Made to order",
    q: "How long do made-to-order pieces take?",
    a: "Usually 6 to 10 weeks, depending on the piece and the fabric. We will confirm the exact lead time before you pay.",
  },
];

export default function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [open, setOpen] = useState<number | null>(0);
  const openRef = useRef<number | null>(0);

  // Initial state + scroll reveal
  useLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    // first panel open, rest closed
    panelRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, { height: i === 0 ? "auto" : 0 });
    });

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

      gsap.from("[data-row]", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "opacity,transform,visibility",
        scrollTrigger: { trigger: "[data-list]", start: "top 80%" },
      });
    });

    return () => mm.revert();
  }, []);

  const toggle = (i: number) => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const duration = reduce ? 0 : 0.6;
    const prev = openRef.current;
    const next = prev === i ? null : i;

    // close previous
    if (prev !== null) {
      const el = panelRefs.current[prev];
      if (el) {
        gsap.to(el, { height: 0, duration, ease: "power3.inOut" });
      }
    }

    // open new
    if (next !== null) {
      const el = panelRefs.current[next];
      if (el) {
        gsap.to(el, { height: "auto", duration, ease: "power3.inOut" });
      }
    }

    openRef.current = next;
    setOpen(next);
  };

  return (
    <section
      ref={sectionRef}
      className="bg-white py-24 text-[#222628]"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          {/* Left (sticky) */}
          <div className="md:col-span-4">
            <div className="md:sticky md:top-24">
              <h2
                data-head
                className={`${serif.className} text-5xl font-semibold leading-none md:text-7xl lg:text-8xl`}
              >
                Questions,
                <br />
                Answered
              </h2>

              <p
                data-head
                className="mt-6 max-w-sm font-sans text-[18px] font-medium leading-snug"
              >
                Everything you might want to know about delivery, materials
                and care before you bring a Rowe piece home.
              </p>

              <Link
                data-head
                href="/contact"
                className="mt-8 inline-block bg-[#222628] px-6 py-3 font-sans text-sm font-medium text-white transition-opacity duration-300 hover:opacity-80"
              >
                Still unsure? Talk to us &rarr;
              </Link>
            </div>
          </div>

          {/* Right (accordion) */}
          <div data-list className="md:col-span-7 md:col-start-6">
            {FAQS.map((f, i) => {
              const isOpen = open === i;

              return (
                <div
                  key={f.q}
                  data-row
                  className={`border-t border-[#222628]/15 ${
                    i === FAQS.length - 1 ? "border-b" : ""
                  }`}
                >
                  <h3>
                    <button
                      type="button"
                      onClick={() => toggle(i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      id={`faq-btn-${i}`}
                      className="group flex w-full items-start gap-5 py-6 text-left md:gap-8 md:py-8"
                    >
                     

                      <span className="flex-1">
                        <span className="block font-sans text-xs font-medium text-[#222628]/50">
                          {f.topic}
                        </span>
                        <span
                          className={`font-sans mt-1 block text-2xl font-semibold leading-tight md:text-3xl`}
                        >
                          {f.q}
                        </span>
                      </span>

                      {/* Plus / close icon */}
                      <span
                        aria-hidden="true"
                        className={`relative mt-3 block h-4 w-4 shrink-0 transition-transform duration-500 ease-out ${
                          isOpen ? "rotate-45" : "rotate-0"
                        }`}
                      >
                        <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[#222628]" />
                        <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#222628]" />
                      </span>
                    </button>
                  </h3>

                  <div
                    ref={(el) => {
                      panelRefs.current[i] = el;
                    }}
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-btn-${i}`}
                    className="overflow-hidden"
                  >
                    <p className="max-w-xl pb-8 pl-[3.25rem] font-sans text-base leading-relaxed text-[#222628]/70 md:pl-[4.5rem]">
                      {f.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}