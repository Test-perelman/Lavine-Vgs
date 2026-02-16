"use client";

import { useEffect, useRef } from "react";

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

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let isIntersecting = true;
    let mouseX = 0;
    let mouseY = 0;

    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
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

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
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

      update() {
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

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.x = this.baseX;
          this.y = this.baseY;
        }
      }

      draw() {
        if (!ctx) return;

        // Draw trail
        this.trail.forEach((point, index) => {
          const trailOpacity = (index / this.trail.length) * this.opacity * 0.4;
          const trailSize = (index / this.trail.length) * this.size;

          ctx.fillStyle = this.color;
          ctx.globalAlpha = trailOpacity;
          ctx.shadowColor = this.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(point.x, point.y, trailSize, 0, Math.PI * 2);
          ctx.fill();
        });

        // Draw main particle with glow
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Reset shadow
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }
    }

    const particleCount =
      density === "high" ? 150 :
      density === "medium" ? 100 :
      60;

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function drawConnections() {
      if (!ctx) return;

      const maxDistance = 120;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.3;

            // Draw connection line with gradient
            const gradient = ctx.createLinearGradient(
              particles[i].x, particles[i].y,
              particles[j].x, particles[j].y
            );
            gradient.addColorStop(0, particles[i].color);
            gradient.addColorStop(1, particles[j].color);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.5;
            ctx.globalAlpha = opacity;
            ctx.shadowColor = particles[i].color;
            ctx.shadowBlur = 5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
          }
        }
      }
    }

    function animate() {
      if (!ctx || !canvas || !isIntersecting) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      drawConnections();

      animationFrameId = requestAnimationFrame(animate);
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isIntersecting = entry.isIntersecting;
          if (isIntersecting) {
            animate();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(canvas);
    window.addEventListener("mousemove", handleMouseMove);

    animate();

    const handleResize = () => {
      updateSize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
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
