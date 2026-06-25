-- IoC Hunter schema (Vercel Postgres / Neon)

CREATE TABLE IF NOT EXISTS ioc_fetches (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS iocs (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('ip', 'domain', 'hash', 'email')),
  value TEXT NOT NULL,
  source TEXT NOT NULL,
  first_seen TIMESTAMPTZ,
  last_seen TIMESTAMPTZ,
  fetch_batch_id INTEGER NOT NULL REFERENCES ioc_fetches(id) ON DELETE CASCADE,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (type, value, source)
);

CREATE INDEX IF NOT EXISTS idx_iocs_type ON iocs (type);
CREATE INDEX IF NOT EXISTS idx_iocs_source ON iocs (source);
CREATE INDEX IF NOT EXISTS idx_iocs_batch ON iocs (fetch_batch_id);
