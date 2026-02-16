"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GradientOrbs } from "@/components/ui/gradient-orbs";

gsap.registerPlugin(ScrollTrigger);

export function OutroSection() {
    const titleRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        if (!titleRef.current) return;

        gsap.fromTo(titleRef.current,
            { letterSpacing: "-0.05em", opacity: 0.5 },
            {
                letterSpacing: "0.2em",
                opacity: 1,
                scrollTrigger: {
                    trigger: titleRef.current,
                    start: "top 90%",
                    end: "bottom 50%",
                    scrub: 1
                }
            }
        );
    }, []);

    return (
        <section className="relative z-10 w-full py-48 bg-background flex flex-col items-center justify-center overflow-hidden">
            <GradientOrbs count={5} colors={["#FFED00", "#0066FF", "#00CED1"]} />
            <div className="text-center space-y-8 relative z-10">
                <span className="text-sm font-mono uppercase tracking-widest text-muted-foreground">Est. 2025 — Worldwide</span>
                <h2 ref={titleRef} className="text-[15vw] font-bold text-primary leading-none mix-blend-multiply">
                    LAVINE
                </h2>
                <div className="flex flex-col md:flex-row gap-8 items-center justify-center text-sm font-medium tracking-widest uppercase text-foreground/60 mt-12">
                    <a href="#" className="hover:text-primary transition-colors">Instagram</a>
                    <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
                    <a href="#" className="hover:text-primary transition-colors">Email</a>
                </div>
            </div>
        </section>
    );
}
