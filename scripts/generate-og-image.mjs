#!/usr/bin/env node
// Generates /public/og-image.png (1200x630) from an inline SVG.
// Run: node scripts/generate-og-image.mjs

import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '..', 'public', 'og-image.png');

const W = 1200;
const H = 630;

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0e1a"/>
      <stop offset="100%" stop-color="#06080d"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.85" cy="0.1" r="0.7">
      <stop offset="0%" stop-color="#3B82F6" stop-opacity="0.35"/>
      <stop offset="60%" stop-color="#1D4ED8" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#0a0e1a" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="0.05" cy="0.95" r="0.6">
      <stop offset="0%" stop-color="#10B981" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#0a0e1a" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect width="${W}" height="${H}" fill="url(#glow2)"/>

  <!-- Subtle grid -->
  <g stroke="#1A1F2A" stroke-width="1" opacity="0.6">
    <line x1="0" y1="${H - 110}" x2="${W}" y2="${H - 110}"/>
  </g>

  <!-- Logo (top-left) -->
  <g transform="translate(72, 64)">
    <!-- Icon: rounded square with monogram -->
    <rect x="0" y="0" width="48" height="48" rx="12" ry="12" fill="#1D4ED8"/>
    <text x="24" y="33" font-family="Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif"
          font-size="26" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="-1">P</text>
    <!-- Wordmark -->
    <text x="66" y="24" font-family="Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif"
          font-size="22" font-weight="700" fill="#FFFFFF" letter-spacing="-0.3">payapi</text>
    <text x="66" y="46" font-family="Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif"
          font-size="14" font-weight="500" fill="#3B82F6" letter-spacing="2">MARKET</text>
  </g>

  <!-- Badge (top-right) -->
  <g transform="translate(${W - 72 - 210}, 76)">
    <rect x="0" y="0" width="210" height="32" rx="16" ry="16" fill="rgba(59,130,246,0.12)" stroke="#3B82F6" stroke-width="1"/>
    <circle cx="18" cy="16" r="4" fill="#10B981"/>
    <text x="32" y="21" font-family="Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif"
          font-size="13" font-weight="600" fill="#FFFFFF" letter-spacing="0.3">x402 · LIVE MARKETPLACE</text>
  </g>

  <!-- Headline -->
  <g transform="translate(72, 236)">
    <text font-family="Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif"
          font-size="68" font-weight="800" fill="#FFFFFF" letter-spacing="-2.2">
      <tspan x="0" y="0">The UK's Marketplace</tspan>
      <tspan x="0" y="82">for <tspan fill="#3B82F6">x402 APIs</tspan></tspan>
    </text>
  </g>

  <!-- Subtext -->
  <g transform="translate(72, 430)">
    <text font-family="Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif"
          font-size="26" font-weight="500" fill="#94A3B8" letter-spacing="-0.3">
      <tspan x="0" y="0"><tspan fill="#FFFFFF" font-weight="700">11 APIs</tspan> · <tspan fill="#FFFFFF" font-weight="700">68 endpoints</tspan> · <tspan fill="#10B981" font-weight="700">86,238 records</tspan></tspan>
      <tspan x="0" y="40">Built for AI agents.</tspan>
    </text>
  </g>

  <!-- Footer -->
  <g transform="translate(72, ${H - 52})">
    <text font-family="Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif"
          font-size="15" font-weight="500" fill="#64748B" letter-spacing="0.2">
      x402  ·  USDC on Base  ·  Powered by Coinbase + Cloudflare
    </text>
  </g>

  <!-- Right-side decorative endpoint chips -->
  <g transform="translate(${W - 72 - 360}, 270)" font-family="Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif">
    <g transform="translate(0, 0)">
      <rect x="0" y="0" width="360" height="44" rx="10" ry="10" fill="rgba(255,255,255,0.03)" stroke="#1A1F2A"/>
      <text x="16" y="28" font-size="14" font-weight="600" fill="#FFFFFF">GET /property/epc</text>
      <text x="344" y="28" font-size="14" font-weight="600" fill="#10B981" text-anchor="end">$0.002</text>
    </g>
    <g transform="translate(0, 56)">
      <rect x="0" y="0" width="360" height="44" rx="10" ry="10" fill="rgba(255,255,255,0.03)" stroke="#1A1F2A"/>
      <text x="16" y="28" font-size="14" font-weight="600" fill="#FFFFFF">GET /companies/{n}</text>
      <text x="344" y="28" font-size="14" font-weight="600" fill="#10B981" text-anchor="end">$0.003</text>
    </g>
    <g transform="translate(0, 112)">
      <rect x="0" y="0" width="360" height="44" rx="10" ry="10" fill="rgba(255,255,255,0.03)" stroke="#1A1F2A"/>
      <text x="16" y="28" font-size="14" font-weight="600" fill="#FFFFFF">POST /email/verify</text>
      <text x="344" y="28" font-size="14" font-weight="600" fill="#10B981" text-anchor="end">$0.001</text>
    </g>
  </g>
</svg>`;

await sharp(Buffer.from(svg))
  .png({ compressionLevel: 9 })
  .toFile(OUT);

console.log(`✓ Wrote ${OUT}`);
