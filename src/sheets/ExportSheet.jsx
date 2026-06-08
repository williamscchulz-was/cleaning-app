import { useMemo, useState } from 'react';
import { FileText, MessageSquareText, Share2, X } from 'lucide-react';
import {
  buildDailyText, buildExportGroups, pdfFilename, shareTextMessage, todayLabel,
} from '../lib/exportData';
import { haptics } from '../lib/haptics';

// Bottom sheet to send Simone the day's list — as a WhatsApp message (text)
// or as a PDF. Text shares instantly (lands in the chat); PDF lazy-loads
// jsPDF only when chosen. Both go through the native share sheet on mobile.
export default function ExportSheet({ open, items, onClose, showToast }) {
  const [note, setNote] = useState('');
  const [format, setFormat] = useState('texto'); // 'texto' | 'pdf'
  const [busy, setBusy] = useState(false);

  const { groups, count } = useMemo(
    () => (open ? buildExportGroups(items, 'simone') : { groups: [], count: 0 }),
    [open, items],
  );

  if (!open) return null;

  async function handleShare() {
    if (busy || count === 0) return;
    setBusy(true);
    try {
      if (format === 'texto') {
        const text = buildDailyText({ dateLabel: todayLabel(), note, groups, assigneeName: 'Simone' });
        const result = await shareTextMessage(text);
        haptics.medium();
        if (result === 'copied') showToast?.({ message: 'Texto copiado — cole no WhatsApp.' });
        else if (result === 'whatsapp') showToast?.({ message: 'Abrindo o WhatsApp…' });
        else if (result === 'shared') showToast?.({ message: 'Lista compartilhada!' });
        else if (result === 'failed') { haptics.error(); showToast?.({ message: 'Não consegui compartilhar.' }); }
        if (result !== 'cancelled' && result !== 'failed') onClose();
      } else {
        const { buildDailyPdf, sharePdf } = await import('../lib/exportPdf');
        const doc = buildDailyPdf({ dateLabel: todayLabel(), note, groups, assigneeName: 'Simone' });
        const result = await sharePdf(doc, {
          filename: pdfFilename(),
          title: 'Tarefas do dia — Simone',
          text: 'Tarefas do dia pra Simone 💜',
        });
        haptics.medium();
        if (result === 'downloaded') showToast?.({ message: 'PDF baixado — anexe no WhatsApp.' });
        else if (result === 'shared') showToast?.({ message: 'Lista compartilhada!' });
        if (result !== 'cancelled') onClose();
      }
    } catch (err) {
      console.error('export failed', err);
      haptics.error();
      showToast?.({ message: 'Não consegui gerar — tenta de novo.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end md:items-center justify-center" onClick={onClose}>
      <div className="backdrop-in absolute inset-0 bg-black/40" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full md:w-[460px] surf-bg rounded-t-[28px] md:rounded-[28px] sheet-up pb-4"
        style={{
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)',
          boxShadow: '0 30px 80px -20px rgba(0,0,0,0.35)',
        }}
      >
        <div className="md:hidden flex justify-center pt-2.5 pb-1">
          <span className="w-9 h-1 rounded-full" style={{ background: 'var(--text-subtle)' }} />
        </div>

        <div className="flex items-center justify-between px-4 pt-2 pb-3 border-b bd-hairline" style={{ borderBottomWidth: '0.5px' }}>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="pressable w-9 h-9 rounded-full surf-section flex items-center justify-center"
          >
            <X size={16} strokeWidth={2.4} />
          </button>
          <h2 className="text-[16px] font-semibold txt-primary">Enviar pra Simone</h2>
          <span className="w-9" />
        </div>

        <div className="px-4 pt-4">
          {/* format toggle */}
          <div className="surf-section rounded-xl p-1 flex gap-1">
            <FormatTab
              active={format === 'texto'}
              onClick={() => setFormat('texto')}
              Icon={MessageSquareText}
              label="Texto"
            />
            <FormatTab
              active={format === 'pdf'}
              onClick={() => setFormat('pdf')}
              Icon={FileText}
              label="PDF"
            />
          </div>

          <p className="mt-3 text-[13px] txt-muted leading-relaxed">
            {format === 'texto'
              ? 'Manda a lista como mensagem — aparece direto no chat, sem baixar nada.'
              : 'Gera um PDF limpo com checkboxes pra ela marcar. Bom pra imprimir.'}
          </p>

          <div className="mt-4 surf-card rounded-xl px-4 py-3.5 flex items-center justify-between shadow-sm-token">
            <span className="text-[15px] txt-primary font-medium">Tarefas de hoje</span>
            <span className="text-[15px] font-bold tabular-nums txt-accent">{count}</span>
          </div>

          <div className="mt-4">
            <label className="text-[12px] font-semibold uppercase tracking-wider txt-muted ml-1">
              Recadinho (opcional)
            </label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ex.: Oi Simone! Hoje foca na cozinha 💜"
              className="mt-1.5 w-full surf-card rounded-xl px-4 py-3 text-[16px] txt-primary placeholder:txt-subtle outline-none focus:ring-accent transition"
            />
          </div>

          <button
            onClick={handleShare}
            disabled={busy || count === 0}
            className="pressable-lg mt-5 w-full inline-flex items-center justify-center gap-2 h-12 rounded-full text-white text-[15px] font-semibold disabled:opacity-40"
            style={{ background: '#25D366', boxShadow: count === 0 ? 'none' : '0 8px 20px -8px #25D366' }}
          >
            <Share2 size={18} strokeWidth={2.4} />
            {busy ? 'Gerando…' : 'Compartilhar no WhatsApp'}
          </button>

          {count === 0 && (
            <p className="text-center text-[12.5px] txt-muted mt-3">
              Nenhuma tarefa pendente pra Simone hoje.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function FormatTab({ active, onClick, Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-lg text-[14px] font-semibold transition ${
        active ? 'surf-card txt-accent shadow-sm-token' : 'txt-muted'
      }`}
    >
      <Icon size={16} strokeWidth={2.2} />
      {label}
    </button>
  );
}
