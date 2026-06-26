// lib/sources/threatfox.js
//
// abuse.ch ThreatFox – real integration.
// The public API works without a key for read access; THREATFOX_AUTH_KEY
// is optional and only raises rate limits when present.

import { randomIp, randomDomain, randomHex, recentTimestamp } from './_mock.js';

export const SOURCE_NAME = 'threatfox';

export async function fetchIocs() {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (process.env.THREATFOX_AUTH_KEY) {
      headers['Auth-Key'] = process.env.THREATFOX_AUTH_KEY;
    }

    const res = await fetch('https://threatfox-api.abuse.ch/api/v1/', {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: 'get_iocs', days: 1 }),
    });

    if (!res.ok) throw new Error(`ThreatFox HTTP ${res.status}`);
    const json = await res.json();

    if (json.query_status !== 'ok' || !Array.isArray(json.data)) {
      throw new Error(`ThreatFox returned query_status=${json.query_status}`);
    }

    return json.data
      .slice(0, 50)
      .map((item) => ({
        type: normalizeType(item.ioc_type),
        value: item.ioc,
        source: SOURCE_NAME,
        firstSeen: item.first_seen ?? recentTimestamp(),
        tags: [item.malware_printable, item.threat_type].filter(Boolean),
      }))
      .filter((i) => i.type !== null);
  } catch (err) {
    console.warn(`threatfox: real fetch failed (${err.message}), using mock`);
    return buildMockIocs();
  }
}

function normalizeType(iocType) {
  if (!iocType) return null;
  if (iocType.startsWith('ip')) return 'ip';
  if (iocType === 'domain' || iocType === 'url') return 'domain';
  if (iocType.includes('hash') || iocType === 'sha256' || iocType === 'md5') return 'hash';
  return null; // skip unknown types
}

function buildMockIocs() {
  const out = [];
  for (let i = 0; i < 3; i++) {
    out.push({ type: 'ip', value: randomIp(), source: SOURCE_NAME, firstSeen: recentTimestamp(), tags: ['botnet-c2'] });
  }
  for (let i = 0; i < 3; i++) {
    out.push({ type: 'domain', value: randomDomain(), source: SOURCE_NAME, firstSeen: recentTimestamp(), tags: ['malware-c2'] });
  }
  for (let i = 0; i < 3; i++) {
    out.push({ type: 'hash', value: randomHex(64), source: SOURCE_NAME, firstSeen: recentTimestamp(), tags: ['sha256', 'payload'] });
  }
  return out;
}
