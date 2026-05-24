import { History, Home as HomeIcon, ListChecks, MoreHorizontal } from 'lucide-react';
import AppIcon from './AppIcon';

const TABS = [
  { k: 'home',      label: 'Início',    Icon: HomeIcon },
  { k: 'tarefas',   label: 'Catálogo',  Icon: ListChecks },
  { k: 'historico', label: 'Histórico', Icon: History },
];

// Vertical nav rail used on tablet+. Replaces the floating BottomDock.
export default function Sidebar({ tab, setTab, onOpenSettings }) {
  return (
    <aside
      className="hidden md:flex md:flex-col md:w-[240px] md:shrink-0 md:h-full surf-bg border-r bd-hairline"
      style={{
        borderRightWidth: '0.5px',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="px-5 py-5 flex items-center gap-3">
        <AppIcon size={28} />
        <span className="text-[18px] font-bold txt-primary">Lumen</span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {TABS.map(({ k, label, Icon }) => {
          const active = tab === k;
          return (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`w-full flex items-center gap-3 px-3 h-11 rounded-xl text-left transition ${active ? 'surf-accent-soft' : 'surf-hover'}`}
            >
              <Icon
                size={18}
                strokeWidth={active ? 2.4 : 2}
                className={active ? 'txt-accent' : 'txt-muted'}
              />
              <span className={`text-[15px] font-semibold ${active ? 'txt-accent' : 'txt-primary'}`}>
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="px-3 pb-3">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-3 h-11 rounded-xl text-left surf-hover"
        >
          <MoreHorizontal size={18} className="txt-muted" />
          <span className="text-[15px] font-semibold txt-primary">Mais</span>
        </button>
      </div>
    </aside>
  );
}
