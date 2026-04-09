import { useState, useEffect } from 'react';
import PageShell from '../components/PageShell';
import SEOHead from '../components/SEOHead';
import { C, F, M } from '../theme';
import {
  getAllProviders, getAllListings,
  updateListing, updateProvider, getProviderById,
} from '../lib/store';
import { notifyProviderApproved, notifyProviderRejected } from '../lib/notify';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'payapi2026';

const STATUS_COLORS = {
  pending_review: '#F59E0B',
  live: '#10B981',
  rejected: '#EF4444',
  paused: '#6B7280',
  pending: '#F59E0B',
  approved: '#10B981',
  suspended: '#EF4444',
};

function PasswordGate({ onAuth }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem('payapi_admin', '1');
      onAuth();
    } else {
      setErr(true);
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: '0 auto', padding: '100px 32px', textAlign: 'center' }}>
      <h1 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 700, color: C.t, fontFamily: F }}>Admin</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password" value={pw} onChange={e => { setPw(e.target.value); setErr(false); }}
          placeholder="Password"
          style={{
            width: '100%', background: C.sf, border: `1px solid ${err ? '#EF4444' : C.bd}`,
            borderRadius: 8, padding: '10px 14px', color: C.t, fontSize: 14, outline: 'none',
            fontFamily: F, boxSizing: 'border-box', marginBottom: 12,
          }}
        />
        <button type="submit" style={{
          width: '100%', padding: '10px 0', borderRadius: 8, border: 'none',
          background: '#1D4ED8', color: '#FFFFFF', fontSize: 14, fontWeight: 500,
          cursor: 'pointer', fontFamily: F,
        }}>Sign in</button>
      </form>
      {err && <p style={{ margin: '10px 0 0', fontSize: 13, color: '#EF4444' }}>Wrong password.</p>}
    </div>
  );
}

function StatusPill({ status }) {
  const color = STATUS_COLORS[status] || '#6B7280';
  return (
    <span style={{
      padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600,
      color, background: `${color}15`, whiteSpace: 'nowrap',
    }}>{(status || 'unknown').replace(/_/g, ' ')}</span>
  );
}

function ListingCard({ listing, onApprove, onReject, onTogglePause }) {
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState('');
  // Provider data comes from the Supabase join: listing.providers
  const prov = listing.providers || {};

  return (
    <div style={{ background: C.sf, border: `1px solid ${C.bd}`, borderRadius: 10, padding: '18px 22px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, color: C.t }}>{listing.name}</div>
          <div style={{ fontSize: 12, color: C.tD, marginTop: 2 }}>
            by {prov.name || '?'} ({prov.email || '?'}) · {listing.category} · {listing.endpoints_count} endpoints
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <StatusPill status={listing.status} />
          <span style={{ fontSize: 11, color: C.tD }}>{new Date(listing.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      {listing.description && (
        <div style={{ fontSize: 13, color: C.tM, marginBottom: 8, lineHeight: 1.5 }}>{listing.description}</div>
      )}

      <div style={{ fontSize: 12, color: C.tD, marginBottom: 12 }}>
        URL: <a href={listing.base_url} target="_blank" rel="noopener" style={{ color: '#3B82F6' }}>{listing.base_url}</a>
        {listing.mcp_endpoint && <> · MCP: <a href={listing.mcp_endpoint} target="_blank" rel="noopener" style={{ color: '#3B82F6' }}>{listing.mcp_endpoint}</a></>}
        {prov.wallet_address && <> · Wallet: <span style={{ fontFamily: M }}>{prov.wallet_address.slice(0, 10)}…</span></>}
        <> · ${listing.price_min}–${listing.price_max}/req</>
      </div>

      {showReject ? (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            value={reason} onChange={e => setReason(e.target.value)}
            placeholder="Rejection reason"
            style={{ flex: 1, background: C.bg, border: `1px solid ${C.bd}`, borderRadius: 6, padding: '6px 10px', color: C.t, fontSize: 13, outline: 'none', fontFamily: F }}
          />
          <button onClick={() => { onReject(listing.id, reason); setShowReject(false); setReason(''); }} style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: '#EF4444', color: '#FFF', fontSize: 12, cursor: 'pointer', fontFamily: F }}>Reject</button>
          <button onClick={() => setShowReject(false)} style={{ padding: '6px 14px', borderRadius: 6, border: `1px solid ${C.bd}`, background: 'transparent', color: C.tD, fontSize: 12, cursor: 'pointer', fontFamily: F }}>Cancel</button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 8 }}>
          {listing.status === 'pending_review' && (
            <>
              <button onClick={() => onApprove(listing.id)} style={{ padding: '6px 16px', borderRadius: 6, border: 'none', background: '#10B981', color: '#FFF', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: F }}>Approve</button>
              <button onClick={() => setShowReject(true)} style={{ padding: '6px 16px', borderRadius: 6, border: `1px solid ${C.bd}`, background: 'transparent', color: '#EF4444', fontSize: 12, cursor: 'pointer', fontFamily: F }}>Reject</button>
            </>
          )}
          {(listing.status === 'live' || listing.status === 'paused') && (
            <button onClick={() => onTogglePause(listing.id, listing.status)} style={{ padding: '6px 16px', borderRadius: 6, border: `1px solid ${C.bd}`, background: 'transparent', color: listing.status === 'paused' ? '#10B981' : '#F59E0B', fontSize: 12, cursor: 'pointer', fontFamily: F }}>
              {listing.status === 'paused' ? 'Unpause' : 'Pause'}
            </button>
          )}
          <a href={`${listing.base_url}/health`} target="_blank" rel="noopener" style={{ padding: '6px 16px', borderRadius: 6, border: `1px solid ${C.bd}`, background: 'transparent', color: C.tD, fontSize: 12, textDecoration: 'none', fontFamily: F, display: 'inline-flex', alignItems: 'center' }}>Test /health</a>
        </div>
      )}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div style={{ background: C.sf, border: `1px solid ${C.bd}`, borderRadius: 10, padding: 32, textAlign: 'center' }}>
      <p style={{ margin: 0, fontSize: 14, color: C.tD }}>{message}</p>
    </div>
  );
}

function AdminPanel() {
  const [tab, setTab] = useState('pending');
  const [listings, setListings] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function refresh() {
    try {
      const [l, p] = await Promise.all([getAllListings(), getAllProviders()]);
      console.log('[admin] listings:', l?.length, 'providers:', p?.length);
      setListings(l || []);
      setProviders(p || []);
      setError(null);
    } catch (e) {
      console.error('[admin] refresh error:', e);
      setError(e.message);
    }
    setLoading(false);
  }

  useEffect(() => { refresh(); }, []);

  async function handleApprove(id) {
    try {
      const listing = await updateListing(id, { status: 'live' });
      if (listing) {
        const prov = await getProviderById(listing.provider_id);
        if (prov) {
          await updateProvider(prov.id, { status: 'approved' });
          notifyProviderApproved(prov, listing);
        }
      }
    } catch (e) { console.error('[admin] approve error:', e); }
    await refresh();
  }

  async function handleReject(id, reason) {
    try {
      const listing = await updateListing(id, { status: 'rejected' });
      if (listing) {
        const prov = await getProviderById(listing.provider_id);
        if (prov) notifyProviderRejected(prov, listing, reason);
      }
    } catch (e) { console.error('[admin] reject error:', e); }
    await refresh();
  }

  async function handleTogglePause(id, currentStatus) {
    await updateListing(id, { status: currentStatus === 'paused' ? 'live' : 'paused' });
    await refresh();
  }

  async function handleToggleSuspend(provId) {
    const prov = providers.find(p => p.id === provId);
    if (!prov) return;
    await updateProvider(provId, { status: prov.status === 'suspended' ? 'approved' : 'suspended' });
    await refresh();
  }

  const pending = listings.filter(l => l.status === 'pending_review');
  const live = listings.filter(l => l.status === 'live');
  const other = listings.filter(l => !['pending_review', 'live'].includes(l.status));

  const tabStyle = (active) => ({
    padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
    background: active ? 'rgba(59,130,246,0.10)' : 'transparent',
    color: active ? '#3B82F6' : C.tD, fontSize: 13, fontWeight: 500, fontFamily: F,
  });

  if (loading) return <div style={{ padding: 80, textAlign: 'center', color: C.tD }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 32px' }}>
      <h1 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 700, color: C.t, fontFamily: F }}>Admin Panel</h1>
      <p style={{ margin: '0 0 24px', fontSize: 13, color: C.tD }}>
        {providers.length} providers · {listings.length} listings · {pending.length} pending · {live.length} live
      </p>

      {error && (
        <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <p style={{ margin: 0, fontSize: 13, color: '#EF4444' }}>Error: {error}</p>
        </div>
      )}

      <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
        <button onClick={() => setTab('pending')} style={tabStyle(tab === 'pending')}>
          Pending {pending.length > 0 ? `(${pending.length})` : ''}
        </button>
        <button onClick={() => setTab('live')} style={tabStyle(tab === 'live')}>
          Live {live.length > 0 ? `(${live.length})` : ''}
        </button>
        <button onClick={() => setTab('all')} style={tabStyle(tab === 'all')}>All Listings ({listings.length})</button>
        <button onClick={() => setTab('providers')} style={tabStyle(tab === 'providers')}>Providers ({providers.length})</button>
      </div>

      {/* Pending tab */}
      {tab === 'pending' && (
        pending.length === 0
          ? <EmptyState message="No pending reviews. Listings submitted via /list will appear here." />
          : <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pending.map(l => <ListingCard key={l.id} listing={l} onApprove={handleApprove} onReject={handleReject} onTogglePause={handleTogglePause} />)}
            </div>
      )}

      {/* Live tab */}
      {tab === 'live' && (
        live.length === 0
          ? <EmptyState message="No live listings yet. Approve pending listings to make them live." />
          : <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {live.map(l => <ListingCard key={l.id} listing={l} onApprove={handleApprove} onReject={handleReject} onTogglePause={handleTogglePause} />)}
            </div>
      )}

      {/* All listings tab */}
      {tab === 'all' && (
        listings.length === 0
          ? <EmptyState message="No listings in the database yet." />
          : <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {listings.map(l => <ListingCard key={l.id} listing={l} onApprove={handleApprove} onReject={handleReject} onTogglePause={handleTogglePause} />)}
            </div>
      )}

      {/* Providers tab */}
      {tab === 'providers' && (
        providers.length === 0
          ? <EmptyState message="No providers have signed up yet." />
          : <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {providers.map(p => (
                <div key={p.id} style={{ background: C.sf, border: `1px solid ${C.bd}`, borderRadius: 8, padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: 14, color: C.t, fontWeight: 500 }}>{p.name}</span>
                    <span style={{ fontSize: 12, color: C.tD, marginLeft: 10 }}>
                      {p.email} · {p.tier} · {listings.filter(l => l.provider_id === p.id).length} listings
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <StatusPill status={p.status} />
                    <button onClick={() => handleToggleSuspend(p.id)} style={{
                      padding: '4px 12px', borderRadius: 6, border: `1px solid ${C.bd}`,
                      background: 'transparent', color: p.status === 'suspended' ? '#10B981' : '#EF4444',
                      fontSize: 11, cursor: 'pointer', fontFamily: F,
                    }}>{p.status === 'suspended' ? 'Unsuspend' : 'Suspend'}</button>
                  </div>
                </div>
              ))}
            </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('payapi_admin') === '1');

  return (
    <PageShell>
      <SEOHead title="Admin — PayAPI Market" path="/admin" noindex />
      {authed ? <AdminPanel /> : <PasswordGate onAuth={() => setAuthed(true)} />}
    </PageShell>
  );
}
