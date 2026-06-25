// app/layout.js
import './globals.css';

export const metadata = {
  title: 'IoC Hunter',
  description: 'On-demand IoC aggregation for manual SIEM import.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="shell">
          <div className="topbar">
            <div className="brand">
              <span>IoC Hunter</span>
              <span className="dot">●</span>
            </div>
            <nav className="nav">
              <a href="/">Fetch</a>
              <a href="/history">History</a>
            </nav>
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
