import { useParams, Link, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PageShell from '../components/PageShell';
import SEOHead from '../components/SEOHead';
import EmailCapture from '../components/EmailCapture';
import { POST_BY_SLUG } from '../content/blog/posts';
import { C, F, M } from '../theme';

const SITE_URL = 'https://payapi.market';

const components = {
  h1: ({ node, ...p }) => <h1 style={{ margin: '0 0 16px', fontSize: 38, fontWeight: 800, color: C.t, fontFamily: F, lineHeight: 1.15 }} {...p} />,
  h2: ({ node, ...p }) => <h2 style={{ margin: '40px 0 14px', fontSize: 26, fontWeight: 800, color: C.t, fontFamily: F }} {...p} />,
  h3: ({ node, ...p }) => <h3 style={{ margin: '28px 0 10px', fontSize: 19, fontWeight: 700, color: C.ac, fontFamily: F }} {...p} />,
  p: ({ node, ...p }) => <p style={{ margin: '0 0 16px', fontSize: 16, color: C.tM, lineHeight: 1.75 }} {...p} />,
  ul: ({ node, ...p }) => <ul style={{ color: C.tM, fontSize: 16, lineHeight: 1.85, paddingLeft: 22, marginBottom: 16 }} {...p} />,
  ol: ({ node, ...p }) => <ol style={{ color: C.tM, fontSize: 16, lineHeight: 1.85, paddingLeft: 22, marginBottom: 16 }} {...p} />,
  li: ({ node, ...p }) => <li style={{ marginBottom: 4 }} {...p} />,
  strong: ({ node, ...p }) => <strong style={{ color: C.t, fontWeight: 700 }} {...p} />,
  a: ({ node, ...p }) => <a style={{ color: C.ac, textDecoration: 'underline' }} {...p} />,
  code: ({ node, inline, ...p }) => inline
    ? <code style={{ background: C.sf, padding: '2px 6px', borderRadius: 4, color: C.ac, fontFamily: M, fontSize: 14 }} {...p} />
    : <code style={{ display: 'block', background: C.sf, padding: '14px 18px', borderRadius: 10, color: C.ac, fontFamily: M, fontSize: 13, overflow: 'auto', border: `1px solid ${C.bd}` }} {...p} />,
  pre: ({ node, ...p }) => <pre style={{ margin: '0 0 18px' }} {...p} />,
  table: ({ node, ...p }) => (
    <div style={{ overflowX: 'auto', margin: '16px 0 22px' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14, color: C.tM }} {...p} />
    </div>
  ),
  th: ({ node, ...p }) => <th style={{ textAlign: 'left', padding: '10px 12px', borderBottom: `1px solid ${C.bd}`, color: C.t, fontWeight: 700, fontFamily: F, background: C.sf }} {...p} />,
  td: ({ node, ...p }) => <td style={{ padding: '10px 12px', borderBottom: `1px solid ${C.bd}` }} {...p} />,
  blockquote: ({ node, ...p }) => <blockquote style={{ margin: '0 0 18px', padding: '12px 18px', borderLeft: `3px solid ${C.ac}`, background: C.sf, color: C.t, borderRadius: 4 }} {...p} />,
};

export default function BlogPost() {
  const { slug } = useParams();
  const post = POST_BY_SLUG[slug];
  if (!post) return <Navigate to="/blog" replace />;

  const url = `${SITE_URL}/blog/${slug}`;
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated || post.date,
    author: { '@type': 'Person', name: post.author },
    publisher: { '@type': 'Organization', name: 'PayAPI Market', logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` } },
    mainEntityOfPage: url,
  };

  return (
    <PageShell>
      <SEOHead
        title={`${post.title} | PayAPI Market`}
        description={post.description}
        path={`/blog/${slug}`}
        type="Article"
        jsonLd={articleJsonLd}
      />
      <article style={{ maxWidth: 720, margin: '0 auto', padding: '60px 32px' }}>
        <Link to="/blog" style={{ fontSize: 13, color: C.ac, textDecoration: 'none', fontFamily: M }}>← Blog</Link>
        <div style={{ marginTop: 18, fontSize: 11, color: C.tD, fontFamily: M, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          By {post.author} · Last updated {new Date(post.updated || post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} · {post.readMin} min read
        </div>
        <h1 style={{ margin: '14px 0 28px', fontSize: 40, fontWeight: 800, color: C.t, fontFamily: F, lineHeight: 1.1 }}>
          {post.title}
        </h1>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>{post.body}</ReactMarkdown>

        <div style={{ borderTop: `1px solid ${C.bd}`, marginTop: 40, paddingTop: 24, fontSize: 13, color: C.tD }}>
          Written by <span style={{ color: C.t, fontWeight: 700 }}>{post.author}</span> · founder of PayAPI Market · April 7, 2026
        </div>

        <EmailCapture source={`blog-${slug}`} />
      </article>
    </PageShell>
  );
}
