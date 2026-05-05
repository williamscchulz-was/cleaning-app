import { Eye, History, ListChecks, Plus } from 'lucide-react';
import { Pill, PrimaryButton, Row, Section, TitleHeader } from '../components/ui';
import { AREAS, AREA_ICONS, ICON_FALLBACK } from '../lib/constants';
import { formatDateBR } from '../lib/dates';

export default function AdminHome({ person, items, onAddTask, goTo }) {
  const today = new Date();
  const date = formatDateBR(today);
  const dueCount = items.filter(({ isDue, skippedToday }) => isDue && !skippedToday).length;
  const totalTasks = items.length;

  return (
    <div className="pb-8">
      <TitleHeader
        kicker={`${date.weekday}, ${date.day} de ${date.month}`}
        title={`Olá, ${person.name}`}
        right={<Pill>Hoje</Pill>}
      />

      {totalTasks === 0 ? (
        <div className="px-4 mt-7">
          <div className="surf-card rounded-xl p-6 text-center">
            <div className="w-12 h-12 rounded-full surf-accent-soft mx-auto flex items-center justify-center">
              <Plus className="w-5 h-5 txt-accent" strokeWidth={2.5} />
            </div>
            <p className="text-[17px] font-semibold mt-3">
              Nenhuma tarefa cadastrada
            </p>
            <p className="text-[13.5px] txt-muted mt-1.5">
              Comece criando a primeira tarefa pra Simone.
            </p>
            <div className="mt-4">
              <PrimaryButton onClick={onAddTask} leadingIcon={Plus}>
                Cadastrar primeira tarefa
              </PrimaryButton>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="px-4 mt-7">
            <div className="surf-card rounded-xl p-5">
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] font-semibold uppercase tracking-wider txt-muted">
                  Tarefas de hoje
                </span>
                <span className="text-[12.5px] txt-muted">
                  {totalTasks} no catálogo
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-[40px] font-bold tabular-nums leading-none txt-primary">
                  {dueCount}
                </span>
                <span className="text-[14px] txt-muted">
                  pra Simone hoje
                </span>
              </div>
              <button
                onClick={() => goTo('preview')}
                className="mt-4 w-full flex items-center justify-between px-3 h-10 rounded-lg surf-accent-soft active:scale-[0.99] transition"
              >
                <span className="text-[14px] font-semibold txt-accent flex items-center gap-2">
                  <Eye size={15} strokeWidth={2.4} />
                  Espiar a tela da Simone
                </span>
              </button>
            </div>
          </div>

          <Section title="Acesso rápido">
            <Row
              leading={<Icon Comp={Plus} />}
              title="Nova tarefa"
              onClick={onAddTask}
            />
            <Row
              leading={<Icon Comp={ListChecks} />}
              title="Catálogo"
              subtitle={`${totalTasks} ${totalTasks === 1 ? 'tarefa' : 'tarefas'}`}
              onClick={() => goTo('tarefas')}
            />
            <Row
              leading={<Icon Comp={History} />}
              title="Histórico"
              onClick={() => goTo('historico')}
              isLast
            />
          </Section>

          <Section title="Catálogo por área" right={
            <button onClick={() => goTo('tarefas')} className="text-[14px] font-semibold txt-accent">
              Ver tudo
            </button>
          }>
            {AREAS.map((area, i) => {
              const count = items.filter((it) => it.task.area === area).length;
              if (count === 0) return null;
              const A = AREA_ICONS[area] || ICON_FALLBACK;
              const visibleAreas = AREAS.filter((a) => items.some((it) => it.task.area === a));
              const lastIdx = visibleAreas.length - 1;
              return (
                <Row
                  key={area}
                  leading={<Icon Comp={A} />}
                  title={area}
                  subtitle={`${count} ${count === 1 ? 'tarefa' : 'tarefas'}`}
                  onClick={() => goTo('tarefas')}
                  isLast={visibleAreas.indexOf(area) === lastIdx}
                />
              );
            })}
          </Section>
        </>
      )}
    </div>
  );
}

function Icon({ Comp }) {
  return (
    <div className="w-9 h-9 rounded-full surf-section flex items-center justify-center shrink-0">
      <Comp size={17} className="txt-primary" strokeWidth={2} />
    </div>
  );
}
