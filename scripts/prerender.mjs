#!/usr/bin/env node
// Prerenders the marketing routes of PayAPI Market into static HTML files.
//
// How it works:
//   1. Read the Vite-built `dist/index.html` (the SPA shell, with the hashed
//      asset filename baked in by Vite).
//   2. For each marketing route, take that shell and:
//      - swap <title>, <meta description>, OG, Twitter, canonical
//      - inject the JSON-LD schemas relevant to the route
//      - replace the empty `<div id="root"></div>` with a real, semantic
//        body that crawlers can read
//   3. Write to `dist/<route>/index.html`.
//
// When a real user visits, Vercel serves the prerendered HTML first (instant
// LCP, real meta and schema for crawlers). When the JS bundle loads, React's
// `createRoot.render()` REPLACES the contents of #root with the live React
// tree. So the prerendered content is invisible to JS users and visible to
// every non-JS crawler.
//
// Run: node scripts/prerender.mjs (after `vite build`)

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DIST = resolve(ROOT, 'dist');
const SHELL_PATH = resolve(DIST, 'index.html');

// ---------------------------------------------------------------------------
// Shared schemas (Organization + WebSite are already in the shell head, but
// the per-route helpers below add their own page-specific schemas)
// ---------------------------------------------------------------------------
const SITE = 'https://payapi.market';

function breadcrumb(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE}${item.path}`,
    })),
  };
}

function webPage({ path, name, description, type = 'WebPage' }) {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${SITE}${path}#webpage`,
    url: `${SITE}${path}`,
    name,
    description,
    isPartOf: { '@id': `${SITE}/#website` },
    about: { '@id': `${SITE}/#organization` },
    inLanguage: 'en',
  };
}

// ---------------------------------------------------------------------------
// Per-route definitions
// ---------------------------------------------------------------------------
const ROUTES = [
  // -----------------------------------------------------------------------
  {
    path: '/',
    title: 'PayAPI Market — Paid APIs for AI Agents',
    description: 'The marketplace for x402-powered paid APIs. AI agents discover via MCP and pay per request in USDC. No API keys, no subscriptions. Providers list once and keep 97%.',
    canonical: '/',
    body: `
<header role="banner">
  <a href="/"><strong>PayAPI Market</strong></a>
  <nav aria-label="Primary">
    <a href="/">Marketplace</a>
    <a href="/providers">Providers</a>
    <a href="/agents">Agents</a>
    <a href="/enterprises">Enterprises</a>
    <a href="/calculator">Calculator</a>
    <a href="/pricing">Pricing</a>
    <a href="/blog">Blog</a>
    <a href="/about">About</a>
    <a href="/login">Log in</a>
  </nav>
</header>
<main>
  <h1>Paid APIs for AI Agents</h1>
  <p>PayAPI Market is the marketplace for <strong>x402-powered APIs</strong> built for the agent economy. AI agents discover tools via the <strong>Model Context Protocol (MCP)</strong> and pay for each request in <strong>USDC on Base</strong>. No API keys, no subscriptions, no signup.</p>
  <p>Providers list once and keep 97% of revenue. The platform fee is 3% on the free tier, 2.5% on the Featured tier ($49/month).</p>

  <h2>Live API listings</h2>
  <p>Five APIs at launch (April 2026), 69 endpoints total:</p>
  <ul>
    <li><strong>UK Data API</strong> — 24 endpoints. Land Registry, EPC, Companies House, DVLA, Bank of England rates, Met Office weather, crime, flood risk. $0.001 – $0.01 per request.</li>
    <li><strong>Crypto Oracle</strong> — 15 endpoints. Spot prices, DEX pool depth, whale tracking, on-chain TVL, gas prices. $0.0005 – $0.005 per request.</li>
    <li><strong>Global Weather</strong> — 8 endpoints. Forecasts, severe weather alerts, marine, historical climate. $0.0008 – $0.003 per request.</li>
    <li><strong>EU Compliance Check</strong> — 10 endpoints. GDPR, PSD2, MiCA, sanctions list, VAT validation. $0.005 – $0.02 per request.</li>
    <li><strong>Geospatial Intel</strong> — 12 endpoints. Geocoding, isochrones, demographics, points of interest, traffic. $0.001 – $0.008 per request.</li>
  </ul>

  <h2>How it works</h2>
  <ol>
    <li><strong>Discovery</strong> — Agents connect to one MCP SSE endpoint and see every listed tool.</li>
    <li><strong>Request</strong> — The agent calls a tool. The server responds with HTTP 402 plus x402 payment requirements.</li>
    <li><strong>Payment</strong> — The agent's wallet signs and broadcasts a USDC transfer on Base. ~400ms finality.</li>
    <li><strong>Delivery</strong> — Server verifies on-chain, returns the data.</li>
    <li><strong>Settlement</strong> — Provider receives 97% (or 97.5% on Featured), platform takes 3% (or 2.5%).</li>
  </ol>

  <h2>Why per-request micropayments matter for agents</h2>
  <p>Subscription pricing breaks for autonomous workloads. An agent might call your API 5 times all month or 50,000 times in an hour. Credit cards and OAuth don't work for agents that have no humans to click buttons. PayAPI Market routes around all of that: discover via MCP, pay via x402, settle in USDC.</p>

  <h2>Get started</h2>
  <ul>
    <li><a href="/list">List your API</a> — free, takes 10 minutes</li>
    <li><a href="/calculator">Estimate your revenue</a> — calculator</li>
    <li><a href="/agents">Connect an agent</a> — MCP setup guide</li>
    <li><a href="/pricing">See pricing</a> — Free vs Featured</li>
  </ul>
</main>
<footer>
  <p>PayAPI Market · built by Chet Parker · launched April 2026 · <a href="/about">About</a> · <a href="/llms.txt">llms.txt</a></p>
</footer>
`,
    schemas: [
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        '@id': `${SITE}/#software`,
        name: 'PayAPI Market',
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'API Marketplace',
        operatingSystem: 'Web',
        url: SITE,
        description: 'Marketplace for x402-powered APIs that AI agents call per-request with USDC.',
        offers: [
          {
            '@type': 'Offer',
            name: 'Free tier',
            price: '0',
            priceCurrency: 'USD',
            description: '3% platform fee on successful calls',
          },
          {
            '@type': 'Offer',
            name: 'Featured tier',
            price: '49',
            priceCurrency: 'USD',
            description: '2.5% platform fee, gold badge, priority placement',
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: '49',
              priceCurrency: 'USD',
              unitCode: 'MON',
            },
          },
        ],
        publisher: { '@id': `${SITE}/#organization` },
      },
      breadcrumb([{ name: 'Marketplace', path: '/' }]),
    ],
  },

  // -----------------------------------------------------------------------
  {
    path: '/pricing',
    title: 'Pricing — Free to list, you keep 97% · PayAPI Market',
    description: 'PayAPI Market pricing. Free tier: $0/mo, 3% platform fee. Featured tier: $49/mo, 2.5% platform fee, priority placement. No subscriptions for buyers.',
    canonical: '/pricing',
    body: `
<header role="banner"><a href="/"><strong>PayAPI Market</strong></a> · <a href="/">Marketplace</a></header>
<main>
  <nav aria-label="Breadcrumb"><a href="/">Home</a> › Pricing</nav>
  <h1>Pricing</h1>
  <p>Free to list. You keep 97%. No subscriptions for buyers, no monthly fees on the free tier.</p>

  <h2>Free — $0 / forever</h2>
  <ul>
    <li>3% platform fee on successful x402 calls</li>
    <li>97% revenue retained by the provider</li>
    <li>Unlimited API listings</li>
    <li>Per-request USDC payouts (settled on-chain, no invoicing)</li>
    <li>MCP Registry auto-sync — discoverable by every agent on the network</li>
    <li>Only pays platform fees on successful calls — if your API doesn't earn, you don't pay</li>
    <li>No monthly bill, ever</li>
  </ul>
  <p><a href="/list">Get started free →</a></p>

  <h2>Featured — $49 / month</h2>
  <ul>
    <li>Reduced 2.5% platform fee</li>
    <li>97.5% revenue retained</li>
    <li>Everything in Free, plus:</li>
    <li>Gold badge on your listing card</li>
    <li>Always first in search results</li>
    <li>Priority position in every category filter</li>
    <li>Featured in the MCP tool manifest surfaced to agents</li>
    <li>Priority support</li>
  </ul>
  <p><a href="/list?tier=featured">Go Featured — $49/mo →</a></p>

  <h2>Frequently asked questions</h2>
  <h3>Is listing really free?</h3>
  <p>Yes. You can list any API on PayAPI Market at no cost. We only take a 3% fee on successful payments — if your API doesn't earn, you don't pay us anything.</p>

  <h3>How does the 3% fee work?</h3>
  <p>When an AI agent pays your API via x402, the payment is split on-chain: 97% to your wallet, 3% to the PayAPI Market treasury. No invoicing, no monthly bill, no surprise fees.</p>

  <h3>What do I get with Featured ($49/mo)?</h3>
  <p>A reduced 2.5% platform fee, a gold badge on your card, always-first placement in search and category filters, and priority inclusion in the MCP tool manifest surfaced to agents. Breakeven vs Free is around $10K/mo in gross revenue.</p>

  <h3>Do I need a crypto wallet to get paid?</h3>
  <p>Yes. Payments settle as USDC on Base. You provide a wallet address at listing time. Off-ramp to USD is available through any USDC-supported exchange or bank on-ramp like Coinbase.</p>

  <h3>Can I change pricing per endpoint?</h3>
  <p>Yes. Every endpoint can have its own x402 price — from $0.0001 to any amount. Price per request is set in your MCP server configuration; the marketplace reads and displays it automatically.</p>

  <h3>Do buyers pay monthly subscriptions?</h3>
  <p>No. The whole point of x402 is pay-per-request. AI agents pay only for the calls they make, in USDC, with no minimum spend and no accounts. This makes your API instantly usable by any agent on the network.</p>
</main>
`,
    schemas: [
      webPage({ path: '/pricing', name: 'Pricing — PayAPI Market', description: 'Free vs Featured tier pricing for the PayAPI Market API marketplace.' }),
      {
        '@context': 'https://schema.org',
        '@type': 'Product',
        '@id': `${SITE}/pricing#featured`,
        name: 'PayAPI Market — Featured Tier',
        description: 'Premium listing on PayAPI Market: priority placement, gold badge, reduced 2.5% platform fee, always-first ordering in search results, featured in agent-facing MCP tool manifest.',
        brand: { '@id': `${SITE}/#organization` },
        category: 'API Marketplace Subscription',
        offers: {
          '@type': 'Offer',
          url: `${SITE}/pricing`,
          priceCurrency: 'USD',
          price: '49.00',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: '49.00',
            priceCurrency: 'USD',
            billingIncrement: 1,
            unitCode: 'MON',
          },
          availability: 'https://schema.org/InStock',
          seller: { '@id': `${SITE}/#organization` },
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        '@id': `${SITE}/pricing#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Is listing really free?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. You can list any API on PayAPI Market at no cost. We only take a 3% fee on successful payments — if your API doesn\'t earn, you don\'t pay us anything.',
            },
          },
          {
            '@type': 'Question',
            name: 'How does the 3% fee work?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'When an AI agent pays your API via x402, the payment is split on-chain: 97% to your wallet, 3% to the PayAPI Market treasury. No invoicing, no monthly bill, no surprise fees.',
            },
          },
          {
            '@type': 'Question',
            name: 'What do I get with Featured ($49/mo)?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'A reduced 2.5% platform fee, a gold badge on your card, always-first placement in search and category filters, and priority inclusion in the MCP tool manifest surfaced to agents. Breakeven vs Free is around $10K/mo in gross revenue.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do I need a crypto wallet to get paid?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Payments settle as USDC on Base. You provide a wallet address at listing time. Off-ramp to USD is available through any USDC-supported exchange or bank on-ramp like Coinbase.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I change pricing per endpoint?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Every endpoint can have its own x402 price — from $0.0001 to any amount. Price per request is set in your MCP server configuration; the marketplace reads and displays it automatically.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do buyers pay monthly subscriptions?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. The whole point of x402 is pay-per-request. AI agents pay only for the calls they make, in USDC, with no minimum spend and no accounts. This makes your API instantly usable by any agent on the network.',
            },
          },
        ],
      },
      breadcrumb([{ name: 'Home', path: '/' }, { name: 'Pricing', path: '/pricing' }]),
    ],
  },

  // -----------------------------------------------------------------------
  {
    path: '/about',
    title: 'About PayAPI Market — built for the agent economy',
    description: 'PayAPI Market exists because the API economy was built for humans clicking through OAuth flows, and AI agents are fundamentally different customers. Founded April 2026 by Chet Parker.',
    canonical: '/about',
    body: `
<header role="banner"><a href="/"><strong>PayAPI Market</strong></a></header>
<main>
  <nav aria-label="Breadcrumb"><a href="/">Home</a> › About</nav>
  <h1>About PayAPI Market</h1>
  <p>PayAPI Market exists because the API economy was built for humans clicking through OAuth flows and pasting bearer tokens, and AI agents are fundamentally different customers. Agents are autonomous, they don't have credit cards, they discover tools at runtime, and their request volume is bursty in ways that break subscription pricing. The agent economy needs a marketplace that speaks the agent's protocols.</p>

  <h2>What we believe</h2>
  <ul>
    <li>Per-request stablecoin payments are the right primitive for autonomous workloads</li>
    <li>Discovery should happen at runtime via MCP, not at design-time via human-curated docs</li>
    <li>Marketplaces should take small percentages, not large rents — 3% beats RapidAPI's complex tier structure</li>
    <li>Open protocols (x402, MCP, USDC) beat closed platforms</li>
  </ul>

  <h2>Founder</h2>
  <p>PayAPI Market was built by <strong>Chet Parker</strong>. Launched April 2026.</p>

  <h2>How we got here</h2>
  <p>The x402 protocol was defined in 1999 as part of the original HTTP/1.0 spec — and then sat unused for 25 years because there was no good way to settle micropayments. Stablecoins on fast L2 chains changed the economics: USDC on Base settles in ~400ms with sub-cent fees. That made x402 viable. Then Anthropic published MCP in late 2024 as a standard way for LLMs to discover and call tools. The intersection of those two protocols is what made PayAPI Market possible: MCP for discovery, x402 for payment, USDC for settlement.</p>
</main>
`,
    schemas: [
      webPage({ path: '/about', name: 'About PayAPI Market', description: 'About the marketplace for x402-powered APIs built for AI agents.', type: 'AboutPage' }),
      {
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': `${SITE}/#chet-parker`,
        name: 'Chet Parker',
        jobTitle: 'Founder',
        worksFor: { '@id': `${SITE}/#organization` },
        knowsAbout: ['x402 protocol', 'Model Context Protocol', 'AI agent payments', 'API marketplaces'],
        url: `${SITE}/about`,
      },
      breadcrumb([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }]),
    ],
  },

  // -----------------------------------------------------------------------
  {
    path: '/calculator',
    title: 'Revenue Calculator — PayAPI Market',
    description: 'Estimate what your x402 API could earn on PayAPI Market. Model gross revenue, platform fees, and net payouts in USDC. Free vs Featured tier breakeven analysis.',
    canonical: '/calculator',
    body: `
<header role="banner"><a href="/"><strong>PayAPI Market</strong></a></header>
<main>
  <nav aria-label="Breadcrumb"><a href="/">Home</a> › Calculator</nav>
  <h1>Revenue Calculator</h1>
  <p>Estimate what your API could earn on PayAPI Market. Plug in number of endpoints, average price per request, and estimated monthly volume.</p>

  <h2>Inputs</h2>
  <ul>
    <li>Number of endpoints</li>
    <li>Average price per request (USDC)</li>
    <li>Estimated requests per month</li>
    <li>Tier: Free (3%) or Featured (2.5%)</li>
  </ul>

  <h2>Outputs</h2>
  <ul>
    <li>Gross monthly revenue</li>
    <li>Platform fee</li>
    <li>Net monthly revenue (your wallet)</li>
    <li>Annual run rate</li>
    <li>Breakeven analysis vs Featured tier</li>
  </ul>

  <h2>Worked examples</h2>
  <p><strong>Property data API</strong>: 24 endpoints, $0.002 average, 50,000 req/month. Gross $100/mo. Free tier nets $97/mo ($1,164/yr). Featured nets $48.50/mo after the $49 sub. <em>Stay on Free until ~4× this volume.</em></p>
  <p><strong>Crypto pricing API</strong>: 15 endpoints, $0.001 average, 500,000 req/month. Gross $500/mo. Free nets $485/mo ($5,820/yr). Featured nets $438.50/mo. <em>Free is still mathematically better; choose Featured for visibility, not the fee saving.</em></p>
  <p><strong>Geocoding at scale</strong>: 5,000,000 req/month at $0.0005. Gross $2,500/mo. Free nets $2,425/mo. Featured nets $2,388.50/mo. <em>Free wins on math; Featured wins on the gold badge if buyers care.</em></p>

  <p><a href="/list">List your API →</a> · <a href="/pricing">See pricing →</a></p>
</main>
`,
    schemas: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        '@id': `${SITE}/calculator#app`,
        name: 'PayAPI Market Revenue Calculator',
        url: `${SITE}/calculator`,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        description: 'Calculate net USDC revenue from listing an API on PayAPI Market.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        publisher: { '@id': `${SITE}/#organization` },
      },
      breadcrumb([{ name: 'Home', path: '/' }, { name: 'Calculator', path: '/calculator' }]),
    ],
  },

  // -----------------------------------------------------------------------
  {
    path: '/providers',
    title: 'For API Providers — monetise your API in 10 minutes · PayAPI Market',
    description: 'List your API on PayAPI Market in 10 minutes. No payment integration to build, no billing, no chargebacks. Per-request USDC payouts on Base. Keep 97% of revenue.',
    canonical: '/providers',
    body: `
<header role="banner"><a href="/"><strong>PayAPI Market</strong></a></header>
<main>
  <nav aria-label="Breadcrumb"><a href="/">Home</a> › For Providers</nav>
  <h1>For API Providers</h1>
  <p>Monetise your API for the agent economy in 10 minutes. No payment integration to build, no billing system to maintain, no chargebacks to dispute.</p>

  <h2>What you need</h2>
  <ol>
    <li>A working API with at least one endpoint</li>
    <li>An MCP server in front of it (we provide a wrapper template)</li>
    <li>A USDC wallet on Base</li>
    <li>A description of what your API does</li>
  </ol>

  <h2>What we handle</h2>
  <ul>
    <li>x402 payment verification (the MCP wrapper handles HTTP 402 responses)</li>
    <li>USDC settlement on-chain (every successful call splits 97/3 automatically)</li>
    <li>Discovery (your tools appear in the MCP manifest agents query)</li>
    <li>Search ranking (boosted by uptime, latency, and request volume)</li>
    <li>Health monitoring (we ping your endpoints every 60 seconds)</li>
  </ul>

  <h2>Listing flow</h2>
  <ol>
    <li>Sign up at <a href="/list">payapi.market/list</a></li>
    <li>Provide your name, email, wallet address, and API URL</li>
    <li>Choose Free or Featured tier (Featured triggers Stripe checkout for the $49/mo subscription)</li>
    <li>Submit for review (24 hours)</li>
    <li>Once approved, your API is live and discoverable by every agent on the network</li>
  </ol>

  <p><a href="/list">List your API →</a></p>
</main>
`,
    schemas: [
      webPage({ path: '/providers', name: 'For API Providers — PayAPI Market', description: 'How to list your API on PayAPI Market and earn USDC per request.' }),
      breadcrumb([{ name: 'Home', path: '/' }, { name: 'For Providers', path: '/providers' }]),
    ],
  },

  // -----------------------------------------------------------------------
  {
    path: '/agents',
    title: 'For AI Agents — discover and pay for APIs via MCP + x402 · PayAPI Market',
    description: 'Connect your AI agent to PayAPI Market via one MCP SSE endpoint. Discover dozens of paid APIs, pay per request in USDC, no API keys required.',
    canonical: '/agents',
    body: `
<header role="banner"><a href="/"><strong>PayAPI Market</strong></a></header>
<main>
  <nav aria-label="Breadcrumb"><a href="/">Home</a> › For Agents</nav>
  <h1>For AI Agents</h1>
  <p>PayAPI Market is the easiest way for an autonomous agent to find and pay for real-world data and tools. One MCP endpoint, dozens of APIs, USDC settlement on Base.</p>

  <h2>Connecting from Claude Desktop</h2>
  <p>Add this to your <code>claude_desktop_config.json</code>:</p>
  <pre><code>{
  "mcpServers": {
    "payapi": {
      "url": "https://web-production-18a32.up.railway.app/mcp/sse"
    }
  }
}</code></pre>
  <p>Restart Claude Desktop. You'll see every PayAPI Market tool in the tool list.</p>

  <h2>Connecting from Cursor / Continue / custom agents</h2>
  <p>Any MCP-compatible client works. Point it at the same SSE endpoint above.</p>

  <h2>Paying for calls</h2>
  <p>Your client needs to:</p>
  <ol>
    <li>Have a USDC wallet on Base with a small balance</li>
    <li>Handle HTTP 402 responses by signing and broadcasting the requested payment</li>
    <li>Retry the request with proof of payment</li>
  </ol>
  <p>The official x402 client libraries (TypeScript, Python, Rust) handle this automatically. Total per-call latency including payment is ~500-800ms.</p>

  <h2>Why this matters for agents</h2>
  <p>Subscription APIs are unusable for agents. You don't know in advance whether you'll need 5 calls or 50,000, you can't sign up for a $99/month plan when each user session might justify $0.02 of API spend, and you can't manage 50 different API keys across 50 different vendors. PayAPI Market collapses all of that into a single MCP endpoint and a USDC wallet.</p>
</main>
`,
    schemas: [
      webPage({ path: '/agents', name: 'For AI Agents — PayAPI Market', description: 'Connect AI agents to PayAPI Market via MCP and pay per request in USDC.' }),
      breadcrumb([{ name: 'Home', path: '/' }, { name: 'For Agents', path: '/agents' }]),
    ],
  },

  // -----------------------------------------------------------------------
  {
    path: '/developers',
    title: 'For Developers — build on x402 + MCP · PayAPI Market',
    description: 'Build agents and wrappers on top of PayAPI Market. x402 SDKs in TypeScript, Python, and Rust. Open MCP endpoint and listing API.',
    canonical: '/developers',
    body: `
<header role="banner"><a href="/"><strong>PayAPI Market</strong></a></header>
<main>
  <nav aria-label="Breadcrumb"><a href="/">Home</a> › For Developers</nav>
  <h1>For Developers</h1>
  <p>Build agents, build wrappers, contribute to the ecosystem.</p>

  <h2>Quick links</h2>
  <ul>
    <li>x402 protocol spec: <a href="https://github.com/coinbase/x402">github.com/coinbase/x402</a></li>
    <li>MCP spec: <a href="https://modelcontextprotocol.io">modelcontextprotocol.io</a></li>
    <li>PayAPI Market open listings endpoint: <code>/api/listings</code></li>
    <li>MCP SSE endpoint: <code>https://web-production-18a32.up.railway.app/mcp/sse</code></li>
  </ul>

  <h2>SDK availability</h2>
  <ul>
    <li><strong>TypeScript</strong>: <code>x402-fetch</code> on npm</li>
    <li><strong>Python</strong>: <code>x402-httpx</code> on pip</li>
    <li><strong>Rust</strong>: <code>x402-reqwest</code> on crates.io</li>
  </ul>

  <h2>How to wrap an existing API for x402</h2>
  <p>The PayAPI Market team maintains an open-source x402-MCP wrapper template. It's a small Express server that:</p>
  <ol>
    <li>Sits in front of your existing API</li>
    <li>Returns HTTP 402 with payment requirements on each request</li>
    <li>Verifies the payment proof (a transaction hash + signature)</li>
    <li>Forwards the request to your real API</li>
    <li>Returns the response</li>
  </ol>
  <p>You can deploy it to Railway, Fly, Vercel, or any Node host in under 10 minutes.</p>
</main>
`,
    schemas: [
      webPage({ path: '/developers', name: 'For Developers — PayAPI Market', description: 'Developer resources for building on x402 and MCP via PayAPI Market.' }),
      breadcrumb([{ name: 'Home', path: '/' }, { name: 'For Developers', path: '/developers' }]),
    ],
  },

  // -----------------------------------------------------------------------
  {
    path: '/enterprises',
    title: 'For Enterprises — distribute data products to AI agents · PayAPI Market',
    description: 'PayAPI Market is the distribution layer for enterprise data products that want to reach the agent ecosystem. Volume discounts, SLA-backed uptime, GDPR compatible.',
    canonical: '/enterprises',
    body: `
<header role="banner"><a href="/"><strong>PayAPI Market</strong></a></header>
<main>
  <nav aria-label="Breadcrumb"><a href="/">Home</a> › For Enterprises</nav>
  <h1>For Enterprises</h1>
  <p>PayAPI Market is the distribution layer for enterprise data products that want to reach the agent ecosystem without building their own marketplace.</p>

  <h2>Use cases</h2>
  <ul>
    <li><strong>Data vendors</strong> — bring your existing dataset (financial, geospatial, regulatory) to autonomous agents without building a separate billing stack</li>
    <li><strong>API monetisation</strong> — turn an internal API into external revenue with on-chain settlement (no AR, no invoicing, no collections)</li>
    <li><strong>Compliance APIs</strong> — sell verification and compliance lookups (KYC, sanctions, GDPR) priced per request</li>
    <li><strong>Real-time data</strong> — sell streaming or polling endpoints to agents that need live signals</li>
  </ul>

  <h2>Enterprise terms</h2>
  <ul>
    <li>Volume discounts on platform fees (negotiable above $50K/month gross)</li>
    <li>White-label MCP endpoints (your domain, your branding)</li>
    <li>SLA-backed uptime monitoring</li>
    <li>Dedicated support</li>
    <li>Custom contracts (most enterprises just use the standard Featured tier)</li>
  </ul>

  <h2>Compliance</h2>
  <ul>
    <li>USDC payments are non-custodial; PayAPI Market never holds your funds</li>
    <li>All transaction history is on-chain and auditable</li>
    <li>GDPR-compatible (no PII collected from agents — only wallet addresses)</li>
    <li>SOC 2 Type II in progress (target: Q3 2026)</li>
  </ul>

  <p>Contact: <a href="mailto:hello@payapi.market">hello@payapi.market</a></p>
</main>
`,
    schemas: [
      webPage({ path: '/enterprises', name: 'For Enterprises — PayAPI Market', description: 'Enterprise-grade API distribution for data vendors targeting the agent ecosystem.' }),
      breadcrumb([{ name: 'Home', path: '/' }, { name: 'For Enterprises', path: '/enterprises' }]),
    ],
  },

  // -----------------------------------------------------------------------
  {
    path: '/blog',
    title: 'Blog — PayAPI Market',
    description: 'Build-in-public posts, technical deep-dives, and the agent economy in 2026 from PayAPI Market.',
    canonical: '/blog',
    body: `
<header role="banner"><a href="/"><strong>PayAPI Market</strong></a></header>
<main>
  <nav aria-label="Breadcrumb"><a href="/">Home</a> › Blog</nav>
  <h1>Blog</h1>
  <p>Build-in-public posts and technical deep-dives from PayAPI Market.</p>
  <ul>
    <li><a href="/blog/what-is-the-x402-protocol">What is the x402 protocol?</a></li>
    <li><a href="/blog/x402-vs-api-keys-vs-oauth">x402 vs API keys vs OAuth</a></li>
    <li><a href="/blog/how-to-list-your-api-in-10-minutes">How to list your API in 10 minutes</a></li>
    <li><a href="/blog/ai-agent-economics-2026">AI agent economics in 2026</a></li>
    <li><a href="/blog/payapi-market-vs-rapidapi">PayAPI Market vs RapidAPI</a></li>
  </ul>
</main>
`,
    schemas: [
      {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        '@id': `${SITE}/blog#blog`,
        url: `${SITE}/blog`,
        name: 'PayAPI Market Blog',
        description: 'Build-in-public posts and technical deep-dives from PayAPI Market.',
        publisher: { '@id': `${SITE}/#organization` },
      },
      breadcrumb([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }]),
    ],
  },
];

// ---------------------------------------------------------------------------
// Render helpers — surgical text replacement on the Vite-built shell.
// ---------------------------------------------------------------------------
function escapeAttr(s) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function renderRoute(shell, route) {
  let html = shell;
  const absUrl = `${SITE}${route.canonical}`;

  // <title>
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${route.title}</title>`);

  // <meta name="description">
  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${escapeAttr(route.description)}" />`
  );

  // canonical
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${absUrl}" />`
  );

  // OG tags
  html = html.replace(
    /<meta property="og:title" content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${escapeAttr(route.title)}" />`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${escapeAttr(route.description)}" />`
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${absUrl}" />`
  );

  // Twitter card
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${escapeAttr(route.title)}" />`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${escapeAttr(route.description)}" />`
  );

  // Inject route-specific JSON-LD before </head>
  if (route.schemas?.length) {
    const blocks = route.schemas
      .map(s => `    <script type="application/ld+json">\n${JSON.stringify(s, null, 2).split('\n').map(l => '    ' + l).join('\n')}\n    </script>`)
      .join('\n');
    html = html.replace('</head>', `${blocks}\n  </head>`);
  }

  // Replace empty #root with the prerendered semantic content.
  // React's createRoot.render() replaces this on hydrate, so users with JS
  // never see the static body — only crawlers and pre-JS renders do.
  const rootContent = route.body.trim();
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${rootContent}</div>`
  );

  return html;
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------
console.log('› Reading dist/index.html shell…');
const shell = readFileSync(SHELL_PATH, 'utf-8');

let count = 0;
for (const route of ROUTES) {
  const html = renderRoute(shell, route);
  let outDir, outFile;
  if (route.path === '/') {
    // Overwrite the root index.html with the prerendered home page.
    outFile = SHELL_PATH;
  } else {
    outDir = resolve(DIST, route.path.replace(/^\//, ''));
    mkdirSync(outDir, { recursive: true });
    outFile = resolve(outDir, 'index.html');
  }
  writeFileSync(outFile, html, 'utf-8');
  console.log(`  ✓ ${route.path.padEnd(15)} → ${outFile.replace(ROOT + '/', '')}`);
  count++;
}

console.log(`\n✓ Prerendered ${count} routes.`);
