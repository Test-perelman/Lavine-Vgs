"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import Image from "next/image";
import { FadeUp } from "@/components/ui/motion";

const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0 },
} as const;

const services = [
    {
        title: "Brand Strategy",
        desc: "Defining the soul of the entity before a single pixel is placed.",
        tags: ["Audit", "Positioning", "Voice"],
        img: "/images/s1.jpg"
    },
    {
        title: "Art Direction",
        desc: "Curating the visual language that speaks louder than words.",
        tags: ["Visual Identity", "Photography", "Styling"],
        img: "/images/s2.jpg"
    },
    {
        title: "Web Design",
        desc: "Digital environments that balance beauty with brutal functionality.",
        tags: ["UI/UX", "Interaction", "System"],
        img: "/images/s3.webp"
    },
    {
        title: "Motion Graphics",
        desc: "Giving life to static assets through rhythm and timing.",
        tags: ["2D/3D", "Animation", "Film"],
        img: "/images/s1.jpg" // Reuse for now
    },
    {
        title: "Spatial Audio",
        desc: "Soundscapes that define the emotional perimeter of the brand.",
        tags: ["Sound Design", "Mixing", "Score"],
        img: "/images/s2.jpg" // Reuse for now
    },
];

export function ServicesSection() {
    const [activeService, setActiveService] = useState<number | null>(null);
    const cursorRef = useRef<HTMLDivElement>(null);
    const cursorLabelRef = useRef<HTMLDivElement>(null);
    const xTo = useRef<any>(null);
    const yTo = useRef<any>(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        if (!cursor) return;

        // GSAP QuickTo for performant mouse following
        xTo.current = gsap.quickTo(cursor, "x", { duration: 0.8, ease: "power3" });
        yTo.current = gsap.quickTo(cursor, "y", { duration: 0.8, ease: "power3" });

        const moveCursor = (e: MouseEvent) => {
            xTo.current(e.clientX);
            yTo.current(e.clientY);
        };

        window.addEventListener("mousemove", moveCursor);
        return () => window.removeEventListener("mousemove", moveCursor);
    }, []);

    const handleMouseEnter = (index: number) => {
        setActiveService(index);
        gsap.to(cursorRef.current, { scale: 1, opacity: 1, duration: 0.5, ease: "power2.out" });
    };

    const handleMouseLeave = () => {
        setActiveService(null);
        gsap.to(cursorRef.current, { scale: 0, opacity: 0, duration: 0.5, ease: "power2.out" });
    };

    return (
        <section className="relative z-20 w-full py-32 bg-background text-foreground overflow-hidden cursor-none">
            {/* Custom Cursor / Floating Image */}
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-[400px] h-[300px] rounded-lg overflow-hidden pointer-events-none z-50 opacity-0 scale-0 -translate-x-1/2 -translate-y-1/2 box-border transform-gpu"
            >
                {services.map((service, i) => (
                    <Image
                        key={i}
                        src={service.img}
                        alt={service.title}
                        fill
                        sizes="400px"
                        className={`object-cover transition-opacity duration-500 ${activeService === i ? 'opacity-100' : 'opacity-0'}`}
                    />
                ))}
                <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
            </div>

            <div className="container px-4 md:px-12">
                <FadeUp>
                    <div className="flex justify-between items-end mb-24 border-b border-border pb-8">
                        <h2 className="text-sm font-bold tracking-widest uppercase text-muted-foreground">Our Expertise</h2>
                        <span className="text-xs font-mono text-muted-foreground hidden md:block">Index 01 — 05</span>
                    </div>
                </FadeUp>

                <motion.div
                    className="flex flex-col"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
                    }}
                >
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            variants={fadeUp}
                            transition={{ duration: 0.75, ease: [0.25, 0.1, 0.25, 1] }}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                            className="group relative flex flex-col md:flex-row md:items-center py-12 border-b border-border hover:border-primary/50 transition-colors duration-500 cursor-pointer"
                        >
                            {/* Number */}
                            <span className="text-xs font-mono text-muted-foreground md:w-24 mb-4 md:mb-0 group-hover:text-primary transition-colors">
                                0{index + 1}
                            </span>

                            {/* Title */}
                            <h3 className="text-4xl md:text-7xl font-light tracking-tight group-hover:translate-x-4 transition-transform duration-500 ease-out flex-1">
                                {service.title}
                            </h3>

                            {/* Hover info (Desktop) */}
                            <div className="hidden md:flex flex-col items-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity duration-500 transform group-hover:-translate-x-4">
                                <p className="max-w-xs text-right text-sm leading-relaxed">
                                    {service.desc}
                                </p>
                                <div className="flex gap-2 text-[10px] uppercase tracking-widest text-primary">
                                    {service.tags.map(tag => <span key={tag}>{tag}</span>)}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
