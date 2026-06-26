// lib/db.js
// Thin Postgres access layer for IoC Hunter.
//
// Uses @neondatabase/serverless's `neon()` HTTP client instead of pg.Pool.
// Every query is a stateless HTTP request — this is the correct approach for:
//   - Vercel Node.js serverless functions (no persistent process)
//   - Neon free-tier compute auto-suspend (pool connections go stale; HTTP does not)
//
// "Connection terminated unexpectedly" is the classic pg.Pool symptom when
// Neon suspends and wakes up. The HTTP client avoids this entirely.

import { neon } from '@neondatabase/serverless';

let _sql;

function getSql() {
  if (!_sql) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error(
        'DATABASE_URL is not set. Add it in Vercel → Project → Settings → ' +
          'Environment Variables (use the Neon POOLER connection string), ' +
          'or in .env.local for local dev.'
      );
    }
    _sql = neon(connectionString);
  }
  return _sql;
}

/** Creates a new fetch batch row and returns its id + created_at. */
export async function createFetchBatch() {
  const sql = getSql();
  const rows = await sql`
    INSERT INTO ioc_fetches (created_at) VALUES (now())
    RETURNING id, created_at
  `;
  return rows[0];
}

/**
 * Given a list of {type, value, source} candidates, returns the subset that
 * already exist in the iocs table as a Set of "type|value|source" strings.
 */
export async function findExistingKeys(candidates) {
  if (candidates.length === 0) return new Set();

  const sql = getSql();
  const types   = candidates.map((c) => c.type);
  const values  = candidates.map((c) => c.value);
  const sources = candidates.map((c) => c.source);

  const rows = await sql`
    SELECT type, value, source FROM iocs
    WHERE (type, value, source) IN (
      SELECT * FROM UNNEST(${types}::text[], ${values}::text[], ${sources}::text[])
    )
  `;
  return new Set(rows.map((r) => `${r.type}|${r.value}|${r.source}`));
}

/**
 * Bulk-inserts brand-new IoCs under the given fetch batch using a single
 * UNNEST query — far faster than one INSERT per row and safe within
 * Vercel's function timeout limit.
 */
export async function insertNewIocs(newIocs, batchId) {
  if (newIocs.length === 0) return;

  const sql = getSql();
  const types      = newIocs.map((i) => i.type);
  const values     = newIocs.map((i) => i.value);
  const sources    = newIocs.map((i) => i.source);
  const firstSeens = newIocs.map((i) => i.firstSeen ?? new Date().toISOString());
  const batchIds   = newIocs.map(() => String(batchId));
  const tags       = newIocs.map((i) => i.tags || []);

  await sql`
    INSERT INTO iocs (type, value, source, first_seen, last_seen, fetch_batch_id, tags)
    SELECT
      t, v, s,
      fs::timestamptz, fs::timestamptz,
      bid::int,
      tg::text[]
    FROM UNNEST(
      ${types}::text[],
      ${values}::text[],
      ${sources}::text[],
      ${firstSeens}::text[],
      ${batchIds}::text[],
      ${tags}::text[][]
    ) AS u(t, v, s, fs, bid, tg)
    ON CONFLICT (type, value, source) DO NOTHING
  `;
}

/**
 * Bulk-bumps last_seen for IoCs that were seen again in this fetch.
 * Single UPDATE with UNNEST — avoids N separate queries.
 */
export async function touchKnownIocs(knownIocs) {
  if (knownIocs.length === 0) return;

  const sql = getSql();
  const types   = knownIocs.map((i) => i.type);
  const values  = knownIocs.map((i) => i.value);
  const sources = knownIocs.map((i) => i.source);

  await sql`
    UPDATE iocs SET last_seen = now()
    WHERE (type, value, source) IN (
      SELECT * FROM UNNEST(${types}::text[], ${values}::text[], ${sources}::text[])
    )
  `;
}

/** Lists IoCs with optional filters: { type, source, batchId, limit }.
 *  limit defaults to 5000 (max 10000). Pass 100 for the UI list endpoint.
 */
export async function listIocs(filters = {}) {
  const sql = getSql();
  const limit = Math.min(Number(filters.limit) || 5000, 10000);

  // Build the query dynamically based on which filters are present.
  // neon() tagged templates don't support dynamic WHERE easily, so we use
  // the .query() method (returns { rows }) for parameterised queries.
  const conditions = [];
  const params = [];

  if (filters.type) {
    params.push(filters.type);
    conditions.push(`type = $${params.length}`);
  }
  if (filters.source) {
    params.push(filters.source);
    conditions.push(`source = $${params.length}`);
  }
  if (filters.batchId) {
    params.push(Number(filters.batchId));
    conditions.push(`fetch_batch_id = $${params.length}`);
  }
  params.push(limit);

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const result = await sql.query(
    `SELECT id, type, value, source, first_seen, last_seen, fetch_batch_id, tags
     FROM iocs ${where}
     ORDER BY last_seen DESC NULLS LAST, id DESC
     LIMIT $${params.length}`,
    params
  );
  return result.rows;
}

/** Lists past fetch batches with their IoC counts, most recent first. */
export async function listBatches() {
  const sql = getSql();
  const rows = await sql`
    SELECT b.id, b.created_at, COUNT(i.id)::int AS ioc_count
    FROM ioc_fetches b
    LEFT JOIN iocs i ON i.fetch_batch_id = b.id
    GROUP BY b.id
    ORDER BY b.created_at DESC
  `;
  return rows;
}
