"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
    { number: "01", title: "Immersion", desc: "We dive deep into your world, understanding the unspoken nuances." },
    { number: "02", title: "Reduction", desc: "Removing the noise to find the signal. The hardest part of the process." },
    { number: "03", title: "Elevation", desc: "Applying craft and motion to lift the essential into the sublime." },
    { number: "04", title: "Release", desc: "Launching the work into the world with precision and impact." },
];

export function ProcessSection() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const section = sectionRef.current;
        if (!canvas || !section) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let mouseX = canvas.width / 2;
        let mouseY = canvas.height / 2;
        let targetMouseX = mouseX;
        let targetMouseY = mouseY;

        const resize = () => {
            canvas.width = section.offsetWidth;
            canvas.height = section.offsetHeight;
        };
        resize();

        // Elegant floating orbs with soft gradients
        class FloatingOrb {
            x: number;
            y: number;
            baseX: number;
            baseY: number;
            radius: number;
            color: string;
            opacity: number;
            speed: number;
            angle: number;
            pulsePhase: number;

            constructor(canvasWidth: number, canvasHeight: number) {
                this.baseX = Math.random() * canvasWidth;
                this.baseY = Math.random() * canvasHeight;
                this.x = this.baseX;
                this.y = this.baseY;
                this.radius = Math.random() * 120 + 80;

                const colors = [
                    { r: 184, g: 230, b: 230 }, // #B8E6E6 light blue
                    { r: 0, g: 206, b: 209 },   // #00CED1 cyan
                    { r: 0, g: 102, b: 255 },   // #0066FF blue
                    { r: 255, g: 237, b: 0 },   // #FFED00 yellow
                ];
                const col = colors[Math.floor(Math.random() * colors.length)];
                this.color = `${col.r}, ${col.g}, ${col.b}`;

                this.opacity = Math.random() * 0.08 + 0.04;
                this.speed = Math.random() * 0.3 + 0.1;
                this.angle = Math.random() * Math.PI * 2;
                this.pulsePhase = Math.random() * Math.PI * 2;
            }

            update(time: number) {
                // Gentle floating motion
                this.x = this.baseX + Math.sin(time * 0.0003 + this.angle) * 40;
                this.y = this.baseY + Math.cos(time * 0.0004 + this.angle) * 30;

                // Subtle mouse interaction - gentle attraction
                const dx = targetMouseX - this.x;
                const dy = targetMouseY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 300) {
                    const force = (1 - distance / 300) * 0.3;
                    this.x += dx * force * 0.01;
                    this.y += dy * force * 0.01;
                }

                // Gentle pulse
                const pulse = Math.sin(time * 0.001 + this.pulsePhase) * 0.5 + 0.5;
                this.opacity = (Math.random() * 0.04 + 0.04) + pulse * 0.03;
            }

            draw() {
                if (!ctx) return;

                // Create radial gradient for soft, glowing effect
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.radius
                );
                gradient.addColorStop(0, `rgba(${this.color}, ${this.opacity})`);
                gradient.addColorStop(0.5, `rgba(${this.color}, ${this.opacity * 0.4})`);
                gradient.addColorStop(1, `rgba(${this.color}, 0)`);

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Minimal geometric lines
        class GeometricLine {
            x1: number;
            y1: number;
            x2: number;
            y2: number;
            baseX1: number;
            baseY1: number;
            baseX2: number;
            baseY2: number;
            color: string;
            opacity: number;
            phase: number;

            constructor(canvasWidth: number, canvasHeight: number) {
                this.baseX1 = Math.random() * canvasWidth;
                this.baseY1 = Math.random() * canvasHeight;
                this.baseX2 = this.baseX1 + (Math.random() - 0.5) * 400;
                this.baseY2 = this.baseY1 + (Math.random() - 0.5) * 400;

                this.x1 = this.baseX1;
                this.y1 = this.baseY1;
                this.x2 = this.baseX2;
                this.y2 = this.baseY2;

                const colors = ["184, 230, 230", "0, 206, 209", "0, 102, 255"];
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.opacity = Math.random() * 0.15 + 0.05;
                this.phase = Math.random() * Math.PI * 2;
            }

            update(time: number) {
                const movement = Math.sin(time * 0.0002 + this.phase) * 15;
                this.x1 = this.baseX1 + movement;
                this.y1 = this.baseY1 + movement * 0.5;
                this.x2 = this.baseX2 - movement;
                this.y2 = this.baseY2 - movement * 0.5;
            }

            draw() {
                if (!ctx) return;

                ctx.strokeStyle = `rgba(${this.color}, ${this.opacity})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(this.x1, this.y1);
                ctx.lineTo(this.x2, this.y2);
                ctx.stroke();
            }
        }

        // Create elements
        const orbs: FloatingOrb[] = [];
        for (let i = 0; i < 8; i++) {
            orbs.push(new FloatingOrb(canvas.width, canvas.height));
        }

        const lines: GeometricLine[] = [];
        for (let i = 0; i < 12; i++) {
            lines.push(new GeometricLine(canvas.width, canvas.height));
        }

        let startTime = Date.now();

        function animate() {
            if (!ctx || !canvas) return;

            const currentTime = Date.now() - startTime;

            // Smooth mouse following
            mouseX += (targetMouseX - mouseX) * 0.05;
            mouseY += (targetMouseY - mouseY) * 0.05;

            // Clear with subtle fade for trail effect
            ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw lines first (background)
            lines.forEach(line => {
                line.update(currentTime);
                line.draw();
            });

            // Draw orbs on top
            orbs.forEach(orb => {
                orb.update(currentTime);
                orb.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        }

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            targetMouseX = e.clientX - rect.left;
            targetMouseY = e.clientY - rect.top;
        };

        const handleResize = () => {
            resize();
        };

        section.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("resize", handleResize);

        animate();

        return () => {
            section.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", handleResize);
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, []);

    return (
        <section ref={sectionRef} className="relative z-10 w-full py-48 bg-background text-foreground overflow-hidden">
            {/* Elegant canvas background */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-0 pointer-events-none"
            />

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
