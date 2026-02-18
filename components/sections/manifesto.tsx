"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { FadeUp, Stagger, StaggerItem } from "@/components/ui/motion";

gsap.registerPlugin(ScrollTrigger);

export function ManifestoSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const el = containerRef.current;
        const text = textRef.current;
        if (!el || !text) return;

        // Animate background color shift slightly
        gsap.to(el, {
            backgroundColor: "#EBE9E4", // Slightly darker stone
            scrollTrigger: {
                trigger: el,
                start: "top center",
                end: "bottom center",
                scrub: 1,
            }
        });

        // Split text reveal effect (simulated without SplitText plugin for now)
        const lines = text.innerHTML.split("<br>");
        text.innerHTML = lines.map(line => `<span class="line-mask overflow-hidden block"><span class="line-content block translate-y-full">${line}</span></span>`).join("");

        gsap.utils.toArray(".line-content").forEach((line: any, i) => {
            gsap.to(line, {
                y: 0,
                duration: 1.5,
                ease: "power4.out",
                delay: i * 0.1,
                scrollTrigger: {
                    trigger: el,
                    start: "top 70%",
                }
            });
        });

    }, []);

    return (
        <section ref={containerRef} className="relative z-10 w-full min-h-[80vh] flex flex-col justify-center px-4 md:px-12 py-32 bg-background text-foreground transition-colors duration-1000 overflow-hidden">
            <AnimatedBackground variant="subtle" />
            <div className="max-w-6xl mx-auto relative z-10">
                <FadeUp>
                    <span className="block mb-12 text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Studio Philosophy</span>
                </FadeUp>

                <p ref={textRef} className="text-4xl md:text-7xl font-light leading-[1.1] tracking-tight text-foreground mix-blend-darken">
                    We believe in silence.<br />
                    In the spaces between.<br />
                    Design is not just what you see,<br />
                    but what you feel when<br />
                    the noise stops.
                </p>

                <Stagger
                    className="mt-24 grid md:grid-cols-3 gap-12 border-t border-border pt-12"
                    staggerDelay={0.15}
                    initialDelay={0.1}
                >
                    <StaggerItem className="space-y-4">
                        <h3 className="text-sm font-medium uppercase tracking-widest">Restraint</h3>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            We strip away the non-essential to reveal the core truth of a brand.
                        </p>
                    </StaggerItem>
                    <StaggerItem className="space-y-4">
                        <h3 className="text-sm font-medium uppercase tracking-widest">Atmosphere</h3>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Creating environments that immerse and transport the user.
                        </p>
                    </StaggerItem>
                    <StaggerItem className="space-y-4">
                        <h3 className="text-sm font-medium uppercase tracking-widest">Timelessness</h3>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Work that endures beyond trends and fleeting moments.
                        </p>
                    </StaggerItem>
                </Stagger>
            </div>
        </section>
    );
}
