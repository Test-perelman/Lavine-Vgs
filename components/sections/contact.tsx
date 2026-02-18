"use client";

import { AnimatedBackground } from "@/components/ui/animated-background";
import { FadeUp, Stagger, StaggerItem } from "@/components/ui/motion";

export function ContactSection() {
    return (
        <section className="relative z-10 w-full py-32 bg-background text-foreground flex flex-col items-center justify-center text-center overflow-hidden">
            <AnimatedBackground variant="default" />

            <FadeUp className="relative z-10" duration={1.0}>
                <h2 className="text-[10vw] font-bold leading-none tracking-tighter hover:text-primary transition-colors cursor-pointer">
                    LET&apos;S TALK
                </h2>
            </FadeUp>

            <FadeUp className="relative z-10" delay={0.18} duration={0.8}>
                <a
                    href="mailto:hello@lavine.studio"
                    className="mt-8 text-xl tracking-widest flex items-center gap-2 group text-foreground hover:text-primary transition-colors"
                >
                    <span>hello@lavine.studio</span>
                    <span className="group-hover:translate-x-2 transition-transform">→</span>
                </a>
            </FadeUp>

            <footer className="absolute bottom-4 w-full px-6 flex justify-between text-xs text-muted-foreground uppercase tracking-widest">
                <Stagger className="flex gap-4" staggerDelay={0.12} initialDelay={0.4}>
                    <StaggerItem>
                        <span>© 2024 Lavine Design Studio</span>
                    </StaggerItem>
                </Stagger>
                <Stagger staggerDelay={0.12} initialDelay={0.5}>
                    <StaggerItem>
                        <span>All Rights Reserved</span>
                    </StaggerItem>
                </Stagger>
            </footer>
        </section>
    );
}
