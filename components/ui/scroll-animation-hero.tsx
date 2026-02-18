"use client";

import { useScrollFrameAnimation } from "@/hooks/useScrollFrameAnimation";
import { LogoShader } from "@/components/ui/logo-shader";

const FRAME_COUNT = 153;
const SCROLL_MULTIPLIER = 6.5; // 6.5x viewport height for slightly slower, smoother scroll

// ═══════════════════════════════════════════════════════════════════════════════
// LAVINE DESIGN STUDIO — Logo Identity System
//
// Three distinct concepts are implemented and documented below.
//
//  Active role assignments:
//    • Initial hero state  →  LogoMeridian   (Concept 2)
//    • Final framed state  →  LogoAchilles   (Concept 1)  ← swap to LogoObsidian for Concept 3
//
// To activate Concept 3, replace <LogoAchilles /> in the final logo block with
// <LogoObsidian />.
// ═══════════════════════════════════════════════════════════════════════════════


// ───────────────────────────────────────────────────────────────────────────────
// CONCEPT 2  ·  "MERIDIAN"  ·  Architectural Monoline
// ───────────────────────────────────────────────────────────────────────────────
//
// DESIGN PHILOSOPHY
// Each letter is rendered as a single-weight architectural stroke — evoking the
// precision of technical drawing, interior floor-plan annotation, and the clean
// language of the drafting table. The open-crown "A" is a deliberate arch motif
// (referencing doorways and room openings). The generous "V" embodies spatial
// openness. The serifed "I" reads as a structural column. The "N"'s sharp single
// diagonal communicates movement and transformation. "E"'s shortened middle arm
// introduces asymmetric tension — a mark of sophisticated editorial restraint.
//
// WHY IT WORKS FOR A LUXURY INTERIOR BRAND
// The finest interior design firms communicate precision before ornament. This
// logo speaks the same language as an architect's ink drawing — authoritative,
// resolved, impossible to mistake for amateur work. The yellow→white→blue
// gradient along the strokes suggests sunlight crossing a room.
//
// ROLE IN THE SCROLL SYSTEM
// This is the ghost that inhabits the initial hero frame. It materialises from
// atmospheric blur as the page loads, then dissolves gracefully into the scene
// as the user begins to scroll. It creates curiosity before the reveal.
// ───────────────────────────────────────────────────────────────────────────────
function LogoMeridian() {
  return (
    <div style={{ position: "relative", textAlign: "center" }}>
      <svg
        viewBox="0 0 540 148"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="LAVINE"
        style={{
          width: "clamp(260px, 52vw, 620px)",
          height: "auto",
          overflow: "visible",
          display: "block",
          margin: "0 auto",
        }}
      >
        <defs>
          {/* Solar yellow → pure white → sapphire blue — light crossing a room */}
          <linearGradient id="m-grad" x1="0%" y1="0%" x2="100%" y2="20%">
            <stop offset="0%"   stopColor="#FFED00" />
            <stop offset="42%"  stopColor="rgba(255,255,255,0.95)" />
            <stop offset="100%" stopColor="#0075FF" />
          </linearGradient>

          {/* Soft atmospheric glow behind each stroke */}
          <filter id="m-glow" x="-8%" y="-8%" width="116%" height="116%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/*
          Letterform paths — architectural simplified sans:
          · L  — structural pillar + ground rule foot
          · A  — open-crown arch (no apex cap)
          · V  — generous spatial opening
          · I  — serifed column (top + bottom cross-bars)
          · N  — single sharp diagonal (movement / tension)
          · E  — shortened middle arm (asymmetric elegance)
        */}
        <g
          fill="none"
          stroke="url(#m-grad)"
          strokeWidth="4.5"
          strokeLinecap="square"
          strokeLinejoin="miter"
          filter="url(#m-glow)"
          style={{ animation: "meridian-reveal 1.8s cubic-bezier(0.4, 0, 0.2, 1) both" }}
        >
          {/* ── L ── */}
          <polyline points="15,14 15,134 82,134" />

          {/* ── A  (open crown — arch motif) ── */}
          <line x1="100" y1="134" x2="140" y2="22" />
          <line x1="180" y1="134" x2="140" y2="22" />
          <line x1="114" y1="96"  x2="166" y2="96" />

          {/* ── V ── */}
          <line x1="198" y1="14"  x2="240" y2="134" />
          <line x1="282" y1="14"  x2="240" y2="134" />

          {/* ── I  (serifed column) ── */}
          <line x1="299" y1="14"  x2="321" y2="14"  />
          <line x1="310" y1="14"  x2="310" y2="134" />
          <line x1="299" y1="134" x2="321" y2="134" />

          {/* ── N ── */}
          <polyline points="337,134 337,14 419,134 419,14" />

          {/* ── E  (shortened middle arm) ── */}
          <polyline points="500,14 438,14 438,134 500,134" />
          <line x1="438" y1="74" x2="484" y2="74" />
        </g>
      </svg>

      {/* Subtitle — drifts up into place */}
      <p
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
          fontSize: "clamp(0.75rem, 2vw, 1.15rem)",
          fontWeight: 300,
          letterSpacing: "0.52em",
          color: "rgba(255,255,255,0.88)",
          textTransform: "uppercase",
          marginTop: "clamp(1rem, 2.5vw, 1.8rem)",
          textShadow: "0 2px 14px rgba(0,0,0,0.65)",
          animation: "meridian-sub-fade 2s 0.9s ease-out both",
        }}
      >
        Design Studio
      </p>
    </div>
  );
}


// ───────────────────────────────────────────────────────────────────────────────
// CONCEPT 1  ·  "ACHILLES"  ·  High-Contrast Architectural Serif
// ───────────────────────────────────────────────────────────────────────────────
//
// DESIGN PHILOSOPHY
// Cormorant Garamond possesses the most extreme stroke-modulation of any digital
// typeface — hairline horizontal strokes vs. structural vertical stems. This
// inherent architecture of thick-vs-thin mirrors the classical column: narrow
// capital and wide shaft. The italic weight adds kinetic confidence, a lean that
// communicates artistic momentum. The diagonal gradient from solar yellow (#FFED00)
// through warm gold (#FFC200) to sky blue (#87CEEB) and sapphire (#0075FF)
// recreates the precise quality of late-afternoon light raking across a polished
// stone surface — the defining visual moment of luxury interior photography.
// Double architectural rules (thin-over-thick above, thick-over-thin below) are
// borrowed from classical book typography and signal editorial authority.
//
// WHY IT WORKS FOR A LUXURY INTERIOR BRAND
// Cormorant is used by Chanel, Bottega Veneta, and multiple luxury real estate
// brands for its ability to communicate heritage while feeling modern. The
// flowing shimmer gradient animation adds temporal depth — the logo literally
// feels alive with changing light, mimicking the way a well-designed room
// transforms throughout the day.
//
// ROLE IN THE SCROLL SYSTEM
// This is the final reveal — the logo that earns its place inside the cinematic
// white-border frame. It appears at 80% scroll progress and fills the frame with
// authority. This is the brand mark.
// ───────────────────────────────────────────────────────────────────────────────
function LogoAchilles({ shaderProgress = 0, blackProgress = 0 }: { shaderProgress?: number; blackProgress?: number }) {
  const lerp = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);
  const toBlack = (r: number, g: number, b: number) =>
    `rgb(${lerp(r, 0, blackProgress)},${lerp(g, 0, blackProgress)},${lerp(b, 0, blackProgress)})`;

  const mainGradient = `linear-gradient(90deg,
    ${toBlack(255, 237, 0)}   0%,
    ${toBlack(255, 215, 0)}  16%,
    ${toBlack(255, 168, 0)}  30%,
    ${toBlack(255, 140, 0)}  40%,
    ${toBlack(0, 170, 255)}  54%,
    ${toBlack(0, 117, 255)}  70%,
    ${toBlack(0,  64, 204)} 100%
  )`;

  const subtitleR = lerp(255, 0, blackProgress);
  const subtitleColor = `rgb(${subtitleR},${subtitleR},${subtitleR})`;

  // Fade shader out as text transitions to black (screen-blend would re-colour black text)
  const effectiveShaderProgress = shaderProgress * (1 - blackProgress);
  return (
    <div style={{ position: "relative", display: "inline-block", textAlign: "center" }}>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* CREST ORNAMENT — delicate architectural crown above LAVINE */}
      {/* ══════════════════════════════════════════════════════════ */}
      <svg
        viewBox="0 0 280 52"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "clamp(180px, 38vw, 320px)", display: "block", margin: "0 auto 6px" }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="crest-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"    stopColor="transparent" />
            <stop offset="18%"   stopColor="rgba(255,237,0,0.80)" />
            <stop offset="50%"   stopColor="rgba(255,255,255,0.65)" />
            <stop offset="82%"   stopColor="rgba(0,117,255,0.80)" />
            <stop offset="100%"  stopColor="transparent" />
          </linearGradient>
          <linearGradient id="crest-left" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,237,0,0.85)" />
            <stop offset="100%" stopColor="rgba(255,237,0,0.20)" />
          </linearGradient>
          <linearGradient id="crest-right" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.60)" />
            <stop offset="100%" stopColor="rgba(0,117,255,0.85)" />
          </linearGradient>
        </defs>

        {/* Base horizontal rule */}
        <line x1="0" y1="38" x2="280" y2="38" stroke="url(#crest-grad)" strokeWidth="0.8" />

        {/* Left ascending arm */}
        <line x1="140" y1="31" x2="106" y2="6"  stroke="url(#crest-left)"  strokeWidth="1.0" />
        {/* Right ascending arm */}
        <line x1="140" y1="31" x2="174" y2="6"  stroke="url(#crest-right)" strokeWidth="1.0" />

        {/* Left secondary arm — longer, shallower */}
        <line x1="140" y1="31" x2="72"  y2="14" stroke="rgba(255,237,0,0.35)"  strokeWidth="0.65" />
        {/* Right secondary arm */}
        <line x1="140" y1="31" x2="208" y2="14" stroke="rgba(0,117,255,0.35)"  strokeWidth="0.65" />

        {/* Apex dot — catches the eye at the crown peak */}
        <circle cx="140" cy="4" r="2.2" fill="rgba(255,237,0,0.0)" />
        {/* Apex diamond */}
        <rect
          x="136.5" y="0.5" width="7" height="7"
          fill="rgba(255,237,0,0.95)"
          transform="rotate(45 140 4)"
          style={{ filter: "drop-shadow(0 0 6px rgba(255,237,0,0.9))" }}
        />

        {/* Left accent tick */}
        <line x1="72"  y1="32" x2="72"  y2="44" stroke="rgba(255,237,0,0.50)" strokeWidth="0.8" />
        {/* Right accent tick */}
        <line x1="208" y1="32" x2="208" y2="44" stroke="rgba(0,117,255,0.50)" strokeWidth="0.8" />

        {/* Fine dot cluster — left */}
        <circle cx="49"  cy="38" r="1.2" fill="rgba(255,237,0,0.55)" />
        <circle cx="57"  cy="38" r="0.8" fill="rgba(255,237,0,0.35)" />
        {/* Fine dot cluster — right */}
        <circle cx="231" cy="38" r="1.2" fill="rgba(0,117,255,0.55)" />
        <circle cx="223" cy="38" r="0.8" fill="rgba(0,117,255,0.35)" />
      </svg>

      {/* ── Architectural rule header (thin / thick) ── */}
      <svg
        viewBox="0 0 520 20"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", display: "block", marginBottom: "-2px" }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="a-rule-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="transparent" />
            <stop offset="12%"  stopColor="rgba(255,237,0,0.80)" />
            <stop offset="50%"  stopColor="rgba(255,255,255,0.55)" />
            <stop offset="88%"  stopColor="rgba(0,117,255,0.80)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <line x1="0" y1="5"  x2="520" y2="5"  stroke="url(#a-rule-grad)" strokeWidth="0.75" />
        <line x1="0" y1="12" x2="520" y2="12" stroke="url(#a-rule-grad)" strokeWidth="2.25" />
      </svg>

      {/* ── Main lettermark ── */}
      {/*
        isolation: "isolate" creates a new compositing group so that the
        LogoShader canvas (mix-blend-mode: screen) blends ONLY with the
        glow blobs and the h1 text inside this div — not with the cinematic
        frame, the crest, the rules, or the subtitle outside it.
      */}
      <div style={{ position: "relative", lineHeight: 1, isolation: "isolate" }}>

        {/* Warm glow bloom — left */}
        <div aria-hidden="true" style={{ position: "absolute", top: "50%", left: "28%", transform: "translate(-50%,-50%)", width: "50%", height: "85%", background: "radial-gradient(ellipse, rgba(255,210,0,0.22) 0%, transparent 68%)", filter: "blur(34px)", pointerEvents: "none" }} />
        {/* Cool glow bloom — right */}
        <div aria-hidden="true" style={{ position: "absolute", top: "50%", left: "72%", transform: "translate(-50%,-50%)", width: "50%", height: "85%", background: "radial-gradient(ellipse, rgba(0,117,255,0.20) 0%, transparent 68%)", filter: "blur(34px)", pointerEvents: "none" }} />

        <h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
            fontWeight: 600,
            fontStyle: "italic",
            fontSize: "clamp(5rem, 18vw, 14rem)",
            letterSpacing: "-0.01em",
            lineHeight: 0.88,
            margin: 0,
            padding: 0,
            background: mainGradient,
            backgroundSize: "280% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: blackProgress > 0 ? "none" : "gradient-rake 6s linear infinite, achilles-glow-breath 5s ease-in-out infinite",
            position: "relative",
            zIndex: 1,
          }}
        >
          LAVINE
        </h1>

        {/*
          LogoShader — animated yellow ↔ blue WebGL gradient energy.
          Activates only when the final logo is revealed (shaderProgress > 0).
          mix-blend-mode: screen (set in the component) makes dark shader areas
          invisible, so only the luminous gradient waves show through — creating
          the effect of animated light flowing through the letterforms.
          z-index: 2 (set in the component) places it above the h1 (z-index: 1).
        */}
        <LogoShader fadeProgress={effectiveShaderProgress} />
      </div>

      {/* ── Architectural rule footer (thick / thin) ── */}
      <svg
        viewBox="0 0 520 20"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", display: "block", marginTop: "2px" }}
        aria-hidden="true"
      >
        <line x1="0" y1="7"  x2="520" y2="7"  stroke="url(#a-rule-grad)" strokeWidth="2.25" />
        <line x1="0" y1="14" x2="520" y2="14" stroke="url(#a-rule-grad)" strokeWidth="0.75" />
      </svg>

      {/* ── Subtitle ── */}
      <p
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
          fontSize: "clamp(0.85rem, 2.2vw, 1.4rem)",
          fontWeight: 300,
          fontStyle: "normal",
          letterSpacing: "0.62em",
          color: subtitleColor,
          marginTop: "clamp(1rem, 2.5vw, 1.8rem)",
          textTransform: "uppercase",
          textShadow: blackProgress > 0 ? "none" : `
            2px 2px 6px rgba(0,0,0,0.85),
            -1px -1px 2px rgba(0,0,0,0.85),
            0 0 28px rgba(255,255,255,0.40)
          `,
        }}
      >
        Design Studio
      </p>

      {/* ── Diamond accent rule ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "clamp(12px, 2.5vw, 22px)",
          marginTop: "clamp(1rem, 2.5vw, 1.8rem)",
        }}
      >
        <div style={{ width: "clamp(45px, 9vw, 75px)", height: "1px", background: "linear-gradient(90deg, transparent, #FFED00)", boxShadow: "0 0 12px rgba(255,237,0,0.55)" }} />
        <svg width="9" height="9" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="0" y="0" width="9" height="9" fill="#FFED00" transform="rotate(45 4.5 4.5)"
            style={{ filter: "drop-shadow(0 0 8px rgba(255,237,0,0.95))", animation: "pulse-dot 2.5s ease-in-out infinite" }} />
        </svg>
        <div style={{ width: "clamp(45px, 9vw, 75px)", height: "1px", background: "linear-gradient(90deg, #0075FF, transparent)", boxShadow: "0 0 12px rgba(0,117,255,0.55)" }} />
      </div>
    </div>
  );
}


// ───────────────────────────────────────────────────────────────────────────────
// CONCEPT 3  ·  "OBSIDIAN"  ·  Luminous Weight Contrast
// ───────────────────────────────────────────────────────────────────────────────
//
// DESIGN PHILOSOPHY
// Extreme typographic weight contrast is one of the most powerful tools in luxury
// brand identity. Here, "L" is rendered at full bold weight — a dominant
// monogram anchor, a structural column, the first and heaviest element. "AVINE"
// exists in the lightest Cormorant weight (300), creating an intentional dramatic
// contrast: massive vs. ethereal, anchor vs. breath. This pairing references
// obsidian volcanic glass — dark and structural yet luminous at its edges.
// The two gradients break cleanly at the weight boundary: warm solar gold for L,
// cool sapphire for AVINE — a split that feels like a room divided by light.
//
// WHY IT WORKS FOR A LUXURY INTERIOR BRAND
// This logo has a monogram function: "L" becomes the brand icon, used alone on
// business cards, embossing, packaging. "AVINE" is the qualifier. The visual
// hierarchy tells a story of space: solid foundation + ethereal atmosphere.
// Interior design at its finest does exactly this — structural boldness paired
// with lightness and air.
//
// TO ACTIVATE: Replace <LogoAchilles /> with <LogoObsidian /> in the
// final logo section of ScrollAnimationHero below.
// ───────────────────────────────────────────────────────────────────────────────
function LogoObsidian() {
  return (
    <div style={{ position: "relative", display: "inline-block", textAlign: "center" }}>

      {/* Ambient halo — bleed of warm + cool light */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "-28px",
          background:
            "radial-gradient(ellipse at 22% 50%, rgba(255,210,0,0.14) 0%, rgba(0,117,255,0.10) 55%, transparent 80%)",
          filter: "blur(22px)",
          pointerEvents: "none",
        }}
      />

      {/* ── Letter pair with extreme weight contrast ── */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* L — dominant monogram anchor */}
        <span
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
            fontWeight: 700,
            fontSize: "clamp(5.5rem, 20vw, 15.5rem)",
            letterSpacing: "-0.04em",
            lineHeight: 0.88,
            background:
              "linear-gradient(158deg, #FFED00 0%, #FFD700 32%, #FFA500 62%, #CC8800 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "obsidian-l-pulse 5s ease-in-out infinite",
          }}
        >
          L
        </span>

        {/* AVINE — ethereal lightweight contrast */}
        <span
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
            fontWeight: 300,
            fontSize: "clamp(5rem, 18vw, 14rem)",
            letterSpacing: "0.04em",
            lineHeight: 0.88,
            background:
              "linear-gradient(158deg, #87CEEB 0%, #4DC3FF 28%, #0075FF 65%, #0050CC 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "obsidian-rest-pulse 5s 0.8s ease-in-out infinite",
          }}
        >
          AVINE
        </span>
      </div>

      {/* Weight-break accent — two-tone line marks the colour boundary */}
      <div
        style={{
          position: "relative",
          height: "2px",
          marginTop: "4px",
          background:
            "linear-gradient(90deg, #FFED00 0%, #FFED00 25%, transparent 30%, transparent 34%, #0075FF 38%, #0075FF 100%)",
          boxShadow: "0 0 16px rgba(255,237,0,0.35)",
        }}
      />

      {/* ── Subtitle ── */}
      <p
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
          fontSize: "clamp(0.85rem, 2.2vw, 1.4rem)",
          fontWeight: 300,
          letterSpacing: "0.58em",
          color: "#FFFFFF",
          marginTop: "clamp(1.4rem, 2.8vw, 2rem)",
          textTransform: "uppercase",
          textShadow: `2px 2px 6px rgba(0,0,0,0.85), 0 0 28px rgba(255,255,255,0.35)`,
        }}
      >
        Design Studio
      </p>

      {/* ── Dual-tone accent rule ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "clamp(12px, 2.5vw, 22px)",
          marginTop: "clamp(1rem, 2.5vw, 1.6rem)",
        }}
      >
        <div
          style={{
            width: "clamp(45px, 9vw, 75px)",
            height: "1px",
            background: "linear-gradient(90deg, transparent, #FFED00)",
            boxShadow: "0 0 12px rgba(255,237,0,0.55)",
          }}
        />
        <svg width="9" height="9" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect
            x="0" y="0" width="9" height="9"
            fill="#FFED00"
            transform="rotate(45 4.5 4.5)"
            style={{
              filter: "drop-shadow(0 0 8px rgba(255,237,0,0.95))",
              animation: "pulse-dot 2.5s ease-in-out infinite",
            }}
          />
        </svg>
        <div
          style={{
            width: "clamp(45px, 9vw, 75px)",
            height: "1px",
            background: "linear-gradient(90deg, #0075FF, transparent)",
            boxShadow: "0 0 12px rgba(0,117,255,0.55)",
          }}
        />
      </div>
    </div>
  );
}


// ───────────────────────────────────────────────────────────────────────────────
// SCROLL ANIMATION HERO — main orchestrator
// All scroll animation logic is preserved exactly.
// Only the logo JSX has been replaced.
// ───────────────────────────────────────────────────────────────────────────────
export function ScrollAnimationHero() {
  const { canvasRef, containerRef, progress, isLoaded, loadedCount } =
    useScrollFrameAnimation({
      frameCount: FRAME_COUNT,
      framePathTemplate: (index) => {
        const frameNumber = String(index + 1).padStart(3, "0");
        return `/scroll_animation_frames/ezgif-frame-${frameNumber}.jpg`;
      },
      scrollMultiplier: SCROLL_MULTIPLIER,
    });

  // Shader fades in as the final logo scales into place (progress 0.80 → 0.90).
  // Clamped 0–1 so the canvas is completely off until the reveal begins.
  const shaderProgress =
    progress < 0.80 ? 0 : Math.min(1, (progress - 0.80) / 0.10);

  // Logo text transitions to pure black at the end (progress 0.90 → 1.0).
  const blackProgress =
    progress < 0.90 ? 0 : Math.min(1, (progress - 0.90) / 0.10);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black"
      style={{
        height: `${SCROLL_MULTIPLIER * 100}vh`,
      }}
    >
      {/* Sticky / pinned viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{
            willChange: "transform",
            transform: "translateZ(0)",
          }}
        />

        {/* Loading overlay */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
            <div className="text-white text-center space-y-3">
              <div className="relative w-64 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-white transition-all duration-300 ease-out"
                  style={{ width: `${(loadedCount / FRAME_COUNT) * 100}%` }}
                />
              </div>
              <p className="text-sm font-light tracking-wider opacity-75">
                {loadedCount}/{FRAME_COUNT} frames loaded
              </p>
            </div>
          </div>
        )}

        {isLoaded && (
          <>
            {/* ── INITIAL LOGO: original plain black — boring by design so the reveal hits harder ── */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
              <div
                className="text-center"
                style={{
                  opacity: Math.max(0, 1 - progress * 2),
                  transform: `scale(${1 + progress * 0.3})`,
                  transition: "opacity 0.1s ease-out, transform 0.1s ease-out",
                }}
              >
                <h1
                  className="relative leading-none"
                  style={{
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    fontWeight: "700",
                    fontSize: "clamp(4rem, 14vw, 10rem)",
                    letterSpacing: "0.05em",
                    color: "#000000",
                    textShadow:
                      "0 4px 12px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.5)",
                  }}
                >
                  LAVINE
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-10px",
                      left: 0,
                      right: 0,
                      height: "3px",
                      background: "#000000",
                      opacity: 0.8,
                    }}
                  />
                </h1>
                <p
                  style={{
                    fontFamily: '"Trebuchet MS", "Lucida Grande", sans-serif',
                    fontSize: "clamp(0.9rem, 2.5vw, 1.8rem)",
                    fontWeight: "400",
                    letterSpacing: "0.35em",
                    color: "#000000",
                    marginTop: "clamp(1.5rem, 3vw, 2.5rem)",
                    textTransform: "uppercase",
                    textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                    opacity: 0.9,
                  }}
                >
                  Design Studio
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "20px",
                    marginTop: "clamp(1.5rem, 3vw, 2.5rem)",
                  }}
                >
                  <div style={{ width: "60px", height: "1px", background: "linear-gradient(90deg, transparent, #000000)", opacity: 0.6 }} />
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#000000", opacity: 0.8 }} />
                  <div style={{ width: "60px", height: "1px", background: "linear-gradient(90deg, #000000, transparent)", opacity: 0.6 }} />
                </div>
              </div>
            </div>

            {/* ── FINAL LOGO: Achilles inside cinematic frame — appears at 80% ── */}
            <>
              {/* Backdrop haze — synced with logo */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  zIndex: 29,
                  opacity:
                    progress < 0.80
                      ? 0
                      : progress < 1.0
                      ? 0.6
                      : 0,
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  background:
                    "radial-gradient(circle at center, rgba(255,255,255,0.10) 0%, transparent 70%)",
                  willChange: "opacity",
                }}
              />

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                <div
                  className="text-center relative"
                  style={{
                    opacity: progress < 0.80 ? 0 : 1,
                    transform: `scale(${
                      progress < 0.80
                        ? 0.80
                        : progress < 0.88
                        ? 0.80 + ((progress - 0.80) / 0.08) * 0.20
                        : 1
                    })`,
                    willChange: "transform, opacity",
                    padding: "clamp(3rem, 8vw, 6rem) clamp(4rem, 12vw, 9rem)",
                    border: "6px solid rgba(255,255,255,0.97)",
                    borderRadius: "10px",
                    background:
                      "radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, transparent 70%)",
                    boxShadow: `
                      0 0 0 1px rgba(255,255,255,0.15),
                      0 0 80px rgba(255,255,255,0.55),
                      inset 0 0 80px rgba(255,255,255,0.10),
                      0 12px 48px rgba(0,0,0,0.18)
                    `,
                  }}
                >
                  {/* ── Corner ornaments — L-bracket marks at each frame corner ── */}
                  {(
                    [
                      { top: "10px",    left: "10px",    rotate: "0deg",    color: "rgba(255,237,0,0.80)" },
                      { top: "10px",    right: "10px",   rotate: "90deg",   color: "rgba(255,255,255,0.55)" },
                      { bottom: "10px", right: "10px",   rotate: "180deg",  color: "rgba(0,117,255,0.80)" },
                      { bottom: "10px", left: "10px",    rotate: "270deg",  color: "rgba(255,237,0,0.50)" },
                    ] as Array<{ top?: string; bottom?: string; left?: string; right?: string; rotate: string; color: string }>
                  ).map((c, i) => (
                    <svg
                      key={i}
                      width="22" height="22" viewBox="0 0 22 22"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        top: c.top, bottom: c.bottom,
                        left: c.left, right: c.right,
                        transform: `rotate(${c.rotate})`,
                        pointerEvents: "none",
                      }}
                    >
                      {/* L-bracket */}
                      <path d="M 20,2 L 2,2 L 2,20" fill="none" stroke={c.color} strokeWidth="2" strokeLinecap="square" />
                      {/* Inner dot at elbow */}
                      <circle cx="2" cy="2" r="1.5" fill={c.color} />
                    </svg>
                  ))}

                  {/*
                    ── ACTIVE CONCEPT ──────────────────────────────────────────
                    Concept 1  →  <LogoAchilles />   (current — high-contrast serif)
                    Concept 3  →  <LogoObsidian />   (alternate — weight contrast)
                    ────────────────────────────────────────────────────────────
                  */}
                  <LogoAchilles shaderProgress={shaderProgress} blackProgress={blackProgress} />
                </div>
              </div>
            </>
          </>
        )}

        {/* Dev progress indicator */}
        {isLoaded && process.env.NODE_ENV === "development" && (
          <div className="absolute bottom-4 left-4 text-white/50 text-xs font-mono z-20">
            Progress: {Math.round(progress * 100)}%
          </div>
        )}
      </div>
    </div>
  );
}
