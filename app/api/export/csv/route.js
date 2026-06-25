// app/api/export/csv/route.js
//
// GET /api/export/csv?type=ip&source=otx&batchId=3
// Exports the (optionally filtered) IoC list as a CSV file download.
// Returns a valid, empty-but-well-formed CSV if there are no matching IoCs,
// rather than erroring.

import { listIocs } from '../../../../lib/db';
import { toCsv } from '../../../../lib/export';

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
    console.error('GET /api/export/csv: DB read failed, exporting empty CSV', err);
    iocs = [];
  }

  const csv = toCsv(iocs);

  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="iocs-${Date.now()}.csv"`,
    },
  });
}
