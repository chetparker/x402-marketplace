// Blog post registry. Markdown files are loaded as raw strings via Vite's ?raw query.
import what_is_x402 from './what-is-the-x402-protocol.md?raw';
import x402_vs_keys from './x402-vs-api-keys-vs-oauth.md?raw';
import list_in_10 from './how-to-list-your-api-in-10-minutes.md?raw';
import agent_econ from './ai-agent-economics-2026.md?raw';
import vs_rapidapi from './payapi-market-vs-rapidapi.md?raw';
import blockchain_payments from './how-ai-agents-pay-using-blockchain.md?raw';
import domain_experts from './why-domain-experts-will-replace-api-developers.md?raw';
import x402_linux from './x402-from-coinbase-to-linux-foundation.md?raw';

export const POSTS = [
  {
    slug: 'what-is-the-x402-protocol',
    title: 'What is the x402 Protocol?',
    description: 'x402 lets AI agents pay APIs per request in USDC. No API keys, no accounts, no subscriptions. Just HTTP with a payment step.',
    date: '2026-03-10',
    updated: '2026-03-10',
    author: 'Chet Parker',
    readMin: 6,
    body: what_is_x402,
  },
  {
    slug: 'x402-vs-api-keys-vs-oauth',
    title: 'x402 vs API Keys vs OAuth',
    description: 'Three ways to authenticate API calls. Only one was built for AI agents. Here is how they compare.',
    date: '2026-03-17',
    updated: '2026-03-17',
    author: 'Chet Parker',
    readMin: 8,
    body: x402_vs_keys,
  },
  {
    slug: 'how-to-list-your-api-in-10-minutes',
    title: 'How to List Your API on PayAPI Market in 10 Minutes',
    description: 'Clone a template, set your prices, deploy, and submit. Your API is live and earning from AI agents in under 10 minutes.',
    date: '2026-03-24',
    updated: '2026-03-24',
    author: 'Chet Parker',
    readMin: 7,
    body: list_in_10,
  },
  {
    slug: 'ai-agent-economics-2026',
    title: 'AI Agent Economics 2026',
    description: 'AI agents hold USDC wallets, make millions of API calls per task, and pay fractions of a cent per request. Here is how the money moves.',
    date: '2026-03-31',
    updated: '2026-03-31',
    author: 'Chet Parker',
    readMin: 9,
    body: agent_econ,
  },
  {
    slug: 'payapi-market-vs-rapidapi',
    title: 'PayAPI Market vs RapidAPI',
    description: 'RapidAPI takes 20% and needs API keys. PayAPI Market takes 3% and works with AI agents natively. Here is the full comparison.',
    date: '2026-04-07',
    updated: '2026-04-07',
    author: 'Chet Parker',
    readMin: 7,
    body: vs_rapidapi,
  },
  {
    slug: 'how-ai-agents-pay-using-blockchain',
    title: 'How AI Agents Pay for Data Using Blockchain',
    description: 'An AI agent calls an API, gets a 402 response, pays $0.001 in USDC, and gets the data. The whole thing takes 400 milliseconds.',
    date: '2026-04-14',
    updated: '2026-04-14',
    author: 'Chet Parker',
    readMin: 8,
    body: blockchain_payments,
  },
  {
    slug: 'why-domain-experts-will-replace-api-developers',
    title: 'Why Domain Experts Will Replace API Developers',
    description: 'I am not a developer. I built 10 APIs earning $2K a month. AI writes the code now. Domain knowledge is what matters.',
    date: '2026-04-21',
    updated: '2026-04-21',
    author: 'Chet Parker',
    readMin: 7,
    body: domain_experts,
  },
  {
    slug: 'x402-from-coinbase-to-linux-foundation',
    title: 'The x402 Protocol: From Coinbase Experiment to Linux Foundation Standard',
    description: 'How a side project at Coinbase became the payment standard for AI agents, with Cloudflare, Google, and the Linux Foundation all on board.',
    date: '2026-04-28',
    updated: '2026-04-28',
    author: 'Chet Parker',
    readMin: 10,
    body: x402_linux,
  },
];

// Only expose posts with date <= today
const today = new Date().toISOString().slice(0, 10);
export const PUBLISHED_POSTS = POSTS.filter(p => p.date <= today);

export const POST_BY_SLUG = Object.fromEntries(POSTS.map(p => [p.slug, p]));
