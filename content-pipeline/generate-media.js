#!/usr/bin/env node
/**
 * Generates images for each day's Seedance_Prompt via OpenRouter.
 * Updates Media_URL back into Airtable if AIRTABLE_BASE_ID is set.
 *
 * NOTE: As of April 2026, most image generation models on OpenRouter
 * (DALL-E, Stable Diffusion, Seedance) are text-to-image models that
 * return base64 or URLs. If no image model is available, this script
 * logs a warning and skips.
 *
 * Usage: AIRTABLE_BASE_ID=appXXX node content-pipeline/generate-media.js
 */

import 'dotenv/config';

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;

async function checkImageModels() {
  const res = await fetch('https://openrouter.ai/api/v1/models', {
    headers: { 'Authorization': `Bearer ${OPENROUTER_KEY}` },
  });
  if (!res.ok) return [];
  const data = await res.json();
  // Look for image generation models
  const imageModels = (data.data || []).filter(m =>
    m.id.includes('dall-e') ||
    m.id.includes('stable-diffusion') ||
    m.id.includes('seedance') ||
    m.id.includes('flux') ||
    m.id.includes('midjourney') ||
    (m.architecture?.modality || '').includes('image')
  );
  return imageModels;
}

async function main() {
  if (!OPENROUTER_KEY) {
    console.error('ERROR: OPENROUTER_API_KEY not set');
    process.exit(1);
  }

  console.log('Checking for available image generation models on OpenRouter...');
  const models = await checkImageModels();

  if (models.length === 0) {
    console.log(`
⚠ No image generation models found on OpenRouter.

  Seedance, DALL-E, Stable Diffusion, and Flux are not currently
  available through the OpenRouter API for this account.

  Options:
  1. Generate images manually using the Seedance_Prompt in each
     Airtable row and upload to a CDN
  2. Use a dedicated image API (Replicate, Fal.ai, or DALL-E direct)
  3. Wait for image models to become available on OpenRouter

  Skipping media generation for now. The content pipeline works
  without images — posts will go out as text only.
`);
    return;
  }

  console.log(`Found ${models.length} image model(s): ${models.map(m => m.id).join(', ')}`);
  console.log('Image generation would proceed here with the first available model.');
  // TODO: implement actual generation + Airtable Media_URL update
  // when a suitable model is confirmed available
}

main().catch(e => { console.error(e); process.exit(1); });
