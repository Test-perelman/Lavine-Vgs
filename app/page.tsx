"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import Lenis from "lenis";
import { ScrollAnimationHero } from "@/components/ui/scroll-animation-hero";
import { AboutSection } from "@/components/sections/about";
import { ServicesSection } from "@/components/sections/services";
import { ContactSection } from "@/components/sections/contact";
import { ManifestoSection } from "@/components/sections/manifesto";
import { OutroSection } from "@/components/sections/outro";

// Lazy load below-fold sections for better initial load performance
const ProcessSection = dynamic(() => import("@/components/sections/process").then(m => ({ default: m.ProcessSection })), {
  loading: () => <div className="min-h-screen w-full" />,
});

const AtmosphereSection = dynamic(() => import("@/components/sections/atmosphere").then(m => ({ default: m.AtmosphereSection })), {
  loading: () => <div className="min-h-screen w-full" />,
});

const CapabilitiesSection = dynamic(() => import("@/components/sections/capabilities").then(m => ({ default: m.CapabilitiesSection })), {
  loading: () => <div className="min-h-screen w-full" />,
});

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
