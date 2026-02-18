"use client";

/**
 * animated-hero.tsx — Lavine Design Studio · Framer Motion Hero
 *
 * A text-driven, motion-first hero component. Intended as a section-level
 * hero for interior pages, campaign sections, or anywhere the scroll-frame
 * hero (ScrollAnimationHero) is not in use.
 *
 * Motion anatomy:
 *   1. Hairline rule wipes in from the left (entrance signal)
 *   2. Badge label fades up first (sets hierarchy)
 *   3. Headline fades up with slight delay (primary focal point)
 *   4. Accent line scales in below headline (visual breath)
 *   5. Sub-copy fades up last (supporting content)
 *   6. CTA fades up with longest delay (action layer)
 *
 * All motion respects prefers-reduced-motion.
 */

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ─── Shared easing ────────────────────────────────────────────────────────────

const smooth: [number, number, number, number] = [0.25, 0.1, 0.25, 1];
const cinematic: [number, number, number, number] = [0.76, 0, 0.24, 1];

// ─── Stagger container ────────────────────────────────────────────────────────

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: smooth },
  },
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface AnimatedHeroProps {
  /** Primary headline — supports line breaks via \n */
  headline?: string;
  /** Supporting copy below the headline */
  subline?: string;
  /** Small eyebrow label above the headline */
  badge?: string;
  /** Optional CTA label; omit to hide the button */
  ctaLabel?: string;
  /** Optional CTA href */
  ctaHref?: string;
  /** Optional CTA click handler */
  onCtaClick?: () => void;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AnimatedHero({
  headline = "Design That Breathes",
  subline = "A digital-first studio where silence is the medium and precision is the language.",
  badge = "Est. 2025",
  ctaLabel,
  ctaHref,
  onCtaClick,
  className,
}: AnimatedHeroProps) {
  const reduce = useReducedMotion();

  // Static fallback for reduced-motion
  if (reduce) {
    return (
      <section
        className={cn(
          "relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center",
          className
        )}
      >
        {badge && (
          <span className="mb-8 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {badge}
          </span>
        )}
        <h1 className="text-5xl font-light leading-none tracking-tight text-foreground md:text-8xl">
          {headline}
        </h1>
        <div className="mt-6 h-px w-24 bg-primary" />
        {subline && (
          <p className="mt-8 max-w-xl font-light leading-relaxed text-muted-foreground md:text-lg">
            {subline}
          </p>
        )}
        {ctaLabel && (
          <div className="mt-12">
            <Button asChild={!!ctaHref} size="lg" onClick={onCtaClick}>
              {ctaHref ? <a href={ctaHref}>{ctaLabel}</a> : ctaLabel}
            </Button>
          </div>
        )}
      </section>
    );
  }

  return (
    <section
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center",
        className
      )}
    >
      {/* Ambient hairline — wipes in before the stagger begins */}
      <motion.div
        aria-hidden
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 2.2, ease: cinematic, delay: 0.1 }}
        style={{ originX: 0 }}
        className="pointer-events-none absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
      />

      {/* Staggered content stack */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center"
      >
        {/* Badge */}
        {badge && (
          <motion.span
            variants={itemVariants}
            className="mb-10 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground"
          >
            {badge}
          </motion.span>
        )}

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl font-light leading-none tracking-tight text-foreground md:text-8xl"
        >
          {headline}
        </motion.h1>

        {/* Accent rule */}
        <motion.div
          variants={{
            hidden: { scaleX: 0, opacity: 0 },
            visible: {
              scaleX: 1,
              opacity: 1,
              transition: { duration: 0.8, ease: cinematic },
            },
          }}
          style={{ originX: 0.5 }}
          className="mt-8 h-px w-24 bg-primary"
        />

        {/* Subline */}
        {subline && (
          <motion.p
            variants={itemVariants}
            className="mt-8 max-w-xl font-light leading-relaxed text-muted-foreground md:text-lg"
          >
            {subline}
          </motion.p>
        )}

        {/* CTA */}
        {ctaLabel && (
          <motion.div variants={itemVariants} className="mt-12">
            <Button asChild={!!ctaHref} size="lg" onClick={onCtaClick}>
              {ctaHref ? <a href={ctaHref}>{ctaLabel}</a> : ctaLabel}
            </Button>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
