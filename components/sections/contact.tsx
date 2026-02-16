"use client";

import { AnimatedBackground } from "@/components/ui/animated-background";

export function ContactSection() {
    return (
        <section className="relative z-10 w-full py-32 bg-background text-foreground flex flex-col items-center justify-center text-center overflow-hidden">
            <AnimatedBackground variant="default" />
            <h2 className="text-[10vw] font-bold leading-none tracking-tighter hover:text-primary transition-colors cursor-pointer relative z-10">
                LET'S TALK
            </h2>
            <a href="mailto:hello@lavine.studio" className="mt-8 text-xl tracking-widest flex items-center gap-2 group text-foreground hover:text-primary transition-colors relative z-10">
                <span>hello@lavine.studio</span>
                <span className="group-hover:translate-x-2 transition-transform">→</span>
            </a>

            <footer className="absolute bottom-4 w-full px-6 flex justify-between text-xs text-muted-foreground uppercase tracking-widest">
                <span>© 2024 Lavine Design Studio</span>
                <span>All Rights Reserved</span>
            </footer>
        </section>
    );
}
