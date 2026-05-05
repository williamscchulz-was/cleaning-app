import { Check, ChevronRight, Moon, Sun } from 'lucide-react';

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
      <div className="surf-card rounded-xl overflow-hidden">
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

// Simple progress bar.
export function ProgressBar({ pct }) {
  return (
    <div className="w-full h-1.5 surf-section rounded-full overflow-hidden">
      <div
        className="h-full surf-accent rounded-full"
        style={{
          width: `${pct}%`,
          transition: 'width 500ms cubic-bezier(.2,.8,.2,1)',
        }}
      />
    </div>
  );
}

// Empty/checked circle for marking tasks done.
export function CheckCircle({ checked, size = 22 }) {
  return (
    <span
      className="rounded-full flex items-center justify-center shrink-0 transition-all"
      style={{
        width: size,
        height: size,
        background: checked ? 'var(--accent)' : 'transparent',
        border: checked ? 'none' : '1.5px solid var(--text-subtle)',
      }}
    >
      {checked && <Check size={size * 0.55} strokeWidth={3.5} className="text-white check-pop" />}
    </span>
  );
}

// Pill button (small, used in headers like "Hoje").
export function Pill({ children, onClick, active = true }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-3 h-8 rounded-full text-[14px] font-semibold transition active:scale-[0.97] ${
        active ? 'surf-accent-soft txt-accent' : 'surf-section txt-muted'
      }`}
    >
      {children}
    </button>
  );
}

// Filled accent button (large, for primary CTAs).
export function PrimaryButton({ children, onClick, disabled, fullWidth, leadingIcon: Icon }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 px-6 h-12 rounded-full surf-accent txt-on-accent text-[15px] font-semibold active:scale-[0.98] disabled:opacity-40 transition ${fullWidth ? 'w-full' : ''}`}
    >
      {Icon && <Icon size={16} strokeWidth={2.5} />}
      {children}
    </button>
  );
}

// Theme toggle (sun/moon).
export function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
      className="inline-flex items-center justify-center w-9 h-9 rounded-full surf-section txt-primary active:scale-95 transition"
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
