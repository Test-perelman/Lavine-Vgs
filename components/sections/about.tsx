"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GradientOrbs } from "@/components/ui/gradient-orbs";
import { ImageReveal } from "@/components/ui/motion";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export function AboutSection() {
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = textRef.current;
        if (!el) return;

        gsap.fromTo(
            el.querySelectorAll(".word"),
            { opacity: 0.1, y: 20 },
            {
                opacity: 1,
                y: 0,
                stagger: 0.05,
                duration: 1,
                else: "power2.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 80%",
                    end: "bottom 50%",
                    scrub: 1,
                },
            }
        );
    }, []);

    return (
        <section className="relative z-10 w-full min-h-[60vh] flex items-center justify-center py-24 bg-background text-foreground overflow-hidden">
            <GradientOrbs count={3} colors={["#00CED1", "#B8E6E6", "#0066FF"]} />
            <div className="container px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
                <div ref={textRef} className="text-4xl font-light leading-10 text-foreground md:text-6xl md:leading-tight">
                    <p className="flex flex-wrap gap-x-3 gap-y-1">
                        {`We are Lavine. A digital-first design studio crafting brands that demand attention. We blend cinematic motion with Swiss precision to create experiences that feel alive.`.split(" ").map((word, i) => (
                            <span key={i} className="word inline-block">{word}</span>
                        ))}
                    </p>
                </div>
                {/* Image Integration */}
                <ImageReveal className="relative h-[500px] w-full overflow-hidden rounded-lg shadow-2xl" delay={0.15}>
                    <Image
                        src="/images/s1.jpg"
                        alt="Studio Abstract"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-primary/10 mix-blend-multiply pointer-events-none"></div>
                </ImageReveal>
            </div>
        </section>
    );
}
