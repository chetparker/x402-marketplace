# Content Pipeline — 30-Day Automated Content System

Automated content creation, posting, and self-improvement pipeline for payapi.market.

## Architecture

```
Airtable (Content Calendar)
    ↓ read today's row
post-daily.js → Blotato API → LinkedIn, Twitter, TikTok, Instagram
    ↓ 2 hours later
scrape-metrics.js → Apify → LinkedIn engagement data → Airtable
    ↓ every Sunday
analyze-performance.js → strategy/latest-analysis.md
    ↓
improve-content.js → OpenRouter (Claude) → rewrite next week → Airtable
```

## Quick start

```bash
# 1. Set up environment
cp .env.example .env  # then fill in your keys

# 2. Generate days 8-30 content (uses OpenRouter)
node content-pipeline/generate-days-8-30.js

# 3. Create Airtable base manually (instructions printed by the script)
node content-pipeline/setup-airtable.js

# 4. Set AIRTABLE_BASE_ID and populate rows
AIRTABLE_BASE_ID=appXXX node content-pipeline/setup-airtable.js

# 5. Post today's content manually
AIRTABLE_BASE_ID=appXXX node content-pipeline/post-daily.js

# 6. Or run the full pipeline
./content-pipeline/run.sh
```

## Automated posting (GitHub Actions)

The daily post goes out at **8:00 AM GMT** every day via `.github/workflows/daily-post.yml`.

Required GitHub Secrets:
- `AIRTABLE_API_KEY`
- `AIRTABLE_BASE_ID`
- `BLOTATO_API_KEY`
- `OPENROUTER_API_KEY` (for weekly rewrites)
- `APIFY_API_KEY` (for metric scraping)

## How to pause posting

Change the row's Status from "Ready" to "Draft" in Airtable. The posting script only picks up rows where Status = "Ready".

## How to edit content

Edit any row directly in Airtable. Changes take effect immediately — the posting script reads fresh data each morning.

## How to add more days

Add rows to Airtable with the next Day number, a Date, and Status = "Ready". The pipeline picks them up automatically.

## Scripts

| Script | What it does | When it runs |
|---|---|---|
| `setup-airtable.js` | Populates Airtable with 30 days of content | Once, during setup |
| `generate-days-8-30.js` | Generates days 8-30 via OpenRouter | Once, during setup |
| `generate-media.js` | Generates images from Seedance prompts | Before posting (optional) |
| `post-daily.js` | Posts today's content via Blotato | Daily at 8:00 AM GMT |
| `scrape-metrics.js` | Scrapes LinkedIn engagement via Apify | Daily at 10:00 AM GMT |
| `analyze-performance.js` | Analyses patterns, writes strategy report | Weekly on Sundays |
| `improve-content.js` | Rewrites upcoming week using winning patterns | Weekly on Sundays |
| `run.sh` | Runs generate-media + post-daily in sequence | Manual |
