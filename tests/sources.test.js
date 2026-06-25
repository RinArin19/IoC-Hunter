import { describe, it, expect } from 'vitest';
import * as otx from '../lib/sources/otx';
import * as abuseipdb from '../lib/sources/abuseipdb';
import * as threatfox from '../lib/sources/threatfox';
import * as urlhaus from '../lib/sources/urlhaus';
import * as malwarebazaar from '../lib/sources/malwarebazaar';
import * as emailPlaceholder from '../lib/sources/email-placeholder';

const VALID_TYPES = new Set(['ip', 'domain', 'hash', 'email']);
const modules = { otx, abuseipdb, threatfox, urlhaus, malwarebazaar, emailPlaceholder };

describe.each(Object.entries(modules))('source stub: %s', (name, mod) => {
  it('exposes a SOURCE_NAME and fetchIocs()', () => {
    expect(typeof mod.SOURCE_NAME).toBe('string');
    expect(mod.SOURCE_NAME.length).toBeGreaterThan(0);
    expect(typeof mod.fetchIocs).toBe('function');
  });

  it('fetchIocs() resolves to an array of well-shaped IoCs', async () => {
    const iocs = await mod.fetchIocs();
    expect(Array.isArray(iocs)).toBe(true);
    expect(iocs.length).toBeGreaterThan(0);

    for (const ioc of iocs) {
      expect(VALID_TYPES.has(ioc.type)).toBe(true);
      expect(typeof ioc.value).toBe('string');
      expect(ioc.value.length).toBeGreaterThan(0);
      expect(ioc.source).toBe(mod.SOURCE_NAME);
      expect(typeof ioc.firstSeen).toBe('string');
      expect(Array.isArray(ioc.tags)).toBe(true);
    }
  });
});
