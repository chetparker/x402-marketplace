// Blog post registry. Markdown files are loaded as raw strings via Vite's ?raw query.
import what_is_x402 from './what-is-the-x402-protocol.md?raw';
import x402_vs_keys from './x402-vs-api-keys-vs-oauth.md?raw';
import list_in_10 from './how-to-list-your-api-in-10-minutes.md?raw';
import agent_econ from './ai-agent-economics-2026.md?raw';
import vs_rapidapi from './payapi-market-vs-rapidapi.md?raw';
import blockchain_payments from './how-ai-agents-pay-using-blockchain.md?raw';
import domain_experts from './why-domain-experts-will-replace-api-developers.md?raw';
import x402_to_ap2 from './x402-from-coinbase-to-google-ap2.md?raw';

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
    date: '2026-04-14',
    updated: '2026-04-14',
    author: 'Chet Parker',
    readMin: 8,
    body: x402_vs_keys,
  },
  {
    slug: 'how-to-list-your-api-in-10-minutes',
    title: 'How to List Your API on PayAPI Market in 10 Minutes',
    description: 'A step-by-step guide to wrapping your existing API in MCP, adding x402 payments, and listing it on PayAPI Market — start to finish in under 10 minutes.',
    date: '2026-04-21',
    updated: '2026-04-21',
    author: 'Chet Parker',
    readMin: 7,
    body: list_in_10,
  },
  {
    slug: 'ai-agent-economics-2026',
    title: 'AI Agent Economics 2026: How Autonomous Agents Pay for Services',
    description: 'A 2026 snapshot of how AI agents earn, hold and spend money — and why per-request micropayments are eating subscription pricing alive.',
    date: '2026-04-28',
    updated: '2026-04-28',
    author: 'Chet Parker',
    readMin: 9,
    body: agent_econ,
  },
  {
    slug: 'payapi-market-vs-rapidapi',
    title: 'PayAPI Market vs RapidAPI: Which API Marketplace is Right for You?',
    description: 'A direct comparison of PayAPI Market and RapidAPI for API providers in 2026 — pricing, fees, audience, and which one wins for the agent economy.',
    date: '2026-05-05',
    updated: '2026-05-05',
    author: 'Chet Parker',
    readMin: 7,
    body: vs_rapidapi,
  },
  {
    slug: 'how-ai-agents-pay-using-blockchain',
    title: 'How AI Agents Pay for Data Using Blockchain',
    description: 'Why USDC on Base became the default payment rail for AI agents — and how x402 turns every API into a pay-per-request vending machine.',
    date: '2026-05-12',
    updated: '2026-05-12',
    author: 'Chet Parker',
    readMin: 8,
    body: blockchain_payments,
  },
  {
    slug: 'why-domain-experts-will-replace-api-developers',
    title: 'Why Domain Experts Will Replace API Developers',
    description: 'The best APIs aren\'t built by developers — they\'re built by people who understand the data. Here\'s why domain expertise is the new moat.',
    date: '2026-05-19',
    updated: '2026-05-19',
    author: 'Chet Parker',
    readMin: 7,
    body: domain_experts,
  },
  {
    slug: 'x402-from-coinbase-to-google-ap2',
    title: 'The x402 Protocol: From Coinbase Experiment to Google AP2 Standard',
    description: 'How a Coinbase side project became the payment standard for the agent economy — and what Google\'s AP2 adoption means for API providers.',
    date: '2026-05-26',
    updated: '2026-05-26',
    author: 'Chet Parker',
    readMin: 10,
    body: x402_to_ap2,
  },
];

export const POST_BY_SLUG = Object.fromEntries(POSTS.map(p => [p.slug, p]));
