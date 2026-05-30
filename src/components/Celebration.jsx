import { useMemo } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

const COLORS = ['#820AD1', '#A335E5', '#C264FF', '#FFC83D', '#34C759', '#FF6B9D'];

// A one-shot confetti burst. Mount it (keyed) when something worth
// celebrating happens; it self-cleans visually via CSS animation. Pieces
// fall from the top of the container with varied drift, rotation, and timing.
// Skipped entirely under prefers-reduced-motion.
export default function Celebration({ count = 36 }) {
  const reduced = useReducedMotion();

  const pieces = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      // Deterministic-ish spread without needing a seed.
      const r = (n) => ((Math.sin((i + 1) * n) + 1) / 2);
      const left = r(12.9898) * 100;
      const dx = (r(78.233) - 0.5) * 160;
      const rot = 180 + r(43.7) * 540;
      const dur = 1800 + r(91.1) * 1400;
      const delay = r(7.3) * 400;
      const size = 7 + Math.round(r(33.7) * 6);
      const color = COLORS[i % COLORS.length];
      const round = i % 3 === 0;
      return { i, left, dx, rot, dur, delay, size, color, round };
    });
  }, [count]);

  if (reduced) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.i}
          className="confetti-piece absolute top-0"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.round ? p.size : p.size * 0.5,
            background: p.color,
            borderRadius: p.round ? '50%' : 2,
            '--dx': `${p.dx}px`,
            '--rot': `${p.rot}deg`,
            '--dur': `${p.dur}ms`,
            '--delay': `${p.delay}ms`,
          }}
        />
      ))}
    </div>
  );
}
