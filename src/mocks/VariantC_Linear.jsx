import { Check, ChevronRight } from 'lucide-react';
import { SAMPLE_TASKS } from './sample';

// C — Mono Linear: dark-first, dense, neon accent, monospace numbers, no decoration.
export default function VariantC({ theme }) {
  const dark = theme === 'dark';
  const c = dark
    ? { bg: '#08080A', text: '#F4F4F5', muted: '#71717A', subtle: '#3F3F46', accent: '#A78BFA', accentDim: 'rgba(167,139,250,0.12)', card: '#0F0F12', hairline: '#18181B' }
    : { bg: '#FAFAFA', text: '#0A0A0A', muted: '#71717A', subtle: '#A1A1AA', accent: '#7C3AED', accentDim: 'rgba(124,58,237,0.08)', card: '#FFFFFF', hairline: '#E4E4E7' };

  const grouped = group(SAMPLE_TASKS);
  const done = SAMPLE_TASKS.filter(t => t.doneToday).length;
  const total = SAMPLE_TASKS.length;

  return (
    <div style={{ background: c.bg, color: c.text, fontFamily: '"Inter", system-ui, sans-serif' }} className="min-h-full text-[14px]">
      <div className="px-5 pt-6 pb-5" style={{ borderBottom: `1px solid ${c.hairline}` }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span style={{ background: c.accent }} className="w-1.5 h-1.5 rounded-full" />
            <span className="text-[11px] uppercase tracking-[0.12em] font-semibold" style={{ color: c.muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>
              Hoje · Seg 5 mai
            </span>
          </div>
          <span className="text-[11px] tnum font-mono" style={{ color: c.muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>
            {String(done).padStart(2,'0')} / {String(total).padStart(2,'0')}
          </span>
        </div>
        <h1 className="mt-3 text-[22px] font-semibold tracking-tight">
          Tarefas pendentes
        </h1>
        <div className="mt-3 h-px relative overflow-hidden" style={{ background: c.hairline }}>
          <div style={{ width: `${(done/total)*100}%`, background: c.accent, height: '100%' }} />
        </div>
      </div>

      <div>
        {grouped.map(([area, items], gi) => (
          <section key={area}>
            <div
              className="px-5 py-2 flex items-center justify-between"
              style={{ background: c.card, borderBottom: `1px solid ${c.hairline}`, borderTop: gi > 0 ? `1px solid ${c.hairline}` : 'none' }}
            >
              <span className="text-[10.5px] uppercase tracking-[0.12em] font-semibold" style={{ color: c.muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>
                {area}
              </span>
              <span className="text-[10.5px] tnum" style={{ color: c.subtle, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>
                {items.filter(t=>t.doneToday).length}/{items.length}
              </span>
            </div>
            <ul>
              {items.map((t, i) => (
                <li
                  key={t.id}
                  className="flex items-center gap-3 px-5 py-2.5"
                  style={{ borderBottom: i === items.length - 1 ? 'none' : `1px solid ${c.hairline}` }}
                >
                  <span
                    className="w-4 h-4 rounded-sm flex items-center justify-center shrink-0"
                    style={{
                      background: t.doneToday ? c.accent : 'transparent',
                      border: t.doneToday ? 'none' : `1.5px solid ${c.subtle}`,
                    }}
                  >
                    {t.doneToday && <Check size={10} strokeWidth={3} color={dark ? '#000' : '#fff'} />}
                  </span>
                  <span
                    className="flex-1 truncate"
                    style={{
                      color: t.doneToday ? c.muted : c.text,
                      textDecoration: t.doneToday ? 'line-through' : 'none',
                    }}
                  >
                    {t.name}
                  </span>
                  {t.notes && !t.doneToday && (
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded"
                      style={{ background: c.accentDim, color: c.accent, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
                    >
                      nota
                    </span>
                  )}
                  <span
                    className="text-[10.5px] tnum"
                    style={{ color: c.muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
                  >
                    {t.freq.slice(0,3).toLowerCase()}
                  </span>
                  <ChevronRight size={13} style={{ color: c.subtle }} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function group(tasks) {
  const g = {};
  tasks.forEach(t => { (g[t.area] ||= []).push(t); });
  return Object.entries(g);
}
