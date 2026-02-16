"use client";

import { useScrollFrameAnimation } from "@/hooks/useScrollFrameAnimation";

const FRAME_COUNT = 153;
const SCROLL_MULTIPLIER = 6.5; // 6.5x viewport height for slightly slower, smoother scroll

export function ScrollAnimationHero() {
  const { canvasRef, containerRef, progress, isLoaded, loadedCount } =
    useScrollFrameAnimation({
      frameCount: FRAME_COUNT,
      framePathTemplate: (index) => {
        const frameNumber = String(index + 1).padStart(3, "0");
        return `/scroll_animation_frames/ezgif-frame-${frameNumber}.webp`;
      },
      scrollMultiplier: SCROLL_MULTIPLIER,
    });

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black"
      style={{
        height: `${SCROLL_MULTIPLIER * 100}vh`,
      }}
    >
      {/* Sticky/Pinned container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{
            willChange: "transform",
            transform: "translateZ(0)", // GPU acceleration
          }}
        />

        {/* Loading overlay */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
            <div className="text-white text-center space-y-3">
              <div className="relative w-64 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-white transition-all duration-300 ease-out"
                  style={{
                    width: `${(loadedCount / FRAME_COUNT) * 100}%`,
                  }}
                />
              </div>
              <p className="text-sm font-light tracking-wider opacity-75">
                {loadedCount}/{FRAME_COUNT} frames loaded
              </p>
            </div>
          </div>
        )}

        {/* Company Logo Overlay - Animates with scroll */}
        {isLoaded && (
          <>
            {/* Initial logo - fades out at the beginning */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
              <div
                className="text-center"
                style={{
                  opacity: Math.max(0, 1 - progress * 2),
                  transform: `scale(${1 + progress * 0.3})`,
                  transition: 'opacity 0.1s ease-out, transform 0.1s ease-out',
                }}
              >
                {/* Main Logo - LAVINE in pure black (monochrome) with shadows */}
                <h1
                  className="relative leading-none"
                  style={{
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    fontWeight: '700',
                    fontSize: 'clamp(4rem, 14vw, 10rem)',
                    letterSpacing: '0.05em',
                    color: '#000000',
                    textShadow: `
                      0 4px 12px rgba(0, 0, 0, 0.4),
                      0 8px 24px rgba(0, 0, 0, 0.3),
                      0 2px 4px rgba(0, 0, 0, 0.5)
                    `,
                  }}
                >
                  LAVINE

                  {/* Simple underline accent in black */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-10px',
                      left: '0',
                      right: '0',
                      height: '3px',
                      background: '#000000',
                      opacity: 0.8,
                    }}
                  />
                </h1>

                {/* Subtitle - Design Studio in black with shadow */}
                <p
                  style={{
                    fontFamily: '"Trebuchet MS", "Lucida Grande", sans-serif',
                    fontSize: 'clamp(0.9rem, 2.5vw, 1.8rem)',
                    fontWeight: '400',
                    letterSpacing: '0.35em',
                    color: '#000000',
                    marginTop: 'clamp(1.5rem, 3vw, 2.5rem)',
                    textTransform: 'uppercase',
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                    opacity: 0.9,
                  }}
                >
                  Design Studio
                </p>

                {/* Decorative accent elements in black */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '20px',
                    marginTop: 'clamp(1.5rem, 3vw, 2.5rem)',
                  }}
                >
                  <div
                    style={{
                      width: '60px',
                      height: '1px',
                      background: 'linear-gradient(90deg, transparent, #000000)',
                      opacity: 0.6,
                    }}
                  />
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#000000',
                      opacity: 0.8,
                    }}
                  />
                  <div
                    style={{
                      width: '60px',
                      height: '1px',
                      background: 'linear-gradient(90deg, #000000, transparent)',
                      opacity: 0.6,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Final logo - appears at the end with white borders and effects */}
            <>
              {/* Subtle background haze/blur */}
              <div
                className="absolute inset-0 pointer-events-none z-29"
                style={{
                  // Synced with logo visibility timing - stays longer
                  opacity: progress < 0.75 ? 0 : progress > 0.95 ? Math.max(0, 0.6 - (progress - 0.95) * 6) : 0.6,
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                  transition: 'opacity 0.3s ease-out',
                }}
              />

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                <div
                  className="text-center relative"
                  style={{
                    // Appears at 75% and stays visible much longer, only fading after 95%
                    opacity: progress < 0.75 ? 0 : progress > 0.95 ? Math.max(0, 1 - (progress - 0.95) * 10) : 1,
                    transform: `scale(${progress < 0.75 ? 0.9 : Math.min(1, 0.9 + (progress - 0.75) * 0.4)})`,
                    transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
                    padding: 'clamp(3rem, 8vw, 6rem) clamp(4rem, 12vw, 9rem)',
                    border: '3px solid rgba(255, 255, 255, 0.95)',
                    borderRadius: '12px',
                    background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.03) 0%, transparent 70%)',
                    boxShadow: `
                      0 0 60px rgba(255, 255, 255, 0.4),
                      inset 0 0 60px rgba(255, 255, 255, 0.08),
                      0 8px 32px rgba(0, 0, 0, 0.1)
                    `,
                  }}
                >
                  {/* Border sparkle perpetually traversing the rectangular path */}
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      animation: 'border-trace-continuous 6s linear infinite',
                      width: '6px',
                      height: '6px',
                    }}
                  >
                    <div
                      className="w-full h-full rounded-full"
                      style={{
                        background: 'radial-gradient(circle, rgba(255, 237, 0, 1) 0%, rgba(255, 237, 0, 0) 70%)',
                        boxShadow: '0 0 30px 8px rgba(255, 237, 0, 1), 0 0 60px 16px rgba(255, 237, 0, 0.6), 0 0 90px 24px rgba(255, 237, 0, 0.3)',
                        filter: 'blur(0.5px)',
                      }}
                    />
                  </div>

                  {/* Main Logo - LAVINE with elegant serif font and shadows */}
                  <h1
                    className="relative leading-none"
                    style={{
                      fontFamily: 'Georgia, "Times New Roman", serif',
                      fontWeight: '700',
                      fontSize: 'clamp(5rem, 18vw, 14rem)',
                      letterSpacing: '0.05em',
                    }}
                  >
                    <span
                      className="relative inline-block"
                      style={{
                        background: 'linear-gradient(90deg, #FFED00 0%, #FFED00 40%, #0075FF 60%, #0075FF 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        filter: `
                          drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4))
                          drop-shadow(0 8px 24px rgba(0, 0, 0, 0.3))
                          drop-shadow(0 0 40px rgba(255, 237, 0, 0.3))
                        `,
                      }}
                    >
                      LAVINE

                      {/* Traversing shimmer effect */}
                      <span
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: 'linear-gradient(90deg, transparent 0%, transparent 40%, rgba(255, 255, 255, 0.7) 50%, transparent 60%, transparent 100%)',
                          backgroundSize: '200% 100%',
                          animation: 'shimmer 4s linear infinite',
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          mixBlendMode: 'overlay',
                        }}
                      />
                    </span>

                    {/* Elegant underline */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '-8px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '85%',
                        height: '2px',
                        background: 'linear-gradient(90deg, transparent, #FFED00 30%, #0075FF 70%, transparent)',
                        boxShadow: '0 0 15px rgba(255, 237, 0, 0.4)',
                        animation: 'glow-pulse 3s ease-in-out infinite',
                      }}
                    />
                  </h1>

                  {/* Subtitle - Design Studio with maximum legibility */}
                  <p
                    style={{
                      fontFamily: '"Trebuchet MS", "Lucida Grande", sans-serif',
                      fontSize: 'clamp(0.9rem, 2.5vw, 1.8rem)',
                      fontWeight: '700',
                      letterSpacing: '0.4em',
                      color: '#FFFFFF',
                      marginTop: 'clamp(1.5rem, 3vw, 2.5rem)',
                      textTransform: 'uppercase',
                      textShadow: `
                        2px 2px 4px rgba(0, 0, 0, 0.8),
                        -1px -1px 2px rgba(0, 0, 0, 0.8),
                        1px -1px 2px rgba(0, 0, 0, 0.8),
                        -1px 1px 2px rgba(0, 0, 0, 0.8),
                        0 0 20px rgba(255, 255, 255, 0.5)
                      `,
                    }}
                  >
                    Design Studio
                  </p>

                  {/* Decorative accent elements */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'clamp(15px, 3vw, 25px)',
                      marginTop: 'clamp(1.5rem, 3vw, 2.5rem)',
                    }}
                  >
                    <div
                      style={{
                        width: 'clamp(50px, 10vw, 80px)',
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, #FFED00)',
                        boxShadow: '0 0 10px rgba(255, 237, 0, 0.4)',
                      }}
                    />
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#FFED00',
                        boxShadow: '0 0 15px rgba(255, 237, 0, 0.8)',
                        animation: 'pulse-dot 2s ease-in-out infinite',
                      }}
                    />
                    <div
                      style={{
                        width: 'clamp(50px, 10vw, 80px)',
                        height: '1px',
                        background: 'linear-gradient(90deg, #0075FF, transparent)',
                        boxShadow: '0 0 10px rgba(0, 117, 255, 0.4)',
                      }}
                    />
                  </div>
                </div>
              </div>
            </>
          </>
        )}

        {/* Optional: Progress indicator (hidden in production) */}
        {isLoaded && process.env.NODE_ENV === "development" && (
          <div className="absolute bottom-4 left-4 text-white/50 text-xs font-mono z-20">
            Progress: {Math.round(progress * 100)}%
          </div>
        )}
      </div>
    </div>
  );
}
