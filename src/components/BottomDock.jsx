import { History, Home as HomeIcon, ListChecks } from 'lucide-react';

const ITEMS = [
  { k: 'home',      label: 'Início',    Icon: HomeIcon },
  { k: 'tarefas',   label: 'Catálogo',  Icon: ListChecks },
  { k: 'historico', label: 'Histórico', Icon: History },
];

export default function BottomDock({ tab, setTab }) {
  return (
    <div className="absolute bottom-0 inset-x-0 z-20 px-3 pb-3">
      <div className="surf-card rounded-3xl shadow-[0_8px_30px_-8px_rgba(0,0,0,0.18)] flex items-center justify-around py-2 px-2">
        {ITEMS.map(({ k, label, Icon }) => {
          const active = tab === k;
          return (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-full transition ${active ? 'surf-tint' : ''}`}
            >
              <Icon
                className={`w-[18px] h-[18px] ${active ? 'txt-accent' : 'txt-muted'}`}
                strokeWidth={active ? 2.4 : 2}
              />
              {active && (
                <span className="font-display font-bold text-[12px] txt-accent">
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
