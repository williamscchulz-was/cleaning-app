import { ArrowLeft, Eye } from 'lucide-react';
import SimoneToday from './SimoneToday';

export default function Preview({ items, onBack }) {
  return (
    <div className="relative">
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 inline-flex items-center gap-1.5 surf-invert rounded-full px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase shadow-lg">
        <Eye className="w-3 h-3" strokeWidth={2.5} /> Visualizando como Simone
      </div>
      <div className="opacity-95 pointer-events-none select-none">
        <SimoneToday items={items} readOnly />
      </div>
      <button
        onClick={onBack}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-2 px-5 h-11 rounded-full surf-invert font-display font-bold text-[13px] shadow-lg active:scale-[0.98] transition"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={2.5} /> Voltar para admin
      </button>
    </div>
  );
}
