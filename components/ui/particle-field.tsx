"use client";

import { useEffect, useRef } from "react";
import { performanceManager, scaleParticleCount, debounce } from "@/lib/performance-utils";

interface ParticleFieldProps {
  density?: "low" | "medium" | "high";
  className?: string;
}

export function ParticleField({
  density = "low",
  className = ""
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) return;

    const perfConfig = performanceManager.getConfig();
    let animationFrameId: number;
    let isIntersecting = true;
    let mouseX = 0;
    let mouseY = 0;
    let lastFrameTime = 0;

    const updateSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, perfConfig.tier === "high" ? 2 : 1);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    updateSize();

    const colors = {
      yellow: "#FFED00",
      blue: "#0066FF",
      cyan: "#00CED1",
      lightBlue: "#B8E6E6",
    };

    class Particle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      color: string;
      opacity: number;
      vx: number;
      vy: number;
      trail: {x: number, y: number, opacity: number}[];

      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = Math.random() * 3 + 2;
        this.color = [colors.yellow, colors.blue, colors.cyan, colors.lightBlue][
          Math.floor(Math.random() * 4)
        ];
        this.opacity = Math.random() * 0.5 + 0.4;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.trail = [];
      }

      update(canvasWidth: number, canvasHeight: number) {
        // Add current position to trail
        this.trail.push({x: this.x, y: this.y, opacity: this.opacity});
        if (this.trail.length > 12) {
          this.trail.shift();
        }

        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 4;
          this.y -= Math.sin(angle) * force * 4;
        }

        this.x += this.vx;
        this.y += this.vy;

        const returnSpeed = 0.05;
        this.x += (this.baseX - this.x) * returnSpeed;
        this.y += (this.baseY - this.y) * returnSpeed;

        if (this.x < 0 || this.x > canvasWidth || this.y < 0 || this.y > canvasHeight) {
          this.x = this.baseX;
          this.y = this.baseY;
        }
      }

      draw(enableTrails: boolean, enableShadows: boolean) {
        if (!ctx) return;

        // Draw trail only if enabled and performance allows
        if (enableTrails && this.trail.length > 0) {
          this.trail.forEach((point, index) => {
            const trailOpacity = (index / this.trail.length) * this.opacity * 0.3;
            const trailSize = (index / this.trail.length) * this.size;

            ctx.fillStyle = this.color;
            ctx.globalAlpha = trailOpacity;
            ctx.beginPath();
            ctx.arc(point.x, point.y, trailSize, 0, Math.PI * 2);
            ctx.fill();
          });
        }

        // Draw main particle
        if (enableShadows) {
          ctx.shadowColor = this.color;
          ctx.shadowBlur = 10;
        }
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Reset
        if (enableShadows) {
          ctx.shadowBlur = 0;
        }
        ctx.globalAlpha = 1;
      }
    }

    const baseParticleCount =
      density === "high" ? 150 :
      density === "medium" ? 100 :
      60;

    const particleCount = scaleParticleCount(baseParticleCount);

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(window.innerWidth, window.innerHeight));
    }

    function drawConnections() {
      if (!ctx) return;

      const maxDistance = 120;
      const maxConnections = perfConfig.tier === "low" ? 50 : perfConfig.tier === "medium" ? 100 : 200;
      let connectionCount = 0;

      for (let i = 0; i < particles.length && connectionCount < maxConnections; i++) {
        for (let j = i + 1; j < particles.length && connectionCount < maxConnections; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            connectionCount++;
            const opacity = (1 - distance / maxDistance) * 0.25;

            // Simplified line drawing without gradients for better performance
            ctx.strokeStyle = particles[i].color;
            ctx.lineWidth = 1;
            ctx.globalAlpha = opacity;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
    }

    const targetFrameTime = 1000 / perfConfig.targetFPS;

    function animate(timestamp: number) {
      if (!ctx || !canvas || !isIntersecting) return;

      // Frame throttling
      const deltaTime = timestamp - lastFrameTime;
      if (deltaTime < targetFrameTime) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = timestamp - (deltaTime % targetFrameTime);

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      particles.forEach((particle) => {
        particle.update(window.innerWidth, window.innerHeight);
        particle.draw(perfConfig.enableTrails, perfConfig.enableShadows);
      });

      drawConnections();

      animationFrameId = requestAnimationFrame(animate);
    }

    // Throttle mouse move
    let mouseMoveTimeout: number | null = null;
    const handleMouseMove = (e: MouseEvent) => {
      if (mouseMoveTimeout) return;
      mouseMoveTimeout = window.setTimeout(() => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        mouseMoveTimeout = null;
      }, 16);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isIntersecting = entry.isIntersecting;
          if (isIntersecting) {
            lastFrameTime = performance.now();
            animate(lastFrameTime);
          } else {
            if (animationFrameId) {
              cancelAnimationFrame(animationFrameId);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(canvas);
    window.addEventListener("mousemove", handleMouseMove, { passive: true } as any);

    lastFrameTime = performance.now();
    animate(lastFrameTime);

    const handleResize = debounce(() => {
      updateSize();
    }, 250);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (mouseMoveTimeout) {
        clearTimeout(mouseMoveTimeout);
      }
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  );
}
