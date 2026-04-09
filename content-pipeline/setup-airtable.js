#!/usr/bin/env node
/**
 * Sets up the Airtable base and populates all 30 days of content.
 *
 * The Airtable REST API does NOT support creating bases/tables programmatically
 * with a Personal Access Token (only OAuth apps can). So this script:
 *   1. Prints manual setup instructions for creating the base + table
 *   2. Once you provide the BASE_ID and TABLE_NAME, populates all 30 rows
 *
 * Usage:
 *   AIRTABLE_BASE_ID=appXXX node content-pipeline/setup-airtable.js
 *
 * If AIRTABLE_BASE_ID is not set, it prints setup instructions and exits.
 */

import 'dotenv/config';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const TABLE_NAME = 'Content Calendar';

if (!AIRTABLE_API_KEY) {
  console.error('ERROR: AIRTABLE_API_KEY not set in .env');
  process.exit(1);
}

if (!AIRTABLE_BASE_ID) {
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║  MANUAL STEP REQUIRED: Create an Airtable Base                 ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  1. Go to https://airtable.com/create                           ║
║  2. Create a new base called "PayAPI Content"                    ║
║  3. Rename the first table to "Content Calendar"                 ║
║  4. Add these columns (exact names):                             ║
║     - Day (Number)                                               ║
║     - Date (Date)                                                ║
║     - Pillar (Single line text)                                  ║
║     - Hook (Long text)                                           ║
║     - LinkedIn (Long text)                                       ║
║     - Twitter (Long text)                                        ║
║     - TikTok_Script (Long text)                                  ║
║     - TikTok_Caption (Long text)                                 ║
║     - Instagram_Caption (Long text)                              ║
║     - Reddit_Sub (Single line text)                              ║
║     - Reddit_Post (Long text)                                    ║
║     - Seedance_Prompt (Long text)                                ║
║     - Media_URL (URL)                                            ║
║     - Platforms (Single line text)                                ║
║     - Status (Single line text)                                  ║
║     - Hook_Type (Single line text)                               ║
║     - Impressions (Number)                                       ║
║     - Likes (Number)                                             ║
║     - Comments (Number)                                          ║
║     - Shares (Number)                                            ║
║     - Engagement_Rate (Number, decimal)                          ║
║     - Hook_Line (Single line text)                               ║
║     - Line_Count (Number)                                        ║
║     - Avg_Line_Length (Number, decimal)                           ║
║     - Has_Numbers (Checkbox)                                     ║
║     - Has_List (Checkbox)                                        ║
║     - Post_Format (Single line text)                             ║
║                                                                  ║
║  5. Copy the Base ID from the URL:                               ║
║     https://airtable.com/appXXXXXX/tblYYY → appXXXXXX           ║
║                                                                  ║
║  6. Run again with:                                              ║
║     AIRTABLE_BASE_ID=appXXX node content-pipeline/setup-airtable.js
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`);
  process.exit(0);
}

// ── Content for days 1-7 (provided verbatim) ──────────────────────────────

const CONTENT = JSON.parse(readFileSync(join(__dirname, 'content-days.json'), 'utf-8'));

// ── Airtable helpers ──────────────────────────────────────────────────────

async function airtablePost(records) {
  // Airtable API accepts max 10 records per request
  const batches = [];
  for (let i = 0; i < records.length; i += 10) {
    batches.push(records.slice(i, i + 10));
  }

  for (const batch of batches) {
    const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLE_NAME)}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ records: batch.map(fields => ({ fields })) }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`Airtable error (${res.status}):`, err);
      throw new Error(`Airtable insert failed: ${res.status}`);
    }

    const data = await res.json();
    console.log(`  ✓ Inserted ${data.records.length} rows`);

    // Rate limit: 5 requests/sec
    if (batches.indexOf(batch) < batches.length - 1) {
      await new Promise(r => setTimeout(r, 250));
    }
  }
}

// ── Compute metadata fields ───────────────────────────────────────────────

function enrichRow(row) {
  const text = row.LinkedIn || '';
  const lines = text.split('\n').filter(l => l.trim());
  const hookLine = lines[0] || '';
  const hasNumbers = /\d{2,}|\$\d|\d%/.test(text);
  const hasList = /^[→↳•\-\d]+[.)]?\s/m.test(text);

  return {
    ...row,
    Hook_Line: hookLine.slice(0, 255),
    Line_Count: lines.length,
    Avg_Line_Length: lines.length > 0 ? Math.round(lines.reduce((s, l) => s + l.length, 0) / lines.length) : 0,
    Has_Numbers: hasNumbers,
    Has_List: hasList,
    Post_Format: 'text only',
    // Status omitted — singleSelect field. Set manually in Airtable or
    // via a separate PATCH after adding 'Ready' as an option.
  };
}

// ── Main ──────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Populating ${CONTENT.length} days into Airtable...`);
  console.log(`Base: ${AIRTABLE_BASE_ID} | Table: ${TABLE_NAME}`);

  const enriched = CONTENT.map(enrichRow);
  await airtablePost(enriched);

  console.log(`\n✓ All ${CONTENT.length} days inserted into Airtable.`);
  console.log('First 3 rows:');
  enriched.slice(0, 3).forEach(r => {
    console.log(`  Day ${r.Day}: ${r.Pillar} — ${r.Hook_Type} — ${r.Platforms} — Hook: "${(r.Hook_Line || '').slice(0, 60)}..."`);
  });
}

main().catch(e => { console.error(e); process.exit(1); });
