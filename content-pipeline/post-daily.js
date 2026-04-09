#!/usr/bin/env node
/**
 * Reads today's content from Airtable and posts via Blotato.
 *
 * Usage: AIRTABLE_BASE_ID=appXXX node content-pipeline/post-daily.js
 *
 * Blotato API: https://docs.blotato.com or https://api.blotato.com
 * The script tries /v1/posts first; if the API shape differs, it logs
 * the response so you can adjust.
 */

import 'dotenv/config';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const BLOTATO_API_KEY = process.env.BLOTATO_API_KEY;
const TABLE_NAME = 'Content Calendar';

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  console.error('ERROR: AIRTABLE_API_KEY and AIRTABLE_BASE_ID required');
  process.exit(1);
}
if (!BLOTATO_API_KEY) {
  console.error('ERROR: BLOTATO_API_KEY not set');
  process.exit(1);
}

// ── Airtable helpers ──────────────────────────────────────────────────────

async function airtableGet(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLE_NAME)}?${query}`;
  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}` },
  });
  if (!res.ok) throw new Error(`Airtable GET ${res.status}: ${await res.text()}`);
  return res.json();
}

async function airtableUpdate(recordId, fields) {
  const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLE_NAME)}/${recordId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) throw new Error(`Airtable PATCH ${res.status}: ${await res.text()}`);
  return res.json();
}

// ── Blotato helpers ───────────────────────────────────────────────────────

async function blotatoPost(platform, text, mediaUrl) {
  // Try the documented Blotato endpoints
  const endpoints = [
    'https://api.blotato.com/v1/posts',
    'https://api.blotato.com/api/v1/posts',
    'https://api.blotato.com/posts',
  ];

  const body = {
    content: text,
    platform: platform.toLowerCase(),
    status: 'scheduled',
    schedule_for: new Date(Date.now() + 5 * 60000).toISOString(), // 5 min from now
  };
  if (mediaUrl) body.media_url = mediaUrl;

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${BLOTATO_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await res.text();
      if (res.ok) {
        console.log(`  ✓ ${platform}: posted via ${endpoint}`);
        return { ok: true, endpoint, response: data };
      }

      // If 404, try next endpoint
      if (res.status === 404) continue;

      // Other error — log and return
      console.error(`  ✗ ${platform}: ${res.status} from ${endpoint} — ${data.slice(0, 200)}`);
      return { ok: false, status: res.status, response: data };
    } catch (e) {
      console.error(`  ✗ ${platform}: network error on ${endpoint} — ${e.message}`);
      continue;
    }
  }

  console.error(`  ✗ ${platform}: all Blotato endpoints failed`);
  return { ok: false };
}

// ── Main ──────────────────────────────────────────────────────────────────

async function main() {
  const today = new Date().toISOString().slice(0, 10);
  console.log(`Looking for content dated ${today}...`);

  // Airtable filterByFormula to match today's date with Status = "Ready"
  const data = await airtableGet({
    filterByFormula: `AND({Date}='${today}', {Status}='Ready')`,
    maxRecords: '1',
  });

  const records = data.records || [];
  if (records.length === 0) {
    console.log('No "Ready" content for today. Nothing to post.');
    return;
  }

  const record = records[0];
  const fields = record.fields;
  const recordId = record.id;

  console.log(`Found Day ${fields.Day}: "${(fields.Hook || '').slice(0, 60)}..."`);
  console.log(`Platforms: ${fields.Platforms}`);

  const platforms = (fields.Platforms || '').split('/').map(p => p.trim().toLowerCase());
  const results = {};

  for (const platform of platforms) {
    let text = '';
    switch (platform) {
      case 'linkedin': text = fields.LinkedIn || ''; break;
      case 'twitter': text = fields.Twitter || ''; break;
      case 'tiktok': text = fields.TikTok_Caption || ''; break;
      case 'instagram': text = fields.Instagram_Caption || fields.TikTok_Caption || ''; break;
      default: console.log(`  ⚠ Unknown platform: ${platform}`); continue;
    }

    if (!text) {
      console.log(`  ⚠ No content for ${platform} — skipping`);
      continue;
    }

    results[platform] = await blotatoPost(platform, text, fields.Media_URL);
  }

  // Update status in Airtable
  await airtableUpdate(recordId, { Status: 'Posted' });
  console.log(`\n✓ Day ${fields.Day} marked as "Posted" in Airtable.`);

  // Summary
  const posted = Object.entries(results).filter(([, r]) => r.ok).map(([p]) => p);
  const failed = Object.entries(results).filter(([, r]) => !r.ok).map(([p]) => p);
  console.log(`Posted: ${posted.join(', ') || 'none'}`);
  if (failed.length) console.log(`Failed: ${failed.join(', ')}`);
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
