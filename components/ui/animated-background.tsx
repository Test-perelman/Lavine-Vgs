"use client";

import { useEffect, useRef } from "react";

interface AnimatedBackgroundProps {
  variant?: "subtle" | "default" | "intense";
  className?: string;
}

export function AnimatedBackground({
  variant = "default",
  className = ""
}: AnimatedBackgroundProps) {
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
    let scrollY = 0;

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
      accent1: "#FF6B6B",
      accent2: "#4ECDC4",
    };

    // Design Slab - represents architectural elements like floor plans, material swatches, elevations
    class DesignSlab {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      width: number;
      height: number;
      rotation: number;
      baseRotation: number;
      targetRotation: number;
      rotationSpeed: number;
      color: string;
      opacity: number;
      type: "floorplan" | "elevation" | "swatch" | "section" | "detail";
      depth: number; // for 3D-like layering
      convergence: number; // controls converge/diverge behavior
      hoverScale: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.baseX = Math.random() * canvasWidth;
        this.baseY = Math.random() * canvasHeight;
        this.x = this.baseX;
        this.y = this.baseY;

        this.type = ["floorplan", "elevation", "swatch", "section", "detail"][
          Math.floor(Math.random() * 5)
        ] as "floorplan" | "elevation" | "swatch" | "section" | "detail";

        // Size based on type
        if (this.type === "floorplan") {
          this.width = Math.random() * 200 + 150;
          this.height = Math.random() * 150 + 100;
        } else if (this.type === "swatch") {
          this.width = Math.random() * 80 + 60;
          this.height = Math.random() * 80 + 60;
        } else {
          this.width = Math.random() * 180 + 120;
          this.height = Math.random() * 120 + 80;
        }

        this.baseRotation = (Math.random() - 0.5) * 0.3;
        this.rotation = this.baseRotation;
        this.targetRotation = this.baseRotation;
        this.rotationSpeed = Math.random() * 0.002 + 0.001;

        this.color = [colors.yellow, colors.blue, colors.cyan, colors.lightBlue, colors.accent1, colors.accent2][
          Math.floor(Math.random() * 6)
        ];
        this.opacity = Math.random() * 0.15 + 0.08;
        this.depth = Math.random();
        this.convergence = Math.random() * Math.PI * 2;
        this.hoverScale = 1;
      }

      update(time: number, mouseX: number, mouseY: number, scrollY: number, canvasWidth: number, canvasHeight: number) {
        // Scroll-based movement
        const scrollInfluence = scrollY * 0.1 * (this.depth - 0.5);

        // Cursor-based repulsion/attraction
        const dx = this.baseX - mouseX;
        const dy = this.baseY - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 300;

        let cursorInfluenceX = 0;
        let cursorInfluenceY = 0;

        if (distance < maxDistance) {
          const force = (1 - distance / maxDistance) * 50 * this.depth;
          cursorInfluenceX = (dx / distance) * force;
          cursorInfluenceY = (dy / distance) * force;
        }

        // Convergence/divergence oscillation
        const convergencePhase = Math.sin(time * 0.0005 + this.convergence) * 0.5 + 0.5;
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;

        const toCenterX = centerX - this.baseX;
        const toCenterY = centerY - this.baseY;

        const convergeAmount = convergencePhase * 30 * (this.depth - 0.5);

        // Combine all movements
        this.x = this.baseX +
                 cursorInfluenceX +
                 (toCenterX * convergeAmount * 0.01) +
                 Math.sin(time * 0.0003 + this.depth) * 20;

        this.y = this.baseY +
                 cursorInfluenceY +
                 (toCenterY * convergeAmount * 0.01) +
                 scrollInfluence +
                 Math.cos(time * 0.0003 + this.depth) * 15;

        // Smooth rotation
        this.targetRotation = this.baseRotation +
                             Math.sin(time * 0.0004 + this.depth) * 0.1 +
                             (convergencePhase - 0.5) * 0.15;
        this.rotation += (this.targetRotation - this.rotation) * 0.05;

        // Hover scale
        const hoverDistance = Math.sqrt((this.x - mouseX) ** 2 + (this.y - mouseY) ** 2);
        const targetScale = hoverDistance < 150 ? 1.1 : 1;
        this.hoverScale += (targetScale - this.hoverScale) * 0.1;
      }

      draw() {
        if (!ctx) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.hoverScale, this.hoverScale);

        // Glass-like effect with gradient
        const gradient = ctx.createLinearGradient(-this.width / 2, -this.height / 2, this.width / 2, this.height / 2);
        gradient.addColorStop(0, this.color + '20');
        gradient.addColorStop(0.5, this.color + '10');
        gradient.addColorStop(1, this.color + '25');

        // Background fill
        ctx.fillStyle = gradient;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

        // Border
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = this.opacity * 1.5;
        ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);

        // Type-specific details
        ctx.globalAlpha = this.opacity;
        this.drawDetails();

        // Subtle glow
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 20;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        ctx.strokeRect(-this.width / 2 + 5, -this.height / 2 + 5, this.width - 10, this.height - 10);

        ctx.restore();
      }

      drawDetails() {
        if (!ctx) return;

        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.lineWidth = 1;

        if (this.type === "floorplan") {
          // Grid pattern like architectural floor plan
          const gridSize = 20;
          for (let x = -this.width / 2; x < this.width / 2; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, -this.height / 2);
            ctx.lineTo(x, this.height / 2);
            ctx.stroke();
          }
          for (let y = -this.height / 2; y < this.height / 2; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(-this.width / 2, y);
            ctx.lineTo(this.width / 2, y);
            ctx.stroke();
          }

          // Simulated room outline
          ctx.lineWidth = 2;
          ctx.strokeRect(-this.width / 3, -this.height / 3, this.width / 1.5, this.height / 1.5);

        } else if (this.type === "elevation") {
          // Vertical lines like building elevation
          const lineCount = 5;
          for (let i = 0; i < lineCount; i++) {
            const x = -this.width / 2 + (i * this.width / (lineCount - 1));
            ctx.beginPath();
            ctx.moveTo(x, -this.height / 2);
            ctx.lineTo(x, this.height / 2);
            ctx.stroke();
          }

          // Horizontal division
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-this.width / 2, 0);
          ctx.lineTo(this.width / 2, 0);
          ctx.stroke();

        } else if (this.type === "swatch") {
          // Material swatch pattern
          const swatchSize = this.width / 4;
          for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
              const x = -this.width / 4 + i * swatchSize;
              const y = -this.height / 4 + j * swatchSize;
              ctx.fillRect(x, y, swatchSize - 4, swatchSize - 4);
            }
          }

        } else if (this.type === "section") {
          // Section cut pattern
          ctx.lineWidth = 1.5;

          // Diagonal hatch pattern
          const hatchSpacing = 10;
          for (let i = -this.width; i < this.width + this.height; i += hatchSpacing) {
            ctx.beginPath();
            ctx.moveTo(-this.width / 2 + i, -this.height / 2);
            ctx.lineTo(-this.width / 2 + i - this.height, this.height / 2);
            ctx.stroke();
          }

        } else if (this.type === "detail") {
          // Detail callout circle
          const radius = Math.min(this.width, this.height) / 3;
          ctx.beginPath();
          ctx.arc(0, 0, radius, 0, Math.PI * 2);
          ctx.stroke();

          // Crosshair
          ctx.beginPath();
          ctx.moveTo(-radius, 0);
          ctx.lineTo(radius, 0);
          ctx.moveTo(0, -radius);
          ctx.lineTo(0, radius);
          ctx.stroke();
        }
      }
    }

    // Ambient particles for depth
    class AmbientParticle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      color: string;
      opacity: number;
      depth: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.baseX = Math.random() * canvasWidth;
        this.baseY = Math.random() * canvasHeight;
        this.x = this.baseX;
        this.y = this.baseY;
        this.size = Math.random() * 2 + 1;
        this.color = [colors.yellow, colors.blue, colors.cyan, colors.lightBlue][
          Math.floor(Math.random() * 4)
        ];
        this.opacity = Math.random() * 0.3 + 0.1;
        this.depth = Math.random();
      }

      update(scrollY: number, mouseX: number, mouseY: number) {
        // Subtle parallax
        const scrollInfluence = scrollY * 0.05 * this.depth;

        // Very gentle cursor influence
        const dx = this.baseX - mouseX;
        const dy = this.baseY - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let cursorInfluenceX = 0;
        let cursorInfluenceY = 0;

        if (distance < 200) {
          const force = (1 - distance / 200) * 10 * this.depth;
          cursorInfluenceX = (dx / distance) * force;
          cursorInfluenceY = (dy / distance) * force;
        }

        this.x = this.baseX + cursorInfluenceX;
        this.y = this.baseY + cursorInfluenceY + scrollInfluence;
      }

      draw() {
        if (!ctx) return;

        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    // Wave class for flowing animations
    class Wave {
      y: number;
      baseY: number;
      length: number;
      amplitude: number;
      frequency: number;
      color: string;
      opacity: number;
      phase: number;

      constructor(startY: number, canvasWidth: number) {
        this.baseY = startY;
        this.y = startY;
        this.length = canvasWidth;
        this.amplitude = Math.random() * 40 + 30;
        this.frequency = Math.random() * 0.008 + 0.004;
        this.color = [colors.yellow, colors.blue, colors.cyan, colors.lightBlue][
          Math.floor(Math.random() * 4)
        ];
        this.opacity = Math.random() * 0.15 + 0.1;
        this.phase = Math.random() * Math.PI * 2;
      }

      update(time: number, scrollY: number) {
        this.y = this.baseY + scrollY * 0.03;
      }

      draw(time: number) {
        if (!ctx) return;

        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = this.opacity;

        // Add glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;

        ctx.beginPath();
        for (let x = 0; x < this.length; x += 3) {
          const y = this.y + Math.sin(x * this.frequency + time * 0.002 + this.phase) * this.amplitude;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.restore();
      }
    }

    const slabCount = variant === "intense" ? 12 : variant === "subtle" ? 6 : 9;
    const particleCount = variant === "intense" ? 80 : variant === "subtle" ? 30 : 50;
    const waveCount = variant === "intense" ? 5 : variant === "subtle" ? 2 : 3;

    const slabs: DesignSlab[] = [];
    for (let i = 0; i < slabCount; i++) {
      slabs.push(new DesignSlab(canvas.width, canvas.height));
    }

    const particles: AmbientParticle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new AmbientParticle(canvas.width, canvas.height));
    }

    const waves: Wave[] = [];
    for (let i = 0; i < waveCount; i++) {
      waves.push(new Wave((canvas.height / (waveCount + 1)) * (i + 1), canvas.width));
    }

    // Sort by depth for proper layering
    slabs.sort((a, b) => a.depth - b.depth);

    let startTime = Date.now();

    function animate() {
      if (!ctx || !canvas || !isIntersecting) return;

      const currentTime = Date.now() - startTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw waves first (furthest back)
      waves.forEach((wave) => {
        wave.update(currentTime, scrollY);
        wave.draw(currentTime);
      });

      // Draw ambient particles (middle layer)
      particles.forEach((particle) => {
        particle.update(scrollY, mouseX, mouseY);
        particle.draw();
      });

      // Draw slabs with proper depth layering (front layer)
      slabs.forEach((slab) => {
        slab.update(currentTime, mouseX, mouseY, scrollY, canvas.width, canvas.height);
        slab.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
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

    animate();

    const handleResize = () => {
      updateSize();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  );
}
