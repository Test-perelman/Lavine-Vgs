"use client";

import { useEffect, useRef, useCallback } from "react";

// ── Brand Color Uniforms ───────────────────────────────────────────────────────
// Exact values derived from globals.css / Achilles gradient tokens.
// These are the ONLY colours this shader will ever produce — no random hues.
const YELLOW: [number, number, number] = [1.0,  0.929, 0.0];   // #FFED00  Solar Yellow
const BLUE:   [number, number, number] = [0.0,  0.459, 1.0];   // #0075FF  Sapphire Blue

// ── GLSL Source ───────────────────────────────────────────────────────────────

const VERT = /* glsl */`
  attribute vec4 aPosition;
  varying   vec2 vUv;
  void main() {
    vUv         = aPosition.xy * 0.5 + 0.5;
    gl_Position = aPosition;
  }
`;

/**
 * Fragment shader design notes:
 *
 * Four sine-wave layers travel at different speeds and directions.
 * Slower layers receive higher blend weight, giving the motion a
 * serene, almost breath-like quality rather than a gaming shimmer.
 *
 * A slight diagonal bias (uv.x dominant) mirrors the existing CSS
 * gradient-rake animation direction so both effects move in harmony.
 *
 * smoothstep() softens the midpoint transition so the yellow ↔ blue
 * crossover has no harsh edge — the brand colours melt into each other.
 *
 * No noise, no random hashes, no extra hue channels. Pure sine geometry.
 */
const FRAG = /* glsl */`
  precision mediump float;

  uniform float uTime;
  uniform vec3  uColorA;   // #FFED00 — Solar Yellow
  uniform vec3  uColorB;   // #0075FF — Sapphire Blue
  uniform float uOpacity;

  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;

    // Layer 1 — primary diagonal flow  (slow, majestic)
    float l1 = sin(uv.x * 1.80 + uTime * 0.26 + uv.y * 0.80) * 0.5 + 0.5;

    // Layer 2 — cross-current          (slightly slower, depth)
    float l2 = sin(uv.y * 2.20 - uTime * 0.19 + uv.x * 1.40) * 0.5 + 0.5;

    // Layer 3 — diagonal shimmer       (faster, surface texture)
    float l3 = sin((uv.x + uv.y) * 1.50 + uTime * 0.36) * 0.5 + 0.5;

    // Layer 4 — global breath pulse    (very slow, unified luminosity)
    float l4 = sin(uTime * 0.11) * 0.5 + 0.5;

    // Weighted sum — slower layers dominate for serenity
    float blend = l1 * 0.40 + l2 * 0.32 + l3 * 0.18 + l4 * 0.10;

    // Diagonal bias aligned with gradient-rake (left→right, slight vertical)
    float bias = uv.x * 0.65 + (1.0 - uv.y) * 0.35;
    blend = mix(blend, bias, 0.14);

    // Silky transition — no harsh midpoint edge
    blend = smoothstep(0.14, 0.86, blend);

    // Brand-colour interpolation — yellow ↔ blue only
    vec3 color = mix(uColorA, uColorB, blend);

    gl_FragColor = vec4(color, uOpacity);
  }
`;

// ── WebGL Helpers ─────────────────────────────────────────────────────────────

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  src: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[LogoShader] compile:", gl.getShaderInfoLog(shader));
    }
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function linkProgram(
  gl: WebGLRenderingContext,
  vs: WebGLShader,
  fs: WebGLShader
): WebGLProgram | null {
  const prog = gl.createProgram();
  if (!prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[LogoShader] link:", gl.getProgramInfoLog(prog));
    }
    gl.deleteProgram(prog);
    return null;
  }
  return prog;
}

// ── Component ─────────────────────────────────────────────────────────────────

export interface LogoShaderProps {
  /**
   * 0 → 1, driven by scroll progress.
   * - 0   = shader invisible (final logo not yet revealed)
   * - 0–1 = fades in as the logo scales into place
   * - 1   = full effect active
   *
   * The internal opacity cap (× 0.42) ensures the screen-blend stays
   * elegant and never overwhelms the existing CSS gradient text.
   */
  fadeProgress: number;
}

export function LogoShader({ fadeProgress }: LogoShaderProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const glRef      = useRef<WebGLRenderingContext | null>(null);
  const progRef    = useRef<WebGLProgram | null>(null);
  const rafRef     = useRef<number>(0);
  const t0Ref      = useRef<number>(0);
  const visibleRef = useRef(false);

  // Keep fade value in a ref so the RAF callback is never stale without
  // needing to be recreated (avoids RAF chain breaks on every scroll tick).
  const fadeRef = useRef(fadeProgress);
  useEffect(() => { fadeRef.current = fadeProgress; }, [fadeProgress]);

  // Cached WebGL uniform locations — fetched once at init, read every frame.
  const uTimeRef    = useRef<WebGLUniformLocation | null>(null);
  const uOpacityRef = useRef<WebGLUniformLocation | null>(null);

  // ── Render loop ───────────────────────────────────────────────────────────
  const render = useCallback((ts: number) => {
    rafRef.current = requestAnimationFrame(render);

    const gl     = glRef.current;
    const prog   = progRef.current;
    const canvas = canvasRef.current;
    const fade   = fadeRef.current;

    // Skip work when off-screen or logo not yet revealed — preserves battery.
    if (!gl || !prog || !canvas || !visibleRef.current || fade <= 0) return;

    const elapsed = (ts - t0Ref.current) * 0.001;

    // ── Screen-blend intensity cap ─────────────────────────────────────────
    // 42 % max: bright enough to feel alive, restrained enough to stay luxurious.
    const opacity = fade * 0.42;

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(prog);
    gl.uniform1f(uTimeRef.current!,    elapsed);
    gl.uniform1f(uOpacityRef.current!, opacity);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }, []);

  // ── WebGL init + cleanup ──────────────────────────────────────────────────
  useEffect(() => {
    // Respect user's reduced-motion preference — existing CSS animations remain.
    if (typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Size canvas to its CSS box (no DPR upscaling — shader is low-frequency) ──
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      canvas.width  = Math.max(1, Math.round(width));
      canvas.height = Math.max(1, Math.round(height));
    });
    ro.observe(canvas);

    // ── WebGL context ─────────────────────────────────────────────────────
    const gl = canvas.getContext("webgl", {
      alpha:              true,   // Transparent canvas — critical for blend mode
      premultipliedAlpha: false,  // Straight alpha for correct compositing
      antialias:          false,  // Shader is smooth; AA unnecessary
      powerPreference:    "low-power", // GPU-conservative
    }) as WebGLRenderingContext | null;

    // Graceful degradation: if WebGL unavailable, existing CSS animations hold.
    if (!gl) return;
    glRef.current = gl;

    // ── Compile & link ────────────────────────────────────────────────────
    const vs = compileShader(gl, gl.VERTEX_SHADER,   VERT);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = linkProgram(gl, vs, fs);
    if (!prog) return;
    progRef.current = prog;

    // ── Full-screen quad geometry (two triangles via TRIANGLE_STRIP) ──────
    const buf = gl.createBuffer();
    if (!buf) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1,  1, -1,  -1,  1,  1,  1]),
      gl.STATIC_DRAW
    );
    const posLoc = gl.getAttribLocation(prog, "aPosition");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // ── Static brand-colour uniforms (never change at runtime) ────────────
    gl.useProgram(prog);
    gl.uniform3fv(gl.getUniformLocation(prog, "uColorA"), YELLOW);
    gl.uniform3fv(gl.getUniformLocation(prog, "uColorB"), BLUE);

    // ── Cache dynamic uniform locations for zero-allocation render loop ───
    uTimeRef.current    = gl.getUniformLocation(prog, "uTime");
    uOpacityRef.current = gl.getUniformLocation(prog, "uOpacity");

    // ── Correct alpha blending ────────────────────────────────────────────
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // ── Pause rendering when canvas leaves the viewport ───────────────────
    const io = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting; },
      { threshold: 0.05 }
    );
    io.observe(canvas);

    // ── Start render loop ─────────────────────────────────────────────────
    t0Ref.current  = performance.now();
    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      io.disconnect();
      ro.disconnect();
      // Full GPU resource cleanup — no memory leaks on unmount.
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
      glRef.current  = null;
      progRef.current = null;
    };
  }, [render]);

  // The canvas sits absolute-inset within the lettermark container.
  // mix-blend-mode: screen makes the shader's dark regions invisible —
  // only the bright yellow/blue energy shows, adding luminous depth to
  // the existing gradient text without replacing or obscuring it.
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position:      "absolute",
        inset:         0,
        width:         "100%",
        height:        "100%",
        pointerEvents: "none",
        mixBlendMode:  "screen",
        display:       "block",
        zIndex:        2,
      }}
    />
  );
}
