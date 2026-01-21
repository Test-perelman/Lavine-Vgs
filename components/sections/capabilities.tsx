"use client";

import { useRef } from "react";
import gsap from "gsap";

const projects = [
    { name: "Apex Architecture", type: "Digital Identity" },
    { name: "Lumina Art", type: "Experience Design" },
    { name: "Vanguard", type: "Strategy" },
    { name: "Onyx Films", type: "Motion" },
];

export function CapabilitiesSection() {
    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        gsap.to(e.currentTarget.querySelector(".project-type"), { opacity: 1, x: 0, duration: 0.3 });
        gsap.to(e.currentTarget, { backgroundColor: "#111", duration: 0.3 });
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        gsap.to(e.currentTarget.querySelector(".project-type"), { opacity: 0, x: -10, duration: 0.3 });
        gsap.to(e.currentTarget, { backgroundColor: "transparent", duration: 0.3 });
    };

    return (
        <section className="relative z-10 w-full py-24 bg-black text-white">
            <div className="container px-4 md:px-6">
                <h2 className="mb-12 text-sm font-bold tracking-widest uppercase text-zinc-500">SELECTED WORK</h2>
                <div className="grid gap-px bg-zinc-900 border border-zinc-900">
                    {projects.map((project, index) => (
                        <div
                            key={index}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            className="group relative flex items-center justify-between p-8 bg-black transition-colors overflow-hidden"
                        >
                            <h3 className="text-3xl md:text-5xl font-medium tracking-tight z-10">{project.name}</h3>
                            <span className="project-type opacity-0 -translate-x-4 text-sm md:text-xl font-light text-zinc-400 z-10">
                                {project.type}
                            </span>

                            {/* Optional: Background Image Reveal could go here */}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
