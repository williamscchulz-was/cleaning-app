import { ChevronRight, Eye, History, ListChecks, Plus } from 'lucide-react';
import NuHeader from '../components/NuHeader';
import { ListRow, QuickAction, SectionHeader } from '../components/primitives';
import { AREAS, AREA_ICONS, ICON_FALLBACK } from '../lib/constants';
import { formatDateBR } from '../lib/dates';

export default function AdminHome({ person, items, onAddTask, goTo }) {
  const today = new Date();
  const date = formatDateBR(today);
  const dueCount = items.filter(({ isDue, skippedToday }) => isDue && !skippedToday).length;
  const totalTasks = items.length;

  return (
    <>
      <NuHeader
        person={person}
        subtitle={`Hoje, ${date.weekday}, ${date.day} de ${date.month}`}
      />

      <div className="px-5 -mt-5 fade-slide">
        <div className="surf-card rounded-2xl shadow-card p-5">
          <div className="flex items-baseline justify-between">
            <div className="font-display font-extrabold text-[15px] txt-primary">
              Tarefas de hoje
            </div>
            <span className="font-body text-[12.5px] txt-muted">
              {totalTasks} no catálogo
            </span>
          </div>
          <div className="mt-3 font-display font-extrabold text-[36px] txt-primary leading-none tnum">
            {dueCount} <span className="font-body font-normal txt-muted text-[15px]">pra Simone hoje</span>
          </div>
          <button
            onClick={() => goTo('preview')}
            className="mt-4 w-full flex items-center justify-between px-4 py-3 surf-tint rounded-xl active:scale-[0.98] transition"
          >
            <span className="font-display font-bold text-[13.5px] txt-accent">
              Espiar a tela da Simone
            </span>
            <ChevronRight className="w-4 h-4 txt-accent" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="mt-7 flex items-start justify-around px-5">
        <QuickAction Icon={Plus}       label="Nova tarefa" onClick={onAddTask} />
        <QuickAction Icon={ListChecks} label="Catálogo"    onClick={() => goTo('tarefas')} />
        <QuickAction Icon={History}    label="Histórico"   onClick={() => goTo('historico')} />
        <QuickAction Icon={Eye}        label="Visualizar"  onClick={() => goTo('preview')} />
      </div>

      {totalTasks === 0 ? (
        <div className="mx-5 mt-8 surf-card rounded-2xl shadow-card p-6 text-center">
          <p className="font-display font-bold text-[16px] txt-primary">
            Nenhuma tarefa cadastrada
          </p>
          <p className="font-body text-[13px] txt-muted mt-1.5">
            Comece criando a primeira tarefa pra Simone.
          </p>
          <button
            onClick={onAddTask}
            className="mt-4 inline-flex items-center gap-2 px-5 h-11 rounded-full surf-accent text-white font-display font-bold text-[13px]"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Cadastrar primeira tarefa
          </button>
        </div>
      ) : (
        <>
          <SectionHeader title="Catálogo por área" action="Ver tudo" onAction={() => goTo('tarefas')} />
          <div className="mx-5 surf-card rounded-2xl shadow-card overflow-hidden">
            {AREAS.map((area, i) => {
              const count = items.filter((it) => it.task.area === area).length;
              if (count === 0) return null;
              const Icon = AREA_ICONS[area] || ICON_FALLBACK;
              return (
                <ListRow
                  key={area}
                  Icon={Icon}
                  title={area}
                  description={`${count} ${count === 1 ? 'tarefa' : 'tarefas'}`}
                  onClick={() => goTo('tarefas')}
                  isLast={i === AREAS.length - 1}
                />
              );
            })}
          </div>
        </>
      )}

      <div className="h-24" />
    </>
  );
}
