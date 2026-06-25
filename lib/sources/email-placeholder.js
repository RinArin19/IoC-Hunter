// lib/sources/email-placeholder.js
//
// STUB: email-address IoCs.
//
// CAVEAT (see design spec, section 2): unlike IPs/domains/hashes, there
// isn't a major free feed dedicated to malicious *email-address* IoCs in
// the way OTX/Abuse.ch/AbuseIPDB cover the other types. This stub exists
// so the "email" IoC type has a source slot and the rest of the pipeline
// (dedupe, storage, export) works end-to-end today. Before relying on this
// in production, research a real source (e.g. a phishing-sender feed) and
// replace the body of fetchIocs() below.

import { randomEmail, recentTimestamp } from './_mock';

export const SOURCE_NAME = 'email-placeholder';

export async function fetchIocs() {
  return buildMockIocs();
}

function buildMockIocs() {
  const out = [];
  for (let i = 0; i < 3; i++) {
    out.push({
      type: 'email',
      value: randomEmail(),
      source: SOURCE_NAME,
      firstSeen: recentTimestamp(),
      tags: ['phishing-sender', 'placeholder-source'],
    });
  }
  return out;
}
