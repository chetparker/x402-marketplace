import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://payapi.market';
const SITE_NAME = 'PayAPI Market';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

// ---- Per-page configs ----
export const PAGE_SEO = {
  home: {
    title: "PayAPI Market | UK's API Marketplace for AI Agents — x402 Protocol",
    description: 'The UK marketplace for x402 APIs. 10 live APIs for AI agents. Property, companies, weather, vehicles, finance. $4K+ monthly revenue. Free to list, keep 97%. Alternative to RapidAPI and Coinbase Agentic Market for domain experts.',
    path: '/',
    keywords: 'UK property data API, Companies House API, postcode lookup API, pay per request API, x402 marketplace, AI agent API marketplace, MCP API directory, USDC API payments, micropayment API, x402 protocol, RapidAPI alternative',
  },
  about: {
    title: 'About PayAPI Market — Why We Built the x402 API Marketplace',
    description: 'PayAPI Market is the first marketplace designed for the agent economy. List your API, keep 97%, get discovered by every agent on the network.',
    path: '/about',
    keywords: 'about payapi market, payapi market, api monetization',
  },
  pricing: {
    title: 'Pricing — Free to List, 97% Revenue Share | PayAPI Market',
    description: 'Free listing with 3% platform fee. Featured plan at $49/mo with 2.5% fee. No subscriptions for buyers — agents pay per request in USDC.',
    path: '/pricing',
    keywords: 'api marketplace pricing, x402 fees, api monetization pricing',
  },
  calculator: {
    title: 'API Revenue Calculator — Estimate Your x402 Earnings | PayAPI Market',
    description: 'Calculate how much you can earn listing your API on PayAPI Market. Adjust endpoints, call volume and price per request to see your monthly and annual revenue.',
    path: '/calculator',
    keywords: 'api revenue calculator, x402 earnings, api monetization calculator',
  },
  docs: {
    title: 'Docs — How to List and Consume x402 APIs | PayAPI Market',
    description: 'Technical documentation for listing APIs, connecting AI agents via MCP, and accepting per-request USDC payments with the x402 protocol.',
    path: '/docs',
    keywords: 'x402 docs, mcp docs, api marketplace documentation',
  },
  blog: {
    title: 'Blog — AI Agents, x402 and API Monetization | PayAPI Market',
    description: 'Guides, tutorials and analysis on the x402 protocol, the agent economy and API monetization strategy.',
    path: '/blog',
    keywords: 'x402 blog, ai agent economy, api monetization blog',
  },
};

// ---- FAQ schema (6 canonical questions) ----
const FAQ_QUESTIONS = [
  {
    q: 'What is PayAPI Market?',
    a: 'PayAPI Market is a marketplace for paid APIs designed for AI agents. Providers list APIs once; agents discover and pay per request in USDC over the x402 protocol. There are no API keys, no contracts, and no monthly subscriptions — just per-call payments. Providers keep 97% of revenue on the free plan and 97.5% on the $49/mo Featured plan.'
  },
  {
    q: 'What is the x402 protocol?',
    a: 'x402 is an open payment protocol that revives HTTP 402 Payment Required. When an AI agent calls an x402-enabled endpoint, the server responds with a signed payment requirement; the agent signs a USDC transfer and retries. Settlement happens on-chain (Base by default) in under a second, with no accounts, API keys or OAuth flows.'
  },
  {
    q: 'How much does PayAPI Market cost?',
    a: 'Listing is free. The platform takes a 3% fee per transaction on free listings — providers keep 97%. Featured listings are $49 per month and pay a reduced 2.5% fee. There are no buyer-side subscriptions: AI agents pay only for the requests they actually make.'
  },
  {
    q: 'How do AI agents discover APIs on PayAPI Market?',
    a: 'Every listed API is exposed through an MCP (Model Context Protocol) server. Agents connect once to the PayAPI Market MCP endpoint, automatically get tool manifests for every listed API, and can call any endpoint with a signed x402 payment. Claude Desktop, Cursor and other MCP-compatible clients can add the marketplace as a single config entry.'
  },
  {
    q: 'What APIs are available on PayAPI Market?',
    a: 'PayAPI Market launched with 10 APIs and 65 endpoints across property, weather, companies, vehicles, and finance: UK Data API (24 endpoints — Land Registry, EPC, Companies House, DVLA, BoE rates, weather, crime, flood risk), Email Verification, Company Enrichment, Postcode & Address Lookup, Currency & Crypto, Screenshot & PDF Capture, DNS & Domain Intelligence, Web Scraper & Content Extractor, IP Geolocation, and QR Code. Every listed API is live, verified and billed per request in USDC.'
  },
  {
    q: 'How is PayAPI Market different from RapidAPI?',
    a: 'RapidAPI uses API keys and monthly subscription tiers designed for human developers. PayAPI Market uses x402 per-request USDC payments designed for AI agents — no accounts, no keys, no minimum spend. Providers keep 97% instead of RapidAPI\'s standard 80%, and agents can discover and call any API through a single MCP connection.'
  },
];

// ---- JSON-LD @graph ----
function buildGraph({ url, title, description, type = 'WebPage' }) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${SITE_URL}/#webapp`,
        name: SITE_NAME,
        url: SITE_URL,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Any',
        description: 'Marketplace for x402-powered APIs. AI agents pay per request in USDC, no API keys required.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          description: 'Free listing, 3% platform fee, 97% revenue kept by provider',
        },
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#org`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/favicon.svg`,
        founder: { '@type': 'Person', name: 'Chet Parker' },
        sameAs: [],
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE_URL}/#faq`,
        mainEntity: FAQ_QUESTIONS.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      },
      {
        '@type': type,
        '@id': url + '#page',
        url,
        name: title,
        description,
        isPartOf: { '@id': `${SITE_URL}/#webapp` },
      },
    ],
  };
}

export default function SEOHead({
  page,
  title: titleOverride,
  description: descriptionOverride,
  path: pathOverride,
  image = DEFAULT_IMAGE,
  type = 'WebPage',
  jsonLd: extraJsonLd,
  noindex = false,
}) {
  const cfg = (page && PAGE_SEO[page]) || {};
  const title = titleOverride || cfg.title || 'PayAPI Market';
  const description = descriptionOverride || cfg.description || '';
  const path = pathOverride || cfg.path || '/';
  const url = `${SITE_URL}${path}`;
  const keywords = cfg.keywords;

  const graph = buildGraph({ url, title, description, type });

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type === 'Article' ? 'article' : 'website'} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD @graph */}
      <script type="application/ld+json">{JSON.stringify(graph)}</script>
      {extraJsonLd && (
        <script type="application/ld+json">{JSON.stringify(extraJsonLd)}</script>
      )}
    </Helmet>
  );
}
