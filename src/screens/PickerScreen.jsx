import { useState } from 'react';
import AppIcon from '../components/AppIcon';
import { Section, Row } from '../components/ui';
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
    <div className="pb-12">
      <div className="px-5 pt-10 pb-6">
        <AppIcon size={56} />
        <h1 className="mt-5 text-[34px] font-bold tracking-tight leading-tight">
          Quem é você?
        </h1>
        <p className="mt-2 text-[15px] txt-muted leading-relaxed">
          Toca no seu nome — a gente lembra de você na próxima vez.
        </p>
      </div>

      <Section title="">
        {ROLE_KEYS.map((k, i) => {
          const p = PEOPLE[k];
          return (
            <Row
              key={k}
              onClick={() => handlePick(k)}
              isLast={i === ROLE_KEYS.length - 1}
              leading={
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[16px] shrink-0"
                  style={{ background: p.bg, color: p.textColor }}
                >
                  {p.initial}
                </div>
              }
              title={`Sou ${p.article} ${p.name}`}
              subtitle={p.role}
              trailingText={busy === k ? 'Salvando…' : undefined}
            />
          );
        })}
      </Section>

      <p className="text-center text-[12px] txt-muted mt-6 px-6">
        Seu celular vai lembrar da sua escolha automaticamente.
      </p>
    </div>
  );
}
