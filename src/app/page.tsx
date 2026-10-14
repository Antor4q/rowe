import AboutSection from "@/components/About";
import CollectionSection from "@/components/Collection";
import FAQ from "@/components/Faq";
import FeaturedProducts from "@/components/Featured";
import Hero from "@/components/HeroSection";
import NewArrivals from "@/components/NewArrivals";
import Testimonials from "@/components/Testimonials";
import WhyRowe from "@/components/Whyrowe";


export default function page() {
  return (
    <div>
     <Hero/>
     <AboutSection/>
     <CollectionSection/>
     <FeaturedProducts/>
     <NewArrivals/>
     <WhyRowe/>
     <Testimonials/>
     <FAQ/>
    </div>
  )
}
