import PageShell from '../components/PageShell';
import SEOHead from '../components/SEOHead';
import EmailCapture from '../components/EmailCapture';
import { Link } from 'react-router-dom';
import { C, F, M } from '../theme';

const H1 = (p) => <h1 style={{ margin: '0 0 12px', fontSize: 40, fontWeight: 800, color: C.t, fontFamily: F, lineHeight: 1.1 }} {...p} />;
const H2 = (p) => <h2 style={{ margin: '40px 0 12px', fontSize: 26, fontWeight: 800, color: C.t, fontFamily: F }} {...p} />;
const H3 = (p) => <h3 style={{ margin: '24px 0 8px', fontSize: 18, fontWeight: 700, color: C.ac, fontFamily: F }} {...p} />;
const P = (p) => <p style={{ margin: '0 0 14px', fontSize: 15, color: C.tM, lineHeight: 1.7 }} {...p} />;

export default function AboutPage() {
  return (
    <PageShell>
      <SEOHead page="about" />
      <article style={{ maxWidth: 760, margin: '0 auto', padding: '60px 32px' }}>
        <div style={{ fontSize: 12, color: C.ac, fontFamily: M, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>About</div>
        <H1>The marketplace for the agent economy</H1>
        <P style={{ fontSize: 17, color: C.t }}>
          PayAPI Market is a marketplace for paid APIs designed for AI agents. Providers list once;
          agents discover and pay per request in USDC over the x402 protocol — no API keys, no contracts,
          no monthly subscriptions. Providers keep 97% of every dollar.
        </P>

        <H2>The problem</H2>
        <P>
          The API economy was built for human developers. Sign up. Get an API key. Pick a tier. Pay $49/month
          whether you use it or not. None of that works for AI agents — they don't have credit cards, they don't
          want subscriptions, and they need to discover APIs they've never seen before, on the fly.
        </P>
        <P>
          Existing marketplaces like RapidAPI take 20% and lock providers into key-based auth. Stripe metered
          billing is great if you already have a customer relationship. Neither solves discovery + payment for
          autonomous agents calling APIs they've never used before.
        </P>

        <H2>The solution</H2>
        <P>
          PayAPI Market combines three things: <strong style={{ color: C.t }}>x402</strong> for per-request
          USDC payments, <strong style={{ color: C.t }}>MCP</strong> for agent-friendly tool discovery, and a
          curated marketplace that gets your API in front of every agent on the network.
        </P>
        <P>
          List your API once. Every Claude Desktop, Cursor, or custom agent that connects to PayAPI Market
          can call your endpoints — and pay you in USDC, settled on Base in under a second.
        </P>

        <H2>For API providers</H2>
        <P>
          You already built the API. We give you the payment rails (x402), the discovery surface (MCP),
          and the marketplace (millions of agents looking for tools). Free to list. 3% platform fee.
          You keep 97% of every payment, settled directly to your wallet.
        </P>
        <P>
          <Link to="/for/api-providers" style={{ color: C.ac }}>How to list your API →</Link>
        </P>

        <H2>For AI agents</H2>
        <P>
          Connect once to <code style={{ background: C.sf, padding: '2px 6px', borderRadius: 4, color: C.ac, fontFamily: M, fontSize: 13 }}>
            payapi.market/mcp/sse
          </code>{' '}
          and you have access to every API on the marketplace. Tool manifests are auto-generated. Payments
          happen invisibly via x402. No API keys to manage. No accounts to create.
        </P>
        <P>
          <Link to="/for/ai-agents" style={{ color: C.ac }}>How agents use PayAPI Market →</Link>
        </P>

        <H2>Current APIs</H2>
        <P>
          Launch APIs cover the most useful data sources for the UK and global markets:
        </P>
        <ul style={{ color: C.tM, fontSize: 15, lineHeight: 1.8, paddingLeft: 22 }}>
          <li><strong style={{ color: C.t }}>UK Data API</strong> — 24 endpoints: Land Registry, EPC, Companies House, DVLA, Bank of England, weather, crime, flood risk</li>
          <li><strong style={{ color: C.t }}>Crypto Oracle</strong> — 15 endpoints for prices, DEX pools, whale tracking</li>
          <li><strong style={{ color: C.t }}>Global Weather</strong> — 8 endpoints across 200K+ cities</li>
          <li><strong style={{ color: C.t }}>EU Compliance Check</strong> — 10 endpoints for GDPR, PSD2, MiCA</li>
          <li><strong style={{ color: C.t }}>Geospatial Intel</strong> — 12 endpoints for geocoding, isochrones, demographics</li>
        </ul>

        <H2>Built by a non-developer</H2>
        <P>
          PayAPI Market was built by Chet Parker — not a software engineer, but someone who sees what's
          coming. The agent economy is happening whether the existing API marketplaces want to adapt or not.
          PayAPI Market is what the rails should look like: open, low-fee, agent-native.
        </P>
        <P>
          If you've built an MCP server or run an API and want to monetise it for AI agents — this is the
          fastest way to start.
        </P>

        <EmailCapture source="about" />
      </article>
    </PageShell>
  );
}
