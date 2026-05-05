import { ChevronRight } from 'lucide-react';
import { FREQUENCIES } from '../lib/constants';

export function QuickAction({ Icon, label, onClick, badge }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2 w-[72px]">
      <div className="relative w-14 h-14 rounded-full surf-elev flex items-center justify-center active:scale-95 transition">
        <Icon className="w-6 h-6 txt-primary" strokeWidth={2} />
        {badge && (
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-md surf-accent text-white text-[9px] font-bold leading-none">
            {badge}
          </span>
        )}
      </div>
      <span className="text-[11.5px] font-semibold txt-primary text-center leading-tight">
        {label}
      </span>
    </button>
  );
}

export function ListRow({ Icon, title, description, right, onClick, isLast }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3.5 px-4 py-3.5 surf-hover transition ${!isLast ? 'border-b bd-hairline' : ''}`}
    >
      {Icon && (
        <div className="w-10 h-10 rounded-full surf-elev flex items-center justify-center shrink-0">
          <Icon className="w-[18px] h-[18px] txt-primary" strokeWidth={2} />
        </div>
      )}
      <div className="flex-1 min-w-0 text-left">
        <div className="font-display font-bold text-[15px] txt-primary truncate">
          {title}
        </div>
        {description && (
          <div className="font-body text-[12.5px] txt-muted mt-0.5 truncate">
            {description}
          </div>
        )}
      </div>
      {right || <ChevronRight className="w-5 h-5 txt-subtle shrink-0" strokeWidth={2} />}
    </button>
  );
}

export function SectionHeader({ title, action, onAction }) {
  return (
    <div className="flex items-end justify-between px-5 mb-2 mt-6">
      <h2 className="font-display font-extrabold text-[18px] txt-primary">
        {title}
      </h2>
      {action && (
        <button onClick={onAction} className="txt-accent font-display font-bold text-[13px] active:opacity-60 transition">
          {action}
        </button>
      )}
    </div>
  );
}

export function PrimaryButton({ children, onClick, disabled, fullWidth, icon: IconComp }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 px-6 h-12 rounded-full surf-accent txt-on-accent font-display font-bold text-[14px] active:scale-[0.98] disabled:opacity-40 transition ${fullWidth ? 'w-full' : ''}`}
    >
      {IconComp && <IconComp className="w-4 h-4" strokeWidth={2.5} />}
      {children}
    </button>
  );
}

export function ProgressBar({ pct }) {
  return (
    <div className="w-full h-1.5 surf-elev rounded-full overflow-hidden">
      <div
        className="h-full surf-accent rounded-full origin-left"
        style={{ width: `${pct}%`, transition: 'width 600ms cubic-bezier(.2,.8,.2,1)' }}
      />
    </div>
  );
}

const FREQ_TONE = {
  semanal:    { color: 'txt-muted',            dot: 'dot-subtle' },
  bissemanal: { color: 'txt-muted',            dot: 'dot-muted' },
  mensal:     { color: 'txt-secondary',        dot: 'dot-secondary' },
  bimensal:   { color: 'txt-accent',           dot: 'dot-accent-soft' },
  trimestral: { color: 'txt-accent font-bold', dot: 'surf-accent' },
};

export function FreqLabel({ freq }) {
  const t = FREQ_TONE[freq];
  if (!t) return null;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11.5px] ${t.color}`}>
      <span className={`w-[5px] h-[5px] rounded-full ${t.dot}`} />
      {FREQUENCIES[freq].label}
    </span>
  );
}
