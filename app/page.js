'use client';
// app/page.js
//
// Main screen: "Get IoC" triggers a fresh fetch from all sources; the table
// below shows either the result of that fetch or, by default, everything
// already stored. Type/Source filters browse stored IoCs (independent of
// the fetch action). Export buttons always export the current filter view.

import { useEffect, useState } from 'react';

const TYPE_OPTIONS = ['ip', 'domain', 'hash', 'email'];
const SOURCE_OPTIONS = ['otx', 'abuseipdb', 'threatfox', 'urlhaus', 'malwarebazaar', 'email-placeholder'];

export default function HomePage() {
  const [iocs, setIocs] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [sourceErrors, setSourceErrors] = useState([]);
  const [dbWarning, setDbWarning] = useState(null);
  const [fetchSummary, setFetchSummary] = useState(null);
  const [listError, setListError] = useState(null);

  async function loadStoredIocs(type, source) {
    setListLoading(true);
    setListError(null);
    try {
      const params = new URLSearchParams();
      if (type) params.set('type', type);
      if (source) params.set('source', source);
      const res = await fetch(`/api/iocs?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load IoCs.');
      setIocs(data.iocs);
    } catch (err) {
      setListError(err.message);
    } finally {
      setListLoading(false);
    }
  }

  useEffect(() => {
    loadStoredIocs('', '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleGetIoc() {
    setFetching(true);
    setSourceErrors([]);
    setDbWarning(null);
    setFetchSummary(null);
    try {
      const res = await fetch('/api/fetch-iocs', { method: 'POST' });
      const data = await res.json();
      setIocs(data.iocs);
      setFilterType('');
      setFilterSource('');
      setSourceErrors(data.sourceErrors || []);
      setDbWarning(data.dbWarning || null);
      const newCount = data.iocs.filter((i) => i.isNew).length;
      const knownCount = data.iocs.length - newCount;
      setFetchSummary({ newCount, knownCount });
    } catch (err) {
      setDbWarning(`Fetch failed: ${err.message}`);
    } finally {
      setFetching(false);
    }
  }

  function handleFilterChange(nextType, nextSource) {
    setFetchSummary(null);
    setFilterType(nextType);
    setFilterSource(nextSource);
    loadStoredIocs(nextType, nextSource);
  }

  function exportUrl(format) {
    const params = new URLSearchParams();
    if (filterType) params.set('type', filterType);
    if (filterSource) params.set('source', filterSource);
    return `/api/export/${format}?${params.toString()}`;
  }

  return (
    <main>
      <div className="panel">
        <div className="controls-row">
          <button
            className={`btn btn-primary ${fetching ? 'scanning' : ''}`}
            onClick={handleGetIoc}
            disabled={fetching}
          >
            {fetching ? 'Scanning feeds…' : 'Get IoC'}
          </button>

          <select value={filterType} onChange={(e) => handleFilterChange(e.target.value, filterSource)}>
            <option value="">All types</option>
            {TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select value={filterSource} onChange={(e) => handleFilterChange(filterType, e.target.value)}>
            <option value="">All sources</option>
            {SOURCE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <a className="btn btn-secondary" href={exportUrl('csv')}>
            Export CSV
          </a>
          <a className="btn btn-secondary" href={exportUrl('pdf')}>
            Export PDF
          </a>
        </div>

        {fetchSummary && (
          <p className="status-line" style={{ marginTop: -8, marginBottom: 14 }}>
            Fetched {fetchSummary.newCount} new IoC{fetchSummary.newCount === 1 ? '' : 's'}
            {fetchSummary.knownCount > 0 ? `, ${fetchSummary.knownCount} already known (last-seen updated)` : ''}.
          </p>
        )}

        {sourceErrors.length > 0 && (
          <div className="warning-banner">
            {sourceErrors.map((e, i) => (
              <div key={i}>
                Source &quot;{e.source}&quot; failed: {e.message}. Other sources still returned results.
              </div>
            ))}
          </div>
        )}

        {dbWarning && <div className="warning-banner">{dbWarning}</div>}
        {listError && <div className="warning-banner">{listError}</div>}

        {listLoading ? (
          <p className="status-line">Loading…</p>
        ) : iocs.length === 0 ? (
          <div className="empty-state">
            No IoCs stored yet. Click &quot;Get IoC&quot; to pull from threat-intel feeds.
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Value</th>
                <th>Source</th>
                <th>Last seen</th>
                <th>Tags</th>
              </tr>
            </thead>
            <tbody>
              {iocs.map((ioc, idx) => (
                <tr key={ioc.id ?? `${ioc.type}-${ioc.value}-${ioc.source}-${idx}`}>
                  <td>
                    <span className="type-pill">{ioc.type}</span>
                  </td>
                  <td className="ioc-value">{ioc.value}</td>
                  <td>{ioc.source}</td>
                  <td>
                    {'isNew' in ioc ? (
                      ioc.isNew ? (
                        <span className="new-chip">NEW</span>
                      ) : (
                        <span className="known-chip">SEEN AGAIN</span>
                      )
                    ) : ioc.last_seen ? (
                      new Date(ioc.last_seen).toLocaleString()
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>
                    {(ioc.tags || []).map((tag) => (
                      <span className="tag-chip" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <footer className="note">
          Export reflects the current Type/Source filter, not the SIEM. Import the file into your SIEM yourself —
          this app never calls your SIEM&apos;s API directly.
        </footer>
      </div>
    </main>
  );
}
