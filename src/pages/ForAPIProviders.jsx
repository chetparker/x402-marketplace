import AudienceTemplate from '../components/AudienceTemplate';

export default function ForAPIProviders() {
  return (
    <AudienceTemplate
      seo={{
        title: 'List Your API, Keep 97% — PayAPI Market for Providers',
        description: 'Monetise your API on the agent economy. Get paid per request in USDC, no API keys, no contracts. Free to list. Keep 97% of every dollar.',
        path: '/providers',
      }}
      eyebrow="For API Providers"
      headline="List Your API. Keep 97%."
      sub="Stop chasing customers. List your API on PayAPI Market and get paid per request — automatically — by every AI agent on the network."
      primaryCta={{ to: '/calculator', label: 'Estimate your revenue' }}
      bullets={[
        { value: '97%', label: 'Revenue you keep on the free plan' },
        { value: '10 min', label: 'From listing to first agent payment' },
        { value: '0 keys', label: 'No API keys, no auth headaches' },
        { value: 'USDC', label: 'Settled to your wallet on Base' },
      ]}
      sections={[
        {
          title: 'Why list on PayAPI Market',
          body: `AI agents are calling APIs millions of times a day. They don't want subscriptions, free tiers, or human-style billing — they want to discover an endpoint, pay for one call, and move on. PayAPI Market gives you the rails for that.\n\nList once. Get discovered by every Claude Desktop, Cursor, and custom agent connected to the marketplace. Get paid in USDC, settled on Base in under a second.`,
        },
        {
          title: 'How it works',
          body: 'Three steps. Total time: about 10 minutes if you already have an API.',
          list: [
            'Wrap your API in an MCP server (or use ours — we have a template)',
            'Add x402 payment middleware (one config block, ~20 lines)',
            'Submit your repo URL + wallet address to PayAPI Market',
          ],
        },
        {
          title: 'What you get',
          body: '',
          list: [
            'Free listing in the marketplace, indexed by every agent',
            'Auto-sync to the official MCP Registry, mcp.so, PulseMCP and Smithery',
            'Per-request USDC payouts directly to your wallet — no waiting for monthly settlements',
            'Live analytics: requests, revenue, top endpoints, latency, uptime',
            'Optional Featured tier ($49/mo) for gold-card placement and a reduced 2.5% fee',
          ],
        },
        {
          title: 'Pricing in plain English',
          body: 'Free to list. We take 3% of every successful payment — that\'s it. No monthly bill, no hidden fees, no minimum spend. If your API doesn\'t earn, you don\'t pay us anything. Featured tier is optional and pays for itself once you cross ~$10K/mo.',
        },
      ]}
      source="for-providers"
    />
  );
}
