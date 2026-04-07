import AudienceTemplate from '../components/AudienceTemplate';

export default function ForDevelopers() {
  return (
    <AudienceTemplate
      seo={{
        title: 'Turn Your Expertise Into Passive Revenue — PayAPI Market for Developers',
        description: 'You\'ve built APIs your whole career. Now wrap them once, list them on PayAPI Market, and earn USDC every time an AI agent calls them.',
        path: '/for/developers',
      }}
      eyebrow="For Developers"
      headline="Turn Your Expertise Into Passive Revenue."
      sub="You already know how to ship APIs. Wrap one in MCP + x402 and you have a passive income stream that earns every time an agent calls it."
      primaryCta={{ to: '/calculator', label: 'See what your stack could earn' }}
      bullets={[
        { value: '1 weekend', label: 'To wrap an existing API in MCP' },
        { value: '~20 LOC', label: 'To add x402 payment middleware' },
        { value: '$0', label: 'To list. No upfront cost ever.' },
        { value: '∞', label: 'Income, not your time' },
      ]}
      sections={[
        {
          title: 'Why this matters now',
          body: `For 20 years the only way to monetize your domain expertise was: build a SaaS, get customers, support customers. The agent economy collapses that loop. You wrap your knowledge in an API, list it once, and every AI agent on the network is a potential customer — without you ever talking to them.\n\nPayAPI Market is the distribution layer. We handle discovery (MCP), payments (x402), and analytics. You handle what you're good at: shipping the API.`,
        },
        {
          title: 'Things that work well as paid APIs',
          body: '',
          list: [
            'Domain data you have unique access to (industry datasets, scraped sources you maintain, proprietary formulas)',
            'Calculations that are tedious to implement but trivial to call (tax math, mortgage models, unit conversions)',
            'Wrappers around legacy systems with bad APIs (government data, old SOAP services, scraped sites)',
            'AI inference you\'ve fine-tuned for a specific task',
            'Compliance / validation checks that companies need but don\'t want to build',
          ],
        },
        {
          title: 'The build process',
          body: '',
          list: [
            'Pick an idea — anything you already know well',
            'Build the API (Node, Python, Go — anything that speaks HTTP)',
            'Wrap it in an MCP server using our template',
            'Add x402 payment middleware — one decorator per route',
            'Deploy to Railway / Vercel / Fly / wherever',
            'Submit the URL to PayAPI Market',
            'Start earning USDC',
          ],
        },
        {
          title: 'Realistic numbers',
          body: 'A small API with 20 endpoints, modest traffic (500 calls/day per endpoint, $0.005 each) earns ~$1,500/mo gross — $1,455/mo net. Build five of those over a year and you\'re at six figures of mostly passive USDC. The calculator on this site lets you plug in your own numbers.',
        },
      ]}
      source="for-developers"
    />
  );
}
