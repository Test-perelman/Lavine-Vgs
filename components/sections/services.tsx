"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const services = [
    "Brand Strategy",
    "Art Direction",
    "Web Design",
    "Motion Graphics",
    "Creative Development",
    "Spatial Audio",
];

export function ServicesSection() {
    const listRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        // Optional: Add entrance animation if needed, or rely on hover
    }, []);

    const handleMouseEnter = (e: React.MouseEvent<HTMLLIElement>) => {
        gsap.to(e.currentTarget, { x: 20, duration: 0.4, ease: "power3.out" });
        gsap.to(e.currentTarget.querySelector(".arrow"), { opacity: 1, x: 0, duration: 0.4 });
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLLIElement>) => {
        gsap.to(e.currentTarget, { x: 0, duration: 0.4, ease: "power3.out" });
        gsap.to(e.currentTarget.querySelector(".arrow"), { opacity: 0, x: -10, duration: 0.4 });
    };

    return (
        <section className="relative z-10 w-full py-32 bg-zinc-950 text-white">
            <div className="container px-4 md:px-6">
                <h2 className="mb-12 text-sm font-bold tracking-widest uppercase text-zinc-500">OUR EXPERTISE</h2>
                <ul ref={listRef} className="space-y-4">
                    {services.map((service, index) => (
                        <li
                            key={index}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            className="group flex items-center text-4xl md:text-7xl font-bold cursor-none border-b border-zinc-900 pb-4 select-none opacity-50 hover:opacity-100 transition-opacity"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                            <span className="arrow opacity-0 -translate-x-4 mr-4 text-accent">→</span>
                            {service}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
