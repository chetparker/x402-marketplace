#!/usr/bin/env node
// Generates public/sitemap.xml for PayAPI Market.
// Run: node scripts/generate-sitemap.js
// Integrate into build: add `"prebuild": "node scripts/generate-sitemap.js"` to package.json scripts.

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_URL = 'https://payapi.market';
const TODAY = new Date().toISOString().slice(0, 10);

const STATIC_ROUTES = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/about', priority: 0.7, changefreq: 'monthly' },
  { path: '/pricing', priority: 0.9, changefreq: 'weekly' },
  { path: '/calculator', priority: 0.9, changefreq: 'weekly' },
  { path: '/blog', priority: 0.8, changefreq: 'weekly' },
  { path: '/providers', priority: 0.9, changefreq: 'weekly' },
  { path: '/agents', priority: 0.9, changefreq: 'weekly' },
  { path: '/developers', priority: 0.9, changefreq: 'weekly' },
  { path: '/enterprises', priority: 0.9, changefreq: 'weekly' },
  { path: '/list', priority: 0.9, changefreq: 'monthly' },
];

const BLOG_POSTS = [
  'what-is-the-x402-protocol',
  'x402-vs-api-keys-vs-oauth',
  'how-to-list-your-api-in-10-minutes',
  'ai-agent-economics-2026',
  'payapi-market-vs-rapidapi',
];

function urlEntry({ path, priority, changefreq, lastmod = TODAY }) {
  return `  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`;
}

const entries = [
  ...STATIC_ROUTES.map(urlEntry),
  ...BLOG_POSTS.map(slug => urlEntry({
    path: `/blog/${slug}`,
    priority: 0.7,
    changefreq: 'monthly',
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, '..', 'public', 'sitemap.xml');
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, xml, 'utf-8');

console.log(`✓ Sitemap written to ${outPath} (${entries.length} URLs)`);
