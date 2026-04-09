#!/usr/bin/env node
/**
 * Generates content for days 8-30 using OpenRouter (Claude Sonnet).
 * Appends to content-days.json so setup-airtable.js can push everything.
 *
 * Usage: node content-pipeline/generate-days-8-30.js
 */

import 'dotenv/config';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_PATH = join(__dirname, 'content-days.json');
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_KEY) {
  console.error('ERROR: OPENROUTER_API_KEY not set');
  process.exit(1);
}

const BRIEFS = [
  { day: 8, date: '2026-04-21', pillar: 'Money', hook_type: 'Social Proof', platforms: 'LinkedIn/Twitter/TikTok', brief: '"earned while sleeping" — woke up to 847 requests overnight, $17 earned. the API economy doesn\'t sleep.' },
  { day: 9, date: '2026-04-22', pillar: 'Comparison', hook_type: 'Disruption', platforms: 'LinkedIn/Twitter', brief: 'pricing comparison: traditional SaaS API (monthly subscription, tiered pricing, API keys, invoices) vs x402 (per-request, USDC, no keys, instant). show the absurdity of the old model for AI agents.' },
  { day: 10, date: '2026-04-23', pillar: 'CTA', hook_type: 'Value', platforms: 'LinkedIn/Twitter', brief: 'AMA post — "ask me anything about API monetisation. i\'ve built 10 APIs earning $2K/month. what do you want to know?"' },
  { day: 11, date: '2026-04-24', pillar: 'Money', hook_type: 'Social Proof', platforms: 'LinkedIn/Twitter/TikTok', brief: 'deep dive on UK Property Data API — 24 endpoints, $293/month, the boring data that agents love most. land registry, EPC ratings, flood risk.' },
  { day: 12, date: '2026-04-25', pillar: 'How-To', hook_type: 'Value', platforms: 'LinkedIn/Twitter/Instagram', brief: '"20 professionals who should monetise their expertise as APIs" — list specific roles (mortgage brokers, recruiters, pharmacists, quantity surveyors, etc) with what data they could sell.' },
  { day: 13, date: '2026-04-26', pillar: 'CTA', hook_type: 'CTA', platforms: 'LinkedIn/TikTok', brief: 'calculator reveal — "how much could YOUR API earn?" directing to payapi.market/calculator. include an example calculation.' },
  { day: 14, date: '2026-04-27', pillar: 'Money', hook_type: 'Social Proof', platforms: 'LinkedIn/Twitter', brief: 'week 2 revenue update — $512 total, 10% growth from week 1. breakdown by API. "the compound effect of 10 APIs each earning small amounts."' },
  { day: 15, date: '2026-04-28', pillar: 'How-To', hook_type: 'Value', platforms: 'LinkedIn/Twitter', brief: '"what is x402" educational explainer — HTTP 402 Payment Required, how the payment flow works, why it matters for AI agents. make it accessible to non-technical people.' },
  { day: 16, date: '2026-04-29', pillar: 'How-To', hook_type: 'Value', platforms: 'LinkedIn/Twitter', brief: '"what is MCP and why your API needs it" — Model Context Protocol lets AI agents discover your API automatically. explain like the reader has never heard of it.' },
  { day: 17, date: '2026-04-30', pillar: 'CTA', hook_type: 'CTA', platforms: 'LinkedIn/Twitter', brief: '"5 APIs I wish existed on the marketplace" — specific gaps: nutrition/food data, UK legal precedents, construction material prices, fishing conditions, train delay predictions. recruiting providers.' },
  { day: 18, date: '2026-05-01', pillar: 'Comparison', hook_type: 'Disruption', platforms: 'LinkedIn/Twitter', brief: '"x402 vs Stripe for API payments" — Stripe needs account setup, API keys, webhooks, invoicing. x402 needs one HTTP header. for AI agent traffic, x402 wins on every dimension.' },
  { day: 19, date: '2026-05-02', pillar: 'How-To', hook_type: 'Value', platforms: 'LinkedIn/Twitter/TikTok', brief: '"how AI agents actually pay for things" visual walkthrough — agent calls API → gets 402 → signs USDC payment → retries with payment header → gets data. under 2 seconds.' },
  { day: 20, date: '2026-05-03', pillar: 'Building in Public', hook_type: 'Story', platforms: 'LinkedIn/Twitter', brief: '"the API economy in 2026" thought leadership — agents making millions of API calls per day, per-request pricing replacing subscriptions, domain experts becoming API providers.' },
  { day: 21, date: '2026-05-04', pillar: 'Money', hook_type: 'Social Proof', platforms: 'LinkedIn/Twitter', brief: 'week 3 revenue + first external provider tease — $560 this week, "and next week we\'re listing our first external API provider. the marketplace is growing beyond just my APIs."' },
  { day: 22, date: '2026-05-05', pillar: 'Building in Public', hook_type: 'Social Proof', platforms: 'LinkedIn/Twitter/TikTok', brief: 'first external API listed — a recruitment data API from another provider. social proof that the marketplace model works. "payapi.market just got its 11th API and I didn\'t build it."' },
  { day: 23, date: '2026-05-06', pillar: 'Money', hook_type: 'Story', platforms: 'LinkedIn/Twitter', brief: '"the API that surprised me" — the boring postcode API earns more than the flashy screenshot API. 11,400 calls vs 3,400. lesson: boring data that agents need beats cool tech they don\'t.' },
  { day: 24, date: '2026-05-07', pillar: 'Money', hook_type: 'Transformation', platforms: 'LinkedIn/Twitter/TikTok', brief: '"at $5K/month this becomes full-time income. I\'m at $2.1K. halfway there." — the math of how 10 small APIs compound into a real business.' },
  { day: 25, date: '2026-05-08', pillar: 'CTA', hook_type: 'Value', platforms: 'LinkedIn', brief: 'featured tier explained — what $49/month gets you: priority placement, 2.5% fee (vs 3%), highlighted card. "if your API earns over $2K/month, the featured tier pays for itself 40x over."' },
  { day: 26, date: '2026-05-09', pillar: 'CTA', hook_type: 'CTA', platforms: 'LinkedIn/Twitter', brief: '"10 APIs I\'d build if I had the expertise" — recruiting providers. specific ideas: nutritional data, legal case law, construction costs, fishing/tides, train delays, energy tariffs, GP wait times, university rankings, vehicle MOT data, sports odds.' },
  { day: 27, date: '2026-05-10', pillar: 'CTA', hook_type: 'CTA', platforms: 'LinkedIn/Twitter/TikTok/Instagram', brief: 'Product Hunt launch day — "payapi.market is live on Product Hunt. the first marketplace for x402-powered APIs." coordinated push across all platforms.' },
  { day: 28, date: '2026-05-11', pillar: 'Building in Public', hook_type: 'Social Proof', platforms: 'LinkedIn/Twitter', brief: 'Product Hunt results post — upvotes, comments, traffic spike, new signups. honest numbers whether good or bad.' },
  { day: 29, date: '2026-05-12', pillar: 'Money', hook_type: 'Social Proof', platforms: 'LinkedIn/Twitter/TikTok', brief: 'month 1 full numbers breakdown — total revenue, total requests, per-API breakdown, costs (Railway, Vercel, domain), profit margin. complete transparency.' },
  { day: 30, date: '2026-05-13', pillar: 'Building in Public', hook_type: 'Story', platforms: 'LinkedIn/Twitter', brief: '"what I\'d do differently" honest reflection — opened to providers earlier, focused on fewer APIs initially, marketed from day 1, picked one platform and went deep.' },
];

const SYSTEM_PROMPT = `You are a LinkedIn/Twitter content writer for a UK-based solo founder building payapi.market — a marketplace for x402-powered APIs.

Voice rules:
- Always lowercase. No capitalisation except proper nouns.
- Direct, specific, uses real numbers.
- No emojis. Never.
- Not AI-sounding. No "let me share", "here's the thing", "game-changer", "leverage".
- Short paragraphs. One thought per line. Lots of whitespace.
- Use → for list items, ↳ for sub-items.
- Specific £/$ amounts and request counts make posts perform best.
- British spelling: monetise, optimise, organisation, etc.

For each day, output JSON with these fields:
- LinkedIn: full post (200-400 words)
- Twitter: condensed version (under 280 chars)
- TikTok_Caption: short caption with 1-2 hashtags (under 150 chars)
- Seedance_Prompt: image generation prompt (clean editorial style, 6 seconds vertical)

Return ONLY valid JSON array. No markdown, no explanation.`;

async function generateBatch(briefs) {
  const userPrompt = `Generate content for these ${briefs.length} days. Return a JSON array with one object per day, each containing: LinkedIn, Twitter, TikTok_Caption, Seedance_Prompt.

${briefs.map(b => `Day ${b.day} (${b.date}): Pillar=${b.pillar}, Hook_Type=${b.hook_type}, Platforms=${b.platforms}\nBrief: ${b.brief}`).join('\n\n')}`;

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://payapi.market',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-sonnet-4',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 8000,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter ${res.status}: ${err}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || '';

  // Extract JSON from the response (handle markdown code blocks)
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('No JSON array found in response');
  return JSON.parse(jsonMatch[0]);
}

async function main() {
  const existing = JSON.parse(readFileSync(CONTENT_PATH, 'utf-8'));
  console.log(`Existing content: ${existing.length} days`);

  if (existing.length >= 30) {
    console.log('Already have 30 days — skipping generation.');
    return;
  }

  // Generate in batches of ~8 to stay within token limits
  const allGenerated = [];
  for (let i = 0; i < BRIEFS.length; i += 8) {
    const batch = BRIEFS.slice(i, i + 8);
    console.log(`Generating days ${batch[0].day}-${batch[batch.length - 1].day}...`);

    try {
      const results = await generateBatch(batch);

      for (let j = 0; j < batch.length; j++) {
        const b = batch[j];
        const r = results[j] || {};
        allGenerated.push({
          Day: b.day,
          Date: b.date,
          Pillar: b.pillar,
          Hook_Type: b.hook_type,
          Platforms: b.platforms,
          Hook: (r.LinkedIn || '').split('\n')[0] || b.brief.slice(0, 100),
          LinkedIn: r.LinkedIn || '',
          Twitter: r.Twitter || '',
          TikTok_Script: '',
          TikTok_Caption: r.TikTok_Caption || '',
          Instagram_Caption: r.TikTok_Caption || '',
          Reddit_Sub: '',
          Reddit_Post: '',
          Seedance_Prompt: r.Seedance_Prompt || '',
        });
      }
    } catch (e) {
      console.error(`Error generating batch: ${e.message}`);
      // Fill with placeholder briefs so we still have 30 days
      for (const b of batch) {
        allGenerated.push({
          Day: b.day, Date: b.date, Pillar: b.pillar, Hook_Type: b.hook_type,
          Platforms: b.platforms, Hook: b.brief.slice(0, 100),
          LinkedIn: b.brief, Twitter: b.brief.slice(0, 280),
          TikTok_Script: '', TikTok_Caption: '', Instagram_Caption: '',
          Reddit_Sub: '', Reddit_Post: '', Seedance_Prompt: '',
        });
      }
    }

    // Rate limit between batches
    if (i + 8 < BRIEFS.length) await new Promise(r => setTimeout(r, 2000));
  }

  const full = [...existing, ...allGenerated];
  writeFileSync(CONTENT_PATH, JSON.stringify(full, null, 2));
  console.log(`\n✓ content-days.json now has ${full.length} days.`);
}

main().catch(e => { console.error(e); process.exit(1); });
