// app/api/export/pdf/route.js
//
// GET /api/export/pdf?type=ip&source=otx&batchId=3
// Exports the (optionally filtered) IoC list as a PDF file download.
// Returns a valid, empty-but-well-formed PDF if there are no matching IoCs,
// rather than erroring.

import { listIocs } from '../../../../lib/db';
import { toPdf } from '../../../../lib/export';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const filters = {
    type: searchParams.get('type') || undefined,
    source: searchParams.get('source') || undefined,
    batchId: searchParams.get('batchId') || undefined,
  };

  let iocs = [];
  try {
    iocs = await listIocs(filters);
  } catch (err) {
    console.error('GET /api/export/pdf: DB read failed, exporting empty PDF', err);
    iocs = [];
  }

  const pdfBuffer = await toPdf(iocs);

  return new Response(pdfBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="iocs-${Date.now()}.pdf"`,
    },
  });
}
