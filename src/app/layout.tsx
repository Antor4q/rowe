import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "rowe | Quiet confidence, made tangible.",
  description:
    "Designs and manufactures customizable, upholstered furniture in the USA. Handcrafted luxury sofas, sectionals, and accent chairs.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#F3EFEA] text-[#281C15] font-sans antialiased overflow-x-hidden selection:bg-[#281C15] selection:text-[#F3EFEA]">
        <Navbar/>
        <Loader/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
