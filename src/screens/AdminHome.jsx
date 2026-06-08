import { ChevronRight, Eye, History, ListChecks, Plus, Share2, User } from 'lucide-react';
import { PrimaryButton, Row, Section, TitleHeader } from '../components/ui';
import { AREAS, AREA_ICONS, ICON_FALLBACK, PEOPLE } from '../lib/constants';
import { formatDateBR } from '../lib/dates';

export default function AdminHome({ person, role, items, onAddTask, onExport, goTo }) {
  const today = new Date();
  const date = formatDateBR(today);

  // Per-assignee counts of tasks pending today.
  const simoneDue = items.filter(
    ({ task, isDue, skippedToday }) => task.assignedTo === 'simone' && isDue && !skippedToday,
  ).length;
  const mineDue = items.filter(
    ({ task, isDue, skippedToday }) => task.assignedTo === role && isDue && !skippedToday,
  ).length;
  const mineTotal = items.filter(({ task }) => task.assignedTo === role).length;

  const totalTasks = items.length;

  return (
    <div className="pb-8">
      <TitleHeader
        kicker={`${date.weekday}, ${date.day} de ${date.month}`}
        title={`Olá, ${person.name}`}
      />

      {totalTasks === 0 ? (
        <div className="px-4 mt-7">
          <div className="surf-card rounded-xl p-6 text-center shadow-sm-token">
            <div className="w-12 h-12 rounded-full surf-accent-soft mx-auto flex items-center justify-center">
              <Plus className="w-5 h-5 txt-accent" strokeWidth={2.5} />
            </div>
            <p className="text-[17px] font-semibold mt-3">
              Nenhuma tarefa cadastrada
            </p>
            <p className="text-[13.5px] txt-muted mt-1.5">
              Comece criando a primeira tarefa.
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
          {/* Simone today card */}
          <div className="px-4 mt-7">
            <div className="surf-card rounded-xl p-5">
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] font-semibold uppercase tracking-wider txt-muted">
                  Pra Simone hoje
                </span>
                <span className="text-[12.5px] txt-muted">
                  {totalTasks} no catálogo
                </span>
              </div>
              {simoneDue > 0 ? (
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-[40px] font-bold tabular-nums leading-none txt-primary">
                    {simoneDue}
                  </span>
                  <span className="text-[14px] txt-muted">
                    {simoneDue === 1 ? 'tarefa pendente' : 'tarefas pendentes'}
                  </span>
                </div>
              ) : (
                <div className="mt-2">
                  <span className="text-[22px] font-semibold leading-tight txt-primary">
                    Tudo em dia
                  </span>
                  <p className="text-[13px] txt-muted mt-0.5">
                    Nenhuma tarefa pendente pra Simone hoje.
                  </p>
                </div>
              )}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => goTo('preview')}
                  className="pressable flex-1 flex items-center justify-center gap-2 h-10 rounded-lg surf-accent-soft"
                >
                  <Eye size={15} strokeWidth={2.4} className="txt-accent" />
                  <span className="text-[13.5px] font-semibold txt-accent">Espiar</span>
                </button>
                <button
                  onClick={onExport}
                  className="pressable flex-1 flex items-center justify-center gap-2 h-10 rounded-lg surf-accent-soft"
                >
                  <Share2 size={15} strokeWidth={2.4} className="txt-accent" />
                  <span className="text-[13.5px] font-semibold txt-accent">Enviar lista</span>
                </button>
              </div>
            </div>
          </div>

          {/* "Minhas tarefas" — only show if admin has any task assigned to them. */}
          {mineTotal > 0 && (
            <div className="px-4 mt-3">
              <div className="surf-card rounded-xl p-5 shadow-sm-token">
                <div className="flex items-baseline justify-between">
                  <span className="text-[13px] font-semibold uppercase tracking-wider txt-muted">
                    Pra mim hoje
                  </span>
                  <span className="text-[12.5px] txt-muted">
                    {mineTotal} {mineTotal === 1 ? 'tarefa' : 'tarefas'}
                  </span>
                </div>
                {mineDue > 0 ? (
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-[40px] font-bold tabular-nums leading-none txt-primary">
                      {mineDue}
                    </span>
                    <span className="text-[14px] txt-muted">
                      {mineDue === 1 ? 'pendente' : 'pendentes'}
                    </span>
                  </div>
                ) : (
                  <div className="mt-2">
                    <span className="text-[18px] font-semibold leading-tight txt-primary">
                      Tudo em dia
                    </span>
                  </div>
                )}
                <button
                  onClick={() => goTo('mine')}
                  className="pressable mt-4 w-full flex items-center justify-between px-3 h-10 rounded-lg surf-accent-soft"
                >
                  <span className="text-[14px] font-semibold txt-accent flex items-center gap-2">
                    <User size={15} strokeWidth={2.4} />
                    Abrir minhas tarefas
                  </span>
                  <ChevronRight size={15} className="txt-accent" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          )}

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
            {AREAS.filter((area) => items.some((it) => it.task.areas?.includes(area)))
              .map((area, idx, visibleAreas) => {
                const count = items.filter((it) => it.task.areas?.includes(area)).length;
                const A = AREA_ICONS[area] || ICON_FALLBACK;
                return (
                  <Row
                    key={area}
                    leading={<Icon Comp={A} />}
                    title={area}
                    subtitle={`${count} ${count === 1 ? 'tarefa' : 'tarefas'}`}
                    onClick={() => goTo('tarefas')}
                    isLast={idx === visibleAreas.length - 1}
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
