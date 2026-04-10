import { Link } from 'react-router-dom';
import PageShell from '../components/PageShell';
import SEOHead from '../components/SEOHead';
import EmailCapture from '../components/EmailCapture';
import { PUBLISHED_POSTS } from '../content/blog/posts';
import { C, F, M } from '../theme';

export default function BlogIndex() {
  return (
    <PageShell>
      <SEOHead page="blog" />
      <div style={{ padding: '60px 32px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ fontSize: 12, color: C.ac, fontFamily: M, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Blog</div>
          <h1 style={{ margin: '0 0 12px', fontSize: 42, fontWeight: 800, color: C.t, fontFamily: F, lineHeight: 1.1 }}>
            x402, MCP & the agent economy
          </h1>
          <p style={{ margin: '0 0 40px', fontSize: 17, color: C.tM, lineHeight: 1.55 }}>
            Guides, tutorials and analysis on building, listing and monetising APIs for AI agents.
          </p>

          <div style={{ display: 'grid', gap: 16 }}>
            {PUBLISHED_POSTS.map(p => (
              <Link
                key={p.slug}
                to={`/blog/${p.slug}`}
                style={{
                  display: 'block',
                  background: C.sf,
                  border: `1px solid ${C.bd}`,
                  borderRadius: 14,
                  padding: '24px 28px',
                  textDecoration: 'none',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', gap: 10, marginBottom: 8, fontSize: 11, color: C.tD, fontFamily: M, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  <span>{p.date}</span>
                  <span>·</span>
                  <span>{p.readMin} min read</span>
                  <span>·</span>
                  <span>by {p.author}</span>
                </div>
                <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 800, color: C.t, fontFamily: F, lineHeight: 1.25 }}>{p.title}</h2>
                <p style={{ margin: 0, fontSize: 14, color: C.tM, lineHeight: 1.6 }}>{p.description}</p>
                <div style={{ marginTop: 12, fontSize: 12, color: C.ac, fontWeight: 600 }}>Read →</div>
              </Link>
            ))}
          </div>

          <EmailCapture source="blog-index" />
        </div>
      </div>
    </PageShell>
  );
}
