import { ChevronRight, MoreHorizontal } from 'lucide-react';
import { CheckCircle } from './ui';
import { FREQUENCIES } from '../lib/constants';

export default function TaskRow({ task, done, onToggle, onSkip, isLast }) {
  const freqLabel = FREQUENCIES[task.frequencyKey]?.label;

  return (
    <div
      className={`flex items-center gap-3 pl-4 pr-2 py-3 ${!isLast ? 'border-b bd-hairline' : ''}`}
      style={!isLast ? { borderBottomWidth: '0.5px' } : undefined}
    >
      <button onClick={onToggle} disabled={!onToggle} className="shrink-0">
        <CheckCircle checked={done} />
      </button>
      <button
        onClick={onToggle}
        disabled={!onToggle}
        className="flex-1 min-w-0 text-left disabled:cursor-default"
      >
        <div
          className="text-[16px] leading-tight truncate"
          style={{
            color: done ? 'var(--text-muted)' : 'var(--text)',
            textDecoration: done ? 'line-through' : 'none',
          }}
        >
          {task.name}
        </div>
        {!done && task.notes && (
          <div className="text-[12.5px] mt-1 truncate txt-accent">
            {task.notes}
          </div>
        )}
      </button>
      {!done && freqLabel && (
        <span className="text-[13px] txt-muted shrink-0">{freqLabel}</span>
      )}
      {onSkip && !done ? (
        <button
          onClick={onSkip}
          className="w-8 h-8 rounded-full flex items-center justify-center txt-muted shrink-0 active:scale-95 transition"
          aria-label="Outras opções"
        >
          <MoreHorizontal size={16} />
        </button>
      ) : (
        <ChevronRight size={16} className="txt-subtle shrink-0 mr-1" />
      )}
    </div>
  );
}
