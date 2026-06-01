import { useEffect, useMemo, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

/* ─────────────────────────────────────────────────────────────────────────
   Self-drawing splash. The logo's outline is traced like it's being drawn by
   hand (SVG line-draw via stroke-dashoffset, Vivus.js style), then the shape
   fills in, then the wordmark fades up. One-shot, cheap on cold start, and it
   ALWAYS dismisses itself on a timer — it never gates the app.

   Tune everything here:                                                      */
const CONFIG = {
  size: 132,            // rendered logo width/height in px
  accent: '#820AD1',    // primary brand purple
  accent2: '#A640E8',   // lighter purple for the gradient
  bg: null,             // null → use the app's --bg; or pass a hex/gradient
  strokeWidth: 4,       // in viewBox units (0–512 space), so ~0.8% of width

  drawMs: 1400,         // how long each part takes to draw
  drawStagger: 220,     // delay between house → door → sparkle
  fillDelayMs: 1180,    // when the fill starts fading in (≈85% through draw)
  fillMs: 560,
  wordDelayMs: 1640,    // when the wordmark rises in
  wordMs: 520,
  holdMs: 320,          // beat at the end before leaving
  fadeOutMs: 420,       // splash fade-out

  showParticles: true,
  showWordmark: true,
  wordmark: 'Lumen',
};

// Logo paths (viewBox 0 0 512 512) — shared with AppIcon.
const HOUSE   = 'M 256 96 L 432 248 L 432 388 C 432 410.091 414.091 428 392 428 L 120 428 C 97.909 428 80 410.091 80 388 L 80 248 L 256 96 Z';
const DOOR    = 'M 220 308 C 220 288.118 236.118 272 256 272 C 275.882 272 292 288.118 292 308 L 292 428 L 220 428 L 220 308 Z';
const SPARKLE = 'M 400 92 L 410 116 L 434 126 L 410 136 L 400 160 L 390 136 L 366 126 L 390 116 Z';

const PARTS = [HOUSE, DOOR, SPARKLE];

export default function SplashScreen({ onDone }) {
  const reduced = useReducedMotion();
  const [leaving, setLeaving] = useState(false);

  // Total lifetime: draw → fill → wordmark → hold, then fade out. Under
  // reduced motion we skip the choreography and just show + dismiss fast.
  const startFadeAt = reduced
    ? 650
    : CONFIG.wordDelayMs + CONFIG.wordMs + CONFIG.holdMs;
  const totalMs = startFadeAt + CONFIG.fadeOutMs;

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), startFadeAt);
    const t2 = setTimeout(() => onDone?.(), totalMs);
    // Hard fallback: even if a timer is throttled (background tab, etc.),
    // never let the splash outlive a generous ceiling.
    const t3 = setTimeout(() => onDone?.(), Math.max(totalMs, 4000) + 600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [startFadeAt, totalMs, onDone]);

  const particles = useMemo(() => {
    if (!CONFIG.showParticles || reduced) return [];
    return Array.from({ length: 14 }, (_, i) => {
      const r = (n) => ((Math.sin((i + 1) * n) + 1) / 2);
      return {
        i,
        left: r(12.9898) * 100,
        top: 18 + r(78.233) * 64,
        size: 2 + Math.round(r(43.7) * 3),
        delay: r(7.3) * 900,
        dur: 2200 + r(91.1) * 1600,
        drift: (r(33.7) - 0.5) * 24,
      };
    });
  }, [reduced]);

  const cssVars = {
    '--sp-accent': CONFIG.accent,
    '--sp-accent-2': CONFIG.accent2,
    '--sp-draw-ms': `${CONFIG.drawMs}ms`,
    '--sp-fill-ms': `${CONFIG.fillMs}ms`,
    '--sp-fill-delay': `${CONFIG.fillDelayMs}ms`,
    '--sp-word-ms': `${CONFIG.wordMs}ms`,
    '--sp-word-delay': `${CONFIG.wordDelayMs}ms`,
    '--sp-fade-ms': `${CONFIG.fadeOutMs}ms`,
  };

  return (
    <div
      className={`sp-root ${leaving ? 'sp-leaving' : ''} ${reduced ? 'sp-reduced' : ''}`}
      style={{
        ...cssVars,
        background: CONFIG.bg ?? 'var(--bg)',
      }}
      aria-hidden
    >
      {/* soft radial halo behind the mark */}
      <div className="sp-halo" />

      {/* ambient particles */}
      {particles.map((p) => (
        <span
          key={p.i}
          className="sp-particle"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            '--pd': `${p.delay}ms`,
            '--pdur': `${p.dur}ms`,
            '--pdrift': `${p.drift}px`,
          }}
        />
      ))}

      <div className="sp-stack">
        <svg
          className="sp-logo"
          width={CONFIG.size}
          height={CONFIG.size}
          viewBox="0 0 512 512"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Lumen"
        >
          <defs>
            <linearGradient id="sp-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--sp-accent-2)" />
              <stop offset="1" stopColor="var(--sp-accent)" />
            </linearGradient>
            <linearGradient id="sp-stroke" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="var(--sp-accent)" />
              <stop offset="1" stopColor="var(--sp-accent-2)" />
            </linearGradient>
          </defs>

          {/* FILL layer — starts invisible, fades in after the trace. The
              door uses the background colour so it reads as a cutout. */}
          <g className="sp-fill">
            <path d={HOUSE} fill="url(#sp-fill)" />
            <path d={DOOR} fill={CONFIG.bg ?? 'var(--bg)'} />
            <path d={SPARKLE} fill="url(#sp-fill)" />
          </g>

          {/* STROKE layer — traced via stroke-dashoffset. pathLength=1
              normalises every path so one duration fits all. */}
          <g
            fill="none"
            stroke="url(#sp-stroke)"
            strokeWidth={CONFIG.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {PARTS.map((d, idx) => (
              <path
                key={idx}
                d={d}
                pathLength="1"
                className={`sp-draw sp-draw-${idx}`}
                style={{ animationDelay: `${idx * CONFIG.drawStagger}ms` }}
              />
            ))}
          </g>
        </svg>

        {CONFIG.showWordmark && (
          <div className="sp-word">
            <span className="sp-wordmark">{CONFIG.wordmark}</span>
            <span className="sp-version">
              {typeof __BUILD_ID__ !== 'undefined' ? __BUILD_ID__ : ''}
            </span>
          </div>
        )}
      </div>

      {/* Animation rules live in a stylesheet (not inline) so re-renders
          never restart them. Scoped under .sp-root. */}
      <style>{`
        .sp-root {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          opacity: 1;
          transition: opacity var(--sp-fade-ms) ease-out;
        }
        .sp-root.sp-leaving { opacity: 0; }

        .sp-halo {
          position: absolute;
          width: 60vmin;
          height: 60vmin;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            color-mix(in srgb, var(--sp-accent) 22%, transparent) 0%,
            transparent 68%
          );
          opacity: 0;
          animation: spHalo 1400ms ease-out forwards;
          filter: blur(2px);
        }
        @keyframes spHalo { to { opacity: 1; } }

        .sp-stack {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 22px;
        }

        .sp-logo {
          filter: drop-shadow(0 14px 32px color-mix(in srgb, var(--sp-accent) 38%, transparent));
        }

        .sp-draw {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: spDraw var(--sp-draw-ms) ease-in-out forwards;
        }
        @keyframes spDraw { to { stroke-dashoffset: 0; } }

        .sp-fill {
          opacity: 0;
          animation: spFill var(--sp-fill-ms) ease-out forwards;
          animation-delay: var(--sp-fill-delay);
        }
        @keyframes spFill { to { opacity: 1; } }

        .sp-word {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          opacity: 0;
          transform: translateY(10px);
          animation: spWord var(--sp-word-ms) cubic-bezier(.16,1,.3,1) forwards;
          animation-delay: var(--sp-word-delay);
        }
        @keyframes spWord { to { opacity: 1; transform: none; } }

        .sp-wordmark {
          font-size: 26px;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--text);
          background: linear-gradient(90deg, var(--sp-accent), var(--sp-accent-2));
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .sp-version {
          font-size: 11px;
          color: var(--text-muted);
          letter-spacing: 0.02em;
        }

        .sp-particle {
          position: absolute;
          border-radius: 50%;
          background: var(--sp-accent-2);
          opacity: 0;
          animation: spParticle var(--pdur) ease-in-out var(--pd) forwards;
        }
        @keyframes spParticle {
          0%   { opacity: 0; transform: translate(0, 8px) scale(0.6); }
          35%  { opacity: 0.7; }
          100% { opacity: 0; transform: translate(var(--pdrift), -26px) scale(1); }
        }

        /* Reduced motion: skip the draw choreography, show a settled mark. */
        .sp-reduced .sp-draw { animation: none; stroke-dashoffset: 0; }
        .sp-reduced .sp-fill { animation: none; opacity: 1; }
        .sp-reduced .sp-word { animation: none; opacity: 1; transform: none; }
        .sp-reduced .sp-halo { animation: none; opacity: 1; }

        @media (prefers-reduced-motion: reduce) {
          .sp-draw { animation: none; stroke-dashoffset: 0; }
          .sp-fill { animation: none; opacity: 1; }
          .sp-word { animation: none; opacity: 1; transform: none; }
          .sp-halo { animation: none; opacity: 1; }
          .sp-particle { display: none; }
        }
      `}</style>
    </div>
  );
}
