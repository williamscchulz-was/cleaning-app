import { History, Home as HomeIcon, ListChecks } from 'lucide-react';

const ITEMS = [
  { k: 'home',      label: 'Início',    Icon: HomeIcon },
  { k: 'tarefas',   label: 'Catálogo',  Icon: ListChecks },
  { k: 'historico', label: 'Histórico', Icon: History },
];

export default function BottomDock({ tab, setTab }) {
  return (
    <div className="shrink-0 px-3 pb-3 pt-2 surf-bg">
      <div className="surf-card rounded-2xl flex items-center justify-around p-1.5" style={{ boxShadow: '0 4px 16px -4px rgba(0,0,0,0.08)' }}>
        {ITEMS.map(({ k, label, Icon }) => {
          const active = tab === k;
          return (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-xl transition ${active ? 'surf-accent-soft' : ''}`}
            >
              <Icon
                size={18}
                strokeWidth={active ? 2.4 : 2}
                className={active ? 'txt-accent' : 'txt-muted'}
              />
              {active && (
                <span className="text-[13px] font-semibold txt-accent">
                  {label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
