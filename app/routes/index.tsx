import { AboutSection } from "@/components/home/about-section";
import { HeroSection } from "@/components/home/hero-section";
import { ServicesSection } from "@/components/home/services-section";
import { Spacer } from "@/components/spacer";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <Spacer size="lg" />
      <ServicesSection />
      <Spacer size="lg" />
    </>
  );
}
