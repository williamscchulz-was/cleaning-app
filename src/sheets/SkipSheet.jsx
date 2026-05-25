import { RotateCcw } from 'lucide-react';
import { PrimaryButton } from '../components/ui';
import { FREQUENCIES } from '../lib/constants';

export default function SkipSheet({ open, task, onClose, onConfirm }) {
  if (!open || !task) return null;
  const f = FREQUENCIES[task.frequencyKey];
  const nextLabel = f.weeks === 1 ? 'na próxima segunda' : `daqui ${f.weeks} semanas`;

  return (
    <div className="fixed inset-0 z-30 flex items-end md:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full md:w-[440px] surf-bg rounded-t-[28px] md:rounded-[28px] sheet-up pb-6"
        style={{ boxShadow: '0 30px 80px -20px rgba(0,0,0,0.35)' }}
      >
        <div className="px-5 pt-5 pb-4 text-center">
          <div className="mx-auto w-12 h-12 rounded-full surf-accent-soft flex items-center justify-center">
            <RotateCcw size={20} className="txt-accent" strokeWidth={2.2} />
          </div>
          <h2 className="text-[18px] font-semibold mt-3 txt-primary">
            Não consegui fazer hoje
          </h2>
          <p className="text-[14px] txt-muted mt-1.5 leading-relaxed">
            <span className="font-semibold txt-primary">{task.name}</span><br />
            vai voltar a aparecer {nextLabel}.
          </p>
        </div>
        <div className="px-4 space-y-2">
          <PrimaryButton onClick={onConfirm} fullWidth>Adiar pra próxima</PrimaryButton>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-full surf-card txt-primary text-[14px] font-semibold"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
