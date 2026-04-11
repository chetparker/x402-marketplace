# GEO Audit — payapi.market

**Audit date:** 2026-04-11
**Methodology:** GEO-first, SEO-supported. 5 parallel subagents (visibility, platform, technical, content, schema).
**Target:** https://payapi.market — Vite + React SPA on Vercel, launched April 2026.

---

## Composite Score: **21 / 100**

| Category | Weight | Score | Weighted |
|---|---|---|---|
| AI Citability & Visibility | 25% | 28 | 7.0 |
| Brand Authority Signals | 20% | 4 | 0.8 |
| Content Quality & E-E-A-T | 20% | 13 | 2.6 |
| Technical Foundations | 15% | 46 | 6.9 |
| Structured Data | 10% | 2 | 0.2 |
| Platform Optimization | 10% | 34 | 3.4 |
| **Total** | | | **21 / 100** |

**Realistic post-fix target: ~65 / 100** within 4–6 weeks if the P0 fix ships. The remaining gap to 90+ is brand authority, which only fills with time and seeded mentions.

---

## One-Line Verdict

**The discoverability metadata layer is genuinely above-average — `robots.txt`, `llms.txt`, sitemap, and OG tags are all in good shape. But every public route ships an empty `<div id="root"></div>` shell, so AI crawlers see nothing. Fix that one thing and four of the six category scores jump together.**

---

## P0 — The Single Blocker (fix this before anything else)

### Server-rendered HTML is empty on every route

```
$ curl -A Googlebot https://payapi.market/         # 875 bytes, empty body
$ curl -A Googlebot https://payapi.market/pricing  # 875 bytes, empty body — identical
$ curl -A Googlebot https://payapi.market/about    # 875 bytes, empty body — identical
$ curl -I https://payapi.market/this-does-not-exist
HTTP/2 200    ← soft-404, every unknown URL serves the same shell
```

**Implications, in order of severity:**

1. **Bingbot will time out before seeing the content.** Bing renders JS on a strict budget; a 700 KB / 208 KB-gzipped bundle on a brand-new domain with zero crawl priority means most pages won't make it past the render queue. ChatGPT Search runs on Bing — **the site is essentially invisible to it (18/100).**
2. **Most AI crawlers don't run JS at all.** GPTBot, ClaudeBot, CCBot, PerplexityBot, Bytespider — all of them get the empty shell. Your `robots.txt` welcomes them; the content welcomes none of them. The whole `Allow:` ceremony is wasted.
3. **`llms.txt` is doing 100% of the heavy lifting.** It's well-written, but a single 50-line file can't carry an entire marketplace. Per-listing, per-API, per-blog-post pages are completely invisible.
4. **Soft-404s are infinite.** `/this-does-not-exist` returns 200 with the same shell. Google will eventually index garbage URLs and treat the whole site as low-quality.
5. **Every page has the same title, description, OG card, and (non-existent) canonical.** Sharing `/pricing` to LinkedIn, Slack, X, or Discord shows the homepage card.

**Fix (one of these, in order of preference):**

| Option | Effort | Result |
|---|---|---|
| **Migrate to Next.js** with `app/` router | Largest | Full SSR/SSG, ISR, and gives you native API routes — strong long-term move |
| **Add `vite-plugin-ssr` / `vike`** | Medium | Keeps Vite, adds true SSR per route |
| **Add `vite-plugin-prerender` or `react-snap`** | Smallest | Static prerender at build time for `/`, `/pricing`, `/calculator`, `/providers`, `/agents`, `/enterprises`, `/developers`, `/about`, `/blog` — leaves `/list`, `/dashboard`, `/admin` as SPA. **This is the highest ROI for the smallest blast radius.** |

**You don't need full SSR.** Static prerendering of the 9 marketing pages would resolve the indexability crisis on its own. The interactive routes (`/list`, `/dashboard`) can stay client-rendered.

---

## Detailed Findings by Category

### 1. AI Citability & Visibility — 28 / 100

| Sub-metric | Score |
|---|---|
| Citability (extractable content) | 28 |
| AI crawler access (robots.txt) | 88 |
| llms.txt quality | 82 |
| Brand authority | 4 |

**What's working:**
- `robots.txt` explicitly allowlists GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot, anthropic-ai, Google-Extended, CCBot, Bytespider, Applebot-Extended.
- `llms.txt` is comprehensive — ahead of 95% of llms.txt files in the wild. Includes pricing, MCP endpoint, founder, listed APIs.

**What's broken:**
- Empty shell on every route (see P0).
- Brand authority is essentially zero — **no hits on Reddit, HN, GitHub, Product Hunt, dev.to, LinkedIn, or X for "PayAPI Market" or "payapi.market"**. The crowded x402 category already has 5+ indexed competitors LLMs will cite ahead of you.

**Robots.txt gaps to add (April 2026 crawler list):**
```
User-agent: OAI-SearchBot         # ChatGPT Search index (separate from GPTBot)
User-agent: PerplexityBot-User    # user-action fetcher
User-agent: Amazonbot
User-agent: DuckAssistBot
User-agent: cohere-ai
User-agent: Diffbot
User-agent: Meta-ExternalAgent    # Llama / Meta AI
User-agent: Meta-ExternalFetcher
User-agent: Mistral-User
User-agent: Kagibot
User-agent: YouBot
User-agent: PanguBot
Allow: /
```

### 2. Platform Optimization — 34 / 100

| Platform | Score | Why |
|---|---|---|
| Google AI Overviews | 32 | Googlebot eventually renders JS, but no schema, no comparison content, no authority. AIO favours fresh, structured HTML. |
| ChatGPT Search (Bing) | **18** | Worst surface. Bingbot won't render the SPA in time; sitemap URLs collapse to one shell under duplicate-content detection. |
| Perplexity | 40 | Best non-Claude surface — `llms.txt` is the kind of artifact Perplexity ingests well. Bing fallback hurts. |
| Claude.ai web search | 45 | ClaudeBot allowed + llms.txt quality + Brave substrate (less JS-render-heavy than Bing). Highest score. |

### 3. Technical Foundations — 46 / 100

| Sub-metric | Score | Note |
|---|---|---|
| Crawlability | 85 | `robots.txt`, sitemap, `llms.txt` all valid. `payapi.market` 307s to `www.` — verify sitemap uses canonical `www.` to avoid double-hop. |
| **Indexability** | **15** | **Critical.** Empty shell on every route (see P0). |
| Core Web Vitals proxy | 40 | 700 KB / 208 KB-gzipped single bundle, blocking module script in `<head>`. Mid-tier mobile LCP ~2–4s before paint. |
| Mobile-friendliness | 100 | Viewport meta correct. |
| Security headers | 35 | HSTS present (2yr, no `includeSubDomains; preload`). **Missing:** CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy. |
| Canonical / hreflang | 0 | No `<link rel="canonical">` anywhere. Once UTM/filter params arrive, duplicate-content risk is high. |
| **404 handling** | **0** | **Critical.** `/this-does-not-exist` returns HTTP 200 with the same shell. Vercel SPA rewrite catches everything. |
| Sitemap freshness | 95 | Dated 2026-04-11. Good. |

### 4. Content Quality & E-E-A-T — 13 / 100

`WebFetch` of `/about`, `/pricing`, `/blog`, `/providers`, `/calculator` all returned the same 6-word title-only response — i.e. *no rendered body content was visible to the audit*. Whatever copy lives in the React tree is invisible to non-JS crawlers, which is what matters for AI search.

| Dimension | Score |
|---|---|
| Content depth & uniqueness | 10 |
| Experience signals | 15 |
| Expertise signals | 15 |
| Authoritativeness signals | 10 |
| Trustworthiness signals | 15 |

**Content gap analysis** — what AI engines will look for and not find:
- "What is x402?" definitional pillar
- "x402 vs Stripe / vs Lightning / vs RevenueCat" comparison
- "How to monetise an API for AI agents" how-to
- "Best MCP marketplaces / x402 marketplaces 2026" listicle (the site itself should rank for this)
- "USDC on Base vs other chains for agent payments"
- Founder story with build-in-public numbers
- Pricing FAQ with FAQPage schema
- Glossary (x402, facilitator, resource server, scheme, MCP, A2A, USDC, Base)

### 5. Structured Data — 2 / 100

**Zero JSON-LD in the SSR HTML on any route audited.** Only basic OG tags exist.

**Highest-ROI schemas to ship (in priority order):**

1. **Organization** → `index.html` head (ships in SSR HTML, no JS needed)
2. **WebSite + SearchAction** → `index.html` head
3. **Product + Offer** for the $49/mo Featured tier → `/pricing`
4. **FAQPage** for the 6 pricing questions → `/pricing`
5. SoftwareApplication / Service → `index.html` head
6. BreadcrumbList → every inner page
7. Article + Author → each blog post
8. Person (Chet Parker) → `/about` and as `founder` on Organization

**Key insight:** Putting Organization + WebSite directly in `index.html` `<head>` ships them in the SSR response and makes them instantly crawlable by GPTBot/ClaudeBot/PerplexityBot **without waiting for prerendering to be implemented**. This is a 30-minute change with disproportionate return.

Ready-to-paste JSON-LD blocks for the top 4 schemas are in the geo-schema subagent's full report — request `/geo schema https://payapi.market` for the complete code.

### 6. Brand Authority — 4 / 100

- **Zero direct hits** for "PayAPI Market" or "payapi.market" across Reddit, HN, GitHub, Product Hunt, dev.to, LinkedIn, X.
- "Chet Parker" + payapi.market → no indexed association.
- Competing surfaces already indexed and likely to be cited ahead: **x402.org/ecosystem**, **marketx402.app**, **x402scan.com/resources**, **mcpmarket.com (x402 Bazaar)**, a Stacks-based x402 marketplace on Vercel, **xpay.sh**.

The window to build authority before LLMs lock in their preferred citations for the x402 category is **short** — measured in months, not years.

---

## Prioritized Action Plan

### Quick Wins (this week — under 1 day each)

1. **Add Organization + WebSite JSON-LD to `index.html` `<head>`.** Ships in SSR HTML without prerendering. 30 min.
2. **Fix `vercel.json` to return real HTTP 404 for unknown paths.** Stops infinite soft-404s. ~1 hour.
3. **Add missing security headers via `vercel.json`** (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy; upgrade HSTS with `includeSubDomains; preload`). ~1 hour.
4. **Expand `robots.txt`** with the missing crawler UAs listed above. 10 min.
5. **Expand `llms.txt`**: add an FAQ section, a per-API catalog with prices and endpoint URLs, `Last updated:` line, and consider publishing `llms-full.txt` with full About/Pricing/Calculator copy inline. 2 hours.
6. **Add `<link rel="canonical">` baseline** to `index.html` shell. 5 min.
7. **Verify sitemap URLs use `www.payapi.market`** to match the 307 target. 5 min.

### P0 — The Big One (this sprint)

8. **Prerender the 9 marketing routes** (`/`, `/pricing`, `/calculator`, `/providers`, `/agents`, `/enterprises`, `/developers`, `/about`, `/blog`) using `vite-plugin-prerender` or `vike`. Keep `/list`, `/dashboard`, `/admin` as SPA. **This single change unblocks indexability, fixes Bingbot, fixes per-route OG cards, and lets all the structured data above actually ship in HTML.**

### Medium-Term (next 2–4 weeks, after prerendering ships)

9. **Add the remaining JSON-LD schemas** via React Helmet — Product/Offer on `/pricing`, FAQPage on `/pricing` with the existing 6 Q&A items, BreadcrumbList everywhere, Person for Chet Parker on `/about`.
10. **Publish 3 pillar/comparison posts** on the blog: "What is x402?", "x402 vs Stripe for AI agents", "Best MCP marketplaces in April 2026". Each with Article + Author schema, byline, original numbers, comparison tables, and a code example.
11. **Code-split the 700 KB bundle** with `React.lazy` per route. Move script tag to `defer` / end of body. Extract vendor chunk.
12. **Founder-authored launch post** on `/blog` with real build numbers (signups, listings, GMV, uptime), screenshots, week-one lessons. Person + Article schema.

### Strategic (next 4–8 weeks)

13. **Seed brand mentions on 5 surfaces**:
    - **Show HN:** "PayAPI Market — marketplace for x402 APIs where agents pay per request"
    - **Product Hunt** launch
    - **dev.to** technical writeup on the MCP + x402 integration
    - **Get listed** on x402.org/ecosystem, x402scan.com/resources, mcpmarket.com
    - **GitHub repo** ("awesome-x402" or an SDK) under the founder's handle, linking back
14. **Submit pages to Bing Webmaster Tools via IndexNow** as soon as prerendering ships — this is the only way to claw back the ChatGPT Search visibility blocked by Bing's crawl-budget cold start.
15. **Build out `/providers` as a how-to** with code: 5-minute integration walkthrough, Python + TypeScript snippets, "monetise your existing FastAPI endpoint in 10 lines" example, one case study (founder's own API works for the first one). HowTo schema.

---

## Score Trajectory

| Category | Now | After Quick Wins | After P0 + Medium | After Strategic |
|---|---|---|---|---|
| AI Citability & Visibility | 28 | 38 | 75 | 80 |
| Brand Authority | 4 | 4 | 8 | 30 |
| Content E-E-A-T | 13 | 15 | 60 | 75 |
| Technical Foundations | 46 | 70 | 85 | 90 |
| Structured Data | 2 | 35 | 88 | 90 |
| Platform Optimization | 34 | 40 | 70 | 80 |
| **Composite** | **21** | **31** | **62** | **72** |

The plateau from 72 → 90 is gated almost entirely on brand authority, which is a function of time, content output, and earned mentions — not technical work.

---

## Methodology

This audit was generated by the `/geo` skill using 5 parallel subagents:
- **geo-ai-visibility** — citability, AI crawler access, llms.txt quality, brand mentions
- **geo-platform-analysis** — Google AIO, ChatGPT Search, Perplexity, Claude.ai
- **geo-technical** — crawlability, indexability, CWV proxy, headers, 404s
- **geo-content** — E-E-A-T across 5 key pages
- **geo-schema** — structured data detection + ready-to-paste JSON-LD

**Composite weights** — AI Citability 25%, Brand Authority 20%, Content E-E-A-T 20%, Technical 15%, Schema 10%, Platform 10%.

**What WAS NOT measured** (and would need separate tooling):
- Real Lighthouse / PageSpeed Insights numbers (used bundle size + SPA pattern as proxy)
- Backlink count (used absence-of-mentions search as proxy)
- Actual indexed-page count in Google / Bing
- Real Core Web Vitals from CrUX field data
