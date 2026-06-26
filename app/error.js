'use client';
// app/error.js
// Global error boundary for the App Router. Catches unhandled errors in the
// React tree and shows the actual error message instead of the generic
// Next.js "Application error: a client-side exception has occurred" page.

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body style={{ background: '#11151c', color: '#e6e9ee', fontFamily: 'ui-sans-serif, system-ui, sans-serif', padding: '48px 24px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h1 style={{ color: '#e2574c', fontSize: 20, marginBottom: 8 }}>Something went wrong</h1>
          <pre style={{
            background: '#1b212c',
            border: '1px solid #2b3340',
            borderRadius: 6,
            padding: '14px 16px',
            fontSize: 13,
            color: '#f2a39c',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}>
            {error?.message || String(error)}
          </pre>
          <button
            onClick={reset}
            style={{
              marginTop: 16,
              padding: '10px 18px',
              background: '#e8a33d',
              color: '#1b1303',
              border: 'none',
              borderRadius: 4,
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
