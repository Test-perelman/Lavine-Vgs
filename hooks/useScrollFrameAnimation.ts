import { useEffect, useRef, useState, useCallback } from 'react';

interface ScrollFrameAnimationOptions {
  frameCount: number;
  framePathTemplate: (index: number) => string;
  scrollMultiplier?: number; // How much scroll space (in vh)
}

interface ScrollFrameAnimationReturn {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  progress: number;
  isLoaded: boolean;
  loadedCount: number;
}

export function useScrollFrameAnimation({
  frameCount,
  framePathTemplate,
  scrollMultiplier = 5,
}: ScrollFrameAnimationOptions): ScrollFrameAnimationReturn {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  // Animation state
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const animationFrameIdRef = useRef<number | undefined>(undefined);
  const [progress, setProgress] = useState(0);

  // Preload all frames
  useEffect(() => {
    const frames: HTMLImageElement[] = [];
    let loaded = 0;

    const onLoad = () => {
      loaded++;
      setLoadedCount(loaded);
      if (loaded === frameCount) {
        setIsLoaded(true);
      }
    };

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();

      // Optimize image loading for quality
      img.decoding = 'sync'; // Synchronous decode for smoother rendering
      img.loading = 'eager'; // Load immediately

      img.onload = onLoad;
      img.onerror = () => {
        console.error(`Failed to load frame ${i}`);
        onLoad();
      };
      img.src = framePathTemplate(i);
      frames.push(img);
    }

    framesRef.current = frames;

    return () => {
      frames.forEach(img => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [frameCount, framePathTemplate]);

  // Render frame to canvas
  const renderFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', {
      alpha: false,
      desynchronized: true, // GPU optimization
      willReadFrequently: false,
    });

    if (!canvas || !ctx) return;

    const frame = framesRef.current[frameIndex];
    if (!frame || !frame.complete || frame.naturalHeight === 0) return;

    // Enable high-quality image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Get actual display dimensions (accounting for DPR)
    const displayWidth = canvas.width / (window.devicePixelRatio || 1);
    const displayHeight = canvas.height / (window.devicePixelRatio || 1);

    // Clear canvas before drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate contain positioning (like CSS object-fit: contain)
    // This prevents upscaling and shows the full image
    const canvasAspect = displayWidth / displayHeight;
    const imageAspect = frame.naturalWidth / frame.naturalHeight;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (imageAspect > canvasAspect) {
      // Image is wider - fit to width
      drawWidth = canvas.width;
      drawHeight = canvas.width / imageAspect;
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      // Image is taller - fit to height
      drawHeight = canvas.height;
      drawWidth = canvas.height * imageAspect;
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = 0;
    }

    // Draw with high quality - full image, no cropping, centered
    ctx.drawImage(
      frame,
      0, 0, frame.naturalWidth, frame.naturalHeight,
      offsetX, offsetY, drawWidth, drawHeight
    );
  }, []);

  // Smooth animation loop with lerp
  useEffect(() => {
    if (!isLoaded) return;

    let ticking = false;

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const animate = () => {
      // Smooth interpolation (lerp) for buttery smooth animation
      currentFrameRef.current = lerp(
        currentFrameRef.current,
        targetFrameRef.current,
        0.1 // Adjust for smoothness (0.1 = smooth, 0.5 = snappy)
      );

      const roundedFrame = Math.round(currentFrameRef.current);
      renderFrame(roundedFrame);

      // Continue animating if not at target
      if (Math.abs(currentFrameRef.current - targetFrameRef.current) > 0.01) {
        animationFrameIdRef.current = requestAnimationFrame(animate);
      } else {
        ticking = false;
      }
    };

    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const scrollHeight = container.offsetHeight - window.innerHeight;

      // Calculate scroll progress within this section
      let scrollProgress = 0;

      if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
        // Section is pinned
        scrollProgress = Math.abs(rect.top) / scrollHeight;
      } else if (rect.top > 0) {
        // Before section
        scrollProgress = 0;
      } else {
        // After section
        scrollProgress = 1;
      }

      scrollProgress = Math.max(0, Math.min(1, scrollProgress));
      setProgress(scrollProgress);

      // Map progress to frame index
      targetFrameRef.current = scrollProgress * (frameCount - 1);

      // Start animation loop if not already running
      if (!ticking) {
        ticking = true;
        animationFrameIdRef.current = requestAnimationFrame(animate);
      }
    };

    // Resize handler
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Use full device pixel ratio for sharpest quality (no limiting)
      const dpr = window.devicePixelRatio || 1;

      // Set actual canvas size (higher resolution)
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      // Set display size (CSS pixels)
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      // Get context and ensure high quality settings
      const ctx = canvas.getContext('2d', {
        alpha: false,
        desynchronized: true,
      });

      if (ctx) {
        // Scale context to match device pixel ratio
        ctx.scale(dpr, dpr);

        // Enable high-quality image smoothing after resize
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
      }

      renderFrame(Math.round(currentFrameRef.current));
    };

    handleResize();
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [isLoaded, renderFrame, frameCount]);

  return {
    canvasRef,
    containerRef,
    progress,
    isLoaded,
    loadedCount,
  };
}
