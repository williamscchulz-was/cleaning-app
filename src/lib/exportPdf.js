import { jsPDF } from 'jspdf';

const ACCENT = [130, 10, 209];   // #820AD1
const INK = [28, 28, 30];
const MUTED = [150, 150, 158];
const HAIR = [232, 232, 236];

// Clean, minimal daily list. White page, one accent colour used sparingly,
// generous spacing, big checkboxes — easy to read on a phone and to print in
// black & white. Returns the jsPDF doc.
export function buildDailyPdf({ dateLabel, note, groups, assigneeName = 'Simone' }) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();   // 595
  const H = doc.internal.pageSize.getHeight();  // 842
  const M = 48;
  const contentW = W - M * 2;
  let y = 64;

  // ── masthead ──
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...ACCENT);
  doc.text('L U M E N', M, y);
  y += 26;

  doc.setFontSize(28);
  doc.setTextColor(...INK);
  doc.text('Tarefas do dia', M, y);
  y += 20;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(...MUTED);
  doc.text(`${dateLabel}  ·  para ${assigneeName}`, M, y);
  y += 18;

  // accent rule
  doc.setDrawColor(...ACCENT);
  doc.setLineWidth(2);
  doc.line(M, y, M + 40, y);
  y += 26;

  // ── optional note ──
  if (note && note.trim()) {
    const lines = doc.splitTextToSize(note.trim(), contentW - 16);
    doc.setDrawColor(...ACCENT);
    doc.setLineWidth(2.5);
    doc.line(M, y - 8, M, y - 8 + lines.length * 16 + 4); // left accent bar
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(12);
    doc.setTextColor(...INK);
    doc.text(lines, M + 14, y + 4);
    y += lines.length * 16 + 22;
    doc.setFont('helvetica', 'normal');
  }

  // ── groups ──
  const bottomLimit = H - 60;
  const ensure = (needed) => {
    if (y + needed > bottomLimit) {
      doc.addPage();
      y = 64;
    }
  };

  const BOX = 15;       // checkbox size
  const ROW_GAP = 17;   // space between rows
  const LINE = 15;      // text line height

  groups.forEach(([area, items], gi) => {
    ensure(54);
    if (gi > 0) y += 8;

    // area label
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...ACCENT);
    doc.text(area.toUpperCase(), M, y);
    y += 18;

    items.forEach((t) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(13);
      const nameLines = doc.splitTextToSize(t.name, contentW - 34);
      const noteLines = t.notes ? doc.splitTextToSize(t.notes, contentW - 34) : [];
      const rowH = nameLines.length * LINE + (noteLines.length ? noteLines.length * 13 + 3 : 0);
      ensure(rowH + ROW_GAP);

      // checkbox aligned to first text line
      doc.setDrawColor(180, 180, 188);
      doc.setLineWidth(1.3);
      doc.roundedRect(M, y - 11, BOX, BOX, 3.5, 3.5, 'S');

      // task name
      doc.setTextColor(...INK);
      doc.text(nameLines, M + 28, y);

      let rowY = y + nameLines.length * LINE;
      if (noteLines.length) {
        doc.setFontSize(11);
        doc.setTextColor(...MUTED);
        doc.text(noteLines, M + 28, rowY + 1);
        rowY += noteLines.length * 13 + 1;
      }
      y = rowY + (ROW_GAP - LINE) + 6;
    });

    y += 8;
  });

  // ── footer on every page ──
  const pageCount = doc.internal.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setDrawColor(...HAIR);
    doc.setLineWidth(0.8);
    doc.line(M, H - 44, W - M, H - 44);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    doc.text(`Lumen · ${dateLabel}`, M, H - 30);
    if (pageCount > 1) {
      doc.text(`${p}/${pageCount}`, W - M, H - 30, { align: 'right' });
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
