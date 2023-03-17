import { AboutSection } from "@/components/home/about-section";
import { HeroSection } from "@/components/home/hero-section";
import { ServicesSection } from "@/components/home/services-section";

export default function IndexRoute() {
  return (
    <>
      <div className="flex flex-col items-start">
        <HeroSection />
        <AboutSection />
      </div>
      <ServicesSection />
    </>
  );
}
