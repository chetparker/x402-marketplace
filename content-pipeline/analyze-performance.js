#!/usr/bin/env node
/**
 * Analyses post performance and outputs strategy recommendations.
 * Reads engagement data from Airtable, finds patterns, writes analysis.
 *
 * Usage: AIRTABLE_BASE_ID=appXXX node content-pipeline/analyze-performance.js
 */

import 'dotenv/config';
import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const TABLE_NAME = 'Content Calendar';

async function airtableGet(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLE_NAME)}?${query}`;
  const res = await fetch(url, { headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}` } });
  if (!res.ok) throw new Error(`Airtable GET ${res.status}`);
  return res.json();
}

function avg(arr) { return arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 0; }

async function main() {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.error('AIRTABLE_API_KEY and AIRTABLE_BASE_ID required');
    process.exit(1);
  }

  const data = await airtableGet({
    filterByFormula: `{Status}='Posted'`,
    sort: [{ field: 'Day', direction: 'asc' }],
  });

  const rows = (data.records || []).map(r => r.fields);
  const withMetrics = rows.filter(r => r.Impressions > 0 || r.Likes > 0);

  console.log(`Total posted: ${rows.length} | With metrics: ${withMetrics.length}`);

  if (withMetrics.length < 3) {
    const msg = `# Content Performance Analysis\n\nNot enough data yet — only ${withMetrics.length} posts have engagement metrics.\nNeed at least 3 posts with impressions/likes data to run analysis.\n\nRun \`node content-pipeline/scrape-metrics.js\` to fetch LinkedIn engagement data.\n`;
    writeFileSync(join(__dirname, 'strategy', 'latest-analysis.md'), msg);
    console.log('Not enough data for analysis. Written placeholder to strategy/latest-analysis.md');
    return;
  }

  // ── Performance by Hook Type ────────────────────────────────────────
  const byHookType = {};
  for (const r of withMetrics) {
    const ht = r.Hook_Type || 'Unknown';
    if (!byHookType[ht]) byHookType[ht] = [];
    byHookType[ht].push(r.Engagement_Rate || 0);
  }

  // ── Performance by Pillar ───────────────────────────────────────────
  const byPillar = {};
  for (const r of withMetrics) {
    const p = r.Pillar || 'Unknown';
    if (!byPillar[p]) byPillar[p] = [];
    byPillar[p].push(r.Engagement_Rate || 0);
  }

  // ── Performance by length ───────────────────────────────────────────
  const byLength = { short: [], medium: [], long: [] };
  for (const r of withMetrics) {
    const words = (r.LinkedIn || '').split(/\s+/).length;
    const bucket = words < 100 ? 'short' : words < 200 ? 'medium' : 'long';
    byLength[bucket].push(r.Engagement_Rate || 0);
  }

  // ── Performance by day of week ──────────────────────────────────────
  const byDay = {};
  for (const r of withMetrics) {
    if (!r.Date) continue;
    const d = new Date(r.Date).toLocaleDateString('en-GB', { weekday: 'long' });
    if (!byDay[d]) byDay[d] = [];
    byDay[d].push(r.Engagement_Rate || 0);
  }

  // ── Top / bottom posts ──────────────────────────────────────────────
  const sorted = [...withMetrics].sort((a, b) => (b.Engagement_Rate || 0) - (a.Engagement_Rate || 0));
  const top5 = sorted.slice(0, 5);
  const bottom5 = sorted.slice(-5).reverse();

  // ── Has_Numbers / Has_List impact ───────────────────────────────────
  const withNumbers = withMetrics.filter(r => r.Has_Numbers);
  const withoutNumbers = withMetrics.filter(r => !r.Has_Numbers);
  const withList = withMetrics.filter(r => r.Has_List);
  const withoutList = withMetrics.filter(r => !r.Has_List);

  // ── Build report ────────────────────────────────────────────────────
  let md = `# Content Performance Analysis\n\n`;
  md += `Generated: ${new Date().toISOString().slice(0, 10)}\n`;
  md += `Posts analysed: ${withMetrics.length} (of ${rows.length} total posted)\n\n`;

  md += `## Performance by Hook Type\n\n`;
  md += `| Hook Type | Avg Engagement Rate | Posts |\n|---|---|---|\n`;
  for (const [ht, rates] of Object.entries(byHookType).sort((a, b) => avg(b[1]) - avg(a[1]))) {
    md += `| ${ht} | ${avg(rates).toFixed(2)}% | ${rates.length} |\n`;
  }

  md += `\n## Performance by Pillar\n\n`;
  md += `| Pillar | Avg Engagement Rate | Posts |\n|---|---|---|\n`;
  for (const [p, rates] of Object.entries(byPillar).sort((a, b) => avg(b[1]) - avg(a[1]))) {
    md += `| ${p} | ${avg(rates).toFixed(2)}% | ${rates.length} |\n`;
  }

  md += `\n## Performance by Post Length\n\n`;
  md += `| Length | Avg Engagement Rate | Posts |\n|---|---|---|\n`;
  for (const [len, rates] of [['Short (<100w)', byLength.short], ['Medium (100-200w)', byLength.medium], ['Long (200+w)', byLength.long]]) {
    md += `| ${len} | ${rates.length ? avg(rates).toFixed(2) + '%' : 'n/a'} | ${rates.length} |\n`;
  }

  md += `\n## Performance by Day of Week\n\n`;
  md += `| Day | Avg Engagement Rate | Posts |\n|---|---|---|\n`;
  for (const [d, rates] of Object.entries(byDay).sort((a, b) => avg(b[1]) - avg(a[1]))) {
    md += `| ${d} | ${avg(rates).toFixed(2)}% | ${rates.length} |\n`;
  }

  md += `\n## Impact of Numbers and Lists\n\n`;
  md += `- Posts with specific numbers: ${avg(withNumbers.map(r => r.Engagement_Rate || 0)).toFixed(2)}% avg ER (${withNumbers.length} posts)\n`;
  md += `- Posts without numbers: ${avg(withoutNumbers.map(r => r.Engagement_Rate || 0)).toFixed(2)}% avg ER (${withoutNumbers.length} posts)\n`;
  md += `- Posts with lists: ${avg(withList.map(r => r.Engagement_Rate || 0)).toFixed(2)}% avg ER (${withList.length} posts)\n`;
  md += `- Posts without lists: ${avg(withoutList.map(r => r.Engagement_Rate || 0)).toFixed(2)}% avg ER (${withoutList.length} posts)\n`;

  md += `\n## Top 5 Performing Posts\n\n`;
  for (const r of top5) {
    md += `- **Day ${r.Day}** (${r.Hook_Type}/${r.Pillar}): ${r.Engagement_Rate}% ER, ${r.Likes} likes — "${(r.Hook_Line || '').slice(0, 80)}"\n`;
  }

  md += `\n## Bottom 5 Performing Posts\n\n`;
  for (const r of bottom5) {
    md += `- **Day ${r.Day}** (${r.Hook_Type}/${r.Pillar}): ${r.Engagement_Rate}% ER, ${r.Likes} likes — "${(r.Hook_Line || '').slice(0, 80)}"\n`;
  }

  // ── Recommendations ─────────────────────────────────────────────────
  const bestHook = Object.entries(byHookType).sort((a, b) => avg(b[1]) - avg(a[1]))[0];
  const bestPillar = Object.entries(byPillar).sort((a, b) => avg(b[1]) - avg(a[1]))[0];

  md += `\n## Recommendations\n\n`;
  if (bestHook) md += `- **Best hook type: ${bestHook[0]}** (${avg(bestHook[1]).toFixed(2)}% avg ER) — increase to 50% of upcoming content\n`;
  if (bestPillar) md += `- **Best pillar: ${bestPillar[0]}** (${avg(bestPillar[1]).toFixed(2)}% avg ER) — lean into this theme\n`;
  md += `- Posts with specific numbers ${avg(withNumbers.map(r=>r.Engagement_Rate||0)) > avg(withoutNumbers.map(r=>r.Engagement_Rate||0)) ? 'outperform' : 'underperform'} posts without — ${avg(withNumbers.map(r=>r.Engagement_Rate||0)) > avg(withoutNumbers.map(r=>r.Engagement_Rate||0)) ? 'keep including £/$ figures' : 'test posts without numbers'}\n`;
  md += `- Posts with lists ${avg(withList.map(r=>r.Engagement_Rate||0)) > avg(withoutList.map(r=>r.Engagement_Rate||0)) ? 'outperform' : 'underperform'} posts without — ${avg(withList.map(r=>r.Engagement_Rate||0)) > avg(withoutList.map(r=>r.Engagement_Rate||0)) ? 'keep using → lists' : 'test fewer lists'}\n`;

  const outPath = join(__dirname, 'strategy', 'latest-analysis.md');
  writeFileSync(outPath, md);
  console.log(`\n✓ Analysis written to ${outPath}`);
  console.log(`  ${withMetrics.length} posts analysed. Best hook: ${bestHook?.[0] || '?'}. Best pillar: ${bestPillar?.[0] || '?'}.`);
}

main().catch(e => { console.error(e); process.exit(1); });
