#!/usr/bin/env node
/**
 * Scrapes LinkedIn post engagement metrics and updates Airtable.
 *
 * Uses Apify LinkedIn Profile Scraper to get impressions, likes, comments.
 * Falls back to logging a placeholder if APIFY_API_KEY isn't set.
 *
 * Usage: AIRTABLE_BASE_ID=appXXX node content-pipeline/scrape-metrics.js
 */

import 'dotenv/config';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const APIFY_API_KEY = process.env.APIFY_API_KEY;
const TABLE_NAME = 'Content Calendar';

async function airtableGet(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLE_NAME)}?${query}`;
  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}` },
  });
  if (!res.ok) throw new Error(`Airtable GET ${res.status}`);
  return res.json();
}

async function airtableUpdate(recordId, fields) {
  const res = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLE_NAME)}/${recordId}`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    }
  );
  if (!res.ok) throw new Error(`Airtable PATCH ${res.status}`);
}

async function scrapeLinkedInPosts() {
  if (!APIFY_API_KEY || APIFY_API_KEY === 'placeholder_add_your_key_here') {
    console.log('⚠ APIFY_API_KEY not configured — skipping LinkedIn scrape.');
    console.log('  To enable: sign up at apify.com, get API key, add to .env');
    return null;
  }

  console.log('Calling Apify LinkedIn scraper...');

  // Use Apify's LinkedIn Posts Scraper
  const res = await fetch('https://api.apify.com/v2/acts/curious_coder~linkedin-profile-scraper/runs?token=' + APIFY_API_KEY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      startUrls: [{ url: 'https://www.linkedin.com/in/chetparker/' }],
      maxPosts: 30,
    }),
  });

  if (!res.ok) {
    console.error(`Apify error: ${res.status} — ${await res.text()}`);
    return null;
  }

  const run = await res.json();
  console.log(`Apify run started: ${run.data?.id}`);

  // Wait for completion (poll every 10s, max 5 min)
  const runId = run.data?.id;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 10000));
    const status = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_API_KEY}`);
    const statusData = await status.json();
    if (statusData.data?.status === 'SUCCEEDED') {
      // Fetch results
      const resultsRes = await fetch(
        `https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${APIFY_API_KEY}`
      );
      return await resultsRes.json();
    }
    if (statusData.data?.status === 'FAILED') {
      console.error('Apify run failed');
      return null;
    }
    console.log(`  waiting... (${statusData.data?.status})`);
  }

  console.error('Apify run timed out');
  return null;
}

async function main() {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.error('AIRTABLE_API_KEY and AIRTABLE_BASE_ID required');
    process.exit(1);
  }

  // Get all posted rows from Airtable
  const data = await airtableGet({
    filterByFormula: `{Status}='Posted'`,
    sort: [{ field: 'Day', direction: 'asc' }],
  });

  const postedRows = data.records || [];
  console.log(`Found ${postedRows.length} posted rows in Airtable.`);

  // Scrape LinkedIn metrics
  const posts = await scrapeLinkedInPosts();

  if (!posts || posts.length === 0) {
    console.log('No LinkedIn metrics available. Rows unchanged.');
    return;
  }

  // Match scraped posts to Airtable rows by hook line similarity
  let matched = 0;
  for (const row of postedRows) {
    const hookLine = (row.fields.Hook_Line || row.fields.Hook || '').toLowerCase().slice(0, 50);
    if (!hookLine) continue;

    const match = posts.find(p => {
      const postText = (p.text || p.content || '').toLowerCase();
      return postText.includes(hookLine);
    });

    if (match) {
      const metrics = {
        Impressions: match.impressions || match.views || 0,
        Likes: match.likes || match.numLikes || 0,
        Comments: match.comments || match.numComments || 0,
        Shares: match.shares || match.numShares || 0,
      };
      const total = metrics.Impressions || 1;
      metrics.Engagement_Rate = parseFloat(
        (((metrics.Likes + metrics.Comments + metrics.Shares) / total) * 100).toFixed(2)
      );

      await airtableUpdate(row.id, metrics);
      console.log(`  ✓ Day ${row.fields.Day}: ${metrics.Likes} likes, ${metrics.Comments} comments, ${metrics.Engagement_Rate}% ER`);
      matched++;
    }
  }

  console.log(`\n✓ Updated ${matched}/${postedRows.length} rows with engagement data.`);
}

main().catch(e => { console.error(e); process.exit(1); });
