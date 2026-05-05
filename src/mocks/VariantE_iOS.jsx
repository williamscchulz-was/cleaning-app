import { Check, ChevronRight, MoreHorizontal } from 'lucide-react';
import { SAMPLE_TASKS } from './sample';

// E — iOS 18 native: glassy header, inset rounded sections, system blue accent, SF Pro feel.
export default function VariantE({ theme }) {
  const dark = theme === 'dark';
  const c = dark
    ? { bg: '#000000', text: '#FFFFFF', muted: '#8E8E93', subtle: '#48484A', accent: '#0A84FF', card: '#1C1C1E', hairline: '#38383A', section: '#2C2C2E' }
    : { bg: '#F2F2F7', text: '#000000', muted: '#8E8E93', subtle: '#C7C7CC', accent: '#007AFF', card: '#FFFFFF', hairline: '#E5E5EA', section: '#E5E5EA' };

  const grouped = group(SAMPLE_TASKS);
  const done = SAMPLE_TASKS.filter(t => t.doneToday).length;
  const total = SAMPLE_TASKS.length;

  return (
    <div
      style={{ background: c.bg, color: c.text, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif' }}
      className="min-h-full"
    >
      <div className="px-4 pt-8 pb-4">
        <div className="flex items-baseline justify-between">
          <div style={{ color: c.muted }} className="text-[14px] font-medium uppercase tracking-wider">
            Segunda, 5 mai
          </div>
          <button className="text-[16px] font-medium" style={{ color: c.accent }}>
            Hoje
          </button>
        </div>
        <h1 className="mt-1 text-[34px] font-bold tracking-tight">
          Tarefas
        </h1>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: c.section }}>
            <div className="h-full rounded-full" style={{ width: `${(done/total)*100}%`, background: c.accent }} />
          </div>
          <span className="text-[13px] tabular-nums font-medium" style={{ color: c.muted }}>
            {done}/{total}
          </span>
        </div>
      </div>

      <div className="px-4 pb-12 space-y-7">
        {grouped.map(([area, items]) => {
          const areaDone = items.filter(t=>t.doneToday).length;
          return (
            <section key={area}>
              <div className="flex items-baseline justify-between px-4 mb-1.5">
                <h3 className="text-[13px] font-semibold uppercase tracking-wider" style={{ color: c.muted }}>
                  {area}
                </h3>
                <span className="text-[12px] tabular-nums" style={{ color: c.muted }}>
                  {areaDone}/{items.length}
                </span>
              </div>
              <div className="rounded-xl overflow-hidden" style={{ background: c.card }}>
                {items.map((t, i) => (
                  <div
                    key={t.id}
                    className="flex items-center gap-3 pl-4 pr-3 py-3"
                    style={{ borderBottom: i === items.length - 1 ? 'none' : `0.5px solid ${c.hairline}` }}
                  >
                    <span
                      className="w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: t.doneToday ? c.accent : 'transparent',
                        border: t.doneToday ? 'none' : `1.5px solid ${c.subtle}`,
                      }}
                    >
                      {t.doneToday && <Check size={12} strokeWidth={3.5} color="#fff" />}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-[16px] leading-tight"
                        style={{
                          color: t.doneToday ? c.muted : c.text,
                          textDecoration: t.doneToday ? 'line-through' : 'none',
                        }}
                      >
                        {t.name}
                      </div>
                      {!t.doneToday && t.notes && (
                        <div className="text-[12.5px] mt-1" style={{ color: c.accent }}>
                          {t.notes}
                        </div>
                      )}
                    </div>
                    {!t.doneToday && (
                      <span className="text-[13px]" style={{ color: c.muted }}>
                        {t.freq}
                      </span>
                    )}
                    <ChevronRight size={16} style={{ color: c.subtle }} />
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function group(tasks) {
  const g = {};
  tasks.forEach(t => { (g[t.area] ||= []).push(t); });
  return Object.entries(g);
}
