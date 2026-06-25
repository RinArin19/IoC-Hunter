// lib/sources/threatfox.js
//
// STUB: abuse.ch ThreatFox.
// Real integration would POST to https://threatfox-api.abuse.ch/api/v1/
// with { query: 'get_iocs', days: 1 }. ThreatFox's public API works without
// a key for read access, but an Auth-Key (process.env.THREATFOX_AUTH_KEY)
// raises rate limits. Treated as a stub for now until that's confirmed/added.
//
// Swap the body of fetchIocs() for a real fetch() call when ready.

import { randomIp, randomDomain, randomHex, recentTimestamp } from './_mock';

export const SOURCE_NAME = 'threatfox';

export async function fetchIocs() {
  if (!process.env.THREATFOX_AUTH_KEY) {
    return buildMockIocs();
  }

  // TODO: real implementation once wired up:
  // const res = await fetch('https://threatfox-api.abuse.ch/api/v1/', {
  //   method: 'POST',
  //   headers: { 'Auth-Key': process.env.THREATFOX_AUTH_KEY, 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ query: 'get_iocs', days: 1 }),
  // });
  // ...parse data into the common IoC shape...
  return buildMockIocs();
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
