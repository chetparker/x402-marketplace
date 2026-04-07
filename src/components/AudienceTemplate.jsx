import { Link } from 'react-router-dom';
import PageShell from './PageShell';
import SEOHead from './SEOHead';
import EmailCapture from './EmailCapture';
import { C, F, M } from '../theme';

export default function AudienceTemplate({
  seo,
  eyebrow,
  headline,
  sub,
  primaryCta,
  bullets,
  sections,
  source,
}) {
  return (
    <PageShell>
      <SEOHead {...seo} />
      <div style={{ padding: '60px 32px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ fontSize: 12, color: C.ac, fontFamily: M, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>{eyebrow}</div>
          <h1 style={{ margin: '0 0 18px', fontSize: 46, fontWeight: 800, color: C.t, fontFamily: F, lineHeight: 1.08 }}>{headline}</h1>
          <p style={{ margin: '0 0 28px', fontSize: 18, color: C.tM, lineHeight: 1.55 }}>{sub}</p>

          <div style={{ display: 'flex', gap: 12, marginBottom: 40, flexWrap: 'wrap' }}>
            <Link to={primaryCta.to} style={{
              padding: '14px 28px',
              borderRadius: 10,
              background: C.ac,
              color: C.bg,
              fontSize: 15,
              fontWeight: 700,
              textDecoration: 'none',
              fontFamily: F,
            }}>{primaryCta.label} →</Link>
            <Link to="/pricing" style={{
              padding: '14px 28px',
              borderRadius: 10,
              background: 'transparent',
              border: `1px solid ${C.bd}`,
              color: C.tM,
              fontSize: 15,
              fontWeight: 600,
              textDecoration: 'none',
              fontFamily: F,
            }}>See pricing</Link>
          </div>

          <div style={{
            background: C.sf,
            border: `1px solid ${C.bd}`,
            borderRadius: 14,
            padding: '24px 28px',
            marginBottom: 48,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 18,
          }}>
            {bullets.map((b, i) => (
              <div key={i}>
                <div style={{ fontSize: 22, fontWeight: 800, color: C.gn, fontFamily: M, marginBottom: 4 }}>{b.value}</div>
                <div style={{ fontSize: 13, color: C.tM, lineHeight: 1.5 }}>{b.label}</div>
              </div>
            ))}
          </div>

          {sections.map((s, i) => (
            <section key={i} style={{ marginBottom: 36 }}>
              <h2 style={{ margin: '0 0 12px', fontSize: 26, fontWeight: 800, color: C.t, fontFamily: F }}>{s.title}</h2>
              {s.body.split('\n\n').map((p, j) => (
                <p key={j} style={{ margin: '0 0 14px', fontSize: 15, color: C.tM, lineHeight: 1.7 }}>{p}</p>
              ))}
              {s.list && (
                <ul style={{ color: C.tM, fontSize: 15, lineHeight: 1.8, paddingLeft: 22 }}>
                  {s.list.map((li, k) => <li key={k}>{li}</li>)}
                </ul>
              )}
            </section>
          ))}

          <EmailCapture source={source} />
        </div>
      </div>
    </PageShell>
  );
}
