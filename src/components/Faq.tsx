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
    // (SSR e-o h-0 class ache, tai hydrate howar age flash hoy na)
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
        scrollTrigger: { trigger: root, start: "top 80%" },
      });

      // Prottek row nijer position e reveal hoy
      // (mobile e list lomba, shob row ek shathe reveal hole dekha jay na)
      gsap.utils.toArray<HTMLElement>("[data-row]", root).forEach((row) => {
        gsap.from(row, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          clearProps: "opacity,transform,visibility",
          scrollTrigger: { trigger: row, start: "top 90%" },
        });
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

    // Animation shesh hole: page height badleche, tai trigger position refresh kori.
    // Upor er item khola thakle ar niche er item tap korle tapped button
    // screen er upore chole jete pare, tai tokhon scroll kore dekhai.
    const done = () => {
      ScrollTrigger.refresh();

      if (next !== null && prev !== null && prev < next) {
        const btn = document.getElementById(`faq-btn-${next}`);

        if (btn && btn.getBoundingClientRect().top < 0) {
          btn.scrollIntoView({
            behavior: reduce ? "auto" : "smooth",
            block: "nearest",
          });
        }
      }
    };

    // close previous
    if (prev !== null) {
      const el = panelRefs.current[prev];
      if (el) {
        gsap.to(el, {
          height: 0,
          duration,
          ease: "power3.inOut",
          onComplete: next === null ? done : undefined,
        });
      }
    }

    // open new
    if (next !== null) {
      const el = panelRefs.current[next];
      if (el) {
        gsap.to(el, {
          height: "auto",
          duration,
          ease: "power3.inOut",
          onComplete: done,
        });
      }
    }

    openRef.current = next;
    setOpen(next);
  };

  return (
    <section
      ref={sectionRef}
      className="bg-white py-16 text-[#222628] sm:py-20 md:py-24 lg:py-28"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* lg theke 2 column. Tablet/mobile e stack (768px e col-4 onek narrow hoy) */}
        <div className="grid grid-cols-1 gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left (sticky shudhu boro + lomba screen e) */}
          <div className="lg:col-span-4">
            <div className="[@media(min-width:1024px)_and_(min-height:560px)]:sticky [@media(min-width:1024px)_and_(min-height:560px)]:top-24">
              <h2
                data-head
                className={`${serif.className} text-[2.75rem] font-semibold leading-none sm:text-6xl md:text-7xl lg:text-6xl xl:text-7xl 2xl:text-8xl`}
              >
                Questions,
                <br />
                Answered
              </h2>

              <p
                data-head
                className="mt-5 max-w-sm font-sans text-base font-medium leading-snug sm:mt-6 sm:text-[17px] md:max-w-md lg:max-w-sm lg:text-[18px]"
              >
                Everything you might want to know about delivery, materials
                and care before you bring a Rowe piece home.
              </p>

              <Link
            href="/about"
            className="mt-4 flex w-fit items-center gap-2 rounded-none bg-[#222628] px-5 py-3 text-[13px] font-medium text-white transition-all duration-300 hover:gap-4 hover:bg-[#372310] sm:mt-5 sm:text-sm md:mt-7 md:px-7 md:py-3.5"
          >
            Still unsure? Talk to us <span aria-hidden>→</span>
          </Link>
            </div>
          </div>

          {/* Right (accordion) */}
          <div data-list className="lg:col-span-7 lg:col-start-6">
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
                      className="group flex w-full scroll-mt-20 items-start gap-4 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#222628] sm:gap-6 sm:py-6 md:py-8"
                    >
                      <span className="flex-1">
                        <span className="block font-sans text-xs font-medium text-[#222628]/50">
                          {f.topic}
                        </span>
                        <span className="mt-1 block font-sans text-xl font-semibold leading-tight sm:text-2xl md:text-3xl">
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
                    className={`overflow-hidden ${i === 0 ? "" : "h-0"}`}
                  >
                    {/* ager number column nei, tai left indent soriye dilam; right e icon er jonno jayga */}
                    <p className="max-w-xl pb-6 pr-8 font-sans text-base leading-relaxed text-[#222628]/70 sm:pb-8 sm:pr-12">
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