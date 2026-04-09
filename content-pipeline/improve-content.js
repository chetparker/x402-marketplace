#!/usr/bin/env node
/**
 * Reads latest performance analysis + upcoming posts from Airtable,
 * rewrites upcoming posts using winning patterns, saves back to Airtable.
 *
 * Usage: AIRTABLE_BASE_ID=appXXX node content-pipeline/improve-content.js
 */

import 'dotenv/config';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
const TABLE_NAME = 'Content Calendar';

async function airtableGet(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLE_NAME)}?${query}`;
  const res = await fetch(url, { headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}` } });
  if (!res.ok) throw new Error(`Airtable GET ${res.status}`);
  return res.json();
}

async function airtableUpdate(recordId, fields) {
  const res = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLE_NAME)}/${recordId}`,
    {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields }),
    }
  );
  if (!res.ok) throw new Error(`Airtable PATCH ${res.status}`);
}

async function main() {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !OPENROUTER_KEY) {
    console.error('AIRTABLE_API_KEY, AIRTABLE_BASE_ID, and OPENROUTER_API_KEY required');
    process.exit(1);
  }

  // Read latest analysis
  let analysis;
  try {
    analysis = readFileSync(join(__dirname, 'strategy', 'latest-analysis.md'), 'utf-8');
  } catch {
    console.log('No analysis file found. Run analyze-performance.js first.');
    return;
  }

  if (analysis.includes('Not enough data yet')) {
    console.log('Analysis says not enough data. Skipping rewrite.');
    return;
  }

  // Get upcoming posts (Status = "Ready", next 7 days)
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 86400000);
  const todayStr = today.toISOString().slice(0, 10);
  const nextWeekStr = nextWeek.toISOString().slice(0, 10);

  const data = await airtableGet({
    filterByFormula: `AND({Status}='Ready', IS_AFTER({Date}, '${todayStr}'), IS_BEFORE({Date}, '${nextWeekStr}'))`,
    sort: [{ field: 'Day', direction: 'asc' }],
  });

  const upcoming = data.records || [];
  console.log(`Found ${upcoming.length} upcoming "Ready" posts to improve.`);

  if (upcoming.length === 0) {
    console.log('No upcoming posts to rewrite.');
    return;
  }

  // Build the rewrite prompt
  const postsForRewrite = upcoming.map(r => ({
    day: r.fields.Day,
    pillar: r.fields.Pillar,
    hook_type: r.fields.Hook_Type,
    linkedin: r.fields.LinkedIn,
    twitter: r.fields.Twitter,
    tiktok_caption: r.fields.TikTok_Caption,
  }));

  const prompt = `You are a LinkedIn content strategist. Here is the performance analysis from our last batch of posts:

${analysis}

Here are the upcoming ${upcoming.length} posts:

${JSON.stringify(postsForRewrite, null, 2)}

Rewrite the upcoming posts to incorporate the winning patterns. Specifically:
- Use the hook types that performed best
- Match the post length that got highest engagement
- Use the angles and topics that resonated
- Keep the same voice: lowercase, direct, specific numbers, no emojis
- Do NOT make them sound AI-generated
- Keep the same Day number and Pillar — only rewrite the text
- Return as JSON array: [{ day, LinkedIn, Twitter, TikTok_Caption }]

Return ONLY valid JSON. No markdown, no explanation.`;

  console.log('Calling OpenRouter to rewrite posts...');
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://payapi.market',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-sonnet-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 6000,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    console.error(`OpenRouter error: ${res.status} — ${await res.text()}`);
    return;
  }

  const response = await res.json();
  const text = response.choices?.[0]?.message?.content || '';
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    console.error('No JSON array in OpenRouter response. Raw:', text.slice(0, 500));
    return;
  }

  const rewritten = JSON.parse(jsonMatch[0]);
  console.log(`Got ${rewritten.length} rewritten posts.`);

  // Update Airtable
  let updated = 0;
  for (const rw of rewritten) {
    const record = upcoming.find(r => r.fields.Day === rw.day);
    if (!record) continue;

    const fields = {};
    if (rw.LinkedIn) fields.LinkedIn = rw.LinkedIn;
    if (rw.Twitter) fields.Twitter = rw.Twitter;
    if (rw.TikTok_Caption) fields.TikTok_Caption = rw.TikTok_Caption;

    if (Object.keys(fields).length > 0) {
      await airtableUpdate(record.id, fields);
      console.log(`  ✓ Day ${rw.day} rewritten`);
      updated++;
    }
  }

  console.log(`\n✓ ${updated} posts rewritten and saved to Airtable.`);
}

main().catch(e => { console.error(e); process.exit(1); });
