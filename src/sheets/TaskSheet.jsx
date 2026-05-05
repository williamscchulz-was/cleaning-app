import { useEffect, useState } from 'react';
import { Check, Trash2, X } from 'lucide-react';
import { AREAS, FREQUENCIES, FREQUENCY_KEYS } from '../lib/constants';

export default function TaskSheet({ open, task, onClose, onSave, onDelete }) {
  const [name, setName] = useState('');
  const [area, setArea] = useState(AREAS[0]);
  const [frequencyKey, setFrequencyKey] = useState('semanal');
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setName(task?.name || '');
      setArea(task?.area || AREAS[0]);
      setFrequencyKey(task?.frequencyKey || 'semanal');
      setNotes(task?.notes || '');
      setBusy(false);
    }
  }, [open, task]);

  if (!open) return null;
  const isEdit = !!task;

  async function handleSave() {
    if (!name.trim() || busy) return;
    setBusy(true);
    try {
      await onSave({
        id: task?.id,
        name: name.trim(),
        area,
        frequencyKey,
        notes: notes.trim(),
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
    <div className="absolute inset-0 z-30 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full surf-paper rounded-t-[28px] sheet-up max-h-[88%] overflow-y-auto no-scrollbar shadow-2xl"
      >
        <div className="sticky top-0 surf-paper px-5 pt-4 pb-3 flex items-center justify-between border-b bd-hairline">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full surf-elev flex items-center justify-center"
          >
            <X className="w-4 h-4 txt-primary" strokeWidth={2.2} />
          </button>
          <h2 className="font-display font-extrabold text-[16px] txt-primary">
            {isEdit ? 'Editar tarefa' : 'Nova tarefa'}
          </h2>
          <button
            onClick={handleSave}
            disabled={!name.trim() || busy}
            className="px-4 h-9 rounded-full surf-accent text-white font-display font-bold text-[13px] disabled:opacity-40"
          >
            {busy ? '...' : 'Salvar'}
          </button>
        </div>

        <div className="p-5 space-y-6">
          <div>
            <label className="font-display text-[11px] font-bold uppercase tracking-wider txt-muted ml-1">Nome</label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex.: Limpar a geladeira por dentro"
              className="mt-1.5 w-full surf-card rounded-2xl px-4 py-3 font-body text-[15px] txt-primary placeholder:txt-subtle outline-none transition shadow-card focus:shadow-[0_0_0_2px_var(--accent)]"
            />
          </div>

          <div>
            <label className="font-display text-[11px] font-bold uppercase tracking-wider txt-muted ml-1">Área</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {AREAS.map((a) => (
                <button
                  key={a}
                  onClick={() => setArea(a)}
                  className={`px-3.5 py-2 rounded-full font-body text-[13px] font-semibold transition ${area === a ? 'surf-accent text-white' : 'surf-card txt-primary shadow-card'}`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-display text-[11px] font-bold uppercase tracking-wider txt-muted ml-1">Frequência</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {FREQUENCY_KEYS.map((k) => {
                const f = FREQUENCIES[k];
                const active = frequencyKey === k;
                return (
                  <button
                    key={k}
                    onClick={() => setFrequencyKey(k)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-left transition shadow-card ${active ? 'surf-tint ring-2 ring-accent' : 'surf-card'}`}
                  >
                    <div>
                      <div className="font-display font-bold text-[14px] txt-primary">{f.label}</div>
                      <div className="font-body text-[11.5px] txt-muted mt-0.5">
                        {f.weeks === 1 ? 'toda semana' : `a cada ${f.weeks} semanas`}
                      </div>
                    </div>
                    {active && <Check className="w-4 h-4 txt-accent" strokeWidth={3} />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="font-display text-[11px] font-bold uppercase tracking-wider txt-muted ml-1">Observações</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Detalhes, lembretes, locais específicos…"
              rows={3}
              className="mt-1.5 w-full surf-card rounded-2xl px-4 py-3 font-body text-[14px] txt-primary placeholder:txt-subtle outline-none resize-none transition shadow-card focus:shadow-[0_0_0_2px_var(--accent)]"
            />
          </div>

          {isEdit && (
            <button
              onClick={handleDelete}
              disabled={busy}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl bg-rose-500/10 text-rose-500 font-display font-bold text-[13px] disabled:opacity-40"
            >
              <Trash2 className="w-4 h-4" strokeWidth={2.2} /> Excluir tarefa
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
