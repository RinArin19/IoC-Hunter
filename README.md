# IoC Hunter

On-demand aggregation of Indicators of Compromise (IoCs) from public threat-intel
feeds, with CSV/PDF export for manual import into your own SIEM. This app never
calls your SIEM's API directly — it's fetch-and-export only, by design (see
`2026-06-24-ioc-hunter-design.md` for the full spec this was built from).

## What it does

1. Click **Get IoC** → pulls from six sources in parallel (currently stubbed —
   see below) → dedupes against everything already stored → saves new IoCs.
2. Browse/filter stored IoCs by type (`ip` / `domain` / `hash` / `email`) and source.
3. Export the current filtered view as CSV or PDF, then import that file into
   your SIEM yourself.
4. **History** page shows past fetch batches.

## Sources (currently stubs)

`lib/sources/otx.js`, `abuseipdb.js`, `threatfox.js`, `urlhaus.js`,
`malwarebazaar.js`, `email-placeholder.js` each return realistic mock data
until a real API key is set in the environment (see `.env.example`). Each
file has a `// TODO: real implementation` block showing exactly what to
swap in — same pattern as the WPScan stub in the CVE advisory tool.

**Caveat:** dedicated email-address IoC feeds are uncommon (unlike IP/domain/
hash feeds). `email-placeholder.js` is a placeholder until a real source is
found — see the comment at the top of that file.

## Local development

```bash
npm install
cp .env.example .env.local   # then fill in DATABASE_URL
npm run db:migrate           # applies sql/schema.sql
npm run dev                  # http://localhost:3000
```

## Running tests

```bash
npm test
```

Covers: source-stub output shape, aggregator dedupe logic (including
same-value-different-source and within-batch duplicate handling), the
`/api/fetch-iocs` route's behavior when a source fails or the DB write fails
entirely, and CSV/PDF export correctness (including the empty-list case).

## Deploying to Vercel

1. Push this project to a GitHub/GitLab/Bitbucket repo.
2. In Vercel, **New Project** → import that repo.
3. Add a Postgres database: Vercel dashboard → **Storage** → **Create
   Database** → **Postgres** (Neon-backed). Link it to this project — Vercel
   sets `DATABASE_URL` automatically.
4. After the first deploy, run the migration once against that database:
   ```bash
   DATABASE_URL="<connection string from Vercel>" npm run db:migrate
   ```
   (Run this locally, or via `vercel env pull` + the same command.)
5. (Optional) Add any of the API keys from `.env.example` as Vercel
   Environment Variables to swap a source from stub to live data.

## Project structure

```
app/
  page.js              Main page: Get IoC button, table, filters, exports
  history/page.js       Past fetch batches
  api/
    fetch-iocs/route.js  POST — runs the aggregation + persists results
    iocs/route.js        GET  — list/filter stored IoCs (or batch history)
    export/csv/route.js  GET  — CSV download
    export/pdf/route.js  GET  — PDF download
lib/
  sources/*.js          One stub module per feed
  aggregator.js         Parallel fetch + dedupe (pure logic is unit-tested)
  db.js                 Postgres access layer
  export.js             CSV/PDF builders
sql/
  schema.sql            Table definitions
  migrate.js            Applies schema.sql to DATABASE_URL
tests/                  Vitest suite
```

## Known limitations (by design, for this version)

- No SIEM API integration — export/import is manual, per the agreed workflow.
- No authentication — intended as a single-user internal tool.
- No scheduled/cron fetching — manual button-click only.
- A fetch batch's export (from the History page) only includes IoCs that were
  brand-new in that batch; IoCs seen again later keep their original batch.
  Use the main page's filters to export everything currently stored.
