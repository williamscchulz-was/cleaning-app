import { RotateCcw } from 'lucide-react';
import { PrimaryButton } from '../components/primitives';
import { FREQUENCIES } from '../lib/constants';

export default function SkipSheet({ open, task, onClose, onConfirm }) {
  if (!open || !task) return null;
  const f = FREQUENCIES[task.frequencyKey];
  const nextLabel = f.weeks === 1 ? 'na próxima segunda' : `daqui ${f.weeks} semanas`;

  return (
    <div className="absolute inset-0 z-30 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full surf-paper rounded-t-[28px] sheet-up shadow-2xl pb-6"
      >
        <div className="px-5 pt-5 pb-4 text-center">
          <div className="mx-auto w-12 h-12 rounded-full surf-tint flex items-center justify-center">
            <RotateCcw className="w-5 h-5 txt-accent" strokeWidth={2.2} />
          </div>
          <h2 className="font-display font-extrabold text-[18px] txt-primary mt-3">
            Não consegui fazer hoje
          </h2>
          <p className="font-body text-[14px] txt-muted mt-1.5 leading-relaxed">
            <span className="font-bold txt-primary">{task.name}</span><br />
            vai voltar a aparecer {nextLabel}.
          </p>
        </div>
        <div className="px-4 space-y-2">
          <PrimaryButton onClick={onConfirm} fullWidth>Adiar pra próxima</PrimaryButton>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-full surf-elev txt-primary font-display font-bold text-[13px]"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
