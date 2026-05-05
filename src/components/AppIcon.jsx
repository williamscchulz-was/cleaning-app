// House + sparkle logo. Inline SVG so the door fill can be themed
// against whatever surface the icon sits on (white door blends into
// light surfaces, becomes a visible cutout-shape on dark surfaces).
export default function AppIcon({ size = 56, color, doorColor }) {
  const c = color || 'var(--accent)';
  const d = doorColor || 'var(--bg)';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M 256 96 L 432 248 L 432 388 C 432 410.091 414.091 428 392 428 L 120 428 C 97.909 428 80 410.091 80 388 L 80 248 L 256 96 Z"
        fill={c}
      />
      <path
        d="M 220 308 C 220 288.118 236.118 272 256 272 C 275.882 272 292 288.118 292 308 L 292 428 L 220 428 L 220 308 Z"
        fill={d}
      />
      <path
        d="M 400 92 L 410 116 L 434 126 L 410 136 L 400 160 L 390 136 L 366 126 L 390 116 Z"
        fill={c}
      />
    </svg>
  );
}
