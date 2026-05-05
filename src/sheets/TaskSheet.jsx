import { useEffect, useState } from 'react';
import { Check, Trash2, X } from 'lucide-react';
import { AREAS, FREQUENCIES, FREQUENCY_KEYS } from '../lib/constants';

export default function TaskSheet({ open, task, onClose, onSave, onDelete }) {
  const [name, setName] = useState('');
  const [area, setArea] = useState(AREAS[0]);
  const [frequencyKey, setFrequencyKey] = useState('semanal');
  const [notes, setNotes] = useState('');
  const [lastDoneMode, setLastDoneMode] = useState('never'); // 'never' | 'today' | 'custom'
  const [lastDoneCustom, setLastDoneCustom] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setName(task?.name || '');
      setArea(task?.area || AREAS[0]);
      setFrequencyKey(task?.frequencyKey || 'semanal');
      setNotes(task?.notes || '');
      setLastDoneMode('never');
      setLastDoneCustom('');
      setBusy(false);
    }
  }, [open, task]);

  if (!open) return null;
  const isEdit = !!task;

  async function handleSave() {
    if (!name.trim() || busy) return;
    setBusy(true);
    try {
      let seedDate = null;
      if (!isEdit) {
        if (lastDoneMode === 'today') {
          seedDate = new Date();
        } else if (lastDoneMode === 'custom' && lastDoneCustom) {
          // <input type="date"> returns YYYY-MM-DD; treat as local midday to
          // avoid timezone slipping the date by one day.
          const [y, m, d] = lastDoneCustom.split('-').map(Number);
          seedDate = new Date(y, m - 1, d, 12, 0, 0);
        }
      }
      await onSave({
        id: task?.id,
        name: name.trim(),
        area,
        frequencyKey,
        notes: notes.trim(),
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
    <div className="fixed inset-0 z-30 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:w-[440px] sm:mb-6 surf-bg rounded-t-[28px] sm:rounded-[28px] sheet-up max-h-[88vh] overflow-y-auto no-scrollbar"
      >
        <div className="sticky top-0 z-10 surf-bg px-4 pt-3 pb-3 flex items-center justify-between border-b bd-hairline" style={{ borderBottomWidth: '0.5px' }}>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full surf-section flex items-center justify-center"
          >
            <X size={16} strokeWidth={2.4} />
          </button>
          <h2 className="text-[16px] font-semibold txt-primary">
            {isEdit ? 'Editar tarefa' : 'Nova tarefa'}
          </h2>
          <button
            onClick={handleSave}
            disabled={!name.trim() || busy}
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

          <Field label="Área">
            <div className="flex flex-wrap gap-2">
              {AREAS.map((a) => {
                const active = area === a;
                return (
                  <button
                    key={a}
                    onClick={() => setArea(a)}
                    className={`px-3.5 py-2 rounded-full text-[13.5px] font-medium transition ${active ? 'surf-accent text-white' : 'surf-card txt-primary'}`}
                  >
                    {a}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Frequência">
            <div className="grid grid-cols-2 gap-2">
              {FREQUENCY_KEYS.map((k) => {
                const f = FREQUENCIES[k];
                const active = frequencyKey === k;
                return (
                  <button
                    key={k}
                    onClick={() => setFrequencyKey(k)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-left transition ${active ? 'surf-accent-soft' : 'surf-card'}`}
                    style={active ? { boxShadow: '0 0 0 1.5px var(--accent) inset' } : undefined}
                  >
                    <div>
                      <div className="text-[14px] font-semibold txt-primary">{f.label}</div>
                      <div className="text-[11.5px] txt-muted mt-0.5">
                        {f.weeks === 1 ? 'toda semana' : `a cada ${f.weeks} semanas`}
                      </div>
                    </div>
                    {active && <Check size={16} className="txt-accent" strokeWidth={3} />}
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

function Field({ label, children }) {
  return (
    <div>
      <label className="text-[12px] font-semibold uppercase tracking-wider txt-muted ml-1">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
