// lib/sources/abuseipdb.js
//
// STUB: AbuseIPDB.
// Real integration would call https://api.abuseipdb.com/api/v2/blacklist
// using an API key from process.env.ABUSEIPDB_API_KEY (header: "Key").
// No key is configured yet, so this returns mock IP IoCs.
//
// Swap the body of fetchIocs() for a real fetch() call once
// ABUSEIPDB_API_KEY is available.

import { randomIp, recentTimestamp } from './_mock';

export const SOURCE_NAME = 'abuseipdb';

export async function fetchIocs() {
  if (!process.env.ABUSEIPDB_API_KEY) {
    return buildMockIocs();
  }

  // TODO: real implementation once ABUSEIPDB_API_KEY is available:
  // const res = await fetch('https://api.abuseipdb.com/api/v2/blacklist', {
  //   headers: { Key: process.env.ABUSEIPDB_API_KEY, Accept: 'application/json' },
  // });
  // ...parse the blacklist into the common IoC shape...
  return buildMockIocs();
}

function buildMockIocs() {
  const out = [];
  for (let i = 0; i < 6; i++) {
    out.push({
      type: 'ip',
      value: randomIp(),
      source: SOURCE_NAME,
      firstSeen: recentTimestamp(),
      tags: ['abuse-confidence-high'],
    });
  }
  return out;
}
