#!/usr/bin/env node
/**
 * Updates Media_URL and Visual_Type columns in Airtable for the 30-day content calendar.
 *
 * Usage:
 *   AIRTABLE_API_KEY=patXXX AIRTABLE_BASE_ID=appXXX node content-pipeline/update-media-urls.js
 *
 * Or set these in content-pipeline/.env
 */

import 'dotenv/config';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || 'appreh7OGuAdDSvGM';
const TABLE_NAME = 'Content Calendar';

const GITHUB_BASE = 'https://raw.githubusercontent.com/chetparker/x402-marketplace/main/content-pipeline/infographics';

// Map of Day number → media info
const MEDIA_MAP = {
  1:  { url: `${GITHUB_BASE}/day01-overview.png`,   type: 'Infographic' },
  2:  { url: `${GITHUB_BASE}/day02-comparison.png`,  type: 'Infographic + Video' },
  3:  { url: '',                                      type: 'Screenshot' },
  4:  { url: '',                                      type: 'Text Only' },
  5:  { url: `${GITHUB_BASE}/day05-revenue.png`,     type: 'Infographic + Video' },
  6:  { url: '',                                      type: 'Screenshot' },
  7:  { url: '',                                      type: 'Text Only' },
  8:  { url: '',                                      type: 'Screenshot' },
  9:  { url: `${GITHUB_BASE}/day09-sidebyside.png`,  type: 'Infographic + Video' },
  10: { url: '',                                      type: 'Text Only / AMA' },
  11: { url: '',                                      type: 'Screenshot' },
  12: { url: `${GITHUB_BASE}/day12-professions.png`, type: 'Infographic' },
  13: { url: '',                                      type: 'Screen Recording' },
  14: { url: `${GITHUB_BASE}/day14-week2.png`,       type: 'Infographic + Video' },
  15: { url: `${GITHUB_BASE}/day15-x402flow.png`,    type: 'Infographic' },
  16: { url: `${GITHUB_BASE}/day16-mcp.png`,         type: 'Infographic' },
  17: { url: '',                                      type: 'Text Only' },
  18: { url: `${GITHUB_BASE}/day18-stripe.png`,      type: 'Infographic + Video' },
  19: { url: `${GITHUB_BASE}/day19-process.png`,     type: 'Infographic' },
  20: { url: '',                                      type: 'Text Only' },
  21: { url: `${GITHUB_BASE}/day21-week3.png`,       type: 'Infographic + Video' },
  22: { url: '',                                      type: 'Screenshot' },
  23: { url: `${GITHUB_BASE}/day23-postcode.png`,    type: 'Infographic' },
  24: { url: '',                                      type: 'Text Only' },
  25: { url: '',                                      type: 'Screenshot' },
  26: { url: '',                                      type: 'Text Only' },
  27: { url: '',                                      type: 'Screenshot' },
  28: { url: '',                                      type: 'Screenshot' },
  29: { url: `${GITHUB_BASE}/day29-report.png`,      type: 'Infographic + Video' },
  30: { url: '',                                      type: 'Text Only' },
};

async function fetchAllRecords() {
  let allRecords = [];
  let offset = null;

  do {
    const params = new URLSearchParams({ pageSize: '100' });
    if (offset) params.set('offset', offset);

    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLE_NAME)}?${params}`;
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}` },
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Airtable fetch failed (${res.status}): ${err}`);
    }

    const data = await res.json();
    allRecords = allRecords.concat(data.records);
    offset = data.offset || null;
  } while (offset);

  return allRecords;
}

async function updateRecords(updates) {
  // Airtable PATCH accepts max 10 records per request
  const batches = [];
  for (let i = 0; i < updates.length; i += 10) {
    batches.push(updates.slice(i, i + 10));
  }

  let updated = 0;
  for (const batch of batches) {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLE_NAME)}`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ records: batch }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`  PATCH failed (${res.status}):`, err);

      // If Visual_Type field doesn't exist, retry without it
      if (err.includes('UNKNOWN_FIELD_NAME') && err.includes('Visual_Type')) {
        console.log('  → Visual_Type field not found, retrying without it...');
        const retryBatch = batch.map(r => ({
          id: r.id,
          fields: { Media_URL: r.fields.Media_URL },
        }));
        const retryRes = await fetch(url, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ records: retryBatch }),
        });
        if (retryRes.ok) {
          const retryData = await retryRes.json();
          updated += retryData.records.length;
          console.log(`  ✓ Updated ${retryData.records.length} rows (Media_URL only)`);
        } else {
          console.error(`  Retry also failed: ${await retryRes.text()}`);
        }
        continue;
      }

      continue;
    }

    const data = await res.json();
    updated += data.records.length;
    console.log(`  ✓ Updated ${data.records.length} rows`);

    // Rate limit
    if (batches.indexOf(batch) < batches.length - 1) {
      await new Promise(r => setTimeout(r, 250));
    }
  }

  return updated;
}

async function main() {
  if (!AIRTABLE_API_KEY) {
    console.error('ERROR: AIRTABLE_API_KEY not set.');
    console.error('Set it via environment variable or in content-pipeline/.env');
    console.error('');
    console.error('Usage:');
    console.error('  AIRTABLE_API_KEY=patXXX AIRTABLE_BASE_ID=appXXX node content-pipeline/update-media-urls.js');
    process.exit(1);
  }

  console.log('Fetching existing records from Airtable...');
  console.log(`Base: ${AIRTABLE_BASE_ID} | Table: ${TABLE_NAME}`);

  const records = await fetchAllRecords();
  console.log(`Found ${records.length} records.`);

  // Match records to days
  const updates = [];
  for (const record of records) {
    const day = record.fields.Day;
    if (!day || !MEDIA_MAP[day]) continue;

    const media = MEDIA_MAP[day];
    const fields = {};

    if (media.url) {
      fields.Media_URL = media.url;
    }
    fields.Visual_Type = media.type;

    updates.push({ id: record.id, fields });
  }

  console.log(`\nPrepared ${updates.length} updates:`);
  updates.forEach(u => {
    const day = records.find(r => r.id === u.id)?.fields.Day;
    const url = u.fields.Media_URL || '(empty)';
    console.log(`  Day ${day}: ${u.fields.Visual_Type} — ${url.includes('github') ? url.split('/').pop() : url}`);
  });

  console.log('\nUpdating Airtable...');
  const count = await updateRecords(updates);

  console.log(`\n✓ Done. ${count} rows updated.`);
}

main().catch(e => { console.error(e); process.exit(1); });
