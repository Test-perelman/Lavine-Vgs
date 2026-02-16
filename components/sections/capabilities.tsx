"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ParticleField } from "@/components/ui/particle-field";

const projects = [
    { name: "Apex Architecture", type: "Digital Identity" },
    { name: "Lumina Art", type: "Experience Design" },
    { name: "Vanguard", type: "Strategy" },
    { name: "Onyx Films", type: "Motion" },
];

export function CapabilitiesSection() {
    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        gsap.to(e.currentTarget.querySelector(".project-type"), { opacity: 1, x: 0, duration: 0.3 });
        gsap.to(e.currentTarget, { backgroundColor: "#E2B59A", duration: 0.3 }); // Blush Beige on hover
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        gsap.to(e.currentTarget.querySelector(".project-type"), { opacity: 0, x: -10, duration: 0.3 });
        gsap.to(e.currentTarget, { backgroundColor: "transparent", duration: 0.3 });
    };

    return (
        <section className="relative z-10 w-full py-24 bg-background text-foreground overflow-hidden">
            <ParticleField density="low" />
            <div className="container px-4 md:px-6 relative z-10">
                <h2 className="mb-12 text-sm font-bold tracking-widest uppercase text-muted-foreground">SELECTED WORK</h2>
                <div className="grid gap-px bg-neutral/20 border border-neutral/20">
                    {projects.map((project, index) => (
                        <div
                            key={index}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            className="group relative flex items-center justify-between p-8 bg-background transition-colors overflow-hidden"
                        >
                            <h3 className="text-3xl md:text-5xl font-medium tracking-tight z-10">{project.name}</h3>
                            <span className="project-type opacity-0 -translate-x-4 text-sm md:text-xl font-light text-muted-foreground z-10">
                                {project.type}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
