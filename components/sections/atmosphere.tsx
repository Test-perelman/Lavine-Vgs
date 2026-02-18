"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { FadeUp } from "@/components/ui/motion";

gsap.registerPlugin(ScrollTrigger);

export function AtmosphereSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const images = gsap.utils.toArray(".atmos-img");

        images.forEach((img: any, i) => {
            gsap.fromTo(img,
                { y: 0, scale: 1 },
                {
                    y: (i + 1) * -50,
                    scale: 1.1,
                    scrollTrigger: {
                        trigger: el,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1
                    }
                }
            );
        });

    }, []);

    return (
        <section ref={containerRef} className="relative z-10 w-full min-h-screen overflow-hidden bg-foreground text-background flex flex-col items-center justify-center py-32">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[100px] mix-blend-screen animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] mix-blend-screen" style={{ animationDuration: '10s' }}></div>
            </div>

            <h2 className="relative z-10 text-[12vw] font-bold leading-none tracking-tighter opacity-10 mix-blend-overlay select-none">
                PRESENCE
            </h2>

            <div className="relative z-20 grid grid-cols-2 md:grid-cols-4 gap-4 w-full px-4 h-full mt-[-5vw]">
                {[1, 2, 3, 4].map((n) => {
                    const imageSrc = n === 1 ? '/images/s1.jpg' :
                                     n === 2 ? '/images/interior-blue-brown.png' :
                                     n === 3 ? '/images/interior-yellow.png' :
                                     '/images/s2.jpg';
                    return (
                        <div key={n} className="relative h-[40vh] md:h-[60vh] overflow-hidden rounded-sm bg-neutral/10">
                            <div className="atmos-img relative w-full h-[120%]">
                                <Image
                                    src={imageSrc}
                                    alt={`Atmosphere ${n}`}
                                    fill
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                    className="object-cover opacity-80 grayscale hover:grayscale-0 transition-opacity duration-700"
                                    style={{
                                        backgroundColor: n % 2 === 0 ? '#1A1A1A' : '#262626',
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <FadeUp className="mt-32 max-w-2xl text-center z-10" delay={0.1}>
                <p className="text-xl md:text-3xl font-light text-background/80 leading-relaxed">
                    "Space is the breath of art."
                </p>
            </FadeUp>
        </section>
    );
}
