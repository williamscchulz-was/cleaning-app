import { Check, MoreHorizontal } from 'lucide-react';
import { SAMPLE_TASKS } from './sample';

// B — Bento Color: each area has a colored card, pastel/peach accent, playful but clean.
const AREA_COLORS_LIGHT = {
  'Sala':               { bg: '#FFF1E6', tint: '#FFB088', accent: '#C24A1A' },
  'Cozinha':            { bg: '#FFF8DB', tint: '#F2D45C', accent: '#8A6B0E' },
  'Quarto principal':   { bg: '#F0EBFF', tint: '#9F8AE0', accent: '#5236A8' },
  'Quarto Louise':      { bg: '#FFE8F0', tint: '#F0A5C6', accent: '#A83165' },
  'Banheiro principal': { bg: '#E0F2F1', tint: '#7AC9C5', accent: '#1B6E69' },
};
const AREA_COLORS_DARK = {
  'Sala':               { bg: '#2B1F18', tint: '#FF8B6B', accent: '#FFB088' },
  'Cozinha':            { bg: '#2A2415', tint: '#F2D45C', accent: '#FFE090' },
  'Quarto principal':   { bg: '#1F1A2E', tint: '#9F8AE0', accent: '#C9B8FF' },
  'Quarto Louise':      { bg: '#2B1822', tint: '#F0A5C6', accent: '#FFB8D2' },
  'Banheiro principal': { bg: '#152726', tint: '#7AC9C5', accent: '#A8DFDC' },
};

export default function VariantB({ theme }) {
  const dark = theme === 'dark';
  const palette = dark ? AREA_COLORS_DARK : AREA_COLORS_LIGHT;
  const ui = dark
    ? { bg: '#0A0A0A', text: '#F5F5F5', muted: '#888', card: '#1A1A1A', accent: '#FF8B6B' }
    : { bg: '#FFFFFF', text: '#1A1A1A', muted: '#7A7A7A', card: '#FFFFFF', accent: '#FF6B3D' };

  const grouped = group(SAMPLE_TASKS);
  const done = SAMPLE_TASKS.filter(t => t.doneToday).length;
  const total = SAMPLE_TASKS.length;

  return (
    <div style={{ background: ui.bg, color: ui.text, fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }} className="min-h-full">
      <div className="px-5 pt-8 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <div style={{ color: ui.muted }} className="text-[13px] font-medium">
              Segunda, 5 de maio
            </div>
            <h1 className="mt-1 text-[26px] font-bold tracking-tight">
              Olá, Simone 👋
            </h1>
          </div>
          <div className="text-right">
            <div className="text-[28px] font-bold tracking-tight tnum" style={{ color: ui.accent }}>
              {done}/{total}
            </div>
            <div style={{ color: ui.muted }} className="text-[11px]">
              feitas
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-12 grid grid-cols-1 gap-3">
        {grouped.map(([area, items]) => {
          const p = palette[area];
          const areaDone = items.filter(t => t.doneToday).length;
          return (
            <div
              key={area}
              className="rounded-3xl p-5"
              style={{ background: p.bg }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-[16px] font-bold" style={{ color: p.accent }}>
                    {area}
                  </div>
                  <div className="text-[11.5px] mt-0.5" style={{ color: p.accent, opacity: 0.7 }}>
                    {areaDone} de {items.length} feitas
                  </div>
                </div>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: p.tint, color: dark ? '#000' : '#fff' }}
                >
                  <span className="text-[13px] font-bold tnum">{areaDone}/{items.length}</span>
                </div>
              </div>
              <ul className="space-y-1.5">
                {items.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                    style={{ background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.6)' }}
                  >
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: t.doneToday ? p.tint : 'transparent',
                        border: t.doneToday ? 'none' : `1.5px solid ${p.tint}`,
                      }}
                    >
                      {t.doneToday && <Check size={11} strokeWidth={3} color={dark ? '#000' : '#fff'} />}
                    </span>
                    <span
                      className="flex-1 text-[14px] truncate"
                      style={{
                        color: t.doneToday ? p.accent : ui.text,
                        opacity: t.doneToday ? 0.55 : 1,
                        textDecoration: t.doneToday ? 'line-through' : 'none',
                      }}
                    >
                      {t.name}
                    </span>
                    {!t.doneToday && (
                      <button
                        className="w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ color: p.accent, opacity: 0.5 }}
                      >
                        <MoreHorizontal size={15} />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
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
