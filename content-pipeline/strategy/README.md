# Auto-Research Loop (Karpathy-inspired)

This directory contains the output of the self-improving content system.

## The loop

```
Week 1: Post content → measure what works
Week 2: Analyse patterns → rewrite upcoming content → post improved versions
Week 3: Measure again → patterns sharpen → rewrite again
Week 4+: System gets better every single week without manual intervention
```

## How it runs

- **Daily (10:00 AM GMT):** `scrape-metrics.js` fetches LinkedIn engagement data via Apify and writes impressions/likes/comments back to Airtable
- **Weekly (Sunday 10:00 AM GMT):** Three-step pipeline:
  1. `scrape-metrics.js` — get latest engagement data
  2. `analyze-performance.js` — find patterns, write `latest-analysis.md`
  3. `improve-content.js` — rewrite next 7 days using winning patterns

## How to read the analysis

```bash
cat content-pipeline/strategy/latest-analysis.md
```

The analysis covers:
- Performance by Hook Type (Transformation, Disruption, Value, Story, Social Proof, CTA)
- Performance by Pillar (Money, How-To, Comparison, Building in Public, CTA)
- Performance by post length (short/medium/long)
- Performance by day of week
- Impact of specific numbers and lists
- Top 5 and bottom 5 posts with explanations
- Specific recommendations

## How to manually trigger

```bash
# Scrape latest metrics
node content-pipeline/scrape-metrics.js

# Run analysis
node content-pipeline/analyze-performance.js

# Rewrite upcoming week
node content-pipeline/improve-content.js
```

## What gets tracked in Airtable

| Field | Description |
|---|---|
| Impressions | LinkedIn post views |
| Likes | LinkedIn reactions |
| Comments | LinkedIn comments |
| Shares | LinkedIn reposts |
| Engagement_Rate | (likes + comments + shares) / impressions × 100 |
| Hook_Line | First line of the post (the scroll-stopper) |
| Line_Count | Total lines in the LinkedIn post |
| Avg_Line_Length | Average characters per line |
| Has_Numbers | Does the post contain specific £/$ figures? |
| Has_List | Does the post use → or ↳ list format? |
| Post_Format | text only / text + image / text + video / carousel |

## Override protection

Posts with Status = "Posted" are never overwritten by the improvement script.
Only Status = "Ready" posts are eligible for rewriting.
If you manually edit a post in Airtable, the system respects your changes.

## After 4 weeks

The system will know:
- Which hooks get the most impressions
- Which topics drive engagement
- What post length is optimal
- Whether numbers/lists help or hurt
- Which days get the most reach

And it will automatically write more of what works and less of what doesn't.
