// lib/sources/_mock.js
// Shared helpers for generating plausible-looking mock IoCs. Used only by the
// stub source modules until real API keys are wired in (same pattern as the
// WPScan stub in the CVE advisory tool).

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomIp() {
  return `${randomInt(1, 223)}.${randomInt(0, 255)}.${randomInt(0, 255)}.${randomInt(1, 254)}`;
}

export function randomHex(length) {
  let s = '';
  while (s.length < length) s += Math.random().toString(16).slice(2);
  return s.slice(0, length);
}

export function randomDomain() {
  const words = ['login', 'secure', 'update', 'verify', 'account', 'portal', 'cloud', 'service'];
  const tlds = ['com', 'net', 'info', 'xyz', 'top'];
  const word = words[randomInt(0, words.length - 1)];
  return `${word}-${randomHex(6)}.${tlds[randomInt(0, tlds.length - 1)]}`;
}

export function randomEmail() {
  return `${randomHex(8)}@${randomDomain()}`;
}

/** Returns an ISO timestamp between `daysAgoMax` days ago and now. */
export function recentTimestamp(daysAgoMax = 7) {
  const ms = Date.now() - randomInt(0, daysAgoMax * 24 * 60 * 60 * 1000);
  return new Date(ms).toISOString();
}
