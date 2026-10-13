
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
    src: "/images/coll1.jpg",
    hoverSrc: "/images/coll3.jpg",
  },
  {
    slug: "noir-sectional",
    name: "Noir Sectional",
    price: 3200,
    src: "/images/coll2.jpg",
    hoverSrc: "/images/coll4.jpg",
  },
  {
    slug: "sela-lounge-chair",
    name: "Sela Lounge Chair",
    price: 890,
    src: "/images/coll3.jpg",
    hoverSrc: "/images/coll5.jpg",
  },
  {
    slug: "mira-loveseat",
    name: "Mira Loveseat",
    price: 1450,
    src: "/images/coll4.jpg",
    hoverSrc: "/images/coll2.jpg",
  },
  {
    slug: "kaya-armchair",
    name: "Kaya Armchair",
    price: 790,
    src: "/images/coll5.jpg",
    hoverSrc: "/images/coll1.jpg",
  },
];

const formatPrice = (n: number) => `$${n.toLocaleString("en-US")}`;

const SLOTS = [
  {
    l: "0%",
    t: "0%",
    w: "45.9%",
    ratio: "aspect-[10/7]",
    mobile: "col-span-2",
    amp: 30,
  },
  {
    l: "68.2%",
    t: "6.8%",
    w: "31.8%",
    ratio: "aspect-[31/30]",
    mobile: "",
    amp: 50,
  },
  {
    l: "0%",
    t: "35.4%",
    w: "26.3%",
    ratio: "aspect-[9/10]",
    mobile: "mt-10",
    amp: 40,
  },
  {
    l: "36.2%",
    t: "49.6%",
    w: "27.4%",
    ratio: "aspect-[7/5]",
    mobile: "col-span-2",
    amp: 25,
  },
  {
    l: "72.1%",
    t: "44.9%",
    w: "27.9%",
    ratio: "aspect-[5/6]",
    mobile: "col-start-2",
    amp: 45,
  },
];

export default function FeaturedProducts() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = sectionRef.current;

    if (!root) return;

    const mm = gsap.matchMedia(root);

    // Scroll reveal
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
          start: "top 75%",
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
          start: "top 80%",
        },
      });
    });

    // Desktop parallax
    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        gsap.utils.toArray<HTMLElement>("[data-par]", root).forEach((el) => {
          const amp = Number(el.dataset.amp ?? 30);

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
      className="bg-white py-24 text-[#222628]"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-8">
          <h2
            data-head
            className={`${serif.className} text-5xl font-semibold leading-none md:text-7xl lg:text-8xl xl:text-[110px]`}
          >
            Designed To
            <br />
            Impress
          </h2>

          <p
            data-head
            className="hidden font-sans text-[18px] font-medium leading-snug md:block md:w-[31.8%]"
          >
            Upholstered furniture designed and made to be lived in, from
            solid ash and natural fabrics.
          </p>
        </div>

        {/* Product grid */}
        <div
          ref={gridRef}
          className="relative mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:mt-16 md:block md:aspect-[434/452]"
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
                    className={`relative overflow-hidden bg-[#e6e2d9] ${s.ratio}`}
                  >
                    <Link
                      href={`/shop/${p.slug}`}
                      aria-label={p.name}
                      className="absolute inset-0 block"
                    >
                      <Image
                        src={p.src}
                        alt={p.name}
                        fill
                        sizes="(min-width: 1024px) 45vw, 50vw"
                        className="object-cover transition-opacity duration-500 group-hover:opacity-0"
                      />

                      <Image
                        src={p.hoverSrc}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 45vw, 50vw"
                        className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      />
                    </Link>

                    {/* Add to cart */}
                    <button
                      type="button"
                      onClick={() => onAdd(p)}
                      className="absolute inset-x-0 bottom-0 z-10 translate-y-full bg-[#222628] py-3 font-sans text-sm font-medium text-white transition-transform duration-500 ease-out group-hover:translate-y-0 [@media(hover:none)]:translate-y-0"
                    >
                      Add to cart
                    </button>
                  </div>

                  {/* Product details */}
                  <div className="mt-3 flex items-start justify-between gap-4 font-sans">
                    <h3 className="text-sm font-medium leading-snug md:text-base lg:text-lg">
                      {p.name}
                    </h3>

                    <span className="shrink-0 text-sm font-medium md:text-base lg:text-lg">
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
