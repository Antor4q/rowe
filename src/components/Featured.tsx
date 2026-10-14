"use client";

import { useLayoutEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cormorant_Garamond } from "next/font/google";

gsap.registerPlugin(ScrollTrigger);

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

type Product = {
  slug: string;
  name: string;
  price: number;
  src: string;
  hoverSrc: string;
};

const PRODUCTS: Product[] = [
  {
    slug: "orla-sofa",
    name: "Orla Sofa",
    price: 2400,
    src: "/images/pro6.jpg",
    hoverSrc: "/images/proV5.jpg",
  },
  {
    slug: "noir-sectional",
    name: "Noir Sectional",
    price: 3200,
    src: "/images/pro2U.png",
    hoverSrc: "/images/proV2.jpg",
  },
  {
    slug: "sela-lounge-chair",
    name: "Sela Lounge Chair",
    price: 890,
    src: "/images/pro7.jpg",
    hoverSrc: "/images/proV3.jpg",
  },
  {
    slug: "mira-loveseat",
    name: "Mira Loveseat",
    price: 1450,
    src: "/images/pro4U.jpg",
    hoverSrc: "/images/pro4V.jpg",
  },
  {
    slug: "kaya-armchair",
    name: "Kaya Armchair",
    price: 790,
    src: "/images/proL.jpg",
    hoverSrc: "/images/proLl.jpg",
  },
];

const formatPrice = (n: number) => `$${n.toLocaleString("en-US")}`;

// sizes = actual rendered width, jate Next/Image choto device e choto file pathay
const SLOTS = [
  {
    l: "0%",
    t: "0%",
    w: "45.9%",
    ratio: "aspect-[10/7]",
    mobile: "col-span-2",
    amp: 30,
    sizes: "(min-width: 768px) 46vw, 100vw",
  },
  {
    l: "68.2%",
    t: "8.3%",
    w: "31.8%",
    ratio: "aspect-[31/30]",
    mobile: "",
    amp: 50,
    sizes: "(min-width: 768px) 32vw, 50vw",
  },
  {
    l: "0%",
    t: "43.4%",
    w: "26.3%",
    ratio: "aspect-[9/10]",
    mobile: "mt-10",
    amp: 40,
    sizes: "(min-width: 768px) 27vw, 50vw",
  },
  {
    l: "36.2%",
    t: "60.8%",
    w: "27.4%",
    ratio: "aspect-[7/5]",
    mobile: "col-span-2",
    amp: 25,
    sizes: "(min-width: 768px) 28vw, 100vw",
  },
  {
    l: "72.1%",
    t: "55%",
    w: "27.9%",
    ratio: "aspect-[5/6]",
    mobile: "col-start-2",
    amp: 45,
    sizes: "(min-width: 768px) 28vw, 50vw",
  },
];

export default function FeaturedProducts() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = sectionRef.current;

    if (!root) return;

    const mm = gsap.matchMedia(root);

    // Scroll reveal (shob device)
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from("[data-head]", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "opacity,transform,visibility",
        scrollTrigger: {
          trigger: root,
          start: "top 80%",
        },
      });

      gsap.from("[data-card]", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        clearProps: "opacity,transform,visibility",
        scrollTrigger: {
          trigger: gridRef.current,
          // mobile e grid lomba, tai ektu aage trigger
          start: "top 85%",
        },
      });
    });

    // Parallax: tablet e amplitude kom (card overlap na hoye), desktop e full
    mm.add(
      {
        isTablet:
          "(min-width: 768px) and (max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        isDesktop:
          "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      },
      (ctx) => {
        const k = ctx.conditions?.isDesktop ? 1 : 0.5;

        gsap.utils.toArray<HTMLElement>("[data-par]", root).forEach((el) => {
          const amp = Number(el.dataset.amp ?? 30) * k;

          gsap.fromTo(
            el,
            { y: amp },
            {
              y: -amp,
              ease: "none",
              scrollTrigger: {
                trigger: gridRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        });
      }
    );

    return () => mm.revert();
  }, []);

  const onAdd = (p: Product) => {
    // TODO: Add-to-cart logic
    console.log("add to cart:", p.slug);
  };

  return (
    <section
      ref={sectionRef}
      className="overflow-x-clip bg-white py-16 text-[#222628] sm:py-20 md:py-24 lg:py-28"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header: mobile e stack, md+ e side by side */}
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between md:gap-8">
          <h2
            data-head
            className={`${serif.className} text-[2.75rem] font-semibold leading-[0.95] sm:text-6xl md:text-7xl lg:text-8xl xl:text-[110px]`}
          >
            Designed To
            <br />
            Impress
          </h2>

          <p
            data-head
            className="max-w-md font-sans text-base font-medium leading-snug sm:text-[17px] md:w-[31.8%] md:max-w-none md:shrink-0 lg:text-[18px]"
          >
            Upholstered furniture designed and made to be lived in, from
            solid ash and natural fabrics.
          </p>
        </div>

        {/* Product grid */}
        {/* aspect ratio 434/452 -> 434/369, SLOTS er top % gulo rescale kora (x1.225) jate layout same thake */}
        <div
          ref={gridRef}
          className="relative mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:mt-12 sm:gap-x-6 sm:gap-y-10 md:mt-16 md:block md:aspect-[434/369]"
        >
          {PRODUCTS.map((p, i) => {
            const s = SLOTS[i];

            return (
              <article
                key={p.slug}
                data-card
                className={`group ${s.mobile} md:absolute md:left-[var(--l)] md:top-[var(--t)] md:w-[var(--w)]`}
                style={
                  {
                    "--l": s.l,
                    "--t": s.t,
                    "--w": s.w,
                  } as CSSProperties
                }
              >
                <div data-par data-amp={s.amp}>
                  <div
                    className={`relative overflow-hidden bg-[#F5F3F1] ${s.ratio}`}
                  >
                    <Link
                      href={`/shop/${p.slug}`}
                      aria-label={p.name}
                      className="absolute inset-0 block focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#222628]"
                    >
                      {/* hover effect shudhu hover-capable device e (touch e sticky hover hobe na) */}
                      <Image
                        src={p.src}
                        alt={p.name}
                        fill
                        sizes={s.sizes}
                        className="object-cover transition-opacity duration-500 [@media(hover:hover)]:group-hover:opacity-0"
                      />

                      <Image
                        src={p.hoverSrc}
                        alt=""
                        fill
                        sizes={s.sizes}
                        className="object-cover opacity-0 transition-opacity duration-500 [@media(hover:hover)]:group-hover:opacity-100"
                      />
                    </Link>

                    {/* Add to cart: touch e shobsomoy visible, desktop e hover/focus e slide up */}
                    <button
                      type="button"
                      onClick={() => onAdd(p)}
                      className="absolute inset-x-0 bottom-0 z-10 bg-[#222628] py-2 font-sans text-xs font-medium text-white transition-transform duration-500 ease-out focus-visible:translate-y-0 sm:py-2.5 sm:text-sm md:py-3 [@media(hover:hover)]:translate-y-full [@media(hover:hover)]:group-focus-within:translate-y-0 [@media(hover:hover)]:group-hover:translate-y-0"
                    >
                      Add to cart
                    </button>
                  </div>

                  {/* Product details: choto card e wrap korbe */}
                  <div className="mt-3 flex flex-wrap items-start justify-between gap-x-4 gap-y-0.5 font-sans">
                    <h3 className="text-sm font-medium leading-snug md:text-sm lg:text-base xl:text-lg">
                      {p.name}
                    </h3>

                    <span className="shrink-0 text-sm font-medium md:text-sm lg:text-base xl:text-lg">
                      {formatPrice(p.price)}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}