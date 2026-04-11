import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell';
import SEOHead from '../components/SEOHead';
import { C, F } from '../theme';
import { getProviderByEmail, setSession, getSession } from '../lib/store';

const inputStyle = {
  width: '100%', background: C.sf, border: `1px solid ${C.bd}`, borderRadius: 8,
  padding: '10px 14px', color: C.t, fontSize: 14, outline: 'none', fontFamily: F,
  boxSizing: 'border-box',
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // If already logged in, jump straight to the dashboard.
  useEffect(() => {
    if (getSession()) navigate('/dashboard', { replace: true });
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const prov = await getProviderByEmail(email.trim().toLowerCase());
      if (!prov) {
        setError('No account found with that email.');
        setLoading(false);
        return;
      }
      setSession(prov.id);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('[login] error:', err);
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  }

  return (
    <PageShell>
      <SEOHead title="Provider Login — PayAPI Market" path="/login" noindex />
      <div style={{ maxWidth: 400, margin: '0 auto', padding: '80px 32px', textAlign: 'center' }}>
        <h1 style={{ margin: '0 0 8px', fontSize: 24, fontWeight: 700, color: C.t, fontFamily: F }}>Log in</h1>
        <p style={{ margin: '0 0 28px', fontSize: 14, color: C.tM }}>
          Enter the email you used when listing your API.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            style={{ ...inputStyle, marginBottom: 12 }}
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@company.com"
            autoFocus
            required
          />
          <button
            type="submit"
            disabled={loading || !email}
            style={{
              width: '100%', padding: '11px 0', borderRadius: 8, border: 'none',
              background: '#1D4ED8', color: '#FFFFFF', fontSize: 14, fontWeight: 600,
              cursor: loading ? 'wait' : 'pointer', fontFamily: F,
              opacity: loading || !email ? 0.6 : 1,
            }}
          >
            {loading ? 'Looking up…' : 'Continue'}
          </button>
        </form>
        {error && (
          <p style={{ margin: '14px 0 0', fontSize: 13, color: '#EF4444' }}>{error}</p>
        )}
        <p style={{ marginTop: 22, fontSize: 13, color: C.tD }}>
          Don't have an account?{' '}
          <Link to="/list" style={{ color: '#3B82F6' }}>List your API →</Link>
        </p>
        <p style={{ marginTop: 14, fontSize: 11, color: C.tD, lineHeight: 1.5 }}>
          Email-only lookup. Magic links and OAuth coming later.
        </p>
      </div>
    </PageShell>
  );
}
