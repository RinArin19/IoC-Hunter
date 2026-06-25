import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('aggregator: partitionNewVsKnown (pure)', () => {
  it('splits IoCs into new vs already-known based on a key set', async () => {
    const { partitionNewVsKnown } = await import('../lib/aggregator');

    const collected = [
      { type: 'ip', value: '1.2.3.4', source: 'otx' },
      { type: 'domain', value: 'evil.example', source: 'threatfox' },
      { type: 'hash', value: 'abc123', source: 'malwarebazaar' },
    ];
    const existingKeys = new Set(['ip|1.2.3.4|otx']);

    const { newIocs, knownIocs } = partitionNewVsKnown(collected, existingKeys);

    expect(newIocs).toHaveLength(2);
    expect(knownIocs).toHaveLength(1);
    expect(knownIocs[0].value).toBe('1.2.3.4');
  });

  it('treats the same value from different sources as distinct IoCs', async () => {
    const { partitionNewVsKnown } = await import('../lib/aggregator');

    const collected = [
      { type: 'ip', value: '1.2.3.4', source: 'otx' },
      { type: 'ip', value: '1.2.3.4', source: 'abuseipdb' },
    ];
    const existingKeys = new Set(['ip|1.2.3.4|otx']);

    const { newIocs, knownIocs } = partitionNewVsKnown(collected, existingKeys);

    expect(newIocs).toHaveLength(1);
    expect(newIocs[0].source).toBe('abuseipdb');
    expect(knownIocs).toHaveLength(1);
    expect(knownIocs[0].source).toBe('otx');
  });

  it('returns everything as new when nothing exists yet', async () => {
    const { partitionNewVsKnown } = await import('../lib/aggregator');
    const collected = [{ type: 'ip', value: '9.9.9.9', source: 'otx' }];
    const { newIocs, knownIocs } = partitionNewVsKnown(collected, new Set());
    expect(newIocs).toHaveLength(1);
    expect(knownIocs).toHaveLength(0);
  });
});

describe('aggregator: collectFromAllSources (I/O, mocked sources)', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('dedupes identical (type, value, source) tuples within a single fetch', async () => {
    vi.doMock('../lib/sources/otx', () => ({
      SOURCE_NAME: 'otx',
      fetchIocs: async () => [
        { type: 'ip', value: '5.5.5.5', source: 'otx', firstSeen: 'now', tags: [] },
        { type: 'ip', value: '5.5.5.5', source: 'otx', firstSeen: 'now', tags: [] }, // duplicate
      ],
    }));
    vi.doMock('../lib/sources/abuseipdb', () => ({ SOURCE_NAME: 'abuseipdb', fetchIocs: async () => [] }));
    vi.doMock('../lib/sources/threatfox', () => ({ SOURCE_NAME: 'threatfox', fetchIocs: async () => [] }));
    vi.doMock('../lib/sources/urlhaus', () => ({ SOURCE_NAME: 'urlhaus', fetchIocs: async () => [] }));
    vi.doMock('../lib/sources/malwarebazaar', () => ({ SOURCE_NAME: 'malwarebazaar', fetchIocs: async () => [] }));
    vi.doMock('../lib/sources/email-placeholder', () => ({
      SOURCE_NAME: 'email-placeholder',
      fetchIocs: async () => [],
    }));

    const { collectFromAllSources } = await import('../lib/aggregator');
    const { iocs, errors } = await collectFromAllSources();

    expect(iocs).toHaveLength(1);
    expect(errors).toHaveLength(0);
  });

  it('keeps results from healthy sources when one source rejects', async () => {
    vi.doMock('../lib/sources/otx', () => ({
      SOURCE_NAME: 'otx',
      fetchIocs: async () => {
        throw new Error('OTX is down');
      },
    }));
    vi.doMock('../lib/sources/abuseipdb', () => ({
      SOURCE_NAME: 'abuseipdb',
      fetchIocs: async () => [{ type: 'ip', value: '7.7.7.7', source: 'abuseipdb', firstSeen: 'now', tags: [] }],
    }));
    vi.doMock('../lib/sources/threatfox', () => ({ SOURCE_NAME: 'threatfox', fetchIocs: async () => [] }));
    vi.doMock('../lib/sources/urlhaus', () => ({ SOURCE_NAME: 'urlhaus', fetchIocs: async () => [] }));
    vi.doMock('../lib/sources/malwarebazaar', () => ({ SOURCE_NAME: 'malwarebazaar', fetchIocs: async () => [] }));
    vi.doMock('../lib/sources/email-placeholder', () => ({
      SOURCE_NAME: 'email-placeholder',
      fetchIocs: async () => [],
    }));

    const { collectFromAllSources } = await import('../lib/aggregator');
    const { iocs, errors } = await collectFromAllSources();

    expect(iocs).toHaveLength(1);
    expect(iocs[0].source).toBe('abuseipdb');
    expect(errors.length).toBeGreaterThanOrEqual(1);
  });

  it('skips malformed entries from a misbehaving source without throwing', async () => {
    vi.doMock('../lib/sources/otx', () => ({
      SOURCE_NAME: 'otx',
      fetchIocs: async () => [
        { type: 'not-a-real-type', value: 'x', source: 'otx' },
        { type: 'ip', value: '', source: 'otx' },
        { type: 'ip', value: '8.8.8.8', source: 'otx', firstSeen: 'now', tags: [] },
      ],
    }));
    vi.doMock('../lib/sources/abuseipdb', () => ({ SOURCE_NAME: 'abuseipdb', fetchIocs: async () => [] }));
    vi.doMock('../lib/sources/threatfox', () => ({ SOURCE_NAME: 'threatfox', fetchIocs: async () => [] }));
    vi.doMock('../lib/sources/urlhaus', () => ({ SOURCE_NAME: 'urlhaus', fetchIocs: async () => [] }));
    vi.doMock('../lib/sources/malwarebazaar', () => ({ SOURCE_NAME: 'malwarebazaar', fetchIocs: async () => [] }));
    vi.doMock('../lib/sources/email-placeholder', () => ({
      SOURCE_NAME: 'email-placeholder',
      fetchIocs: async () => [],
    }));

    const { collectFromAllSources } = await import('../lib/aggregator');
    const { iocs } = await collectFromAllSources();

    expect(iocs).toHaveLength(1);
    expect(iocs[0].value).toBe('8.8.8.8');
  });
});
