import { useMemo } from 'react';
import { ChevronLeft, Plus } from 'lucide-react';
import { Row, TitleHeader } from '../components/ui';
import { AREAS, AREA_ICONS, FREQUENCIES, ICON_FALLBACK } from '../lib/constants';

export default function Catalogo({ tasks, onAdd, onEdit, onBack }) {
  const grouped = useMemo(() => {
    const g = {};
    tasks.forEach((t) => { (g[t.area] ||= []).push(t); });
    return Object.entries(g).sort(
      ([a], [b]) => AREAS.indexOf(a) - AREAS.indexOf(b),
    );
  }, [tasks]);

  return (
    <div className="pb-8">
      <div className="px-3 pt-2 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1 px-1 h-9 rounded-full active:scale-95 transition txt-accent">
          <ChevronLeft size={20} strokeWidth={2.5} />
          <span className="text-[15px] font-medium">Início</span>
        </button>
        <button
          onClick={onAdd}
          className="w-9 h-9 rounded-full surf-accent-soft txt-accent flex items-center justify-center active:scale-95 transition"
        >
          <Plus size={18} strokeWidth={2.5} />
        </button>
      </div>

      <TitleHeader
        kicker={`${tasks.length} ${tasks.length === 1 ? 'tarefa cadastrada' : 'tarefas cadastradas'}`}
        title="Catálogo"
      />

      {tasks.length === 0 ? (
        <div className="px-5 pt-12 text-center">
          <p className="text-[16px] font-semibold txt-primary">
            Nenhuma tarefa ainda
          </p>
          <p className="text-[13px] txt-muted mt-1.5">
            Toque no <span className="font-bold">+</span> acima pra cadastrar a primeira.
          </p>
        </div>
      ) : (
        <div className="space-y-7 mt-4">
          {grouped.map(([area, items]) => {
            const A = AREA_ICONS[area] || ICON_FALLBACK;
            return (
              <section key={area} className="px-4 fade-slide">
                <div className="flex items-center gap-2 px-4 mb-1.5">
                  <A size={13} className="txt-muted" strokeWidth={2.2} />
                  <h3 className="text-[13px] font-semibold uppercase tracking-wider txt-muted">
                    {area}
                  </h3>
                </div>
                <div className="surf-card rounded-xl overflow-hidden">
                  {items.map((t, i) => (
                    <Row
                      key={t.id}
                      title={t.name}
                      onClick={() => onEdit(t)}
                      isLast={i === items.length - 1}
                      trailingText={FREQUENCIES[t.frequencyKey]?.label}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
