"use client";

import { useEffect, useRef } from "react";

interface GradientOrbsProps {
  count?: number;
  className?: string;
  colors?: string[];
}

export function GradientOrbs({
  count = 3,
  className = "",
  colors = ["#FFED00", "#0066FF", "#00CED1", "#B8E6E6"]
}: GradientOrbsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const orbs: HTMLDivElement[] = [];

    for (let i = 0; i < count; i++) {
      const orb = document.createElement("div");
      orb.className = "absolute rounded-full animate-float-orb";

      const size = Math.random() * 400 + 250;
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const opacity = Math.random() * 0.35 + 0.25;
      const duration = Math.random() * 20 + 15;
      const delay = Math.random() * -10;

      orb.style.width = `${size}px`;
      orb.style.height = `${size}px`;
      orb.style.left = `${startX}%`;
      orb.style.top = `${startY}%`;
      orb.style.background = `radial-gradient(circle at 30% 30%, ${color} 0%, ${color}CC 40%, transparent 70%)`;
      orb.style.opacity = opacity.toString();
      orb.style.animationDuration = `${duration}s`;
      orb.style.animationDelay = `${delay}s`;
      orb.style.mixBlendMode = "normal";
      orb.style.pointerEvents = "none";
      orb.style.filter = `blur(60px) drop-shadow(0 0 40px ${color})`;

      container.appendChild(orb);
      orbs.push(orb);
    }

    return () => {
      orbs.forEach(orb => orb.remove());
    };
  }, [count, colors]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  );
}
