// app/api/fetch-iocs/route.js
//
// POST /api/fetch-iocs
// Triggers the "Get IoC" workflow: calls every source stub in parallel,
// dedupes against the DB, persists new IoCs under a new fetch batch, and
// returns the combined result. A source failing or the DB write failing
// does not prevent the fetched list from being returned to the UI.

import { NextResponse } from 'next/server';
import { collectFromAllSources, partitionNewVsKnown } from '../../../lib/aggregator';
import { createFetchBatch, findExistingKeys, insertNewIocs, touchKnownIocs } from '../../../lib/db';

export async function POST() {
  // Step 1: gather IoCs from every source. Per-source failures are captured
  // as warnings, not fatal errors — we still want to return what succeeded.
  const { iocs: collectedIocs, errors: sourceErrors } = await collectFromAllSources();

  let batch = null;
  let newIocs = collectedIocs;
  let knownIocs = [];
  let dbWarning = null;

  // Step 2: persist to the DB. If this fails entirely (e.g. DATABASE_URL
  // missing/unreachable), we still return the fetched list so the UI isn't
  // blocked — just with a warning that nothing was saved.
  try {
    batch = await createFetchBatch();
    const existingKeys = await findExistingKeys(
      collectedIocs.map((i) => ({ type: i.type, value: i.value, source: i.source }))
    );
    const partitioned = partitionNewVsKnown(collectedIocs, existingKeys);
    newIocs = partitioned.newIocs;
    knownIocs = partitioned.knownIocs;

    await insertNewIocs(newIocs, batch.id);
    await touchKnownIocs(knownIocs);
  } catch (err) {
    console.error('fetch-iocs: DB persistence failed:', err);
    const reason = err.message?.includes('DATABASE_URL')
      ? 'DATABASE_URL is not configured on Vercel — add it in Project Settings → Environment Variables.'
      : err.message || 'Unknown error';
    dbWarning = `Fetched IoCs successfully, but saving to the database failed: ${reason}`;
  }

  const resultIocs = [
    ...newIocs.map((ioc) => ({ ...ioc, isNew: true })),
    ...knownIocs.map((ioc) => ({ ...ioc, isNew: false })),
  ];

  return NextResponse.json({
    batch,
    iocs: resultIocs,
    sourceErrors,
    dbWarning,
  });
}
