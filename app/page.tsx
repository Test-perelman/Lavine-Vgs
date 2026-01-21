"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { Component as Hero } from "@/components/ui/horizon-hero-section";
import { AboutSection } from "@/components/sections/about";
import { ServicesSection } from "@/components/sections/services";
import { CapabilitiesSection } from "@/components/sections/capabilities";
import { ContactSection } from "@/components/sections/contact";

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
    <main className="w-full min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Hero />
      <AboutSection />
      <ServicesSection />
      <CapabilitiesSection />
      <ContactSection />
    </main>
  );
}
