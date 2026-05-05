import { Check, MoreHorizontal } from 'lucide-react';
import { SAMPLE_TASKS } from './sample';

// D — Japandi: warm cream, terracotta accent, soft shadow, generous radius, like a notebook.
export default function VariantD({ theme }) {
  const dark = theme === 'dark';
  const c = dark
    ? { bg: '#1A1612', text: '#EFE8DD', muted: '#8C8479', subtle: '#403A33', accent: '#E08260', card: '#251F1A', hairline: '#33291F' }
    : { bg: '#F5EDE0', text: '#3B2F2F', muted: '#8B7E6F', subtle: '#C4B5A0', accent: '#B85C3D', card: '#FFFAF0', hairline: '#E8DBC5' };

  const grouped = group(SAMPLE_TASKS);
  const done = SAMPLE_TASKS.filter(t => t.doneToday).length;
  const total = SAMPLE_TASKS.length;
  const pct = Math.round((done/total)*100);

  return (
    <div style={{ background: c.bg, color: c.text, fontFamily: '"Inter", system-ui, sans-serif' }} className="min-h-full">
      <div className="px-6 pt-10 pb-6">
        <div style={{ color: c.accent }} className="text-[11px] uppercase tracking-[0.2em] font-bold">
          Segunda · 5 de maio
        </div>
        <h1 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }} className="mt-3 text-[36px] font-medium leading-tight">
          Olá, Simone.
        </h1>
        <p style={{ color: c.muted }} className="mt-2 text-[14px] leading-relaxed">
          Hoje tem {total} tarefas. {done > 0 && `${done} já foi.`}
        </p>
      </div>

      <div className="px-6 pb-2">
        <div
          className="rounded-2xl p-5 flex items-center gap-5"
          style={{ background: c.card, border: `1px solid ${c.hairline}` }}
        >
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
              <circle cx="18" cy="18" r="15" fill="none" stroke={c.subtle} strokeWidth="2" />
              <circle
                cx="18" cy="18" r="15" fill="none"
                stroke={c.accent}
                strokeWidth="2"
                strokeDasharray={`${pct * 0.94} 100`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-[14px] font-bold tnum" style={{ color: c.accent }}>
              {pct}%
            </span>
          </div>
          <div className="flex-1">
            <div className="text-[18px] font-semibold tnum">
              {done} <span style={{ color: c.muted }} className="font-normal">de {total}</span>
            </div>
            <div style={{ color: c.muted }} className="text-[12.5px] mt-0.5">
              Faltam {total-done}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pt-6 pb-12 space-y-5">
        {grouped.map(([area, items]) => (
          <section key={area}>
            <h3 style={{ color: c.accent }} className="text-[12px] font-semibold uppercase tracking-[0.15em] mb-2 pl-1">
              {area}
            </h3>
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: c.card, border: `1px solid ${c.hairline}` }}
            >
              {items.map((t, i) => (
                <div
                  key={t.id}
                  className="flex items-center gap-3 px-4 py-3.5"
                  style={{ borderTop: i === 0 ? 'none' : `1px solid ${c.hairline}` }}
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition"
                    style={{
                      background: t.doneToday ? c.accent : 'transparent',
                      border: t.doneToday ? 'none' : `1.5px solid ${c.subtle}`,
                    }}
                  >
                    {t.doneToday && <Check size={11} strokeWidth={3} color={c.card} />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-[14.5px] truncate"
                      style={{
                        color: t.doneToday ? c.muted : c.text,
                        textDecoration: t.doneToday ? 'line-through' : 'none',
                      }}
                    >
                      {t.name}
                    </div>
                    {!t.doneToday && t.notes && (
                      <div className="text-[12px] mt-0.5 truncate" style={{ color: c.accent }}>
                        {t.notes}
                      </div>
                    )}
                  </div>
                  {!t.doneToday && (
                    <span style={{ color: c.muted }} className="text-[11px]">
                      {t.freq}
                    </span>
                  )}
                  {!t.doneToday && (
                    <button style={{ color: c.muted }}>
                      <MoreHorizontal size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>
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
