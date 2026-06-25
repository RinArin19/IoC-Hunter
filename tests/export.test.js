import { describe, it, expect } from 'vitest';
import { toCsv, toPdf } from '../lib/export';

describe('toCsv', () => {
  it('produces a header-only CSV when there are no IoCs', () => {
    const csv = toCsv([]);
    const lines = csv.trim().split('\n');
    expect(lines).toHaveLength(1);
    expect(lines[0]).toBe('type,value,source,first_seen,last_seen,tags');
  });

  it('renders rows and joins tags with a pipe', () => {
    const csv = toCsv([
      {
        type: 'ip',
        value: '1.2.3.4',
        source: 'otx',
        first_seen: '2026-01-01T00:00:00.000Z',
        last_seen: '2026-01-02T00:00:00.000Z',
        tags: ['botnet-c2', 'high-confidence'],
      },
    ]);
    const lines = csv.trim().split('\n');
    expect(lines).toHaveLength(2);
    expect(lines[1]).toBe('ip,1.2.3.4,otx,2026-01-01T00:00:00.000Z,2026-01-02T00:00:00.000Z,botnet-c2|high-confidence');
  });

  it('quotes values containing commas', () => {
    const csv = toCsv([
      { type: 'domain', value: 'a,b.example', source: 'urlhaus', first_seen: null, last_seen: null, tags: [] },
    ]);
    expect(csv).toContain('"a,b.example"');
  });
});

describe('toPdf', () => {
  it('resolves to a non-empty PDF buffer even with no IoCs', async () => {
    const buffer = await toPdf([]);
    expect(Buffer.isBuffer(buffer)).toBe(true);
    expect(buffer.length).toBeGreaterThan(0);
    // PDF files start with the "%PDF" magic bytes.
    expect(buffer.subarray(0, 4).toString('utf8')).toBe('%PDF');
  });

  it('resolves to a non-empty PDF buffer with IoCs present', async () => {
    const buffer = await toPdf([
      { type: 'ip', value: '1.2.3.4', source: 'otx', last_seen: '2026-01-01T00:00:00.000Z', tags: ['c2'] },
    ]);
    expect(Buffer.isBuffer(buffer)).toBe(true);
    expect(buffer.subarray(0, 4).toString('utf8')).toBe('%PDF');
  });
});
