import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('POST /api/fetch-iocs', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('returns combined new + known IoCs and persists them when the DB is healthy', async () => {
    vi.doMock('../lib/aggregator', () => ({
      collectFromAllSources: async () => ({
        iocs: [
          { type: 'ip', value: '1.1.1.1', source: 'otx', firstSeen: 'now', tags: [] },
          { type: 'ip', value: '2.2.2.2', source: 'otx', firstSeen: 'now', tags: [] },
        ],
        errors: [],
      }),
      partitionNewVsKnown: (collected, existingKeys) => {
        const newIocs = collected.filter((i) => !existingKeys.has(`${i.type}|${i.value}|${i.source}`));
        const knownIocs = collected.filter((i) => existingKeys.has(`${i.type}|${i.value}|${i.source}`));
        return { newIocs, knownIocs };
      },
    }));

    vi.doMock('../lib/db', () => ({
      createFetchBatch: async () => ({ id: 42, created_at: '2026-01-01T00:00:00.000Z' }),
      findExistingKeys: async () => new Set(['ip|2.2.2.2|otx']),
      insertNewIocs: async () => {},
      touchKnownIocs: async () => {},
    }));

    const { POST } = await import('../app/api/fetch-iocs/route');
    const response = await POST();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.batch.id).toBe(42);
    expect(data.dbWarning).toBeNull();
    expect(data.sourceErrors).toHaveLength(0);

    const byValue = Object.fromEntries(data.iocs.map((i) => [i.value, i]));
    expect(byValue['1.1.1.1'].isNew).toBe(true);
    expect(byValue['2.2.2.2'].isNew).toBe(false);
  });

  it('still returns the fetched IoCs (with a warning) when DB persistence fails entirely', async () => {
    vi.doMock('../lib/aggregator', () => ({
      collectFromAllSources: async () => ({
        iocs: [{ type: 'hash', value: 'deadbeef', source: 'malwarebazaar', firstSeen: 'now', tags: [] }],
        errors: [],
      }),
      partitionNewVsKnown: vi.fn(),
    }));

    vi.doMock('../lib/db', () => ({
      createFetchBatch: async () => {
        throw new Error('connection refused');
      },
      findExistingKeys: async () => new Set(),
      insertNewIocs: async () => {},
      touchKnownIocs: async () => {},
    }));

    const { POST } = await import('../app/api/fetch-iocs/route');
    const response = await POST();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.batch).toBeNull();
    expect(data.dbWarning).toMatch(/database failed/i);
    // Even though DB persistence failed, the fetched IoC should still be visible.
    expect(data.iocs).toHaveLength(1);
    expect(data.iocs[0].value).toBe('deadbeef');
  });

  it('surfaces per-source errors without failing the whole request', async () => {
    vi.doMock('../lib/aggregator', () => ({
      collectFromAllSources: async () => ({
        iocs: [{ type: 'ip', value: '3.3.3.3', source: 'abuseipdb', firstSeen: 'now', tags: [] }],
        errors: [{ source: 'otx', message: 'OTX is down' }],
      }),
      partitionNewVsKnown: (collected) => ({ newIocs: collected, knownIocs: [] }),
    }));

    vi.doMock('../lib/db', () => ({
      createFetchBatch: async () => ({ id: 1, created_at: 'now' }),
      findExistingKeys: async () => new Set(),
      insertNewIocs: async () => {},
      touchKnownIocs: async () => {},
    }));

    const { POST } = await import('../app/api/fetch-iocs/route');
    const response = await POST();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.sourceErrors).toEqual([{ source: 'otx', message: 'OTX is down' }]);
    expect(data.iocs).toHaveLength(1);
  });
});
