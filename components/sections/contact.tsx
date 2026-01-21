"use client";

export function ContactSection() {
    return (
        <section className="relative z-10 w-full py-32 bg-black text-white flex flex-col items-center justify-center text-center">
            <h2 className="text-[10vw] font-bold leading-none tracking-tighter hover:text-zinc-300 transition-colors cursor-pointer">
                LET'S TALK
            </h2>
            <a href="mailto:hello@lavine.studio" className="mt-8 text-xl tracking-widest flex items-center gap-2 group">
                <span>hello@lavine.studio</span>
                <span className="group-hover:translate-x-2 transition-transform">→</span>
            </a>

            <footer className="absolute bottom-4 w-full px-6 flex justify-between text-xs text-zinc-600 uppercase tracking-widest">
                <span>© 2024 Lavine Design Studio</span>
                <span>All Rights Reserved</span>
            </footer>
        </section>
    );
}
