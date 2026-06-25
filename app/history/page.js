// app/history/page.js
//
// Server-rendered list of past fetch batches. Marked force-dynamic since it
// reads the DB at request time — there's nothing to statically prerender,
// and `next build` must succeed even without a reachable DATABASE_URL.

import { listBatches } from '../../lib/db';

export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
  let batches = [];
  let error = null;
  try {
    batches = await listBatches();
  } catch (err) {
    error = err.message;
  }

  return (
    <main>
      <div className="panel">
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginTop: 0 }}>Fetch history</h2>

        {error && <div className="warning-banner">Could not load history: {error}</div>}

        {!error && batches.length === 0 && (
          <div className="empty-state">No fetches yet. Run &quot;Get IoC&quot; from the Fetch page.</div>
        )}

        {!error && batches.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Batch</th>
                <th>Fetched at</th>
                <th>New IoCs in this batch</th>
                <th>Export this batch</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((b) => (
                <tr key={b.id}>
                  <td>#{b.id}</td>
                  <td>{new Date(b.created_at).toLocaleString()}</td>
                  <td>{b.ioc_count}</td>
                  <td>
                    <a href={`/api/export/csv?batchId=${b.id}`}>CSV</a>
                    {' · '}
                    <a href={`/api/export/pdf?batchId=${b.id}`}>PDF</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <footer className="note">
          A batch&apos;s export only includes IoCs that were brand-new in that fetch. IoCs seen again in a later
          fetch keep their original batch — use the Fetch page&apos;s filters to export everything currently
          stored.
        </footer>
      </div>
    </main>
  );
}
