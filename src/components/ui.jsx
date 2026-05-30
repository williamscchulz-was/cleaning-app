import { useEffect, useRef, useState } from 'react';
import { Check, ChevronRight, MoreHorizontal, Moon, Sun } from 'lucide-react';

// Big iOS-style page title with optional pill on the right.
export function TitleHeader({ kicker, title, right }) {
  return (
    <div className="px-5 pt-8 pb-3">
      <div className="flex items-center justify-between min-h-[28px]">
        {kicker && (
          <div className="text-[13px] font-medium uppercase tracking-wider txt-muted">
            {kicker}
          </div>
        )}
        {right}
      </div>
      <h1 className="mt-1 text-[34px] font-bold tracking-tight txt-primary leading-tight">
        {title}
      </h1>
    </div>
  );
}

// Section: small uppercase header + inset rounded card containing children.
export function Section({ title, right, children, padded = true }) {
  return (
    <section className={padded ? 'px-4 mt-7' : 'mt-7'}>
      {(title || right) && (
        <div className={`flex items-baseline justify-between mb-1.5 ${padded ? 'px-4' : 'px-5'}`}>
          <h3 className="text-[13px] font-semibold uppercase tracking-wider txt-muted">
            {title}
          </h3>
          {right}
        </div>
      )}
      <div className="surf-card rounded-xl overflow-hidden shadow-sm-token">
        {children}
      </div>
    </section>
  );
}

// Single iOS-style row inside a Section.
export function Row({
  leading,
  title,
  subtitle,
  trailing,
  trailingText,
  onClick,
  isLast,
  destructive,
}) {
  const Comp = onClick ? 'button' : 'div';
  return (
    <Comp
      onClick={onClick}
      className={`w-full flex items-center gap-3 pl-4 pr-3 py-3 ${onClick ? 'surf-hover transition' : ''} ${!isLast ? 'border-b bd-hairline' : ''}`}
      style={!isLast ? { borderBottomWidth: '0.5px' } : undefined}
    >
      {leading}
      <div className="flex-1 min-w-0 text-left">
        <div className={`text-[16px] leading-tight truncate ${destructive ? 'txt-danger' : 'txt-primary'}`}>
          {title}
        </div>
        {subtitle && (
          <div className="text-[12.5px] mt-0.5 truncate txt-muted">
            {subtitle}
          </div>
        )}
      </div>
      {trailingText && (
        <span className="text-[13px] txt-muted shrink-0">{trailingText}</span>
      )}
      {trailing !== undefined ? trailing : (onClick && <ChevronRight size={16} className="txt-subtle shrink-0" />)}
    </Comp>
  );
}

// Hairline divider (0.5px on retina, falls back to 1px elsewhere).
export function Hairline({ inset = 0 }) {
  return (
    <div
      className="border-b bd-hairline"
      style={{ borderBottomWidth: '0.5px', marginLeft: inset, marginRight: inset }}
    />
  );
}

// Progress bar with a gradient fill that springs to width. At 100% it gets
// a brief settle; the fill carries a subtle gloss via the accent gradient.
export function ProgressBar({ pct }) {
  return (
    <div className="w-full h-2 surf-section rounded-full overflow-hidden">
      <div
        className="h-full rounded-full"
        style={{
          width: `${pct}%`,
          background: 'linear-gradient(90deg, var(--accent), var(--accent-2))',
          transition: 'width 620ms var(--ease-out)',
        }}
      />
    </div>
  );
}

// Empty/checked circle for marking tasks done. When it transitions from
// unchecked → checked it fires a one-shot burst ring + check-pop. The burst
// is suppressed on first mount (so an already-done list doesn't flash).
export function CheckCircle({ checked, size = 22 }) {
  const [burst, setBurst] = useState(false);
  const prev = useRef(checked);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      prev.current = checked;
      return;
    }
    if (checked && !prev.current) {
      setBurst(true);
      const t = setTimeout(() => setBurst(false), 560);
      prev.current = checked;
      return () => clearTimeout(t);
    }
    prev.current = checked;
  }, [checked]);

  return (
    <span className="relative inline-flex shrink-0" style={{ width: size, height: size }}>
      {burst && (
        <span
          className="burst absolute inset-0 rounded-full pointer-events-none"
          style={{ boxShadow: '0 0 0 2px var(--accent)' }}
        />
      )}
      <span
        className="rounded-full flex items-center justify-center"
        style={{
          width: size,
          height: size,
          background: checked ? 'var(--accent)' : 'transparent',
          border: checked ? '1.5px solid var(--accent)' : '1.5px solid var(--text-subtle)',
          transition: 'background-color 200ms var(--ease-snap), border-color 200ms var(--ease-snap)',
        }}
      >
        {checked && <Check size={size * 0.55} strokeWidth={3.5} className="text-white check-pop" />}
      </span>
    </span>
  );
}

// Pill button (small, used in headers like "Hoje").
export function Pill({ children, onClick, active = true }) {
  return (
    <button
      onClick={onClick}
      className={`pressable inline-flex items-center gap-1 px-3 h-8 rounded-full text-[14px] font-semibold ${
        active ? 'surf-accent-soft txt-accent' : 'surf-section txt-muted'
      }`}
    >
      {children}
    </button>
  );
}

// Filled accent button (large, for primary CTAs). Subtle accent-tinted
// shadow gives it lift; presses use the spring scale.
export function PrimaryButton({ children, onClick, disabled, fullWidth, leadingIcon: Icon }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`pressable-lg inline-flex items-center justify-center gap-2 px-6 h-12 rounded-full surf-accent txt-on-accent text-[15px] font-semibold disabled:opacity-40 ${fullWidth ? 'w-full' : ''}`}
      style={disabled ? undefined : { boxShadow: '0 8px 20px -8px var(--accent)' }}
    >
      {Icon && <Icon size={16} strokeWidth={2.5} />}
      {children}
    </button>
  );
}

// Theme toggle (sun/moon). Bigger touch target (44×44) per Apple HIG.
export function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
      className="pressable inline-flex items-center justify-center w-11 h-11 rounded-full surf-section txt-primary"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

// "More" button used in headers — opens the Settings sheet.
export function MoreButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Mais opções"
      className="pressable inline-flex items-center justify-center w-11 h-11 rounded-full surf-section txt-primary"
    >
      <MoreHorizontal size={18} />
    </button>
  );
}
