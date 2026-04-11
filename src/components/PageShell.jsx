import { Link } from 'react-router-dom';
import { C, F, M } from '../theme';

const NAV = [
  { to: '/', label: 'Marketplace' },
  { to: '/providers', label: 'Providers' },
  { to: '/agents', label: 'Agents' },
  { to: '/enterprises', label: 'Enterprises' },
  { to: '/calculator', label: 'Calculator' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/blog', label: 'Blog' },
  { to: '/about', label: 'About' },
];

function Header() {
  return (
    <div style={{ borderBottom: `1px solid ${C.bd}`, padding: '20px 32px', position: 'relative', zIndex: 2 }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'baseline', gap: 8, textDecoration: 'none' }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: C.ac, fontFamily: M }}>payapi</span>
          <span style={{ fontSize: 16, fontWeight: 300, color: C.tM }}>market</span>
        </Link>
        <nav style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
          {NAV.map(n => (
            <Link
              key={n.to}
              to={n.to}
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                fontSize: 13,
                color: C.tM,
                textDecoration: 'none',
                fontFamily: F,
                fontWeight: 500,
              }}
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/login"
            style={{
              marginLeft: 6,
              padding: '8px 16px',
              borderRadius: 8,
              border: `1px solid ${C.bd}`,
              fontSize: 13,
              color: C.t,
              textDecoration: 'none',
              fontFamily: F,
              fontWeight: 600,
            }}
          >
            Log in
          </Link>
        </nav>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div style={{ borderTop: `1px solid ${C.bd}`, padding: '32px', marginTop: 60, position: 'relative', zIndex: 2 }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.ac, fontFamily: M, marginBottom: 8 }}>payapi.market</div>
          <div style={{ fontSize: 12, color: C.tD, lineHeight: 1.6 }}>The marketplace for x402 APIs. Built for the agent economy.</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: C.tD, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 8 }}>Product</div>
          {[['/', 'Marketplace'], ['/calculator', 'Revenue Calculator'], ['/pricing', 'Pricing'], ['/login', 'Log in']].map(([to, l]) => (
            <Link key={to} to={to} style={{ display: 'block', fontSize: 13, color: C.tM, textDecoration: 'none', padding: '3px 0' }}>{l}</Link>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 11, color: C.tD, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 8 }}>Audiences</div>
          {[['/providers', 'Providers'], ['/agents', 'Agents'], ['/developers', 'Developers'], ['/enterprises', 'Enterprises']].map(([to, l]) => (
            <Link key={to} to={to} style={{ display: 'block', fontSize: 13, color: C.tM, textDecoration: 'none', padding: '3px 0' }}>{l}</Link>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 11, color: C.tD, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 8 }}>Resources</div>
          {[['/blog', 'Blog'], ['/about', 'About']].map(([to, l]) => (
            <Link key={to} to={to} style={{ display: 'block', fontSize: 13, color: C.tM, textDecoration: 'none', padding: '3px 0' }}>{l}</Link>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: 1120, margin: '24px auto 0', borderTop: `1px solid ${C.bd}`, paddingTop: 16, fontSize: 11, color: C.tD, fontFamily: M }}>
        © 2026 PayAPI Market · built by Chet Parker
      </div>
    </div>
  );
}

export default function PageShell({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.t, fontFamily: F, position: 'relative', overflow: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ position: 'absolute', inset: '0 0 auto 0', height: 600, background: 'radial-gradient(ellipse at 50% 0%, rgba(0,212,255,0.03) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 1 }} />
      <Header />
      <main style={{ position: 'relative', zIndex: 2 }}>{children}</main>
      <Footer />
    </div>
  );
}
