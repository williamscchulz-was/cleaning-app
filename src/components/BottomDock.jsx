import { History, Home as HomeIcon, ListChecks, MoreHorizontal } from 'lucide-react';

const TABS = [
  { k: 'home',      label: 'Início',    Icon: HomeIcon },
  { k: 'tarefas',   label: 'Catálogo',  Icon: ListChecks },
  { k: 'historico', label: 'Histórico', Icon: History },
];

// Floating tab bar — overlays content, anchored to the bottom edge of the
// viewport. Its inner container picks up safe-area-inset-bottom so the iOS
// home indicator doesn't cover the tap targets.
export default function BottomDock({ tab, setTab, onOpenSettings }) {
  return (
    <div
      className="md:hidden absolute bottom-0 inset-x-0 z-20 px-3 pt-2 pointer-events-none"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 10px)' }}
    >
      <div
        className="pointer-events-auto surf-card rounded-2xl flex items-center justify-around p-1.5"
        style={{ boxShadow: '0 8px 24px -8px rgba(0,0,0,0.18)' }}
      >
        {TABS.map(({ k, label, Icon }) => {
          const active = tab === k;
          return (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`flex-1 flex items-center justify-center gap-1.5 h-11 rounded-xl transition ${active ? 'surf-accent-soft' : ''}`}
            >
              <Icon
                size={18}
                strokeWidth={active ? 2.4 : 2}
                className={active ? 'txt-accent' : 'txt-muted'}
              />
              {active && (
                <span className="text-[12.5px] font-semibold txt-accent">
                  {label}
                </span>
              )}
            </button>
          );
        })}
        <button
          onClick={onOpenSettings}
          aria-label="Mais opções"
          className="flex-1 flex items-center justify-center h-11 rounded-xl transition txt-muted"
        >
          <MoreHorizontal size={18} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
