import { useState } from 'react';
import PageShell from '../components/PageShell';
import SEOHead from '../components/SEOHead';
import EmailCapture from '../components/EmailCapture';
import { Link } from 'react-router-dom';
import { C, F, M } from '../theme';

const FAQ = [
  {
    q: 'Is listing really free?',
    a: 'Yes. You can list any API on PayAPI Market at no cost. We only take a 3% fee on successful payments — if your API doesn\'t earn, you don\'t pay us anything.'
  },
  {
    q: 'How does the 3% fee work?',
    a: 'When an AI agent pays your API via x402, the payment is split on-chain: 97% to your wallet, 3% to the PayAPI Market treasury. No invoicing, no monthly bill, no surprise fees.'
  },
  {
    q: 'What do I get with Featured ($49/mo)?',
    a: 'A reduced 2.5% platform fee, a gold badge on your card, always-first placement in search and category filters, and priority inclusion in the MCP tool manifest surfaced to agents. Breakeven vs Free is around $10K/mo in gross revenue.'
  },
  {
    q: 'Do I need a crypto wallet to get paid?',
    a: 'Yes. Payments settle as USDC on Base. You provide a wallet address at listing time. Off-ramp to USD is available through any USDC-supported exchange or bank on-ramp like Coinbase.'
  },
  {
    q: 'Can I change pricing per endpoint?',
    a: 'Yes. Every endpoint can have its own x402 price — from $0.0001 to any amount. Price per request is set in your MCP server configuration; the marketplace reads and displays it automatically.'
  },
  {
    q: 'Do buyers pay monthly subscriptions?',
    a: 'No. The whole point of x402 is pay-per-request. AI agents pay only for the calls they make, in USDC, with no minimum spend and no accounts. This makes your API instantly usable by any agent on the network.'
  },
];

function TierCard({ tier }) {
  const pop = tier.popular;
  return (
    <div style={{
      background: C.sf,
      border: `${pop ? '1.5px' : '1px'} solid ${pop ? C.goldM : C.bd}`,
      borderRadius: 14,
      padding: '32px 32px',
      position: 'relative',
      boxShadow: pop ? '0 4px 20px rgba(245,200,66,0.1)' : 'none',
    }}>
      {pop && (
        <div style={{ position: 'absolute', top: -1, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${C.gold},transparent)`, borderRadius: '14px 14px 0 0' }} />
      )}
      {pop && (
        <div style={{ marginBottom: 10 }}>
          <span style={{ display: 'inline-block', padding: '4px 10px', background: C.goldD, color: C.gold, borderRadius: 100, fontSize: 11, fontFamily: M, fontWeight: 600 }}>most popular</span>
        </div>
      )}
      <div style={{ fontSize: 18, fontWeight: 800, color: tier.color, marginBottom: 8 }}>{tier.name}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 10 }}>
        <span style={{ fontSize: 40, fontWeight: 800, color: C.t, fontFamily: M }}>{tier.price}</span>
        <span style={{ fontSize: 14, color: C.tD }}>{tier.period}</span>
      </div>
      <div style={{ fontSize: 13, color: C.am, fontFamily: M, marginBottom: 18 }}>{tier.fee} platform fee</div>
      <div style={{ fontSize: 13, color: C.gn, fontFamily: M, marginBottom: 18 }}>{tier.kept} you keep</div>
      <div style={{ borderTop: `1px solid ${C.bd}`, paddingTop: 18 }}>
        {tier.features.map(f => (
          <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '6px 0' }}>
            <span style={{ color: tier.color, fontSize: 14 }}>✓</span>
            <span style={{ fontSize: 14, color: C.tM, lineHeight: 1.5 }}>{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PricingPage() {
  const [open, setOpen] = useState(0);

  const tiers = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      fee: '3%',
      kept: '97%',
      color: C.ac,
      features: [
        'Unlimited API listings',
        'MCP Registry auto-sync',
        'Searchable by every agent',
        'Per-request USDC payouts',
        '3% platform fee only on successful calls',
        'No monthly bill, ever',
      ],
    },
    {
      name: 'Featured',
      price: '$49',
      period: '/month',
      fee: '2.5%',
      kept: '97.5%',
      color: C.gold,
      popular: true,
      features: [
        'Everything in Free',
        '★ Gold badge + highlighted card',
        'Always first in search results',
        'Priority in every category filter',
        'Reduced 2.5% platform fee',
        'Featured in agent tool manifests',
        'Priority support',
      ],
    },
  ];

  return (
    <PageShell>
      <SEOHead page="pricing" />
      <div style={{ padding: '60px 32px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto 48px', textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: C.ac, fontFamily: M, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Pricing</div>
          <h1 style={{ margin: '0 0 14px', fontSize: 44, fontWeight: 800, color: C.t, fontFamily: F, lineHeight: 1.1 }}>
            Free to list. You keep 97%.
          </h1>
          <p style={{ margin: 0, fontSize: 17, color: C.tM, lineHeight: 1.55 }}>
            No subscriptions for buyers. No monthly fees for most sellers. You get paid per request in USDC.
          </p>
        </div>

        <div style={{
          maxWidth: 840,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 20,
        }}>
          {tiers.map(t => <TierCard key={t.name} tier={t} />)}
        </div>

        <div style={{ maxWidth: 760, margin: '48px auto 0', textAlign: 'center' }}>
          <Link to="/calculator" style={{
            display: 'inline-block',
            padding: '14px 28px',
            borderRadius: 10,
            background: C.ac,
            color: C.bg,
            fontSize: 15,
            fontWeight: 700,
            textDecoration: 'none',
            fontFamily: F,
          }}>
            Calculate your revenue →
          </Link>
        </div>

        <div style={{ maxWidth: 760, margin: '72px auto 0' }}>
          <h2 style={{ margin: '0 0 20px', fontSize: 28, fontWeight: 800, color: C.t, fontFamily: F, textAlign: 'center' }}>
            Frequently asked questions
          </h2>
          {FAQ.map((item, i) => (
            <div key={i} style={{
              background: C.sf,
              border: `1px solid ${C.bd}`,
              borderRadius: 12,
              marginBottom: 10,
              overflow: 'hidden',
            }}>
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  padding: '18px 22px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: C.t,
                  fontSize: 15,
                  fontWeight: 700,
                  fontFamily: F,
                }}
              >
                {item.q}
                <span style={{ color: C.ac, fontSize: 18, transform: open === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.15s' }}>+</span>
              </button>
              {open === i && (
                <div style={{ padding: '0 22px 20px', fontSize: 14, color: C.tM, lineHeight: 1.65 }}>{item.a}</div>
              )}
            </div>
          ))}
        </div>

        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <EmailCapture source="pricing" />
        </div>
      </div>
    </PageShell>
  );
}
