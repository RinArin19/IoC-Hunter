// lib/sources/otx.js
//
// STUB: AlienVault OTX (Open Threat Exchange).
// Real integration would call https://otx.alienvault.com/api/v1/pulses/subscribed
// using an API key from process.env.OTX_API_KEY (header: "X-OTX-API-KEY").
// No key is configured yet, so this returns mock data shaped like real
// OTX pulse indicators (mix of IPs, domains, hashes).
//
// Swap the body of fetchIocs() for a real fetch() call once OTX_API_KEY exists.

import { randomIp, randomDomain, randomHex, recentTimestamp } from './_mock';

export const SOURCE_NAME = 'otx';

export async function fetchIocs() {
  if (!process.env.OTX_API_KEY) {
    // Stub mode: no API key configured yet.
    return buildMockIocs();
  }

  // TODO: real implementation once OTX_API_KEY is available:
  // const res = await fetch('https://otx.alienvault.com/api/v1/pulses/subscribed', {
  //   headers: { 'X-OTX-API-KEY': process.env.OTX_API_KEY },
  // });
  // ...parse pulses into the common IoC shape...
  return buildMockIocs();
}

function buildMockIocs() {
  const out = [];
  for (let i = 0; i < 4; i++) {
    out.push({ type: 'ip', value: randomIp(), source: SOURCE_NAME, firstSeen: recentTimestamp(), tags: ['otx-pulse'] });
  }
  for (let i = 0; i < 3; i++) {
    out.push({ type: 'domain', value: randomDomain(), source: SOURCE_NAME, firstSeen: recentTimestamp(), tags: ['otx-pulse'] });
  }
  for (let i = 0; i < 2; i++) {
    out.push({ type: 'hash', value: randomHex(64), source: SOURCE_NAME, firstSeen: recentTimestamp(), tags: ['otx-pulse', 'sha256'] });
  }
  return out;
}
