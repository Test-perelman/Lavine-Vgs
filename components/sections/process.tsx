"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GeometricGrid } from "@/components/ui/geometric-grid";

gsap.registerPlugin(ScrollTrigger);

const steps = [
    { number: "01", title: "Immersion", desc: "We dive deep into your world, understanding the unspoken nuances." },
    { number: "02", title: "Reduction", desc: "Removing the noise to find the signal. The hardest part of the process." },
    { number: "03", title: "Elevation", desc: "Applying craft and motion to lift the essential into the sublime." },
    { number: "04", title: "Release", desc: "Launching the work into the world with precision and impact." },
];

export function ProcessSection() {
    return (
        <section className="relative z-10 w-full py-48 bg-background text-foreground overflow-hidden">
            <GeometricGrid cellSize={60} colors={["#B8E6E6", "#00CED1"]} />
            <div className="container px-4 md:px-6 relative z-10">
                <div className="flex flex-col md:flex-row gap-16">
                    <div className="md:w-1/3">
                        <div className="sticky top-32">
                            <h2 className="text-sm font-bold tracking-widest uppercase text-muted-foreground mb-4">The Process</h2>
                            <h3 className="text-5xl font-light leading-tight">
                                How we<br />shape the<br />intangible.
                            </h3>
                        </div>
                    </div>

                    <div className="md:w-2/3 space-y-32">
                        {steps.map((step, i) => (
                            <div key={i} className="process-step group relative pl-8 md:pl-0 border-l md:border-l-0 border-border md:border-none">
                                <span className="text-xs font-mono text-muted-foreground mb-4 block md:absolute md:-left-12 md:top-2">{step.number}</span>
                                <div className="border-t border-border pt-8 transition-colors duration-500 group-hover:border-primary">
                                    <h4 className="text-3xl md:text-4xl font-medium mb-4 group-hover:translate-x-4 transition-transform duration-500 ease-out">{step.title}</h4>
                                    <p className="text-xl text-muted-foreground max-w-md group-hover:text-foreground transition-colors duration-300">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
