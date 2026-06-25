// lib/export.js
//
// Builds CSV and PDF exports from a list of IoC rows (as returned by
// lib/db.js#listIocs). Used by the /api/export/* routes.

import PDFDocument from 'pdfkit';

function csvEscape(value) {
  const str = String(value ?? '');
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/** Builds a CSV string from a list of IoC rows. Handles the empty case. */
export function toCsv(iocs) {
  const header = ['type', 'value', 'source', 'first_seen', 'last_seen', 'tags'];
  const lines = [header.join(',')];

  for (const ioc of iocs) {
    const tags = Array.isArray(ioc.tags) ? ioc.tags.join('|') : '';
    lines.push(
      [ioc.type, ioc.value, ioc.source, ioc.first_seen ?? '', ioc.last_seen ?? '', tags]
        .map(csvEscape)
        .join(',')
    );
  }

  return lines.join('\n') + '\n';
}

/** Builds a PDF buffer listing the given IoC rows. Handles the empty case. */
export function toPdf(iocs) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(16).text('IoC Hunter — Export', { align: 'left' });
    doc.fontSize(10).fillColor('gray').text(`Generated: ${new Date().toISOString()}`);
    doc.moveDown();
    doc.fillColor('black');

    if (iocs.length === 0) {
      doc.fontSize(12).text('No IoCs to display.');
      doc.end();
      return;
    }

    const colWidths = { type: 60, value: 220, source: 90, lastSeen: 130 };
    doc.fontSize(9).font('Helvetica-Bold');
    let y = doc.y;
    doc.text('Type', doc.x, y, { width: colWidths.type, continued: false });
    doc.text('Value', doc.x + colWidths.type, y, { width: colWidths.value });
    doc.text('Source', doc.x + colWidths.type + colWidths.value, y, { width: colWidths.source });
    doc.text('Last Seen', doc.x + colWidths.type + colWidths.value + colWidths.source, y, {
      width: colWidths.lastSeen,
    });
    doc.moveDown(0.5);
    doc.font('Helvetica');

    for (const ioc of iocs) {
      if (doc.y > 760) {
        doc.addPage();
      }
      const rowY = doc.y;
      doc.fontSize(8);
      doc.text(ioc.type, doc.x, rowY, { width: colWidths.type });
      doc.text(ioc.value, doc.x + colWidths.type, rowY, { width: colWidths.value });
      doc.text(ioc.source, doc.x + colWidths.type + colWidths.value, rowY, { width: colWidths.source });
      doc.text(
        ioc.last_seen ? new Date(ioc.last_seen).toISOString() : '',
        doc.x + colWidths.type + colWidths.value + colWidths.source,
        rowY,
        { width: colWidths.lastSeen }
      );
      doc.moveDown(0.3);
    }

    doc.end();
  });
}
