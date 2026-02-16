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
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;
      shape: "circle" | "square" | "triangle";
      trail: {x: number, y: number, opacity: number}[];

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 4 + 2;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.speedY = (Math.random() - 0.5) * 0.8;
        this.color = [colors.yellow, colors.blue, colors.cyan, colors.lightBlue][
          Math.floor(Math.random() * 4)
        ];
        this.opacity = Math.random() * 0.4 + 0.4;
        this.shape = ["circle", "square", "triangle"][
          Math.floor(Math.random() * 3)
        ] as "circle" | "square" | "triangle";
        this.trail = [];
      }

      update() {
        this.trail.push({x: this.x, y: this.y, opacity: this.opacity});
        if (this.trail.length > 15) {
          this.trail.shift();
        }

        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        if (!ctx) return;

        // Draw trail
        this.trail.forEach((point, index) => {
          const trailOpacity = (index / this.trail.length) * this.opacity * 0.3;
          const trailSize = (index / this.trail.length) * this.size;

          ctx.fillStyle = this.color;
          ctx.globalAlpha = trailOpacity;
          ctx.beginPath();
          ctx.arc(point.x, point.y, trailSize, 0, Math.PI * 2);
          ctx.fill();
        });

        // Draw shadow
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;

        if (this.shape === "circle") {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (this.shape === "square") {
          ctx.fillRect(this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
        } else {
          ctx.beginPath();
          ctx.moveTo(this.x, this.y - this.size);
          ctx.lineTo(this.x - this.size, this.y + this.size);
          ctx.lineTo(this.x + this.size, this.y + this.size);
          ctx.closePath();
          ctx.fill();
        }

        // Reset shadow
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }
    }

    class DesignTool {
      x: number;
      y: number;
      size: number;
      rotation: number;
      rotationSpeed: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;
      type: "ruler" | "triangle" | "protractor" | "pencil" | "compass";
      trail: {x: number, y: number, rotation: number, opacity: number}[];

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 60 + 50;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.speedX = (Math.random() - 0.5) * 0.6;
        this.speedY = (Math.random() - 0.5) * 0.6;
        this.color = [colors.yellow, colors.blue, colors.cyan, colors.lightBlue][
          Math.floor(Math.random() * 4)
        ];
        this.opacity = Math.random() * 0.3 + 0.3;
        this.type = ["ruler", "triangle", "protractor", "pencil", "compass"][
          Math.floor(Math.random() * 5)
        ] as "ruler" | "triangle" | "protractor" | "pencil" | "compass";
        this.trail = [];
      }

      update() {
        this.trail.push({x: this.x, y: this.y, rotation: this.rotation, opacity: this.opacity});
        if (this.trail.length > 8) {
          this.trail.shift();
        }

        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;

        if (this.x > canvas.width + this.size) this.x = -this.size;
        if (this.x < -this.size) this.x = canvas.width + this.size;
        if (this.y > canvas.height + this.size) this.y = -this.size;
        if (this.y < -this.size) this.y = canvas.height + this.size;
      }

      draw() {
        if (!ctx) return;

        // Draw trail
        this.trail.forEach((point, index) => {
          const trailOpacity = (index / this.trail.length) * this.opacity * 0.2;
          ctx.save();
          ctx.translate(point.x, point.y);
          ctx.rotate(point.rotation);
          ctx.strokeStyle = this.color;
          ctx.lineWidth = 3;
          ctx.globalAlpha = trailOpacity;
          this.drawShape();
          ctx.restore();
        });

        // Draw main shape with shadow
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        ctx.shadowColor = this.color;
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.lineWidth = 3;
        ctx.globalAlpha = this.opacity;

        this.drawShape();

        ctx.shadowBlur = 0;
        ctx.restore();
      }

      drawShape() {
        if (!ctx) return;

        if (this.type === "ruler") {
          // Ruler shape
          const width = this.size;
          const height = this.size / 8;
          ctx.strokeRect(-width / 2, -height / 2, width, height);
          // Tick marks
          for (let i = 0; i < 10; i++) {
            const x = -width / 2 + (i * width / 10);
            ctx.beginPath();
            ctx.moveTo(x, -height / 2);
            ctx.lineTo(x, -height / 4);
            ctx.stroke();
          }
        } else if (this.type === "triangle") {
          // Set square / drafting triangle
          ctx.beginPath();
          ctx.moveTo(0, -this.size / 2);
          ctx.lineTo(-this.size / 2, this.size / 2);
          ctx.lineTo(this.size / 2, this.size / 2);
          ctx.closePath();
          ctx.stroke();
          // Right angle marker
          const markSize = this.size / 8;
          ctx.strokeRect(-this.size / 2, this.size / 2 - markSize, markSize, -markSize);
        } else if (this.type === "protractor") {
          // Protractor (semi-circle)
          ctx.beginPath();
          ctx.arc(0, 0, this.size / 2, 0, Math.PI);
          ctx.stroke();
          // Degree marks
          for (let i = 0; i <= 180; i += 30) {
            const angle = (i * Math.PI) / 180;
            const x1 = Math.cos(angle) * (this.size / 2);
            const y1 = Math.sin(angle) * (this.size / 2);
            const x2 = Math.cos(angle) * (this.size / 2.5);
            const y2 = Math.sin(angle) * (this.size / 2.5);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        } else if (this.type === "pencil") {
          // Pencil shape
          const length = this.size;
          const width = this.size / 6;
          ctx.beginPath();
          ctx.moveTo(-length / 2, 0);
          ctx.lineTo(length / 3, -width / 2);
          ctx.lineTo(length / 3, width / 2);
          ctx.closePath();
          ctx.stroke();
          // Pencil tip
          ctx.beginPath();
          ctx.moveTo(length / 3, -width / 2);
          ctx.lineTo(length / 2, 0);
          ctx.lineTo(length / 3, width / 2);
          ctx.closePath();
          ctx.fill();
        } else if (this.type === "compass") {
          // Drawing compass
          ctx.beginPath();
          ctx.arc(0, -this.size / 3, this.size / 2, 0, Math.PI * 2);
          ctx.stroke();
          // Compass legs
          ctx.beginPath();
          ctx.moveTo(0, -this.size / 3);
          ctx.lineTo(-this.size / 6, this.size / 3);
          ctx.moveTo(0, -this.size / 3);
          ctx.lineTo(this.size / 6, this.size / 3);
          ctx.stroke();
        }
      }
    }

    class Wave {
      y: number;
      length: number;
      amplitude: number;
      frequency: number;
      color: string;
      opacity: number;

      constructor(startY: number) {
        this.y = startY;
        this.length = canvas.width;
        this.amplitude = Math.random() * 50 + 30;
        this.frequency = Math.random() * 0.008 + 0.004;
        this.color = [colors.yellow, colors.blue, colors.cyan, colors.lightBlue][
          Math.floor(Math.random() * 4)
        ];
        this.opacity = Math.random() * 0.2 + 0.15;
      }

      draw(offset: number) {
        if (!ctx) return;

        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;

        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2.5;
        ctx.globalAlpha = this.opacity;

        for (let x = 0; x < this.length; x += 2) {
          const y = this.y + Math.sin(x * this.frequency + offset) * this.amplitude;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }
    }

    const particleCount = variant === "intense" ? 100 : variant === "subtle" ? 30 : 60;
    const shapeCount = variant === "intense" ? 15 : variant === "subtle" ? 5 : 10;
    const waveCount = variant === "intense" ? 5 : variant === "subtle" ? 2 : 3;

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const shapes: DesignTool[] = [];
    for (let i = 0; i < shapeCount; i++) {
      shapes.push(new DesignTool());
    }

    const waves: Wave[] = [];
    for (let i = 0; i < waveCount; i++) {
      waves.push(new Wave((canvas.height / (waveCount + 1)) * (i + 1)));
    }

    let waveOffset = 0;

    function animate() {
      if (!ctx || !canvas || !isIntersecting) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      waveOffset += 0.03;
      waves.forEach((wave) => wave.draw(waveOffset));

      shapes.forEach((shape) => {
        shape.update();
        shape.draw();
      });

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    }

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

    return () => {
      window.removeEventListener("resize", handleResize);
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
