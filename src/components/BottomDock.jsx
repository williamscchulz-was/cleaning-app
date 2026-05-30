import { History, Home as HomeIcon, ListChecks, MoreHorizontal } from 'lucide-react';
import { haptics } from '../lib/haptics';

const TABS = [
  { k: 'home',      label: 'Início',    Icon: HomeIcon },
  { k: 'tarefas',   label: 'Catálogo',  Icon: ListChecks },
  { k: 'historico', label: 'Histórico', Icon: History },
];

// Floating tab bar — overlays content, anchored to the bottom edge of the
// viewport. Its inner container picks up safe-area-inset-bottom so the iOS
// home indicator doesn't cover the tap targets. The active pill width
// animates as the label fades in.
export default function BottomDock({ tab, setTab, onOpenSettings }) {
  function go(k) {
    if (k !== tab) haptics.light();
    setTab(k);
  }

  return (
    <div
      className="md:hidden absolute bottom-0 inset-x-0 z-20 px-3 pt-2 pointer-events-none"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 10px)' }}
    >
      <div
        className="pointer-events-auto surf-card rounded-2xl flex items-center justify-around p-1.5 shadow-lg-token"
      >
        {TABS.map(({ k, label, Icon }) => {
          const active = tab === k;
          return (
            <button
              key={k}
              onClick={() => go(k)}
              aria-current={active ? 'page' : undefined}
              className={`pressable flex-1 flex items-center justify-center gap-1.5 h-11 rounded-xl ${active ? 'surf-accent-soft' : ''}`}
              style={{ transition: 'background-color 240ms var(--ease-snap)' }}
            >
              <Icon
                size={18}
                strokeWidth={active ? 2.4 : 2}
                className={active ? 'txt-accent' : 'txt-muted'}
                style={{ transition: 'color 200ms var(--ease-snap)' }}
              />
              {active && (
                <span className="text-[12.5px] font-semibold txt-accent screen-in">
                  {label}
                </span>
              )}
            </button>
          );
        })}
        <button
          onClick={() => { haptics.light(); onOpenSettings(); }}
          aria-label="Mais opções"
          className="pressable flex-1 flex items-center justify-center h-11 rounded-xl txt-muted"
        >
          <MoreHorizontal size={18} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
