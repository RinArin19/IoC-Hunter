// lib/db.js
// Thin Postgres access layer for IoC Hunter. Connection is lazy (created on
// first use), so importing this module never requires DATABASE_URL to be set
// (important for `next build`, which should succeed without a live DB).

import { Pool } from '@neondatabase/serverless';

let pool;

function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error(
        'DATABASE_URL is not set. Configure it in your Vercel project (Neon/Vercel Postgres) or .env.local for local dev.'
      );
    }
    pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
  }
  return pool;
}

/** Creates a new fetch batch row and returns its id + created_at. */
export async function createFetchBatch() {
  const { rows } = await getPool().query(
    'INSERT INTO ioc_fetches (created_at) VALUES (now()) RETURNING id, created_at'
  );
  return rows[0];
}

/**
 * Given a list of {type, value, source} keys, returns the subset that
 * already exist in the iocs table (as a Set of "type|value|source" strings).
 */
export async function findExistingKeys(candidates) {
  if (candidates.length === 0) return new Set();

  const types = candidates.map((c) => c.type);
  const values = candidates.map((c) => c.value);
  const sources = candidates.map((c) => c.source);

  const { rows } = await getPool().query(
    `SELECT type, value, source FROM iocs
     WHERE (type, value, source) IN (
       SELECT * FROM UNNEST($1::text[], $2::text[], $3::text[])
     )`,
    [types, values, sources]
  );

  return new Set(rows.map((r) => `${r.type}|${r.value}|${r.source}`));
}

/** Inserts brand-new IoCs under the given fetch batch. */
export async function insertNewIocs(newIocs, batchId) {
  if (newIocs.length === 0) return;
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    for (const ioc of newIocs) {
      await client.query(
        `INSERT INTO iocs (type, value, source, first_seen, last_seen, fetch_batch_id, tags)
         VALUES ($1, $2, $3, $4, $4, $5, $6)
         ON CONFLICT (type, value, source) DO NOTHING`,
        [ioc.type, ioc.value, ioc.source, ioc.firstSeen, batchId, ioc.tags || []]
      );
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/** Bumps last_seen to now for IoCs that were seen again in this fetch. */
export async function touchKnownIocs(knownIocs) {
  if (knownIocs.length === 0) return;
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    for (const ioc of knownIocs) {
      await client.query(
        `UPDATE iocs SET last_seen = now()
         WHERE type = $1 AND value = $2 AND source = $3`,
        [ioc.type, ioc.value, ioc.source]
      );
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/** Lists IoCs with optional filters: { type, source, batchId, limit }.
 *  The `limit` parameter caps the number of rows returned (default: 5000).
 *  Pass a lower limit (e.g. 100) for the main UI fetch, and a higher one
 *  (or omit it) for exports.
 */
export async function listIocs(filters = {}) {
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
    params.push(filters.batchId);
    conditions.push(`fetch_batch_id = $${params.length}`);
  }

  const limit = Math.min(Number(filters.limit) || 5000, 10000);
  params.push(limit);

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const { rows } = await getPool().query(
    `SELECT id, type, value, source, first_seen, last_seen, fetch_batch_id, tags
     FROM iocs ${where}
     ORDER BY last_seen DESC NULLS LAST, id DESC
     LIMIT $${params.length}`,
    params
  );
  return rows;
}

/** Lists past fetch batches with their IoC counts, most recent first. */
export async function listBatches() {
  const { rows } = await getPool().query(
    `SELECT b.id, b.created_at, COUNT(i.id)::int AS ioc_count
     FROM ioc_fetches b
     LEFT JOIN iocs i ON i.fetch_batch_id = b.id
     GROUP BY b.id
     ORDER BY b.created_at DESC`
  );
  return rows;
}

export { getPool };
