import * as React from "react";

import { AboutSection } from "@/components/home/about-section";
// import { BlogSection } from "@/components/home/blog-section";
import { CtaSection } from "@/components/home/cta-section";
import { HeroSection } from "@/components/home/hero-section";
import { ServicesSection } from "@/components/home/services-section";
import { Spacer } from "@/components/spacer";

export default function IndexRoute() {
  return (
    <React.Fragment>
      <HeroSection />
      <AboutSection />
      <Spacer size="lg" />
      <ServicesSection />
      <Spacer size="lg" />
      {/* <BlogSection />
      <Spacer size="lg" /> */}
      <CtaSection />
      <Spacer size="lg" />
    </React.Fragment>
  );
}
