import { Check } from 'lucide-react';
import { SAMPLE_TASKS } from './sample';

// A — Editorial Calm: serif title, sage accent, lots of whitespace, no header band.
export default function VariantA({ theme }) {
  const dark = theme === 'dark';
  const c = dark
    ? { bg: '#0F1411', text: '#E8E5DF', muted: '#7C857F', accent: '#88A89B', hairline: '#1E2521', card: '#161B17' }
    : { bg: '#FAF7F2', text: '#1F1D1A', muted: '#7B776F', accent: '#3D5447', hairline: '#E8E1D5', card: '#FFFFFF' };

  const grouped = group(SAMPLE_TASKS);
  const done = SAMPLE_TASKS.filter(t => t.doneToday).length;
  const total = SAMPLE_TASKS.length;

  return (
    <div style={{ background: c.bg, color: c.text, fontFamily: 'system-ui, -apple-system, sans-serif' }} className="min-h-full">
      <div className="px-7 pt-12 pb-8">
        <div style={{ color: c.muted }} className="text-[12px] uppercase tracking-[0.18em] font-medium">
          Segunda · 5 mai
        </div>
        <h1 style={{ fontFamily: '"Fraunces", "Iowan Old Style", Georgia, serif' }} className="mt-3 text-[42px] leading-[1.05] font-light">
          Bom dia,<br />Simone.
        </h1>
        <div style={{ color: c.muted }} className="mt-6 text-[14px] leading-relaxed max-w-[260px]">
          {total - done} {total - done === 1 ? 'tarefa pendente' : 'tarefas pendentes'} hoje. Sem pressa.
        </div>
      </div>

      <div style={{ background: c.hairline, height: 1 }} className="mx-7" />

      <div className="px-2 pt-2 pb-12">
        {grouped.map(([area, items]) => (
          <section key={area} className="mt-8">
            <div className="px-5 mb-3" style={{ color: c.accent, fontFamily: '"Fraunces", "Iowan Old Style", Georgia, serif' }}>
              <span className="text-[18px] italic font-light">{area}</span>
            </div>
            <ul>
              {items.map((t, i) => (
                <li key={t.id} className="px-5 py-3.5 flex items-start gap-4" style={{ borderTop: i === 0 ? 'none' : `1px solid ${c.hairline}` }}>
                  <span
                    className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      border: t.doneToday ? `1px solid ${c.accent}` : `1px solid ${c.muted}`,
                      background: t.doneToday ? c.accent : 'transparent',
                    }}
                  >
                    {t.doneToday && <Check size={11} strokeWidth={3} color={c.bg} />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-[15px] leading-snug"
                      style={{
                        color: t.doneToday ? c.muted : c.text,
                        textDecoration: t.doneToday ? 'line-through' : 'none',
                      }}
                    >
                      {t.name}
                    </div>
                    {!t.doneToday && t.notes && (
                      <div className="text-[12.5px] mt-1 italic" style={{ color: c.accent }}>
                        {t.notes}
                      </div>
                    )}
                  </div>
                  {!t.doneToday && (
                    <span className="text-[11px] mt-1" style={{ color: c.muted }}>
                      {t.freq}
                    </span>
                  )}
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
