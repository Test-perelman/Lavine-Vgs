"use client";

/**
 * motion.tsx — Lavine Design Studio · Motion Primitives
 *
 * Reusable, GPU-accelerated motion components built on Framer Motion.
 * All components respect prefers-reduced-motion automatically.
 *
 * Primitives:
 *   FadeUp       — viewport-triggered fade + upward translate (section headers, text)
 *   ScaleIn      — viewport-triggered scale-in (cards, images)
 *   Stagger      — orchestrates staggered entrance for child items
 *   StaggerItem  — child of Stagger; inherits parent timing
 *   HoverLift    — subtle y-lift + scale on hover (interactive cards)
 *   PressButton  — spring-based press feedback (CTA buttons)
 *   ImageReveal  — cinematic scale-from-within reveal (image containers)
 */

import { forwardRef } from "react";
import {
  motion,
  type Variants,
  type MotionProps,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";

// ─── Easing curves ────────────────────────────────────────────────────────────

export const easings = {
  /** Standard smooth — general purpose transitions */
  smooth: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  /** Cinematic slow-in — image reveals, large elements */
  cinematic: [0.76, 0, 0.24, 1] as [number, number, number, number],
  /** Snappy exit — elements leaving the screen */
  snappy: [0.6, 0.05, 0.15, 1] as [number, number, number, number],
  /** Spring — interactive hover/lift effects */
  spring: { type: "spring" as const, stiffness: 320, damping: 28 },
  /** Button spring — tight, punchy press feedback */
  buttonSpring: { type: "spring" as const, stiffness: 420, damping: 18 },
} as const;

// ─── Shared variants ──────────────────────────────────────────────────────────

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const scaleUpVariants: Variants = {
  hidden: { opacity: 0, scale: 0.93 },
  visible: { opacity: 1, scale: 1 },
};

// ─── Shared viewport config ───────────────────────────────────────────────────

const viewportStrict = { once: true, margin: "-80px" } as const;
const viewportRelaxed = { once: true, margin: "-40px" } as const;

// ─── FadeUp ───────────────────────────────────────────────────────────────────
// Viewport-triggered fade + upward translate.
// Use for: section header labels, headings, paragraph blocks.

interface FadeUpProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export function FadeUp({
  children,
  className,
  delay = 0,
  duration = 0.8,
}: FadeUpProps) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      variants={fadeUpVariants}
      initial="hidden"
      whileInView="visible"
      viewport={viewportStrict}
      transition={{ duration, ease: easings.smooth, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── ScaleIn ──────────────────────────────────────────────────────────────────
// Viewport-triggered scale-in from 93% → 100%.
// Use for: cards, feature blocks, contained UI elements.

interface ScaleInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export function ScaleIn({
  children,
  className,
  delay = 0,
  duration = 0.9,
}: ScaleInProps) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      variants={scaleUpVariants}
      initial="hidden"
      whileInView="visible"
      viewport={viewportRelaxed}
      transition={{ duration, ease: easings.cinematic, delay }}
      className={cn("transform-gpu", className)}
    >
      {children}
    </motion.div>
  );
}

// ─── Stagger ──────────────────────────────────────────────────────────────────
// Orchestrates sequential entrance animations across its children.
// Pair with <StaggerItem> for each animating child.

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  /** Time between each child animation (seconds) */
  staggerDelay?: number;
  /** Initial delay before the first child animates (seconds) */
  initialDelay?: number;
}

export function Stagger({
  children,
  className,
  staggerDelay = 0.1,
  initialDelay = 0,
}: StaggerProps) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportStrict}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: initialDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── StaggerItem ──────────────────────────────────────────────────────────────
// Direct child of <Stagger>. Animates with fadeUp, driven by parent timing.

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
}

export function StaggerItem({
  children,
  className,
  duration = 0.7,
}: StaggerItemProps) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      variants={fadeUpVariants}
      transition={{ duration, ease: easings.smooth }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── HoverLift ────────────────────────────────────────────────────────────────
// Subtle upward lift + scale on hover. Spring-back on release.
// Use for: interactive cards, project tiles, navigation items.

interface HoverLiftProps {
  children: React.ReactNode;
  className?: string;
  /** Y-axis lift in px */
  liftAmount?: number;
  /** Scale factor on hover */
  scale?: number;
}

export function HoverLift({
  children,
  className,
  liftAmount = 6,
  scale = 1.015,
}: HoverLiftProps) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      whileHover={{ y: -liftAmount, scale }}
      whileTap={{ scale: 0.98 }}
      transition={easings.spring}
      className={cn("transform-gpu", className)}
    >
      {children}
    </motion.div>
  );
}

// ─── PressButton ──────────────────────────────────────────────────────────────
// Spring-based micro-interaction for CTA buttons.
// Accepts all standard HTMLButtonElement props.

type PressButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const PressButton = forwardRef<HTMLButtonElement, PressButtonProps>(
  ({ children, className, ...props }, ref) => {
    const reduce = useReducedMotion();

    if (reduce) {
      return (
        <button ref={ref} className={cn("transform-gpu", className)} {...props}>
          {children}
        </button>
      );
    }

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.95 }}
        transition={easings.buttonSpring}
        className={cn("transform-gpu", className)}
        {...(props as MotionProps)}
      >
        {children}
      </motion.button>
    );
  }
);

PressButton.displayName = "PressButton";

// ─── ImageReveal ──────────────────────────────────────────────────────────────
// Cinematic viewport reveal: fades in while subtly scaling from 105% → 100%.
// Use for: hero images, portfolio photos, full-bleed media.
// Important: apply to the CONTAINER of the <Image />, not the image itself.

interface ImageRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function ImageReveal({
  children,
  className,
  delay = 0,
}: ImageRevealProps) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.05 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.3, ease: easings.cinematic, delay }}
      className={cn("transform-gpu", className)}
    >
      {children}
    </motion.div>
  );
}
