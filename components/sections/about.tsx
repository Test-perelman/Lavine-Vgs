"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
        <section className="relative z-10 w-full min-h-[60vh] flex items-center justify-center py-24 bg-black">
            <div className="container px-4 md:px-6">
                <div ref={textRef} className="max-w-4xl mx-auto text-4xl font-light leading-10 text-white md:text-6xl md:leading-tight">
                    <p className="flex flex-wrap gap-x-3 gap-y-1">
                        {`We are Lavine. A digital-first design studio crafting brands that demand attention. We blend cinematic motion with Swiss precision to create experiences that feel alive.`.split(" ").map((word, i) => (
                            <span key={i} className="word inline-block">{word}</span>
                        ))}
                    </p>
                </div>
            </div>
        </section>
    );
}
