import { jsPDF } from 'jspdf';

const ACCENT = [130, 10, 209];     // #820AD1
const ACCENT_SOFT = [240, 231, 251]; // #F0E7FB
const INK = [20, 20, 22];
const MUTED = [140, 140, 150];
const HAIR = [228, 228, 232];

// Draw a tiny house+sparkle mark using vector primitives (no SVG needed).
function drawMark(doc, x, y, s, color) {
  doc.setFillColor(...color);
  // roof triangle
  doc.triangle(x, y + s * 0.55, x + s / 2, y, x + s, y + s * 0.55, 'F');
  // body
  doc.rect(x + s * 0.16, y + s * 0.5, s * 0.68, s * 0.5, 'F');
  // sparkle dot
  doc.circle(x + s * 0.96, y + s * 0.1, s * 0.08, 'F');
}

// Build the daily list as a jsPDF document. Returns the doc (caller decides
// whether to share, download, or get a blob).
export function buildDailyPdf({ dateLabel, note, groups, assigneeName = 'Simone' }) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();   // 595
  const H = doc.internal.pageSize.getHeight();  // 842
  const M = 44;
  const contentW = W - M * 2;

  doc.setFont('helvetica', 'normal');

  // ── header band ──
  const bandH = 128;
  doc.setFillColor(...ACCENT);
  doc.rect(0, 0, W, bandH, 'F');

  drawMark(doc, M, 34, 20, [255, 255, 255]);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('Lumen', M + 30, 50);

  doc.setFontSize(24);
  doc.text('Tarefas do dia', M, 92);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(235, 222, 250);
  doc.text(`${dateLabel}  ·  para ${assigneeName}`, M, 112);

  let y = bandH + 30;

  // ── optional note ──
  if (note && note.trim()) {
    const lines = doc.splitTextToSize(note.trim(), contentW - 28);
    const boxH = 18 + lines.length * 15;
    doc.setFillColor(...ACCENT_SOFT);
    doc.roundedRect(M, y, contentW, boxH, 8, 8, 'F');
    doc.setTextColor(91, 22, 144);
    doc.setFontSize(12);
    doc.text(lines, M + 14, y + 22);
    y += boxH + 22;
  }

  // ── summary line ──
  const count = groups.reduce((n, [, items]) => n + items.length, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...INK);
  doc.text(`${count} ${count === 1 ? 'tarefa' : 'tarefas'} pra hoje`, M, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  doc.text('Marque conforme for fazendo', W - M, y, { align: 'right' });
  y += 22;

  // ── groups ──
  const bottomLimit = H - 56;
  const ensure = (needed) => {
    if (y + needed > bottomLimit) {
      doc.addPage();
      y = M + 8;
    }
  };

  groups.forEach(([area, items]) => {
    ensure(46);
    // area header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...ACCENT);
    doc.text(area.toUpperCase(), M, y);
    y += 8;
    doc.setDrawColor(...HAIR);
    doc.setLineWidth(0.8);
    doc.line(M, y, W - M, y);
    y += 16;

    items.forEach((t) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      const nameLines = doc.splitTextToSize(t.name, contentW - 90);
      const noteLines = t.notes ? doc.splitTextToSize(`↳ ${t.notes}`, contentW - 40) : [];
      const rowH = Math.max(18, nameLines.length * 15) + (noteLines.length ? noteLines.length * 13 + 2 : 0);
      ensure(rowH + 4);

      // checkbox
      doc.setDrawColor(190, 190, 196);
      doc.setLineWidth(1.4);
      doc.roundedRect(M, y - 10, 13, 13, 3, 3, 'S');

      // name
      doc.setTextColor(...INK);
      doc.text(nameLines, M + 24, y);

      // freq (right)
      if (t.freq) {
        doc.setFontSize(9.5);
        doc.setTextColor(...MUTED);
        doc.text(t.freq, W - M, y, { align: 'right' });
        doc.setFontSize(12);
      }

      let rowY = y + nameLines.length * 15;
      // notes
      if (noteLines.length) {
        doc.setFontSize(10);
        doc.setTextColor(...ACCENT);
        doc.text(noteLines, M + 24, rowY);
        rowY += noteLines.length * 13;
      }
      y = rowY + 8;
    });

    y += 10;
  });

  // ── footer on every page ──
  const pageCount = doc.internal.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setDrawColor(...HAIR);
    doc.setLineWidth(0.8);
    doc.line(M, H - 40, W - M, H - 40);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    doc.text(`Gerado pelo Lumen · ${dateLabel}`, M, H - 26);
    if (pageCount > 1) {
      doc.text(`${p}/${pageCount}`, W - M, H - 26, { align: 'right' });
    }
  }

  return doc;
}

// Share the PDF using the native share sheet (WhatsApp shows up there on
// mobile). Falls back to a download when file-sharing isn't supported.
// Returns 'shared' | 'downloaded' | 'cancelled'.
export async function sharePdf(doc, { filename, title, text }) {
  const blob = doc.output('blob');
  const file = new File([blob], filename, { type: 'application/pdf' });

  if (typeof navigator !== 'undefined' && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title, text });
      return 'shared';
    } catch (err) {
      if (err?.name === 'AbortError') return 'cancelled';
      // fall through to download on any share failure
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return 'downloaded';
}
