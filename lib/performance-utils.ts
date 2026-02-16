/**
 * Performance utility for detecting device capabilities and optimizing animations
 */

export type PerformanceTier = "high" | "medium" | "low";

export interface PerformanceConfig {
  tier: PerformanceTier;
  targetFPS: number;
  maxParticles: number;
  enableShadows: boolean;
  enableBlur: boolean;
  enableTrails: boolean;
  animationQuality: number; // 0-1 scale
}

class PerformanceManager {
  private static instance: PerformanceManager;
  private tier: PerformanceTier = "high";
  private frameTime: number = 16.67; // ~60fps
  private lastFrameTime: number = 0;
  private frameCount: number = 0;
  private fpsHistory: number[] = [];

  private constructor() {
    this.detectPerformanceTier();
  }

  static getInstance(): PerformanceManager {
    if (!PerformanceManager.instance) {
      PerformanceManager.instance = new PerformanceManager();
    }
    return PerformanceManager.instance;
  }

  private detectPerformanceTier(): void {
    if (typeof window === "undefined") {
      this.tier = "medium";
      return;
    }

    let score = 0;

    // Check CPU cores
    const cores = navigator.hardwareConcurrency || 4;
    score += cores >= 8 ? 3 : cores >= 4 ? 2 : 1;

    // Check memory (if available)
    const memory = (navigator as any).deviceMemory;
    if (memory) {
      score += memory >= 8 ? 3 : memory >= 4 ? 2 : 1;
    } else {
      score += 2; // default to medium
    }

    // Check screen size (mobile devices typically lower performance)
    const isMobile = window.innerWidth < 768;
    score += isMobile ? 0 : 2;

    // Check for touch (typically indicates mobile/tablet)
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    score += hasTouch ? 0 : 1;

    // Determine tier based on score
    if (score >= 8) {
      this.tier = "high";
    } else if (score >= 5) {
      this.tier = "medium";
    } else {
      this.tier = "low";
    }

    // Override for very small screens (always low)
    if (window.innerWidth < 480) {
      this.tier = "low";
    }
  }

  getConfig(): PerformanceConfig {
    const configs: Record<PerformanceTier, PerformanceConfig> = {
      high: {
        tier: "high",
        targetFPS: 60,
        maxParticles: 1,
        enableShadows: true,
        enableBlur: true,
        enableTrails: true,
        animationQuality: 1,
      },
      medium: {
        tier: "medium",
        targetFPS: 45,
        maxParticles: 0.6,
        enableShadows: true,
        enableBlur: false,
        enableTrails: true,
        animationQuality: 0.7,
      },
      low: {
        tier: "low",
        targetFPS: 30,
        maxParticles: 0.4,
        enableShadows: false,
        enableBlur: false,
        enableTrails: false,
        animationQuality: 0.5,
      },
    };

    return configs[this.tier];
  }

  getTier(): PerformanceTier {
    return this.tier;
  }

  // Frame throttling helper
  shouldRenderFrame(currentTime: number): boolean {
    const config = this.getConfig();
    const targetFrameTime = 1000 / config.targetFPS;

    if (currentTime - this.lastFrameTime >= targetFrameTime) {
      this.lastFrameTime = currentTime;
      return true;
    }
    return false;
  }

  // Track actual FPS and adjust if needed
  trackFrame(deltaTime: number): void {
    this.frameCount++;
    const fps = 1000 / deltaTime;
    this.fpsHistory.push(fps);

    // Keep only last 60 frames
    if (this.fpsHistory.length > 60) {
      this.fpsHistory.shift();
    }

    // Auto-downgrade if consistently low FPS
    if (this.frameCount % 60 === 0) {
      const avgFPS = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;

      if (avgFPS < 30 && this.tier === "high") {
        this.tier = "medium";
        console.log("Performance: Downgraded to medium tier");
      } else if (avgFPS < 20 && this.tier === "medium") {
        this.tier = "low";
        console.log("Performance: Downgraded to low tier");
      }
    }
  }
}

export const performanceManager = PerformanceManager.getInstance();

// Utility function to scale particle counts
export function scaleParticleCount(baseCount: number): number {
  const config = performanceManager.getConfig();
  return Math.floor(baseCount * config.maxParticles);
}

// Debounce utility for resize handlers
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
