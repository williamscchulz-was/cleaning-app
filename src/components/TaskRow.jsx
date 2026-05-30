import { ChevronRight, MoreHorizontal } from 'lucide-react';
import { CheckCircle } from './ui';
import { FREQUENCIES } from '../lib/constants';
import { haptics } from '../lib/haptics';

export default function TaskRow({ task, done, onToggle, onSkip, isLast }) {
  const freqLabel = FREQUENCIES[task.frequencyKey]?.label;

  function handleToggle() {
    if (!onToggle) return;
    // Light tick when completing, softer when un-completing.
    if (done) haptics.light();
    else haptics.medium();
    onToggle();
  }

  function handleSkip(e) {
    e.stopPropagation();
    haptics.light();
    onSkip();
  }

  return (
    <div
      className={`flex items-center gap-3 pl-4 pr-2 py-3 ${!isLast ? 'border-b bd-hairline' : ''}`}
      style={!isLast ? { borderBottomWidth: '0.5px' } : undefined}
    >
      <button
        onClick={handleToggle}
        disabled={!onToggle}
        className="pressable-sm shrink-0 -m-1 p-1"
        aria-pressed={done}
        aria-label={done ? `Desmarcar ${task.name}` : `Marcar ${task.name} como feita`}
      >
        <CheckCircle checked={done} />
      </button>
      <button
        onClick={handleToggle}
        disabled={!onToggle}
        className="flex-1 min-w-0 text-left disabled:cursor-default"
      >
        <div
          className="text-[16px] leading-tight truncate"
          style={{
            color: done ? 'var(--text-muted)' : 'var(--text)',
            textDecoration: done ? 'line-through' : 'none',
            transition: 'color 240ms var(--ease-snap)',
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
          onClick={handleSkip}
          className="pressable-sm w-9 h-9 rounded-full flex items-center justify-center txt-muted shrink-0"
          aria-label={`Adiar ${task.name}`}
        >
          <MoreHorizontal size={16} />
        </button>
      ) : (
        <ChevronRight size={16} className="txt-subtle shrink-0 mr-1" />
      )}
    </div>
  );
}
