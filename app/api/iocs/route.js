// app/api/iocs/route.js
//
// GET /api/iocs?type=ip&source=otx&batchId=3
// Lists stored IoCs, optionally filtered by type, source, and/or batch.

import { NextResponse } from 'next/server';
import { listIocs, listBatches } from '../../../lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  if (searchParams.get('batches') === 'true') {
    try {
      const batches = await listBatches();
      return NextResponse.json({ batches });
    } catch (err) {
      console.error('GET /api/iocs (batches): failed', err);
      return NextResponse.json({ error: 'Could not load fetch history.' }, { status: 500 });
    }
  }

  const filters = {
    type: searchParams.get('type') || undefined,
    source: searchParams.get('source') || undefined,
    batchId: searchParams.get('batchId') || undefined,
  };

  try {
    const iocs = await listIocs(filters);
    return NextResponse.json({ iocs });
  } catch (err) {
    console.error('GET /api/iocs: failed', err);
    return NextResponse.json({ error: 'Could not load IoCs from the database.' }, { status: 500 });
  }
}
