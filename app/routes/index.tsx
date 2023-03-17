import { AboutSection } from "@/components/home/about-section";
import { HeroSection } from "@/components/home/hero-section";

export default function IndexRoute() {
  return (
    <>
      <div className="flex flex-col items-start">
        <HeroSection />
        <AboutSection />
      </div>
      <span>Other section goes here</span>
    </>
  );
}
