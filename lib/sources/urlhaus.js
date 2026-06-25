// lib/sources/urlhaus.js
//
// STUB: abuse.ch URLhaus.
// Real integration would call https://urlhaus-api.abuse.ch/v1/urls/recent/
// (an Auth-Key via process.env.URLHAUS_AUTH_KEY raises rate limits).
// URLs are stored under the 'domain' IoC type (value holds the full
// malicious URL, not just the bare domain) to keep the schema's type set
// small (ip / domain / hash / email).
//
// Swap the body of fetchIocs() for a real fetch() call when ready.

import { randomDomain, recentTimestamp } from './_mock';

export const SOURCE_NAME = 'urlhaus';

export async function fetchIocs() {
  if (!process.env.URLHAUS_AUTH_KEY) {
    return buildMockIocs();
  }

  // TODO: real implementation once wired up:
  // const res = await fetch('https://urlhaus-api.abuse.ch/v1/urls/recent/', {
  //   headers: { 'Auth-Key': process.env.URLHAUS_AUTH_KEY },
  // });
  // ...parse data into the common IoC shape (type: 'domain', value: full URL)...
  return buildMockIocs();
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
