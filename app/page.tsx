"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { ScrollAnimationHero } from "@/components/ui/scroll-animation-hero";
import { AboutSection } from "@/components/sections/about";
import { ServicesSection } from "@/components/sections/services";
import { CapabilitiesSection } from "@/components/sections/capabilities";
import { ContactSection } from "@/components/sections/contact";

import { ManifestoSection } from "@/components/sections/manifesto";
import { ProcessSection } from "@/components/sections/process";
import { AtmosphereSection } from "@/components/sections/atmosphere";
import { OutroSection } from "@/components/sections/outro";

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard easing
      orientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main className="w-full min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
      <ScrollAnimationHero />
      <ManifestoSection />
      <AboutSection />
      <ServicesSection />
      <ProcessSection />
      <AtmosphereSection />
      <CapabilitiesSection />
      <ContactSection />
      <OutroSection />
    </main>
  );
}
