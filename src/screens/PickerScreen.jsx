import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { PEOPLE, ROLE_KEYS } from '../lib/constants';

export default function PickerScreen({ onPick }) {
  const [busy, setBusy] = useState(null);

  async function handlePick(roleKey) {
    if (busy) return;
    setBusy(roleKey);
    try {
      await onPick(roleKey);
    } catch (err) {
      console.error('pickRole failed', err);
      setBusy(null);
    }
  }

  return (
    <>
      <div className="surf-accent px-5 pt-3 pb-12 fade-slide">
        <div className="font-display font-extrabold text-white text-[28px] leading-[1.1]">
          Olá!<br />Quem é você?
        </div>
        <p className="font-body text-white/80 text-[14px] mt-3 leading-relaxed">
          Toca no seu nome — vamos lembrar de você na próxima vez.
        </p>
      </div>

      <div className="px-5 -mt-6">
        <div className="surf-card rounded-2xl shadow-card overflow-hidden">
          {ROLE_KEYS.map((k, i) => {
            const p = PEOPLE[k];
            return (
              <button
                key={k}
                onClick={() => handlePick(k)}
                disabled={busy !== null}
                className={`w-full flex items-center gap-4 px-4 py-4 surf-hover transition disabled:opacity-50 ${i < ROLE_KEYS.length - 1 ? 'border-b bd-hairline' : ''}`}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-display font-extrabold text-[18px] shrink-0"
                  style={{ background: p.bg, color: p.textColor }}
                >
                  {p.initial}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-display font-bold text-[16px] txt-primary">
                    Sou {p.article} {p.name}
                  </div>
                  <div className="font-body text-[13px] txt-muted mt-0.5">
                    {p.role}
                  </div>
                </div>
                {busy === k ? (
                  <span className="text-[11px] txt-muted">Salvando…</span>
                ) : (
                  <ChevronRight className="w-5 h-5 txt-subtle" strokeWidth={2} />
                )}
              </button>
            );
          })}
        </div>

        <p className="text-center font-body text-[11.5px] txt-muted mt-6 px-6">
          Seu celular vai lembrar da sua escolha automaticamente
        </p>
      </div>
    </>
  );
}
