// Blog post registry. Markdown files are loaded as raw strings via Vite's ?raw query.
import what_is_x402 from './what-is-the-x402-protocol.md?raw';
import x402_vs_keys from './x402-vs-api-keys-vs-oauth.md?raw';
import list_in_10 from './how-to-list-your-api-in-10-minutes.md?raw';
import agent_econ from './ai-agent-economics-2026.md?raw';
import vs_rapidapi from './payapi-market-vs-rapidapi.md?raw';

export const POSTS = [
  {
    slug: 'what-is-the-x402-protocol',
    title: 'What is the x402 Protocol?',
    description: 'A plain-English definition of x402 — the open payment protocol that lets AI agents pay APIs per request in USDC, without API keys or accounts.',
    date: '2026-04-07',
    updated: '2026-04-07',
    author: 'Chet Parker',
    readMin: 6,
    body: what_is_x402,
  },
  {
    slug: 'x402-vs-api-keys-vs-oauth',
    title: 'x402 vs API Keys vs OAuth: A Comparison for the Agent Economy',
    description: 'How x402 stacks up against API keys and OAuth for authenticating and billing AI agents — with a side-by-side comparison table.',
    date: '2026-04-07',
    updated: '2026-04-07',
    author: 'Chet Parker',
    readMin: 8,
    body: x402_vs_keys,
  },
  {
    slug: 'how-to-list-your-api-in-10-minutes',
    title: 'How to List Your API on PayAPI Market in 10 Minutes',
    description: 'A step-by-step guide to wrapping your existing API in MCP, adding x402 payments, and listing it on PayAPI Market — start to finish in under 10 minutes.',
    date: '2026-04-07',
    updated: '2026-04-07',
    author: 'Chet Parker',
    readMin: 7,
    body: list_in_10,
  },
  {
    slug: 'ai-agent-economics-2026',
    title: 'AI Agent Economics 2026: How Autonomous Agents Pay for Services',
    description: 'A 2026 snapshot of how AI agents earn, hold and spend money — and why per-request micropayments are eating subscription pricing alive.',
    date: '2026-04-07',
    updated: '2026-04-07',
    author: 'Chet Parker',
    readMin: 9,
    body: agent_econ,
  },
  {
    slug: 'payapi-market-vs-rapidapi',
    title: 'PayAPI Market vs RapidAPI: Which API Marketplace is Right for You?',
    description: 'A direct comparison of PayAPI Market and RapidAPI for API providers in 2026 — pricing, fees, audience, and which one wins for the agent economy.',
    date: '2026-04-07',
    updated: '2026-04-07',
    author: 'Chet Parker',
    readMin: 7,
    body: vs_rapidapi,
  },
];

export const POST_BY_SLUG = Object.fromEntries(POSTS.map(p => [p.slug, p]));
