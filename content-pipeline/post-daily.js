#!/usr/bin/env node
/**
 * Reads today's content from Airtable and posts via Blotato API v2.
 *
 * Usage:
 *   node content-pipeline/post-daily.js          → dry run (preview only)
 *   node content-pipeline/post-daily.js --live    → actually post via Blotato
 *   node content-pipeline/post-daily.js --date 2026-04-15  → target a specific date
 *
 * Env vars (set in .env or environment):
 *   AIRTABLE_API_KEY, AIRTABLE_BASE_ID, BLOTATO_API_KEY
 */

import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Load .env if it exists
try {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const envPath = join(__dirname, '.env');
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    if (key && rest.length && !process.env[key]) {
      process.env[key] = rest.join('=');
    }
  }
} catch {}

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const BLOTATO_API_KEY = process.env.BLOTATO_API_KEY;
const TABLE_NAME = 'Content Calendar';

const BLOTATO_BASE = 'https://backend.blotato.com/v2';

// Parse CLI args
const args = process.argv.slice(2);
const IS_LIVE = args.includes('--live');
const dateArgIdx = args.indexOf('--date');
const TARGET_DATE = dateArgIdx !== -1 ? args[dateArgIdx + 1] : null;

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  console.error('ERROR: AIRTABLE_API_KEY and AIRTABLE_BASE_ID required');
  process.exit(1);
}
if (!BLOTATO_API_KEY) {
  console.error('ERROR: BLOTATO_API_KEY not set');
  process.exit(1);
}

// ── Blotato account IDs (cached from API) ────────────────────────────────

let accountsCache = null;

async function getBlotaAccounts() {
  if (accountsCache) return accountsCache;

  const res = await fetch(`${BLOTATO_BASE}/users/me/accounts`, {
    headers: { 'blotato-api-key': BLOTATO_API_KEY },
  });
  if (!res.ok) throw new Error(`Blotato accounts ${res.status}: ${await res.text()}`);

  const data = await res.json();
  accountsCache = {};
  for (const acct of data.items || []) {
    // Use first account per platform (or override with specific username)
    if (!accountsCache[acct.platform]) {
      accountsCache[acct.platform] = acct;
    }
  }

  console.log('Connected Blotato accounts:');
  for (const [platform, acct] of Object.entries(accountsCache)) {
    console.log(`  ${platform}: ${acct.username || acct.fullname} (ID: ${acct.id})`);
  }
  return accountsCache;
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

// ── Blotato posting ──────────────────────────────────────────────────────

async function blotatoPost(platform, text, mediaUrl) {
  const accounts = await getBlotaAccounts();
  const account = accounts[platform];

  if (!account) {
    console.error(`  ✗ ${platform}: no connected account found`);
    return { ok: false, error: 'no account' };
  }

  const content = {
    text,
    mediaUrls: mediaUrl ? [mediaUrl] : [],
    platform,
  };

  const target = { targetType: platform };

  // Platform-specific target fields
  if (platform === 'tiktok') {
    target.privacyLevel = 'PUBLIC_TO_EVERYONE';
    target.disabledComments = false;
    target.disabledDuet = false;
    target.disabledStitch = false;
    target.isAiGenerated = false;
  }

  const body = {
    post: {
      accountId: account.id,
      content,
      target,
    },
  };

  try {
    const res = await fetch(`${BLOTATO_BASE}/posts`, {
      method: 'POST',
      headers: {
        'blotato-api-key': BLOTATO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const responseText = await res.text();
    if (res.ok || res.status === 201) {
      console.log(`  ✓ ${platform}: posted (${res.status})`);
      try {
        const json = JSON.parse(responseText);
        if (json.postSubmissionId) {
          console.log(`    Submission ID: ${json.postSubmissionId}`);
        }
      } catch {}
      return { ok: true, status: res.status, response: responseText };
    }

    console.error(`  ✗ ${platform}: ${res.status} — ${responseText.slice(0, 300)}`);
    return { ok: false, status: res.status, response: responseText };
  } catch (e) {
    console.error(`  ✗ ${platform}: network error — ${e.message}`);
    return { ok: false, error: e.message };
  }
}

// ── Main ──────────────────────────────────────────────────────────────────

async function main() {
  const today = TARGET_DATE || new Date().toISOString().slice(0, 10);
  const mode = IS_LIVE ? 'LIVE' : 'DRY RUN';

  console.log(`\n═══════════════════════════════════════════`);
  console.log(`  PayAPI Content Pipeline — ${mode}`);
  console.log(`  Date: ${today}`);
  console.log(`═══════════════════════════════════════════\n`);

  // Find today's content
  const data = await airtableGet({
    filterByFormula: `AND(IS_SAME({Date},"${today}","day"), {Status}='Ready')`,
    maxRecords: '1',
  });

  const records = data.records || [];
  if (records.length === 0) {
    console.log('No "Ready" content for this date. Nothing to post.');

    // Also try without status filter to show what exists
    const allData = await airtableGet({
      filterByFormula: `IS_SAME({Date},"${today}","day")`,
      maxRecords: '1',
    });
    if (allData.records?.length) {
      const r = allData.records[0].fields;
      console.log(`  Found record with Status="${r.Status || 'none'}" — ${(r.Hook || '').slice(0, 60)}`);
    }
    return;
  }

  const record = records[0];
  const fields = record.fields;
  const recordId = record.id;

  console.log(`Content: "${(fields.Hook || '').slice(0, 80)}..."`);
  console.log(`Platforms: ${fields.Platforms || 'none specified'}`);
  console.log(`Media URL: ${fields.Media_URL || '(none)'}`);
  console.log('');

  // Determine platforms
  const platformStr = (fields.Platforms || '').toLowerCase();
  const platformList = [];
  if (platformStr.includes('linkedin')) platformList.push('linkedin');
  if (platformStr.includes('twitter')) platformList.push('twitter');
  if (platformStr.includes('tiktok')) platformList.push('tiktok');
  if (platformStr.includes('instagram')) platformList.push('instagram');

  if (platformList.length === 0) {
    // Default to LinkedIn + Twitter
    platformList.push('linkedin', 'twitter');
    console.log('  No platforms specified, defaulting to: linkedin, twitter');
  }

  // Get content per platform
  const postPlan = [];
  for (const platform of platformList) {
    let text = '';
    switch (platform) {
      case 'linkedin': text = fields.LinkedIn || ''; break;
      case 'twitter': text = fields.Twitter || ''; break;
      case 'tiktok': text = fields.TikTok_Caption || ''; break;
      case 'instagram': text = fields.Instagram_Caption || fields.TikTok_Caption || ''; break;
    }

    if (!text) {
      console.log(`  ⚠ No content for ${platform} — skipping`);
      continue;
    }

    postPlan.push({
      platform,
      text,
      mediaUrl: fields.Media_URL || null,
    });
  }

  // Show preview
  console.log('─── Post Preview ───────────────────────────\n');
  for (const post of postPlan) {
    console.log(`  📱 ${post.platform.toUpperCase()}`);
    console.log(`     Text: "${post.text.slice(0, 120)}${post.text.length > 120 ? '...' : ''}"`);
    console.log(`     Media: ${post.mediaUrl || '(none)'}`);
    console.log(`     Length: ${post.text.length} chars`);
    console.log('');
  }

  if (!IS_LIVE) {
    console.log('═══════════════════════════════════════════');
    console.log('  DRY RUN — nothing was posted.');
    console.log('  Run with --live flag to actually post:');
    console.log('    node content-pipeline/post-daily.js --live');
    console.log('═══════════════════════════════════════════\n');
    return;
  }

  // ── LIVE: Actually post ──
  console.log('─── Posting via Blotato ────────────────────\n');
  await getBlotaAccounts();
  console.log('');

  const results = {};
  for (const post of postPlan) {
    results[post.platform] = await blotatoPost(post.platform, post.text, post.mediaUrl);
    // Rate limiting between posts
    await new Promise(r => setTimeout(r, 1000));
  }

  // Update Airtable status
  const posted = Object.entries(results).filter(([, r]) => r.ok).map(([p]) => p);
  const failed = Object.entries(results).filter(([, r]) => !r.ok).map(([p]) => p);

  if (posted.length > 0) {
    await airtableUpdate(recordId, { Status: 'Posted' });
    console.log(`\n✓ Marked as "Posted" in Airtable.`);
  }

  // Summary
  console.log('\n─── Summary ────────────────────────────────');
  console.log(`  Posted: ${posted.join(', ') || 'none'}`);
  if (failed.length) console.log(`  Failed: ${failed.join(', ')}`);
  console.log('');
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
