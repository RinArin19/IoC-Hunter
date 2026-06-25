// lib/aggregator.js
//
// Orchestrates parallel calls to every source stub, normalizes their output,
// dedupes against the database, and returns a combined result. The pure
// partition logic is split out from the I/O so it can be unit tested without
// a live database or network.

import * as otx from './sources/otx';
import * as abuseipdb from './sources/abuseipdb';
import * as threatfox from './sources/threatfox';
import * as urlhaus from './sources/urlhaus';
import * as malwarebazaar from './sources/malwarebazaar';
import * as emailPlaceholder from './sources/email-placeholder';

export const SOURCES = [otx, abuseipdb, threatfox, urlhaus, malwarebazaar, emailPlaceholder];

const VALID_TYPES = new Set(['ip', 'domain', 'hash', 'email']);

export function keyFor(ioc) {
  return `${ioc.type}|${ioc.value}|${ioc.source}`;
}

/** Validates a single IoC has the shape the rest of the pipeline expects. */
export function isValidIoc(ioc) {
  return (
    ioc &&
    VALID_TYPES.has(ioc.type) &&
    typeof ioc.value === 'string' &&
    ioc.value.length > 0 &&
    typeof ioc.source === 'string' &&
    ioc.source.length > 0
  );
}

/**
 * Calls every source's fetchIocs() in parallel. A failing source does not
 * fail the whole batch — its error is captured and returned separately so
 * the caller can surface a per-source warning.
 *
 * Returns { iocs, errors } where iocs is the combined, within-batch-deduped
 * list of valid IoCs, and errors is [{ source, message }].
 */
export async function collectFromAllSources() {
  const results = await Promise.allSettled(
    SOURCES.map((mod) => mod.fetchIocs().then((iocs) => ({ source: mod.SOURCE_NAME, iocs })))
  );

  const errors = [];
  const seenInBatch = new Set();
  const iocs = [];

  for (const result of results) {
    if (result.status === 'rejected') {
      errors.push({ source: 'unknown', message: result.reason?.message || String(result.reason) });
      continue;
    }

    const { source, iocs: sourceIocs } = result.value;
    if (!Array.isArray(sourceIocs)) {
      errors.push({ source, message: 'Source returned a non-array result; skipped.' });
      continue;
    }

    for (const ioc of sourceIocs) {
      if (!isValidIoc(ioc)) continue; // silently skip malformed entries from a stub
      const key = keyFor(ioc);
      if (seenInBatch.has(key)) continue; // dedupe within this single fetch
      seenInBatch.add(key);
      iocs.push(ioc);
    }
  }

  return { iocs, errors };
}

/**
 * Pure function: given the IoCs collected in this fetch and the set of keys
 * ("type|value|source") that already exist in the DB, splits them into
 * brand-new IoCs and already-known ones.
 */
export function partitionNewVsKnown(collectedIocs, existingKeys) {
  const newIocs = [];
  const knownIocs = [];
  for (const ioc of collectedIocs) {
    if (existingKeys.has(keyFor(ioc))) {
      knownIocs.push(ioc);
    } else {
      newIocs.push(ioc);
    }
  }
  return { newIocs, knownIocs };
}
