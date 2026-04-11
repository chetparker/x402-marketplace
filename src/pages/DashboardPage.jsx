import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell';
import SEOHead from '../components/SEOHead';
import { C, F, M } from '../theme';
import {
  getSession, clearSession,
  getProviderById, getListingsByProvider, updateListing,
} from '../lib/store';

const STATUS_COLORS = {
  pending_review: '#F59E0B',
  live: '#10B981',
  rejected: '#EF4444',
  paused: C.tD,
};

function StatCard({ value, label }) {
  return (
    <div style={{ background: C.sf, border: `1px solid ${C.bd}`, borderRadius: 10, padding: '18px 16px', textAlign: 'center' }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: C.t, fontFamily: F }}>{value}</div>
      <div style={{ fontSize: 11, color: C.tD, marginTop: 4 }}>{label}</div>
    </div>
  );
}

function Dashboard({ provider, onLogout, stripeStatus }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    getListingsByProvider(provider.id).then(data => { setListings(data); setLoading(false); });
  }, [provider.id]);

  async function togglePause(listing) {
    const newStatus = listing.status === 'paused' ? 'live' : 'paused';
    await updateListing(listing.id, { status: newStatus });
    const refreshed = await getListingsByProvider(provider.id);
    setListings(refreshed);
  }

  async function handleUpgrade() {
    setUpgrading(true);
    try {
      const r = await fetch('/api/stripe-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: provider.email, provider_id: provider.id }),
      });
      const data = await r.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        console.error('[upgrade] no checkout url:', data);
        setUpgrading(false);
      }
    } catch (err) {
      console.error('[upgrade] error:', err);
      setUpgrading(false);
    }
  }

  const liveCount = listings.filter(l => l.status === 'live').length;

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 700, color: C.t, fontFamily: F }}>Dashboard</h1>
          <p style={{ margin: 0, fontSize: 13, color: C.tD }}>{provider.email} · {provider.tier} tier</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/list" style={{
            padding: '8px 16px', borderRadius: 8, border: `1px solid ${C.bd}`,
            background: 'transparent', color: C.tM, fontSize: 13, textDecoration: 'none', fontFamily: F,
          }}>+ Add API</Link>
          <button onClick={onLogout} style={{
            padding: '8px 16px', borderRadius: 8, border: `1px solid ${C.bd}`,
            background: 'transparent', color: C.tD, fontSize: 13, cursor: 'pointer', fontFamily: F,
          }}>Sign out</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
        <StatCard value="$0" label="Total revenue (USDC)" />
        <StatCard value="—" label="30d requests" />
        <StatCard value="—" label="Uptime" />
        <StatCard value={liveCount} label="Live APIs" />
      </div>

      {stripeStatus === 'success' && (
        <div style={{
          background: '#10B98115', border: '1px solid #10B981', borderRadius: 10,
          padding: '14px 18px', marginBottom: 16, fontSize: 13, color: '#10B981',
        }}>Payment received. Featured tier is now active. It may take a few seconds for the badge to appear.</div>
      )}
      {stripeStatus === 'cancelled' && (
        <div style={{
          background: '#F59E0B15', border: '1px solid #F59E0B', borderRadius: 10,
          padding: '14px 18px', marginBottom: 16, fontSize: 13, color: '#F59E0B',
        }}>Checkout cancelled. You can try upgrading again any time.</div>
      )}

      {provider.tier === 'free' && (
        <div style={{
          background: C.sf, border: `1px solid ${C.bd}`, borderRadius: 10,
          padding: '18px 22px', marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.t }}>Go Featured</div>
            <div style={{ fontSize: 13, color: C.tM, marginTop: 2 }}>$49/mo — priority placement, reduced 2.5% fee.</div>
          </div>
          <button onClick={handleUpgrade} disabled={upgrading} style={{
            padding: '8px 18px', borderRadius: 8, border: 'none',
            background: '#1D4ED8', color: '#FFFFFF', fontSize: 13, fontWeight: 500,
            cursor: upgrading ? 'wait' : 'pointer', fontFamily: F, opacity: upgrading ? 0.6 : 1,
          }}>{upgrading ? 'Loading...' : 'Go Featured'}</button>
        </div>
      )}

      <h2 style={{ margin: '0 0 14px', fontSize: 18, fontWeight: 600, color: C.t, fontFamily: F }}>My APIs</h2>
      {loading ? (
        <p style={{ color: C.tD }}>Loading...</p>
      ) : listings.length === 0 ? (
        <div style={{ background: C.sf, border: `1px solid ${C.bd}`, borderRadius: 10, padding: 32, textAlign: 'center' }}>
          <p style={{ margin: '0 0 12px', fontSize: 14, color: C.tM }}>No APIs listed yet.</p>
          <Link to="/list" style={{ color: '#3B82F6', fontSize: 14 }}>List your first API →</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {listings.map(l => (
            <div key={l.id} style={{ background: C.sf, border: `1px solid ${C.bd}`, borderRadius: 10, padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: C.t }}>{l.name}</div>
                  <div style={{ fontSize: 12, color: C.tD, marginTop: 2 }}>{l.category} · {l.endpoints_count} endpoints · ${l.price_min}–${l.price_max}/req</div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600,
                    color: STATUS_COLORS[l.status] || C.tD,
                    background: `${STATUS_COLORS[l.status] || C.tD}15`,
                  }}>{l.status.replace('_', ' ')}</span>
                  {(l.status === 'live' || l.status === 'paused') && (
                    <button onClick={() => togglePause(l)} style={{
                      padding: '4px 12px', borderRadius: 6, border: `1px solid ${C.bd}`,
                      background: 'transparent', color: C.tD, fontSize: 11, cursor: 'pointer', fontFamily: F,
                    }}>{l.status === 'paused' ? 'Unpause' : 'Pause'}</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [checking, setChecking] = useState(true);
  const [stripeStatus, setStripeStatus] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const id = getSession();
      if (!id) {
        navigate('/login', { replace: true });
        return;
      }

      const prov = await getProviderById(id);
      if (cancelled) return;

      if (!prov) {
        // Stored id doesn't resolve — stale localStorage. Clear and bounce.
        clearSession();
        navigate('/login', { replace: true });
        return;
      }

      setProvider(prov);
      setChecking(false);

      // Pull the Stripe redirect flag and clean it from the URL bar.
      const params = new URLSearchParams(window.location.search);
      const flag = params.get('stripe');
      if (flag === 'success' || flag === 'cancelled') {
        setStripeStatus(flag);
        window.history.replaceState({}, '', window.location.pathname);
      }

      // After Stripe success, the webhook may not have updated providers.tier
      // yet — there's a race between the browser redirect and Stripe's
      // server-to-server delivery. Poll a few times until we see 'featured'.
      if (flag === 'success' && prov.tier !== 'featured') {
        for (let i = 0; i < 6; i++) {
          await new Promise(r => setTimeout(r, 1500));
          if (cancelled) return;
          const fresh = await getProviderById(id);
          if (fresh?.tier === 'featured') {
            setProvider(fresh);
            return;
          }
          // Even if tier isn't flipped yet, refresh the object so any other
          // fields the webhook touched (e.g. stripe_customer_id) come through.
          if (fresh) setProvider(fresh);
        }
      }
    }

    init();
    return () => { cancelled = true; };
  }, [navigate]);

  function handleLogout() {
    clearSession();
    setProvider(null);
    navigate('/login', { replace: true });
  }

  if (checking) {
    return (
      <PageShell>
        <div style={{ padding: 80, textAlign: 'center', color: C.tD }}>Loading...</div>
      </PageShell>
    );
  }

  if (!provider) {
    // Safety net — useEffect should have already navigated away.
    return null;
  }

  return (
    <PageShell>
      <SEOHead title="Provider Dashboard — PayAPI Market" path="/dashboard" noindex />
      <Dashboard provider={provider} onLogout={handleLogout} stripeStatus={stripeStatus} />
    </PageShell>
  );
}
