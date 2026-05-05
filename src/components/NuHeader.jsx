import { ArrowLeft, Eye, HelpCircle, ShieldCheck } from 'lucide-react';

export default function NuHeader({ person, subtitle, rightActions = true, onBack }) {
  return (
    <div className="relative px-5 pt-2 pb-7 surf-accent">
      <div className="flex items-center justify-between">
        {onBack ? (
          <button
            onClick={onBack}
            className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full active:bg-white/10 transition"
          >
            <ArrowLeft className="w-5 h-5 text-white" strokeWidth={2.2} />
          </button>
        ) : (
          <div className="relative">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center font-display font-bold text-[16px]"
              style={{ background: person.bg, color: person.textColor }}
            >
              {person.initial}
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-white ring-2 ring-accent" />
          </div>
        )}
        {rightActions && (
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-full flex items-center justify-center active:bg-white/10 transition">
              <Eye className="w-[18px] h-[18px] text-white" strokeWidth={2} />
            </button>
            <button className="w-9 h-9 rounded-full flex items-center justify-center active:bg-white/10 transition">
              <HelpCircle className="w-[18px] h-[18px] text-white" strokeWidth={2} />
            </button>
            <button className="w-9 h-9 rounded-full flex items-center justify-center active:bg-white/10 transition">
              <ShieldCheck className="w-[18px] h-[18px] text-white" strokeWidth={2} />
            </button>
          </div>
        )}
      </div>
      <div className="mt-7">
        <div className="font-display font-bold text-white text-[24px] leading-tight">
          Olá, {person.name}
        </div>
        {subtitle && (
          <div className="font-body text-white/85 text-[14px] mt-0.5">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}
