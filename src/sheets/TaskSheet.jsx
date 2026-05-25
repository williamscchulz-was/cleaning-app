import { useEffect, useState } from 'react';
import { Check, Trash2, X } from 'lucide-react';
import { AREAS, FREQUENCIES, FREQUENCY_KEYS, PEOPLE, ROLE_KEYS } from '../lib/constants';

export default function TaskSheet({ open, task, onClose, onSave, onDelete, defaultAreas }) {
  const [name, setName] = useState('');
  const [areas, setAreas] = useState(() => new Set());
  const [frequencyKey, setFrequencyKey] = useState('semanal');
  const [notes, setNotes] = useState('');
  const [assignedTo, setAssignedTo] = useState('simone');
  const [lastDoneMode, setLastDoneMode] = useState('never');
  const [lastDoneCustom, setLastDoneCustom] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setName(task?.name || '');
      const initialAreas = task?.areas ?? (defaultAreas ?? []);
      setAreas(new Set(initialAreas.filter((a) => AREAS.includes(a))));
      setFrequencyKey(task?.frequencyKey || 'semanal');
      setNotes(task?.notes || '');
      setAssignedTo(task?.assignedTo || 'simone');
      setLastDoneMode('never');
      setLastDoneCustom('');
      setBusy(false);
    }
  }, [open, task, defaultAreas]);

  if (!open) return null;
  const isEdit = !!task;

  function toggleArea(a) {
    setAreas((prev) => {
      const next = new Set(prev);
      if (next.has(a)) next.delete(a);
      else next.add(a);
      return next;
    });
  }

  async function handleSave() {
    if (!name.trim() || areas.size === 0 || busy) return;
    setBusy(true);
    try {
      let seedDate = null;
      if (!isEdit) {
        if (lastDoneMode === 'today') {
          seedDate = new Date();
        } else if (lastDoneMode === 'custom' && lastDoneCustom) {
          const [y, m, d] = lastDoneCustom.split('-').map(Number);
          seedDate = new Date(y, m - 1, d, 12, 0, 0);
        }
      }
      await onSave({
        id: task?.id,
        name: name.trim(),
        areas: Array.from(areas),
        frequencyKey,
        notes: notes.trim(),
        assignedTo,
        seedDate,
      });
    } catch (err) {
      console.error('save task failed', err);
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!isEdit || busy) return;
    setBusy(true);
    try {
      await onDelete(task.id);
    } catch (err) {
      console.error('delete task failed', err);
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-30 flex items-end md:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full md:w-[480px] md:max-h-[88vh] surf-bg rounded-t-[28px] md:rounded-[28px] sheet-up max-h-[88vh] overflow-y-auto no-scrollbar"
        style={{ boxShadow: '0 30px 80px -20px rgba(0,0,0,0.35)' }}
      >
        <div className="sticky top-0 z-10 surf-bg px-4 pt-3 pb-3 flex items-center justify-between border-b bd-hairline" style={{ borderBottomWidth: '0.5px' }}>
          <button
            onClick={onClose}
            aria-label="Cancelar"
            className="w-9 h-9 rounded-full surf-section flex items-center justify-center"
          >
            <X size={16} strokeWidth={2.4} />
          </button>
          <h2 className="text-[16px] font-semibold txt-primary">
            {isEdit ? 'Editar tarefa' : 'Nova tarefa'}
          </h2>
          <button
            onClick={handleSave}
            disabled={!name.trim() || areas.size === 0 || busy}
            className="px-3 h-9 rounded-full surf-accent text-white text-[14px] font-semibold disabled:opacity-40"
          >
            {busy ? '…' : 'Salvar'}
          </button>
        </div>

        <div className="p-4 space-y-6">
          <Field label="Nome">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex.: Limpar a geladeira por dentro"
              className="w-full surf-card rounded-xl px-4 py-3 text-[16px] txt-primary placeholder:txt-subtle outline-none focus:ring-accent transition"
            />
          </Field>

          <Field
            label="Áreas"
            hint={areas.size === 0
              ? 'Selecione pelo menos uma área.'
              : `${areas.size} ${areas.size === 1 ? 'área selecionada' : 'áreas selecionadas'}`}
          >
            <div className="flex flex-wrap gap-2">
              {AREAS.map((a) => {
                const active = areas.has(a);
                return (
                  <button
                    key={a}
                    onClick={() => toggleArea(a)}
                    className={`px-3.5 py-2 rounded-full text-[13.5px] font-medium transition ${active ? 'surf-accent text-white' : 'surf-card txt-primary'}`}
                  >
                    {a}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Frequência">
            <div className="surf-card rounded-xl overflow-hidden">
              {FREQUENCY_KEYS.map((k, i) => {
                const f = FREQUENCIES[k];
                const active = frequencyKey === k;
                const last = i === FREQUENCY_KEYS.length - 1;
                return (
                  <button
                    key={k}
                    onClick={() => setFrequencyKey(k)}
                    className={`w-full flex items-center gap-3 pl-4 pr-3 py-3 surf-hover transition text-left ${!last ? 'border-b bd-hairline' : ''}`}
                    style={!last ? { borderBottomWidth: '0.5px' } : undefined}
                  >
                    <div className="flex-1">
                      <div className="text-[15px] font-semibold txt-primary">{f.label}</div>
                      <div className="text-[12px] txt-muted mt-0.5">
                        {f.weeks === 1 ? 'toda semana' : `a cada ${f.weeks} semanas`}
                      </div>
                    </div>
                    <span
                      className="w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: active ? 'var(--accent)' : 'transparent',
                        border: active ? 'none' : '1.5px solid var(--text-subtle)',
                      }}
                    >
                      {active && <Check size={12} strokeWidth={3.5} color="#fff" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Pra quem">
            <div className="grid grid-cols-3 gap-2">
              {ROLE_KEYS.map((k) => {
                const p = PEOPLE[k];
                const active = assignedTo === k;
                return (
                  <button
                    key={k}
                    onClick={() => setAssignedTo(k)}
                    className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl transition ${active ? 'surf-accent-soft' : 'surf-card'}`}
                    style={active ? { boxShadow: '0 0 0 1.5px var(--accent) inset' } : undefined}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-[14px]"
                      style={{ background: p.bg, color: p.textColor }}
                    >
                      {p.initial}
                    </div>
                    <span className={`text-[12.5px] font-semibold ${active ? 'txt-accent' : 'txt-primary'}`}>
                      {p.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </Field>

          {!isEdit && (
            <Field label="Última vez feita">
              <p className="text-[12.5px] txt-muted -mt-0.5 mb-2 leading-snug">
                Se já foi feita antes, o próximo ciclo conta a partir desse dia.
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { k: 'never',  label: 'Nunca' },
                  { k: 'today',  label: 'Hoje' },
                  { k: 'custom', label: 'Outra data' },
                ].map(({ k, label }) => {
                  const active = lastDoneMode === k;
                  return (
                    <button
                      key={k}
                      onClick={() => setLastDoneMode(k)}
                      className={`px-3 py-2.5 rounded-xl text-[13.5px] font-semibold transition ${active ? 'surf-accent-soft txt-accent' : 'surf-card txt-primary'}`}
                      style={active ? { boxShadow: '0 0 0 1.5px var(--accent) inset' } : undefined}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              {lastDoneMode === 'custom' && (
                <input
                  type="date"
                  value={lastDoneCustom}
                  max={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setLastDoneCustom(e.target.value)}
                  className="mt-2 w-full surf-card rounded-xl px-4 py-3 text-[15px] txt-primary outline-none focus:ring-accent transition"
                />
              )}
            </Field>
          )}

          <Field label="Observações">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Detalhes, lembretes, locais específicos…"
              rows={3}
              className="w-full surf-card rounded-xl px-4 py-3 text-[15px] txt-primary placeholder:txt-subtle outline-none resize-none focus:ring-accent transition"
            />
          </Field>

          {isEdit && (
            <button
              onClick={handleDelete}
              disabled={busy}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl surf-card txt-danger text-[15px] font-semibold disabled:opacity-40"
            >
              <Trash2 size={16} strokeWidth={2.2} /> Excluir tarefa
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="text-[12px] font-semibold uppercase tracking-wider txt-muted ml-1">
        {label}
      </label>
      {hint && (
        <p className="text-[12px] txt-muted mt-0.5 ml-1">{hint}</p>
      )}
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
