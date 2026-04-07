import AudienceTemplate from '../components/AudienceTemplate';

export default function ForAIAgents() {
  return (
    <AudienceTemplate
      seo={{
        title: 'Your Agents Need Data. We Have It. — PayAPI Market for AI Agents',
        description: 'Connect your AI agent to PayAPI Market over MCP and instantly access dozens of paid APIs. No keys, no accounts — just pay per request in USDC via x402.',
        path: '/for/ai-agents',
      }}
      eyebrow="For AI Agents"
      headline="Your Agents Need Data. We Have It."
      sub="One MCP connection. Dozens of paid APIs. No accounts, no API keys, no rate limits — just per-request USDC payments via x402."
      primaryCta={{ to: '/', label: 'Browse the marketplace' }}
      bullets={[
        { value: '1 endpoint', label: 'Single MCP SSE URL — connect once' },
        { value: '100+ tools', label: 'Auto-discovered across every API' },
        { value: 'No keys', label: 'x402 payments replace API auth' },
        { value: '<1s', label: 'On-chain settlement on Base' },
      ]}
      sections={[
        {
          title: 'Why connect via PayAPI Market',
          body: `Most APIs were built for human developers. They require account creation, key management, monthly subscriptions and a credit card. None of that works for autonomous agents.\n\nPayAPI Market exposes every listed API through a single MCP endpoint. Your agent gets a unified tool catalog, calls any tool with an x402 payment, and never has to manage credentials. Settlement is on-chain and final in under a second.`,
        },
        {
          title: 'Add the marketplace to Claude Desktop',
          body: 'Drop this into your Claude Desktop config and restart. You now have access to every API on PayAPI Market.',
          list: [
            '"mcpServers": { "payapi": { "url": "https://payapi.market/mcp/sse" } }',
            'Restart Claude Desktop',
            'Ask: "What APIs are available?" — Claude will list every tool',
            'Fund a wallet with USDC on Base — payments happen automatically',
          ],
        },
        {
          title: 'What your agent can do',
          body: '',
          list: [
            'Query UK Land Registry for sold prices, instantly, $0.001 per call',
            'Get real-time crypto prices and DEX pool data, $0.001 per call',
            'Pull weather forecasts for any of 200K+ cities',
            'Check GDPR / PSD2 / MiCA compliance for a transaction',
            'Geocode addresses, generate isochrones, query demographics',
          ],
        },
        {
          title: 'How payments work',
          body: 'When your agent calls an x402 endpoint, the server returns HTTP 402 with a payment requirement. Your agent signs a USDC transfer for the exact request price, retries the call, and gets the data. You only pay for successful responses. No subscriptions. No minimums. No surprises.',
        },
      ]}
      source="for-agents"
    />
  );
}
