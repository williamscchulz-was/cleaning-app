import { ArrowLeft, Eye } from 'lucide-react';
import SimoneToday from './SimoneToday';

export default function Preview({ items, onBack }) {
  return (
    <div className="relative">
      <div className="sticky top-0 z-10 px-3 pt-2 pb-2 surf-bg flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1 px-1 h-9 rounded-full active:scale-95 transition txt-accent"
        >
          <ArrowLeft size={18} strokeWidth={2.5} />
          <span className="text-[15px] font-medium">Voltar</span>
        </button>
        <div className="inline-flex items-center gap-1.5 surf-accent-soft txt-accent rounded-full px-3 py-1 text-[11px] font-bold tracking-wider uppercase">
          <Eye size={12} strokeWidth={2.5} />
          Como Simone
        </div>
        <span className="w-9" />
      </div>
      <div className="opacity-95 pointer-events-none select-none">
        <SimoneToday items={items} readOnly />
      </div>
    </div>
  );
}
