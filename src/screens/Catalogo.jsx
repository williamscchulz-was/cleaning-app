import { useMemo } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { FreqLabel, ListRow } from '../components/primitives';
import { AREAS, AREA_ICONS, ICON_FALLBACK } from '../lib/constants';

export default function Catalogo({ tasks, onAdd, onEdit, onBack }) {
  const grouped = useMemo(() => {
    const g = {};
    tasks.forEach((t) => { (g[t.area] ||= []).push(t); });
    return Object.entries(g).sort(
      ([a], [b]) => AREAS.indexOf(a) - AREAS.indexOf(b),
    );
  }, [tasks]);

  return (
    <>
      <div className="surf-accent px-5 pt-2 pb-7">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full active:bg-white/10 transition"
          >
            <ArrowLeft className="w-5 h-5 text-white" strokeWidth={2.2} />
          </button>
          <button
            onClick={onAdd}
            className="w-10 h-10 flex items-center justify-center rounded-full active:bg-white/10 transition"
          >
            <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
          </button>
        </div>
        <div className="mt-5">
          <div className="font-display font-extrabold text-white text-[24px] leading-tight">
            Catálogo
          </div>
          <div className="font-body text-white/85 text-[14px] mt-0.5">
            {tasks.length} {tasks.length === 1 ? 'tarefa cadastrada' : 'tarefas cadastradas'}
          </div>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="px-5 pt-12 text-center">
          <p className="font-display font-bold text-[16px] txt-primary">
            Nenhuma tarefa ainda
          </p>
          <p className="font-body text-[13px] txt-muted mt-1.5">
            Toque no <span className="font-bold">+</span> acima pra cadastrar a primeira.
          </p>
        </div>
      ) : (
        <div className="pb-24 -mt-2">
          {grouped.map(([area, items], gi) => {
            const Icon = AREA_ICONS[area] || ICON_FALLBACK;
            return (
              <section key={area} className="fade-slide" style={{ animationDelay: `${gi * 30}ms` }}>
                <div className="flex items-center gap-2 px-5 mt-6 mb-2.5">
                  <Icon className="w-[15px] h-[15px] txt-muted" strokeWidth={2.2} />
                  <h3 className="font-display font-extrabold text-[13px] uppercase tracking-wider txt-primary">
                    {area}
                  </h3>
                </div>
                <div className="mx-5 surf-card rounded-2xl shadow-card overflow-hidden">
                  {items.map((t, i) => (
                    <ListRow
                      key={t.id}
                      title={t.name}
                      description={null}
                      right={<FreqLabel freq={t.frequencyKey} />}
                      onClick={() => onEdit(t)}
                      isLast={i === items.length - 1}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
