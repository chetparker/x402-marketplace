import { Link } from 'react-router-dom';
import PageShell from '../components/PageShell';
import SEOHead from '../components/SEOHead';
import EmailCapture from '../components/EmailCapture';
import { C, F, M } from '../theme';

const APIS = [
  { name: 'UK Data API', tools: 24, price: '$0.001–0.002' },
  { name: 'Email Verification API', tools: 4, price: '$0.001' },
  { name: 'Company Enrichment API', tools: 6, price: '$0.003–0.005' },
  { name: 'Postcode & Address Lookup', tools: 5, price: '$0.001' },
  { name: 'Currency & Crypto API', tools: 5, price: '$0.001' },
  { name: 'Screenshot & PDF Capture', tools: 4, price: '$0.002' },
  { name: 'DNS & Domain Intelligence', tools: 5, price: '$0.002' },
  { name: 'Web Scraper & Content Extractor', tools: 4, price: '$0.002' },
  { name: 'IP Geolocation API', tools: 4, price: '$0.001' },
  { name: 'QR Code API', tools: 4, price: '$0.001' },
];

const COMPARISON = [
  { provider: 'ZoomInfo', cost: '£15,000/yr', perReq: '£1.25/request at 12K requests', contract: 'Yes, annual' },
  { provider: 'Clearbit', cost: '£12,000/yr', perReq: '£1.00/request at 12K requests', contract: 'Yes, annual' },
  { provider: 'PayAPI Market', cost: 'Pay-per-request', perReq: '£0.001–£0.01/request', contract: 'No' },
];

const thStyle = {
  padding: '12px 16px',
  textAlign: 'left',
  fontSize: 12,
  color: C.tD,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  fontWeight: 600,
  borderBottom: `1px solid ${C.bd}`,
};

const tdStyle = {
  padding: '12px 16px',
  fontSize: 14,
  color: C.tM,
  borderBottom: `1px solid ${C.bd}`,
};

export default function ForEnterprise() {
  return (
    <PageShell>
      <SEOHead
        title="Replace £15K/Year Data Subscriptions — PayAPI Market for Enterprise"
        description="Your AI agents get the same data for fractions of a penny. No contracts. No procurement. No sales calls. 10 APIs, 65 tools, pay-per-request in USDC."
        path="/enterprises"
      />
      <div style={{ padding: '60px 32px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ fontSize: 12, color: C.ac, fontFamily: M, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>
            For Enterprise
          </div>
          <h1 style={{ margin: '0 0 18px', fontSize: 46, fontWeight: 800, color: C.t, fontFamily: F, lineHeight: 1.08 }}>
            Replace £15K/Year Data Subscriptions
          </h1>
          <p style={{ margin: '0 0 28px', fontSize: 18, color: C.tM, lineHeight: 1.55 }}>
            Your AI agents get the same data for fractions of a penny. No contracts. No procurement. No sales calls.
          </p>

          <div style={{ display: 'flex', gap: 12, marginBottom: 48, flexWrap: 'wrap' }}>
            <Link to="/calculator" style={{
              padding: '14px 28px', borderRadius: 10, background: '#1D4ED8',
              color: '#FFFFFF', fontSize: 15, fontWeight: 500, textDecoration: 'none', fontFamily: F,
            }}>Calculate your savings →</Link>
            <Link to="/pricing" style={{
              padding: '14px 28px', borderRadius: 10, background: 'transparent',
              border: `1px solid ${C.bd}`, color: C.tM, fontSize: 15, fontWeight: 500,
              textDecoration: 'none', fontFamily: F,
            }}>See pricing</Link>
          </div>

          {/* Comparison table */}
          <h2 style={{ margin: '0 0 16px', fontSize: 26, fontWeight: 800, color: C.t, fontFamily: F }}>
            The cost comparison
          </h2>
          <div style={{ overflowX: 'auto', marginBottom: 48 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: C.sf, border: `1px solid ${C.bd}`, borderRadius: 10 }}>
              <thead>
                <tr>
                  <th style={thStyle}>Provider</th>
                  <th style={thStyle}>Annual Cost</th>
                  <th style={thStyle}>Per-Request Equivalent</th>
                  <th style={thStyle}>Contract Required</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={i}>
                    <td style={{ ...tdStyle, color: row.provider === 'PayAPI Market' ? C.t : C.tM, fontWeight: row.provider === 'PayAPI Market' ? 700 : 400 }}>
                      {row.provider}
                    </td>
                    <td style={{ ...tdStyle, color: row.provider === 'PayAPI Market' ? '#3B82F6' : C.tM }}>
                      {row.cost}
                    </td>
                    <td style={{ ...tdStyle, color: row.provider === 'PayAPI Market' ? '#3B82F6' : C.tM }}>
                      {row.perReq}
                    </td>
                    <td style={{ ...tdStyle, color: row.contract === 'No' ? '#10B981' : C.tM }}>
                      {row.contract}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 10 APIs */}
          <h2 style={{ margin: '0 0 16px', fontSize: 26, fontWeight: 800, color: C.t, fontFamily: F }}>
            10 APIs Available Now
          </h2>
          <div style={{ background: C.sf, border: `1px solid ${C.bd}`, borderRadius: 14, padding: '8px 0', marginBottom: 48 }}>
            {APIS.map((api, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 24px',
                borderBottom: i < APIS.length - 1 ? `1px solid ${C.bd}` : 'none',
              }}>
                <div>
                  <span style={{ fontSize: 14, color: C.t, fontWeight: 500 }}>{api.name}</span>
                  <span style={{ fontSize: 12, color: C.tD, marginLeft: 10 }}>{api.tools} tools</span>
                </div>
                <span style={{ fontSize: 13, color: C.tM, fontFamily: F }}>{api.price}/req</span>
              </div>
            ))}
          </div>

          {/* How it works */}
          <h2 style={{ margin: '0 0 12px', fontSize: 26, fontWeight: 800, color: C.t, fontFamily: F }}>
            How it works for your team
          </h2>
          {[
            'Point your AI agent (Claude, Cursor, custom) at our MCP endpoint. One config line.',
            'The agent discovers all 65 tools automatically. No integration per API.',
            'Each call costs fractions of a cent in USDC. No invoices, no procurement, no vendor onboarding.',
            'Scale from 10 requests to 10 million. Same price per call. No tier negotiations.',
          ].map((text, i) => (
            <p key={i} style={{ margin: '0 0 14px', fontSize: 15, color: C.tM, lineHeight: 1.7 }}>
              <span style={{ color: C.t, fontWeight: 600 }}>{i + 1}.</span> {text}
            </p>
          ))}

          <div style={{ margin: '40px 0' }}>
            <Link to="/calculator" style={{
              display: 'inline-block', padding: '14px 28px', borderRadius: 10, background: '#1D4ED8',
              color: '#FFFFFF', fontSize: 15, fontWeight: 500, textDecoration: 'none', fontFamily: F,
            }}>Calculate your savings →</Link>
          </div>

          <EmailCapture source="enterprise" />
        </div>
      </div>
    </PageShell>
  );
}
