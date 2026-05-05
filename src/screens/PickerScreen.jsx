import { useState } from 'react';
import { Sparkles, User } from 'lucide-react';

const ROLES = [
  { key: 'simone', label: 'Simone', subtitle: 'Diarista' },
  { key: 'flavia', label: 'Flávia', subtitle: 'Admin' },
  { key: 'william', label: 'William', subtitle: 'Admin' },
];

export default function PickerScreen({ onPick }) {
  const [busy, setBusy] = useState(null);

  async function handlePick(roleKey) {
    if (busy) return;
    setBusy(roleKey);
    try {
      await onPick(roleKey);
    } catch (err) {
      console.error(err);
      setBusy(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#820AD1] text-white shadow-lg">
            <Sparkles size={26} />
          </div>
          <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">
            Quem está usando?
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Escolha uma vez — fica salvo neste aparelho.
          </p>
        </div>

        <div className="space-y-3">
          {ROLES.map((r) => (
            <button
              key={r.key}
              onClick={() => handlePick(r.key)}
              disabled={busy !== null}
              className="w-full flex items-center gap-4 rounded-2xl bg-white border border-neutral-200 px-4 py-4 text-left shadow-sm hover:border-[#820AD1] hover:shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F3E8FF] text-[#820AD1]">
                <User size={20} />
              </div>
              <div className="flex-1">
                <div className="font-medium text-neutral-900">{r.label}</div>
                <div className="text-xs text-neutral-500">{r.subtitle}</div>
              </div>
              {busy === r.key && (
                <div className="text-xs text-neutral-400">Salvando…</div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
