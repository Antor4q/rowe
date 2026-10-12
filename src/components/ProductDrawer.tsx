"use client";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { X, Check, Sparkles, ShieldCheck, MapPin } from "lucide-react";

interface ProductDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProduct?: "sofa" | "armchair";
}

export const ProductDrawer: React.FC<ProductDrawerProps> = ({
  isOpen,
  onClose,
  selectedProduct = "sofa",
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"sofa" | "armchair">(selectedProduct);
  const [activeFabric, setActiveFabric] = useState("Oatmeal Bouclé");

  useEffect(() => {
    setActiveTab(selectedProduct);
  }, [selectedProduct]);

  useEffect(() => {
    if (isOpen) {
      if (backdropRef.current && drawerRef.current) {
        gsap.fromTo(
          backdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: "power2.out" }
        );
        gsap.fromTo(
          drawerRef.current,
          { x: "100%" },
          { x: "0%", duration: 0.55, ease: "power3.out" }
        );
      }
    }
  }, [isOpen]);

  const handleClose = () => {
    if (backdropRef.current && drawerRef.current) {
      gsap.to(drawerRef.current, {
        x: "100%",
        duration: 0.45,
        ease: "power3.in",
      });
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
        onComplete: onClose,
      });
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  const fabrics = [
    { name: "Oatmeal Bouclé", color: "#E8E2D6", code: "BC-101" },
    { name: "Alabaster Linen", color: "#F0EAE1", code: "LN-204" },
    { name: "Raw Umber Wool", color: "#54463C", code: "WL-409" },
    { name: "Smoked Espresso", color: "#2B1D16", code: "TX-781" },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={handleClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Container */}
      <div
        ref={drawerRef}
        className="relative z-10 w-full max-w-xl bg-[#F9F7F4] h-full shadow-2xl flex flex-col justify-between overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-[#281C15]/10 flex items-center justify-between sticky top-0 bg-[#F9F7F4]/90 backdrop-blur-sm z-20">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#281C15]/60 font-medium">
              Curated Rowe Collection
            </span>
            <h3 className="text-2xl font-serif text-[#281C15] mt-1">
              Custom Craftsmanship
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-[#281C15]/5 transition-colors cursor-pointer text-[#281C15]"
            aria-label="Close drawer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-8 flex-1">
          {/* Tab Selection */}
          <div className="flex border border-[#281C15]/20 p-1 rounded-sm bg-[#EDE8E0]">
            <button
              onClick={() => setActiveTab("sofa")}
              className={`flex-1 py-2 text-sm font-medium transition-all ${
                activeTab === "sofa"
                  ? "bg-[#281C15] text-[#FAF7F2] shadow-sm"
                  : "text-[#281C15] hover:text-[#281C15]/80"
              }`}
            >
              Curved Sectional
            </button>
            <button
              onClick={() => setActiveTab("armchair")}
              className={`flex-1 py-2 text-sm font-medium transition-all ${
                activeTab === "armchair"
                  ? "bg-[#281C15] text-[#FAF7F2] shadow-sm"
                  : "text-[#281C15] hover:text-[#281C15]/80"
              }`}
            >
              Sculptural Armchair
            </button>
          </div>

          {/* Product Preview Card */}
          <div className="relative aspect-[16/10] bg-[#EFEBE4] overflow-hidden rounded-sm border border-[#281C15]/10">
            <Image
              src={activeTab === "sofa" ? "/images/sofa.jpg" : "/images/armchair.jpg"}
              alt={activeTab === "sofa" ? "Curved Sectional Sofa" : "Sculptural Armchair"}
              fill
              className="object-cover"
              sizes="(max-width: 600px) 100vw, 600px"
              priority
            />
            <div className="absolute top-3 left-3 bg-[#FAF7F2]/90 backdrop-blur-xs px-2.5 py-1 text-[11px] uppercase tracking-wider font-semibold text-[#281C15] rounded-xs">
              Handmade in USA
            </div>
          </div>

          {/* Product Details */}
          <div>
            <div className="flex items-baseline justify-between">
              <h4 className="text-xl sm:text-2xl font-serif text-[#281C15]">
                {activeTab === "sofa"
                  ? "The Sylvan Curved Sectional"
                  : "The Astrid Sculptural Armchair"}
              </h4>
              <span className="text-sm font-medium text-[#281C15]">
                Customizable
              </span>
            </div>
            <p className="text-sm text-[#281C15]/75 mt-2 leading-relaxed">
              {activeTab === "sofa"
                ? "An architectural centerpiece crafted with sweeping organic curves, low profile tailoring, and high-density eco-resilient foam. Designed for relaxed conversation and quiet tactile luxury."
                : "A masterclass in ergonomic form. Fluid lines sweep from the supportive contoured back into tailored arms, elevated upon hand-turned American walnut tapered legs."}
            </p>
          </div>

          {/* Fabric & Finish Selector */}
          <div>
            <div className="text-xs uppercase tracking-widest text-[#281C15]/60 mb-3 font-semibold">
              Select Fabric Swatch: <span className="text-[#281C15] font-bold">{activeFabric}</span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {fabrics.map((fabric) => (
                <button
                  key={fabric.name}
                  onClick={() => setActiveFabric(fabric.name)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-sm border transition-all text-center ${
                    activeFabric === fabric.name
                      ? "border-[#281C15] ring-1 ring-[#281C15] bg-white/60"
                      : "border-[#281C15]/15 hover:border-[#281C15]/40"
                  }`}
                >
                  <span
                    className="w-8 h-8 rounded-full shadow-inner border border-black/10 flex items-center justify-center"
                    style={{ backgroundColor: fabric.color }}
                  >
                    {activeFabric === fabric.name && (
                      <Check
                        className={`w-4 h-4 ${
                          fabric.name.includes("Espresso") || fabric.name.includes("Raw")
                            ? "text-white"
                            : "text-[#281C15]"
                        }`}
                      />
                    )}
                  </span>
                  <span className="text-[10px] leading-tight text-[#281C15] font-medium">
                    {fabric.name.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Specifications Matrix */}
          <div className="bg-[#EAE4DB]/60 p-4 rounded-sm space-y-2.5 text-xs text-[#281C15]/80">
            <div className="flex justify-between border-b border-[#281C15]/10 pb-2">
              <span className="text-[#281C15]/60">Dimensions</span>
              <span className="font-medium text-[#281C15]">
                {activeTab === "sofa" ? '124"W x 72"D x 31"H' : '33"W x 34"D x 33"H'}
              </span>
            </div>
            <div className="flex justify-between border-b border-[#281C15]/10 pb-2">
              <span className="text-[#281C15]/60">Frame Construction</span>
              <span className="font-medium text-[#281C15]">
                Kiln-Dried Hardwood (SFI Certified)
              </span>
            </div>
            <div className="flex justify-between border-b border-[#281C15]/10 pb-2">
              <span className="text-[#281C15]/60">Spring System</span>
              <span className="font-medium text-[#281C15]">Heavy-gauge Sinuous Springs</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#281C15]/60">Origin</span>
              <span className="font-medium text-[#281C15]">Elliston, Virginia, USA</span>
            </div>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-[#281C15]/75">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#281C15]" />
              <span>Lifetime Frame Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#281C15]" />
              <span>Over 500+ Designer Fabrics</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 sm:p-8 border-t border-[#281C15]/10 bg-[#FAF7F2] space-y-3">
          <button
            onClick={() => alert(`Swatches for "${activeFabric}" ordered successfully!`)}
            className="w-full bg-[#281C15] text-[#FAF7F2] py-3.5 px-6 font-medium text-sm tracking-wide hover:bg-[#3E2B20] transition-colors cursor-pointer text-center block"
          >
            Request Free Fabric Swatch Kit
          </button>
          <button
            onClick={() => alert("Finding nearest Rowe design partner showroom...")}
            className="w-full border border-[#281C15] text-[#281C15] py-3 px-6 font-medium text-sm tracking-wide hover:bg-[#281C15]/5 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            Find Nearest Showroom
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDrawer;
