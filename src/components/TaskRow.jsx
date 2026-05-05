import { Check, MoreHorizontal } from 'lucide-react';
import { FreqLabel } from './primitives';

export default function TaskRow({ task, done, onToggle, onSkip, last }) {
  return (
    <li className="relative">
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-3 px-4 py-3 ${onSkip && !done ? 'pr-11' : ''} surf-hover transition ${!last ? 'border-b bd-hairline' : ''}`}
      >
        <span
          className={`w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 transition-all ${done ? 'surf-accent' : 'border-[1.5px] bd-subtle'}`}
        >
          {done && <Check className="w-[14px] h-[14px] text-white check-pop" strokeWidth={3} />}
        </span>
        <div className="flex-1 min-w-0 text-left">
          <div className={`font-body text-[15px] leading-snug truncate transition ${done ? 'txt-subtle line-through font-normal' : 'txt-primary font-semibold'}`}>
            {task.name}
          </div>
          {!done && task.notes && (
            <div className="font-body text-[12px] txt-accent mt-0.5 truncate">
              {task.notes}
            </div>
          )}
        </div>
        {!done && <FreqLabel freq={task.frequencyKey} />}
      </button>
      {onSkip && !done && (
        <button
          onClick={(e) => { e.stopPropagation(); onSkip(); }}
          className="absolute top-1/2 -translate-y-1/2 right-1.5 w-8 h-8 rounded-full flex items-center justify-center txt-muted surf-hover transition"
          aria-label="Outras opções"
        >
          <MoreHorizontal className="w-[16px] h-[16px]" strokeWidth={2.2} />
        </button>
      )}
    </li>
  );
}
