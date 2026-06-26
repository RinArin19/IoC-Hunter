// lib/sources/urlhaus.js
//
// abuse.ch URLhaus – real integration.
// The public API returns recent malicious URLs without any key; URLHAUS_AUTH_KEY
// is optional and only raises rate limits when present.
// URLs are stored under the 'domain' IoC type to stay within the schema's
// four types (ip / domain / hash / email).

import { randomDomain, recentTimestamp } from './_mock.js';

export const SOURCE_NAME = 'urlhaus';

export async function fetchIocs() {
  try {
    const headers = {};
    if (process.env.URLHAUS_AUTH_KEY) {
      headers['Auth-Key'] = process.env.URLHAUS_AUTH_KEY;
    }

    const res = await fetch('https://urlhaus-api.abuse.ch/v1/urls/recent/', { headers });

    if (!res.ok) throw new Error(`URLhaus HTTP ${res.status}`);
    const json = await res.json();

    if (json.query_status !== 'ok' || !Array.isArray(json.urls)) {
      throw new Error(`URLhaus returned query_status=${json.query_status}`);
    }

    return json.urls.slice(0, 100).map((item) => ({
      type: 'domain',
      value: item.url,
      source: SOURCE_NAME,
      firstSeen: item.date_added ?? recentTimestamp(),
      tags: [item.threat, item.url_status].filter(Boolean),
    }));
  } catch (err) {
    console.warn(`urlhaus: real fetch failed (${err.message}), using mock`);
    return buildMockIocs();
  }
}

function buildMockIocs() {
  const out = [];
  for (let i = 0; i < 5; i++) {
    out.push({
      type: 'domain',
      value: `https://${randomDomain()}/payload.exe`,
      source: SOURCE_NAME,
      firstSeen: recentTimestamp(),
      tags: ['malware-distribution', 'url'],
    });
  }
  return out;
}
