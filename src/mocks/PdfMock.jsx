import { useMemo, useState } from 'react';
import { Download, Printer, Share2 } from 'lucide-react';
import { SAMPLE_TASKS, SAMPLE_TODAY } from './sample';

/* ───────────────────────────────────────────────────────────────────────
   MOCK of the "export daily list as PDF → send to Simone on WhatsApp" idea.
   Pure visual mock with sample data — nothing is wired to Firestore or to a
   real PDF generator yet. The white sheet below is the document layout that
   would become the PDF.                                                     */

const ACCENT = '#820AD1';

// Only the tasks that still need doing today (skip already-done in the
// printable list — Simone wants the to-do, not the done).
function useTodaysList() {
  return useMemo(() => {
    const pending = SAMPLE_TASKS.filter((t) => !t.doneToday);
    const byArea = {};
    pending.forEach((t) => { (byArea[t.area] ||= []).push(t); });
    return { groups: Object.entries(byArea), count: pending.length };
  }, []);
}

// House+sparkle logo (mono, for the document header).
function LogoMark({ size = 26, color = ACCENT }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" fill="none" aria-hidden>
      <path d="M 256 96 L 432 248 L 432 388 C 432 410.091 414.091 428 392 428 L 120 428 C 97.909 428 80 410.091 80 388 L 80 248 L 256 96 Z" fill={color} />
      <path d="M 220 308 C 220 288.118 236.118 272 256 272 C 275.882 272 292 288.118 292 308 L 292 428 L 220 428 L 220 308 Z" fill="#fff" />
      <path d="M 400 92 L 410 116 L 434 126 L 410 136 L 400 160 L 390 136 L 366 126 L 390 116 Z" fill={color} />
    </svg>
  );
}

export default function PdfMock() {
  const { groups, count } = useTodaysList();
  const [note, setNote] = useState('');

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col">
      {/* top bar */}
      <header className="bg-white border-b border-neutral-200 px-4 py-3">
        <div className="max-w-[820px] mx-auto">
          <div className="text-[12px] font-semibold uppercase tracking-wider text-neutral-500">
            Mock · Exportar lista do dia
          </div>
          <p className="text-[13px] text-neutral-500 mt-0.5">
            Pré-visualização do PDF que seria enviado pra Simone no WhatsApp.
          </p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto py-6 px-4">
        <div className="max-w-[820px] mx-auto">
          {/* optional message that would ride along on WhatsApp */}
          <div className="mb-5">
            <label className="text-[12px] font-semibold uppercase tracking-wider text-neutral-500 ml-1">
              Recadinho (opcional, vai no topo do PDF)
            </label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ex.: Oi Simone! Hoje foca na cozinha 💜"
              className="mt-1.5 w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-[15px] outline-none focus:border-[#820AD1] transition"
            />
          </div>

          {/* ───────── the document (this is the PDF) ───────── */}
          <div
            className="bg-white rounded-2xl mx-auto overflow-hidden"
            style={{
              maxWidth: 620,
              boxShadow: '0 12px 40px -8px rgba(0,0,0,0.18)',
            }}
          >
            {/* accent header band */}
            <div className="px-8 pt-7 pb-6" style={{ background: ACCENT }}>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
                  <LogoMark size={22} color="#fff" />
                </div>
                <span className="text-white text-[17px] font-bold tracking-tight">Lumen</span>
              </div>
              <h1 className="text-white text-[26px] font-bold mt-4 leading-tight">
                Tarefas do dia
              </h1>
              <p className="text-white/85 text-[14px] mt-1">
                {SAMPLE_TODAY} · para Simone
              </p>
            </div>

            <div className="px-8 py-6">
              {note.trim() && (
                <div
                  className="mb-6 rounded-xl px-4 py-3 text-[14px] leading-relaxed"
                  style={{ background: '#F0E7FB', color: '#5b1690' }}
                >
                  {note}
                </div>
              )}

              <div className="flex items-baseline justify-between mb-5">
                <span className="text-[14px] font-semibold text-neutral-700">
                  {count} {count === 1 ? 'tarefa' : 'tarefas'} pra hoje
                </span>
                <span className="text-[12px] text-neutral-400">
                  Marque conforme for fazendo
                </span>
              </div>

              <div className="space-y-6">
                {groups.map(([area, tasks]) => (
                  <section key={area}>
                    <h3
                      className="text-[12px] font-bold uppercase tracking-wider mb-2.5 pb-1.5 border-b"
                      style={{ color: ACCENT, borderColor: '#EEE' }}
                    >
                      {area}
                    </h3>
                    <ul className="space-y-2.5">
                      {tasks.map((t) => (
                        <li key={t.id} className="flex items-start gap-3">
                          {/* printable empty checkbox */}
                          <span
                            className="mt-0.5 w-[18px] h-[18px] rounded-[5px] border-2 shrink-0"
                            style={{ borderColor: '#C9C9CF' }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline justify-between gap-2">
                              <span className="text-[15px] text-neutral-900 leading-snug">
                                {t.name}
                              </span>
                              <span className="text-[11px] text-neutral-400 shrink-0">
                                {t.freq}
                              </span>
                            </div>
                            {t.notes && (
                              <div className="text-[12.5px] mt-0.5" style={{ color: ACCENT }}>
                                ↳ {t.notes}
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </div>

            {/* footer */}
            <div className="px-8 py-4 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-[11px] text-neutral-400">
                Gerado pelo Lumen · {SAMPLE_TODAY}
              </span>
              <LogoMark size={16} color="#C9C9CF" />
            </div>
          </div>

          <p className="text-center text-[12px] text-neutral-400 mt-4">
            ↑ É isso que vira o PDF. As ações abaixo são só ilustrativas no mock.
          </p>
        </div>
      </main>

      {/* sticky action bar — the share flow */}
      <footer className="bg-white border-t border-neutral-200 px-4 py-3" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 12px)' }}>
        <div className="max-w-[820px] mx-auto flex items-center gap-2">
          <button
            className="flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-full text-white text-[15px] font-semibold"
            style={{ background: '#25D366', boxShadow: '0 8px 20px -8px #25D366' }}
            onClick={() => alert('No app real: gera o PDF e abre o compartilhamento do celular (WhatsApp aparece na lista).')}
          >
            <Share2 size={18} strokeWidth={2.4} />
            Compartilhar no WhatsApp
          </button>
          <button
            className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-neutral-100 text-neutral-700"
            aria-label="Baixar PDF"
            onClick={() => alert('No app real: baixa o arquivo PDF.')}
          >
            <Download size={18} />
          </button>
          <button
            className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-neutral-100 text-neutral-700"
            aria-label="Imprimir"
            onClick={() => window.print()}
          >
            <Printer size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
}
